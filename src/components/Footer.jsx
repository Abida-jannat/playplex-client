 "use client";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Main Footer */}
        <div className="grid gap-10 md:grid-cols-3">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-xl font-black italic text-zinc-950">
                P
              </div>

              <span className="text-xl font-black italic">
                PLAY<span className="text-lime-400">PLEX</span>
              </span>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-400">
              Play. Book. Compete. Find and book your favorite sports
              facilities easily with PlayPlex.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-lime-400">
              Contact
            </h3>

            <div className="space-y-3 text-sm text-zinc-400">
              <p>Email: support@playplex.com</p>
              <p>Phone: +880 1234-567890</p>
              <p>Location: Dhaka, Bangladesh</p>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-lime-400">
              Follow Us
            </h3>

            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 text-sm font-bold text-zinc-300 transition hover:border-lime-400 hover:bg-lime-400 hover:text-zinc-950"
                aria-label="Facebook"
              >
                f
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 text-sm font-bold text-zinc-300 transition hover:border-lime-400 hover:bg-lime-400 hover:text-zinc-950"
                aria-label="Instagram"
              >
                ◎
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 text-sm font-bold text-zinc-300 transition hover:border-lime-400 hover:bg-lime-400 hover:text-zinc-950"
                aria-label="X"
              >
                𝕏
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 text-sm font-bold text-zinc-300 transition hover:border-lime-400 hover:bg-lime-400 hover:text-zinc-950"
                aria-label="LinkedIn"
              >
                in
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-zinc-800 pt-6 text-center">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} PlayPlex. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}