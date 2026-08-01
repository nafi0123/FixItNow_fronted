"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Star,
  MapPin,
  ArrowRight,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Wrench,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  Check,
  Clock,
  DollarSign,
  X,
  Tag,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import {
  getPublicTechniciansAction,
  getPublicCategoriesAction,
  TechnicianProfile,
  Category,
  MetaData
} from "../_actions/publicAction";

const CORAL = "#FF5A36";
const CORAL_DARK = "#C23B1F";
const TEAL = "#0FA894";
const INK = "#14171C";

function TechniciansContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("searchTerm") || "";
  const initialCategory = searchParams.get("category") || "";

  // Data states
  const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesMap, setCategoriesMap] = useState<Record<string, string>>({});
  const [meta, setMeta] = useState<MetaData>({ page: 1, limit: 12, total: 0, totalPage: 1 });
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [location, setLocation] = useState("");
  const [minRating, setMinRating] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [sortBy, setSortBy] = useState<"recommended" | "rating-desc" | "price-asc" | "price-desc">("recommended");

  // Mobile Filter Drawer Toggle
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Load Categories Map
  useEffect(() => {
    const loadCategoriesMap = async () => {
      const catRes = await getPublicCategoriesAction({ limit: 100 });
      if (catRes && catRes.success && Array.isArray(catRes.data)) {
        setCategories(catRes.data);
        const map: Record<string, string> = {};
        catRes.data.forEach((c: Category) => {
          map[c.id] = c.name;
        });
        setCategoriesMap(map);
      }
    };
    loadCategoriesMap();
  }, []);

  // Fetch Technicians from Backend Action
  useEffect(() => {
    const fetchTechnicians = async () => {
      setLoading(true);

      // Find Category ID if selectedCategory is category name
      let skillFilterParam = selectedCategory || undefined;
      if (selectedCategory) {
        const catObj = categories.find(
          (c) => c.name.toLowerCase() === selectedCategory.toLowerCase() || c.id === selectedCategory
        );
        if (catObj) skillFilterParam = catObj.id;
      }

      const res = await getPublicTechniciansAction({
        page: currentPage,
        limit: pageSize,
        searchTerm: searchTerm.trim() || undefined,
        location: location.trim() || undefined,
        rating: minRating || undefined,
        skills: skillFilterParam,
      });

      if (res && res.success) {
        setTechnicians(res.data || []);
        if (res.meta) setMeta(res.meta);
      } else {
        setTechnicians([]);
      }
      setLoading(false);
    };

    fetchTechnicians();
  }, [currentPage, searchTerm, location, minRating, selectedCategory, categories]);

  const getCleanSkillName = (skill: string) => {
    if (categoriesMap[skill]) return categoriesMap[skill];
    if (/^[0-9a-fA-F-]{36}$/.test(skill)) return "Specialized Service";
    return skill;
  };

  // Client-side filtering & sorting on fetched technicians list
  const filteredAndSortedTechnicians = useMemo(() => {
    let list = [...technicians];

    // Filter by availability if toggled
    if (availableOnly) {
      list = list.filter((tech) => {
        if (typeof tech.isAvailable === "boolean") return tech.isAvailable;
        if (tech.availability && typeof tech.availability === "object" && typeof tech.availability.isAvailable === "boolean") {
          return tech.availability.isAvailable;
        }
        return true;
      });
    }

    // Filter by max price
    if (maxPrice < 200) {
      list = list.filter((tech) => {
        const price = tech.basePrice || tech.hourlyRate || 35;
        return price <= maxPrice;
      });
    }

    // Sort list
    if (sortBy === "rating-desc") {
      list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    } else if (sortBy === "price-asc") {
      list.sort((a, b) => (a.basePrice || a.hourlyRate || 35) - (b.basePrice || b.hourlyRate || 35));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => (b.basePrice || b.hourlyRate || 35) - (a.basePrice || a.hourlyRate || 35));
    }

    return list;
  }, [technicians, availableOnly, maxPrice, sortBy]);

  // Active filter count calculation
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm.trim()) count++;
    if (location.trim()) count++;
    if (minRating) count++;
    if (selectedCategory) count++;
    if (availableOnly) count++;
    if (maxPrice < 200) count++;
    if (sortBy !== "recommended") count++;
    return count;
  }, [searchTerm, location, minRating, selectedCategory, availableOnly, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setLocation("");
    setMinRating("");
    setSelectedCategory("");
    setAvailableOnly(false);
    setMaxPrice(200);
    setSortBy("recommended");
    setCurrentPage(1);
  };

  const isTechAvailable = (tech: TechnicianProfile) => {
    if (typeof tech.isAvailable === "boolean") return tech.isAvailable;
    if (tech.availability && typeof tech.availability === "object" && typeof tech.availability.isAvailable === "boolean") {
      return tech.availability.isAvailable;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-[#14171C] py-12 text-white sm:py-16">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: `radial-gradient(circle, ${CORAL}, ${TEAL})` }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider"
              style={{ backgroundColor: `${TEAL}20`, color: TEAL }}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified &amp; Background Checked
            </span>
            <h1
              className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Find Local <span style={{ color: CORAL }}>Technicians</span>
            </h1>
            <p className="mt-3 text-xs text-neutral-300 sm:text-sm">
              Browse top-rated repair specialists, compare hourly rates, review verified skills, and book instantly.
            </p>

            {/* Main Search Bar in Hero */}
            <div className="mt-8 flex items-center overflow-hidden rounded-full border border-neutral-700 bg-neutral-900/90 p-1.5 shadow-2xl backdrop-blur-md">
              <Search className="ml-4 h-5 w-5 text-neutral-400 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search technician by name, expertise, or bio..."
                className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-neutral-400 outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  className="mr-2 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Container: 1 Grid Sidebar Filter + 1 Grid Technicians Cards */}
      <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* Mobile Filter Button (lg:hidden) */}
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-bold text-[#14171C] shadow-sm hover:border-[#FF5A36]"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#FF5A36]" />
            Filters &amp; Refine
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5A36] text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          <span className="text-xs font-semibold text-neutral-500">
            {filteredAndSortedTechnicians.length} technician{filteredAndSortedTechnicians.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* ======================================================== */}
          {/* GRID COLUMN 1: SIDEBAR FILTER PANEL (Desktop lg:col-span-1) */}
          {/* ======================================================== */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6 rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm">
              {/* Filter Panel Header */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF5A36]/10 text-[#FF5A36]">
                    <Filter className="h-4 w-4" />
                  </span>
                  <h3 className="text-sm font-extrabold text-[#14171C]">Filter Technicians</h3>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#FF5A36] hover:underline"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* 1. Category / Skill Filter */}
              <div>
                <label className="mb-2 block text-xs font-bold text-[#14171C] flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-[#FF5A36]" />
                  Service Category
                </label>
                <div className="max-h-48 overflow-y-auto space-y-1 pr-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("");
                      setCurrentPage(1);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-medium transition-colors ${
                      selectedCategory === ""
                        ? "bg-[#FFFBF3] text-[#FF5A36] font-bold border border-[#FF5A36]/30"
                        : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <span>All Categories</span>
                    {selectedCategory === "" && <Check className="h-3.5 w-3.5" />}
                  </button>

                  {categories.map((cat) => {
                    const isSelected =
                      selectedCategory.toLowerCase() === cat.name.toLowerCase() ||
                      selectedCategory === cat.id;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          setCurrentPage(1);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-medium transition-colors ${
                          isSelected
                            ? "bg-[#FFFBF3] text-[#FF5A36] font-bold border border-[#FF5A36]/30"
                            : "text-neutral-600 hover:bg-neutral-50"
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Rating Filter */}
              <div className="border-t border-neutral-100 pt-4">
                <label className="mb-2 block text-xs font-bold text-[#14171C] flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  Minimum Rating
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {[
                    { label: "Any Rating", val: "" },
                    { label: "⭐ 4.5+", val: "4.5" },
                    { label: "⭐ 4.0+", val: "4.0" },
                    { label: "⭐ 3.5+", val: "3.5" },
                  ].map((r) => (
                    <button
                      key={r.val}
                      type="button"
                      onClick={() => {
                        setMinRating(r.val);
                        setCurrentPage(1);
                      }}
                      className={`rounded-xl border px-2.5 py-1.5 text-center font-semibold transition-all ${
                        minRating === r.val
                          ? "border-[#FF5A36] bg-[#FF5A36]/10 text-[#FF5A36]"
                          : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Location Filter */}
              <div className="border-t border-neutral-100 pt-4">
                <label className="mb-2 block text-xs font-bold text-[#14171C] flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#FF5A36]" />
                  Location / City
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-[#FFFBF3] px-3 py-2 text-xs">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="e.g. Dhaka, Chittagong..."
                    className="w-full bg-transparent font-medium text-neutral-800 outline-none placeholder:text-neutral-400"
                  />
                  {location && (
                    <button
                      type="button"
                      onClick={() => {
                        setLocation("");
                        setCurrentPage(1);
                      }}
                      className="text-neutral-400 hover:text-neutral-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {/* Popular Location Tags */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {["Dhaka", "Chittagong", "Sylhet"].map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        setLocation(location === city ? "" : city);
                        setCurrentPage(1);
                      }}
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border transition-all ${
                        location === city
                          ? "bg-[#FF5A36] text-white border-[#FF5A36]"
                          : "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Hourly Rate Range Slider */}
              <div className="border-t border-neutral-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#14171C] flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-[#0FA894]" />
                    Max Hourly Rate
                  </label>
                  <span className="text-xs font-extrabold text-[#0FA894]">${maxPrice}/hr</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={200}
                  step={5}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#0FA894] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 font-semibold mt-1">
                  <span>$10/hr</span>
                  <span>$200/hr</span>
                </div>
              </div>

              {/* 5. Availability Status Toggle */}
              <div className="border-t border-neutral-100 pt-4">
                <label className="flex items-center justify-between cursor-pointer select-none">
                  <span className="text-xs font-bold text-[#14171C] flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0FA894] opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0FA894]" />
                    </span>
                    Available Now Only
                  </span>
                  <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#0FA894] cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </aside>

          {/* ======================================================== */}
          {/* GRID COLUMN 2: TECHNICIANS LIST & CARDS (lg:col-span-3) */}
          {/* ======================================================== */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top Bar: Active Chips & Sort Selector */}
            <div className="flex flex-col gap-4 rounded-2xl border border-[#E7E2D8] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              {/* Active Filter Chips */}
              <div className="flex flex-wrap items-center gap-2 min-h-[32px]">
                <span className="text-xs font-semibold text-neutral-500">Active Filters:</span>
                {activeFilterCount === 0 ? (
                  <span className="text-xs text-neutral-400 italic">None selected</span>
                ) : (
                  <>
                    {searchTerm && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#FFFBF3] border border-[#FF5A36]/30 px-2.5 py-0.5 text-[11px] font-bold text-[#FF5A36]">
                        Search: "{searchTerm}"
                        <button type="button" onClick={() => setSearchTerm("")}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}

                    {selectedCategory && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 border border-teal-200 px-2.5 py-0.5 text-[11px] font-bold text-[#0FA894]">
                        Cat: {selectedCategory}
                        <button type="button" onClick={() => setSelectedCategory("")}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}

                    {minRating && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                        ⭐ {minRating}+
                        <button type="button" onClick={() => setMinRating("")}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}

                    {location && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 border border-neutral-200 px-2.5 py-0.5 text-[11px] font-bold text-neutral-700">
                        📍 {location}
                        <button type="button" onClick={() => setLocation("")}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}

                    {availableOnly && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                        🟢 Available Now
                        <button type="button" onClick={() => setAvailableOnly(false)}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}

                    {maxPrice < 200 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700">
                        💰 Max ${maxPrice}/hr
                        <button type="button" onClick={() => setMaxPrice(200)}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="text-[11px] font-bold text-[#FF5A36] hover:underline ml-1"
                    >
                      Clear All
                    </button>
                  </>
                )}
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-neutral-500">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="rounded-xl border border-[#E7E2D8] bg-[#FFFBF3] px-3 py-1.5 text-xs font-bold text-[#14171C] outline-none cursor-pointer focus:border-[#FF5A36]"
                >
                  <option value="recommended">Recommended</option>
                  <option value="rating-desc">Highest Rated ⭐</option>
                  <option value="price-asc">Price: Low to High ($)</option>
                  <option value="price-desc">Price: High to Low ($$)</option>
                </select>
              </div>
            </div>

            {/* Technicians Grid */}
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-64 animate-pulse rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm" />
                ))}
              </div>
            ) : filteredAndSortedTechnicians.length === 0 ? (
              <div className="my-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white p-12 text-center">
                <User className="h-12 w-12 text-neutral-300" />
                <h3 className="mt-4 text-base font-semibold text-[#14171C]">No technicians match criteria</h3>
                <p className="mt-1 text-xs text-neutral-500">Try adjusting or clearing your active filters.</p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 rounded-xl bg-[#FF5A36] px-4 py-2 text-xs font-bold text-white shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredAndSortedTechnicians.map((tech) => {
                    const online = isTechAvailable(tech);

                    return (
                      <div
                        key={tech.id}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#FF5A36]/40 hover:shadow-xl"
                      >
                        <div>
                          {/* Header Avatar & Rating */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#14171C] text-lg font-extrabold text-white shadow-md">
                                {tech.user?.name ? tech.user.name.charAt(0).toUpperCase() : "T"}
                                <span
                                  className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${
                                    online ? "bg-[#0FA894]" : "bg-neutral-300"
                                  }`}
                                />
                              </span>
                              <div>
                                <h3 className="text-base font-bold text-[#14171C] group-hover:text-[#FF5A36] transition-colors">
                                  {tech.user?.name || "Technician"}
                                </h3>
                                <p className="flex items-center gap-1 text-xs text-neutral-500">
                                  <MapPin className="h-3 w-3 text-[#FF5A36]" />
                                  {tech.location || "Available Nationwide"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200/50">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              {tech.rating && Number(tech.rating) > 0 ? Number(tech.rating).toFixed(1) : "New"}
                            </div>
                          </div>

                          {/* Bio */}
                          <p className="mt-4 text-xs leading-relaxed text-neutral-600 line-clamp-2">
                            {tech.bio || "Certified home repair & installation specialist dedicated to high-quality work."}
                          </p>

                          {/* Skills tags */}
                          {tech.skills && tech.skills.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {tech.skills.slice(0, 4).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 rounded-xl bg-[#FFFBF3] border border-neutral-200 px-2.5 py-1 text-[11px] font-semibold text-neutral-700"
                                >
                                  <Wrench className="h-3 w-3 text-[#FF5A36]" />
                                  {getCleanSkillName(skill)}
                                </span>
                              ))}
                              {tech.skills.length > 4 && (
                                <span className="rounded-xl bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-500">
                                  +{tech.skills.length - 4} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Footer details & Action */}
                        <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Standard Rate</span>
                            <p className="text-lg font-extrabold text-[#14171C]">
                              ${tech.basePrice || tech.hourlyRate || 35}<span className="text-xs font-normal text-neutral-500">/hr</span>
                            </p>
                          </div>

                          <Link
                            href={`/technicians/${tech.id}`}
                            className="inline-flex items-center gap-1 rounded-xl bg-[#14171C] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#FF5A36]"
                          >
                            View Profile
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Server Pagination */}
                {meta.totalPage > 1 && (
                  <div className="mt-12 flex items-center justify-between border-t border-neutral-200 pt-6">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage <= 1 || loading}
                      className="flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 transition-all hover:bg-neutral-50 disabled:opacity-40 disabled:hover:bg-white"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>

                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: meta.totalPage }).map((_, idx) => {
                        const pageNum = idx + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`h-8 w-8 rounded-xl text-xs font-bold transition-all ${
                              currentPage === pageNum
                                ? "bg-[#FF5A36] text-white shadow-sm"
                                : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, meta.totalPage))}
                      disabled={currentPage >= meta.totalPage || loading}
                      className="flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 transition-all hover:bg-neutral-50 disabled:opacity-40 disabled:hover:bg-white"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filter Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 lg:hidden">
          <div className="relative h-full w-full max-w-xs bg-white p-6 shadow-2xl overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-[#FF5A36]" />
                <h3 className="text-base font-extrabold text-[#14171C]">Filter Technicians</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="rounded-full p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Filter Controls */}
            <div className="space-y-5">
              {/* Category */}
              <div>
                <label className="mb-2 block text-xs font-bold text-[#14171C]">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-neutral-200 bg-[#FFFBF3] p-2.5 text-xs font-semibold text-[#14171C]"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="mb-2 block text-xs font-bold text-[#14171C]">Minimum Rating</label>
                <select
                  value={minRating}
                  onChange={(e) => {
                    setMinRating(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-neutral-200 bg-[#FFFBF3] p-2.5 text-xs font-semibold text-[#14171C]"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="mb-2 block text-xs font-bold text-[#14171C]">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="e.g. Dhaka"
                  className="w-full rounded-xl border border-neutral-200 bg-[#FFFBF3] p-2.5 text-xs font-medium"
                />
              </div>

              {/* Availability */}
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-bold text-[#14171C]">Available Now Only</span>
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="h-4 w-4 accent-[#0FA894]"
                />
              </label>

              {/* Apply / Reset buttons */}
              <div className="pt-4 border-t border-neutral-100 flex gap-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-xs font-bold text-neutral-600"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 rounded-xl bg-[#FF5A36] py-2.5 text-xs font-bold text-white shadow-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TechniciansPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] p-12 text-center text-xs text-neutral-400">Loading technicians...</div>}>
      <TechniciansContent />
    </Suspense>
  );
}
