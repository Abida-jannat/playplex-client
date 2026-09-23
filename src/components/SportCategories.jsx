import Link from "next/link";

const sports = [
  { name: "Football", icon: "⚽", count: "12 Arenas", href: "/facilities" },
  { name: "Cricket", icon: "🏏", count: "8 Grounds", href: "/facilities" },
  { name: "Badminton", icon: "🏸", count: "15 Courts", href: "/facilities" },
  { name: "Basketball", icon: "🏀", count: "6 Gyms", href: "/facilities" },
];

export default function SimpleCategories() {
  return (
    <section className="border-b border-zinc-800 bg-zinc-950 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-black italic uppercase tracking-tight text-white sm:text-3xl">
            Popular <span className="text-lime-400">Sports</span>
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Find the right court or turf for your game
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {sports.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center transition hover:border-lime-400/50 hover:bg-zinc-900"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="mt-3 text-sm font-bold text-white">{item.name}</h3>
              <span className="mt-1 text-[11px] text-lime-400">{item.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}