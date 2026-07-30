import Link from "next/link";
import { Wrench, Mail, Phone } from "lucide-react";

const columns = [
  {
    title: "For customers",
    links: [
      { label: "Browse services", href: "/services" },
      { label: "Find a technician", href: "/technicians" },
      { label: "How booking works", href: "/how-it-works" },
      { label: "Track a booking", href: "/bookings" },
    ],
  },
  {
    title: "For technicians",
    links: [
      { label: "Join as a technician", href: "/register?role=technician" },
      { label: "Manage your services", href: "/technician/services" },
      { label: "Booking requests", href: "/technician/bookings" },
      { label: "Payouts", href: "/technician/payments" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About FixItNow", href: "/about" },
      { label: "Service categories", href: "/categories" },
      { label: "Contact support", href: "/contact" },
      { label: "Terms & privacy", href: "/legal" },
    ],
  },
];

// Same palette as the navbar — ink/cream base, coral primary, teal secondary
const INK = "#14171C";
const CORAL = "#FF5A36";
const CORAL_DARK = "#C23B1F";
const TEAL = "#0FA894";

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.4c0-.87.24-1.46 1.49-1.46H16.5V4.35A20 20 0 0 0 14.2 4.2c-2.28 0-3.84 1.39-3.84 3.95v2.35H8v3h2.36V21h3.14Z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="17.1" cy="6.9" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4 4h3.6l4.2 5.6L16.6 4H20l-6.2 7.9L20.4 20h-3.6l-4.5-5.9L7 20H3.6l6.5-8.3L4 4Z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#FFFBF3] via-[#FFF6EA] to-[#FFF0E2] text-[#4A4E58]">
      {/* Torn service-ticket edge */}
      <div
        className="h-3 w-full"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 10px, #FFFFFF 10px, #FFFFFF 11px)",
          backgroundColor: "#FFFBF3",
          maskImage:
            "radial-gradient(circle at 6px 0, transparent 6px, black 6.5px)",
          maskSize: "12px 12px",
          maskRepeat: "repeat-x",
          maskPosition: "top",
        }}
        aria-hidden="true"
      />

      {/* Coral → teal glow, echoing the navbar's signature gradient */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: `radial-gradient(circle, ${CORAL}, ${TEAL}, transparent 70%)` }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl shadow-md"
                style={{ backgroundColor: INK, boxShadow: `0 4px 14px ${CORAL}22` }}
              >
                <Wrench className="h-5 w-5" strokeWidth={2} style={{ color: CORAL }} />
              </span>
              <span
                className="text-xl font-bold tracking-tight text-[#1E2026]"
                style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}
              >
                FixIt
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(90deg, ${CORAL}, ${CORAL_DARK})` }}
                >
                  Now
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-[25ch] text-xs leading-relaxed text-[#6B707E]">
              Your trusted home service platform — vetted technicians, booked and paid in minutes.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-2.5">
              {[
                { label: "Facebook", icon: FacebookIcon },
                { label: "Instagram", icon: InstagramIcon },
                { label: "X (Twitter)", icon: XIcon },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href="#"
                  aria-label={social.label}
                  className="group flex h-9 w-9 items-center justify-center rounded-full border border-[#FF5A36]/20 bg-white/70 text-[#5C616E] shadow-sm transition-all hover:border-[#FF5A36] hover:bg-[#FF5A36] hover:text-white hover:shadow-md"
                >
                  <social.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: CORAL_DARK }}
              >
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block text-[13px] font-medium text-[#6B707E] transition-all duration-200 hover:translate-x-0.5 hover:text-[#C23B1F]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Availability strip */}
        <div
          className="mt-12 flex flex-col gap-4 rounded-2xl border bg-white/60 p-5 shadow-lg backdrop-blur-md sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: `${CORAL}26`, boxShadow: `0 10px 30px ${CORAL}0d` }}
        >
          <div className="flex items-center gap-2.5 text-xs font-semibold text-[#2D313A]">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ backgroundColor: TEAL }}
              />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: TEAL }} />
            </span>
            Support available 24/7 for urgent repairs
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-[#4A4E58]">
            <a
              href="mailto:support@fixitnow.com"
              className="flex items-center gap-2 transition-colors hover:text-[#C23B1F]"
            >
              <Mail className="h-4 w-4" style={{ color: CORAL }} />
              support@fixitnow.com
            </a>
            <a
              href="tel:+8801700000000"
              className="flex items-center gap-2 transition-colors hover:text-[#C23B1F]"
            >
              <Phone className="h-4 w-4" style={{ color: CORAL }} />
              +880 1700-000000
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-8 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs font-medium text-[#828795] sm:flex-row"
          style={{ borderColor: `${CORAL}26` }}
        >
          <p>© {new Date().getFullYear()} FixItNow. All rights reserved.</p>
          <p className="tracking-wide">Crafted for trusted home services in Bangladesh.</p>
        </div>
      </div>
    </footer>
  );
}