"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authClient } from "@/lib/auth-client";

export default function ManageFacilitiesPage() {
  const { data: session, isPending } = authClient.useSession();

  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingFacility, setEditingFacility] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Base API URL configuration
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch My Facilities
  const fetchMyFacilities = useCallback(async () => {
    const userEmail = session?.user?.email;
    if (!userEmail) return;

    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/my-facilities?email=${encodeURIComponent(userEmail)}`,
        {
          credentials: "include", // Crucial for sending authentication cookies cross-origin
        }
      );

      if (!res.ok) throw new Error("Failed to fetch facilities");

      const data = await res.json();
      setFacilities(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch facilities");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email, API_BASE_URL]);

  useEffect(() => {
    if (!isPending) {
      if (session?.user?.email) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern//
        fetchMyFacilities();
      } else {
        setLoading(false);
      }
    }
  }, [isPending, session?.user?.email, fetchMyFacilities]);

  // Delete Facility
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this facility?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const res = await fetch(`${API_BASE_URL}/facilities/${id}`, {
        method: "DELETE",
        credentials: "include", // Crucial for sending authentication cookies cross-origin
      });

      if (!res.ok) throw new Error("Failed to delete facility");

      toast.success("Facility deleted successfully!");
      setFacilities((prev) => prev.filter((facility) => facility._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete facility.");
    } finally {
      setDeletingId(null);
    }
  };

  // Update Facility
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingFacility) return;

    try {
      setUpdating(true);

      const res = await fetch(
        `${API_BASE_URL}/facilities/${editingFacility._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Crucial for sending authentication cookies cross-origin
          body: JSON.stringify(editingFacility),
        }
      );

      if (!res.ok) throw new Error("Failed to update facility");

      toast.success("Facility updated successfully!");
      setEditingFacility(null);
      await fetchMyFacilities();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update facility.");
    } finally {
      setUpdating(false);
    }
  };

  // Loading Screen
  if (isPending || loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-black font-semibold text-lime-400">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-lime-400 border-t-transparent" />
          Loading facilities...
        </div>
      </div>
    );
  }

  // Not Logged In Screen
  if (!session) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-black p-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center shadow-2xl">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Please log in to manage your facilities.
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

      {/* Main Page Container */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header Section */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Manage <span className="text-lime-400">My Facilities</span>
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Update details, adjust pricing, or remove existing listings.
            </p>
          </div>

          <Link
            href="/facilities/add"
            className="rounded-xl bg-lime-400 px-5 py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            + Add New Facility
          </Link>
        </div>

        {/* Empty State */}
        {facilities.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/50 p-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-2xl text-lime-400">
              ⚡
            </div>
            <h3 className="text-xl font-bold">No facilities found</h3>
            <p className="mt-1 text-sm text-zinc-400">
              You haven&apos;t added any facilities to PlayPlex yet.
            </p>
            <Link
              href="/facilities/add"
              className="mt-6 rounded-xl bg-zinc-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
            >
              Create your first listing
            </Link>
          </div>
        ) : (
          /* Facility Cards Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility) => (
              <div
                key={facility._id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-950 p-5 transition-all duration-300 hover:border-zinc-700 hover:shadow-xl hover:shadow-lime-400/5"
              >
                <div>
                  <div className="relative mb-4 h-48 w-full overflow-hidden rounded-2xl bg-zinc-900">
                    <img
                      src={facility.image || "/placeholder.jpg"}
                      alt={facility.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-lime-400 backdrop-blur-md">
                      {facility.type || "Sports"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold tracking-tight">
                    {facility.name}
                  </h3>

                  <p className="mt-1 text-xs text-zinc-400">
                    📍 {facility.location || "Location not set"}
                  </p>

                  <p className="mt-3 text-lg font-bold text-lime-400">
                    ৳{facility.pricePerHour || facility.price || 0}{" "}
                    <span className="text-xs font-normal text-zinc-400">
                      / hour
                    </span>
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3 border-t border-zinc-900 pt-4">
                  <button
                    onClick={() => setEditingFacility({ ...facility })}
                    className="flex-1 rounded-xl bg-zinc-800 py-2.5 text-xs font-bold text-white transition-colors hover:bg-zinc-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(facility._id)}
                    disabled={deletingId === facility._id}
                    className="flex-1 rounded-xl border border-red-500/20 bg-red-500/10 py-2.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                  >
                    {deletingId === facility._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal Overlay */}
      {editingFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-xl font-bold">Update Facility</h2>
              <button
                onClick={() => setEditingFacility(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-sm">
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-400">
                  Facility Name
                </label>
                <input
                  type="text"
                  value={editingFacility.name || ""}
                  onChange={(e) =>
                    setEditingFacility({
                      ...editingFacility,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-white focus:border-lime-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-400">
                  Location
                </label>
                <input
                  type="text"
                  value={editingFacility.location || ""}
                  onChange={(e) =>
                    setEditingFacility({
                      ...editingFacility,
                      location: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-white focus:border-lime-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-zinc-400">
                    Price (৳/hr)
                  </label>
                  <input
                    type="number"
                    value={
                      editingFacility.pricePerHour ||
                      editingFacility.price ||
                      ""
                    }
                    onChange={(e) =>
                      setEditingFacility({
                        ...editingFacility,
                        pricePerHour: e.target.value,
                        price: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-white focus:border-lime-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-zinc-400">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={editingFacility.capacity || ""}
                    onChange={(e) =>
                      setEditingFacility({
                        ...editingFacility,
                        capacity: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-white focus:border-lime-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-400">
                  Description
                </label>
                <textarea
                  value={editingFacility.description || ""}
                  onChange={(e) =>
                    setEditingFacility({
                      ...editingFacility,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-white focus:border-lime-400 focus:outline-none"
                  rows="3"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 rounded-xl bg-lime-400 py-3 font-bold text-black transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  disabled={updating}
                  onClick={() => setEditingFacility(null)}
                  className="flex-1 rounded-xl bg-zinc-800 py-3 font-semibold text-white transition-colors hover:bg-zinc-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}