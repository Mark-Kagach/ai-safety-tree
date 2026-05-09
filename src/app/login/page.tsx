"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setSubmitting(false);
    if (!res.ok) {
      setError((await res.text()) || "Login failed");
      return;
    }
    router.push("/");
    router.refresh();
  };

  const inputClass =
    "w-full font-sans border border-border bg-canvas-soft text-fg px-3 py-2 focus:outline-none focus:border-fg-muted rounded-sm";

  return (
    <main className="max-w-sm mx-auto px-6 py-16 font-sans">
      <h1 className="font-serif text-3xl font-medium mb-8 text-fg">Log in</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="login-username"
            className="block text-xs font-medium uppercase tracking-wide text-fg-muted mb-1.5"
          >
            Username
          </label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="login-password"
            className="block text-xs font-medium uppercase tracking-wide text-fg-muted mb-1.5"
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className={inputClass}
          />
        </div>
        {error && (
          <p className="text-sm text-accent border-l-2 border-accent pl-3 py-1">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-accent text-white px-4 py-2 rounded-sm hover:bg-accent-hover disabled:bg-fg-subtle disabled:cursor-not-allowed transition-colors text-sm"
        >
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="text-sm mt-6 text-fg-muted">
        No account?{" "}
        <Link href="/signup" className="text-accent hover:underline">
          Sign up
        </Link>
      </p>
      <p className="text-sm mt-4 text-fg-subtle">
        <Link href="/" className="hover:text-fg">
          ← Back to tree
        </Link>
      </p>
    </main>
  );
}
