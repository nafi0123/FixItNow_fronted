"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, FolderGit2, Wrench, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { getPublicCategoriesAction, Category, MetaData } from "../_actions/publicAction";

const CORAL = "#FF5A36";
const CORAL_DARK = "#C23B1F";
const TEAL = "#0FA894";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<MetaData>({ page: 1, limit: 6, total: 0, totalPage: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const res = await getPublicCategoriesAction({
        page: currentPage,
        limit: pageSize,
        searchTerm: search.trim() || undefined,
      });

      if (res && res.success) {
        setCategories(res.data || []);
        if (res.meta) setMeta(res.meta);
      } else {
        setCategories([]);
      }
      setLoading(false);
    };

    fetchCategories();
  }, [currentPage, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-[#14171C] py-16 text-white sm:py-24">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: `radial-gradient(circle, ${CORAL}, ${TEAL})` }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider"
              style={{ backgroundColor: `${CORAL}20`, color: CORAL }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Service Directory
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Explore All <span style={{ color: CORAL }}>Categories</span>
            </h1>
            <p className="mt-4 text-sm text-neutral-300 sm:text-base">
              Find verified expert technicians across all service categories. Quick booking, transparent pricing.
            </p>

            {/* Search Input */}
            <div className="mt-8 flex items-center overflow-hidden rounded-full border border-neutral-700 bg-neutral-900/90 p-1.5 shadow-2xl backdrop-blur-md">
              <Search className="ml-4 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search categories e.g. Plumbing, Electrical..."
                className="w-full bg-transparent px-4 py-2 text-sm text-white placeholder-neutral-400 outline-none"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCurrentPage(1);
                  }}
                  className="mr-2 text-xs text-neutral-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <main className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#14171C]">All Available Categories</h2>
            <p className="text-xs text-neutral-500">
              Showing {meta.total > 0 ? (meta.page - 1) * meta.limit + 1 : 0} -{" "}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} categories
            </p>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="my-16 flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white p-12 text-center">
            <FolderGit2 className="h-12 w-12 text-neutral-300" />
            <h3 className="mt-4 text-base font-semibold text-[#14171C]">No categories found</h3>
            <p className="mt-1 text-xs text-neutral-500">
              {search ? `No categories match "${search}"` : "No service categories available right now."}
            </p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#FF5A36]/40 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${CORAL}15`, color: CORAL_DARK }}
                      >
                        <Wrench className="h-6 w-6" />
                      </span>
                      <span className="rounded-full border border-neutral-200 bg-[#FFFBF3] px-2.5 py-0.5 font-mono text-[11px] font-medium text-neutral-600">
                        /{category.slug}
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-[#14171C] group-hover:text-[#FF5A36] transition-colors">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-neutral-600 line-clamp-3">
                      {category.description || "Top-rated repair, maintenance, and installation services by certified local technicians."}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-neutral-100 pt-4">
                    <Link
                      href={`/services?categoryId=${category.id}`}
                      className="flex items-center justify-between text-xs font-semibold text-[#FF5A36] transition-colors group-hover:text-[#C23B1F]"
                    >
                      <span>Browse {category.name} Services</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Server-Side Pagination Controls */}
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
      </main>
    </div>
  );
}
