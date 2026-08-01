"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Wrench,
  XCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Search,
  Plus,
  Eye,
  CreditCard,
  Loader2,
  User,
  Star,
  Wallet,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { getMeAction } from "@/src/app/(authGroup)/_actions/authActions";
import { getUserBookingsAction, initiatePaymentAction } from "@/src/app/(withcommonlayout)/_actions/bookingAction";
import { getAllPaymentsAction } from "@/src/app/(withcommonlayout)/_actions/paymentAction";

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

const INK = "#14171C";
const CORAL = "#FF5A36";
const CORAL_DARK = "#C23B1F";
const TEAL = "#0FA894";

export default function CustomerDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [totalBookingsCount, setTotalBookingsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);

  const loadCustomerDashboard = async () => {
    setLoading(true);
    try {
      const [meRes, bookingsRes] = await Promise.all([
        getMeAction(),
        getUserBookingsAction({ limit: 50, page: 1 }),
      ]);

      if (meRes) {
        setUser(meRes);
      }

      if (bookingsRes && bookingsRes.success && Array.isArray(bookingsRes.data)) {
        setBookings(bookingsRes.data);
        setTotalBookingsCount(bookingsRes.meta?.total || bookingsRes.data.length);
      }
    } catch (error) {
      console.error("loadCustomerDashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomerDashboard();
  }, []);

  const handlePayNow = async (bookingId: string) => {
    setPayingBookingId(bookingId);
    try {
      const res = await initiatePaymentAction(bookingId);
      if (res && res.success && res.data?.paymentUrl) {
        toast.success("Redirecting to payment gateway…");
        window.location.href = res.data.paymentUrl;
      } else {
        toast.error(res?.message || "Failed to initiate payment.");
      }
    } catch (err) {
      console.error("PayNow error:", err);
      toast.error("An error occurred initiating payment.");
    } finally {
      setPayingBookingId(null);
    }
  };

  // Metrics
  const customerName = user?.name || "Valued Customer";
  const activeBookings = bookings.filter((b) => b.status === "PENDING" || b.status === "ACCEPTED");
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED");
  const unpaidBookings = bookings.filter(
    (b) => b.paymentStatus === "UNPAID" && b.status !== "DECLINED"
  );

  const totalSpent = bookings
    .filter((b) => b.paymentStatus === "PAID")
    .reduce((sum, b) => sum + (b.price || b.technicianProfile?.basePrice || b.technicianProfile?.hourlyRate || 0), 0);

  return (
    <div className="space-y-8">
      {/* ── Welcome Banner ────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-lg"
        style={{ background: `linear-gradient(135deg, ${INK} 0%, #1E252F 100%)` }}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full opacity-15 blur-3xl"
          style={{ background: CORAL }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full opacity-15 blur-3xl"
          style={{ background: TEAL }}
        />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
              <Sparkles className="h-3.5 w-3.5" style={{ color: TEAL }} />
              Customer Dashboard
            </div>
            <h1
              className="text-2xl font-extrabold tracking-tight sm:text-3xl"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Welcome back, <span style={{ color: CORAL }}>{customerName}</span>!
            </h1>
            <p className="max-w-xl text-xs sm:text-sm text-neutral-300">
              Track your service bookings, manage payments, and request expert home repair technicians in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 sm:shrink-0">
            <button
              onClick={loadCustomerDashboard}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/20 active:scale-95"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link
              href="/technicians"
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
              style={{ background: `linear-gradient(135deg, ${CORAL} 0%, ${CORAL_DARK} 100%)` }}
            >
              <Plus className="h-4 w-4" /> Book New Service
            </Link>
          </div>
        </div>
      </div>

      {/* ── Metric Cards Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-neutral-200" />
                <div className="h-7 w-12 rounded-full bg-neutral-100" />
              </div>
              <div className="space-y-2 pt-1">
                <div className="h-3 w-24 rounded bg-neutral-200" />
                <div className="h-7 w-20 rounded bg-neutral-200" />
                <div className="h-3 w-32 rounded bg-neutral-100" />
              </div>
            </div>
          ))
        ) : (
          <>
            {/* Total Bookings */}
            <div className="group rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all hover:border-[#FF5A36]/40 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm"
                  style={{ backgroundColor: `${CORAL}15`, color: CORAL }}
                >
                  <CalendarCheck className="h-6 w-6" />
                </span>
                <Link
                  href="/dashboard/bookings"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition-colors group-hover:border-[#FF5A36] group-hover:text-[#FF5A36]"
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Total Bookings</p>
                <h3 className="mt-1 text-2xl font-extrabold text-[#14171C]">
                  {totalBookingsCount}
                </h3>
                <p className="mt-1 text-xs text-neutral-500">Service requests history</p>
              </div>
            </div>

            {/* Active Bookings */}
            <div className="group rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all hover:border-[#0FA894]/40 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm"
                  style={{ backgroundColor: `${TEAL}15`, color: TEAL }}
                >
                  <Clock className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold text-[#0FA894]">
                  Active
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Pending &amp; Accepted</p>
                <h3 className="mt-1 text-2xl font-extrabold text-[#14171C]">
                  {activeBookings.length}
                </h3>
                <p className="mt-1 text-xs text-neutral-500">Upcoming scheduled services</p>
              </div>
            </div>

            {/* Completed Services */}
            <div className="group rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all hover:border-[#FF5A36]/40 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm"
                  style={{ backgroundColor: `${CORAL}15`, color: CORAL }}
                >
                  <CheckCircle2 className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                  Fulfilled
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Completed Jobs</p>
                <h3 className="mt-1 text-2xl font-extrabold text-[#14171C]">
                  {completedBookings.length}
                </h3>
                <p className="mt-1 text-xs text-neutral-500">Finished service appointments</p>
              </div>
            </div>

            {/* Total Spent */}
            <div className="group rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all hover:border-neutral-400 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm"
                  style={{ backgroundColor: `${INK}10`, color: INK }}
                >
                  <Wallet className="h-6 w-6" />
                </span>
                <Link
                  href="/dashboard/payments"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition-colors group-hover:border-[#FF5A36] group-hover:text-[#FF5A36]"
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Total Spent</p>
                <h3 className="mt-1 text-2xl font-extrabold text-[#14171C]">
                  {`৳${totalSpent.toLocaleString()}`}
                </h3>
                <p className="mt-1 text-xs text-neutral-500">
                  <span className="font-semibold text-amber-600">{unpaidBookings.length}</span> unpaid pending bill
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Quick Action Navigation Cards ────────────────────── */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Browse Technicians */}
        <Link
          href="/technicians"
          className="group relative overflow-hidden rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[#FF5A36] hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
              style={{ background: `linear-gradient(135deg, ${CORAL} 0%, ${CORAL_DARK} 100%)` }}
            >
              <Wrench className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#14171C] group-hover:text-[#FF5A36]">
                Hire a Technician
              </h3>
              <p className="mt-0.5 text-xs text-neutral-500">
                Browse verified plumbers, electricians, AC repair experts.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs font-bold text-[#FF5A36]">
            <span>Explore Experts</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* My Bookings */}
        <Link
          href="/dashboard/bookings"
          className="group relative overflow-hidden rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[#0FA894] hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
              style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #0B7A6C 100%)` }}
            >
              <CalendarCheck className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#14171C] group-hover:text-[#0FA894]">
                My Bookings
              </h3>
              <p className="mt-0.5 text-xs text-neutral-500">
                Manage appointment dates, review technicians, &amp; check status.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs font-bold text-[#0FA894]">
            <span>View All Bookings</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Payments */}
        <Link
          href="/dashboard/payments"
          className="group relative overflow-hidden rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[#14171C] hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
              style={{ background: `linear-gradient(135deg, ${INK} 0%, #2A303C 100%)` }}
            >
              <Wallet className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#14171C] group-hover:text-[#FF5A36]">
                Payment History
              </h3>
              <p className="mt-0.5 text-xs text-neutral-500">
                View receipts, invoice details, and online payment status.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs font-bold text-[#14171C]">
            <span>View Receipts</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>

      {/* ── Active & Recent Bookings Section ──────────────────── */}
      <div className="rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-5">
          <div>
            <h3
              className="text-lg font-extrabold text-[#14171C]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Recent Bookings &amp; Service Activity
            </h3>
            <p className="mt-0.5 text-xs text-neutral-500">
              Track current appointment statuses and make payments online.
            </p>
          </div>

          <Link
            href="/dashboard/bookings"
            className="flex items-center gap-1 text-xs font-bold text-[#FF5A36] hover:underline"
          >
            View All ({totalBookingsCount})
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* List */}
        <div className="mt-4">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse flex flex-col gap-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-neutral-200" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 rounded bg-neutral-200" />
                      <div className="h-3 w-48 rounded bg-neutral-100" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-5 w-16 rounded bg-neutral-200" />
                    <div className="h-8 w-24 rounded-2xl bg-neutral-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-12 text-center">
              <CalendarCheck className="mx-auto h-12 w-12 text-neutral-300" />
              <h4 className="mt-3 text-sm font-bold text-[#14171C]">No bookings yet</h4>
              <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
                You haven't booked any technician services yet. Find expert home repair technicians in your city.
              </p>
              <Link
                href="/technicians"
                className="mt-5 inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${CORAL} 0%, ${CORAL_DARK} 100%)` }}
              >
                <Plus className="h-4 w-4" /> Book First Service
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {bookings.slice(0, 5).map((b) => {
                const techName = b.technicianProfile?.user?.name || "Technician";
                const bookingPrice = b.price || b.technicianProfile?.basePrice || b.technicianProfile?.hourlyRate || 35;
                const formattedDate = new Date(b.bookingDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });

                return (
                  <div key={b.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm"
                        style={{ backgroundColor: `${CORAL}15`, color: CORAL }}
                      >
                        <Wrench className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-[#14171C]">{techName}</h4>
                          {/* Booking Status Badge */}
                          <span
                            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                            style={
                              b.status === "COMPLETED"
                                ? { backgroundColor: "#D1FAE5", color: "#065F46" }
                                : b.status === "ACCEPTED"
                                ? { backgroundColor: `${TEAL}20`, color: TEAL }
                                : b.status === "DECLINED"
                                ? { backgroundColor: "#FEE2E2", color: "#991B1B" }
                                : { backgroundColor: "#FEF3C7", color: "#92400E" }
                            }
                          >
                            {b.status}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-neutral-500">
                          📅 {formattedDate} · ⏰ {b.slot}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-[#14171C]">৳{bookingPrice}</p>
                        <p
                          className="text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: b.paymentStatus === "PAID" ? TEAL : CORAL }}
                        >
                          {b.paymentStatus === "PAID" ? "Paid Online" : "Unpaid"}
                        </p>
                      </div>

                      {b.paymentStatus === "UNPAID" && b.status !== "DECLINED" ? (
                        <button
                          type="button"
                          disabled={payingBookingId === b.id}
                          onClick={() => handlePayNow(b.id)}
                          className="inline-flex items-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                          style={{ background: `linear-gradient(135deg, ${CORAL} 0%, ${CORAL_DARK} 100%)` }}
                        >
                          {payingBookingId === b.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <CreditCard className="h-3.5 w-3.5" />
                          )}
                          Pay Now
                        </button>
                      ) : (
                        <Link
                          href="/dashboard/bookings"
                          className="inline-flex items-center gap-1 rounded-2xl border border-[#E7E2D8] px-3.5 py-2 text-xs font-bold text-[#14171C] transition-colors hover:bg-[#FFFBF3]"
                        >
                          <Eye className="h-3.5 w-3.5" /> Details
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Customer Help & Guarantee Banner ─────────────────── */}
      <div className="rounded-3xl border border-[#E7E2D8] bg-[#FFFBF3] p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm"
              style={{ backgroundColor: `${TEAL}15`, color: TEAL }}
            >
              <ShieldCheck className="h-7 w-7" />
            </span>
            <div>
              <h3 className="text-base font-extrabold text-[#14171C]">FixItNow 100% Service Guarantee</h3>
              <p className="mt-0.5 text-xs text-neutral-600 max-w-lg">
                All home repair bookings are backed by background-checked professionals and our customer satisfaction promise. Need assistance with a booking?
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-2xl border border-[#E7E2D8] bg-white px-5 py-3 text-xs font-bold text-[#14171C] shadow-sm transition-all hover:border-[#FF5A36] hover:text-[#FF5A36]"
          >
            <MessageSquare className="h-4 w-4" style={{ color: CORAL }} />
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
