"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Star, MapPin, Award, CheckCircle2, Clock, Calendar, MessageSquare, ArrowLeft, ShieldCheck, Wrench, AlertCircle } from "lucide-react";
import { getSingleTechnicianAction, getPublicCategoriesAction, TechnicianProfile, Category } from "../../_actions/publicAction";

const CORAL = "#FF5A36";
const TEAL = "#0FA894";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SingleTechnicianPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [technician, setTechnician] = useState<TechnicianProfile | null>(null);
  const [categoriesMap, setCategoriesMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchProfileAndCategories = async () => {
      setLoading(true);
      const [res, catRes] = await Promise.all([
        getSingleTechnicianAction(id),
        getPublicCategoriesAction(),
      ]);

      if (catRes && catRes.success && Array.isArray(catRes.data)) {
        const map: Record<string, string> = {};
        catRes.data.forEach((c: Category) => {
          map[c.id] = c.name;
        });
        setCategoriesMap(map);
      }

      if (res && res.success && res.data) {
        setTechnician(res.data);
      }
      setLoading(false);
    };

    fetchProfileAndCategories();
  }, [id]);

  const getCleanSkillName = (skill: string) => {
    if (categoriesMap[skill]) return categoriesMap[skill];
    if (/^[0-9a-fA-F-]{36}$/.test(skill)) return "Specialized Service";
    return skill;
  };

  const isTechAvailable = (() => {
    if (!technician) return true;
    if (typeof technician.isAvailable === "boolean") return technician.isAvailable;
    if (technician.availability) {
      if (typeof technician.availability === "boolean") return technician.availability;
      if (typeof technician.availability === "object" && technician.availability !== null) {
        if (typeof technician.availability.isAvailable === "boolean") {
          return technician.availability.isAvailable;
        }
      }
    }
    return true;
  })();

  const workingHours = technician?.availability?.workingHours || null;
  const workingDays = Array.isArray(technician?.availability?.workingDays) ? technician.availability.workingDays : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-20">
        <div className="mx-auto max-w-4xl px-4 animate-pulse">
          <div className="h-48 rounded-3xl bg-neutral-200" />
          <div className="mt-8 h-32 rounded-2xl bg-neutral-200" />
        </div>
      </div>
    );
  }

  if (!technician) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-20 text-center">
        <h2 className="text-xl font-bold text-[#14171C]">Technician Not Found</h2>
        <p className="mt-2 text-xs text-neutral-500">The technician profile you are looking for does not exist.</p>
        <Link href="/technicians" className="mt-6 inline-block rounded-xl bg-[#FF5A36] px-5 py-2.5 text-xs font-semibold text-white">
          ← Back to Technicians
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Header Banner */}
      <div className="bg-[#14171C] pt-8 pb-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/technicians"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Technicians
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left / Top Profile Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-[#E7E2D8] bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#14171C] text-2xl font-extrabold text-white shadow-md">
                    {technician.user?.name ? technician.user.name.charAt(0).toUpperCase() : "T"}
                  </span>
                  <div>
                    <h1 className="text-2xl font-extrabold text-[#14171C]">
                      {technician.user?.name || "Technician Profile"}
                    </h1>
                    <p className="flex items-center gap-1 mt-1 text-xs text-neutral-500">
                      <MapPin className="h-3.5 w-3.5 text-[#FF5A36]" />
                      {technician.location || "Available Nationwide"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-2xl bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {technician.rating && Number(technician.rating) > 0 ? Number(technician.rating).toFixed(1) : "New"}
                  </div>

                  {isTechAvailable ? (
                    <span className="rounded-2xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 flex items-center gap-1 border border-emerald-100">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Available Now
                    </span>
                  ) : (
                    <span className="rounded-2xl bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 flex items-center gap-1 border border-rose-100">
                      <Clock className="h-3.5 w-3.5 text-rose-600" />
                      Currently Offline / Busy
                    </span>
                  )}
                </div>
              </div>

              {/* Bio Section */}
              <div className="mt-8 border-t border-neutral-100 pt-6">
                <h3 className="text-sm font-bold text-[#14171C]">About Technician</h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  {technician.bio || "Professional technician specializing in diagnostics, repairs, preventive maintenance, and installations."}
                </p>
              </div>

              {/* Work Schedule Details */}
              {(workingHours || (workingDays && workingDays.length > 0)) && (
                <div className="mt-6 border-t border-neutral-100 pt-6">
                  <h3 className="text-sm font-bold text-[#14171C] flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#FF5A36]" />
                    Working Schedule & Hours
                  </h3>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-600">
                    {workingHours && (
                      <div className="rounded-xl border border-neutral-200 bg-[#FFFBF3] p-3">
                        <span className="font-semibold text-[#14171C] block mb-1">Active Hours:</span>
                        <span>{workingHours}</span>
                      </div>
                    )}
                    {workingDays && workingDays.length > 0 && (
                      <div className="rounded-xl border border-neutral-200 bg-[#FFFBF3] p-3">
                        <span className="font-semibold text-[#14171C] block mb-1">Working Days:</span>
                        <span>{workingDays.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Skills list */}
              {technician.skills && technician.skills.length > 0 && (
                <div className="mt-6 border-t border-neutral-100 pt-6">
                  <h3 className="text-sm font-bold text-[#14171C]">Skills & Expertise</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {technician.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-xl border border-neutral-200 bg-[#FFFBF3] px-3 py-1 text-xs font-semibold text-neutral-700"
                      >
                        <Wrench className="h-3 w-3 text-[#FF5A36]" />
                        {getCleanSkillName(skill)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Customer Reviews Section */}
            <div className="rounded-3xl border border-[#E7E2D8] bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <h3 className="text-base font-bold text-[#14171C] flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-[#FF5A36]" />
                  Customer Reviews ({technician.reviews ? technician.reviews.length : 0})
                </h3>
              </div>

              <div className="mt-6 space-y-4">
                {!technician.reviews || technician.reviews.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-4 text-center">
                    No customer reviews yet. Be the first to book and review!
                  </p>
                ) : (
                  technician.reviews.map((review) => (
                    <div key={review.id} className="rounded-2xl border border-neutral-100 bg-[#FFFBF3] p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#14171C] text-xs font-bold text-white">
                            {review.customer?.name ? review.customer.name.charAt(0) : "C"}
                          </span>
                          <span className="text-xs font-bold text-[#14171C]">
                            {review.customer?.name || "Verified Customer"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                        "{review.comment}"
                      </p>
                      <span className="mt-2 block text-[10px] text-neutral-400">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Booking Sidebar */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-md">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Standard Rate</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#14171C]">
                  ${technician.basePrice || technician.hourlyRate || 35}
                </span>
                <span className="text-xs font-medium text-neutral-500">/ hour</span>
              </div>

              <div className="mt-6 space-y-3 border-t border-neutral-100 pt-4 text-xs text-neutral-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-[#FF5A36]" />
                    Experience:
                  </span>
                  <span className="font-semibold text-[#14171C]">
                    {technician.experienceYears || 3} Years
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#0FA894]" />
                    Guarantee:
                  </span>
                  <span className="font-semibold text-[#14171C]">100% Satisfaction</span>
                </div>
              </div>

              {bookingSuccess ? (
                <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-center text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="mx-auto h-6 w-6 text-emerald-600 mb-1" />
                  Booking Request Sent! The technician will contact you shortly.
                </div>
              ) : (
                <button
                  onClick={() => setBookingSuccess(true)}
                  disabled={!isTechAvailable}
                  className={`mt-6 w-full rounded-2xl py-3 text-xs font-bold text-white shadow-lg transition-all active:scale-95 ${
                    isTechAvailable
                      ? "bg-[#FF5A36] shadow-orange-500/20 hover:bg-[#C23B1F]"
                      : "bg-neutral-400 cursor-not-allowed opacity-60"
                  }`}
                >
                  {isTechAvailable ? "Book This Technician Now" : "Technician Currently Offline"}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
