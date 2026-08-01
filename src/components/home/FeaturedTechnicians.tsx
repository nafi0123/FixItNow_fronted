"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wrench,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight,
  User,
  DollarSign,
  CheckCircle2,
} from "lucide-react";
import { getPublicTechniciansAction, TechnicianProfile } from "@/src/app/(withcommonlayout)/_actions/publicAction";

const CORAL = "#FF5A36";
const CORAL_DARK = "#C23B1F";
const TEAL = "#0FA894";
const INK = "#14171C";

function getInitials(name: string) {
  if (!name) return "T";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function FeaturedTechnicians() {
  const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTechnicians = async () => {
      setLoading(true);
      const res = await getPublicTechniciansAction({ limit: 6 });
      if (res && res.success && Array.isArray(res.data)) {
        setTechnicians(res.data);
      }
      setLoading(false);
    };
    loadTechnicians();
  }, []);

  return (
    <section className="bg-white py-16 sm:py-24 border-t border-[#E7E2D8]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider"
              style={{ backgroundColor: `${CORAL}15`, color: CORAL }}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified Experts
            </span>
            <h2
              className="text-3xl font-extrabold tracking-tight text-[#14171C] sm:text-4xl"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Top Rated <span style={{ color: CORAL }}>Technicians</span>
            </h2>
            <p className="max-w-xl text-sm text-neutral-500">
              Hire background-checked, skilled professionals for instant home repairs &amp; installation.
            </p>
          </div>

          <Link
            href="/technicians"
            className="inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
            style={{ background: `linear-gradient(135deg, ${CORAL} 0%, ${CORAL_DARK} 100%)` }}
          >
            Browse All Technicians
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Technicians Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse rounded-3xl border border-[#E7E2D8] bg-[#FFFBF3]/40 p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-neutral-200" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-32 rounded bg-neutral-200" />
                    <div className="h-3 w-24 rounded bg-neutral-100" />
                  </div>
                </div>
                <div className="h-3 w-full rounded bg-neutral-100" />
                <div className="h-3 w-3/4 rounded bg-neutral-100" />
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <div className="h-5 w-20 rounded bg-neutral-200" />
                  <div className="h-9 w-28 rounded-xl bg-neutral-200" />
                </div>
              </div>
            ))
          ) : technicians.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs font-semibold text-neutral-500">
              No technicians available right now.
            </div>
          ) : (
            technicians.map((tech) => {
              const techName = tech.user?.name || "Expert Technician";
              const initials = getInitials(techName);
              const isAvailable = tech.isAvailable !== false;
              const rate = tech.basePrice || tech.hourlyRate || 35;
              const rating = tech.rating || 4.9;

              return (
                <div
                  key={tech.id}
                  className="group relative flex flex-col justify-between rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[#FF5A36] hover:shadow-xl"
                >
                  <div>
                    {/* Header Row: Avatar + Name + Rating */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="relative">
                          <div
                            className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-extrabold text-white shadow-sm"
                            style={{ background: `linear-gradient(135deg, ${INK} 0%, #2B313A 100%)` }}
                          >
                            {initials}
                          </div>
                          <span
                            className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white"
                            style={{ backgroundColor: isAvailable ? TEAL : "#9CA3AF" }}
                            title={isAvailable ? "Available Now" : "Offline"}
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-base font-extrabold text-[#14171C] transition-colors group-hover:text-[#FF5A36]">
                              {techName}
                            </h3>
                            <span title="Verified Technician">
                              <CheckCircle2 className="h-4 w-4" style={{ color: TEAL }} />
                            </span>
                          </div>
                          <p className="flex items-center gap-1 text-xs text-neutral-500">
                            <MapPin className="h-3 w-3" style={{ color: CORAL }} />
                            {tech.location || "Dhaka, Bangladesh"}
                          </p>
                        </div>
                      </div>

                      {/* Rating pill */}
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-extrabold text-amber-700">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {rating}
                      </span>
                    </div>

                    {/* Bio */}
                    <p className="mt-4 line-clamp-2 text-xs leading-relaxed text-neutral-500">
                      {tech.bio || "Experienced technical repair specialist providing high quality services."}
                    </p>

                    {/* Experience & Skills */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#FAF8F5] px-2.5 py-1 text-[11px] font-semibold text-[#14171C] border border-[#E7E2D8]">
                        📅 {tech.experienceYears || 3}+ Yrs Exp
                      </span>
                      {tech.skills?.slice(0, 2).map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                          style={{ backgroundColor: `${TEAL}12`, color: TEAL }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Row: Rate & View Profile Button */}
                  <div className="mt-6 flex items-end justify-between border-t border-neutral-100 pt-4 gap-2">
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 leading-none mb-1">Standard Rate</span>
                      <p className="text-base font-extrabold text-[#14171C] leading-none">
                        ৳{rate} <span className="text-xs font-normal text-neutral-500">/ hr</span>
                      </p>
                    </div>

                    <Link
                      href={`/technicians/${tech.id}`}
                      className="group/btn inline-flex shrink-0 items-center justify-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
                      style={{ background: `linear-gradient(135deg, ${CORAL} 0%, ${CORAL_DARK} 100%)` }}
                    >
                      <User className="h-3.5 w-3.5" />
                      <span>View Profile</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
