"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Wrench,
  Shield,
  Wallet,
  FolderTree,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  UserCheck,
  UserX,
  TrendingUp,
  Plus,
  RefreshCw,
  Clock,
  DollarSign,
  Activity,
  ArrowRight,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAllUsersAdminAction,
  updateUserStatusAction,
  getAllCategoriesAdminAction,
} from "./_actions/adminAction";
import { getAllPaymentsAction, PaymentItem } from "../../(withcommonlayout)/_actions/paymentAction";
import { getMeAction } from "../../(authGroup)/_actions/authActions";

const INK = "#14171C";
const CORAL = "#FF5A36";
const CORAL_DARK = "#C23B1F";
const TEAL = "#0FA894";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
  isBanned: boolean;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [adminName, setAdminName] = useState("Admin");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [categoriesCount, setCategoriesCount] = useState<number>(0);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [searchUser, setSearchUser] = useState("");

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [meRes, usersRes, catRes, payRes] = await Promise.all([
        getMeAction(),
        getAllUsersAdminAction({ limit: 100 }),
        getAllCategoriesAdminAction({ limit: 100 }),
        getAllPaymentsAction(),
      ]);

      if (meRes?.name) {
        setAdminName(meRes.name);
      }

      if (usersRes?.data && Array.isArray(usersRes.data)) {
        setUsers(usersRes.data);
      }

      if (catRes?.meta?.total !== undefined) {
        setCategoriesCount(catRes.meta.total);
      } else if (Array.isArray(catRes?.data)) {
        setCategoriesCount(catRes.data.length);
      }

      if (payRes?.data && Array.isArray(payRes.data)) {
        setPayments(payRes.data);
      }
    } catch (err) {
      console.error("Failed loading admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleToggleUserBan = async (userId: string, currentBannedState: boolean) => {
    setUpdatingUserId(userId);
    const newBannedState = !currentBannedState;
    const res = await updateUserStatusAction(userId, newBannedState);
    if (res?.success) {
      toast.success(`User ${newBannedState ? "banned" : "unbanned"} successfully!`);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isBanned: newBannedState } : u))
      );
    } else {
      toast.error(res?.message || "Failed to update user status.");
    }
    setUpdatingUserId(null);
  };

  // Metrics calculations
  const totalUsers = users.length;
  const customerCount = users.filter((u) => u.role === "CUSTOMER").length;
  const technicianCount = users.filter((u) => u.role === "TECHNICIAN").length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const bannedCount = users.filter((u) => u.isBanned).length;

  const totalRevenue = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const successfulPaymentsCount = payments.filter((p) => p.status === "PAID").length;

  const filteredUsers = users.filter((u) => {
    if (!searchUser.trim()) return true;
    const q = searchUser.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

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
              <Activity className="h-3.5 w-3.5" style={{ color: TEAL }} />
              Platform Command Center
            </div>
            <h1
              className="text-2xl font-extrabold tracking-tight sm:text-3xl"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Welcome back, <span style={{ color: CORAL }}>{adminName}</span>!
            </h1>
            <p className="max-w-xl text-xs sm:text-sm text-neutral-300">
              Monitor system health, manage platform users, track transactions, and manage service categories in real time.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 sm:shrink-0">
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/20 active:scale-95"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh Data
            </button>
            <Link
              href="/admin-dashboard/categories"
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
              style={{ background: `linear-gradient(135deg, ${CORAL} 0%, ${CORAL_DARK} 100%)` }}
            >
              <Plus className="h-4 w-4" /> Add Category
            </Link>
          </div>
        </div>
      </div>

      {/* ── KPI Metric Cards Grid ────────────────────────────── */}
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
                <div className="h-3 w-28 rounded bg-neutral-200" />
                <div className="h-7 w-20 rounded bg-neutral-200" />
                <div className="h-3 w-36 rounded bg-neutral-100" />
              </div>
            </div>
          ))
        ) : (
          <>
            {/* Total Users */}
            <div className="group rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all hover:border-[#FF5A36]/40 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm"
                  style={{ backgroundColor: `${CORAL}15`, color: CORAL }}
                >
                  <Users className="h-6 w-6" />
                </span>
                <Link
                  href="/admin-dashboard/users"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition-colors group-hover:border-[#FF5A36] group-hover:text-[#FF5A36]"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Total System Users</p>
                <h3 className="mt-1 text-2xl font-extrabold text-[#14171C]">
                  {totalUsers}
                </h3>
                <p className="mt-1 text-xs text-neutral-500">
                  <span className="font-semibold text-[#0FA894]">{customerCount}</span> Customers ·{" "}
                  <span className="font-semibold text-[#FF5A36]">{technicianCount}</span> Technicians
                </p>
              </div>
            </div>

            {/* Categories Count */}
            <div className="group rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all hover:border-[#0FA894]/40 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm"
                  style={{ backgroundColor: `${TEAL}15`, color: TEAL }}
                >
                  <FolderTree className="h-6 w-6" />
                </span>
                <Link
                  href="/admin-dashboard/categories"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition-colors group-hover:border-[#0FA894] group-hover:text-[#0FA894]"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Active Service Categories</p>
                <h3 className="mt-1 text-2xl font-extrabold text-[#14171C]">
                  {categoriesCount}
                </h3>
                <p className="mt-1 text-xs text-neutral-500">Available across all active cities</p>
              </div>
            </div>

            {/* Total Revenue / Payments */}
            <div className="group rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all hover:border-[#FF5A36]/40 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm"
                  style={{ backgroundColor: `${CORAL}15`, color: CORAL }}
                >
                  <Wallet className="h-6 w-6" />
                </span>
                <Link
                  href="/admin-dashboard/payments"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition-colors group-hover:border-[#FF5A36] group-hover:text-[#FF5A36]"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Total System Revenue</p>
                <h3 className="mt-1 text-2xl font-extrabold text-[#14171C]">
                  {`৳${totalRevenue.toLocaleString()}`}
                </h3>
                <p className="mt-1 text-xs text-neutral-500">
                  <span className="font-semibold text-[#0FA894]">{successfulPaymentsCount}</span> successful transactions
                </p>
              </div>
            </div>

            {/* Security & Status */}
            <div className="group rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all hover:border-neutral-400 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm"
                  style={{ backgroundColor: bannedCount > 0 ? "#FEE2E2" : `${TEAL}15`, color: bannedCount > 0 ? "#DC2626" : TEAL }}
                >
                  {bannedCount > 0 ? <ShieldAlert className="h-6 w-6" /> : <Shield className="h-6 w-6" />}
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                  Healthy
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Security &amp; Restrictions</p>
                <h3 className="mt-1 text-2xl font-extrabold text-[#14171C]">
                  {`${bannedCount} Banned`}
                </h3>
                <p className="mt-1 text-xs text-neutral-500">
                  {bannedCount === 0 ? "All users compliant & active" : "Restricted accounts requiring audit"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Quick Links / Navigation Cards ─────────────────────── */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Manage Users */}
        <Link
          href="/admin-dashboard/users"
          className="group relative overflow-hidden rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[#FF5A36] hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
              style={{ background: `linear-gradient(135deg, ${CORAL} 0%, ${CORAL_DARK} 100%)` }}
            >
              <Users className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#14171C] group-hover:text-[#FF5A36]">
                Manage Users
              </h3>
              <p className="mt-0.5 text-xs text-neutral-500">
                View all users, filter by roles, ban or unban accounts.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs font-bold text-[#FF5A36]">
            <span>Explore Users Table</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Categories */}
        <Link
          href="/admin-dashboard/categories"
          className="group relative overflow-hidden rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[#0FA894] hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
              style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #0B7A6C 100%)` }}
            >
              <FolderTree className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#14171C] group-hover:text-[#0FA894]">
                Categories
              </h3>
              <p className="mt-0.5 text-xs text-neutral-500">
                Create, update, or remove repair service categories.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs font-bold text-[#0FA894]">
            <span>Manage Categories</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Payment History */}
        <Link
          href="/admin-dashboard/payments"
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
                Payment Logs
              </h3>
              <p className="mt-0.5 text-xs text-neutral-500">
                Audit system transactions, status, and earnings.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs font-bold text-[#14171C]">
            <span>View All Payments</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>

      {/* ── Users Quick Management Table ───────────────────────── */}
      <div className="rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-neutral-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3
              className="text-lg font-extrabold text-[#14171C]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Recent Registered Users
            </h3>
            <p className="mt-0.5 text-xs text-neutral-500">
              Quickly manage account access and ban/unban statuses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 rounded-2xl border border-[#E7E2D8] bg-[#FFFBF3] px-3.5 py-2 text-xs">
              <Search className="h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Search by name or email…"
                className="w-36 bg-transparent text-xs text-[#14171C] outline-none placeholder:text-neutral-400 sm:w-48"
              />
            </div>

            <Link
              href="/admin-dashboard/users"
              className="rounded-2xl border border-[#E7E2D8] px-3.5 py-2 text-xs font-bold text-[#14171C] transition-colors hover:bg-[#FFFBF3]"
            >
              View All
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          {loading ? (
            <div className="space-y-3 py-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="animate-pulse flex items-center justify-between py-2 border-b border-neutral-100">
                  <div className="space-y-1.5">
                    <div className="h-4 w-36 rounded bg-neutral-200" />
                    <div className="h-3 w-48 rounded bg-neutral-100" />
                  </div>
                  <div className="h-5 w-20 rounded-full bg-neutral-200" />
                  <div className="h-4 w-24 rounded bg-neutral-100" />
                  <div className="h-5 w-16 rounded-full bg-neutral-200" />
                  <div className="h-7 w-16 rounded-xl bg-neutral-200" />
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto h-10 w-10 text-neutral-300" />
              <p className="mt-2 text-xs font-semibold text-neutral-500">No users found matching your search</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  <th className="pb-3 pt-2 font-semibold">User</th>
                  <th className="pb-3 pt-2 font-semibold">Role</th>
                  <th className="pb-3 pt-2 font-semibold">Joined Date</th>
                  <th className="pb-3 pt-2 font-semibold">Status</th>
                  <th className="pb-3 pt-2 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredUsers.slice(0, 7).map((u) => (
                  <tr key={u.id} className="group hover:bg-[#FFFBF3]/60">
                    <td className="py-3.5 font-semibold text-[#14171C]">
                      <div>
                        <p className="font-bold text-[#14171C]">{u.name || "Unnamed User"}</p>
                        <p className="text-[11px] font-normal text-neutral-400">{u.email}</p>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                        style={
                          u.role === "ADMIN"
                            ? { backgroundColor: `${CORAL}15`, color: CORAL }
                            : u.role === "TECHNICIAN"
                            ? { backgroundColor: `${TEAL}15`, color: TEAL }
                            : { backgroundColor: "#14171C10", color: INK }
                        }
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 text-neutral-500">
                      {new Date(u.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3.5">
                      {u.isBanned ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-600">
                          <XCircle className="h-3 w-3" /> Banned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right">
                      {u.role !== "ADMIN" && (
                        <button
                          type="button"
                          disabled={updatingUserId === u.id}
                          onClick={() => handleToggleUserBan(u.id, u.isBanned)}
                          className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-bold transition-all disabled:opacity-50 ${
                            u.isBanned
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-red-50 text-red-600 hover:bg-red-100"
                          }`}
                        >
                          {updatingUserId === u.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : u.isBanned ? (
                            <>
                              <UserCheck className="h-3 w-3" /> Unban
                            </>
                          ) : (
                            <>
                              <UserX className="h-3 w-3" /> Ban
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
