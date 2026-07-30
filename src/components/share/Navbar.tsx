"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, Wrench, User } from "lucide-react";

const categories = [
  "All categories",
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Painting",
  "Carpentry",
  "AC Repair",
];

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Technicians", href: "/technicians" },
  { label: "Categories", href: "/categories" },
];

// Two-accent palette on an ink/cream base — energetic without being noisy
const INK = "#14171C";
const CREAM = "#FFFBF3";
const CORAL = "#FF5A36"; // primary — CTA, search, key actions
const TEAL = "#0FA894"; // secondary — hover states, live status

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [category, setCategory] = useState(categories[0]);
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // wire this up to your search/services route, e.g.:
    // router.push(`/services?searchTerm=${query}&type=${category}`)
    console.log({ category, query });
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Signature: coral → teal gradient hairline, the one saturated flourish on the page */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${CORAL} 0%, ${TEAL} 100%)` }}
      />

      {/* Utility strip — real, specific status instead of a generic tagline */}
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
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
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

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-1 pl-4 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative px-3 py-2 text-sm font-medium text-neutral-600 transition-colors"
                style={{ ["--hover" as string]: TEAL }}
                onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "")}
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-3 right-3 h-0.5 origin-left scale-x-0 rounded-full transition-transform duration-200 group-hover:scale-x-100"
                  style={{ backgroundColor: TEAL }}
                />
              </Link>
            ))}
          </nav>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden flex-1 items-center md:flex">
            <div
              className="flex w-full max-w-xl items-center overflow-hidden rounded-full border-2 bg-white shadow-sm transition-shadow focus-within:shadow-md"
              style={{ borderColor: "#E7E2D8" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = CORAL)}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#E7E2D8")}
            >
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Service category"
                className="hidden shrink-0 border-r bg-transparent py-2.5 pl-4 pr-2 text-sm outline-none sm:block"
                style={{ borderColor: "#E7E2D8", color: INK }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search plumbers, electricians, cleaners…"
                aria-label="Search services"
                className="w-full bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-neutral-400"
                style={{ color: INK }}
              />
              <button
                type="submit"
                aria-label="Search"
                className="m-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: CORAL }}
              >
                <Search className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          </form>

          {/* Right side auth actions */}
          <div className="ml-auto hidden items-center gap-3 lg:flex">
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
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex items-center overflow-hidden rounded-full border-2 bg-white" style={{ borderColor: "#E7E2D8" }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search services…"
                className="w-full bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-neutral-400"
                style={{ color: INK }}
              />
              <button
                type="submit"
                className="m-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: CORAL }}
              >
                <Search className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          </form>

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
              className="flex-1 rounded-full py-2 text-center text-sm font-semibold text-white"
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