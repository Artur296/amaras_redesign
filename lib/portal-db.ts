import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import os from "os";
import { hashPortalPassword } from "./portal-auth";
import { commitFiles, githubConfig } from "./github";

export type PortalUser = {
  id: string;
  username: string; // unique lowercase
  fullName: string;
  phone: string;
  passwordHash: string;
  role: "admin" | "employee";
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
};

export type PortalClient = {
  id: string;
  clientNumber: number;
  clientName: string;
  phone1: string; // WhatsApp
  phone2: string; // WhatsApp / Telegram
  tourTitle: string;
  tourDate: string;
  guestsAdults: number;
  guestsChildren: number;
  comments: string;
  createdByUserId: string;
  createdByUserName: string;
  createdAt: string;
  updatedAt?: string;
  updatedByUserId?: string;
  updatedByUserName?: string;
};

// Global in-memory cache to maintain state across serverless invocations
declare global {
  // eslint-disable-next-line no-var
  var __portalClients: PortalClient[] | undefined;
  // eslint-disable-next-line no-var
  var __portalUsers: PortalUser[] | undefined;
}

function getTmpDirPath(): string {
  try {
    if (process.platform === "win32") {
      return path.join(os.tmpdir(), "amaras_portal");
    }
    return path.join("/tmp", "amaras_portal");
  } catch {
    return path.join(os.tmpdir(), "amaras_portal");
  }
}

/**
 * Read JSON file safely checking in-memory, /tmp, GitHub, and local content directory
 */
async function readJsonFile<T>(filename: "portal_clients.json" | "portal_users.json"): Promise<T[]> {
  // 1. Check in-memory global state
  if (filename === "portal_clients.json" && Array.isArray(globalThis.__portalClients)) {
    return globalThis.__portalClients as unknown as T[];
  }
  if (filename === "portal_users.json" && Array.isArray(globalThis.__portalUsers)) {
    return globalThis.__portalUsers as unknown as T[];
  }

  // 2. Check /tmp filesystem
  try {
    const tmpPath = path.join(getTmpDirPath(), filename);
    if (fsSync.existsSync(/*turbopackIgnore: true*/ tmpPath)) {
      const raw = await fs.readFile(/*turbopackIgnore: true*/ tmpPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        if (filename === "portal_clients.json") globalThis.__portalClients = parsed;
        if (filename === "portal_users.json") globalThis.__portalUsers = parsed;
        return parsed;
      }
    }
  } catch {}

  // 3. Check remote GitHub content if available
  const cfg = githubConfig();
  if (cfg) {
    try {
      const ghRes = await fetch(
        `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/content/${filename}`,
        {
          headers: {
            Authorization: `Bearer ${cfg.token}`,
            Accept: "application/vnd.github.raw",
            "X-GitHub-Api-Version": "2022-11-28",
          },
          cache: "no-store",
        }
      );
      if (ghRes.ok) {
        const ghData = await ghRes.json();
        if (Array.isArray(ghData)) {
          if (filename === "portal_clients.json") globalThis.__portalClients = ghData;
          if (filename === "portal_users.json") globalThis.__portalUsers = ghData;
          return ghData;
        }
      }
    } catch {}
  }

  // 4. Check project content directory (seed file / local dev)
  try {
    const localPath = path.join(process.cwd(), "content", filename);
    if (fsSync.existsSync(localPath)) {
      const raw = await fs.readFile(localPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        if (filename === "portal_clients.json") globalThis.__portalClients = parsed;
        if (filename === "portal_users.json") globalThis.__portalUsers = parsed;
        return parsed;
      }
    }
  } catch {}

  return [];
}

/**
 * Write JSON file safely supporting Vercel serverless (never throwing EROFS) and persisting to GitHub
 */
async function writeJsonFile<T>(filename: "portal_clients.json" | "portal_users.json", data: T[]): Promise<void> {
  // 1. Immediately update in-memory global state (instant UI response)
  if (filename === "portal_clients.json") {
    globalThis.__portalClients = data as unknown as PortalClient[];
  } else if (filename === "portal_users.json") {
    globalThis.__portalUsers = data as unknown as PortalUser[];
  }

  // 2. Write to writable /tmp directory
  try {
    const tmpDir = getTmpDirPath();
    await fs.mkdir(tmpDir, { recursive: true });
    await fs.writeFile(/*turbopackIgnore: true*/ path.join(tmpDir, filename), JSON.stringify(data, null, 2), "utf-8");
  } catch (tmpErr) {
    console.warn(`Failed writing to /tmp for ${filename}:`, tmpErr);
  }

  // 3. Try writing to local project directory (allowed locally, safely ignored on Vercel EROFS)
  try {
    const contentDir = path.join(process.cwd(), "content");
    await fs.mkdir(contentDir, { recursive: true });
    await fs.writeFile(path.join(contentDir, filename), `${JSON.stringify(data, null, 2)}\n`, "utf-8");
  } catch {
    // Silently ignore EROFS on read-only cloud environments
  }

  // 4. Asynchronously commit to GitHub for permanent cloud persistence
  const cfg = githubConfig();
  if (cfg) {
    try {
      await commitFiles(
        cfg,
        [
          {
            path: `content/${filename}`,
            content: `${JSON.stringify(data, null, 2)}\n`,
          },
        ],
        `portal: update ${filename}`
      );
    } catch (ghErr) {
      console.warn(`GitHub sync error for ${filename}:`, ghErr);
    }
  }
}

// ================= USER OPERATIONS =================

export async function getPortalUsers(): Promise<PortalUser[]> {
  return readJsonFile<PortalUser>("portal_users.json");
}

export async function getPortalUserByUsername(username: string): Promise<PortalUser | null> {
  const users = await getPortalUsers();
  const clean = username.trim().toLowerCase();
  return users.find((u) => u.username.toLowerCase() === clean) || null;
}

export async function getPortalUserById(id: string): Promise<PortalUser | null> {
  const users = await getPortalUsers();
  return users.find((u) => u.id === id) || null;
}

export async function createPortalEmployee(params: {
  fullName: string;
  username: string;
  password: string;
  phone: string;
}): Promise<{ user?: PortalUser; error?: string }> {
  const cleanUsername = params.username.trim().toLowerCase();
  if (cleanUsername.length < 3) {
    return { error: "Логин должен быть не менее 3 символов" };
  }
  if (cleanUsername === "admin") {
    return { error: "Имя admin зарезервировано для администратора" };
  }
  if (!params.password || params.password.length < 6) {
    return { error: "Пароль должен быть не менее 6 символов" };
  }
  if (!params.fullName.trim()) {
    return { error: "Укажите имя и фамилию сотрудника" };
  }

  const users = await getPortalUsers();
  if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
    return { error: "Пользователь с таким логином уже зарегистрирован" };
  }

  const newUser: PortalUser = {
    id: `emp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    username: cleanUsername,
    fullName: params.fullName.trim(),
    phone: params.phone.trim(),
    passwordHash: hashPortalPassword(params.password),
    role: "employee",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeJsonFile("portal_users.json", users);
  return { user: newUser };
}

export async function updatePortalUserStatus(
  id: string,
  status: "approved" | "rejected",
  adminName: string
): Promise<PortalUser | null> {
  const users = await getPortalUsers();
  const user = users.find((u) => u.id === id);
  if (!user) return null;

  user.status = status;
  user.approvedAt = new Date().toISOString();
  user.approvedBy = adminName;

  await writeJsonFile("portal_users.json", users);
  return user;
}

export async function deletePortalUser(id: string): Promise<boolean> {
  const users = await getPortalUsers();
  const next = users.filter((u) => u.id !== id);
  if (next.length === users.length) return false;
  await writeJsonFile("portal_users.json", next);
  return true;
}

// ================= CLIENT OPERATIONS =================

export async function getPortalClients(): Promise<PortalClient[]> {
  const clients = await readJsonFile<PortalClient>("portal_clients.json");
  return clients.sort((a, b) => b.clientNumber - a.clientNumber);
}

export async function createPortalClient(
  data: {
    clientName: string;
    phone1: string;
    phone2?: string;
    tourTitle: string;
    tourDate: string;
    guestsAdults?: number;
    guestsChildren?: number;
    comments?: string;
  },
  author: { id: string; fullName: string }
): Promise<PortalClient> {
  const clients = await readJsonFile<PortalClient>("portal_clients.json");
  const maxNumber = clients.reduce((max, c) => Math.max(max, c.clientNumber || 0), 0);

  const newClient: PortalClient = {
    id: `client-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    clientNumber: maxNumber + 1,
    clientName: data.clientName.trim(),
    phone1: data.phone1.trim(),
    phone2: (data.phone2 || "").trim(),
    tourTitle: data.tourTitle.trim(),
    tourDate: data.tourDate.trim(),
    guestsAdults: Number(data.guestsAdults) || 1,
    guestsChildren: Number(data.guestsChildren) || 0,
    comments: (data.comments || "").trim(),
    createdByUserId: author.id,
    createdByUserName: author.fullName,
    createdAt: new Date().toISOString(),
  };

  clients.unshift(newClient);
  await writeJsonFile("portal_clients.json", clients);
  return newClient;
}

export async function updatePortalClient(
  id: string,
  data: Partial<Omit<PortalClient, "id" | "clientNumber" | "createdByUserId" | "createdByUserName" | "createdAt">>,
  admin: { id: string; fullName: string }
): Promise<PortalClient | null> {
  const clients = await readJsonFile<PortalClient>("portal_clients.json");
  const client = clients.find((c) => c.id === id);
  if (!client) return null;

  if (data.clientName !== undefined) client.clientName = data.clientName.trim();
  if (data.phone1 !== undefined) client.phone1 = data.phone1.trim();
  if (data.phone2 !== undefined) client.phone2 = data.phone2.trim();
  if (data.tourTitle !== undefined) client.tourTitle = data.tourTitle.trim();
  if (data.tourDate !== undefined) client.tourDate = data.tourDate.trim();
  if (data.guestsAdults !== undefined) client.guestsAdults = Number(data.guestsAdults) || 1;
  if (data.guestsChildren !== undefined) client.guestsChildren = Number(data.guestsChildren) || 0;
  if (data.comments !== undefined) client.comments = data.comments.trim();

  client.updatedAt = new Date().toISOString();
  client.updatedByUserId = admin.id;
  client.updatedByUserName = admin.fullName;

  await writeJsonFile("portal_clients.json", clients);
  return client;
}

export async function deletePortalClient(id: string): Promise<boolean> {
  const clients = await readJsonFile<PortalClient>("portal_clients.json");
  const next = clients.filter((c) => c.id !== id);
  if (next.length === clients.length) return false;
  await writeJsonFile("portal_clients.json", next);
  return true;
}
