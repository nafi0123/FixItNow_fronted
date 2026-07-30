"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Wrench, User, ChevronDown, Tag, Sparkles } from "lucide-react";
import { getPublicCategoriesAction, Category } from "@/src/app/(withcommonlayout)/_actions/publicAction";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Technicians", href: "/technicians" },
];

// Two-accent palette on an ink/cream base — energetic without being noisy
const INK = "#14171C";
const CREAM = "#FFFBF3";
const CORAL = "#FF5A36"; // primary — CTA, key actions
const TEAL = "#0FA894"; // secondary — hover states, live status

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);

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

    fetchCategories();
  }, []);

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

          <div className="mt-4 flex gap-2 border-t border-neutral-200 pt-4">
            <Link
              href="/login"
              className="flex-1 rounded-full border py-2 text-center text-sm font-medium"
              style={{ borderColor: "#E7E2D8", color: INK }}
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="flex-1 rounded-full py-2 text-center text-sm font-semibold text-[#FFFFFF]"
              style={{ backgroundColor: CORAL }}
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}