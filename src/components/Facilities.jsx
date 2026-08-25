"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/facilities"
        );

        const data = await response.json();

        // Show maximum 6 featured facilities
        setFacilities(data.slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch facilities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  return (
    <section className="bg-zinc-950 px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-lime-400">
              Explore & Play
            </p>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Featured Facilities
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
              Discover some of the best sports facilities and book your
              perfect game.
            </p>
          </div>

          <a
            href="/facilities"
            className="text-sm font-semibold text-lime-400 hover:text-lime-300"
          >
            View All Facilities →
          </a>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-[420px] animate-pulse rounded-2xl bg-zinc-900"
              />
            ))}
          </div>
        )}

        {/* Facility Cards */}
        {!loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility) => (
              <div
                key={facility._id}
                className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition-all duration-300 hover:-translate-y-1 hover:border-lime-400/50"
              >
                {/* Image */}
                <div className="h-56 w-full overflow-hidden bg-zinc-800">
                  <img
                    src={facility.image}
                    alt={facility.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-5">

                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-lime-400/10 px-3 py-1 text-xs font-bold text-lime-400">
                      {facility.sportType}
                    </span>

                    <span className="text-sm font-bold text-white">
                      ৳{facility.pricePerHour}
                      <span className="font-normal text-zinc-500">
                        /hr
                      </span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white">
                    {facility.name}
                  </h3>

                  <p className="mt-2 text-sm text-zinc-400">
                    📍 {facility.location}
                  </p>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-500">
                    {facility.description}
                  </p>

                  {/* Book Button */}
                  <Button
                    as="a"
                    href={`/facilities/${facility._id}`}
                    variant="primary"
                    className="mt-5 w-full rounded-xl bg-lime-400 font-bold text-zinc-950 hover:bg-lime-300"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Facilities */}
        {!loading && facilities.length === 0 && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 py-16 text-center">
            <h3 className="text-xl font-bold">
              No facilities available
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Facilities will appear here once they are added.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}