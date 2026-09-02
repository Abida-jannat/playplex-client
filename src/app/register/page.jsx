"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }

    return "";
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(password);

    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: image || undefined,
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      toast.success("Registration successful!");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
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
            Get Started
          </p>

          <h1 className="text-3xl font-bold text-white">
            Join <span className="text-lime-400">PlayPlex</span>
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Create your account and start booking facilities
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-5">

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              disabled={loading || googleLoading}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400 disabled:opacity-50"
            />
          </div>

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

          {/* Photo URL */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Photo URL
            </label>

            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/photo.jpg"
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

            <p className="mt-2 text-xs text-zinc-500">
              At least 6 characters, including one uppercase and one lowercase
              letter.
            </p>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full rounded-xl bg-lime-400 py-3.5 text-sm font-bold text-black transition duration-200 hover:scale-[1.02] hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register →"}
          </button>

        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-800" />
          <span className="text-xs text-zinc-500">OR</span>
          <div className="h-px flex-1 bg-zinc-800" />
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={loading || googleLoading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 py-3 text-sm font-semibold text-zinc-200 transition duration-200 hover:border-zinc-700 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FcGoogle className="h-5 w-5" />

          {googleLoading
            ? "Connecting to Google..."
            : "Continue with Google"}
        </button>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-lime-400 hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}