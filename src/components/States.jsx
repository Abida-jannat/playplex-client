export default function SimpleStats() {
  const stats = [
    { number: "25+", label: "Verified Turfs" },
    { number: "1,200+", label: "Matches Hosted" },
    { number: "$0", label: "Booking Fee" },
    { number: "4.9 ★", label: "Player Rating" },
  ];

  return (
    <section className="border-b border-zinc-800 bg-zinc-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="border-r border-zinc-800/80 last:border-none">
              <p className="text-2xl font-black italic text-lime-400 sm:text-3xl">
                {s.number}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}