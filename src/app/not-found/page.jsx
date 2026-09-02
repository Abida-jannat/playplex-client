import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center shadow-2xl">
        {/* Icon / Badge */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-3xl font-extrabold text-lime-400">
          404
        </div>

        {/* Friendly Error Message */}
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Page Not Found
        </h1>
        <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
          Oops! The page you are looking for <doesn1pops></doesn1pops>t exist, was removed, or had its name changed.
        </p>

        {/* Back Home Button */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-block w-full rounded-xl bg-lime-400 px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            ← Back Home
          </Link>
        </div>
      </div>
    </section>
  );
}