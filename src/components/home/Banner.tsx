import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  Wrench,
} from "lucide-react";

// Same palette as navbar/footer — cream base, coral primary, teal secondary
const INK = "#14171C";
const CORAL = "#FF5A36";
const CORAL_DARK = "#C23B1F";
const TEAL = "#0FA894";

export default function Banner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFBF3] via-[#FFF6EA] to-[#FFF0E2] py-16 lg:py-24">
      {/* Faint blueprint grid — nods to the "how it's built" side of home repair */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#14171C 1px, transparent 1px), linear-gradient(90deg, #14171C 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      {/* Ambient glow — coral → teal, echoing the navbar's signature gradient */}
      <div
        className="pointer-events-none absolute -top-40 right-0 h-[28rem] w-[28rem] rounded-full opacity-25 blur-3xl"
        style={{ background: `radial-gradient(circle, ${CORAL}, ${TEAL}, transparent 70%)` }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:px-8">
        {/* Left: copy */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF5A36]/30 bg-white/80 px-4 py-1.5 text-xs font-semibold text-[#C23B1F] shadow-sm backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-[#FF5A36]" />
            Rated 4.9/5 by 10,000+ homeowners across Bangladesh
          </div>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#1E2026] sm:text-5xl lg:text-[3.4rem]">
            Something broke?
            <br />
            <span className="bg-gradient-to-r from-[#FF5A36] to-[#C23B1F] bg-clip-text text-transparent">
              Get it fixed today.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-[#6B707E] sm:text-lg lg:mx-0">
            Tell us what's wrong, pick a time, and a background-checked technician
            shows up — usually the same day. Upfront pricing, no surprise call-out fees.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start">
            <Link
              href="/services"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5A36] to-[#C23B1F] px-7 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-[#FF5A36]/25 transition-all hover:opacity-95 sm:w-auto"
            >
              Fix something now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/register?role=technician"
              className="w-full rounded-xl border border-[#FF5A36]/30 bg-white/70 px-7 py-3.5 text-center text-sm font-semibold text-[#1E2026] shadow-sm transition-all hover:border-[#FF5A36] hover:bg-white sm:w-auto"
            >
              Earn as a technician
            </Link>
          </div>

          {/* Quick stats */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-[#FF5A36]/15 pt-7">
            <div className="text-center lg:text-left">
              <p className="text-xl font-bold text-[#1E2026] sm:text-2xl">500+</p>
              <p className="text-xs text-[#6B707E]">Verified experts</p>
            </div>
            <div className="text-center lg:text-left">
              <p className="text-xl font-bold text-[#1E2026] sm:text-2xl">10k+</p>
              <p className="text-xs text-[#6B707E]">Jobs completed</p>
            </div>
            <div className="text-center lg:text-left">
              <p className="text-xl font-bold text-[#1E2026] sm:text-2xl">24/7</p>
              <p className="text-xs text-[#6B707E]">Urgent support</p>
            </div>
          </div>
        </div>

        {/* Right: a live "booking ticket" mockup — the signature visual */}
        <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:ml-auto">
          {/* floating category chips */}
          <div className="absolute -left-4 -top-4 hidden items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#1E2026] shadow-md sm:flex">
            <Wrench className="h-3.5 w-3.5" style={{ color: TEAL }} />
            AC Repair
          </div>
          <div className="absolute -right-3 top-20 hidden items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#1E2026] shadow-md sm:flex">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: TEAL }} />
            Plumbing
          </div>

          <div className="relative rounded-2xl border border-[#FF5A36]/15 bg-white shadow-xl shadow-[#14171C]/5">
            {/* ticket header */}
            <div
              className="flex items-center justify-between rounded-t-2xl px-5 py-4"
              style={{ backgroundColor: INK }}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">
                Booking confirmed
              </span>
              <span
                className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white"
                style={{ backgroundColor: TEAL }}
              >
                On the way
              </span>
            </div>

            <div className="px-5 py-5">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
                  style={{ backgroundColor: CORAL }}
                >
                  RH
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1E2026]">Rafiq Hossain</p>
                  <div className="flex items-center gap-1 text-xs text-[#6B707E]">
                    <Star className="h-3 w-3 fill-current" style={{ color: CORAL }} />
                    4.9 · Electrician · 6 yrs
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2.5 border-t border-dashed border-[#E7E2D8] pt-4 text-xs text-[#4A4E58]">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" style={{ color: TEAL }} />
                  Arriving in 28 minutes
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" style={{ color: TEAL }} />
                  Dhanmondi, Dhaka
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5" style={{ color: TEAL }} />
                  Fixed price — no hidden fees
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-[#FFF6EA] px-3.5 py-2.5">
                <span className="text-xs font-medium text-[#6B707E]">Estimated total</span>
                <span className="text-sm font-bold text-[#1E2026]">৳ 850</span>
              </div>
            </div>

            {/* perforated ticket edge */}
            <div
              className="h-3 w-full rounded-b-2xl"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, transparent, transparent 10px, #14171C1a 10px, #14171C1a 11px)",
                maskImage: "radial-gradient(circle at 6px 12px, transparent 6px, black 6.5px)",
                maskSize: "12px 12px",
                maskRepeat: "repeat-x",
                maskPosition: "top",
              }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}