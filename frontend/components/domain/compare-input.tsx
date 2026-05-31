"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Scale } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validatePlate } from "@/lib/validators";

interface Props {
  currentPlate: string;
}

export function CompareInput({ currentPlate }: Props) {
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
    if (result.cleaned === currentPlate) {
      setError("זה אותו רכב — הזן מספר רישוי אחר");
      return;
    }
    router.push(`/compare?plates=${currentPlate},${result.cleaned}`);
  }

  return (
    <div className="rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-4 no-print">
      <div className="flex items-center gap-2 mb-2">
        <Scale size={18} className="text-[var(--color-primary-600)]" />
        <h3 className="font-bold text-sm">השוואה לרכב אחר</h3>
      </div>
      <p className="text-xs text-[var(--color-text-subtle)] mb-3">
        הזן מספר רישוי של רכב נוסף כדי להשוות בין השניים זה לצד זה.
      </p>
      <form onSubmit={onSubmit} className="flex items-start gap-2">
        <div className="flex-1">
          <Input
            inputMode="numeric"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            placeholder="מספר רישוי לרכב להשוואה..."
            aria-label="מספר רישוי להשוואה"
            aria-invalid={!!error}
            className={error ? "border-[var(--color-danger)]" : ""}
          />
          {error && (
            <p className="text-xs text-[var(--color-danger)] mt-1" role="alert">
              {error}
            </p>
          )}
        </div>
        <Button type="submit">
          <Scale size={16} />
          השווה
        </Button>
      </form>
    </div>
  );
}
