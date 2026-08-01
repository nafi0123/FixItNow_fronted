"use server";

import { cookies } from "next/headers";

const getBackendUrl = () => process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
};

export interface PaymentItem {
  id: string;
  bookingId: string;
  transactionId: string;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED";
  createdAt: string;
  updatedAt: string;
  booking?: {
    id: string;
    bookingDate: string;
    slot: string;
    status: string;
    paymentStatus: string;
    customer?: {
      id?: string;
      name?: string;
      email?: string;
    };
    technicianProfile?: {
      user?: {
        id?: string;
        name?: string;
        email?: string;
      };
    };
  };
}

export const getAllPaymentsAction = async () => {
  const token = await getAuthToken();
  if (!token) {
    return {
      success: false,
      statusCode: 401,
      message: "Unauthorized! Please log in.",
      data: [],
    };
  }

  try {
    const res = await fetch(`${getBackendUrl()}/api/payments`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    return await res.json();
  } catch (error) {
    console.error("getAllPaymentsAction error:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch payment history.",
      data: [],
    };
  }
};

export const getPaymentByIdAction = async (transactionId: string) => {
  const token = await getAuthToken();
  if (!token) {
    return {
      success: false,
      statusCode: 401,
      message: "Unauthorized! Please log in.",
    };
  }

  try {
    const res = await fetch(`${getBackendUrl()}/api/payments/${transactionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    return await res.json();
  } catch (error) {
    console.error("getPaymentByIdAction error:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch payment details.",
    };
  }
};
