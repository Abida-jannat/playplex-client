"use client";

import { useState } from "react";
import { Button } from "@heroui/react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Temporary login state
  // Better Auth will be connected later
  const isLoggedIn = false;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950 text-white">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ================= LOGO ================= */}
        <a href="/" className="flex items-center gap-3">
          {/* Sporty P Logo */}
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
        </a>

        {/* ================= DESKTOP NAV ================= */}
        <div className="hidden items-center gap-1 md:flex">

          <a
            href="/"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:bg-white/10 hover:text-lime-400"
          >
            Home
          </a>

          <a
            href="/facilities"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:bg-white/10 hover:text-lime-400"
          >
            All Facilities
          </a>

          {isLoggedIn && (
            <>
              <a
                href="/bookings"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:bg-white/10 hover:text-lime-400"
              >
                My Bookings
              </a>

              <a
                href="/facilities/add"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:bg-white/10 hover:text-lime-400"
              >
                Add Facility
              </a>

              <a
                href="/facilities/manage"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:bg-white/10 hover:text-lime-400"
              >
                Manage Facilities
              </a>
            </>
          )}
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="hidden items-center gap-3 md:flex">

          {!isLoggedIn ? (
            <Button
              as="a"
              href="/login"
              variant="primary"
              className="rounded-xl bg-lime-400 px-6 font-bold text-zinc-950 shadow-lg shadow-lime-400/10 transition-all hover:bg-lime-300"
            >
              Login
            </Button>
          ) : (
            <div className="relative">

              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 transition hover:border-lime-400"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-400 text-sm font-black text-zinc-950">
                  U
                </div>

                <span className="text-sm font-semibold">
                  Profile
                </span>

                <span className="text-xs text-zinc-500">
                  ▼
                </span>
              </button>

            </div>
          )}
        </div>

        {/* ================= MOBILE BUTTON ================= */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-lg transition hover:border-lime-400 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isMenuOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950 md:hidden">

          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">

            <div className="flex flex-col gap-2">

              {/* Home */}
              <a
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-lime-400"
              >
                Home
              </a>

              {/* Facilities */}
              <a
                href="/facilities"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-lime-400"
              >
                All Facilities
              </a>

              {/* Logged-in Links */}
              {isLoggedIn && (
                <>
                  <a
                    href="/bookings"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-lime-400"
                  >
                    My Bookings
                  </a>

                  <a
                    href="/facilities/add"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-lime-400"
                  >
                    Add Facility
                  </a>

                  <a
                    href="/facilities/manage"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-lime-400"
                  >
                    Manage Facilities
                  </a>

                  <button
                    type="button"
                    className="mt-2 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                  >
                    Logout
                  </button>
                </>
              )}

              {/* Mobile Login */}
              {!isLoggedIn && (
                <Button
                  as="a"
                  href="/login"
                  variant="primary"
                  className="mt-3 w-full rounded-xl bg-lime-400 font-bold text-zinc-950 hover:bg-lime-300"
                >
                  Login
                </Button>
              )}
            </div>

            {/* Mobile Branding */}
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