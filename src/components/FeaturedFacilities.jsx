"use client";

import { useEffect, useState } from "react";

export default function FeaturedFacilities() {
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/facilities")
      .then((res) => res.json())
      .then((data) => {
        setFacilities(data);
      })
      .catch((error) => {
        console.error("Failed to fetch facilities:", error);
      });
  }, []);

  return (
    <section className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">

          <div>
            <p className="text-lime-400 font-semibold uppercase tracking-[4px] text-sm mb-3">
              Find Your Game
            </p>

            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Featured <span className="text-lime-400">Facilities</span>
            </h2>

            <p className="text-gray-400 mt-4 max-w-xl">
              Discover premium sports facilities and book your perfect
              playing space with PlayPlex.
            </p>
          </div>

          <button className="mt-6 md:mt-0 text-lime-400 font-semibold hover:text-white transition">
            View All Facilities →
          </button>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">

          {facilities.slice(0, 6).map((facility) => (

            <div
              key={facility._id}
              className="group bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden hover:border-lime-400/50 transition duration-300"
            >

              {/* Image */}
              <div className="relative h-60 overflow-hidden">

                <img
                  src={facility.image}
                  alt={facility.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                {/* Sport Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-lime-400 text-black px-3 py-1.5 rounded-full text-xs font-bold">
                    {facility.sport}
                  </span>
                </div>

                {/* Price */}
                <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <p className="text-lime-400 font-bold">
                    ৳{facility.price}
                  </p>
                  <p className="text-gray-400 text-xs">
                    per session
                  </p>
                </div>

              </div>

              {/* Card Content */}
              <div className="p-6">

                <h3 className="text-xl font-bold text-white group-hover:text-lime-400 transition">
                  {facility.name}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-2 mt-3 text-gray-400">
                  <span>📍</span>
                  <span className="text-sm">
                    {facility.location}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm mt-4 line-clamp-2">
                  {facility.description}
                </p>

                {/* Bottom */}
                <div className="flex items-center justify-between mt-6 pt-5 border-t border-zinc-800">

                  <div>
                    <p className="text-xs text-gray-500">
                      Availability
                    </p>

                    <p className="text-white font-semibold mt-1">
                      {facility.availableSlots} slots
                    </p>
                  </div>

                  <button className="bg-lime-400 text-black px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-lime-300 hover:scale-105 transition">
                    Book Now →
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}