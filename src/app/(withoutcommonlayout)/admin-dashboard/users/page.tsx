"use client"

import { useState, useEffect } from "react"
import {
  Search,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Filter,
  ShieldAlert,
  CheckCircle2,
  Users,
  SearchX,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { getAllUsersAdminAction, updateUserStatusAction } from "../_actions/adminAction"

interface UserItem {
  id: string
  name: string
  email: string
  role: "CUSTOMER" | "TECHNICIAN" | "ADMIN"
  isBanned: boolean
  createdAt: string
}

interface MetaData {
  page: number
  limit: number
  total: number
  totalPage: number
}

// Brand palette — same tokens used across the site
const INK = "#14171C"
const CORAL = "#FF5A36"
const CORAL_DARK = "#C23B1F"
const TEAL = "#0FA894"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [meta, setMeta] = useState<MetaData>({ page: 1, limit: 10, total: 0, totalPage: 1 })
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  const fetchUsers = async () => {
    setLoading(true)
    const response = await getAllUsersAdminAction({
      page,
      limit,
      search: debouncedSearch,
      role: roleFilter,
    })

    if (response && response.success) {
      setUsers(response.data || [])
      if (response.meta) {
        setMeta(response.meta)
      }
    } else {
      toast.error(response?.message || "Failed to load users")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [page, limit, debouncedSearch, roleFilter])

  const handleToggleStatus = async (user: UserItem) => {
    const newBannedState = !user.isBanned
    setUpdatingId(user.id)

    const res = await updateUserStatusAction(user.id, newBannedState)

    if (res && res.success) {
      toast.success(res.message || `User ${newBannedState ? "banned" : "unbanned"} successfully!`)
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isBanned: newBannedState } : u))
      )
    } else {
      toast.error(res?.message || "Failed to update user status")
    }

    setUpdatingId(null)
  }

  // Role badge — flat pill using brand tokens instead of generic Tailwind hues
  const roleBadgeStyle = (role: string): React.CSSProperties => {
    switch (role) {
      case "ADMIN":
        return { backgroundColor: INK, color: "#FFFFFF" }
      case "TECHNICIAN":
        return { backgroundColor: `${TEAL}1A`, color: TEAL, border: `1px solid ${TEAL}40` }
      default:
        return { backgroundColor: `${CORAL}12`, color: CORAL_DARK, border: `1px solid ${CORAL}30` }
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    const parts = name.trim().split(" ")
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${CORAL}12`, color: CORAL_DARK }}
        >
          <Users className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E2026]">User management</h1>
          <p className="text-xs text-[#6B707E]">
            Search, filter, and manage permissions or status for all platform users.
          </p>
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E7E2D8] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="group relative flex w-full items-center gap-2.5 rounded-xl border border-[#E7E2D8] bg-white px-3.5 py-2.5 shadow-sm transition-all focus-within:border-[#FF5A36] focus-within:ring-4 focus-within:ring-[#FF5A36]/10 sm:w-80">
          <Search className="h-4 w-4 shrink-0 text-[#9AA0AA] transition-colors group-focus-within:text-[#FF5A36]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
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

        {/* Role Filter & Limit */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-xl border border-[#E7E2D8] bg-[#FFFBF3] px-3 py-2 text-xs">
            <Filter className="h-3.5 w-3.5 text-[#6B707E]" />
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value)
                setPage(1)
              }}
              className="bg-transparent font-medium text-[#1E2026] outline-none"
            >
              <option value="">All roles</option>
              <option value="CUSTOMER">Customer</option>
              <option value="TECHNICIAN">Technician</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-[#E7E2D8] bg-[#FFFBF3] px-3 py-2 text-xs">
            <span className="text-[#6B707E]">Show:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value))
                setPage(1)
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

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E7E2D8] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E7E2D8] bg-[#FFFBF3] text-[11px] font-semibold uppercase tracking-wide text-[#6B707E]">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E2D8]">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 shrink-0 rounded-full bg-[#F1EEE6]" />
                        <div className="h-3.5 w-28 rounded bg-[#F1EEE6]" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3.5 w-36 rounded bg-[#F1EEE6]" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-16 rounded-full bg-[#F1EEE6]" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-14 rounded bg-[#F1EEE6]" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3.5 w-20 rounded bg-[#F1EEE6]" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="ml-auto h-7 w-24 rounded-lg bg-[#F1EEE6]" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFFBF3] text-[#9AA0AA]">
                        <SearchX className="h-5 w-5" />
                      </span>
                      <p className="text-sm font-medium text-[#1E2026]">No users found</p>
                      <p className="text-xs text-[#6B707E]">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-[#FFFBF3]/60">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: user.isBanned ? "#9AA0AA" : CORAL }}
                        >
                          {getInitials(user.name)}
                        </div>
                        <p className="font-semibold text-[#1E2026]">{user.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#4A4E58]">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
                        style={roleBadgeStyle(user.role)}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isBanned ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600">
                          <ShieldAlert className="h-3.5 w-3.5" />
                          Banned
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                          style={{ backgroundColor: `${TEAL}14`, color: TEAL }}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#6B707E]">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        disabled={updatingId === user.id}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                          user.isBanned
                            ? "border-[#0FA894]/30 bg-[#0FA894]/10 text-[#0B8A78] hover:bg-[#0FA894]/20"
                            : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                        }`}
                      >
                        {updatingId === user.id ? (
                          "Updating..."
                        ) : user.isBanned ? (
                          <>
                            <UserCheck className="h-3.5 w-3.5" />
                            Unban user
                          </>
                        ) : (
                          <>
                            <UserX className="h-3.5 w-3.5" />
                            Ban user
                          </>
                        )}
                      </button>
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
            of <span className="font-semibold text-[#1E2026]">{meta.total}</span> users
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
  )
}