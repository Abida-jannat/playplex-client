"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

const categories = [
  "All",
  "Football",
  "Badminton",
  "Tennis",
  "Swimming",
  "Cricket",
  "Basketball",
];

const categoryFallbacks = {
  Football: "https://images.unsplash.com/photo-1529900245534-47fbf8204b61?auto=format&fit=crop&q=80&w=800",
  Badminton: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800",
  Tennis: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800",
  Swimming: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=800",
  Cricket: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800",
  Basketball: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800",
  Default: "https://images.unsplash.com/photo-1518604666864-7423946f3c5e?auto=format&fit=crop&q=80&w=800",
};

export default function FacilitiesPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [facilities, setFacilities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFacilities() {
      setLoading(true);
      try {
        let url = "http://localhost:5000/api/facilities";
        const params = new URLSearchParams();

        if (selectedCategory && selectedCategory !== "All") {
          params.append("category", selectedCategory);
        }
        if (searchQuery.trim()) {
          params.append("search", searchQuery.trim());
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setFacilities(data);
        }
      } catch (err) {
        console.error("Failed to fetch facilities:", err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchFacilities();
    }, 250);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  // Handle Book Now Click (Redirect to Login if unauthenticated)
  const handleBookNow = (facilityId) => {
    if (!session?.user) {
      toast.error("Please login first to book an arena.");
      router.push(`/login?redirect=/facilities/${facilityId}`);
    } else {
      router.push(`/facilities/${facilityId}`);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-lime-400">
          Explore Arenas
        </span>
        <h1 className="mt-3 text-3xl font-black italic uppercase tracking-tight text-white sm:text-4xl">
          All <span className="text-lime-400">Facilities</span>
        </h1>
        <p className="mt-2 text-xs text-zinc-400 max-w-md mx-auto">
          Find and reserve top-tier sports courts, pitches, and fields across the city.
        </p>
      </div>

      {/* Controls: Search and Categories */}
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search venue by name or location..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                selectedCategory === cat
                  ? "bg-lime-400 text-zinc-950 shadow-md shadow-lime-400/20"
                  : "border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities Grid */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime-400 border-t-transparent" />
        </div>
      ) : facilities.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">
          <p className="text-zinc-400 text-sm">No facilities match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((venue) => {
            const fallback =
              categoryFallbacks[venue.category] || categoryFallbacks.Default;

            return (
              <div
                key={venue._id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/50 transition hover:border-lime-400/50 hover:shadow-xl hover:shadow-lime-400/5"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                    <img
                      src={venue.image || fallback}
                      alt={venue.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallback;
                      }}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 rounded-md bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-lime-400">
                      {venue.category}
                    </span>
                  </div>

                  {/* Card Information */}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-white group-hover:text-lime-400 transition">
                      {venue.name}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400 flex items-center gap-1">
                      📍 {venue.location}
                    </p>
                    <p className="mt-2.5 text-xs text-zinc-500 line-clamp-2">
                      {venue.description}
                    </p>
                  </div>
                </div>

                {/* Footer: Price, View Details & Book Now */}
                <div className="border-t border-zinc-800/80 p-5 pt-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                      Price
                    </span>
                    <span className="text-sm font-black text-white">
                      ৳{venue.pricePerHour}{" "}
                      <span className="text-[10px] font-normal text-zinc-400">/hr</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/facilities/${venue._id}`}
                      className="flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950/80 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:border-zinc-500 hover:text-white active:scale-95"
                    >
                      View Details
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleBookNow(venue._id)}
                      className="flex items-center justify-center rounded-xl bg-lime-400 py-2 text-xs font-black uppercase tracking-wider text-zinc-950 shadow-md shadow-lime-400/10 transition hover:bg-lime-300 active:scale-95"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}