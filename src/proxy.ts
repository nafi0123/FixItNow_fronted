import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/"];

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const accessToken = request.cookies.get("accessToken")?.value;

    let userRole: string | null = null;

    if (accessToken) {
        try {
            const decoded = jwt.decode(accessToken) as JwtPayload;
            if (decoded && decoded.role) {
                userRole = String(decoded.role).toUpperCase();
            }
        } catch {
            userRole = null;
        }
    }

    const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
    const isPublicRoute = PUBLIC_ROUTES.some(
        (route) => pathname === route || (route !== "/" && pathname.startsWith(route + "/"))
    );

    // 1. User is logged in and trying to access login or register page -> redirect to dashboard
    if (accessToken && isAuthRoute) {
        if (userRole === "CUSTOMER") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        } else if (userRole === "TECHNICIAN") {
            return NextResponse.redirect(new URL("/technician-dashboard", request.url));
        } else if (userRole === "ADMIN") {
            return NextResponse.redirect(new URL("/admin-dashboard", request.url));
        } else {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    // 2. Protected routes: User is NOT logged in and trying to access private page -> redirect to /login
    if (!accessToken && !isPublicRoute && !isAuthRoute) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 3. Authorization: Role-based access control
    if (accessToken && userRole) {
        if (pathname.startsWith("/dashboard") && userRole !== "CUSTOMER") {
            if (userRole === "TECHNICIAN") {
                return NextResponse.redirect(new URL("/technician-dashboard", request.url));
            } else if (userRole === "ADMIN") {
                return NextResponse.redirect(new URL("/admin-dashboard", request.url));
            }
        } else if (pathname.startsWith("/technician-dashboard") && userRole !== "TECHNICIAN") {
            if (userRole === "CUSTOMER") {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            } else if (userRole === "ADMIN") {
                return NextResponse.redirect(new URL("/admin-dashboard", request.url));
            }
        } else if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
            if (userRole === "CUSTOMER") {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            } else if (userRole === "TECHNICIAN") {
                return NextResponse.redirect(new URL("/technician-dashboard", request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"
    ],
};
