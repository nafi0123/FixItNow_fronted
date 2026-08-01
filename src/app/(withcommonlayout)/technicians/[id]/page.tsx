"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Star,
  MapPin,
  Award,
  CheckCircle2,
  Clock,
  Calendar,
  MessageSquare,
  ArrowLeft,
  ShieldCheck,
  Wrench,
  X,
  Loader2,
  ArrowRight,
  Tag
} from "lucide-react";
import { getSingleTechnicianAction, getPublicCategoriesAction, TechnicianProfile, Category } from "../../_actions/publicAction";
import { getCurrentUserAction } from "@/src/app/(authGroup)/_actions/authActions";
import { createBookingAction, getUserBookingsAction } from "../../_actions/bookingAction";

interface PageProps {
  params: Promise<{ id: string }>;
}

function parseTimeString(timeStr: string): number | null {
  if (!timeStr) return null;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

function formatMinutesToTimeStr(totalMinutes: number): string {
  let hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)} ${period}`;
}

function generateSlotsFromWorkingHours(workingHoursStr?: string | null): string[] {
  const defaultHours = "09:00 AM - 06:00 PM";
  const hoursToParse = (workingHoursStr && workingHoursStr.includes("-")) ? workingHoursStr : defaultHours;

  const parts = hoursToParse.split("-");
  let startMinutes = parseTimeString(parts[0]);
  let endMinutes = parseTimeString(parts[1]);

  if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
    startMinutes = 540; // 09:00 AM
    endMinutes = 1080;  // 06:00 PM
  }

  const slots: string[] = [];
  let current = startMinutes;
  const slotDuration = 120; // 2 hours

  while (current < endMinutes) {
    let next = current + slotDuration;
    if (next > endMinutes) {
      next = endMinutes;
    }
    if (next - current >= 30) {
      slots.push(`${formatMinutesToTimeStr(current)} - ${formatMinutesToTimeStr(next)}`);
    }
    current = next;
  }

  return slots;
}

export default function SingleTechnicianPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();

  const [technician, setTechnician] = useState<TechnicianProfile | null>(null);
  const [categoriesMap, setCategoriesMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Active Booking Check
  const [hasActiveBooking, setHasActiveBooking] = useState(false);
  const [activeBookingStatus, setActiveBookingStatus] = useState<string | null>(null);

  // Booking Modal & State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Form State
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const [bookingDate, setBookingDate] = useState(tomorrowStr);
  const [bookingSlot, setBookingSlot] = useState("");
  const [customSlot, setCustomSlot] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedServicePrice, setSelectedServicePrice] = useState<number>(35);

  useEffect(() => {
    const fetchProfileCategoriesAndBookings = async () => {
      setLoading(true);
      const [res, catRes, user] = await Promise.all([
        getSingleTechnicianAction(id),
        getPublicCategoriesAction(),
        getCurrentUserAction(),
      ]);

      if (catRes && catRes.success && Array.isArray(catRes.data)) {
        const map: Record<string, string> = {};
        catRes.data.forEach((c: Category) => {
          map[c.id] = c.name;
        });
        setCategoriesMap(map);
      }

      if (res && res.success && res.data) {
        const tech: TechnicianProfile = res.data;
        setTechnician(tech);
        setSelectedServicePrice(tech.basePrice || tech.hourlyRate || 35);
      }

      // Check if logged in customer has an ongoing (PENDING or ACCEPTED) booking for this technician
      if (user && String(user.role || "").toUpperCase() === "CUSTOMER") {
        try {
          const bookingsRes = await getUserBookingsAction();
          if (bookingsRes && bookingsRes.success && Array.isArray(bookingsRes.data)) {
            const activeBooking = bookingsRes.data.find(
              (b: any) =>
                b.technicianProfileId === id &&
                (b.status === "PENDING" || b.status === "ACCEPTED")
            );

            if (activeBooking) {
              setHasActiveBooking(true);
              setActiveBookingStatus(activeBooking.status);
            } else {
              setHasActiveBooking(false);
              setActiveBookingStatus(null);
            }
          }
        } catch (err) {
          console.error("Error fetching user bookings on mount:", err);
        }
      }

      setLoading(false);
    };

    fetchProfileCategoriesAndBookings();
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
  const availableSlots = generateSlotsFromWorkingHours(workingHours);
  const activeSelectedSlot = customSlot ? "" : (bookingSlot || availableSlots[0] || "");

  const handleBookNowClick = async () => {
    setBookingLoading(true);
    try {
      const user = await getCurrentUserAction();
      setBookingLoading(false);

      if (!user) {
        toast.error("Please log in as a Customer to book this technician.");
        const currentPath = `/technicians/${id}`;
        router.push(`/login?redirectTo=${encodeURIComponent(currentPath)}`);
        return;
      }

      const role = String(user.role || "").toUpperCase();
      if (role !== "CUSTOMER") {
        toast.error(`Only Customer accounts can book technicians. You are currently logged in as a ${role}.`);
        const currentPath = `/technicians/${id}`;
        router.push(`/login?redirectTo=${encodeURIComponent(currentPath)}`);
        return;
      }

      // Customer is authenticated! Open modal
      setIsBookingModalOpen(true);
    } catch (error) {
      setBookingLoading(false);
      console.error("Auth check error:", error);
      toast.error("Failed to check login status. Please try logging in.");
      router.push(`/login?redirectTo=${encodeURIComponent(`/technicians/${id}`)}`);
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedSlot = customSlot.trim() !== "" ? customSlot.trim() : (bookingSlot || availableSlots[0] || "");
    if (!bookingDate) {
      toast.error("Please select a valid booking date.");
      return;
    }
    if (!selectedSlot) {
      toast.error("Please select a time slot.");
      return;
    }

    setBookingLoading(true);

    try {
      const res = await createBookingAction({
        technicianProfileId: id,
        bookingDate,
        slot: selectedSlot,
        serviceId: selectedServiceId || undefined,
      });

      if (res && res.success) {
        toast.success(res.message || "Appointment booked successfully! Track your status in dashboard.");
        setHasActiveBooking(true);
        setActiveBookingStatus("PENDING");
        setIsBookingModalOpen(false);
      } else {
        toast.error(res?.message || "Failed to create booking. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("An error occurred while creating booking.");
    } finally {
      setBookingLoading(false);
    }
  };

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

  const todayISO = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 relative">
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

              {/* Offered Services Section */}
              {technician.services && technician.services.length > 0 && (
                <div className="mt-6 border-t border-neutral-100 pt-6">
                  <h3 className="text-sm font-bold text-[#14171C] flex items-center gap-2">
                    <Tag className="h-4 w-4 text-[#FF5A36]" />
                    Offered Services & Pricing
                  </h3>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {technician.services.map((srv) => (
                      <div key={srv.id} className="rounded-2xl border border-[#E7E2D8] bg-[#FFFBF3] p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-[#14171C]">{srv.name}</span>
                            <span className="font-extrabold text-xs text-[#FF5A36]">${srv.price}</span>
                          </div>
                          <p className="mt-1 text-[11px] text-neutral-500 line-clamp-2">{srv.description}</p>
                        </div>
                        <span className="mt-2 text-[10px] text-neutral-400 flex items-center gap-1">
                          <Clock className="h-3 w-3 text-[#0FA894]" /> Est. Duration: {srv.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Customer Reviews Section */}
            <div className="rounded-3xl border border-[#E7E2D8] bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 pb-4 gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#14171C] flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-[#FF5A36]" />
                    Customer Reviews ({technician.reviews ? technician.reviews.length : 0})
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Real feedback from clients who booked services with {technician.user?.name || "this technician"}.
                  </p>
                </div>

                {technician.reviews && technician.reviews.length > 0 && (
                  <div className="flex items-center gap-2 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-2 text-xs font-extrabold text-amber-800 shrink-0">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>
                      {(
                        technician.reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) /
                        technician.reviews.length
                      ).toFixed(1)} / 5.0
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-4">
                {!technician.reviews || technician.reviews.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-neutral-200 p-8 text-center bg-[#FFFBF3]">
                    <MessageSquare className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-[#14171C]">No customer reviews yet</p>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Be the first customer to book an appointment and share your review!
                    </p>
                  </div>
                ) : (
                  technician.reviews.map((review) => {
                    const starsCount = Math.max(1, Math.min(5, Math.round(Number(review.rating) || 5)));

                    return (
                      <div key={review.id} className="rounded-2xl border border-[#E7E2D8] bg-[#FFFBF3] p-4 sm:p-5 transition-all hover:border-[#FF5A36]/40">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14171C] text-xs font-extrabold text-white shadow-sm">
                              {review.customer?.name ? review.customer.name.charAt(0).toUpperCase() : "C"}
                            </span>
                            <div>
                              <p className="text-xs font-extrabold text-[#14171C]">
                                {review.customer?.name || "Verified Customer"}
                              </p>
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                Verified Service Booking
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-[#E7E2D8]">
                            {[1, 2, 3, 4, 5].map((starIdx) => (
                              <Star
                                key={starIdx}
                                className={`h-3.5 w-3.5 ${
                                  starIdx <= starsCount
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-neutral-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {review.comment && (
                          <p className="mt-3 text-xs text-neutral-700 leading-relaxed font-medium bg-white/70 p-3 rounded-xl border border-neutral-100">
                            "{review.comment}"
                          </p>
                        )}

                        <div className="mt-2.5 flex items-center justify-between text-[10px] text-neutral-400 px-1">
                          <span>
                            {new Date(review.createdAt).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })
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
                {workingHours && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-[#FF5A36]" />
                      Working Hours:
                    </span>
                    <span className="font-semibold text-[#14171C]">{workingHours}</span>
                  </div>
                )}
              </div>

              {/* Primary "Book This Technician Now" button */}
              <button
                onClick={handleBookNowClick}
                disabled={!isTechAvailable || bookingLoading}
                className={`mt-6 w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold text-white shadow-lg transition-all active:scale-95 ${
                  isTechAvailable
                    ? "bg-[#FF5A36] shadow-orange-500/20 hover:bg-[#C23B1F]"
                    : "bg-neutral-400 cursor-not-allowed opacity-60"
                }`}
              >
                {bookingLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking Session...
                  </>
                ) : isTechAvailable ? (
                  "Book This Technician Now"
                ) : (
                  "Technician Currently Offline"
                )}
              </button>

              {hasActiveBooking && (
                <div className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 py-2 px-3 text-[11px] font-semibold text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Existing Booking: {activeBookingStatus}
                </div>
              )}

              <div className="mt-4 border-t border-neutral-100 pt-4 text-center">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF5A36] hover:underline"
                >
                  View My Bookings in Dashboard
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Form Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-neutral-100">
            {/* Modal Close Button */}
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute right-5 top-5 text-neutral-400 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5A36]/10 text-[#FF5A36]">
                <Calendar className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-lg font-extrabold text-[#14171C]">Book Appointment</h3>
                <p className="text-xs text-neutral-500">With {technician.user?.name}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmBooking} className="mt-6 space-y-5">
              {/* Optional Service Offered Selector */}
              {technician.services && technician.services.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-[#14171C] mb-1.5">
                    Select Offered Service
                  </label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => {
                      setSelectedServiceId(e.target.value);
                      const srv = technician.services?.find((s) => s.id === e.target.value);
                      if (srv) {
                        setSelectedServicePrice(srv.price);
                        if (srv.duration) setBookingSlot(srv.duration);
                      } else {
                        setSelectedServicePrice(technician.basePrice || technician.hourlyRate || 35);
                      }
                    }}
                    className="w-full rounded-2xl border border-neutral-200 bg-[#FFFBF3] px-4 py-3 text-xs font-semibold text-[#14171C] outline-none focus:border-[#FF5A36] focus:ring-1 focus:ring-[#FF5A36]"
                  >
                    <option value="">Standard General Hourly Rate (${technician.basePrice || technician.hourlyRate || 35}/hr)</option>
                    {technician.services.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {srv.name} — ${srv.price} ({srv.duration})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Technician Schedule info badge */}
              {workingHours && (
                <div className="flex items-center gap-2.5 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs text-amber-900">
                  <Clock className="h-4 w-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold">Technician Active Hours: </span>
                    <span>{workingHours}</span>
                    {workingDays && workingDays.length > 0 && (
                      <span className="block text-[11px] text-amber-700">Days: {workingDays.join(", ")}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Date selection */}
              <div>
                <label className="block text-xs font-bold text-[#14171C] mb-1.5">
                  Select Date
                </label>
                <div className="relative flex items-center">
                  <input
                    type="date"
                    min={todayISO}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-neutral-200 bg-[#FFFBF3] px-4 py-3 text-xs font-semibold text-[#14171C] outline-none focus:border-[#FF5A36] focus:ring-1 focus:ring-[#FF5A36]"
                  />
                </div>
              </div>

              {/* Slot selection */}
              <div>
                <label className="block text-xs font-bold text-[#14171C] mb-1.5">
                  Select Preferred Time Slot
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => {
                        setBookingSlot(slot);
                        setCustomSlot("");
                      }}
                      className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all text-left flex items-center justify-between ${
                        activeSelectedSlot === slot
                          ? "border-[#FF5A36] bg-[#FF5A36]/10 text-[#FF5A36] shadow-sm"
                          : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      <span>{slot}</span>
                      {activeSelectedSlot === slot && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#FF5A36]" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom slot input */}
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Or enter custom time (e.g. 05:30 PM)"
                    value={customSlot}
                    onChange={(e) => setCustomSlot(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs text-neutral-800 outline-none focus:border-[#FF5A36]"
                  />
                </div>
              </div>

              {/* Price & Technician Profile Summary */}
              <div className="rounded-2xl bg-[#FFFBF3] border border-[#E7E2D8] p-4 text-xs space-y-2">
                <div className="flex justify-between text-neutral-600">
                  <span>Standard Rate</span>
                  <span className="font-bold text-[#14171C]">${selectedServicePrice} / hr</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Booking Date</span>
                  <span className="font-semibold text-[#14171C]">{bookingDate}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Time Slot</span>
                  <span className="font-semibold text-[#14171C]">{customSlot || bookingSlot || availableSlots[0] || ""}</span>
                </div>
                <div className="border-t border-neutral-200 pt-2 flex justify-between font-bold text-sm text-[#14171C]">
                  <span>Initial Status</span>
                  <span className="text-amber-600 uppercase text-xs">PENDING APPROVAL</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="flex-1 rounded-2xl border border-neutral-200 py-3 text-xs font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#FF5A36] py-3 text-xs font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-[#C23B1F] transition-all disabled:opacity-50"
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
