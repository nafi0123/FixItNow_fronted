"use client";

import { useState, useEffect } from "react";
import { Briefcase, Plus, Wrench, Clock, DollarSign, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { getPublicCategoriesAction, getPublicServicesAction, Category, Service } from "@/src/app/(withcommonlayout)/_actions/publicAction";
import { createTechnicianServiceAction } from "../_actions/technicianActions";

export default function TechnicianServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 50,
    duration: "1-2 Hours",
    categoryId: "",
  });

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [servicesRes, categoriesRes] = await Promise.all([
      getPublicServicesAction({ limit: 100 }),
      getPublicCategoriesAction({ limit: 100 }),
    ]);

    if (servicesRes && servicesRes.success && Array.isArray(servicesRes.data)) {
      setServices(servicesRes.data);
    }
    if (categoriesRes && categoriesRes.success && Array.isArray(categoriesRes.data)) {
      setCategories(categoriesRes.data);
      if (!form.categoryId && categoriesRes.data.length > 0) {
        setForm((prev) => ({ ...prev, categoryId: categoriesRes.data[0].id }));
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    const res = await createTechnicianServiceAction({
      name: form.name,
      description: form.description,
      price: Number(form.price),
      duration: form.duration,
      categoryId: form.categoryId,
    });

    if (res && res.success) {
      setMessage({ type: "success", text: "New service created successfully!" });
      setShowModal(false);
      setForm({
        name: "",
        description: "",
        price: 50,
        duration: "1-2 Hours",
        categoryId: categories[0]?.id || "",
      });
      await loadData();
    } else {
      setMessage({ type: "error", text: res.message || "Failed to create service." });
    }
    setSubmitLoading(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#14171C]">My Offered Services</h1>
          <p className="text-xs text-neutral-500">Create and manage your professional service listings</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-2xl bg-[#FF5A36] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#C23B1F]"
        >
          <Plus className="h-4 w-4" />
          Add New Service
        </button>
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

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-3xl border border-neutral-200 bg-white p-6" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="my-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white p-12 text-center">
          <Briefcase className="h-12 w-12 text-neutral-300" />
          <h3 className="mt-3 text-sm font-bold text-[#14171C]">No services created yet</h3>
          <p className="mt-1 text-xs text-neutral-500">Click "Add New Service" to create your first service offer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col justify-between rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all hover:shadow-md"
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

                <h3 className="mt-4 text-base font-bold text-[#14171C]">{service.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 line-clamp-3">
                  {service.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-neutral-400">Price</span>
                  <p className="text-xl font-extrabold text-[#14171C]">${service.price}</p>
                </div>
                <span className="rounded-xl bg-[#FFFBF3] px-3 py-1.5 text-xs font-semibold text-[#0FA894]">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Service Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-[#14171C]">Create New Service</h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-700">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700">Service Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Electrical Wiring Repair"
                  className="mt-1 w-full rounded-xl border border-neutral-300 p-2 outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700">Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-neutral-300 p-2 outline-none focus:border-[#FF5A36] bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700">Description</label>
                <textarea
                  rows={2}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Details about the service..."
                  className="mt-1 w-full rounded-xl border border-neutral-300 p-2 outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700">Price ($)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-neutral-300 p-2 outline-none focus:border-[#FF5A36]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700">Est. Duration</label>
                  <input
                    type="text"
                    required
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="e.g. 1-2 Hours"
                    className="mt-1 w-full rounded-xl border border-neutral-300 p-2 outline-none focus:border-[#FF5A36]"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-neutral-100 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-neutral-300 px-4 py-2 text-neutral-600 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex items-center gap-1.5 rounded-xl bg-[#FF5A36] px-5 py-2 font-semibold text-white shadow-sm hover:bg-[#C23B1F]"
                >
                  {submitLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Create Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
