// Writes site content back into this repository. Committing is what
// "publishing" means now: Vercel sees the push and redeploys, which is the
// only thing that makes an edit go live.
//
// All files in one publish go into a single commit (the Git Data API), so
// one save is one deploy rather than one deploy per field.

// Overridable for GitHub Enterprise, and so the commit sequence can be
// exercised against a stub in tests.
const API = process.env.GITHUB_API_URL || "https://api.github.com";

export type CommitFile = {
  path: string;
  /** UTF-8 text, or base64 when `encoding` is "base64". */
  content: string;
  encoding?: "utf-8" | "base64";
};

export type GitHubConfig = {
  token: string;
  owner: string;
  repo: string;
  branch: string;
};

export function githubConfig(): GitHubConfig | null {
  const token = process.env.GITHUB_TOKEN;
  const slug = process.env.GITHUB_REPO;
  if (!token || !slug) return null;
  const [owner, repo] = slug.split("/");
  if (!owner || !repo) return null;
  return { token, owner, repo, branch: process.env.GITHUB_BRANCH || "main" };
}

export class GitHubError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

async function call<T>(
  cfg: GitHubConfig,
  path: string,
  init?: { method?: string; body?: unknown }
): Promise<T> {
  const res = await fetch(`${API}/repos/${cfg.owner}/${cfg.repo}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: init?.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    // Surface the two mistakes that actually happen in setup: a token
    // without Contents:write, and a branch that is protected.
    const hint =
      res.status === 401 || res.status === 403
        ? " — check GITHUB_TOKEN has Contents: Read and write on this repository"
        : res.status === 404
          ? " — check GITHUB_REPO is owner/name and the token can see it"
          : "";
    throw new GitHubError(
      `GitHub ${res.status} on ${path}${hint}${detail ? `: ${detail.slice(0, 300)}` : ""}`,
      res.status
    );
  }
  return (await res.json()) as T;
}

/**
 * Commits every file in one commit on top of the current branch head.
 * Returns the commit sha, or null when nothing changed (no empty deploy).
 *
 * Two saves landing at once make the second one's ref update fail; that is a
 * lost race, not a bad request, so it is retried against the new head.
 */
export async function commitFiles(
  cfg: GitHubConfig,
  files: CommitFile[],
  message: string,
  attempt = 0
): Promise<string | null> {
  if (!files.length) return null;

  const ref = await call<{ object: { sha: string } }>(
    cfg,
    `/git/ref/heads/${encodeURIComponent(cfg.branch)}`
  );
  const headSha = ref.object.sha;
  const head = await call<{ tree: { sha: string } }>(
    cfg,
    `/git/commits/${headSha}`
  );

  const blobs = await Promise.all(
    files.map((file) =>
      call<{ sha: string }>(cfg, "/git/blobs", {
        method: "POST",
        body: { content: file.content, encoding: file.encoding ?? "utf-8" },
      })
    )
  );

  const tree = await call<{ sha: string }>(cfg, "/git/trees", {
    method: "POST",
    body: {
      base_tree: head.tree.sha,
      tree: files.map((file, i) => ({
        path: file.path,
        mode: "100644",
        type: "blob",
        sha: blobs[i].sha,
      })),
    },
  });

  // Identical tree means the edit was a no-op; committing it would burn a
  // deploy for nothing.
  if (tree.sha === head.tree.sha) return null;

  const commit = await call<{ sha: string }>(cfg, "/git/commits", {
    method: "POST",
    body: { message, tree: tree.sha, parents: [headSha] },
  });

  try {
    await call(cfg, `/git/refs/heads/${encodeURIComponent(cfg.branch)}`, {
      method: "PATCH",
      body: { sha: commit.sha },
    });
  } catch (error) {
    if (error instanceof GitHubError && error.status === 422 && attempt < 3) {
      return commitFiles(cfg, files, message, attempt + 1);
    }
    throw error;
  }

  return commit.sha;
}
