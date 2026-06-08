import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://frontend-mycarportal.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  // עמודים ציבוריים בלבד. /search/[plate] דינמי ואינסופי — לא נכלל.
  const routes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/compare", priority: 0.7 },
    { path: "/history", priority: 0.5 },
    { path: "/login", priority: 0.5 },
    { path: "/register", priority: 0.5 },
    { path: "/terms", priority: 0.3 },
    { path: "/privacy", priority: 0.3 },
  ];

  return routes.map((r) => ({
    url: `${BASE}${r.path}`,
    changeFrequency: "weekly" as const,
    priority: r.priority,
  }));
}
