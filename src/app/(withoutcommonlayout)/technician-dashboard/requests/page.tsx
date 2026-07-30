"use client";

import { useState, useEffect } from "react";
import { CalendarCheck, CheckCircle2, Clock, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { getTechnicianBookingsAction, updateTechnicianBookingStatusAction } from "../_actions/technicianActions";

interface Booking {
  id: string;
  serviceId?: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "COMPLETED";
  serviceDate?: string;
  price?: number;
  customer?: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function TechnicianRequestsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPage: 1 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    const res = await getTechnicianBookingsAction({ page: currentPage, limit: 10 });
    if (res && res.success) {
      setBookings(res.data || []);
      if (res.meta) setMeta(res.meta);
    } else {
      setBookings([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [currentPage]);

  const handleStatusUpdate = async (bookingId: string, status: "ACCEPTED" | "DECLINED" | "COMPLETED") => {
    setActionLoading(bookingId);
    const res = await updateTechnicianBookingStatusAction(bookingId, status);
    if (res && res.success) {
      setMessage({ type: "success", text: `Booking status updated to ${status}!` });
      await fetchBookings();
    } else {
      setMessage({ type: "error", text: res.message || "Failed to update booking status." });
    }
    setActionLoading(null);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#14171C]">Job Requests & Bookings</h1>
          <p className="text-xs text-neutral-500">Manage client booking requests, accept/decline jobs, and mark completed</p>
        </div>
      </div>

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

      <div className="rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm">
        {loading ? (
          <div className="space-y-4 py-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-neutral-100" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="my-12 flex flex-col items-center justify-center p-8 text-center">
            <CalendarCheck className="h-12 w-12 text-neutral-300" />
            <h3 className="mt-3 text-sm font-bold text-[#14171C]">No job requests found</h3>
            <p className="mt-1 text-xs text-neutral-400">Assigned customer bookings will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 bg-[#FFFBF3] text-neutral-500">
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Service Date</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="transition-colors hover:bg-neutral-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14171C] font-bold text-white">
                          {booking.customer?.name ? booking.customer.name.charAt(0).toUpperCase() : "C"}
                        </span>
                        <div>
                          <p className="font-bold text-[#14171C]">{booking.customer?.name || "Customer"}</p>
                          <p className="text-[11px] text-neutral-400">{booking.customer?.email || "No email"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-neutral-600 font-medium">
                      {booking.serviceDate ? new Date(booking.serviceDate).toLocaleDateString() : new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 font-bold text-[#14171C]">
                      ${booking.price || 50}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          booking.status === "ACCEPTED"
                            ? "bg-teal-50 text-[#0FA894]"
                            : booking.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-700"
                            : booking.status === "DECLINED"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-700"
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
                          <span className="text-[11px] text-neutral-400 italic">No action needed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta.totalPage > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage <= 1 || loading}
              className="flex items-center gap-1 rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
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
                      : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, meta.totalPage))}
              disabled={currentPage >= meta.totalPage || loading}
              className="flex items-center gap-1 rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
