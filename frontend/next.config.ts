import type { NextConfig } from "next";

// Content-Security-Policy סביר לפרויקט:
// - 'unsafe-inline' נדרש ל-Next (סקריפט hydration), ל-JSON-LD ול-Tailwind
// - 'unsafe-eval' נשמר לתאימות; להקשחה בפרודקשן ניתן לעבור ל-nonces
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  // upload.wikimedia.org — תמונות דגם אמיתיות מוויקיפדיה (car-image-wiki.ts)
  "img-src 'self' data: blob: https://cdn.imagin.studio https://vl.imgix.net https://*.supabase.co https://upload.wikimedia.org",
  "font-src 'self' data:",
  "connect-src 'self' https://data.gov.il https://*.supabase.co wss://*.supabase.co https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
