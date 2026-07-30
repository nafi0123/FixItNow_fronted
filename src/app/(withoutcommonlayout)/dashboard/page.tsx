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
  Plus
} from "lucide-react";
import { getUserBookingsAction } from "../../(withcommonlayout)/_actions/bookingAction";
import { getMeAction } from "../../(authGroup)/_actions/authActions";

interface Booking {
  id: string;
  technicianProfileId: string;
  bookingDate: string;
  slot: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "COMPLETED";
  createdAt: string;
  technicianProfile?: {
    user?: {
      name: string;
      email: string;
    };
    location?: string;
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
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Created At</th>
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
                      <td className="px-6 py-4 text-right text-[11px] text-[#6B707E]">
                        {new Date(booking.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
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
    </div>
  );
}
