"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export const updateProfileAction = async (payload: { name: string }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return { success: false, message: "Not authenticated" };

  const backendUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5001";

  try {
    const res = await fetch(`${backendUrl}/api/auth/update-profile`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (result?.success) {
      revalidatePath("/dashboard/profile");
      revalidatePath("/admin-dashboard/profile");
    }
    return result;
  } catch (error) {
    console.error("updateProfileAction error:", error);
    return { success: false, message: "Server error. Please try again." };
  }
};

export const changePasswordAction = async (payload: {
  currentPassword: string;
  newPassword: string;
}) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return { success: false, message: "Not authenticated" };

  const backendUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5001";

  try {
    const res = await fetch(`${backendUrl}/api/auth/change-password`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("changePasswordAction error:", error);
    return { success: false, message: "Server error. Please try again." };
  }
};
