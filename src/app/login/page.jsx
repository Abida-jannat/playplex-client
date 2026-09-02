"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      toast.success("Login successful!");

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Google login failed.");
        setGoogleLoading(false);
      }
    } catch (err) {
      toast.error("Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-black px-4 py-12 text-white">

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
      />

      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[4px] text-lime-400">
            Welcome Back
          </p>

          <h1 className="text-3xl font-bold text-white">
            Login to <span className="text-lime-400">PlayPlex</span>
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Access your bookings and facilities seamlessly
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading || googleLoading}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400 disabled:opacity-50"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading || googleLoading}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400 disabled:opacity-50"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full rounded-xl bg-lime-400 py-3.5 text-sm font-bold text-black transition duration-200 hover:scale-[1.02] hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login →"}
          </button>

        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-800" />
          <span className="text-xs text-zinc-500">OR</span>
          <div className="h-px flex-1 bg-zinc-800" />
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 py-3 text-sm font-semibold text-zinc-200 transition duration-200 hover:border-zinc-700 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FcGoogle className="h-5 w-5" />

          {googleLoading
            ? "Connecting to Google..."
            : "Continue with Google"}
        </button>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-lime-400 hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}