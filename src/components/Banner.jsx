import Link from "next/link";

export default function Banner() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-800 bg-zinc-950 py-20 sm:py-28 lg:py-32">
      {/* Background Accent Gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[450px] w-[600px] -translate-x-1/2 rounded-full bg-lime-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-10 -z-10 h-72 w-72 rounded-full bg-emerald-500/5 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-lime-400">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse" />
            Instant Arena & Court Booking
          </div>

          {/* Title */}
          <h1 className="mt-6 max-w-4xl text-4xl font-black italic tracking-tight text-white sm:text-6xl lg:text-7xl">
            FIND YOUR GROUND. <br />
            <span className="text-lime-400">BOOK YOUR GAME.</span>
          </h1>

          {/* Short Description */}
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Discover and reserve premium football turfs, badminton courts, tennis
            arenas, and swimming lanes in seconds. No calls, no waiting—just play.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/facilities"
              className="inline-flex items-center justify-center rounded-xl bg-lime-400 px-8 py-3.5 text-base font-bold text-zinc-950 shadow-lg shadow-lime-400/20 transition hover:bg-lime-300 active:scale-95"
            >
              Explore Facilities
            </Link>

            <Link
              href="/facilities/add"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 px-8 py-3.5 text-base font-bold text-zinc-300 backdrop-blur transition hover:border-zinc-700 hover:text-white active:scale-95"
            >
              List Your Arena
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="mt-16 grid grid-cols-2 gap-6 border-t border-zinc-800/80 pt-10 sm:grid-cols-4 sm:gap-12">
            <div>
              <p className="text-2xl font-black italic text-white sm:text-3xl">50+</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">Active Arenas</p>
            </div>
            <div>
              <p className="text-2xl font-black italic text-lime-400 sm:text-3xl">24/7</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">Live Slots</p>
            </div>
            <div>
              <p className="text-2xl font-black italic text-white sm:text-3xl">10K+</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">Matches Played</p>
            </div>
            <div>
              <p className="text-2xl font-black italic text-lime-400 sm:text-3xl">Instant</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">Confirmation</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}