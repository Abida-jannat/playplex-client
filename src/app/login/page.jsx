"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw new Error(error.message || "Invalid email or password.");
      }

      toast.success("Welcome back to PlayPlex!");
      router.push(redirectUrl);
    } catch (err) {
      toast.error(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: redirectUrl,
      });
    } catch (err) {
      toast.error(err.message || "Google login failed.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-lime-400">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse" />
            Athlete Portal
          </span>
          <h1 className="mt-3 text-2xl font-black italic uppercase tracking-tight text-white sm:text-3xl">
            Account <span className="text-lime-400">Login</span>
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Sign in to access your bookings and reserve game arenas.
          </p>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-950 py-3 px-4 text-xs font-bold uppercase tracking-wider text-white transition hover:border-lime-400/40 hover:bg-zinc-900 active:scale-95"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-black text-zinc-950">
            G
          </span>
          Sign in with Google
        </button>

        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-zinc-800" />
          <span className="absolute bg-zinc-900 px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            or with email
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="athlete@example.com"
              className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-lime-400 py-3 text-xs font-black uppercase tracking-wider text-zinc-950 shadow-md shadow-lime-400/10 transition hover:bg-lime-300 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-lime-400 hover:text-lime-300 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}