"use client";

import { useEffect } from "react";

// רושם את ה-Service Worker (PWA) — רק בפרודקשן, אחרי טעינת הדף.
export function PwaRegister() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }
    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* רישום נכשל — מתעלמים בשקט */
      });
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
