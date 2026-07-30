"use client";

import { useState, useEffect } from "react";
import { User, MapPin, DollarSign, CalendarCheck, Clock, ShieldCheck, Loader2, Wrench, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { getPublicCategoriesAction, Category } from "@/src/app/(withcommonlayout)/_actions/publicAction";
import { getMeAction } from "@/src/app/(authGroup)/_actions/authActions";
import {
  updateTechnicianProfileAction,
  updateTechnicianAvailabilityAction,
} from "../_actions/technicianActions";

const INK = "#14171C";
const CORAL = "#FF5A36";
const CORAL_DARK = "#C23B1F";
const TEAL = "#0FA894";

export default function TechnicianProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "schedule">("profile");

  // Profile Form state
  const [categories, setCategories] = useState<Category[]>([]);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [hourlyRate, setHourlyRate] = useState<number | "">(50);
  const [skills, setSkills] = useState<string[]>([]);
  const [savingProfile, setSavingProfile] = useState(false);

  // Schedule Form state
  const [isAvailable, setIsAvailable] = useState(true);
  const [workingDays, setWorkingDays] = useState<string[]>(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  const [workingHours, setWorkingHours] = useState("09:00 AM - 06:00 PM");
  const [savingSchedule, setSavingSchedule] = useState(false);

  const [loadingData, setLoadingData] = useState(true);

  const daysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const dayShort: Record<string, string> = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun",
  };

  // Fetch initial profile & categories
  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingData(true);
      const [catRes, user] = await Promise.all([
        getPublicCategoriesAction({ limit: 100 }),
        getMeAction(),
      ]);

      if (catRes && catRes.success && Array.isArray(catRes.data)) {
        setCategories(catRes.data);
      }

      if (user && user.technicianProfile) {
        const prof = user.technicianProfile;
        if (prof.bio) setBio(prof.bio);
        if (prof.location) setLocation(prof.location);
        if (prof.basePrice) setHourlyRate(prof.basePrice);
        if (Array.isArray(prof.skills)) setSkills(prof.skills);

        if (prof.availability && typeof prof.availability === "object") {
          const avail = prof.availability;
          if (typeof avail.isAvailable === "boolean") setIsAvailable(avail.isAvailable);
          if (Array.isArray(avail.workingDays)) setWorkingDays(avail.workingDays);
          if (typeof avail.workingHours === "string" && avail.workingHours.trim() !== "") {
            setWorkingHours(avail.workingHours);
          }
        }
      }
      setLoadingData(false);
    };

    loadInitialData();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    const res = await updateTechnicianProfileAction({
      bio: bio.trim(),
      location: location.trim(),
      hourlyRate: Number(hourlyRate) || 50,
      skills,
    });

    if (res && res.success) {
      toast.success(res.message || "Profile details updated successfully!");
    } else {
      toast.error(res?.message || "Failed to update profile details.");
    }
    setSavingProfile(false);
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (workingDays.length === 0) {
      toast.error("Please select at least one working day.");
      return;
    }
    if (!workingHours.trim()) {
      toast.error("Working hours cannot be empty.");
      return;
    }

    setSavingSchedule(true);

    const res = await updateTechnicianAvailabilityAction({
      availability: {
        isAvailable,
        workingDays,
        workingHours: workingHours.trim(),
      },
    });

    if (res && res.success) {
      toast.success(res.message || "Work schedule saved successfully!");
    } else {
      toast.error(res?.message || "Failed to update schedule.");
    }
    setSavingSchedule(false);
  };

  const handleDayToggle = (day: string) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter((d) => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const selectedSkillNames = categories.filter((c) => skills.includes(c.id)).map((c) => c.name);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${CORAL}12`, color: CORAL_DARK }}
        >
          <User className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E2026]">Profile &amp; schedule</h1>
          <p className="text-xs text-[#6B707E]">
            Manage your public profile, hourly rate, skills, and weekly availability.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[20rem_1fr]">
        {/* Live preview card */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          {loadingData ? (
            /* Card Skeleton */
            <div className="overflow-hidden rounded-2xl bg-[#14171C] p-5 animate-pulse space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-white/10" />
              <div className="h-3 w-28 rounded bg-white/10" />
              <div className="space-y-2">
                <div className="h-2.5 w-full rounded bg-white/10" />
                <div className="h-2.5 w-4/5 rounded bg-white/10" />
                <div className="h-2.5 w-2/3 rounded bg-white/10" />
              </div>
              <div className="space-y-2 border-t border-white/10 pt-3">
                <div className="h-3 w-32 rounded bg-white/10" />
                <div className="h-3 w-24 rounded bg-white/10" />
                <div className="h-3 w-36 rounded bg-white/10" />
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl shadow-sm" style={{ backgroundColor: INK }}>
              <div
                className="pointer-events-none h-24 w-full opacity-[0.08]"
                style={{
                  backgroundImage:
                    "linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
                aria-hidden="true"
              />
              <div className="-mt-14 px-5 pb-5">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold text-white ring-4 ring-[#14171C]"
                  style={{ backgroundColor: CORAL }}
                >
                  <Wrench className="h-7 w-7" />
                </div>

                <div className="mt-3 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    {isAvailable && (
                      <span
                        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                        style={{ backgroundColor: TEAL }}
                      />
                    )}
                    <span
                      className="relative inline-flex h-2 w-2 rounded-full"
                      style={{ backgroundColor: isAvailable ? TEAL : "#6B707E" }}
                    />
                  </span>
                  <span className="text-xs font-semibold text-white/80">
                    {isAvailable ? "Accepting bookings" : "Currently offline"}
                  </span>
                </div>

                <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-white/60">
                  {bio || "Your public bio will appear here once you add one."}
                </p>

                <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-xs text-white/70">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" style={{ color: CORAL }} />
                    {location || "Location not set"}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-3.5 w-3.5" style={{ color: TEAL }} />
                    ${hourlyRate || 0} / hour
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" style={{ color: CORAL }} />
                    {workingHours || "Hours not set"}
                  </div>
                </div>

                {selectedSkillNames.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5 border-t border-white/10 pt-4">
                    {selectedSkillNames.map((name) => (
                      <span
                        key={name}
                        className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/80"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-white/10 pt-4">
                  {daysList.map((day) => (
                    <span
                      key={day}
                      className="rounded-md px-1.5 py-1 text-[10px] font-bold"
                      style={
                        workingDays.includes(day)
                          ? { backgroundColor: `${TEAL}22`, color: TEAL }
                          : { color: "rgba(255,255,255,0.25)" }
                      }
                    >
                      {dayShort[day]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form column */}
        <div className="min-w-0">
          {/* Underline tabs */}
          <div className="flex items-center gap-6 border-b border-[#E7E2D8]">
            <button
              onClick={() => setActiveTab("profile")}
              className="relative flex items-center gap-2 pb-3 text-xs font-semibold transition-colors"
              style={{ color: activeTab === "profile" ? CORAL_DARK : "#6B707E" }}
            >
              <User className="h-4 w-4" />
              Profile details
              {activeTab === "profile" && (
                <span
                  className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: CORAL }}
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab("schedule")}
              className="relative flex items-center gap-2 pb-3 text-xs font-semibold transition-colors"
              style={{ color: activeTab === "schedule" ? CORAL_DARK : "#6B707E" }}
            >
              <CalendarCheck className="h-4 w-4" />
              Work schedule
              {activeTab === "schedule" && (
                <span
                  className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: CORAL }}
                />
              )}
            </button>
          </div>

          {/* Content Form Container */}
          <div className="mt-6 rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-sm sm:p-8">
            {loadingData ? (
              /* Form Skeleton Loader */
              <div className="animate-pulse space-y-6">
                <div>
                  <div className="h-3 w-28 rounded bg-[#F1EEE6] mb-2" />
                  <div className="h-24 w-full rounded-xl bg-[#F1EEE6]" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <div className="h-3 w-24 rounded bg-[#F1EEE6] mb-2" />
                    <div className="h-10 w-full rounded-xl bg-[#F1EEE6]" />
                  </div>
                  <div>
                    <div className="h-3 w-24 rounded bg-[#F1EEE6] mb-2" />
                    <div className="h-10 w-full rounded-xl bg-[#F1EEE6]" />
                  </div>
                </div>
                <div>
                  <div className="h-3 w-36 rounded bg-[#F1EEE6] mb-2" />
                  <div className="flex flex-wrap gap-2 pt-1">
                    <div className="h-7 w-24 rounded-full bg-[#F1EEE6]" />
                    <div className="h-7 w-28 rounded-full bg-[#F1EEE6]" />
                    <div className="h-7 w-20 rounded-full bg-[#F1EEE6]" />
                    <div className="h-7 w-32 rounded-full bg-[#F1EEE6]" />
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-[#E7E2D8]">
                  <div className="h-9 w-36 rounded-xl bg-[#F1EEE6]" />
                </div>
              </div>
            ) : activeTab === "profile" ? (
              /* Profile Tab Form */
              <form onSubmit={handleProfileSubmit} className="space-y-5 text-xs">
                <div>
                  <label htmlFor="bio-input" className="mb-1.5 block font-semibold text-[#1E2026]">
                    Public bio / experience summary
                  </label>
                  <textarea
                    id="bio-input"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Introduce your technical experience, qualifications, and specialties to clients..."
                    className="w-full rounded-xl border border-[#E7E2D8] bg-white p-3 text-xs text-[#1E2026] outline-none transition-colors focus:border-[#FF5A36] placeholder:text-[#9AA0AA]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="loc-input" className="mb-1.5 block font-semibold text-[#1E2026]">
                      Location / city
                    </label>
                    <div className="flex items-center gap-2 rounded-xl border border-[#E7E2D8] bg-white px-3.5 py-2.5 transition-colors focus-within:border-[#FF5A36]">
                      <MapPin className="h-4 w-4 shrink-0" style={{ color: CORAL }} />
                      <input
                        id="loc-input"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Dhaka, Bangladesh"
                        className="w-full bg-transparent font-medium text-[#1E2026] outline-none placeholder:text-[#9AA0AA]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="rate-input" className="mb-1.5 block font-semibold text-[#1E2026]">
                      Base hourly rate ($)
                    </label>
                    <div className="flex items-center gap-2 rounded-xl border border-[#E7E2D8] bg-white px-3.5 py-2.5 transition-colors focus-within:border-[#FF5A36]">
                      <DollarSign className="h-4 w-4 shrink-0" style={{ color: TEAL }} />
                      <input
                        id="rate-input"
                        type="number"
                        min={1}
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full bg-transparent font-medium text-[#1E2026] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-[#1E2026]">
                    Skills &amp; category expertise
                  </label>
                  <p className="mb-2.5 text-[11px] text-[#6B707E]">
                    Select category skills related to your technical service offerings
                  </p>
                  <div className="flex flex-wrap gap-2 rounded-xl border border-[#E7E2D8] bg-white p-3">
                    {categories.map((cat) => {
                      const isChecked = skills.includes(cat.id);
                      return (
                        <label
                          key={cat.id}
                          className="cursor-pointer select-none rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
                          style={
                            isChecked
                              ? { backgroundColor: `${CORAL}12`, borderColor: `${CORAL}50`, color: CORAL_DARK }
                              : { backgroundColor: "#FFFFFF", borderColor: "#E7E2D8", color: "#6B707E" }
                          }
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSkills([...skills, cat.id]);
                              } else {
                                setSkills(skills.filter((id) => id !== cat.id));
                              }
                            }}
                            className="hidden"
                          />
                          {isChecked && <CheckCircle2 className="mr-1 inline h-3 w-3" />}
                          {cat.name}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end border-t border-[#E7E2D8] pt-5">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5A36] to-[#C23B1F] px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#FF5A36]/20 transition-all hover:opacity-95 disabled:opacity-50"
                  >
                    {savingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save profile details
                  </button>
                </div>
              </form>
            ) : (
              /* Schedule Tab Form */
              <form onSubmit={handleScheduleSubmit} className="space-y-6 text-xs">
                <div className="flex items-center justify-between rounded-xl border border-[#E7E2D8] bg-white p-4">
                  <div>
                    <p className="font-bold text-[#1E2026]">Active booking status</p>
                    <p className="text-[11px] text-[#6B707E]">
                      {isAvailable
                        ? "You are currently accepting new client bookings."
                        : "You are currently offline / not accepting bookings."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAvailable(!isAvailable)}
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                    style={{ backgroundColor: isAvailable ? TEAL : "#D9D5CB" }}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isAvailable ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label htmlFor="hours-input" className="mb-1.5 block font-semibold text-[#1E2026]">
                    Working hours
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-[#E7E2D8] bg-white px-3.5 py-2.5 transition-colors focus-within:border-[#FF5A36]">
                    <Clock className="h-4 w-4 shrink-0" style={{ color: CORAL }} />
                    <input
                      id="hours-input"
                      type="text"
                      required
                      value={workingHours}
                      onChange={(e) => setWorkingHours(e.target.value)}
                      placeholder="e.g. 09:00 AM - 06:00 PM"
                      className="w-full bg-transparent font-medium text-[#1E2026] outline-none placeholder:text-[#9AA0AA]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block font-semibold text-[#1E2026]">
                    Working days ({workingDays.length} selected)
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {daysList.map((day) => {
                      const selected = workingDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDayToggle(day)}
                          className="rounded-xl px-4 py-2 text-xs font-semibold transition-all"
                          style={
                            selected
                              ? { backgroundColor: INK, color: "#FFFFFF" }
                              : { border: "1px solid #E7E2D8", backgroundColor: "#FFFFFF", color: "#6B707E" }
                          }
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#E7E2D8] pt-5">
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#6B707E]">
                    <ShieldCheck className="h-3.5 w-3.5" style={{ color: TEAL }} />
                    Schedule updates apply instantly
                  </span>

                  <button
                    type="submit"
                    disabled={savingSchedule}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5A36] to-[#C23B1F] px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#FF5A36]/20 transition-all hover:opacity-95 disabled:opacity-50"
                  >
                    {savingSchedule && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save availability schedule
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}