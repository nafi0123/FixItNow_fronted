"use client"

import { useActionState, useState, useEffect } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Wrench,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Star,
  ArrowRight,
  HardHat,
} from "lucide-react"
import { registerAction } from "../_actions/authActions"

// Same palette as the rest of the site — cream base, coral primary, teal secondary
const INK = "#14171C"
const CORAL = "#FF5A36"
const TEAL = "#0FA894"

const RegisterForm = () => {
  const [role, setRole] = useState<"customer" | "technician">("customer")
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [state, action, pending] = useActionState(registerAction, null)

  useEffect(() => {
    if (!state) return

    if (state.success) {
      toast.success(state.message || "Registration Successful")
    } else if (state.message) {
      toast.error(state.message || "Registration failed")
    }
  }, [state])

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left: form */}
      <div className="flex items-center justify-center bg-gradient-to-b from-[#FFFBF3] via-[#FFF6EA] to-[#FFF0E2] px-4 py-12 sm:px-6 lg:px-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: INK }}
            >
              <Wrench className="h-5 w-5" strokeWidth={2.25} style={{ color: CORAL }} />
            </span>
            <span
              className="text-lg font-bold tracking-tight text-[#1E2026]"
              style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}
            >
              FixIt<span style={{ color: CORAL }}>Now</span>
            </span>
          </Link>

          <h1 className="mt-8 text-2xl font-extrabold tracking-tight text-[#1E2026] sm:text-3xl">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-[#6B707E]">
            Join FixItNow to book trusted repairs or start earning as a technician.
          </p>

          {/* Role toggle */}
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl border border-[#E7E2D8] bg-white p-1">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${
                role === "customer" ? "text-white" : "text-[#6B707E] hover:text-[#1E2026]"
              }`}
              style={role === "customer" ? { backgroundColor: INK } : undefined}
            >
              <User className="h-3.5 w-3.5" />
              I need a service
            </button>
            <button
              type="button"
              onClick={() => setRole("technician")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${
                role === "technician" ? "text-white" : "text-[#6B707E] hover:text-[#1E2026]"
              }`}
              style={role === "technician" ? { backgroundColor: INK } : undefined}
            >
              <HardHat className="h-3.5 w-3.5" />
              I'm a technician
            </button>
          </div>

          <form action={action} className="mt-6 space-y-4">
            {/* Hidden role input for Server Action */}
            <input type="hidden" name="role" value={role} />

            {state && !state.success && state.message && (
              <div className="rounded-xl border border-[#FF5A36]/20 bg-[#FF5A36]/10 p-3 text-xs font-medium text-[#C23B1F]">
                {state.message}
              </div>
            )}

            {/* Full name */}
            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-[#1E2026]">
                Full name
              </label>
              <div className="flex items-center overflow-hidden rounded-xl border border-[#E7E2D8] bg-white transition-colors focus-within:border-[#FF5A36]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center text-[#9AA0AA]">
                  <User className="h-4 w-4" />
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rafiq Hossain"
                  className="w-full bg-transparent py-2.5 pr-4 text-sm text-[#1E2026] outline-none placeholder:text-[#9AA0AA]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-[#1E2026]">
                Email
              </label>
              <div className="flex items-center overflow-hidden rounded-xl border border-[#E7E2D8] bg-white transition-colors focus-within:border-[#FF5A36]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center text-[#9AA0AA]">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent py-2.5 pr-4 text-sm text-[#1E2026] outline-none placeholder:text-[#9AA0AA]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-[#1E2026]">
                Password
              </label>
              <div className="flex items-center overflow-hidden rounded-xl border border-[#E7E2D8] bg-white transition-colors focus-within:border-[#FF5A36]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center text-[#9AA0AA]">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full bg-transparent py-2.5 text-sm text-[#1E2026] outline-none placeholder:text-[#9AA0AA]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="flex h-11 w-11 shrink-0 items-center justify-center text-[#9AA0AA] hover:text-[#1E2026]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 text-xs text-[#6B707E]">
              <input
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 rounded border-[#E7E2D8] text-[#FF5A36] focus:ring-[#FF5A36]"
              />
              I agree to the{" "}
              <Link href="/legal" className="font-medium text-[#C23B1F] hover:underline">
                Terms &amp; Privacy Policy
              </Link>
            </label>

            <button
              type="submit"
              disabled={pending}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5A36] to-[#C23B1F] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF5A36]/25 transition-all hover:opacity-95 disabled:opacity-50"
            >
              {pending ? "Creating account..." : role === "customer" ? "Create account" : "Apply as technician"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>



          <p className="mt-8 text-center text-sm text-[#6B707E]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#C23B1F] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right: branded visual panel */}
      <div className="relative hidden overflow-hidden lg:block" style={{ backgroundColor: INK }}>
        {/* blueprint grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden="true"
        />
        {/* glow */}
        <div
          className="pointer-events-none absolute -bottom-32 -right-20 h-[26rem] w-[26rem] rounded-full opacity-30 blur-3xl"
          style={{ background: `radial-gradient(circle, ${CORAL}, ${TEAL}, transparent 70%)` }}
          aria-hidden="true"
        />

        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-md">
            <ShieldCheck className="h-4 w-4" style={{ color: CORAL }} />
            {role === "customer" ? "Verified technicians only" : "Get your first job within days"}
          </div>

          <div>
            {role === "customer" ? (
              <p className="max-w-md text-2xl font-bold leading-snug text-white">
                "Booked an electrician at 9pm, he was here by 9:40. Didn't expect that
                level of speed for a home repair app."
              </p>
            ) : (
              <p className="max-w-md text-2xl font-bold leading-snug text-white">
                "I set my own hours, pick jobs near me, and payouts land the same day
                the work's done. No middleman haggling."
              </p>
            )}
            <div className="mt-5 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: CORAL }}
              >
                {role === "customer" ? "SA" : "RH"}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {role === "customer" ? "Sadia Afrin" : "Rafiq Hossain"}
                </p>
                <div className="flex items-center gap-1 text-xs text-white/60">
                  <Star className="h-3 w-3 fill-current" style={{ color: CORAL }} />
                  {role === "customer" ? "Customer since 2024" : "Electrician · 6 yrs on FixItNow"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 border-t border-white/10 pt-6">
            {role === "customer" ? (
              <>
                <div>
                  <p className="text-xl font-bold text-white">500+</p>
                  <p className="text-xs text-white/60">Verified experts</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">10k+</p>
                  <p className="text-xs text-white/60">Jobs completed</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">4.9/5</p>
                  <p className="text-xs text-white/60">Average rating</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-xl font-bold text-white">৳850</p>
                  <p className="text-xs text-white/60">Avg. job payout</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">0%</p>
                  <p className="text-xs text-white/60">Signup fee</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">24hr</p>
                  <p className="text-xs text-white/60">Payout speed</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm
