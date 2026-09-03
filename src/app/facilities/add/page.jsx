"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { authClient } from "@/lib/auth-client";

export default function AddFacilityPage() {
  const router = useRouter();

  // Better Auth session
  const { data: session, isPending } = authClient.useSession();

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  // Base API URL configuration
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    image: "",
    location: "",
    price: "",
    capacity: "",
    availableTimeSlots: "",
    description: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Image Upload - ImgBB
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast.error("ImgBB API key is missing in .env.local");
      return;
    }

    setImageLoading(true);

    try {
      const imageData = new FormData();
      imageData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: imageData,
        }
      );

      const data = await response.json();

      if (!data.success) {
        toast.error("Image upload failed.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: data.data.url,
      }));

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image.");
    } finally {
      setImageLoading(false);
    }
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user?.email) {
      toast.error("Please login first.");
      return;
    }

    if (!formData.image) {
      toast.error("Please upload a facility image.");
      return;
    }

    setLoading(true);

    try {
      const facilityData = {
        ...formData,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity, 10),
        ownerEmail: session.user.email,
        createdAt: new Date(),
      };

      const response = await fetch(`${API_BASE_URL}/facilities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Crucial for sending authentication cookies cross-origin
        body: JSON.stringify(facilityData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to add facility.");
        return;
      }

      toast.success("Facility added successfully!");

      setTimeout(() => {
        router.push("/facilities");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-black text-white">
        <p className="text-lime-400">Loading session...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-black px-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[4px] text-lime-400">
            Private Route
          </p>
          <h1 className="mt-3 text-3xl font-bold">Login Required</h1>
          <p className="mt-3 text-sm text-zinc-400">
            You need to login before adding a facility.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-lime-400 px-6 py-3 font-bold text-black transition hover:bg-lime-300"
          >
            Login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-black px-4 py-12 text-white sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[4px] text-lime-400">
            PlayPlex Facilities
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Add <span className="text-lime-400">Facility</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400">
            Add your sports facility and make it available for players to book.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Facility Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Facility Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Green Arena Football Turf"
                required
                disabled={loading}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400 disabled:opacity-50"
              />
            </div>

            {/* Facility Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Facility Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400 disabled:opacity-50"
              >
                <option value="">Select facility type</option>
                <option value="Football">Football</option>
                <option value="Badminton">Badminton</option>
                <option value="Tennis">Tennis</option>
                <option value="Swimming">Swimming</option>
                <option value="Basketball">Basketball</option>
                <option value="Cricket">Cricket</option>
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Facility Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loading || imageLoading}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-lime-400 file:px-4 file:py-2 file:font-semibold file:text-black hover:file:bg-lime-300 disabled:opacity-50"
              />

              {imageLoading && (
                <p className="mt-2 text-sm text-lime-400">Uploading image...</p>
              )}

              {formData.image && (
                <div className="mt-4">
                  <img
                    src={formData.image}
                    alt="Facility preview"
                    className="h-48 w-full rounded-xl object-cover"
                  />
                  <p className="mt-2 truncate text-xs text-zinc-500">
                    ✓ Image uploaded successfully
                  </p>
                </div>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Dhanmondi, Dhaka"
                required
                disabled={loading}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400 disabled:opacity-50"
              />
            </div>

            {/* Price + Capacity */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Price Per Hour (৳)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="1500"
                  min="0"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="20"
                  min="1"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Available Time Slots */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Available Time Slots
              </label>
              <input
                type="text"
                name="availableTimeSlots"
                value={formData.availableTimeSlots}
                onChange={handleChange}
                placeholder="e.g. 9 AM - 11 AM, 3 PM - 5 PM, 6 PM - 8 PM"
                required
                disabled={loading}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400 disabled:opacity-50"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your facility..."
                rows="5"
                required
                disabled={loading}
                className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400 disabled:opacity-50"
              />
            </div>

            {/* Owner Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Owner Email
              </label>
              <input
                type="email"
                value={session.user.email}
                readOnly
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-400 outline-none"
              />
              <p className="mt-2 text-xs text-zinc-600">
                Automatically filled from your logged-in account.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || imageLoading}
              className="w-full rounded-xl bg-lime-400 py-3.5 text-sm font-bold text-black transition duration-200 hover:scale-[1.01] hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Adding Facility..." : "Add Facility →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}