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

export default function ManageFacilitiesPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingFacility, setEditingFacility] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Private Route Check
  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("Please login to manage your facilities.");
      router.replace("/login?redirect=/facilities/manage");
    }
  }, [session, isPending, router]);

  const loadFacilities = async () => {
    if (!session?.user?.email) return;
    setLoading(true);
    try {
      const token = await getAuthToken();

      const res = await fetch(
        `http://localhost:5000/api/my-facilities?email=${encodeURIComponent(session.user.email)}`,
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
        setFacilities(data);
      }
    } catch {
      toast.error("Failed to load facilities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      // eslint-disable-next-line
      loadFacilities();
    }
  }, [session?.user?.email]);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const token = await getAuthToken();

      const res = await fetch(`http://localhost:5000/api/facilities/${editingFacility._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include", // Added: passes HTTPOnly JWT cookie
        body: JSON.stringify({
          ownerEmail: session.user.email,
          name: editingFacility.name,
          category: editingFacility.category,
          location: editingFacility.location,
          pricePerHour: editingFacility.pricePerHour,
          capacity: editingFacility.capacity,
          availableTimeSlots: editingFacility.availableTimeSlots,
          description: editingFacility.description,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Facility updated successfully!");
        setEditingFacility(null);
        loadFacilities();
      } else {
        throw new Error(data.error || "Update failed.");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setActionLoading(true);
    try {
      const token = await getAuthToken();

      const res = await fetch(
        `http://localhost:5000/api/facilities/${deleteTargetId}?email=${encodeURIComponent(
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
        toast.success("Facility deleted successfully!");
        setDeleteTargetId(null);
        setFacilities((prev) => prev.filter((item) => item._id !== deleteTargetId));
      } else {
        throw new Error(data.error || "Deletion failed.");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-lime-400">
            Host Controls
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white">
            Manage My <span className="text-lime-400">Facilities</span>
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Maintain, edit details, or remove facilities you own.
          </p>
        </div>

        <Link
          href="/facilities/add"
          className="rounded-xl bg-lime-400 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-zinc-950 transition hover:bg-lime-300 active:scale-95"
        >
          + Add New Arena
        </Link>
      </div>

      {facilities.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">
          <p className="text-zinc-400 text-sm">You have not registered any facilities yet.</p>
          <Link
            href="/facilities/add"
            className="mt-4 inline-block rounded-xl border border-lime-400/30 bg-lime-400/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-lime-400 hover:bg-lime-400 hover:text-zinc-950 transition"
          >
            Create Arena
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/50">
          <table className="w-full text-left text-xs text-zinc-400">
            <thead className="border-b border-zinc-800 bg-zinc-950/80 uppercase tracking-wider text-zinc-400 text-[10px] font-bold">
              <tr>
                <th className="py-4 px-6">Facility</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Hourly Rate</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {facilities.map((venue) => (
                <tr key={venue._id} className="hover:bg-zinc-800/20 transition">
                  <td className="py-4 px-6 font-bold text-white flex items-center gap-3">
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="h-10 w-14 rounded-lg object-cover bg-zinc-800"
                    />
                    <span className="truncate max-w-[180px]">{venue.name}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-[10px] font-bold uppercase text-lime-400">
                      {venue.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 truncate max-w-[160px]">{venue.location}</td>
                  <td className="py-4 px-6 font-bold text-white">৳{venue.pricePerHour}</td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditingFacility(venue)}
                      className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-200 transition hover:border-lime-400 hover:text-lime-400"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTargetId(venue._id)}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-red-400 transition hover:bg-red-500 hover:text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal Before Delete */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white">Confirm Facility Deletion</h3>
            <p className="mt-2 text-xs text-zinc-400">
              Are you sure you want to delete this facility? This operation cannot be reversed.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setDeleteTargetId(null)}
                className="rounded-xl border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={confirmDelete}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-red-500"
              >
                {actionLoading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Facility Modal */}
      {editingFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="my-8 w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-black italic uppercase text-white">
                Update <span className="text-lime-400">Facility</span>
              </h3>
              <button
                onClick={() => setEditingFacility(null)}
                className="text-zinc-500 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400">Name</label>
                <input
                  type="text"
                  required
                  value={editingFacility.name}
                  onChange={(e) =>
                    setEditingFacility({ ...editingFacility, name: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-lime-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400">Category</label>
                  <select
                    value={editingFacility.category}
                    onChange={(e) =>
                      setEditingFacility({ ...editingFacility, category: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-lime-400 focus:outline-none"
                  >
                    <option value="Football">Football</option>
                    <option value="Badminton">Badminton</option>
                    <option value="Tennis">Tennis</option>
                    <option value="Swimming">Swimming</option>
                    <option value="Cricket">Cricket</option>
                    <option value="Basketball">Basketball</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400">Hourly Rate (৳)</label>
                  <input
                    type="number"
                    required
                    value={editingFacility.pricePerHour}
                    onChange={(e) =>
                      setEditingFacility({ ...editingFacility, pricePerHour: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-lime-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400">Location</label>
                <input
                  type="text"
                  required
                  value={editingFacility.location}
                  onChange={(e) =>
                    setEditingFacility({ ...editingFacility, location: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-lime-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400">Capacity</label>
                  <input
                    type="number"
                    required
                    value={editingFacility.capacity || ""}
                    onChange={(e) =>
                      setEditingFacility({ ...editingFacility, capacity: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-lime-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400">Time Slots</label>
                  <input
                    type="text"
                    required
                    value={editingFacility.availableTimeSlots || ""}
                    onChange={(e) =>
                      setEditingFacility({ ...editingFacility, availableTimeSlots: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-lime-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400">Description</label>
                <textarea
                  rows={2}
                  required
                  value={editingFacility.description || ""}
                  onChange={(e) =>
                    setEditingFacility({ ...editingFacility, description: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-lime-400 focus:outline-none"
                />
              </div>

              <div className="mt-5 flex justify-end gap-3 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingFacility(null)}
                  className="rounded-xl border border-zinc-700 px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="rounded-xl bg-lime-400 px-4 py-2 text-xs font-black uppercase text-zinc-950 hover:bg-lime-300"
                >
                  {actionLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}