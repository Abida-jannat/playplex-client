"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";


const getAuthToken = async () => {
  try {
    const res = await fetch("/api/get-token");
    if (!res.ok) return null;
    const data = await res.json();
    return data.token;
  } catch {
    return null;
  }
};

const categoryFallbacks = {
  Football: "https://images.unsplash.com/photo-1529900245534-47fbf8204b61?auto=format&fit=crop&q=80&w=800",
  Badminton: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800",
  Tennis: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800",
  Swimming: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=800",
  Cricket: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800",
  Basketball: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800",
  Default: "https://images.unsplash.com/photo-1518604666864-7423946f3c5e?auto=format&fit=crop&q=80&w=800",
};

export default function FacilityDetailsPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { data: session, isPending } = useSession();

  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [hours, setHours] = useState(1);


  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("Please login to view facility details and book.");
      router.replace(`/login?redirect=/facilities/${id}`);
    }
  }, [session, isPending, router, id]);

 
  useEffect(() => {
    async function fetchFacility() {
      try {
        const res = await fetch(`${API_URL}/api/facilities/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFacility(data);
          if (data.availableTimeSlots) {
            setTimeSlot(data.availableTimeSlots);
          }
        } else {
          toast.error("Facility not found");
        }
      } catch (err) {
        console.error("Error fetching facility details:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchFacility();
    }
  }, [id]);

  // Handle Booking Submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!bookingDate) {
      toast.error("Please select a booking date.");
      return;
    }

    if (!timeSlot) {
      toast.error("Please specify a preferred time slot.");
      return;
    }

    setBookingLoading(true);

    try {
      const token = await getAuthToken();
      const totalPrice = Number(facility.pricePerHour) * Number(hours);

      const bookingPayload = {
        facilityId: facility._id,
        facilityName: facility.name,
        userEmail: session?.user?.email,
        userName: session?.user?.name || "Athlete",
        bookingDate,
        timeSlot,
        hours: Number(hours),
        pricePerHour: Number(facility.pricePerHour),
        totalPrice,
      };

      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify(bookingPayload),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Booking confirmed with status: pending!");
        router.push("/my-booking");
      } else {
        throw new Error(result.error || "Failed to complete booking");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong while booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime-400 border-t-transparent" />
      </div>
    );
  }

  if (!session?.user || !facility) return null;

  const fallback = categoryFallbacks[facility.category] || categoryFallbacks.Default;
  const totalPrice = Number(facility.pricePerHour) * Number(hours);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-10 sm:px-8">
      {/* Back Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/facilities"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-lime-400 transition"
        >
          ← Back to All Facilities
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: All Facility Data Display */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
            <img
              src={facility.image || fallback}
              alt={facility.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallback;
              }}
              className="h-full w-full object-cover"
            />
            <span className="absolute top-4 left-4 rounded-lg bg-zinc-950/80 backdrop-blur-md border border-zinc-800 px-3 py-1 text-xs font-bold uppercase tracking-wider text-lime-400">
              {facility.category}
            </span>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
            <h1 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white">
              {facility.name}
            </h1>
            <p className="mt-2 text-xs text-zinc-400 flex items-center gap-1.5">
              📍 <span>{facility.location}</span>
            </p>

            {/* Quick Specs Badges */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 border-y border-zinc-800 py-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Capacity
                </span>
                <span className="text-sm font-bold text-white">
                  {facility.capacity || "10-14"} Players
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Hourly Rate
                </span>
                <span className="text-sm font-bold text-lime-400">
                  ৳{facility.pricePerHour} /hr
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Operating Hours
                </span>
                <span className="text-sm font-bold text-white">
                  {facility.availableTimeSlots || "Flexible"}
                </span>
              </div>
            </div>

            {/* Full Description */}
            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Facility Overview
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                {facility.description}
              </p>
            </div>

            {facility.ownerEmail && (
              <div className="mt-6 pt-4 border-t border-zinc-800">
                <span className="text-[10px] font-medium text-zinc-500 block">
                  Managed By Arena Host:
                </span>
                <span className="text-xs font-semibold text-zinc-300">
                  {facility.ownerEmail}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Booking Form */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            <div className="border-b border-zinc-800 pb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-lime-400">
                Slot Reservation
              </span>
              <h2 className="mt-3 text-xl font-black italic uppercase tracking-tight text-white">
                Book Arena
              </h2>
              <p className="mt-1 text-xs text-zinc-400">
                Select your preferred date and slot to reserve your match.
              </p>
            </div>

            <form onSubmit={handleBookingSubmit} className="mt-6 space-y-4">
              {/* Facility Name (Read-Only) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Facility Name
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={facility.name}
                  className="mt-1.5 w-full cursor-not-allowed rounded-xl border border-zinc-800 bg-zinc-950/60 px-3.5 py-2.5 text-xs font-semibold text-zinc-300"
                />
              </div>

              {/* Booking Date */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Booking Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
                />
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Time Slot
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 06:00 PM - 08:00 PM"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
                />
              </div>

              {/* Hours Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Duration (Hours)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="12"
                  value={hours}
                  onChange={(e) => setHours(Math.max(1, Number(e.target.value)))}
                  className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
                />
              </div>

              {/* Live Price Breakdown & Total Price */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Rate:</span>
                  <span>৳{facility.pricePerHour} × {hours} hr(s)</span>
                </div>
                <div className="flex justify-between items-center border-t border-zinc-800 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Total Price:
                  </span>
                  <span className="text-lg font-black text-lime-400">
                    ৳{totalPrice}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full rounded-xl bg-lime-400 py-3 text-xs font-black uppercase tracking-wider text-zinc-950 shadow-md shadow-lime-400/10 transition hover:bg-lime-300 active:scale-95 disabled:opacity-50"
              >
                {bookingLoading ? "Reserving Slot..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}