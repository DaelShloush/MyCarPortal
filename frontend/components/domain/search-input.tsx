"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { validatePlate } from "@/lib/validators";
import { PlateScanButton, OCR_ENABLED } from "./plate-scan-button";

interface SearchInputProps {
  size?: "md" | "lg";
  className?: string;
}

export function SearchInput({ size = "lg", className }: SearchInputProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const result = validatePlate(value);
    if (!result.valid) {
      setError(result.error ?? "מספר רישוי לא תקין");
      return;
    }
    setError(null);
    router.push(`/search/${result.cleaned}`);
  }

  // זוהתה לוחית מתמונה — ממלא את השדה ומחפש אוטומטית
  function onPlateDetected(plate: string) {
    setValue(plate);
    setError(null);
    const result = validatePlate(plate);
    if (result.valid) router.push(`/search/${result.cleaned}`);
  }

  const heightClass = size === "lg" ? "h-14" : "h-12";

  return (
    <div className={cn("w-full", className)}>
      <form
        onSubmit={onSubmit}
        className={cn(
          "flex items-center gap-2 bg-white border-2 rounded-2xl shadow-[var(--shadow-sm)] px-3 transition-all duration-150 focus-within:shadow-[var(--shadow-md)]",
          error
            ? "border-[var(--color-danger)] focus-within:border-[var(--color-danger)]"
            : "border-[var(--color-border)] focus-within:border-[var(--color-primary-500)]",
          heightClass
        )}
      >
        <Search size={20} className="text-[var(--color-gray-400)] shrink-0" />
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          placeholder="הזן מספר רישוי..."
          aria-label="מספר רישוי"
          aria-invalid={!!error}
          className="plate-text flex-1 bg-transparent border-0 outline-none text-base text-[var(--color-gray-900)] placeholder:text-[var(--color-gray-400)]"
        />
        {OCR_ENABLED && (
          <>
            <PlateScanButton onDetected={onPlateDetected} onError={setError} />
            <span className="w-px h-6 bg-[var(--color-border)]" aria-hidden="true" />
          </>
        )}
        <button
          type="submit"
          className={cn(
            "px-5 rounded-xl bg-[var(--color-primary-700)] text-white font-bold text-sm hover:bg-[var(--color-primary-800)] active:scale-95 transition-all",
            size === "lg" ? "h-11" : "h-9"
          )}
        >
          חפש
        </button>
      </form>
      {error && (
        <p className="text-xs text-[var(--color-danger)] mt-1.5 ps-2" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
