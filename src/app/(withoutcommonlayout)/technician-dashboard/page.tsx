"use client";

import { useState, useEffect } from "react";
import {
  Wrench,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Plus,
  UserCheck,
  MapPin,
  DollarSign,
  AlertCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Edit3,
  Loader2,
  SearchX,
} from "lucide-react";
import { getPublicCategoriesAction, Category } from "@/src/app/(withcommonlayout)/_actions/publicAction";
import {
  getTechnicianBookingsAction,
  updateTechnicianBookingStatusAction,
  updateTechnicianAvailabilityAction,
  updateTechnicianProfileAction,
  createTechnicianServiceAction,
} from "./_actions/technicianActions";

const CORAL = "#FF5A36";
const TEAL = "#0FA894";

interface Booking {
  id: string;
  serviceId?: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "COMPLETED";
  bookingDate?: string;
  serviceDate?: string;
  slot?: string;
  price?: number;
  customer?: {
    name: string;
    email: string;
  };
  technicianProfile?: {
    basePrice?: number;
    user?: {
      name: string;
      email: string;
    };
  };
  createdAt: string;
}

export default function TechnicianDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 5, total: 0, totalPage: 1 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Availability State
  const [isAvailable, setIsAvailable] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);

  // Modals state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

  // Profile Form
  const [profileForm, setProfileForm] = useState({
    bio: "",
    location: "",
    hourlyRate: 40,
    skills: [] as string[],
  });

  // Service Form
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    price: 50,
    duration: "1-2 Hours",
    categoryId: "",
  });

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch bookings and categories
  const loadDashboardData = async () => {
    setLoading(true);
    const [bookingsRes, catRes] = await Promise.all([
      getTechnicianBookingsAction({ page: currentPage, limit: pageSize }),
      getPublicCategoriesAction({ limit: 100 }),
    ]);

    if (bookingsRes && bookingsRes.success) {
      setBookings(bookingsRes.data || []);
      if (bookingsRes.meta) setMeta(bookingsRes.meta);
    } else {
      setBookings([]);
    }

    if (catRes && catRes.success && Array.isArray(catRes.data)) {
      setCategories(catRes.data);
      if (!serviceForm.categoryId && catRes.data.length > 0) {
        setServiceForm((prev) => ({ ...prev, categoryId: catRes.data[0].id }));
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, [currentPage]);

  // Handle Availability Toggle
  const handleAvailabilityToggle = async () => {
    setToggleLoading(true);
    const nextState = !isAvailable;
    const res = await updateTechnicianAvailabilityAction({
      availability: { isAvailable: nextState },
    });
    if (res && res.success) {
      setIsAvailable(nextState);
      setMessage({ type: "success", text: `Availability status updated to ${nextState ? "Available" : "Busy"}!` });
    } else {
      setMessage({ type: "error", text: res.message || "Failed to update availability status." });
    }
    setToggleLoading(false);
  };

  // Handle Booking Status Update
  const handleStatusUpdate = async (bookingId: string, status: "ACCEPTED" | "DECLINED" | "COMPLETED") => {
    setActionLoading(bookingId);
    const res = await updateTechnicianBookingStatusAction(bookingId, status);
    if (res && res.success) {
      setMessage({ type: "success", text: `Booking status updated to ${status}!` });
      await loadDashboardData();
    } else {
      setMessage({ type: "error", text: res.message || "Failed to update booking status." });
    }
    setActionLoading(null);
  };

  // Handle Profile Update Submit
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading("profile");
    const res = await updateTechnicianProfileAction({
      bio: profileForm.bio,
      location: profileForm.location,
      hourlyRate: Number(profileForm.hourlyRate),
      skills: profileForm.skills,
    });
    if (res && res.success) {
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setShowProfileModal(false);
    } else {
      setMessage({ type: "error", text: res.message || "Failed to update profile." });
    }
    setActionLoading(null);
  };

  // Handle Create Service Submit
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading("service");
    const res = await createTechnicianServiceAction({
      name: serviceForm.name,
      description: serviceForm.description,
      price: Number(serviceForm.price),
      duration: serviceForm.duration,
      categoryId: serviceForm.categoryId,
    });
    if (res && res.success) {
      setMessage({ type: "success", text: "New service created successfully!" });
      setShowServiceModal(false);
      setServiceForm({
        name: "",
        description: "",
        price: 50,
        duration: "1-2 Hours",
        categoryId: categories[0]?.id || "",
      });
    } else {
      setMessage({ type: "error", text: res.message || "Failed to create service." });
    }
    setActionLoading(null);
  };

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const acceptedCount = bookings.filter((b) => b.status === "ACCEPTED").length;
  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#14171C] p-6 text-white sm:p-8">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-20 blur-3xl"
          style={{ background: `radial-gradient(circle, ${CORAL}, ${TEAL})` }}
        />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
              style={{ backgroundColor: `${CORAL}20`, color: CORAL }}
            >
              <Wrench className="h-3.5 w-3.5" />
              Technician Portal
            </span>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Technician <span style={{ color: CORAL }}>Dashboard</span>
            </h1>
            <p className="mt-2 text-xs text-neutral-300 sm:text-sm">
              Manage client booking requests, set service availability, and create your custom services.
            </p>
          </div>

          {/* Quick Actions & Availability Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAvailabilityToggle}
              disabled={toggleLoading}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all shadow-md ${
                isAvailable
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-amber-500 text-white hover:bg-amber-600"
              }`}
            >
              {toggleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              <span>Status: {isAvailable ? "Available for Jobs" : "Currently Busy"}</span>
            </button>

            <button
              onClick={() => setShowServiceModal(true)}
              className="flex items-center gap-1.5 rounded-2xl bg-[#FF5A36] px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Add Service
            </button>

            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-1.5 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`flex items-center justify-between rounded-2xl p-4 text-xs font-semibold shadow-sm ${
            message.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4 text-rose-600" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-neutral-400 hover:text-neutral-700">
            Dismiss
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Requests</span>
            <span className="rounded-xl bg-orange-50 p-2 text-[#FF5A36]">
              <CalendarCheck className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-[#14171C]">{meta.total}</p>
          <p className="mt-1 text-[11px] text-neutral-400">Total job bookings assigned</p>
        </div>

        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Action</span>
            <span className="rounded-xl bg-amber-50 p-2 text-amber-600">
              <Clock className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-[#14171C]">{pendingCount}</p>
          <p className="mt-1 text-[11px] text-neutral-400">Awaiting your response</p>
        </div>

        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Accepted Jobs</span>
            <span className="rounded-xl bg-teal-50 p-2 text-[#0FA894]">
              <CheckCircle2 className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-[#14171C]">{acceptedCount}</p>
          <p className="mt-1 text-[11px] text-neutral-400">Active or in-progress jobs</p>
        </div>

        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
            <span className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <Sparkles className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-[#14171C]">{completedCount}</p>
          <p className="mt-1 text-[11px] text-neutral-400">Successfully finished jobs</p>
        </div>
      </div>

      {/* Bookings & Job Requests Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#E7E2D8] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#14171C]">Assigned Job Requests</h2>
            <p className="text-xs text-[#6B707E]">Review client booking requests and update status</p>
          </div>

          <span className="text-xs font-semibold text-[#6B707E]">
            Page {meta.page} of {meta.totalPage || 1} ({meta.total} total)
          </span>
        </div>

        {loading ? (
          <div className="space-y-3 py-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-[#F1EEE6]" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="my-12 flex flex-col items-center justify-center p-8 text-center">
            <SearchX className="h-10 w-10 text-[#9AA0AA]" />
            <h3 className="mt-3 text-sm font-bold text-[#1E2026]">No job requests found</h3>
            <p className="mt-1 text-xs text-[#6B707E]">
              When customers book your services, requests will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E7E2D8] bg-[#FFFBF3] text-[11px] font-semibold uppercase tracking-wide text-[#6B707E]">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Requested Date & Slot</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D8]">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="transition-colors hover:bg-[#FFFBF3]/60">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#14171C] font-bold text-white">
                          {booking.customer?.name ? booking.customer.name.charAt(0).toUpperCase() : "C"}
                        </span>
                        <div>
                          <p className="font-semibold text-[#1E2026]">{booking.customer?.name || "Customer"}</p>
                          <p className="text-[11px] text-[#6B707E]">{booking.customer?.email || "No email"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#4A4E58] font-medium">
                      <div>
                        <p className="font-semibold text-[#1E2026]">
                          {booking.bookingDate
                            ? new Date(booking.bookingDate).toLocaleDateString("en-US", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : booking.serviceDate
                            ? new Date(booking.serviceDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : new Date(booking.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                        </p>
                        {booking.slot && (
                          <span className="inline-flex items-center gap-1 mt-0.5 text-[11px] text-[#6B707E]">
                            <Clock className="h-3 w-3 text-[#FF5A36]" />
                            {booking.slot}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-extrabold text-[#1E2026]">
                      ${booking.price ?? booking.technicianProfile?.basePrice ?? 50}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          booking.status === "ACCEPTED"
                            ? "bg-teal-50 text-[#0FA894] border border-teal-100"
                            : booking.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : booking.status === "DECLINED"
                            ? "bg-rose-50 text-rose-700 border border-rose-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {booking.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(booking.id, "ACCEPTED")}
                              disabled={actionLoading === booking.id}
                              className="rounded-xl bg-[#0FA894] px-3 py-1.5 font-semibold text-white shadow-sm hover:bg-[#0d8f7e] disabled:opacity-50"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(booking.id, "DECLINED")}
                              disabled={actionLoading === booking.id}
                              className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {booking.status === "ACCEPTED" && (
                          <button
                            onClick={() => handleStatusUpdate(booking.id, "COMPLETED")}
                            disabled={actionLoading === booking.id}
                            className="rounded-xl bg-emerald-600 px-3 py-1.5 font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                          >
                            Mark Completed
                          </button>
                        )}

                        {(booking.status === "COMPLETED" || booking.status === "DECLINED") && (
                          <span className="text-[11px] text-[#9AA0AA] italic font-medium">Completed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Server-Side Pagination Controls */}
        {meta.totalPage > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-[#E7E2D8] pt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage <= 1 || loading}
              className="flex items-center gap-1 rounded-xl border border-[#E7E2D8] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E2026] hover:bg-[#FFFBF3] disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: meta.totalPage }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`h-7 w-7 rounded-lg text-xs font-bold ${
                    currentPage === i + 1
                      ? "bg-[#FF5A36] text-white"
                      : "border border-[#E7E2D8] bg-white text-[#6B707E] hover:bg-[#FFFBF3]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, meta.totalPage))}
              disabled={currentPage >= meta.totalPage || loading}
              className="flex items-center gap-1 rounded-xl border border-[#E7E2D8] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E2026] hover:bg-[#FFFBF3] disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-[#14171C]">Update Profile Info</h3>
              <button onClick={() => setShowProfileModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleProfileSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700">Bio / Summary</label>
                <textarea
                  rows={3}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  placeholder="Describe your expertise and service experience..."
                  className="mt-1 w-full rounded-xl border border-neutral-300 p-2.5 text-xs outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700">Location</label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    placeholder="e.g. Dhaka, Bangladesh"
                    className="mt-1 w-full rounded-xl border border-neutral-300 p-2 text-xs outline-none focus:border-[#FF5A36]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700">Hourly Rate ($)</label>
                  <input
                    type="number"
                    value={profileForm.hourlyRate}
                    onChange={(e) => setProfileForm({ ...profileForm, hourlyRate: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-neutral-300 p-2 text-xs outline-none focus:border-[#FF5A36]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700">Skills / Categories</label>
                <div className="mt-2 max-h-36 overflow-y-auto space-y-1.5 rounded-xl border border-neutral-200 p-2.5">
                  {categories.map((cat) => {
                    const isChecked = profileForm.skills.includes(cat.id);
                    return (
                      <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-xs text-neutral-700">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProfileForm({ ...profileForm, skills: [...profileForm.skills, cat.id] });
                            } else {
                              setProfileForm({
                                ...profileForm,
                                skills: profileForm.skills.filter((id) => id !== cat.id),
                              });
                            }
                          }}
                          className="rounded text-[#FF5A36]"
                        />
                        <span>{cat.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-neutral-100 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="rounded-xl border border-neutral-300 px-4 py-2 text-neutral-600 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "profile"}
                  className="flex items-center gap-1.5 rounded-xl bg-[#FF5A36] px-5 py-2 font-semibold text-white shadow-sm hover:bg-[#C23B1F]"
                >
                  {actionLoading === "profile" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-[#14171C]">Create New Service</h3>
              <button onClick={() => setShowServiceModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleServiceSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700">Service Name</label>
                <input
                  type="text"
                  required
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="e.g. Emergency Plumbing Repair"
                  className="mt-1 w-full rounded-xl border border-neutral-300 p-2 text-xs outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700">Category</label>
                <select
                  value={serviceForm.categoryId}
                  onChange={(e) => setServiceForm({ ...serviceForm, categoryId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-neutral-300 p-2 text-xs outline-none focus:border-[#FF5A36] bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700">Description</label>
                <textarea
                  rows={2}
                  required
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="Service details, what's included..."
                  className="mt-1 w-full rounded-xl border border-neutral-300 p-2 text-xs outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700">Price ($)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-neutral-300 p-2 text-xs outline-none focus:border-[#FF5A36]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700">Est. Duration</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                    placeholder="e.g. 1-2 Hours"
                    className="mt-1 w-full rounded-xl border border-neutral-300 p-2 text-xs outline-none focus:border-[#FF5A36]"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-neutral-100 pt-3">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="rounded-xl border border-neutral-300 px-4 py-2 text-neutral-600 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "service"}
                  className="flex items-center gap-1.5 rounded-xl bg-[#FF5A36] px-5 py-2 font-semibold text-white shadow-sm hover:bg-[#C23B1F]"
                >
                  {actionLoading === "service" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Create Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
