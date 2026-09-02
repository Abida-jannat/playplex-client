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

  
  const [editingFacility, setEditingFacility] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch My Facilities
  const fetchMyFacilities = useCallback(async () => {
    const userEmail = session?.user?.email;
    if (!userEmail) return;

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/my-facilities?email=${encodeURIComponent(userEmail)}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch facilities");
      }

      const data = await res.json();
      setFacilities(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch facilities");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  
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

      const res = await fetch(`http://localhost:5000/facilities/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete facility");
      }

      toast.success("Facility deleted successfully!");

      setFacilities((prev) =>
        prev.filter((facility) => facility._id !== id)
      );
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
        `http://localhost:5000/facilities/${editingFacility._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingFacility),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update facility");
      }

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

 
  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-lime-400">
        Loading facilities...
      </div>
    );
  }

  // Not Logged In Screen
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white p-6">
        <div className="text-center border border-zinc-800 bg-zinc-950 p-8 rounded-3xl">
          <h1 className="text-xl font-bold">Access Denied</h1>

          <p className="text-zinc-400 text-sm mt-2">
            Login to manage your facilities.
          </p>

          <Link
            href="/login"
            className="mt-4 inline-block bg-lime-400 text-black px-6 py-2 rounded-xl font-bold"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-6 py-12 text-white max-w-6xl mx-auto">
      <ToastContainer position="top-right" theme="dark" />

      <h1 className="text-3xl font-bold mb-8">
        Manage <span className="text-lime-400">My Facilities</span>
      </h1>

      {facilities.length === 0 ? (
        <div className="p-12 text-center border border-zinc-800 rounded-3xl bg-zinc-950">
          <p className="text-zinc-400">
            You haven&apos;t added any facilities yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => (
            <div
              key={facility._id}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 flex flex-col justify-between"
            >
              <div>
                <img
                  src={facility.image}
                  alt={facility.name}
                  className="h-40 w-full object-cover rounded-2xl mb-4"
                />

                <h3 className="text-xl font-bold">{facility.name}</h3>

                <p className="text-xs text-lime-400 font-semibold">
                  {facility.type}
                </p>

                <p className="text-sm text-zinc-400 mt-2">
                  ৳{facility.pricePerHour || facility.price} / hour
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                {/* Edit Button */}
                <button
                  onClick={() =>
                    setEditingFacility({
                      ...facility,
                    })
                  }
                  className="flex-1 rounded-xl bg-zinc-800 py-2 text-xs font-semibold hover:bg-zinc-700"
                >
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(facility._id)}
                  disabled={deletingId === facility._id}
                  className="flex-1 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 py-2 text-xs font-semibold hover:bg-red-500/30 disabled:opacity-50"
                >
                  {deletingId === facility._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingFacility && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Update Facility</h2>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-sm">
              {/* Name */}
              <input
                type="text"
                value={editingFacility.name || ""}
                onChange={(e) =>
                  setEditingFacility({
                    ...editingFacility,
                    name: e.target.value,
                  })
                }
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl"
                placeholder="Name"
                required
              />

              {/* Location */}
              <input
                type="text"
                value={editingFacility.location || ""}
                onChange={(e) =>
                  setEditingFacility({
                    ...editingFacility,
                    location: e.target.value,
                  })
                }
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl"
                placeholder="Location"
                required
              />

              {/* Price */}
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
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl"
                placeholder="Price/hr"
                required
              />

              {/* Capacity */}
              <input
                type="number"
                value={editingFacility.capacity || ""}
                onChange={(e) =>
                  setEditingFacility({
                    ...editingFacility,
                    capacity: e.target.value,
                  })
                }
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl"
                placeholder="Capacity"
                required
              />

              {/* Description */}
              <textarea
                value={editingFacility.description || ""}
                onChange={(e) =>
                  setEditingFacility({
                    ...editingFacility,
                    description: e.target.value,
                  })
                }
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl"
                placeholder="Description"
                rows="3"
                required
              />

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-lime-400 text-black py-2.5 rounded-xl font-bold disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  disabled={updating}
                  onClick={() => setEditingFacility(null)}
                  className="flex-1 bg-zinc-800 py-2.5 rounded-xl"
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