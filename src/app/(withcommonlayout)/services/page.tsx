"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Clock, Wrench, UserCheck, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { getPublicServicesAction, getPublicCategoriesAction, Service, Category, MetaData } from "../_actions/publicAction";

const CORAL = "#FF5A36";
const TEAL = "#0FA894";

function ServicesContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get("category") || "";
  const initialCategoryIdParam = searchParams.get("categoryId") || "";
  const initialSearchParam = searchParams.get("searchTerm") || "";

  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<MetaData>({ page: 1, limit: 6, total: 0, totalPage: 1 });
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryIdParam);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchParam);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      const res = await getPublicCategoriesAction({ limit: 100 });
      if (res && res.success && Array.isArray(res.data)) {
        setCategories(res.data);
        if (initialCategoryParam && !initialCategoryIdParam) {
          const matched = res.data.find(
            (c: Category) => c.name.toLowerCase() === initialCategoryParam.toLowerCase()
          );
          if (matched) setSelectedCategory(matched.id);
        }
      }
    };
    loadCategories();
  }, [initialCategoryParam, initialCategoryIdParam]);

  // Fetch services when page, selectedCategory or searchTerm changes
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const res = await getPublicServicesAction({
        page: currentPage,
        limit: pageSize,
        searchTerm: searchTerm.trim() || undefined,
        categoryId: selectedCategory || undefined,
      });

      if (res && res.success) {
        setServices(res.data || []);
        if (res.meta) setMeta(res.meta);
      } else {
        setServices([]);
      }
      setLoading(false);
    };

    fetchServices();
  }, [currentPage, selectedCategory, searchTerm]);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#14171C] py-14 text-white sm:py-20">
        <div
          className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: `radial-gradient(circle, ${CORAL}, ${TEAL})` }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider"
              style={{ backgroundColor: `${CORAL}20`, color: CORAL }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Verified Home Services
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Find & Book <span style={{ color: CORAL }}>Services</span>
            </h1>
            <p className="mt-3 text-sm text-neutral-300 sm:text-base">
              Professional plumbing, electrical, cleaning, and repair solutions backed by certified technicians.
            </p>

            {/* Main Search Bar */}
            <div className="mt-8 flex items-center overflow-hidden rounded-full border border-neutral-700 bg-neutral-900/90 p-1.5 shadow-2xl backdrop-blur-md">
              <Search className="ml-4 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search services by name or description..."
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

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          <button
            onClick={() => handleCategorySelect("")}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              selectedCategory === ""
                ? "bg-[#14171C] text-white shadow-md"
                : "border border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400"
            }`}
          >
            All Services
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? "bg-[#FF5A36] text-white shadow-md"
                  : "border border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results Header */}
        <div className="mt-4 flex items-center justify-between border-b border-neutral-200 pb-3">
          <p className="text-xs font-medium text-neutral-500">
            Showing <span className="font-bold text-neutral-800">
              {meta.total > 0 ? (meta.page - 1) * meta.limit + 1 : 0} -{" "}
              {Math.min(meta.page * meta.limit, meta.total)}
            </span> of <span className="font-bold text-neutral-800">{meta.total}</span> available services
          </p>
          {(selectedCategory || searchTerm) && (
            <button
              onClick={() => {
                setSelectedCategory("");
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="text-xs font-semibold text-[#FF5A36] hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="my-16 flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white p-12 text-center">
            <Wrench className="h-12 w-12 text-neutral-300" />
            <h3 className="mt-4 text-base font-semibold text-[#14171C]">No services found</h3>
            <p className="mt-1 text-xs text-neutral-500">
              Try adjusting your search query or selecting a different category.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#FF5A36]/40 hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-[#FF5A36]">
                        <Wrench className="h-3 w-3" />
                        {service.category?.name || "Service"}
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        <Clock className="h-3 w-3" />
                        {service.duration}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-[#14171C] group-hover:text-[#FF5A36] transition-colors">
                      {service.name}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-neutral-600 line-clamp-3">
                      {service.description}
                    </p>

                    {/* Technician Info */}
                    {service.technicianProfile?.user?.name && (
                      <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#FFFBF3] px-3 py-2 text-xs text-neutral-700">
                        <UserCheck className="h-4 w-4 text-[#0FA894]" />
                        <span className="truncate">
                          Provided by: <strong className="font-semibold text-neutral-900">{service.technicianProfile.user.name}</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer Price & Booking CTA */}
                  <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Price</span>
                      <p className="text-xl font-extrabold text-[#14171C]">
                        ${service.price}
                      </p>
                    </div>

                    <Link
                      href={`/technicians/${service.technicianProfileId}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#14171C] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#FF5A36] active:scale-95"
                    >
                      View Technician
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

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] p-12 text-center text-xs text-neutral-400">Loading services...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
