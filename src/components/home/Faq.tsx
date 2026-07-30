"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How do I book a technician?",
    answer:
      "Search for the service you need, compare verified technicians by rating and price, pick a time slot, and confirm. Most bookings get a technician assigned within minutes.",
  },
  {
    question: "Are technicians actually background-checked?",
    answer:
      "Every technician passes an NID verification, a skills assessment, and a background check before they're allowed to take a single job on FixItNow.",
  },
  {
    question: "What happens if the repair isn't done right?",
    answer:
      "You're covered by our Service Guarantee. Flag it within 7 days and we'll send someone back to fix it properly — no extra charge.",
  },
  {
    question: "How do I pay?",
    answer:
      "Pay online with mobile banking or a card when you book, or choose Cash on Service and pay the technician once the job's done.",
  },
  {
    question: "Can I cancel or reschedule?",
    answer:
      "Yes — free of charge, any time up to 2 hours before the scheduled slot. Just manage it from your dashboard.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gradient-to-b from-[#FFFBF3] via-[#FFF6EA] to-[#FFF0E2] py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF5A36]/30 bg-[#FF5A36]/10 text-[#C23B1F]">
            <HelpCircle className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#1E2026] sm:text-4xl">
            Questions, answered straight
          </h2>
          <p className="mt-3 text-sm text-[#6B707E]">
            No fine print. Here's exactly how booking a repair on FixItNow works.
          </p>
        </div>

        {/* FAQ List */}
        <div className="mt-10 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-[#FF5A36]/15 bg-white shadow-sm transition-all duration-200 hover:border-[#FF5A36]/30"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-5 text-left font-semibold text-[#1E2026] transition-colors hover:text-[#C23B1F]"
                >
                  <span className="text-base">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-[#FF5A36] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-[#FF5A36]/10 bg-[#FFFBF3]/60 px-5 py-4 text-sm leading-relaxed text-[#6B707E]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Callout */}
        <div className="mt-10 rounded-2xl border border-[#FF5A36]/20 bg-gradient-to-r from-[#FFF6EA] to-[#FFF0E2] p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#1E2026]">
            Still stuck on something?
          </p>
          <p className="mt-1 text-xs text-[#6B707E]">
            Our support team answers 24/7 — no bots, no hold music.
          </p>
          <a
            href="/contact"
            className="mt-4 inline-block rounded-xl bg-[#FF5A36] px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#FF5A36]/20 transition-all hover:bg-[#C23B1F]"
          >
            Contact support
          </a>
        </div>

      </div>
    </section>
  );
}