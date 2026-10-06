"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

// Read API URL from environment variable for Vercel, fallback to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Helper function to read playplex_token from cookie
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

export default function AddFacilityPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "Football",
    image: "",
    location: "",
    pricePerHour: "",
    capacity: "",
    availableTimeSlots: "",
    description: "",
  });

  // Private Route Protection
  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("Please login first to add a sports facility.");
      router.replace("/login?redirect=/facilities/add");
    }
  }, [session, isPending, router]);

  // Form Field Change Handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Image Upload Handler using ImgBB
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast.error("ImgBB API key is missing in environment variables!");
      return;
    }

    setUploading(true);
    const uploadToast = toast.loading("Uploading image to ImgBB...");

    try {
      const body = new FormData();
      body.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body,
      });

      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.data.display_url }));
        toast.success("Image uploaded successfully!", { id: uploadToast });
      } else {
        throw new Error(data.error?.message || "Failed to upload image");
      }
    } catch (err) {
      toast.error(err.message || "Image upload failed.", { id: uploadToast });
    } finally {
      setUploading(false);
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error("Please upload an image for the arena!");
      return;
    }

    setSubmitting(true);
    try {
      const token = await getAuthToken();

      const payload = {
        name: formData.name,
        category: formData.category,
        image: formData.image,
        location: formData.location,
        pricePerHour: Number(formData.pricePerHour),
        capacity: Number(formData.capacity),
        availableTimeSlots: formData.availableTimeSlots,
        description: formData.description,
        ownerEmail: session?.user?.email, 
      };

      const res = await fetch(`${API_URL}/api/facilities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Facility listed successfully!");
        router.push("/facilities");
      } else {
        throw new Error(result.error || "Failed to add facility");
      }
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime-400 border-t-transparent" />
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-lime-400">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse" />
            Host Arena
          </span>
          <h1 className="mt-3 text-2xl font-black italic uppercase tracking-tight text-white sm:text-3xl">
            Add New <span className="text-lime-400">Facility</span>
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            List your sports ground or court to start taking bookings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Facility Name & Category */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Facility Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Apex 7v7 Football Turf"
                className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Facility Type / Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
              >
                <option value="Football">Football</option>
                <option value="Cricket">Cricket</option>
                <option value="Badminton">Badminton</option>
                <option value="Tennis">Tennis</option>
                <option value="Swimming">Swimming</option>
                <option value="Basketball">Basketball</option>
              </select>
            </div>
          </div>

          {/* Location & Image Upload */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Location
              </label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Block D, Dhanmondi, Dhaka"
                className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Image Upload (ImgBB)
              </label>
              <input
                type="file"
                accept="image/*"
                required={!formData.image}
                onChange={handleImageUpload}
                disabled={uploading}
                className="mt-1.5 w-full text-xs text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-lime-400 hover:file:bg-zinc-700"
              />
              {formData.image && (
                <p className="mt-1 truncate text-[10px] text-lime-400">
                  Uploaded: {formData.image}
                </p>
              )}
            </div>
          </div>

          {/* Price, Capacity & Available Slots */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Price Per Hour (৳)
              </label>
              <input
                type="number"
                name="pricePerHour"
                required
                min="0"
                value={formData.pricePerHour}
                onChange={handleChange}
                placeholder="1500"
                className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Capacity (Players)
              </label>
              <input
                type="number"
                name="capacity"
                required
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="14"
                className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Time Slots
              </label>
              <input
                type="text"
                name="availableTimeSlots"
                required
                value={formData.availableTimeSlots}
                onChange={handleChange}
                placeholder="06:00 AM - 11:00 PM"
                className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Highlight turf quality, floodlights, parking, and locker availability..."
              className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Owner Email (Auto-filled)
            </label>
            <input
              type="email"
              readOnly
              disabled
              value={session?.user?.email || ""}
              className="mt-1.5 w-full cursor-not-allowed rounded-xl border border-zinc-800 bg-zinc-950/50 px-3.5 py-2.5 text-xs text-zinc-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || uploading}
            className="w-full rounded-xl bg-lime-400 py-3 text-xs font-black uppercase tracking-wider text-zinc-950 shadow-md shadow-lime-400/10 transition hover:bg-lime-300 active:scale-95 disabled:opacity-50"
          >
            {submitting ? "Publishing Venue..." : uploading ? "Uploading Image..." : "Add Facility"}
          </button>
        </form>
      </div>
    </div>
  );
}