"use client";

import { Button } from "@heroui/react";

export default function Banner() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white">
      {/* Background Glow */}
      <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-lime-400/10 blur-3xl" />

      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-lime-400/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-[560px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 lg:px-8">

        {/* ================= LEFT CONTENT ================= */}
        <div className="max-w-xl">

          {/* Small Label */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-lime-400" />

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-lime-400">
              Play. Book. Compete.
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Find Your
            <br />
            <span className="text-lime-400">Perfect</span>
            <br />
            Playground.
          </h1>

          {/* Description */}
          <p className="mt-7 max-w-lg text-base leading-7 text-zinc-400 sm:text-lg">
            Discover, compare, and book sports facilities near you.
            Choose your game, pick your time, and get ready to play.
          </p>

          {/* Button */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              as="a"
              href="/facilities"
              variant="primary"
              className="rounded-xl bg-lime-400 px-7 font-bold text-zinc-950 shadow-lg shadow-lime-400/10 transition-all hover:bg-lime-300"
            >
              Explore Facilities
            </Button>

            <a
              href="/facilities"
              className="text-sm font-semibold text-zinc-300 transition hover:text-lime-400"
            >
              Find a facility →
            </a>
          </div>
        </div>

        {/* ================= RIGHT VISUAL ================= */}
        <div className="relative flex justify-center md:justify-end">

          {/* Main Card */}
          <div className="relative h-[380px] w-full max-w-[430px] overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-900 shadow-2xl">

            {/* Lime Gradient */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lime-400/20 blur-3xl" />

            {/* Decorative Circle */}
            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full border-[40px] border-lime-400/10" />

            {/* Sport Text */}
            <div className="absolute left-7 top-7">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
                Your Game
              </p>

              <h2 className="mt-2 text-3xl font-black italic">
                YOUR
                <br />
                <span className="text-lime-400">PLAYGROUND.</span>
              </h2>
            </div>

            {/* Sport Icons / Cards */}
            <div className="absolute bottom-7 left-7 right-7 grid grid-cols-3 gap-3">

              <div className="rounded-2xl border border-zinc-700 bg-zinc-800/80 p-4 text-center backdrop-blur">
                <div className="text-2xl">⚽</div>
                <p className="mt-2 text-xs font-semibold text-zinc-300">
                  Football
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-700 bg-zinc-800/80 p-4 text-center backdrop-blur">
                <div className="text-2xl">🏸</div>
                <p className="mt-2 text-xs font-semibold text-zinc-300">
                  Badminton
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-700 bg-zinc-800/80 p-4 text-center backdrop-blur">
                <div className="text-2xl">🎾</div>
                <p className="mt-2 text-xs font-semibold text-zinc-300">
                  Tennis
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}