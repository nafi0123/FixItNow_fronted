import { Suspense } from "react";
import LoginForm from "../_components/LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm font-medium text-[#6B707E]">Loading login page...</div>}>
      <LoginForm />
    </Suspense>
  );
}