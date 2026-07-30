"use client";

import { useState } from "react";
import { CalendarCheck, CheckCircle2, Clock, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { updateTechnicianAvailabilityAction } from "../_actions/technicianActions";

export default function TechnicianSchedulePage() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [workingDays, setWorkingDays] = useState<string[]>(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  const [workingHours, setWorkingHours] = useState("09:00 AM - 06:00 PM");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const daysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleDayToggle = (day: string) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter((d) => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await updateTechnicianAvailabilityAction({
      availability: {
        isAvailable,
        workingDays,
        workingHours,
      },
    });

    if (res && res.success) {
      setMessage({ type: "success", text: "Availability schedule saved successfully!" });
    } else {
      setMessage({ type: "error", text: res.message || "Failed to update schedule." });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#14171C]">Work Schedule & Availability</h1>
        <p className="text-xs text-neutral-500">Configure your active work hours and weekly available days</p>
      </div>

      {message && (
        <div
          className={`flex items-center justify-between rounded-2xl p-4 text-xs font-semibold shadow-sm ${
            message.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4 text-rose-600" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-neutral-400 hover:text-neutral-700">
            Dismiss
          </button>
        </div>
      )}

      <div className="max-w-2xl rounded-3xl border border-[#E7E2D8] bg-white p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSaveSchedule} className="space-y-6 text-xs">
          {/* Availability Switch */}
          <div className="flex items-center justify-between rounded-2xl bg-[#FFFBF3] p-4">
            <div>
              <p className="font-bold text-[#14171C]">Active Status</p>
              <p className="text-[11px] text-neutral-500">
                {isAvailable ? "You are currently accepting new client bookings." : "You are currently offline or busy."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAvailable(!isAvailable)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAvailable ? "bg-[#0FA894]" : "bg-neutral-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAvailable ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Working Hours */}
          <div>
            <label className="block font-bold text-[#14171C]">Working Hours</label>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-neutral-300 p-2.5">
              <Clock className="h-4 w-4 text-[#FF5A36]" />
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                placeholder="e.g. 09:00 AM - 06:00 PM"
                className="w-full bg-transparent font-medium text-neutral-800 outline-none"
              />
            </div>
          </div>

          {/* Working Days Selection */}
          <div>
            <label className="block font-bold text-[#14171C]">Working Days</label>
            <div className="mt-3 flex flex-wrap gap-2">
              {daysList.map((day) => {
                const selected = workingDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`rounded-2xl px-4 py-2 text-xs font-semibold transition-all ${
                      selected
                        ? "bg-[#14171C] text-white shadow-sm"
                        : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-2xl bg-[#FF5A36] px-6 py-3 font-semibold text-white shadow-md hover:bg-[#C23B1F] disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Availability Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
