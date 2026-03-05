import { NextResponse, type NextRequest } from "next/server";
import { isOriginAllowed } from "@/lib/cors";

export function middleware(request: NextRequest) {
    const origin = request.headers.get("origin");
    const isAllowed = isOriginAllowed(origin);

    // Se for uma rota de API
    if (request.nextUrl.pathname.startsWith("/api/")) {
        if (request.method === "OPTIONS") {
            const response = new NextResponse(null, { status: 204 });
            if (origin && isAllowed) {
                response.headers.set("Access-Control-Allow-Origin", origin);
            }
            response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
            response.headers.set("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");
            response.headers.set("Access-Control-Allow-Credentials", "true");
            return response;
        }

        const response = NextResponse.next();
        if (origin && isAllowed) {
            response.headers.set("Access-Control-Allow-Origin", origin);
            response.headers.set("Access-Control-Allow-Credentials", "true");
        }
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/api/:path*",
};
