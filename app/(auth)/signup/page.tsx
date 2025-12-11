"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registracija nepavyko");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Klaida jungiantis prie serverio");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-accent mb-2">FQR</h1>
          <p className="text-muted text-sm">Sukurk paskyrą</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm text-muted mb-1">
              Vardas
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              autoComplete="name"
              className="w-full px-4 py-3 bg-surface border border-muted/20 rounded-lg focus:outline-none focus:border-accent transition-colors"
              placeholder="Jonas Jonaitis"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-muted mb-1">
              El. paštas
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full px-4 py-3 bg-surface border border-muted/20 rounded-lg focus:outline-none focus:border-accent transition-colors"
              placeholder="vardas@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-muted mb-1">
              Slaptažodis
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full px-4 py-3 bg-surface border border-muted/20 rounded-lg focus:outline-none focus:border-accent transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg text-accent text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            {loading ? "Kuriama..." : "Registruotis"}
          </button>
        </form>

        <p className="mt-6 text-center text-muted text-sm">
          Jau turi paskyrą?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Prisijunk
          </Link>
        </p>
      </div>
    </div>
  );
}
