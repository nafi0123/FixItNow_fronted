import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

const REDIRECT_IF_AUTHENTICATED_ROUTES = ["/", "/login", "/register"];

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

    const isRedirectIfAuthRoute = REDIRECT_IF_AUTHENTICATED_ROUTES.some(
        (route) => pathname === route
    );

    // 1. User has token and accesses /, /login, or /register -> Auto redirect to their role dashboard
    if (accessToken && isRedirectIfAuthRoute) {
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

    // 2. Protected dashboard routes: unauthenticated users redirect to login
    const isProtectedRoute = pathname.startsWith("/dashboard") || 
                             pathname.startsWith("/admin-dashboard") || 
                             pathname.startsWith("/technician-dashboard");

    if (!accessToken && isProtectedRoute) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 3. Role-based access control for protected routes
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
