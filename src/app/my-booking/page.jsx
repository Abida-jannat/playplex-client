"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authClient } from "@/lib/auth-client";

export default function MyBookingsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch user's bookings
  const fetchMyBookings = useCallback(async () => {
    const userEmail = session?.user?.email;
    if (!userEmail) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/my-booking?email=${encodeURIComponent(userEmail)}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load your bookings.");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email, API_BASE_URL]);

  useEffect(() => {
    if (!isPending) {
        if (session?.user?.email) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern//
        fetchMyBookings();
      } else {
        setLoading(false);
      }
    }
  }, [isPending, session?.user?.email, fetchMyBookings]);

  // Cancel Booking Handler
  const handleCancelBooking = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      setCancellingId(id);

      const res = await fetch(`${API_BASE_URL}/my-booking/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to cancel booking");
      }

      toast.success("Booking cancelled successfully!");

      // Remove deleted item immediately from state
      setBookings((prev) => prev.filter((booking) => booking._id !== id));
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking.");
    } finally {
      setCancellingId(null);
    }
  };

  // Loading Screen
  if (isPending || loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-black font-semibold text-lime-400">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-lime-400 border-t-transparent" />
          Loading your bookings...
        </div>
      </div>
    );
  }

  // Unauthenticated Guard Screen
  if (!session) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-black p-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center shadow-2xl">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Please log in to view your court reservations.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block w-full rounded-xl bg-lime-400 px-6 py-3 font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <ToastContainer position="top-right" theme="dark" />

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            My <span className="text-lime-400">Bookings</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            View your upcoming court reservations and manage schedules.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/50 p-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-2xl text-lime-400">
              📅
            </div>
            <h3 className="text-xl font-bold">No bookings found</h3>
            <p className="mt-1 text-sm text-zinc-400">
              You haven&apos;t reserved any slots yet.
            </p>
            <Link
              href="/facilities"
              className="mt-6 inline-block rounded-xl bg-lime-400 px-6 py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Explore Facilities
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const currentStatus = (booking.status || "confirmed").toLowerCase();

              return (
                <div
                  key={booking._id}
                  className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl transition-all duration-300 hover:border-zinc-700"
                >
                  <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-2 md:grid-cols-6">
                    {/* Facility Name */}
                    <div className="md:col-span-1">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
                        Facility
                      </p>
                      <h3 className="text-base font-bold text-white">
                        {booking.facilityName || booking.name || "Sports Court"}
                      </h3>
                    </div>

                    {/* Booking Date */}
                    <div>
                      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
                        Date
                      </p>
                      <p className="text-sm text-zinc-300">
                        {booking.bookingDate || booking.date || "N/A"}
                      </p>
                    </div>

                    {/* Time Slot */}
                    <div>
                      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
                        Time Slot
                      </p>
                      <p className="text-sm text-zinc-300">
                        {booking.timeSlot || booking.slot || "N/A"}
                      </p>
                    </div>

                    {/* Price */}
                    <div>
                      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
                        Price
                      </p>
                      <p className="text-sm font-bold text-lime-400">
                        ৳{booking.totalPrice || booking.price || 0}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div>
                      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
                        Status
                      </p>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          currentStatus === "cancelled"
                            ? "border border-red-500/20 bg-red-500/10 text-red-400"
                            : "border border-lime-400/20 bg-lime-400/10 text-lime-400"
                        }`}
                      >
                        {booking.status || "confirmed"}
                      </span>
                    </div>

                    {/* Cancel Action */}
                    <div>
                      {currentStatus !== "cancelled" ? (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={cancellingId === booking._id}
                          className="w-full rounded-xl border border-red-500/20 bg-red-500/10 py-2.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                        >
                          {cancellingId === booking._id
                            ? "Cancelling..."
                            : "Cancel Booking"}
                        </button>
                      ) : (
                        <span className="block text-center text-xs text-zinc-600">
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}