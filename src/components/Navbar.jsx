"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const router = useRouter();

  const { data: session, isPending } = useSession();

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
// eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern//
      setDarkMode(false);
       
      document.documentElement.classList.remove("dark");
    } else {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle Theme Function
  const toggleTheme = () => {
    if (darkMode) {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  // Logout
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsProfileOpen(false);
          setIsMenuOpen(false);

          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950 text-white transition-colors duration-300">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <Link href="/" className="flex items-center gap-3">
          
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-lime-400 text-xl font-black italic text-zinc-950 shadow-lg">
            P

            <div className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-white/20" />
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

        <div className="hidden items-center gap-1 md:flex">

          {/* Home */}
          <Link
            href="/"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:bg-white/10 hover:text-lime-400"
          >
            Home
          </Link>

          {/* All Facilities */}
          <Link
            href="/facilities"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:bg-white/10 hover:text-lime-400"
          >
            All Facilities
          </Link>

          {/* Logged-in Links */}
          {!isPending && session && (
            <>
              <Link
                href="/my-booking"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:bg-white/10 hover:text-lime-400"
              >
                My Bookings
              </Link>

              <Link
                href="/facilities/add"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:bg-white/10 hover:text-lime-400"
              >
                Add Facility
              </Link>

              <Link
                href="/facilities/manage"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:bg-white/10 hover:text-lime-400"
              >
                Manage Facilities
              </Link>
            </>
          )}
        </div>

      
        <div className="hidden items-center gap-3 md:flex">

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-sm transition hover:border-lime-400"
            aria-label="Toggle theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* Loading */}
          {isPending ? (
            <div className="h-10 w-24 animate-pulse rounded-xl bg-zinc-800" />
          ) : session ? (
              
          
            <div className="relative">

              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 transition hover:border-lime-400"
              >

                {/* Profile Image */}
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-400 text-sm font-black text-zinc-950">
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}

                {/* Name */}
                <span className="max-w-[120px] truncate text-sm font-semibold">
                  {session.user?.name || "Profile"}
                </span>

                {/* Arrow */}
                <span
                  className={`text-xs text-zinc-500 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl">

                  {/* User Info */}
                  <div className="border-b border-zinc-800 px-4 py-3">
                    <p className="truncate text-sm font-bold text-white">
                      {session.user?.name || "User"}
                    </p>

                    <p className="mt-1 truncate text-xs text-zinc-500">
                      {session.user?.email}
                    </p>
                  </div>

                  {/* My Bookings */}
                  <Link
                    href="/my-booking"
                    onClick={() => setIsProfileOpen(false)}
                    className="mt-2 block rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-900 hover:text-lime-400"
                  >
                    My Bookings
                  </Link>

                  {/* Add Facility */}
                  <Link
                    href="/facilities/add"
                    onClick={() => setIsProfileOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-900 hover:text-lime-400"
                  >
                    Add Facility
                  </Link>

                  {/* Manage Facilities */}
                  <Link
                    href="/facilities/manage"
                    onClick={() => setIsProfileOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-900 hover:text-lime-400"
                  >
                    Manage My Facilities
                  </Link>

                  {/* Divider */}
                  <div className="my-2 border-t border-zinc-800" />

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

          ) : (

            /*  LOGIN  */
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-lime-400 px-6 py-2 text-sm font-bold text-zinc-950 shadow-lg shadow-lime-400/10 transition-all hover:bg-lime-300"
            >
              Login
            </Link>
          )}
        </div>

        {/* MOBILE BUTTON & THEME TOGGLE  */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-sm transition hover:border-lime-400"
            aria-label="Toggle theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-lg transition hover:border-lime-400"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* MOBILE MENU  */}
      {isMenuOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950 md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">

            <div className="flex flex-col gap-2">

              {/* Home */}
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-lime-400"
              >
                Home
              </Link>

              {/* Facilities */}
              <Link
                href="/facilities"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-lime-400"
              >
                All Facilities
              </Link>

              {/* MOBILE LOGGED-IN MENU  */}
              {!isPending && session && (
                <>
                  {/* Profile Info */}
                  <div className="my-2 flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3">

                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-400 text-sm font-black text-zinc-950">
                        {session.user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">
                        {session.user?.name || "User"}
                      </p>

                      <p className="truncate text-xs text-zinc-500">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>

                  {/* My Bookings */}
                  <Link
                    href="/my-booking"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-lime-400"
                  >
                    My Bookings
                  </Link>

                  {/* Add Facility */}
                  <Link
                    href="/facilities/add"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-lime-400"
                  >
                    Add Facility
                  </Link>

                  {/* Manage Facilities */}
                  <Link
                    href="/facilities/manage"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-lime-400"
                  >
                    Manage My Facilities
                  </Link>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                  >
                    Logout
                  </button>
                </>
              )}

             
              {!isPending && !session && (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-lime-400 py-3 text-center font-bold text-zinc-950 transition hover:bg-lime-300"
                >
                  Login
                </Link>
              )}
            </div>

         
            <div className="mt-6 border-t border-zinc-800 pt-5">
              <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
                Play. Book. Compete.
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}