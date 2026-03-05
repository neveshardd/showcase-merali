export const allowedOrigin = process.env.ALLOWED_ORIGIN || "https://erp.merali.com.br";

export const corsHeaders = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
    "Access-Control-Allow-Credentials": "true",
};

export function isOriginAllowed(origin: string | null): boolean {
    if (!origin) return false;
    if (origin === allowedOrigin) return true;

    const meraliRegex = /^https?:\/\/([a-z0-9-]+\.)*merali\.com\.br$/i;
    return meraliRegex.test(origin);
}
