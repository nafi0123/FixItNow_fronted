"use client";

import { useState, useEffect } from "react";
import { ClipboardList, ChevronLeft, ChevronRight, SearchX, Search, X, Clock } from "lucide-react";
import { toast } from "sonner";
import { getTechnicianBookingsAction, updateTechnicianBookingStatusAction } from "../_actions/technicianActions";

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

interface MetaData {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

const CORAL = "#FF5A36";
const CORAL_DARK = "#C23B1F";

export default function TechnicianRequestsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [meta, setMeta] = useState<MetaData>({ page: 1, limit: 10, total: 0, totalPage: 1 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchBookings = async () => {
    setLoading(true);
    const res = await getTechnicianBookingsAction({
      page,
      limit,
      search: debouncedSearch,
    });

    if (res && res.success) {
      setBookings(res.data || []);
      if (res.meta) setMeta(res.meta);
    } else {
      setBookings([]);
      toast.error(res?.message || "Failed to load job requests");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [page, limit, debouncedSearch]);

  const handleStatusUpdate = async (bookingId: string, status: "ACCEPTED" | "DECLINED" | "COMPLETED") => {
    setActionLoading(bookingId);
    const res = await updateTechnicianBookingStatusAction(bookingId, status);
    if (res && res.success) {
      toast.success(res.message || `Booking status updated to ${status}!`);
      await fetchBookings();
    } else {
      toast.error(res.message || "Failed to update booking status.");
    }
    setActionLoading(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${CORAL}12`, color: CORAL_DARK }}
          >
            <ClipboardList className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E2026]">Job requests management</h1>
            <p className="text-xs text-[#6B707E]">
              Review client booking requests, update job statuses, and track completed work.
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E7E2D8] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="group relative flex w-full items-center gap-2.5 rounded-xl border border-[#E7E2D8] bg-white px-3.5 py-2.5 shadow-sm transition-all focus-within:border-[#FF5A36] focus-within:ring-4 focus-within:ring-[#FF5A36]/10 sm:w-80">
          <Search className="h-4 w-4 shrink-0 text-[#9AA0AA] transition-colors group-focus-within:text-[#FF5A36]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer or email..."
            className="w-full bg-transparent text-xs font-medium text-[#1E2026] outline-none placeholder:text-[#9AA0AA]"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#F1EEE6] text-[#6B707E] transition-colors hover:bg-[#FF5A36] hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-xl border border-[#E7E2D8] bg-[#FFFBF3] px-3 py-2 text-xs">
            <span className="text-[#6B707E]">Show:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="bg-transparent font-semibold text-[#1E2026] outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E7E2D8] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E7E2D8] bg-[#FFFBF3] text-[11px] font-semibold uppercase tracking-wide text-[#6B707E]">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Requested Date & Slot</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E2D8]">
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 shrink-0 rounded-lg bg-[#F1EEE6]" />
                        <div className="h-3.5 w-32 rounded bg-[#F1EEE6]" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3.5 w-24 rounded bg-[#F1EEE6]" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3.5 w-16 rounded bg-[#F1EEE6]" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3.5 w-20 rounded bg-[#F1EEE6]" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-7 w-24 ml-auto rounded-lg bg-[#F1EEE6]" />
                    </td>
                  </tr>
                ))
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFFBF3] text-[#9AA0AA]">
                        <SearchX className="h-5 w-5" />
                      </span>
                      <p className="text-sm font-medium text-[#1E2026]">No job requests found</p>
                      <p className="text-xs text-[#6B707E]">Assigned customer bookings will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="transition-colors hover:bg-[#FFFBF3]/60">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#14171C] font-bold text-white">
                          {booking.customer?.name ? booking.customer.name.charAt(0).toUpperCase() : "C"}
                        </span>
                        <div>
                          <p className="font-semibold text-[#1E2026]">{booking.customer?.name || "Customer"}</p>
                          <p className="text-[11px] text-[#6B707E]">{booking.customer?.email || "No email provided"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#4A4E58] font-medium">
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
                    <td className="px-6 py-4 font-extrabold text-[#1E2026]">
                      ${booking.price ?? booking.technicianProfile?.basePrice ?? 50}
                    </td>
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4 text-right">
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#E7E2D8] bg-[#FFFBF3] px-6 py-4 sm:flex-row">
          <p className="text-xs text-[#6B707E]">
            Showing{" "}
            <span className="font-semibold text-[#1E2026]">
              {meta.total > 0 ? (meta.page - 1) * meta.limit + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-[#1E2026]">
              {Math.min(meta.page * meta.limit, meta.total)}
            </span>{" "}
            of <span className="font-semibold text-[#1E2026]">{meta.total}</span> requests
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1 || loading}
              className="flex h-8 items-center justify-center gap-1 rounded-lg border border-[#E7E2D8] bg-white px-3 text-xs font-medium text-[#1E2026] transition-colors hover:border-[#FF5A36]/40 hover:bg-[#FFF6EA] disabled:opacity-50"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>
            <span className="text-xs font-semibold text-[#1E2026]">
              Page {meta.page} of {meta.totalPage || 1}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, meta.totalPage))}
              disabled={page >= meta.totalPage || loading}
              className="flex h-8 items-center justify-center gap-1 rounded-lg border border-[#E7E2D8] bg-white px-3 text-xs font-medium text-[#1E2026] transition-colors hover:border-[#FF5A36]/40 hover:bg-[#FFF6EA] disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
