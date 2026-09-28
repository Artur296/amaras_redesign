"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Wrong username or password");
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-deep px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <Image
            src="/images/amaras-logo.png"
            alt="AMARAS"
            width={160}
            height={36}
            className="h-8 w-auto object-contain"
            priority
          />
        </div>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted">
          Admin Control Center
        </p>

        <label className="mt-6 block text-sm font-semibold text-ink">
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </label>
        <label className="mt-4 block text-sm font-semibold text-ink">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </label>

        {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={busy || !password}
          className="mt-6 w-full rounded-full bg-primary py-2.5 font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
