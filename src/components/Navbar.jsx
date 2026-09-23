"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const dropdownRef = useRef(null);

  // Sync DOM with saved theme on mount without hydration mismatch
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme !== "light";
    setDarkMode(isDark);

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Theme toggle handler
  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);

    if (nextMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      setIsProfileOpen(false);
      setIsMenuOpen(false);
      toast.success("Logged out successfully");
      router.push("/");
    } catch {
      toast.error("Failed to log out. Please try again.");
    }
  };

  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950 text-white">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-lime-400 text-xl font-black italic text-zinc-950 shadow-lg shadow-lime-400/20">
            P
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black italic tracking-tight">
              PLAY<span className="text-lime-400">PLEX</span>
            </span>
            <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Play. Book. Compete.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              isActive("/")
                ? "bg-white/10 text-lime-400"
                : "text-zinc-300 hover:bg-white/10 hover:text-lime-400"
            }`}
          >
            Home
          </Link>

          <Link
            href="/facilities"
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              isActive("/facilities")
                ? "bg-white/10 text-lime-400"
                : "text-zinc-300 hover:bg-white/10 hover:text-lime-400"
            }`}
          >
            All Facilities
          </Link>

          {/* Private Links (Only visible when logged in) */}
          {session?.user && (
            <>
              <Link
                href="/my-booking"
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive("/my-booking")
                    ? "bg-white/10 text-lime-400"
                    : "text-zinc-300 hover:bg-white/10 hover:text-lime-400"
                }`}
              >
                My Bookings
              </Link>

              <Link
                href="/facilities/add"
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive("/facilities/add")
                    ? "bg-white/10 text-lime-400"
                    : "text-zinc-300 hover:bg-white/10 hover:text-lime-400"
                }`}
              >
                Add Facility
              </Link>

              <Link
                href="/facilities/manage"
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive("/facilities/manage")
                    ? "bg-white/10 text-lime-400"
                    : "text-zinc-300 hover:bg-white/10 hover:text-lime-400"
                }`}
              >
                Manage My Facilities
              </Link>
            </>
          )}
        </div>

        {/* Right Desktop Section */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-sm transition hover:border-lime-400"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {isPending ? (
            <div className="h-10 w-24 animate-pulse rounded-xl bg-zinc-800" />
          ) : session?.user ? (
            /* User Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 p-1.5 transition hover:border-lime-400 focus:outline-none"
              >
                {session.user.image && !imgError ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "Avatar"}
                    onError={() => setImgError(true)}
                    className="h-7 w-7 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-lime-400 font-black text-xs text-zinc-950">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <span className="max-w-[100px] truncate text-xs font-bold text-zinc-200">
                  {session.user.name?.split(" ")[0]}
                </span>
                <span className="text-zinc-500 text-xs">▼</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl">
                  <div className="border-b border-zinc-800 px-3 py-2">
                    <p className="truncate text-xs font-bold text-white">
                      {session.user.name}
                    </p>
                    <p className="truncate text-[11px] text-zinc-400">
                      {session.user.email}
                    </p>
                  </div>

                  <div className="mt-1 flex flex-col gap-1">
                    <Link
                      href="/my-booking"
                      onClick={() => setIsProfileOpen(false)}
                      className="rounded-lg px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-lime-400"
                    >
                      My Bookings
                    </Link>

                    <Link
                      href="/facilities/add"
                      onClick={() => setIsProfileOpen(false)}
                      className="rounded-lg px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-lime-400"
                    >
                      Add Facility
                    </Link>

                    <Link
                      href="/facilities/manage"
                      onClick={() => setIsProfileOpen(false)}
                      className="rounded-lg px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-lime-400"
                    >
                      Manage My Facilities
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-rose-400 transition hover:bg-rose-500/10"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-lime-400 px-6 py-2 text-sm font-bold text-zinc-950 transition hover:bg-lime-300 shadow-lg shadow-lime-400/20"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-sm hover:border-lime-400"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-lg hover:border-lime-400"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950 md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/10 hover:text-lime-400"
              >
                Home
              </Link>

              <Link
                href="/facilities"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/10 hover:text-lime-400"
              >
                All Facilities
              </Link>

              {session?.user ? (
                <>
                  <Link
                    href="/my-booking"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/10 hover:text-lime-400"
                  >
                    My Bookings
                  </Link>

                  <Link
                    href="/facilities/add"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/10 hover:text-lime-400"
                  >
                    Add Facility
                  </Link>

                  <Link
                    href="/facilities/manage"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/10 hover:text-lime-400"
                  >
                    Manage My Facilities
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 py-3 font-bold text-rose-400 hover:bg-rose-500/20"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-lime-400 py-3 font-bold text-zinc-950 hover:bg-lime-300"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}