"use server"

import jwt, { JwtPayload } from "jsonwebtoken"
import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

export const getAllUsersAdminAction = async (params?: { page?: number; limit?: number; search?: string; role?: string }) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) return null;

    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.search) query.append("search", params.search);
    if (params?.role) query.append("role", params.role);

    try {
        const res = await fetch(`${backendUrl}/api/admin/users?${query.toString()}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            next: {
                revalidate: 60 * 60,
                tags: ["admin-users"]
            }
        });

        const result = await res.json();
        return result;
    } catch (error) {
        console.error("getAllUsersAdminAction error:", error);
        return null;
    }
}

export const updateUserStatusAction = async (userId: string, isBanned: boolean) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) return { success: false, message: "Unauthorized" };

    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    try {
        const res = await fetch(`${backendUrl}/api/admin/users/${userId}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ isBanned })
        });

        const result = await res.json();
        if (result && result.success) {
            try { (revalidateTag as any)("admin-users"); } catch {}
        }
        return result;
    } catch (error) {
        console.error("updateUserStatusAction error:", error);
        return { success: false, message: "Server connection failed" };
    }
}

export const getAllCategoriesAdminAction = async (params?: { page?: number; limit?: number; search?: string }) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) return null;

    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.search) query.append("search", params.search);

    try {
        const res = await fetch(`${backendUrl}/api/admin/categories?${query.toString()}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            next: {
                revalidate: 60 * 60,
                tags: ["admin-categories"]
            }
        });

        const result = await res.json();
        return result;
    } catch (error) {
        console.error("getAllCategoriesAdminAction error:", error);
        return null;
    }
}

export const createCategoryAdminAction = async (payload: { name: string; description?: string }) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) return { success: false, message: "Unauthorized" };

    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    try {
        const res = await fetch(`${backendUrl}/api/admin/categories`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await res.json();
        if (result && result.success) {
            try { (revalidateTag as any)("admin-categories"); } catch {}
            try { (revalidateTag as any)("public-categories"); } catch {}
        }
        return result;
    } catch (error) {
        console.error("createCategoryAdminAction error:", error);
        return { success: false, message: "Server connection failed" };
    }
}

export const updateCategoryAdminAction = async (categoryId: string, payload: { name: string; description?: string }) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) return { success: false, message: "Unauthorized" };

    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    try {
        const res = await fetch(`${backendUrl}/api/admin/categories/${categoryId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await res.json();
        if (result && result.success) {
            try { (revalidateTag as any)("admin-categories"); } catch {}
            try { (revalidateTag as any)("public-categories"); } catch {}
        }
        return result;
    } catch (error) {
        console.error("updateCategoryAdminAction error:", error);
        return { success: false, message: "Server connection failed" };
    }
}

export const deleteCategoryAdminAction = async (categoryId: string) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) return { success: false, message: "Unauthorized" };

    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    try {
        const res = await fetch(`${backendUrl}/api/admin/categories/${categoryId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const result = await res.json();
        if (result && result.success) {
            try { (revalidateTag as any)("admin-categories"); } catch {}
            try { (revalidateTag as any)("public-categories"); } catch {}
        }
        return result;
    } catch (error) {
        console.error("deleteCategoryAdminAction error:", error);
        return { success: false, message: "Server connection failed" };
    }
}