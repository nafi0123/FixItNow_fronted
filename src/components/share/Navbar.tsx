"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Wrench, User, ChevronDown, Tag, Sparkles, LogOut, LayoutDashboard } from "lucide-react";
import { getPublicCategoriesAction, Category } from "@/src/app/(withcommonlayout)/_actions/publicAction";
import { getMeAction, logoutAction } from "@/src/app/(authGroup)/_actions/authActions";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Technicians", href: "/technicians" },
];

// Two-accent palette on an ink/cream base — energetic without being noisy
const INK = "#14171C";
const CREAM = "#FFFBF3";
const CORAL = "#FF5A36"; // primary — CTA, key actions
const TEAL = "#0FA894"; // secondary — hover states, live status

interface UserData {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getPublicCategoriesAction();
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setCategoriesList(res.data);
        } else {
          const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
          const rawRes = await fetch(`${backendUrl}/api/categories`);
          const json = await rawRes.json();
          if (json && json.success && Array.isArray(json.data)) {
            setCategoriesList(json.data);
          }
        }
      } catch (error) {
        console.error("Error loading categories for navbar:", error);
      }
    };

    const fetchUser = async () => {
      try {
        const data = await getMeAction();
        if (data) {
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching user in navbar:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchCategories();
    fetchUser();
  }, []);

  const handleLogout = async () => {
    setUser(null);
    await logoutAction();
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getDashboardHref = (role?: string) => {
    const r = role?.toUpperCase();
    if (r === "ADMIN") return "/admin-dashboard";
    if (r === "TECHNICIAN") return "/technician-dashboard";
    return "/dashboard";
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Signature: coral → teal gradient hairline */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${CORAL} 0%, ${TEAL} 100%)` }}
      />

      {/* Utility strip */}
      <div className="hidden sm:block" style={{ backgroundColor: INK }}>
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs text-neutral-300 sm:px-6 lg:px-8">
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ backgroundColor: TEAL }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ backgroundColor: TEAL }}
              />
            </span>
            142 technicians online now
          </span>
          <span className="hidden md:block">
            Book before 6pm for{" "}
            <span style={{ color: CORAL }} className="font-semibold">
              same-day service
            </span>
          </span>
        </div>
      </div>

      <div className="border-b border-neutral-200" style={{ backgroundColor: CREAM }}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex shrink-0 items-center gap-2.5">
              <span
                className="relative flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: INK }}
              >
                <Wrench className="h-5 w-5" strokeWidth={2.25} style={{ color: CORAL }} />
                <span
                  className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2"
                  style={{ backgroundColor: TEAL, borderColor: CREAM }}
                />
              </span>
              <span
                className="hidden text-lg font-bold tracking-tight sm:block"
                style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui", color: INK }}
              >
                FixIt<span style={{ color: CORAL }}>Now</span>
              </span>
            </Link>
          </div>

          {/* Centered Desktop nav links */}
          <nav className="hidden items-center justify-center gap-2 lg:flex flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative px-3.5 py-2 text-sm font-semibold text-neutral-600 transition-colors hover:text-[#0FA894]"
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-3 right-3 h-0.5 origin-left scale-x-0 rounded-full transition-transform duration-200 group-hover:scale-x-100"
                  style={{ backgroundColor: TEAL }}
                />
              </Link>
            ))}

            {/* Categories Link with Dynamic Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <Link
                href="/categories"
                className="group inline-flex items-center gap-1 px-3.5 py-2 text-sm font-semibold text-neutral-600 transition-colors hover:text-[#0FA894]"
              >
                Categories
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    categoriesDropdownOpen ? "rotate-180 text-[#0FA894]" : "text-neutral-400"
                  }`}
                />
                <span
                  className="absolute bottom-0 left-3 right-3 h-0.5 origin-left scale-x-0 rounded-full transition-transform duration-200 group-hover:scale-x-100"
                  style={{ backgroundColor: TEAL }}
                />
              </Link>

              {/* Dynamic Categories Dropdown Card */}
              {categoriesDropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1.5 w-64 z-50">
                  <div className="rounded-2xl border border-[#E7E2D8] bg-white p-2.5 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-100 mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                        <Tag className="h-3 w-3" style={{ color: CORAL }} />
                        Service Categories
                      </span>
                      <span className="text-[10px] font-semibold rounded-full bg-orange-50 px-2 py-0.5 text-[#FF5A36]">
                        {categoriesList.length} available
                      </span>
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-0.5 pr-1">
                      {categoriesList.length === 0 ? (
                        <div className="px-3 py-4 text-center text-xs text-neutral-400">
                          Loading categories...
                        </div>
                      ) : (
                        categoriesList.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/services?category=${encodeURIComponent(cat.name)}`}
                            className="group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-neutral-700 transition-all hover:bg-[#FFFBF3] hover:text-[#FF5A36]"
                          >
                            <span className="truncate">{cat.name}</span>
                            <Sparkles className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 text-[#0FA894]" />
                          </Link>
                        ))
                      )}
                    </div>

                    <div className="mt-1.5 border-t border-neutral-100 pt-1.5">
                      <Link
                        href="/categories"
                        className="flex w-full items-center justify-center rounded-xl bg-[#FFFBF3] px-3 py-2 text-xs font-semibold text-[#14171C] transition-colors hover:bg-neutral-100"
                      >
                        Browse all categories →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right side auth actions */}
          <div className="hidden items-center gap-3 lg:flex shrink-0">
            {loadingUser ? (
              <div className="h-9 w-28 animate-pulse rounded-full bg-neutral-200" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen((v) => !v)}
                  className="flex items-center gap-2.5 rounded-full border border-neutral-200 bg-white py-1.5 pl-2 pr-3 text-sm font-semibold text-neutral-800 shadow-sm transition-all hover:border-[#0FA894] hover:shadow-md"
                >
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: CORAL }}
                  >
                    {getInitials(user.name)}
                  </div>
                  <span className="max-w-[110px] truncate text-xs">{user.name || "Account"}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-neutral-400 transition-transform duration-200 ${
                      userDropdownOpen ? "rotate-180 text-[#0FA894]" : ""
                    }`}
                  />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150 z-50 text-left">
                    {/* User Info Header */}
                    <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                      <p className="truncate text-xs font-bold text-neutral-900">{user.name || "User"}</p>
                      {user.email && <p className="truncate text-[11px] text-neutral-500">{user.email}</p>}
                      <span className="mt-1.5 inline-block rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-[#0FA894] uppercase tracking-wider">
                        {user.role || "CUSTOMER"}
                      </span>
                    </div>

                    {/* Links */}
                    <div className="space-y-0.5">
                      <Link
                        href={getDashboardHref(user.role)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-neutral-700 transition-colors hover:bg-[#FFFBF3] hover:text-[#FF5A36]"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <LayoutDashboard className="h-3.5 w-3.5 text-neutral-400" />
                        Dashboard
                      </Link>

                      {user.role?.toUpperCase() === "TECHNICIAN" && (
                        <Link
                          href="/technician-dashboard/profile"
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-neutral-700 transition-colors hover:bg-[#FFFBF3] hover:text-[#FF5A36]"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <User className="h-3.5 w-3.5 text-neutral-400" />
                          My Profile
                        </Link>
                      )}

                      {user.role?.toUpperCase() === "CUSTOMER" && (
                        <Link
                          href="/dashboard/bookings"
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-neutral-700 transition-colors hover:bg-[#FFFBF3] hover:text-[#FF5A36]"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <User className="h-3.5 w-3.5 text-neutral-400" />
                          My Bookings
                        </Link>
                      )}
                    </div>

                    {/* Logout button */}
                    <div className="mt-1 border-t border-neutral-100 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.03] active:scale-95"
                  style={{ backgroundColor: CORAL }}
                >
                  <User className="h-4 w-4" />
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg lg:hidden"
            style={{ color: INK }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="border-b border-neutral-200 px-4 py-4 md:px-6 lg:hidden" style={{ backgroundColor: CREAM }}>
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-2 py-2 text-sm font-medium text-neutral-600 hover:bg-white"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Categories Accordion / Toggle */}
            <div className="flex flex-col">
              <button
                onClick={() => setMobileCategoriesOpen((prev) => !prev)}
                className="flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium text-neutral-600 hover:bg-white text-left"
              >
                <span>Categories</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileCategoriesOpen ? "rotate-180" : ""}`} />
              </button>

              {mobileCategoriesOpen && (
                <div className="ml-3 my-1 border-l-2 border-[#FF5A36]/30 pl-3 space-y-1">
                  {categoriesList.length === 0 ? (
                    <span className="block py-1 text-xs text-neutral-400">Loading categories...</span>
                  ) : (
                    categoriesList.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/services?category=${encodeURIComponent(cat.name)}`}
                        className="block rounded px-2 py-1.5 text-xs text-neutral-700 hover:text-[#FF5A36] hover:bg-white"
                        onClick={() => setMobileOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))
                  )}
                  <Link
                    href="/categories"
                    className="block pt-1 text-xs font-semibold text-[#FF5A36]"
                    onClick={() => setMobileOpen(false)}
                  >
                    View all categories →
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {user ? (
            <div className="mt-4 border-t border-neutral-200 pt-4 space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-white p-3 border border-neutral-200 shadow-sm">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: CORAL }}
                >
                  {getInitials(user.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-neutral-900">{user.name || "User"}</p>
                  {user.email && <p className="truncate text-[11px] text-neutral-500">{user.email}</p>}
                </div>
                <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-[#0FA894] uppercase">
                  {user.role || "CUSTOMER"}
                </span>
              </div>

              <Link
                href={getDashboardHref(user.role)}
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white py-2 text-xs font-semibold text-neutral-800"
              >
                <LayoutDashboard className="h-4 w-4" />
                Go to Dashboard
              </Link>

              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full py-2 text-xs font-semibold text-white bg-rose-600 transition-colors hover:bg-rose-700 shadow-sm"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          ) : (
            <div className="mt-4 flex gap-2 border-t border-neutral-200 pt-4">
              <Link
                href="/login"
                className="flex-1 rounded-full border py-2 text-center text-sm font-medium"
                style={{ borderColor: "#E7E2D8", color: INK }}
                onClick={() => setMobileOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="flex-1 rounded-full py-2 text-center text-sm font-semibold text-[#FFFFFF]"
                style={{ backgroundColor: CORAL }}
                onClick={() => setMobileOpen(false)}
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}