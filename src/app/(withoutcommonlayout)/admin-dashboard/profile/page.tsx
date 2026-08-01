"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Edit3,
  Check,
  X,
  Camera,
  Lock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Users,
  BarChart3,
  Settings,
  Key,
} from "lucide-react";
import { getMeAction } from "@/src/app/(authGroup)/_actions/authActions";
import { updateProfileAction, changePasswordAction } from "@/src/app/(authGroup)/_actions/profileActions";
import { logoutAction } from "@/src/app/(authGroup)/_actions/authActions";

const CORAL = "#FF5A36";
const CORAL_DARK = "#C23B1F";
const TEAL = "#0FA894";
const INK = "#14171C";

interface UserData {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  isBanned?: boolean;
}

function getInitials(name: string) {
  if (!name) return "A";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function AdminProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [pwModal, setPwModal] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    getMeAction().then((data) => {
      if (data) {
        setUser(data);
        setNameInput(data.name || "");
      }
      setLoading(false);
    });
  }, []);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async () => {
    if (!nameInput.trim()) return;
    setSaving(true);
    const result = await updateProfileAction({ name: nameInput.trim() });
    setSaving(false);
    if (result?.success) {
      setUser((prev) => ({ ...prev, name: nameInput.trim() }));
      setEditing(false);
      showToast("success", "Profile updated successfully!");
    } else {
      showToast("error", result?.message || "Update failed. Try again.");
    }
  };

  const handleChangePassword = async () => {
    if (!pwForm.currentPassword || !pwForm.newPassword) return;
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      showToast("error", "New passwords do not match!");
      return;
    }
    if (pwForm.newPassword.length < 6) {
      showToast("error", "New password must be at least 6 characters.");
      return;
    }
    setPwSaving(true);
    const result = await changePasswordAction({
      currentPassword: pwForm.currentPassword,
      newPassword: pwForm.newPassword,
    });
    setPwSaving(false);
    if (result?.success) {
      setPwModal(false);
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showToast("success", "Password changed successfully!");
    } else {
      showToast("error", result?.message || "Failed to change password.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: CORAL }} />
      </div>
    );
  }

  const initials = getInitials(user?.name || "");
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  return (
    <div className="w-full space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className="fixed right-6 top-6 z-50 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-xl"
          style={{ backgroundColor: toast.type === "success" ? TEAL : "#C23B1F" }}
        >
          {toast.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#14171C]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Admin Profile
        </h1>
        <p className="mt-1 text-sm text-neutral-500">Manage your administrator account and preferences.</p>
      </div>

      {/* Admin Identity Card */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 text-white shadow-md"
        style={{ background: `linear-gradient(135deg, ${INK} 0%, #1E252F 100%)` }}
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full opacity-10 blur-2xl"
          style={{ background: CORAL }}
        />
        <div
          className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full opacity-10 blur-2xl"
          style={{ background: TEAL }}
        />
        <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="relative">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-extrabold text-white shadow-md ring-2 ring-white/20"
              style={{ background: `linear-gradient(135deg, ${CORAL} 0%, ${CORAL_DARK} 100%)` }}
            >
              {initials}
            </div>
            <span
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-sm"
              style={{ backgroundColor: TEAL, borderColor: INK }}
            >
              <Camera className="h-3.5 w-3.5 text-white" />
            </span>
          </div>

          {/* Name + Badge */}
          <div className="flex-1">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white outline-none placeholder-white/40 focus:border-white/40"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditing(false); }}
                />
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: TEAL }}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => { setEditing(false); setNameInput(user?.name || ""); }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 text-white/60 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-extrabold text-white">{user?.name || "—"}</h2>
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Edit3 className="h-3 w-3" /> Edit
                </button>
              </div>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide"
                style={{ backgroundColor: `${CORAL}30`, color: CORAL }}
              >
                <Shield className="h-3 w-3" /> Admin
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white/70">
                <Key className="h-3 w-3" /> Full Access
              </span>
            </div>
            <p className="mt-2 text-xs text-white/50">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Admin Permissions Banner */}
      <div
        className="rounded-2xl border p-4"
        style={{ backgroundColor: `${TEAL}08`, borderColor: `${TEAL}30` }}
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" style={{ color: TEAL }} />
            <span className="text-xs font-semibold text-[#14171C]">Manage Users</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" style={{ color: TEAL }} />
            <span className="text-xs font-semibold text-[#14171C]">View Reports</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" style={{ color: TEAL }} />
            <span className="text-xs font-semibold text-[#14171C]">Manage Categories</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" style={{ color: TEAL }} />
            <span className="text-xs font-semibold text-[#14171C]">Full Access</span>
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${CORAL}15` }}>
              <Mail className="h-4 w-4" style={{ color: CORAL }} />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Email Address</p>
              <p className="mt-0.5 text-sm font-semibold text-[#14171C]">{user?.email || "—"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${TEAL}15` }}>
              <Calendar className="h-4 w-4" style={{ color: TEAL }} />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Admin Since</p>
              <p className="mt-0.5 text-sm font-semibold text-[#14171C]">{memberSince}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${INK}10` }}>
              <User className="h-4 w-4" style={{ color: INK }} />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Account Type</p>
              <p className="mt-0.5 text-sm font-semibold text-[#14171C]">Administrator</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${TEAL}15` }}>
              <CheckCircle2 className="h-4 w-4" style={{ color: TEAL }} />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Account Status</p>
              <p className="mt-0.5 text-sm font-semibold" style={{ color: TEAL }}>Active & Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-neutral-100 pb-4">
          <Lock className="h-4 w-4 text-neutral-400" />
          <h3 className="text-sm font-extrabold text-[#14171C]">Security Settings</h3>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#14171C]">Password</p>
            <p className="text-xs text-neutral-500">Use a strong password to protect your admin account.</p>
          </div>
          <button
            onClick={() => setPwModal(true)}
            className="rounded-2xl border border-[#E7E2D8] px-4 py-2 text-xs font-bold text-[#14171C] transition-all hover:border-[#FF5A36] hover:text-[#FF5A36]"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {pwModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#14171C]">Change Password</h3>
              <button onClick={() => { setPwModal(false); setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }} className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#14171C]">Current Password</label>
                <input
                  type="password"
                  value={pwForm.currentPassword}
                  onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                  className="w-full rounded-2xl border border-[#E7E2D8] bg-[#FFFBF3] px-4 py-2.5 text-sm font-medium text-[#14171C] outline-none focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#14171C]">New Password</label>
                <input
                  type="password"
                  value={pwForm.newPassword}
                  onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
                  placeholder="Min. 6 characters"
                  className="w-full rounded-2xl border border-[#E7E2D8] bg-[#FFFBF3] px-4 py-2.5 text-sm font-medium text-[#14171C] outline-none focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#14171C]">Confirm New Password</label>
                <input
                  type="password"
                  value={pwForm.confirmPassword}
                  onChange={(e) => setPwForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Re-enter new password"
                  className="w-full rounded-2xl border border-[#E7E2D8] bg-[#FFFBF3] px-4 py-2.5 text-sm font-medium text-[#14171C] outline-none focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/10"
                />
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => { setPwModal(false); setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }}
                className="flex-1 rounded-2xl border border-[#E7E2D8] py-2.5 text-xs font-bold text-neutral-500 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={pwSaving}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-2.5 text-xs font-bold text-white shadow-md transition-all hover:opacity-90 disabled:opacity-70"
                style={{ background: `linear-gradient(135deg, ${CORAL} 0%, ${CORAL_DARK} 100%)` }}
              >
                {pwSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {pwSaving ? "Saving..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="rounded-3xl border border-[#E7E2D8] bg-[#FFFBF3] px-6 py-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-[#14171C]">Sign Out</p>
            <p className="text-xs text-neutral-500">Sign out from the admin panel.</p>
          </div>
          <button
            onClick={() => logoutAction()}
            className="rounded-2xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:opacity-90"
            style={{ backgroundColor: CORAL }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
