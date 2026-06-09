import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PwaRegister } from "@/components/pwa-register";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://frontend-mycarportal.vercel.app"
  ),
  title: "MyCarPortal — בדוק כל רכב בישראל תוך שניות",
  description:
    "פלטפורמה ישראלית לחיפוש ובדיקת רכבים פרטיים — היסטוריית בעלויות, טסט, ריקולים, הערכת שווי וניהול הרכב האישי שלך.",
  applicationName: "MyCarPortal",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MyCarPortal",
  },
};

export const viewport: Viewport = {
  themeColor: "#2c3e50",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--color-bg)] text-[var(--color-text)] font-sans flex flex-col">
        {children}
        <PwaRegister />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
