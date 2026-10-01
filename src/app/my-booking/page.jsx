"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";


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

export default function MyBookingsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTargetId, setCancelTargetId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // Private Route Protection
  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("Please login to view your bookings.");
      router.replace("/login?redirect=/my-booking");
    }
  }, [session, isPending, router]);

  const loadBookings = async () => {
    if (!session?.user?.email) return;
    setLoading(true);
    try {
      const token = await getAuthToken();

      const res = await fetch(
        `http://localhost:5000/api/my-bookings?email=${encodeURIComponent(session.user.email)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include", // Added: passes HTTPOnly JWT cookie
        }
      );
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch {
      toast.error("Failed to load your reservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      // eslint-disable-next-line
      loadBookings();
    }
  }, [session?.user?.email]);

  const handleCancelBooking = async () => {
    if (!cancelTargetId) return;
    setCancelling(true);
    try {
      const token = await getAuthToken();

      const res = await fetch(
        `http://localhost:5000/api/bookings/${cancelTargetId}?email=${encodeURIComponent(
          session.user.email
        )}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include", // Added: passes HTTPOnly JWT cookie
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Booking cancelled successfully.");
        setCancelTargetId(null);
        setBookings((prev) => prev.filter((b) => b._id !== cancelTargetId));
      } else {
        throw new Error(data.error || "Failed to cancel reservation.");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancelling(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime-400 border-t-transparent" />
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-10 sm:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-lime-400">
            Player Dashboard
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white">
            My <span className="text-lime-400">Bookings</span>
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Track your reserved match slots, dates, and booking status.
          </p>
        </div>

        <Link
          href="/facilities"
          className="rounded-xl bg-lime-400 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-zinc-950 transition hover:bg-lime-300 active:scale-95"
        >
          Book Another Arena
        </Link>
      </div>

      {/* Bookings Table / Empty State */}
      {bookings.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">
          <p className="text-zinc-400 text-sm">You have no active arena bookings.</p>
          <Link
            href="/facilities"
            className="mt-4 inline-block rounded-xl border border-lime-400/30 bg-lime-400/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-lime-400 hover:bg-lime-400 hover:text-zinc-950 transition"
          >
            Explore Facilities
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/50">
          <table className="w-full text-left text-xs text-zinc-400">
            <thead className="border-b border-zinc-800 bg-zinc-950/80 uppercase tracking-wider text-zinc-400 text-[10px] font-bold">
              <tr>
                <th className="py-4 px-6">Facility Name</th>
                <th className="py-4 px-6">Booking Date</th>
                <th className="py-4 px-6">Time Slot</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-zinc-800/20 transition">
                  <td className="py-4 px-6 font-bold text-white">
                    {booking.facilityName}
                  </td>
                  <td className="py-4 px-6">{booking.bookingDate}</td>
                  <td className="py-4 px-6 font-medium text-zinc-300">
                    {booking.timeSlot} ({booking.hours} hr{booking.hours > 1 ? "s" : ""})
                  </td>
                  <td className="py-4 px-6 font-bold text-lime-400">
                    ৳{booking.totalPrice}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                        booking.status === "confirmed"
                          ? "border-green-500/30 bg-green-500/10 text-green-400"
                          : booking.status === "cancelled"
                          ? "border-red-500/30 bg-red-500/10 text-red-400"
                          : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {booking.status || "pending"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => setCancelTargetId(booking._id)}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-red-400 transition hover:bg-red-500 hover:text-white"
                    >
                      Cancel Booking
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal For Cancel Booking */}
      {cancelTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white">Cancel Reservation</h3>
            <p className="mt-2 text-xs text-zinc-400">
              Are you sure you want to cancel this booking?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={cancelling}
                onClick={() => setCancelTargetId(null)}
                className="rounded-xl border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
              >
                Keep Booking
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancelBooking}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-red-500"
              >
                {cancelling ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}