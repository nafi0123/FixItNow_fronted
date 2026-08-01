"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

const CORAL = "#FF5A36";
const CORAL_DARK = "#C23B1F";
const TEAL = "#0FA894";
const INK = "#14171C";


export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((res) => setTimeout(res, 1400));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF8F5]">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#14171C] py-16 text-white sm:py-24">
        <div
          className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: `radial-gradient(circle, ${TEAL}, transparent)` }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: `radial-gradient(circle, ${CORAL}, transparent)` }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider"
              style={{ backgroundColor: `${TEAL}20`, color: TEAL }}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              We're Here to Help
            </span>

            <h1
              className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Get in <span style={{ color: CORAL }}>Touch</span>
            </h1>
            <p className="mt-4 text-sm text-neutral-300 sm:text-base max-w-xl mx-auto leading-relaxed">
              Have a question, need support, or want to partner with us? Our team responds within a few hours — always.
            </p>

            {/* Quick Info Chips */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs font-semibold">
              {[
                { icon: <Clock className="h-3.5 w-3.5" />, label: "Response within 2 hours" },
                { icon: <ShieldCheck className="h-3.5 w-3.5" />, label: "24/7 Priority Support" },
                { icon: <CheckCircle2 className="h-3.5 w-3.5" />, label: "100% Satisfaction" },
              ].map((chip, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-neutral-200"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <span style={{ color: TEAL }}>{chip.icon}</span>
                  {chip.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Cards + Form ─────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Left: Contact Info Cards */}
          <div className="space-y-5">
            {/* Email */}
            <div className="group rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all hover:border-[#FF5A36]/40 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm"
                  style={{ backgroundColor: `${CORAL}15`, color: CORAL }}
                >
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Email Us</p>
                  <a
                    href="mailto:support@fixitnow.com"
                    className="mt-0.5 block text-sm font-bold text-[#14171C] transition-colors hover:text-[#FF5A36]"
                  >
                    support@fixitnow.com
                  </a>
                  <p className="mt-1 text-[11px] text-neutral-500">For bookings, refunds & general queries</p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="group rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all hover:border-[#0FA894]/40 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm"
                  style={{ backgroundColor: `${TEAL}15`, color: TEAL }}
                >
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Call Us</p>
                  <a
                    href="tel:+8801700000000"
                    className="mt-0.5 block text-sm font-bold text-[#14171C] transition-colors hover:text-[#0FA894]"
                  >
                    +880 1700-000000
                  </a>
                  <p className="mt-1 text-[11px] text-neutral-500">Available Sat–Thu, 9am–8pm BST</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="group rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all hover:border-[#FF5A36]/40 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm"
                  style={{ backgroundColor: `${INK}10`, color: INK }}
                >
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Our Office</p>
                  <p className="mt-0.5 text-sm font-bold text-[#14171C]">Road 11, Block F</p>
                  <p className="mt-0.5 text-xs text-neutral-500">Banani, Dhaka 1213, Bangladesh</p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="rounded-3xl border border-[#E7E2D8] bg-[#FFFBF3] p-6 shadow-sm">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#14171C]">
                <Clock className="h-4 w-4" style={{ color: CORAL }} />
                Business Hours
              </p>
              <div className="mt-3 space-y-2 text-xs">
                {[
                  { day: "Saturday – Thursday", hours: "9:00 AM – 8:00 PM" },
                  { day: "Friday", hours: "10:00 AM – 6:00 PM" },
                  { day: "Public Holidays", hours: "Emergency support only" },
                ].map((row) => (
                  <div key={row.day} className="flex justify-between text-neutral-600">
                    <span className="font-semibold">{row.day}</span>
                    <span className="font-medium text-neutral-500">{row.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-[#E7E2D8] bg-white p-8 shadow-sm">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span
                    className="flex h-20 w-20 items-center justify-center rounded-full text-3xl"
                    style={{ backgroundColor: `${TEAL}15`, color: TEAL }}
                  >
                    <CheckCircle2 className="h-10 w-10" />
                  </span>
                  <h2 className="mt-5 text-xl font-extrabold text-[#14171C]">Message Sent Successfully!</h2>
                  <p className="mt-2 text-sm text-neutral-500 max-w-sm">
                    Thanks for reaching out! Our support team will get back to you within 2 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-6 rounded-2xl border border-[#E7E2D8] px-6 py-2.5 text-sm font-bold text-[#14171C] transition-colors hover:bg-[#FFFBF3]"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <div className="border-b border-neutral-100 pb-5">
                    <h2
                      className="text-xl font-extrabold text-[#14171C]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Send Us a Message
                    </h2>
                    <p className="mt-1 text-xs text-neutral-500">
                      Fill in the form below and we'll reply as soon as possible.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      {/* Name */}
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-[#14171C]">
                          Full Name <span style={{ color: CORAL }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="e.g. Ahmed Rahman"
                          className="w-full rounded-2xl border border-[#E7E2D8] bg-[#FFFBF3] px-4 py-3 text-sm font-medium text-[#14171C] placeholder-neutral-400 outline-none transition-all focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/10"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-[#14171C]">
                          Email Address <span style={{ color: CORAL }}>*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="you@example.com"
                          className="w-full rounded-2xl border border-[#E7E2D8] bg-[#FFFBF3] px-4 py-3 text-sm font-medium text-[#14171C] placeholder-neutral-400 outline-none transition-all focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/10"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-[#14171C]">
                        Subject <span style={{ color: CORAL }}>*</span>
                      </label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-[#E7E2D8] bg-[#FFFBF3] px-4 py-3 text-sm font-medium text-[#14171C] outline-none transition-all focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/10"
                      >
                        <option value="">Select a topic...</option>
                        <option value="booking">Booking Support</option>
                        <option value="payment">Payment Issue</option>
                        <option value="technician">Technician Concern</option>
                        <option value="partner">Partnership / Business</option>
                        <option value="feedback">General Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-[#14171C]">
                        Message <span style={{ color: CORAL }}>*</span>
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Describe your issue or question in as much detail as possible..."
                        className="w-full resize-none rounded-2xl border border-[#E7E2D8] bg-[#FFFBF3] px-4 py-3 text-sm font-medium text-[#14171C] placeholder-neutral-400 outline-none transition-all focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/10"
                      />
                      <p className="mt-1 text-right text-[10px] text-neutral-400">{form.message.length} / 1000</p>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95 disabled:opacity-70"
                      style={{
                        background: `linear-gradient(135deg, ${CORAL} 0%, ${CORAL_DARK} 100%)`,
                        boxShadow: `0 6px 20px ${CORAL}30`,
                      }}
                    >
                      {submitting ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Map Embed ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Our Location</p>
            <h3 className="text-lg font-extrabold text-[#14171C]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Road 11, Block F, Banani — Dhaka
            </h3>
          </div>
          <a
            href="https://maps.google.com/?q=Banani+Dhaka+Bangladesh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
            style={{ background: `linear-gradient(135deg, ${CORAL} 0%, ${CORAL_DARK} 100%)`, boxShadow: `0 4px 16px ${CORAL}30` }}
          >
            <MapPin className="h-3.5 w-3.5" />
            Open in Google Maps
          </a>
        </div>

        {/* Map iframe */}
        <div className="overflow-hidden rounded-3xl border border-[#E7E2D8] shadow-md">
          <iframe
            title="FixItNow Office Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.6960555!2d90.40139!3d23.79367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c714e5c5ded5%3A0xb48e6979a3b8b4!2sBanani%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1690000000000"
            width="100%"
            height="420"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* Map section closes here — page ends */}
    </div>
  );
}
