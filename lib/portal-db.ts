import fs from "fs/promises";
import path from "path";
import { hashPortalPassword } from "./portal-auth";

const USERS_FILE = path.join(process.cwd(), "content", "portal_users.json");
const CLIENTS_FILE = path.join(process.cwd(), "content", "portal_clients.json");

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

/**
 * Read JSON file safely, fallback to empty array if missing
 */
async function readJsonFile<T>(filePath: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Write JSON file atomically
 */
async function writeJsonFile<T>(filePath: string, data: T[]): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// ================= USER OPERATIONS =================

export async function getPortalUsers(): Promise<PortalUser[]> {
  return readJsonFile<PortalUser>(USERS_FILE);
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
  await writeJsonFile(USERS_FILE, users);
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

  await writeJsonFile(USERS_FILE, users);
  return user;
}

export async function deletePortalUser(id: string): Promise<boolean> {
  const users = await getPortalUsers();
  const next = users.filter((u) => u.id !== id);
  if (next.length === users.length) return false;
  await writeJsonFile(USERS_FILE, next);
  return true;
}

// ================= CLIENT OPERATIONS =================

export async function getPortalClients(): Promise<PortalClient[]> {
  const clients = await readJsonFile<PortalClient>(CLIENTS_FILE);
  // Sort latest first
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
  const clients = await readJsonFile<PortalClient>(CLIENTS_FILE);
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
  await writeJsonFile(CLIENTS_FILE, clients);
  return newClient;
}

export async function updatePortalClient(
  id: string,
  data: Partial<Omit<PortalClient, "id" | "clientNumber" | "createdByUserId" | "createdByUserName" | "createdAt">>,
  admin: { id: string; fullName: string }
): Promise<PortalClient | null> {
  const clients = await readJsonFile<PortalClient>(CLIENTS_FILE);
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

  await writeJsonFile(CLIENTS_FILE, clients);
  return client;
}

export async function deletePortalClient(id: string): Promise<boolean> {
  const clients = await readJsonFile<PortalClient>(CLIENTS_FILE);
  const next = clients.filter((c) => c.id !== id);
  if (next.length === clients.length) return false;
  await writeJsonFile(CLIENTS_FILE, next);
  return true;
}
