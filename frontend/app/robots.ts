import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://frontend-mycarportal.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // עמודים אישיים/מוגנים — לא לאינדוקס
      disallow: ["/dashboard", "/favorites", "/settings", "/vehicle/"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
