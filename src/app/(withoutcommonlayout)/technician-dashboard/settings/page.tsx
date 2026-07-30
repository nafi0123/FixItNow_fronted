"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TechnicianSettingsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/technician-dashboard/profile");
  }, [router]);

  return null;
}
