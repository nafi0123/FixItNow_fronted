"use client"

import { useActionState, useState, useEffect, useRef } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Wrench, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Star } from "lucide-react"
import { loginAction } from "../_actions/authActions"

const INK = "#1E2026"
const CORAL = "#FF5A36"
const TEAL = "#00D1B2"

const LoginForm = () => {
  const [redirectTo, setRedirectTo] = useState("")
  const [state, action, pending] = useActionState(loginAction.bind(null, redirectTo), null)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleQuickLogin = (emailVal: string, passVal: string) => {
    setEmail(emailVal)
    setPassword(passVal)
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.requestSubmit()
      }
    }, 50)
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      setRedirectTo(params.get("redirectTo") || "")
    }
  }, [])

  useEffect(() => {
    if (!state) return

    if (state.success) {
      toast.success(state.message || "Login Successful")
    } else if (state.message) {
      toast.error(state.message || "Login failed")
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
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-[#6B707E]">
            Log in to manage bookings, track technicians, and pick up where you left off.
          </p>

          <form ref={formRef} action={action} className="mt-8 space-y-4">
            {state && !state.success && state.message && (
              <div className="rounded-xl border border-[#FF5A36]/20 bg-[#FF5A36]/10 p-3 text-xs font-medium text-[#C23B1F]">
                {state.message}
              </div>
            )}

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
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold text-[#1E2026]">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-[#6B707E] hover:text-[#C23B1F]"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="flex items-center overflow-hidden rounded-xl border border-[#E7E2D8] bg-white transition-colors focus-within:border-[#FF5A36]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center text-[#9AA0AA]">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            {/* Remember me */}
            <label className="flex items-center gap-2 text-xs text-[#6B707E]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[#E7E2D8] text-[#FF5A36] focus:ring-[#FF5A36]"
              />
              Keep me signed in
            </label>

            <button
              type="submit"
              disabled={pending}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5A36] to-[#C23B1F] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF5A36]/25 transition-all hover:opacity-95 disabled:opacity-50"
            >
              {pending ? "Logging in..." : "Log in"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {/* Quick Demo Login Buttons */}
          <div className="mt-6 space-y-2.5 rounded-2xl border border-[#E7E2D8] bg-white/60 p-3.5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs font-bold text-[#1E2026]">
              <span>Demo Accounts (Click to Autofill)</span>
              <span className="rounded-md bg-[#FF5A36]/10 px-2 py-0.5 text-[10px] font-bold text-[#FF5A36]">Quick Demo</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={pending}
                onClick={() => handleQuickLogin("nafi.cse0123@gmail.com", "123456")}
                className="group flex flex-col items-center justify-center rounded-xl border border-[#E7E2D8] bg-white p-2.5 text-center transition-all hover:border-[#1E2026] hover:bg-[#1E2026] disabled:opacity-50"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E2026] group-hover:text-white">
                  <ShieldCheck className="h-4 w-4 text-[#FF5A36]" />
                  <span>Login as Admin</span>
                </div>
                <span className="mt-0.5 text-[10px] text-[#6B707E] group-hover:text-white/80">nafi.cse0123@gmail.com</span>
              </button>

              <button
                type="button"
                disabled={pending}
                onClick={() => handleQuickLogin("nafi2122940@gmail.com", "123456")}
                className="group flex flex-col items-center justify-center rounded-xl border border-[#E7E2D8] bg-white p-2.5 text-center transition-all hover:border-[#1E2026] hover:bg-[#1E2026] disabled:opacity-50"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E2026] group-hover:text-white">
                  <Wrench className="h-4 w-4 text-[#00D1B2]" />
                  <span>Login as Tech</span>
                </div>
                <span className="mt-0.5 text-[10px] text-[#6B707E] group-hover:text-white/80">nafi2122940@gmail.com</span>
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-[#6B707E]">
            New to FixItNow?{" "}
            <Link href="/register" className="font-semibold text-[#C23B1F] hover:underline">
              Create an account
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
            Verified technicians only
          </div>

          <div>
            <p className="max-w-md text-2xl font-bold leading-snug text-white">
              "Booked an electrician at 9pm, he was here by 9:40. Didn't expect that
              level of speed for a home repair app."
            </p>
            <div className="mt-5 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: CORAL }}
              >
                SA
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Sadia Afrin</p>
                <div className="flex items-center gap-1 text-xs text-white/60">
                  <Star className="h-3 w-3 fill-current" style={{ color: CORAL }} />
                  Customer since 2024
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 border-t border-white/10 pt-6">
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm