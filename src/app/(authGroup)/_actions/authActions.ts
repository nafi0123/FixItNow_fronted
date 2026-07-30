"use server"

import jwt, { JwtPayload } from "jsonwebtoken"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export type LoginState = {
    success?: boolean;
    statusCode?: number;
    message?: string;
    data?: {
        accessToken: string;
        refreshToken: string;
    };
} | null | undefined;


export const loginAction = async (redirectTo: string, prevState: LoginState, formData: FormData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    const payload = {
        email,
        password
    }

    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL ;

    let result;
    try {
        const res = await fetch(`${backendUrl}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        result = await res.json();
    } catch (error) {
        console.error("Login fetch error:", error);
        return {
            success: false,
            statusCode: 500,
            message: "Unable to connect to login server. Please try again."
        }
    }

    if (result && result.success && result.data?.accessToken) {
        const cookieStore = await cookies()

        cookieStore.set("accessToken", result.data.accessToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24,
            sameSite: "lax",
            path: "/"
        });
        cookieStore.set("refreshToken", result.data.refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax",
            path: "/"
        });

        let decodedRole = "";
        try {
            const decodedToken = jwt.decode(result.data.accessToken) as JwtPayload;
            if (decodedToken && decodedToken.role) {
                decodedRole = String(decodedToken.role).toUpperCase();
            }
        } catch (e) {
            console.error("JWT Decode error:", e);
        }

        if (redirectTo && typeof redirectTo === "string" && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
            redirect(redirectTo);
        }

        if (decodedRole === "CUSTOMER") {
            redirect("/dashboard");
        } else if (decodedRole === "ADMIN") {
            redirect("/admin-dashboard");
        } else if (decodedRole === "TECHNICIAN") {
            redirect("/technician-dashboard");
        } else {
            redirect("/dashboard");
        }
    }

    return result
}

export type RegisterState = {
    success?: boolean;
    statusCode?: number;
    message?: string;
    data?: any;
} | null | undefined;

export const registerAction = async (prevState: RegisterState, formData: FormData) => {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const rawRole = (formData.get("role") as string) || "customer";
    const role = rawRole.toUpperCase();

    const payload = {
        name,
        email,
        password,
        role
    }

    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://fix-it-now-brown.vercel.app";

    let result;
    try {
        const res = await fetch(`${backendUrl}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        result = await res.json();
    } catch (error) {
        console.error("Register fetch error:", error);
        return {
            success: false,
            statusCode: 500,
            message: "Unable to connect to register server. Please try again."
        }
    }

    if (result && result.success) {
        redirect("/login");
    }

    return result;
}

export const logoutAction = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    redirect("/login");
}

export const getCurrentUser = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return null;
    try {
        const decoded = jwt.decode(token) as JwtPayload;
        return decoded;
    } catch {
        return null;
    }
}