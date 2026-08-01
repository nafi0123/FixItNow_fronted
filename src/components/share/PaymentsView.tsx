"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  Search,
  X,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  User,
  Wrench,
  Calendar,
  ChevronLeft,
  ChevronRight,
  SearchX,
  ArrowUpRight
} from "lucide-react";
import { toast } from "sonner";
import { getAllPaymentsAction, getPaymentByIdAction, PaymentItem } from "@/src/app/(withcommonlayout)/_actions/paymentAction";

const CORAL = "#FF5A36";
const CORAL_DARK = "#C23B1F";
const TEAL = "#0FA894";

interface PaymentsViewProps {
  userRole?: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
}

export default function PaymentsView({ userRole = "CUSTOMER" }: PaymentsViewProps) {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchPayments = async () => {
    setLoading(true);
    const res = await getAllPaymentsAction();
    if (res && res.success && Array.isArray(res.data)) {
      setPayments(res.data);
    } else {
      setPayments([]);
      toast.error(res?.message || "Failed to load payment history.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleViewDetails = async (transactionId: string) => {
    setLoadingDetails(true);
    const res = await getPaymentByIdAction(transactionId);
    if (res && res.success && res.data) {
      setSelectedPayment(res.data);
    } else {
      toast.error(res?.message || "Failed to load transaction details.");
    }
    setLoadingDetails(false);
  };

  // Filtered Payments Logic
  const filteredPayments = payments.filter((item) => {
    const matchesSearch =
      search.trim() === "" ||
      item.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      item.booking?.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.booking?.technicianProfile?.user?.name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || item.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  // Calculate totals
  const totalAmount = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const paidCount = payments.filter((p) => p.status === "PAID").length;
  const pendingCount = payments.filter((p) => p.status === "PENDING").length;

  // Pagination
  const totalPage = Math.ceil(filteredPayments.length / limit) || 1;
  const paginatedPayments = filteredPayments.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${CORAL}12`, color: CORAL_DARK }}
          >
            <CreditCard className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E2026]">
              {userRole === "ADMIN"
                ? "All System Payments & Transactions"
                : userRole === "TECHNICIAN"
                ? "Earnings & Payment Records"
                : "My Payment Transactions"}
            </h1>
            <p className="text-xs text-[#6B707E]">
              Track transactions, payment statuses, SSLCommerz gateway records, and financial summaries.
            </p>
          </div>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B707E]">
              {userRole === "TECHNICIAN" ? "Total Earnings" : userRole === "ADMIN" ? "Total Processed" : "Total Spent"}
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-[#1E2026]">${totalAmount.toLocaleString()}</p>
          <span className="text-[11px] text-[#0FA894] font-medium flex items-center gap-1 mt-1">
            <CheckCircle2 className="h-3 w-3" /> {paidCount} successful payments
          </span>
        </div>

        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B707E]">Completed Payments</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-[#0FA894]">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-[#1E2026]">{paidCount}</p>
          <span className="text-[11px] text-[#6B707E] font-medium mt-1 block">Verified by SSLCommerz</span>
        </div>

        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B707E]">Pending / In-Progress</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-[#1E2026]">{pendingCount}</p>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">Awaiting checkout completion</span>
        </div>
      </div>

      {/* Control Bar: Search & Status Filter */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E7E2D8] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="group relative flex w-full items-center gap-2.5 rounded-xl border border-[#E7E2D8] bg-white px-3.5 py-2.5 shadow-sm transition-all focus-within:border-[#FF5A36] focus-within:ring-4 focus-within:ring-[#FF5A36]/10 sm:w-80">
          <Search className="h-4 w-4 shrink-0 text-[#9AA0AA] transition-colors group-focus-within:text-[#FF5A36]" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by Transaction ID or Name..."
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
            <span className="text-[#6B707E]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-semibold text-[#1E2026] outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="PAID">PAID</option>
              <option value="PENDING">PENDING</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E7E2D8] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E7E2D8] bg-[#FFFBF3] text-[11px] font-semibold uppercase tracking-wide text-[#6B707E]">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Party</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E2D8]">
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-3.5 w-32 rounded bg-[#F1EEE6]" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3.5 w-28 rounded bg-[#F1EEE6]" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3.5 w-16 rounded bg-[#F1EEE6]" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3.5 w-20 rounded bg-[#F1EEE6]" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3.5 w-24 rounded bg-[#F1EEE6]" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-7 w-8 ml-auto rounded bg-[#F1EEE6]" />
                    </td>
                  </tr>
                ))
              ) : paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFFBF3] text-[#9AA0AA]">
                        <SearchX className="h-5 w-5" />
                      </span>
                      <p className="text-sm font-medium text-[#1E2026]">No payment records found</p>
                      <p className="text-xs text-[#6B707E]">Completed transactions will be listed here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((item) => {
                  const customerName = item.booking?.customer?.name || "Customer";
                  const techName = item.booking?.technicianProfile?.user?.name || "Technician";

                  return (
                    <tr key={item.id} className="transition-colors hover:bg-[#FFFBF3]/60">
                      <td className="px-6 py-4 font-mono font-bold text-[#1E2026]">
                        {item.transactionId}
                      </td>
                      <td className="px-6 py-4">
                        {userRole === "TECHNICIAN" ? (
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-[#FF5A36]" />
                            <span className="font-semibold text-[#1E2026]">{customerName}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Wrench className="h-3.5 w-3.5 text-[#0FA894]" />
                            <span className="font-semibold text-[#1E2026]">{techName}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-extrabold text-[#1E2026]">
                        ${item.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            item.status === "PAID"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : item.status === "PENDING"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-rose-50 text-rose-700 border border-rose-100"
                          }`}
                        >
                          {item.status === "PAID" && <CheckCircle2 className="h-3 w-3" />}
                          {item.status === "PENDING" && <Clock className="h-3 w-3" />}
                          {item.status === "FAILED" && <XCircle className="h-3 w-3" />}
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#6B707E] font-medium">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleViewDetails(item.transactionId)}
                          title="View Payment Details"
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#E7E2D8] bg-white text-[#6B707E] transition-all hover:border-[#FF5A36] hover:bg-[#FFFBF3] hover:text-[#FF5A36] ml-auto"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#E7E2D8] bg-[#FFFBF3] px-6 py-4 sm:flex-row">
          <p className="text-xs text-[#6B707E]">
            Showing <span className="font-semibold text-[#1E2026]">{paginatedPayments.length}</span> of{" "}
            <span className="font-semibold text-[#1E2026]">{filteredPayments.length}</span> payments
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
              Page {page} of {totalPage}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPage))}
              disabled={page >= totalPage || loading}
              className="flex h-8 items-center justify-center gap-1 rounded-lg border border-[#E7E2D8] bg-white px-3 text-xs font-medium text-[#1E2026] transition-colors hover:border-[#FF5A36]/40 hover:bg-[#FFF6EA] disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Payment Details View Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-[#E7E2D8] space-y-5">
            <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF5A36]/10 text-[#FF5A36]">
                  <CreditCard className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-base font-extrabold text-[#1E2026]">Payment Details</h2>
                  <p className="text-[11px] text-[#6B707E] font-mono">{selectedPayment.transactionId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="rounded-full p-1.5 text-[#9AA0AA] hover:bg-[#FFFBF3] hover:text-[#1E2026] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Payment Summary Box */}
              <div className="rounded-2xl bg-[#FFFBF3] border border-[#E7E2D8] p-4 space-y-2 text-[#1E2026]">
                <div className="flex justify-between items-center">
                  <span className="text-[#6B707E]">Amount Paid:</span>
                  <span className="font-extrabold text-base text-[#1E2026]">${selectedPayment.amount} BDT</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B707E]">Status:</span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      selectedPayment.status === "PAID"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : selectedPayment.status === "PENDING"
                        ? "bg-amber-50 text-amber-700 border border-amber-100"
                        : "bg-rose-50 text-rose-700 border border-rose-100"
                    }`}
                  >
                    {selectedPayment.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B707E]">Gateway:</span>
                  <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-[10px]">SSLCommerz</span>
                </div>
              </div>

              {/* Related Booking Details */}
              {selectedPayment.booking && (
                <div className="rounded-2xl border border-[#E7E2D8] bg-white p-4 space-y-2.5">
                  <p className="font-bold text-[#1E2026] flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-[#FF5A36]" />
                    Associated Appointment
                  </p>
                  <div className="flex justify-between text-[#1E2026]">
                    <span className="text-[#6B707E]">Booking Date:</span>
                    <span className="font-semibold">
                      {new Date(selectedPayment.booking.bookingDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#1E2026]">
                    <span className="text-[#6B707E]">Time Slot:</span>
                    <span className="font-semibold">{selectedPayment.booking.slot}</span>
                  </div>
                  {selectedPayment.booking.customer && (
                    <div className="flex justify-between text-[#1E2026]">
                      <span className="text-[#6B707E]">Customer:</span>
                      <span className="font-semibold">{selectedPayment.booking.customer.name}</span>
                    </div>
                  )}
                  {selectedPayment.booking.technicianProfile?.user && (
                    <div className="flex justify-between text-[#1E2026]">
                      <span className="text-[#6B707E]">Technician:</span>
                      <span className="font-semibold">{selectedPayment.booking.technicianProfile.user.name}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-[#E7E2D8] pt-3">
              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="rounded-xl border border-[#E7E2D8] bg-white px-4 py-2 text-xs font-bold text-[#6B707E] hover:bg-[#FFFBF3] transition-colors"
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
