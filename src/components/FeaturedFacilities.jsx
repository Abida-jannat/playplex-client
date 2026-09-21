"use client";

import { useEffect, useState } from "react";
import Link from "next/link";


const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80";

export default function FeaturedFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/facilities/featured`);
        
        if (!res.ok) throw new Error("Failed to fetch featured venues");
        const data = await res.json();

        if (Array.isArray(data)) {
          setFacilities(data);
        }
      } catch (error) {
        console.error("Error loading facilities:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <section className="relative border-b border-zinc-800/80 bg-zinc-950 py-20 lg:py-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-72 w-[600px] -translate-x-1/2 rounded-full bg-lime-400/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-zinc-800/60 pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-lime-400">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse" />
              Verified Arenas
            </div>
            <h2 className="mt-3 text-3xl font-black italic uppercase tracking-tight text-white sm:text-4xl">
              Featured <span className="text-lime-400">Facilities</span>
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Premium tournament-grade turfs, courts, and grounds available for instant reservation.
            </p>
          </div>

          <Link
            href="/facilities"
            className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-lime-400 transition hover:text-lime-300"
          >
            Explore All Venues
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[430px] rounded-2xl border border-zinc-800/80 bg-zinc-900/30 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && facilities.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 py-16 text-center">
            <p className="text-sm font-medium text-zinc-400">No facilities available currently.</p>
            <p className="mt-1 text-xs text-zinc-600">Ensure your backend server is seeded and running.</p>
          </div>
        )}

        {/* Dynamic Cards Grid */}
        {!loading && facilities.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.slice(0, 6).map((item) => (
              <FacilityCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


function FacilityCard({ item }) {
  const [imgSrc, setImgSrc] = useState(item.image || FALLBACK_IMAGE);

 
  const rawPrice = Number(item.pricePerHour || item.price || 50);
  const formattedPrice = rawPrice < 100 ? rawPrice * 35 : rawPrice;

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm transition-all duration-300 hover:border-lime-400/40 hover:bg-zinc-900/70 hover:shadow-xl hover:shadow-lime-400/5">

      <div className="relative h-52 w-full overflow-hidden bg-zinc-950">
        <img
          src={imgSrc}
          alt={item.name}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        

        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <span className="rounded-lg border border-zinc-800/60 bg-zinc-950/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-lime-400 backdrop-blur-md">
            {item.category || item.sport || "Arena"}
          </span>
          <span className="flex items-center gap-1 rounded-lg border border-zinc-800/60 bg-zinc-950/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
            <span className="text-amber-400">★</span> {item.rating || "4.9"}
          </span>
        </div>
      </div>

  
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-2">
          <h3 className="text-lg font-black italic tracking-tight text-white transition-colors duration-200 group-hover:text-lime-400">
            {item.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span className="text-zinc-500">📍</span>
            <span className="truncate">{item.location || "Sports District, Dhaka"}</span>
          </div>

          <p className="line-clamp-2 text-xs leading-relaxed text-zinc-400/90 pt-1">
            {item.description || "Fully equipped athletic facility with floodlight provisions and changing rooms."}
          </p>
        </div>

    
        <div className="mt-6 flex items-center justify-between border-t border-zinc-800/80 pt-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Booking Rate
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-white">
                ৳{formattedPrice.toLocaleString("en-US")}
              </span>
              <span className="text-xs font-semibold text-zinc-400">/hr</span>
            </div>
          </div>

          <Link
            href={`/facilities/${item._id}`}
            className="inline-flex items-center justify-center rounded-xl bg-lime-400 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-zinc-950 shadow-md shadow-lime-400/15 transition-all duration-200 hover:bg-lime-300 hover:shadow-lime-400/25 active:scale-95"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}