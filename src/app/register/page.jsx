"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signUp, signIn } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (pass) => {
    if (pass.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    if (!/[A-Z]/.test(pass)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(pass)) {
      return "Password must contain at least one lowercase letter.";
    }
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const passError = validatePassword(formData.password);
    if (passError) {
      toast.error(passError);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        image: formData.photoURL || undefined,
      });

      if (error) {
        throw new Error(error.message || "Failed to register.");
      }

      toast.success("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      toast.error(err.message || "Google sign-up failed.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-lime-400">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse" />
            New Athlete
          </span>
          <h1 className="mt-3 text-2xl font-black italic uppercase tracking-tight text-white sm:text-3xl">
            Create an <span className="text-lime-400">Account</span>
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Join PlayPlex to reserve arenas and schedule tournament slots.
          </p>
        </div>

        {/* Google Registration Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-950 py-3 px-4 text-xs font-bold uppercase tracking-wider text-white transition hover:border-lime-400/40 hover:bg-zinc-900 active:scale-95"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-black text-zinc-950">
            G
          </span>
          Continue with Google
        </button>

        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-zinc-800" />
          <span className="absolute bg-zinc-900 px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            or with email
          </span>
        </div>

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Tanvir Hossain"
              className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
            />
          </div>

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
              Photo URL <span className="text-zinc-600 font-normal">(Optional)</span>
            </label>
            <input
              type="url"
              name="photoURL"
              value={formData.photoURL}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
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
            <p className="mt-1.5 text-[10px] text-zinc-500">
              At least 6 characters, one uppercase letter, and one lowercase letter.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-lime-400 py-3 text-xs font-black uppercase tracking-wider text-zinc-950 shadow-md shadow-lime-400/10 transition hover:bg-lime-300 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-lime-400 hover:text-lime-300 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}