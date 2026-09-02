"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function FacilitiesPage() {
  const router = useRouter();

  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Better Auth session
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  // Fetch Facilities
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${baseUrl}/facilities`);

        if (!response.ok) {
          throw new Error("Failed to fetch facilities");
        }

        const data = await response.json();
        setFacilities(data);
      } catch (error) {
        console.error("Failed to fetch facilities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);


  const handleBookNow = (facilityId) => {
    if (!session) {
      router.push("/login");
      return;
    }
    router.push(`/facilities/${facilityId}`);
  };

  if (loading || sessionLoading) {
    return (
      <section className="min-h-screen bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <p className="font-semibold text-lime-400">Loading facilities...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-black py-20 text-white">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[4px] text-lime-400">
            Explore PlayPlex
          </p>
          <h1 className="text-4xl font-bold md:text-5xl">
            All <span className="text-lime-400">Facilities</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Explore all available sports facilities and find the perfect place for your next game.
          </p>
        </div>

        {/* Empty State */}
        {facilities.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-12 text-center">
            <h2 className="text-2xl font-bold">No Facilities Found</h2>
            <p className="mt-3 text-zinc-500">
              There are currently no facilities available.
            </p>
          </div>
        ) : (
          /* Facilities Grid */
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility) => (
              <div
                key={facility._id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 transition duration-300 hover:border-lime-400/50"
              >
                {/* Image & Badges */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={facility.image}
                    alt={facility.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Sport Type */}
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-lime-400 px-3 py-1.5 text-xs font-bold text-black">
                      {facility.type}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="absolute bottom-4 right-4 rounded-xl bg-black/80 px-4 py-2 backdrop-blur-sm">
                    <p className="font-bold text-lime-400">৳{facility.price}</p>
                    <p className="text-xs text-gray-400">per hour</p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-xl font-bold text-white transition group-hover:text-lime-400">
                    {facility.name}
                  </h2>

                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                    <span>📍</span>
                    <span>{facility.location}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                    <span>👥</span>
                    <span>Capacity: {facility.capacity}</span>
                  </div>

                  <p className="mt-4 line-clamp-2 text-sm text-gray-500">
                    {facility.description}
                  </p>

                  {/* Footer Actions */}
                  <div className="mt-auto pt-6">
                    <div className="mb-4 text-xs text-gray-500">
                      <span>Available Slots: </span>
                      <span className="font-semibold text-white">
                        {facility.availableTimeSlots}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        href={`/facilities/${facility._id}`}
                        className="flex-1 rounded-xl border border-zinc-800 py-2.5 text-center text-xs font-semibold text-zinc-300 transition hover:border-zinc-600 hover:text-white"
                      >
                        Details
                      </Link>

                      <button
                        onClick={() => handleBookNow(facility._id)}
                        className="flex-1 rounded-xl bg-lime-400 py-2.5 text-xs font-bold text-black transition hover:scale-[1.02] hover:bg-lime-300"
                      >
                        Book Now →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}