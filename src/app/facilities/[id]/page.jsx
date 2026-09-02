"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { authClient } from "@/lib/auth-client";

export default function FacilityDetailsPage({ params: paramsPromise }) {
  // Unwrap params for compatibility with modern Next.js App Router
  const params = use(paramsPromise);
  const router = useRouter();

  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [hours, setHours] = useState(1);

  // Base API URL configuration
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/facilities/${params.id}`);

        if (!response.ok) {
          throw new Error("Facility not found");
        }

        const data = await response.json();
        setFacility(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load facility.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchFacility();
    }
  }, [params.id, API_BASE_URL]);

  const totalPrice = facility ? Number(facility.price) * Number(hours) : 0;

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!session) {
      router.push("/login");
      return;
    }

    if (!bookingDate || !timeSlot || !hours) {
      toast.error("Please fill in all booking fields.");
      return;
    }

    setBookingLoading(true);

    try {
      const bookingData = {
        facilityId: facility._id,
        facilityName: facility.name,
        ownerEmail: facility.ownerEmail,
        bookingDate,
        timeSlot,
        hours: Number(hours),
        pricePerHour: Number(facility.price),
        totalPrice,
        userEmail: session.user.email,
        userName: session.user.name,
        status: "pending",
        createdAt: new Date(),
      };

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Booking failed.");
        return;
      }

      toast.success("Booking request submitted successfully!");

      setTimeout(() => {
        router.push("/my-booking");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading || sessionLoading) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-black text-white">
        <p className="font-semibold text-lime-400">Loading facility...</p>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-black px-4 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Facility Not Found</h1>
          <Link
            href="/facilities"
            className="mt-6 inline-flex rounded-xl bg-lime-400 px-6 py-3 font-bold text-black hover:bg-lime-300"
          >
            ← Back to Facilities
          </Link>
        </div>
      </div>
    );
  }

  const todayDateStr = new Date().toISOString().split("T")[0];

  return (
    <section className="min-h-screen bg-black py-12 text-white sm:py-16">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/facilities"
          className="mb-8 inline-flex text-sm font-semibold text-zinc-400 transition hover:text-lime-400"
        >
          ← Back to All Facilities
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* FACILITY DETAILS */}
          <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 lg:col-span-2">
            <div className="relative h-[300px] overflow-hidden sm:h-[420px]">
              <Image
                src={facility.image}
                alt={facility.name}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute left-5 top-5">
                <span className="rounded-full bg-lime-400 px-4 py-2 text-sm font-bold text-black">
                  {facility.type}
                </span>
              </div>

              <div className="absolute bottom-5 right-5 rounded-2xl bg-black/80 px-5 py-3 backdrop-blur-sm">
                <p className="text-2xl font-bold text-lime-400">৳{facility.price}</p>
                <p className="text-xs text-zinc-400">per hour</p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <h1 className="text-3xl font-bold sm:text-4xl">{facility.name}</h1>

              <div className="mt-4 flex items-center gap-2 text-zinc-400">
                <span>📍</span>
                <span>{facility.location}</span>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                  <p className="text-xs uppercase tracking-wider text-zinc-500">Facility Type</p>
                  <p className="mt-2 font-semibold text-white">{facility.type}</p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                  <p className="text-xs uppercase tracking-wider text-zinc-500">Capacity</p>
                  <p className="mt-2 font-semibold text-white">{facility.capacity} people</p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                  <p className="text-xs uppercase tracking-wider text-zinc-500">Price Per Hour</p>
                  <p className="mt-2 font-semibold text-lime-400">৳{facility.price}</p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                  <p className="text-xs uppercase tracking-wider text-zinc-500">Available Time</p>
                  <p className="mt-2 font-semibold text-white">{facility.availableTimeSlots}</p>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-bold">About This Facility</h2>
                <p className="mt-3 leading-7 text-zinc-400">{facility.description}</p>
              </div>

              {facility.ownerEmail && (
                <div className="mt-8 border-t border-zinc-800 pt-6">
                  <p className="text-xs uppercase tracking-wider text-zinc-500">Facility Owner</p>
                  <p className="mt-2 text-sm text-zinc-300">{facility.ownerEmail}</p>
                </div>
              )}
            </div>
          </div>

          {/* BOOKING FORM */}
          <div className="h-fit rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl sm:p-8">
            <div className="mb-7">
              <p className="text-xs font-semibold uppercase tracking-[4px] text-lime-400">
                Reserve Now
              </p>
              <h2 className="mt-2 text-2xl font-bold">Book This Facility</h2>
              <p className="mt-2 text-sm text-zinc-500">Choose your preferred date and time.</p>
            </div>

            <form onSubmit={handleBooking} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Facility Name
                </label>
                <input
                  type="text"
                  value={facility.name}
                  readOnly
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-400 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Booking Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={todayDateStr}
                  required
                  disabled={bookingLoading}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">Time Slot</label>
                <input
                  type="text"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  placeholder="e.g. 6 PM - 7 PM"
                  required
                  disabled={bookingLoading}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">Hours</label>
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  min="1"
                  max="24"
                  required
                  disabled={bookingLoading}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 disabled:opacity-50"
                />
              </div>

              <div className="rounded-2xl border border-lime-400/20 bg-lime-400/5 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Price / Hour</span>
                  <span className="font-semibold text-white">৳{facility.price}</span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Hours</span>
                  <span className="font-semibold text-white">{hours}</span>
                </div>

                <div className="my-4 border-t border-zinc-800" />

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Total Price</span>
                  <span className="text-2xl font-black text-lime-400">৳{totalPrice}</span>
                </div>
              </div>

              {session?.user?.email && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Booking Email
                  </label>
                  <input
                    type="email"
                    value={session.user.email}
                    readOnly
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-400 outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full rounded-xl bg-lime-400 py-3.5 text-sm font-bold text-black transition hover:scale-[1.02] hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {bookingLoading ? "Booking..." : "Confirm Booking →"}
              </button>

              {!session && (
                <p className="text-center text-xs text-zinc-500">
                  You must login to book this facility.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}