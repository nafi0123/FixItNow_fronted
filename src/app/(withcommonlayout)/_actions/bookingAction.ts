"use server"

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const getBackendUrl = () => process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
};

export interface CreateBookingPayload {
  technicianProfileId: string;
  bookingDate: string;
  slot: string;
  serviceId?: string;
}

export const createBookingAction = async (payload: CreateBookingPayload) => {
  const token = await getAuthToken();
  if (!token) {
    return {
      success: false,
      statusCode: 401,
      message: "Unauthorized! Please log in as a customer to book.",
    };
  }

  try {
    const res = await fetch(`${getBackendUrl()}/api/bookings`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const result = await res.json();
    if (result.success) {
      try { (revalidateTag as any)("customer-bookings"); } catch { }
      try { (revalidateTag as any)("technician-bookings"); } catch { }
    }
    return result;
  } catch (error) {
    console.error("createBookingAction error:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Failed to connect to backend server for booking.",
    };
  }
};

export const getUserBookingsAction = async (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
  const token = await getAuthToken();
  if (!token) {
    return {
      success: false,
      statusCode: 401,
      message: "Unauthorized! Please log in.",
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPage: 1 },
    };
  }

  const query = new URLSearchParams();
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.search) query.append("search", params.search);
  if (params?.status) query.append("status", params.status);

  try {
    const res = await fetch(`${getBackendUrl()}/api/bookings?${query.toString()}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("getUserBookingsAction error:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch bookings.",
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPage: 1 },
    };
  }
};

export const getBookingDetailsAction = async (bookingId: string) => {
  const token = await getAuthToken();
  if (!token) {
    return {
      success: false,
      statusCode: 401,
      message: "Unauthorized! Please log in.",
    };
  }

  try {
    const res = await fetch(`${getBackendUrl()}/api/bookings/${bookingId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    return await res.json();
  } catch (error) {
    console.error("getBookingDetailsAction error:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch booking details.",
    };
  }
};
