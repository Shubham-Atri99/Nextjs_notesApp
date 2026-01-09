"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-gray-500">Login to continue taking notes</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="john@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                         text-gray-900 placeholder-gray-400 bg-white"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                         text-gray-900 placeholder-gray-400 bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 w-full rounded-xl py-3 text-lg font-medium text-white shadow-lg transition ${
              loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-2">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-400">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link href="/register" className="font-medium text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
