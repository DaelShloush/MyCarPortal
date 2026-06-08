"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star, Share2, FileDown, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleFavoriteAction } from "@/app/actions/favorites";
import { addVehicleAction } from "@/app/actions/vehicle";

interface SearchActionsProps {
  plate: string;
  initialIsFavorite: boolean;
  summary: {
    manufacturer: string;
    model: string;
    year: number;
  };
  vehicleData: {
    plate: string;
    manufacturer: string;
    model: string;
    year: number;
    color: string;
    fuelType: string;
    ownerCount: number;
    lastTestDate: string | null;
    testExpiryDate: string | null;
    kmAtLastTest: number | null;
    structuralChange: boolean;
    colorChanged: boolean;
    firstRegistrationDate: string | null;
    hasOpenRecalls: boolean;
  };
}

export function SearchActions({
  plate,
  initialIsFavorite,
  summary,
  vehicleData,
}: SearchActionsProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [added, setAdded] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleFavorite() {
    startTransition(async () => {
      const res = await toggleFavoriteAction(plate, summary);
      if (res.ok) {
        setIsFavorite((prev) => !prev);
        showToast(res.message);
      } else {
        showToast(res.message);
        if (res.needAuth) router.push("/login");
      }
    });
  }

  function handleAddVehicle() {
    startTransition(async () => {
      const res = await addVehicleAction(vehicleData);
      if (res.ok) {
        setAdded(true);
        showToast(res.message);
      } else {
        showToast(res.message);
        if (res.needAuth) router.push("/login");
      }
    });
  }

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = `${summary.manufacturer} ${summary.model} ${summary.year} — MyCarPortal`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* המשתמש ביטל */
      }
    } else {
      await navigator.clipboard.writeText(url);
      showToast("הקישור הועתק ללוח 📋");
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 no-print">
        <Button
          variant={isFavorite ? "primary" : "outline"}
          size="sm"
          onClick={handleFavorite}
          disabled={pending}
        >
          <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
          {isFavorite ? "במועדפים" : "מועדפים"}
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 size={16} /> שתף
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
        >
          <FileDown size={16} /> הורד PDF
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleAddVehicle}
          disabled={pending || added}
        >
          {added ? <Check size={16} /> : <Plus size={16} />}
          {added ? "נוסף" : "הוסף לרכבים"}
        </Button>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--color-gray-900)] text-white text-sm px-4 py-2.5 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}
    </>
  );
}
