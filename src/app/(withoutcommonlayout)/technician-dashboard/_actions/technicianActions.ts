"use server"

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const getBackendUrl = () => process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
};

export interface UpdateProfilePayload {
  bio?: string;
  skills?: string[];
  experienceYears?: number;
  hourlyRate?: number;
  location?: string;
}

export interface UpdateAvailabilityPayload {
  availability: {
    isAvailable?: boolean;
    workingDays?: string[];
    workingHours?: string;
    [key: string]: any;
  } | boolean;
}

export interface CreateServicePayload {
  name: string;
  description: string;
  price: number;
  duration: string;
  categoryId: string;
}

export const updateTechnicianProfileAction = async (payload: UpdateProfilePayload) => {
  const token = await getAuthToken();
  if (!token) return { success: false, message: "Unauthorized! Please log in." };

  try {
    const res = await fetch(`${getBackendUrl()}/api/technician/profile`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (result.success) {
      try { (revalidateTag as any)("technician-profile"); } catch {}
      try { (revalidateTag as any)("user-me"); } catch {}
    }
    return result;
  } catch (error) {
    console.error("updateTechnicianProfileAction error:", error);
    return { success: false, message: "Failed to update profile." };
  }
};

export const updateTechnicianAvailabilityAction = async (payload: UpdateAvailabilityPayload) => {
  const token = await getAuthToken();
  if (!token) return { success: false, message: "Unauthorized! Please log in." };

  try {
    const res = await fetch(`${getBackendUrl()}/api/technician/availability`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (result.success) {
      try { (revalidateTag as any)("technician-availability"); } catch {}
    }
    return result;
  } catch (error) {
    console.error("updateTechnicianAvailabilityAction error:", error);
    return { success: false, message: "Failed to update availability." };
  }
};

export const createTechnicianServiceAction = async (payload: CreateServicePayload) => {
  const token = await getAuthToken();
  if (!token) return { success: false, message: "Unauthorized! Please log in." };

  try {
    const res = await fetch(`${getBackendUrl()}/api/technician/services`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (result.success) {
      try { (revalidateTag as any)("technician-services"); } catch {}
      try { (revalidateTag as any)("public-services"); } catch {}
    }
    return result;
  } catch (error) {
    console.error("createTechnicianServiceAction error:", error);
    return { success: false, message: "Failed to create service." };
  }
};

export const getTechnicianBookingsAction = async (params?: { page?: number; limit?: number }) => {
  const token = await getAuthToken();
  if (!token) return { success: false, data: [] };

  const query = new URLSearchParams();
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));

  try {
    const res = await fetch(`${getBackendUrl()}/api/technician/bookings?${query.toString()}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 10, tags: ["technician-bookings"] },
    });
    return await res.json();
  } catch (error) {
    console.error("getTechnicianBookingsAction error:", error);
    return { success: false, data: [] };
  }
};

export const updateTechnicianBookingStatusAction = async (bookingId: string, status: "ACCEPTED" | "DECLINED" | "COMPLETED") => {
  const token = await getAuthToken();
  if (!token) return { success: false, message: "Unauthorized! Please log in." };

  try {
    const res = await fetch(`${getBackendUrl()}/api/technician/bookings/${bookingId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    const result = await res.json();
    if (result.success) {
      try { (revalidateTag as any)("technician-bookings"); } catch {}
    }
    return result;
  } catch (error) {
    console.error("updateTechnicianBookingStatusAction error:", error);
    return { success: false, message: "Failed to update booking status." };
  }
};
