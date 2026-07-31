"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Wrench,
  UserCheck,
  XCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  SearchX,
  Plus,
  Eye,
  CreditCard,
  Loader2,
  User
} from "lucide-react";
import { toast } from "sonner";
import { getUserBookingsAction, getBookingDetailsAction, initiatePaymentAction } from "../../(withcommonlayout)/_actions/bookingAction";
import { getMeAction } from "../../(authGroup)/_actions/authActions";

interface Booking {
  id: string;
  technicianProfileId: string;
  bookingDate: string;
  slot: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "COMPLETED";
  paymentStatus?: string;
  price?: number;
  createdAt: string;
  technicianProfile?: {
    basePrice?: number;
    hourlyRate?: number;
    location?: string;
    user?: {
      name: string;
      email: string;
    };
  };
}

interface MetaData {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

const CORAL = "#FF5A36";
const CORAL_DARK = "#C23B1F";

export default function CustomerDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [meta, setMeta] = useState<MetaData>({ page: 1, limit: 10, total: 0, totalPage: 1 });
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);

  // Pagination & Filtering state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
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

  const loadData = async () => {
    setLoading(true);
    const [meRes, bookingsRes] = await Promise.all([
      getMeAction(),
      getUserBookingsAction({
        page,
        limit,
        search: debouncedSearch,
        status: filterStatus,
      }),
    ]);

    if (meRes) setUser(meRes);

    if (bookingsRes && bookingsRes.success && Array.isArray(bookingsRes.data)) {
      setBookings(bookingsRes.data);
      if (bookingsRes.meta) {
        setMeta(bookingsRes.meta);
      }
    } else {
      setBookings([]);
      setMeta({ page: 1, limit, total: 0, totalPage: 1 });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [page, limit, debouncedSearch, filterStatus]);

  const handleViewDetails = async (bookingId: string) => {
    setLoadingDetails(true);
    const res = await getBookingDetailsAction(bookingId);
    if (res && res.success && res.data) {
      setSelectedBooking(res.data);
    } else {
      toast.error(res?.message || "Failed to fetch booking details.");
    }
    setLoadingDetails(false);
  };

  const handlePayNow = async (bookingId: string) => {
    setPayingBookingId(bookingId);
    const res = await initiatePaymentAction(bookingId);
    if (res && res.success && res.data?.paymentUrl) {
      toast.success("Redirecting to SSLCommerz payment gateway...");
      window.location.href = res.data.paymentUrl;
    } else {
      toast.error(res?.message || "Failed to create payment session.");
      setPayingBookingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header matching TechnicianServicesPage */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${CORAL}12`, color: CORAL_DARK }}
          >
            <CalendarCheck className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E2026]">My Bookings</h1>
            <p className="text-xs text-[#6B707E]">
              View, search, and track all your technician appointment bookings and statuses.
            </p>
          </div>
        </div>

        <Link
          href="/technicians"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5A36] to-[#C23B1F] px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#FF5A36]/20 transition-all hover:opacity-95"
        >
          <Plus className="h-4 w-4" />
          Book New Technician
        </Link>
      </div>

      {/* Control Bar matching TechnicianServicesPage */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E7E2D8] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="group relative flex w-full items-center gap-2.5 rounded-xl border border-[#E7E2D8] bg-white px-3.5 py-2.5 shadow-sm transition-all focus-within:border-[#FF5A36] focus-within:ring-4 focus-within:ring-[#FF5A36]/10 sm:w-80">
          <Search className="h-4 w-4 shrink-0 text-[#9AA0AA] transition-colors group-focus-within:text-[#FF5A36]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by technician or slot..."
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
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-[#E7E2D8] bg-[#FFFBF3] px-3 py-2 text-xs">
            <span className="text-[#6B707E]">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-semibold text-[#1E2026] outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="COMPLETED">Completed</option>
              <option value="DECLINED">Declined</option>
            </select>
          </div>

          {/* Show count selector */}
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

      {/* Bookings Table matching TechnicianServicesPage structure */}
      <div className="overflow-hidden rounded-2xl border border-[#E7E2D8] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E7E2D8] bg-[#FFFBF3] text-[11px] font-semibold uppercase tracking-wide text-[#6B707E]">
              <tr>
                <th className="px-6 py-4">Technician</th>
                <th className="px-6 py-4">Booking Date</th>
                <th className="px-6 py-4">Time Slot</th>
                <th className="px-6 py-4">Booking Status</th>
                <th className="px-6 py-4">Payment</th>
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
                      <div className="h-3.5 w-20 rounded bg-[#F1EEE6]" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3.5 w-16 rounded bg-[#F1EEE6]" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-3.5 w-20 ml-auto rounded bg-[#F1EEE6]" />
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
                      <p className="text-sm font-medium text-[#1E2026]">No bookings found</p>
                      <p className="text-xs text-[#6B707E]">Your appointment bookings will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  const techName = booking.technicianProfile?.user?.name || "Technician";
                  const techEmail = booking.technicianProfile?.user?.email || "";

                  return (
                    <tr key={booking.id} className="transition-colors hover:bg-[#FFFBF3]/60">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-xs"
                            style={{ backgroundColor: `${CORAL}12`, color: CORAL_DARK }}
                          >
                            {techName.charAt(0).toUpperCase()}
                          </span>
                          <div>
                            <p className="font-semibold text-[#1E2026]">{techName}</p>
                            {techEmail && <p className="text-[11px] text-[#6B707E]">{techEmail}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#4A4E58] font-medium">
                        {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#1E2026]">
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-[#E7E2D8] bg-[#FFFBF3] px-2.5 py-1 text-[11px] font-semibold text-[#1E2026]">
                          <Clock className="h-3.5 w-3.5 text-[#FF5A36]" />
                          {booking.slot}
                        </span>
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
                          {booking.status === "ACCEPTED" && <CheckCircle2 className="h-3 w-3" />}
                          {booking.status === "COMPLETED" && <UserCheck className="h-3 w-3" />}
                          {booking.status === "DECLINED" && <XCircle className="h-3 w-3" />}
                          {booking.status === "PENDING" && <Clock className="h-3 w-3" />}
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            booking.paymentStatus === "PAID"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}
                        >
                          {booking.paymentStatus || "UNPAID"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewDetails(booking.id)}
                            title="View Booking Details"
                            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#E7E2D8] bg-white text-[#6B707E] transition-all hover:border-[#FF5A36] hover:bg-[#FFFBF3] hover:text-[#FF5A36]"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {booking.status === "ACCEPTED" && booking.paymentStatus !== "PAID" && (
                            <button
                              type="button"
                              onClick={() => handlePayNow(booking.id)}
                              disabled={payingBookingId === booking.id}
                              className="flex items-center gap-1.5 rounded-xl bg-[#0FA894] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#0d8f7e] transition-all disabled:opacity-50"
                            >
                              {payingBookingId === booking.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <CreditCard className="h-3.5 w-3.5" />
                              )}
                              Pay Now
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer matching TechnicianServicesPage */}
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
            of <span className="font-semibold text-[#1E2026]">{meta.total}</span> bookings
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

      {/* Booking Details View Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-[#E7E2D8] space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF5A36]/10 text-[#FF5A36]">
                  <Eye className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-base font-extrabold text-[#1E2026]">Booking Details</h2>
                  <p className="text-[11px] text-[#6B707E] font-mono">ID: {selectedBooking.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-full p-1.5 text-[#9AA0AA] hover:bg-[#FFFBF3] hover:text-[#1E2026] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Details Content */}
            <div className="space-y-3.5 text-xs">
              {/* Technician Info Box */}
              <div className="rounded-2xl bg-[#FFFBF3] border border-[#E7E2D8] p-3.5 space-y-2">
                <p className="font-extrabold text-[#1E2026] text-xs flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-[#FF5A36]" />
                  Technician Information
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[#1E2026]">
                  <div>
                    <span className="text-[#6B707E] block text-[11px]">Name</span>
                    <span className="font-semibold">{selectedBooking.technicianProfile?.user?.name || "Technician"}</span>
                  </div>
                  <div>
                    <span className="text-[#6B707E] block text-[11px]">Email</span>
                    <span className="font-semibold">{selectedBooking.technicianProfile?.user?.email || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Schedule & Financials */}
              <div className="rounded-2xl border border-[#E7E2D8] bg-white p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B707E]">Booking Date:</span>
                  <span className="font-bold text-[#1E2026]">
                    {selectedBooking.bookingDate
                      ? new Date(selectedBooking.bookingDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>

                {selectedBooking.slot && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B707E]">Time Slot:</span>
                    <span className="font-bold text-[#FF5A36] bg-[#FF5A36]/10 px-2.5 py-0.5 rounded-lg text-[11px]">
                      {selectedBooking.slot}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[#6B707E]">Service Rate:</span>
                  <span className="font-extrabold text-sm text-[#1E2026]">
                    ${selectedBooking.price ?? selectedBooking.technicianProfile?.basePrice ?? selectedBooking.technicianProfile?.hourlyRate ?? 50}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#6B707E]">Payment Status:</span>
                  <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                    {selectedBooking.paymentStatus || "UNPAID"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-[#E7E2D8] pt-2">
                  <span className="text-[#6B707E]">Booking Status:</span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      selectedBooking.status === "ACCEPTED"
                        ? "bg-teal-50 text-[#0FA894] border border-teal-100"
                        : selectedBooking.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : selectedBooking.status === "DECLINED"
                        ? "bg-rose-50 text-rose-700 border border-rose-100"
                        : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 border-t border-[#E7E2D8] pt-3">
              {selectedBooking.status === "ACCEPTED" && selectedBooking.paymentStatus !== "PAID" && (
                <button
                  type="button"
                  onClick={() => handlePayNow(selectedBooking.id)}
                  disabled={payingBookingId === selectedBooking.id}
                  className="flex items-center gap-1.5 rounded-xl bg-[#0FA894] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0d8f7e] transition-colors disabled:opacity-50"
                >
                  {payingBookingId === selectedBooking.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CreditCard className="h-4 w-4" />
                  )}
                  Pay Now
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-xl border border-[#E7E2D8] bg-white px-3.5 py-2 text-xs font-bold text-[#6B707E] hover:bg-[#FFFBF3] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
