"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wrench,
  LayoutDashboard,
  CalendarCheck,
  Search,
  MessageSquare,
  Wallet,
  Settings,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  X,
  ClipboardList,
  Briefcase,
  Star,
  User,
} from "lucide-react";
import { logoutAction, getMeAction } from "../(authGroup)/_actions/authActions";

// Same palette as the rest of the site
const INK = "#14171C";
const CORAL = "#FF5A36";
const TEAL = "#0FA894";

type Role = "customer" | "technician" | "admin";

const navByRole: Record<Role, { label: string; href: string; icon: typeof LayoutDashboard }[]> = {
  customer: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
  ],
  technician: [
    { label: "Overview", href: "/technician-dashboard", icon: LayoutDashboard },
    { label: "Job requests", href: "/technician-dashboard/requests", icon: ClipboardList },
    { label: "My services", href: "/technician-dashboard/services", icon: Briefcase },
    { label: "Profile", href: "/technician-dashboard/profile", icon: User },
  ],
  admin: [
    { label: "Overview", href: "/admin-dashboard", icon: LayoutDashboard },
    { label: "Manage Users", href: "/admin-dashboard/users", icon: User },
    { label: "Categories", href: "/admin-dashboard/categories", icon: Briefcase },
  ],
};

interface UserProfile {
  name?: string;
  email?: string;
  role?: string;
}

export default function DashboardLayout({
  role,
  children,
}: {
  role?: Role;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const loadProfile = async () => {
      const data = await getMeAction();
      if (data) {
        setProfile(data);
      }
    };
    loadProfile();
  }, []);

  let activeRole: Role = role || "customer";

  if (profile?.role) {
    const fetchedRole = profile.role.toLowerCase();
    if (fetchedRole === "customer" || fetchedRole === "technician" || fetchedRole === "admin") {
      activeRole = fetchedRole as Role;
    }
  } else if (!role) {
    if (pathname.startsWith("/admin-dashboard")) {
      activeRole = "admin";
    } else if (pathname.startsWith("/technician-dashboard")) {
      activeRole = "technician";
    } else {
      activeRole = "customer";
    }
  }

  const navItems = navByRole[activeRole] || navByRole.customer;

  const displayName = profile?.name || "User";
  const displayEmail = profile?.email || "";
  const displayMeta = profile?.role
    ? profile.role === "CUSTOMER"
      ? "Customer"
      : profile.role === "TECHNICIAN"
        ? "Technician"
        : "Admin"
    : activeRole === "customer"
      ? "Customer"
      : activeRole === "technician"
        ? "Technician"
        : "Admin";

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const userInitials = getInitials(displayName);

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <div className="flex min-h-screen bg-[#FFFBF3]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        style={{ backgroundColor: INK }}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
              <Wrench className="h-4 w-4" style={{ color: CORAL }} />
            </span>
            <span
              className="text-base font-bold tracking-tight text-white"
              style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}
            >
              FixIt<span style={{ color: CORAL }}>Now</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white/60 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Role badge */}
        <div className="mx-5 mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/60">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: TEAL }} />
          {activeRole === "customer"
            ? "Customer account"
            : activeRole === "technician"
              ? "Technician account"
              : "Admin account"}
        </div>

        <nav className="mt-6 flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                style={isActive ? { backgroundColor: `${CORAL}1A`, color: CORAL } : undefined}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User card */}
        <div className="m-3 rounded-xl bg-white/5 p-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: CORAL }}
            >
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{displayName}</p>
              <p className="truncate text-xs text-white/50">{displayEmail || displayMeta}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-xs font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[#FF5A36]/10 bg-white/80 px-4 backdrop-blur-md sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[#1E2026] lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden flex-1 items-center rounded-full border border-[#E7E2D8] bg-white px-4 py-2 sm:flex sm:max-w-sm">
            <Search className="h-4 w-4 text-[#9AA0AA]" />
            <input
              type="text"
              placeholder={activeRole === "customer" ? "Search bookings…" : "Search job requests…"}
              className="w-full bg-transparent px-2.5 text-sm text-[#1E2026] outline-none placeholder:text-[#9AA0AA]"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#6B707E] transition-colors hover:bg-[#FFF6EA] hover:text-[#1E2026]"
              aria-label="Notifications"
            >
              <Bell className="h-4.5 w-4.5" />
              <span
                className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full ring-2 ring-white"
                style={{ backgroundColor: CORAL }}
              />
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-[#FFF6EA]"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: INK }}
                >
                  {userInitials}
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-[#6B707E]" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-11 w-48 rounded-xl border border-[#E7E2D8] bg-white p-1.5 shadow-lg">
                  <p className="truncate px-2.5 py-1 text-xs font-semibold text-[#1E2026]">
                    {displayName}
                  </p>
                  {displayEmail && (
                    <p className="truncate px-2.5 pb-1 text-[10px] text-[#6B707E]">
                      {displayEmail}
                    </p>
                  )}
                  <Link
                    href={
                      activeRole === "technician"
                        ? "/technician-dashboard/profile"
                        : activeRole === "admin"
                          ? "/admin-dashboard"
                          : "/dashboard"
                    }
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-[#4A4E58] hover:bg-[#FFF6EA]"
                  >
                    <User className="h-3.5 w-3.5" />
                    Profile
                  </Link>
                  <div className="my-1 h-px bg-[#E7E2D8]" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-[#C23B1F] hover:bg-[#FFF6EA]"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
