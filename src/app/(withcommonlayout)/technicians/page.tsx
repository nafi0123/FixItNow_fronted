"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Star, MapPin, ArrowRight, User, ShieldCheck, ChevronLeft, ChevronRight, Wrench } from "lucide-react";
import { getPublicTechniciansAction, getPublicCategoriesAction, TechnicianProfile, Category } from "../_actions/publicAction";

const CORAL = "#FF5A36";
const TEAL = "#0FA894";

function TechniciansContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("searchTerm") || "";

  const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
  const [categoriesMap, setCategoriesMap] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [location, setLocation] = useState("");
  const [minRating, setMinRating] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const loadCategoriesMap = async () => {
      const catRes = await getPublicCategoriesAction();
      if (catRes && catRes.success && Array.isArray(catRes.data)) {
        const map: Record<string, string> = {};
        catRes.data.forEach((c: Category) => {
          map[c.id] = c.name;
        });
        setCategoriesMap(map);
      }
    };
    loadCategoriesMap();
  }, []);

  useEffect(() => {
    const fetchTechnicians = async () => {
      setLoading(true);
      const res = await getPublicTechniciansAction({
        searchTerm: searchTerm.trim() || undefined,
        location: location.trim() || undefined,
        rating: minRating || undefined,
      });

      if (res && res.success && Array.isArray(res.data)) {
        setTechnicians(res.data);
      } else {
        setTechnicians([]);
      }
      setLoading(false);
    };

    fetchTechnicians();
  }, [searchTerm, location, minRating]);

  const totalPages = Math.ceil(technicians.length / pageSize) || 1;
  const paginatedTechnicians = technicians.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getCleanSkillName = (skill: string) => {
    if (categoriesMap[skill]) return categoriesMap[skill];
    if (/^[0-9a-fA-F-]{36}$/.test(skill)) return "Specialized Service";
    return skill;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    setCurrentPage(1);
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMinRating(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-[#14171C] py-14 text-white sm:py-20">
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
              Background Checked & Vetted
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Find Local <span style={{ color: CORAL }}>Technicians</span>
            </h1>
            <p className="mt-3 text-sm text-neutral-300 sm:text-base">
              Browse top-rated local technicians. Check ratings, skills, hourly rates, and real customer reviews.
            </p>

            {/* Search Input */}
            <div className="mt-8 flex items-center overflow-hidden rounded-full border border-neutral-700 bg-neutral-900/90 p-1.5 shadow-2xl backdrop-blur-md">
              <Search className="ml-4 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search technicians by name, bio, or skills..."
                className="w-full bg-transparent px-4 py-2 text-sm text-white placeholder-neutral-400 outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  className="mr-3 text-xs text-neutral-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Filter & Grid */}
      <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* Filter Bar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-[#FFFBF3] px-3 py-2 text-xs">
              <MapPin className="h-4 w-4 text-[#FF5A36]" />
              <input
                type="text"
                value={location}
                onChange={handleLocationChange}
                placeholder="Filter location..."
                className="bg-transparent font-medium text-neutral-800 outline-none placeholder:text-neutral-400"
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-[#FFFBF3] px-3 py-2 text-xs">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <select
                value={minRating}
                onChange={handleRatingChange}
                className="bg-transparent font-medium text-neutral-800 outline-none cursor-pointer"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.0">3.0+ Stars</option>
              </select>
            </div>
          </div>

          <span className="text-xs font-semibold text-neutral-500">
            Showing {technicians.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} -{" "}
            {Math.min(currentPage * pageSize, technicians.length)} of {technicians.length} technician{technicians.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Technicians Grid */}
        {loading ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm" />
            ))}
          </div>
        ) : technicians.length === 0 ? (
          <div className="my-16 flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white p-12 text-center">
            <User className="h-12 w-12 text-neutral-300" />
            <h3 className="mt-4 text-base font-semibold text-[#14171C]">No technicians match criteria</h3>
            <p className="mt-1 text-xs text-neutral-500">Try clearing filters or search terms.</p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedTechnicians.map((tech) => (
                <div
                  key={tech.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#FF5A36]/40 hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#14171C] text-lg font-extrabold text-white">
                          {tech.user?.name ? tech.user.name.charAt(0).toUpperCase() : "T"}
                        </span>
                        <div>
                          <h3 className="text-base font-bold text-[#14171C] group-hover:text-[#FF5A36] transition-colors">
                            {tech.user?.name || "Technician"}
                          </h3>
                          <p className="flex items-center gap-1 text-xs text-neutral-500">
                            <MapPin className="h-3 w-3 text-neutral-400" />
                            {tech.location || "Available Nationwide"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {tech.rating ? Number(tech.rating).toFixed(1) : "5.0"}
                      </div>
                    </div>

                    <p className="mt-4 text-xs leading-relaxed text-neutral-600 line-clamp-2">
                      {tech.bio || "Certified home repair and installation specialist dedicated to high-quality work."}
                    </p>

                    {/* Skills tags */}
                    {tech.skills && tech.skills.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {tech.skills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#FFFBF3] border border-neutral-200 px-2 py-0.5 text-[11px] font-medium text-neutral-700"
                          >
                            <Wrench className="h-3 w-3 text-[#FF5A36]" />
                            {getCleanSkillName(skill)}
                          </span>
                        ))}
                        {tech.skills.length > 4 && (
                          <span className="rounded-lg bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500">
                            +{tech.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer details & Action */}
                  <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Hourly Rate</span>
                      <p className="text-lg font-extrabold text-[#14171C]">
                        ${tech.hourlyRate || 35}<span className="text-xs font-normal text-neutral-500">/hr</span>
                      </p>
                    </div>

                    <Link
                      href={`/technicians/${tech.id}`}
                      className="inline-flex items-center gap-1 rounded-xl bg-[#14171C] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#FF5A36]"
                    >
                      View Profile
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-between border-t border-neutral-200 pt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 transition-all hover:bg-neutral-50 disabled:opacity-40 disabled:hover:bg-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
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
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 transition-all hover:bg-neutral-50 disabled:opacity-40 disabled:hover:bg-white"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </main>
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
