"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Lock,
  RefreshCcw,
  UserCheck,
  HelpCircle,
  Mail,
  ChevronRight,
  Printer,
  CheckCircle2,
} from "lucide-react";

const CORAL = "#FF5A36";
const CORAL_DARK = "#C23B1F";
const TEAL = "#0FA894";
const INK = "#14171C";

type LegalTab = "terms" | "privacy" | "refund" | "code_of_conduct";

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<LegalTab>("terms");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#14171C] py-16 text-white sm:py-20">
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
              <ShieldCheck className="h-3.5 w-3.5" />
              Official Documentation &amp; Compliance
            </span>

            <h1
              className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Legal &amp; <span style={{ color: CORAL }}>Compliance</span>
            </h1>
            <p className="mt-4 text-sm text-neutral-300 sm:text-base leading-relaxed max-w-2xl mx-auto">
              Welcome to FixItNow's official legal center. Below you will find our Terms of Service, Privacy Policy, Cancellation &amp; Refund guidelines, and Technician Code of Conduct.
            </p>

            <p className="mt-3 text-xs text-neutral-400 font-medium">
              Effective Date: August 1, 2026 · Version 2.4
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Legal Container ─────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">

          {/* Left Navigation Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-4 rounded-3xl border border-[#E7E2D8] bg-white p-5 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-2">
                Legal Directory
              </p>

              <nav className="space-y-1.5">
                {[
                  { id: "terms", label: "Terms of Service", icon: FileText },
                  { id: "privacy", label: "Privacy Policy", icon: Lock },
                  { id: "refund", label: "Cancellation & Refund", icon: RefreshCcw },
                  { id: "code_of_conduct", label: "Technician Conduct", icon: UserCheck },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as LegalTab)}
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-xs font-bold transition-all ${
                        isActive
                          ? "bg-[#14171C] text-white shadow-md"
                          : "text-neutral-600 hover:bg-[#FFFBF3] hover:text-[#14171C]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className="h-4 w-4"
                          style={{ color: isActive ? CORAL : "inherit" }}
                        />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight
                        className={`h-3.5 w-3.5 transition-transform ${
                          isActive ? "translate-x-0.5 text-[#FF5A36]" : "text-neutral-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </nav>

              <div className="border-t border-neutral-100 pt-4 px-2">
                <button
                  onClick={handlePrint}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#E7E2D8] bg-[#FFFBF3] py-2.5 text-xs font-bold text-[#14171C] transition-colors hover:border-[#FF5A36]"
                >
                  <Printer className="h-3.5 w-3.5 text-[#FF5A36]" />
                  Print Documentation
                </button>
              </div>
            </div>
          </aside>

          {/* Right Content Panel */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-[#E7E2D8] bg-white p-6 sm:p-10 shadow-sm">
              
              {/* TAB 1: TERMS OF SERVICE */}
              {activeTab === "terms" && (
                <article className="space-y-8 text-neutral-700">
                  <div className="border-b border-neutral-100 pb-6">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${CORAL}15`, color: CORAL }}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Document 01
                    </span>
                    <h2
                      className="mt-3 text-2xl font-extrabold text-[#14171C] sm:text-3xl"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Terms of Service
                    </h2>
                    <p className="mt-2 text-xs text-neutral-500">
                      Governing your access to and use of the FixItNow platform services.
                    </p>
                  </div>

                  <section className="space-y-3">
                    <h3 className="text-base font-extrabold text-[#14171C]">1. Acceptance of Terms</h3>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      By accessing or using the FixItNow website, mobile applications, or booking services, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, please do not use our services.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-extrabold text-[#14171C]">2. Platform Service Scope</h3>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      FixItNow serves as an on-demand marketplace connecting customers seeking home repair services (such as AC repair, plumbing, electrical work, painting, and carpentry) with independent, verified technicians. FixItNow provides slot scheduling, payment processing, and customer support.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-extrabold text-[#14171C]">3. User Responsibilities &amp; Account Security</h3>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      Users must be at least 18 years of age to register an account. You are responsible for maintaining the confidentiality of your credentials and for providing accurate location details for service appointments.
                    </p>
                    <ul className="space-y-2 text-xs sm:text-sm pl-4 list-disc text-neutral-600">
                      <li>Provide safe and reasonable access to the service location.</li>
                      <li>Ensure an adult (18+) is present during the entire service visit.</li>
                      <li>Refrain from off-platform direct transactions with technicians.</li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-extrabold text-[#14171C]">4. Service Pricing &amp; Online Payment</h3>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      Service fees are displayed upfront during booking based on the technician's hourly rate or flat service charge. Payments are securely processed online via SSLCommerz / Stripe gateway. Additional parts or extended labor required during service must be confirmed via updated invoice.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-extrabold text-[#14171C]">5. Limitation of Liability</h3>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      FixItNow performs rigorous background checks on all listed technicians. In the event of property damage or incomplete work, FixItNow provides resolution support under our 100% Service Guarantee up to the total service booking amount.
                    </p>
                  </section>
                </article>
              )}

              {/* TAB 2: PRIVACY POLICY */}
              {activeTab === "privacy" && (
                <article className="space-y-8 text-neutral-700">
                  <div className="border-b border-neutral-100 pb-6">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${TEAL}15`, color: TEAL }}
                    >
                      <Lock className="h-3.5 w-3.5" />
                      Document 02
                    </span>
                    <h2
                      className="mt-3 text-2xl font-extrabold text-[#14171C] sm:text-3xl"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Privacy Policy
                    </h2>
                    <p className="mt-2 text-xs text-neutral-500">
                      How we collect, protect, and handle your personal information.
                    </p>
                  </div>

                  <section className="space-y-3">
                    <h3 className="text-base font-extrabold text-[#14171C]">1. Data We Collect</h3>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      To provide smooth booking and service fulfillment, FixItNow collects personal information provided directly by you when creating an account, booking a technician, or contacting customer support:
                    </p>
                    <ul className="space-y-2 text-xs sm:text-sm pl-4 list-disc text-neutral-600">
                      <li><strong>Identity Data:</strong> Full Name, Email Address, Phone Number.</li>
                      <li><strong>Service Location:</strong> Physical address and city for technician dispatch.</li>
                      <li><strong>Transaction Data:</strong> Payment status, booking timestamps, invoices.</li>
                      <li><strong>Technical Logs:</strong> Device IP, browser type, and cookie identifiers.</li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-extrabold text-[#14171C]">2. How We Use Your Information</h3>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      We use your data solely for platform operations, including dispatching technicians to your location, sending booking SMS/email notifications, processing payments, and resolving customer queries.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-extrabold text-[#14171C]">3. Payment &amp; Data Security</h3>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      Your financial details (credit cards, mobile banking credentials) are encrypted and handled exclusively by licensed PCI-DSS compliant payment gateways. FixItNow does not store raw payment card numbers on our servers.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-extrabold text-[#14171C]">4. Data Retention &amp; User Rights</h3>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      You have the right to request access to, correction of, or deletion of your personal account data at any time by contacting support@fixitnow.com.
                    </p>
                  </section>
                </article>
              )}

              {/* TAB 3: CANCELLATION & REFUND */}
              {activeTab === "refund" && (
                <article className="space-y-8 text-neutral-700">
                  <div className="border-b border-neutral-100 pb-6">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${CORAL}15`, color: CORAL }}
                    >
                      <RefreshCcw className="h-3.5 w-3.5" />
                      Document 03
                    </span>
                    <h2
                      className="mt-3 text-2xl font-extrabold text-[#14171C] sm:text-3xl"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Cancellation &amp; Refund Policy
                    </h2>
                    <p className="mt-2 text-xs text-neutral-500">
                      Clear rules for appointment cancellations, rescheduling, and payment refunds.
                    </p>
                  </div>

                  <section className="space-y-3">
                    <h3 className="text-base font-extrabold text-[#14171C]">1. Customer Cancellation Timeline</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
                        <p className="text-xs font-extrabold text-emerald-800">Free Cancellation</p>
                        <p className="mt-1 text-xs text-emerald-700">
                          Cancel up to <strong>2 hours prior</strong> to the scheduled appointment slot for a 100% full refund.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
                        <p className="text-xs font-extrabold text-amber-800">Late Cancellation Fee</p>
                        <p className="mt-1 text-xs text-amber-700">
                          Cancellations within 2 hours of slot time incur a nominal ৳150 technician dispatch fee.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-extrabold text-[#14171C]">2. Technician No-Show Guarantee</h3>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      If an accepted technician fails to arrive within 30 minutes of your scheduled slot without prior notification, you are entitled to an immediate 100% refund plus a ৳200 bonus service credit.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-extrabold text-[#14171C]">3. Refund Processing Timeframe</h3>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      Approved refunds are returned automatically to the original payment method (bKash/Nagad/Cards) within 3 to 5 business days.
                    </p>
                  </section>
                </article>
              )}

              {/* TAB 4: TECHNICIAN CONDUCT */}
              {activeTab === "code_of_conduct" && (
                <article className="space-y-8 text-neutral-700">
                  <div className="border-b border-neutral-100 pb-6">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${TEAL}15`, color: TEAL }}
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      Document 04
                    </span>
                    <h2
                      className="mt-3 text-2xl font-extrabold text-[#14171C] sm:text-3xl"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Technician Code of Conduct
                    </h2>
                    <p className="mt-2 text-xs text-neutral-500">
                      Mandatory safety, professionalism, and service standards for all listed providers.
                    </p>
                  </div>

                  <section className="space-y-3">
                    <h3 className="text-base font-extrabold text-[#14171C]">1. Professional Uniform &amp; Identification</h3>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      All FixItNow technicians must wear official FixItNow badges or ID cards and present valid government identification upon arrival at the client's premises.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-extrabold text-[#14171C]">2. Strict Zero Tolerance Policy</h3>
                    <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 space-y-2">
                      <p className="text-xs font-extrabold text-red-800">Immediate Termination Triggers:</p>
                      <ul className="text-xs text-red-700 list-disc pl-4 space-y-1">
                        <li>Soliciting off-platform cash payments from clients.</li>
                        <li>Unprofessional language, harassment, or safety violations.</li>
                        <li>Subcontracting assigned bookings to unauthorized third parties.</li>
                      </ul>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-extrabold text-[#14171C]">3. Quality &amp; Workmanship Guarantee</h3>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      Technicians warrant all labor for 14 days post-completion. Any defect reported within 14 days will be inspected and corrected free of charge.
                    </p>
                  </section>
                </article>
              )}

            </div>

            {/* Support Banner */}
            <div className="mt-8 rounded-3xl border border-[#E7E2D8] bg-[#FFFBF3] p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm"
                    style={{ backgroundColor: `${CORAL}15`, color: CORAL }}
                  >
                    <HelpCircle className="h-6 w-6" />
                  </span>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#14171C]">Have Questions Regarding Legal Terms?</h4>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      Our legal &amp; compliance team is available to assist with any policy inquiries.
                    </p>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95 sm:shrink-0"
                  style={{ background: `linear-gradient(135deg, ${CORAL} 0%, ${CORAL_DARK} 100%)` }}
                >
                  <Mail className="h-3.5 w-3.5" />
                  Contact Compliance Team
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
