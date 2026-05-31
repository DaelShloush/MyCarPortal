import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MyCarPortal — בדיקת רכב בישראל",
    short_name: "MyCarPortal",
    description:
      "בדיקת היסטוריית רכב, דירוג סיכון וניהול רכב אישי — מבוסס נתוני משרד התחבורה.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#2c3e50",
    lang: "he",
    dir: "rtl",
    categories: ["utilities", "productivity", "automotive"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
