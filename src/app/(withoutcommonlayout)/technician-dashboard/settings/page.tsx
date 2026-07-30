"use client";

import { useState, useEffect } from "react";
import { Settings, User, MapPin, DollarSign, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { getPublicCategoriesAction, Category } from "@/src/app/(withcommonlayout)/_actions/publicAction";
import { updateTechnicianProfileAction } from "../_actions/technicianActions";

export default function TechnicianSettingsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    bio: "",
    location: "",
    hourlyRate: 45,
    skills: [] as string[],
  });

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      const res = await getPublicCategoriesAction({ limit: 100 });
      if (res && res.success && Array.isArray(res.data)) {
        setCategories(res.data);
      }
    };
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await updateTechnicianProfileAction({
      bio: form.bio,
      location: form.location,
      hourlyRate: Number(form.hourlyRate),
      skills: form.skills,
    });

    if (res && res.success) {
      setMessage({ type: "success", text: "Technician profile settings updated successfully!" });
    } else {
      setMessage({ type: "error", text: res.message || "Failed to update profile settings." });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#14171C]">Profile Settings</h1>
        <p className="text-xs text-neutral-500">Update your public bio, location, hourly rate, and skills</p>
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
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block font-bold text-[#14171C]">Public Bio</label>
            <textarea
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Introduce your experience, qualifications, and specialties to clients..."
              className="mt-1.5 w-full rounded-2xl border border-neutral-300 p-3 outline-none focus:border-[#FF5A36]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-bold text-[#14171C]">Location / City</label>
              <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-neutral-300 p-2.5">
                <MapPin className="h-4 w-4 text-[#FF5A36]" />
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Dhaka, Bangladesh"
                  className="w-full bg-transparent font-medium text-neutral-800 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#14171C]">Hourly Rate ($)</label>
              <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-neutral-300 p-2.5">
                <DollarSign className="h-4 w-4 text-[#0FA894]" />
                <input
                  type="number"
                  min={1}
                  value={form.hourlyRate}
                  onChange={(e) => setForm({ ...form, hourlyRate: Number(e.target.value) })}
                  className="w-full bg-transparent font-medium text-neutral-800 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#14171C]">Skills & Expertise Categories</label>
            <p className="mt-0.5 text-[11px] text-neutral-500">Select categories relevant to your technical skills</p>
            <div className="mt-2.5 max-h-48 overflow-y-auto space-y-2 rounded-2xl border border-neutral-200 p-3">
              {categories.map((cat) => {
                const isChecked = form.skills.includes(cat.id);
                return (
                  <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-700 hover:text-[#FF5A36]">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm({ ...form, skills: [...form.skills, cat.id] });
                        } else {
                          setForm({
                            ...form,
                            skills: form.skills.filter((id) => id !== cat.id),
                          });
                        }
                      }}
                      className="rounded border-neutral-300 text-[#FF5A36] focus:ring-[#FF5A36]"
                    />
                    <span className="font-medium">{cat.name}</span>
                  </label>
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
              Save Profile Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
