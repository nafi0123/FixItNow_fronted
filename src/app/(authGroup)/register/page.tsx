import { Suspense } from "react";
import RegisterForm from "../_components/RegisterForm";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm font-medium text-[#6B707E]">Loading register page...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
