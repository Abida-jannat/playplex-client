"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function FeaturedFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Base API URL configuration
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${API_BASE_URL}/facilities`, {
      credentials: "include", // Crucial for sending authentication cookies cross-origin if protected, or good practice consistency
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch facilities");
        }
        return res.json();
      })
      .then((data) => {
        setFacilities(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch facilities:", error);
        setLoading(false);
      });
  }, [API_BASE_URL]);

  return (
    <section className="bg-black py-20">
      <div className="mx-auto max-w-7xl px-6">

        {/* Section Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[4px] text-lime-400">
              Find Your Game
            </p>

            <h2 className="text-4xl font-bold text-white md:text-5xl">
              Featured <span className="text-lime-400">Facilities</span>
            </h2>

            <p className="mt-4 max-w-xl text-gray-400">
              Discover premium sports facilities and book your perfect
              playing space with PlayPlex.
            </p>
          </div>

          <Link
            href="/facilities"
            className="mt-6 font-semibold text-lime-400 transition hover:text-white md:mt-0"
          >
            View All Facilities →
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-16 text-center">
            <p className="text-gray-400">Loading facilities...</p>
          </div>
        )}

        {/* No Facilities */}
        {!loading && facilities.length === 0 && (
          <div className="rounded-3xl border border-zinc-800 py-16 text-center">
            <h3 className="text-xl font-bold text-white">
              No facilities available
            </h3>

            <p className="mt-2 text-gray-500">
              Facilities will appear here once they are added.
            </p>
          </div>
        )}

        {/* Cards */}
        {!loading && facilities.length > 0 && (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">

            {facilities.slice(0, 6).map((facility) => (

              <div
                key={facility._id}
                className="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 transition duration-300 hover:border-lime-400/50"
              >

                {/* Image */}
                <div className="relative h-60 overflow-hidden">

                  <img
                    src={facility.image}
                    alt={facility.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                  {/* Sport Badge */}
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-lime-400 px-3 py-1.5 text-xs font-bold text-black">
                      {facility.type || facility.sport}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="absolute bottom-4 right-4 rounded-xl bg-black/80 px-4 py-2 backdrop-blur-sm">
                    <p className="font-bold text-lime-400">
                      ৳{facility.pricePerHour || facility.price}
                    </p>

                    <p className="text-xs text-gray-400">
                      per hour
                    </p>
                  </div>

                </div>

                {/* Card Content */}
                <div className="p-6">

                  <h3 className="text-xl font-bold text-white transition group-hover:text-lime-400">
                    {facility.name}
                  </h3>

                  {/* Location */}
                  <div className="mt-3 flex items-center gap-2 text-gray-400">
                    <span>📍</span>

                    <span className="text-sm">
                      {facility.location}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-4 line-clamp-2 text-sm text-gray-500">
                    {facility.description}
                  </p>

                  {/* Bottom */}
                  <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-5">

                    <div>
                      <p className="text-xs text-gray-500">
                        Capacity
                      </p>

                      <p className="mt-1 font-semibold text-white">
                        {facility.capacity} people
                      </p>
                    </div>

                    {/* Book Now */}
                    <Link
                      href={`/facilities/${facility._id}`}
                      className="rounded-xl bg-lime-400 px-5 py-2.5 text-sm font-bold text-black transition hover:scale-105 hover:bg-lime-300"
                    >
                      Book Now →
                    </Link>

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