import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800 bg-zinc-950 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-lime-400 text-xl font-black italic text-zinc-950 shadow-lg shadow-lime-400/20">
                P
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black italic tracking-tight text-white">
                  PLAY<span className="text-lime-400">PLEX</span>
                </span>
                <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
                  Play. Book. Compete.
                </span>
              </div>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
              The premier sports reservation portal. Find turfs, badminton courts,
              swimming lanes, and tennis facilities near you. Book instantly and play.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="transition hover:text-lime-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/facilities" className="transition hover:text-lime-400">
                  All Facilities
                </Link>
              </li>
              <li>
                <Link href="/my-booking" className="transition hover:text-lime-400">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link href="/facilities/add" className="transition hover:text-lime-400">
                  Add Facility
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Contact Info
            </h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-lime-400">📍</span>
                <span>124 Stadium Road, Sports Hub, NY 10001</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lime-400">📞</span>
                <a href="tel:+1234567890" className="hover:text-lime-400 transition">
                  +1 (555) 234-5678
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lime-400">✉️</span>
                <a href="mailto:support@playplex.com" className="hover:text-lime-400 transition">
                  support@playplex.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lime-400">🕒</span>
                <span>Mon - Sun: 6:00 AM - 11:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Follow Us
            </h3>
            <p className="text-xs text-zinc-500">
              Stay connected for court updates and weekend tournaments.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-sm text-zinc-300 transition hover:border-lime-400 hover:text-lime-400"
                aria-label="Facebook"
              >
                Fb
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-sm text-zinc-300 transition hover:border-lime-400 hover:text-lime-400"
                aria-label="Twitter"
              >
                X
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-sm text-zinc-300 transition hover:border-lime-400 hover:text-lime-400"
                aria-label="Instagram"
              >
                Ig
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-sm text-zinc-300 transition hover:border-lime-400 hover:text-lime-400"
                aria-label="LinkedIn"
              >
                In
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-zinc-800/80 pt-6 text-xs text-zinc-500 sm:flex-row gap-4">
          <p>© 2026 PlayPlex Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-zinc-300 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-zinc-300 transition">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-zinc-300 transition">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}