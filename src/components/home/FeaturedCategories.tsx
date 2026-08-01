"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wrench,
  Zap,
  Flame,
  Droplet,
  Sparkles,
  Paintbrush,
  Car,
  Hammer,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  FolderTree,
} from "lucide-react";
import { getPublicCategoriesAction, Category } from "@/src/app/(withcommonlayout)/_actions/publicAction";

const CORAL = "#FF5A36";
const CORAL_DARK = "#C23B1F";
const TEAL = "#0FA894";
const INK = "#14171C";

const categoryIconMap: Record<string, any> = {
  plumbing: Droplet,
  pipe: Droplet,
  electrical: Zap,
  electric: Zap,
  ac: Flame,
  heating: Flame,
  hvac: Flame,
  cleaning: Sparkles,
  appliance: Wrench,
  repair: Wrench,
  painting: Paintbrush,
  paint: Paintbrush,
  automotive: Car,
  car: Car,
  carpentry: Hammer,
  wood: Hammer,
};

function getCategoryIcon(name: string) {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(categoryIconMap)) {
    if (lower.includes(key)) return icon;
  }
  return Wrench;
}

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      const res = await getPublicCategoriesAction({ limit: 8 });
      if (res && res.success && Array.isArray(res.data)) {
        setCategories(res.data);
      }
      setLoading(false);
    };
    loadCategories();
  }, []);

  return (
    <section className="bg-[#FAF8F5] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider"
              style={{ backgroundColor: `${TEAL}15`, color: TEAL }}
            >
              <FolderTree className="h-3.5 w-3.5" />
              Service Categories
            </span>
            <h2
              className="text-3xl font-extrabold tracking-tight text-[#14171C] sm:text-4xl"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Popular Home Repair <span style={{ color: CORAL }}>Services</span>
            </h2>
            <p className="max-w-xl text-sm text-neutral-500">
              Select a category to find background-checked, expert technicians near you.
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-2 rounded-2xl border border-[#E7E2D8] bg-white px-5 py-2.5 text-xs font-bold text-[#14171C] shadow-sm transition-all hover:border-[#FF5A36] hover:text-[#FF5A36]"
          >
            Explore All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm space-y-4"
              >
                <div className="h-14 w-14 rounded-2xl bg-neutral-200" />
                <div className="h-5 w-36 rounded bg-neutral-200" />
                <div className="h-3 w-48 rounded bg-neutral-100" />
                <div className="pt-2 border-t border-neutral-100 flex justify-between">
                  <div className="h-3 w-20 rounded bg-neutral-100" />
                  <div className="h-3 w-4 rounded bg-neutral-100" />
                </div>
              </div>
            ))
          ) : categories.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs font-semibold text-neutral-500">
              No categories available at the moment.
            </div>
          ) : (
            categories.map((cat) => {
              const IconComponent = getCategoryIcon(cat.name);
              return (
                <Link
                  key={cat.id}
                  href={`/technicians?skills=${encodeURIComponent(cat.id)}`}
                  className="group relative overflow-hidden rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[#FF5A36] hover:shadow-xl"
                >
                  <div
                    className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-10"
                    style={{ background: CORAL }}
                  />

                  <div className="flex items-center justify-between">
                    <span
                      className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${CORAL}15`, color: CORAL }}
                    >
                      <IconComponent className="h-7 w-7" />
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition-colors group-hover:border-[#FF5A36] group-hover:bg-[#FF5A36] group-hover:text-white">
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-base font-extrabold text-[#14171C] transition-colors group-hover:text-[#FF5A36]">
                      {cat.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-500">
                      {cat.description || `Book verified expert ${cat.name} technicians for fast home repair.`}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4 text-xs font-bold text-[#14171C] group-hover:text-[#FF5A36]">
                    <span>Find Technicians</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
