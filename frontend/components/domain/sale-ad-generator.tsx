"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateSaleAd, type AdInput } from "@/lib/ad-generator";

type BaseData = Omit<AdInput, "askingPrice" | "notes">;

interface Props {
  base: BaseData;
}

export function SaleAdGenerator({ base }: Props) {
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [ad, setAd] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function generate() {
    const text = generateSaleAd({
      ...base,
      askingPrice: price ? parseInt(price, 10) : null,
      notes,
    });
    setAd(text);
    setCopied(false);
  }

  async function copy() {
    if (!ad) return;
    await navigator.clipboard.writeText(ad);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function share() {
    if (!ad) return;
    if (navigator.share) {
      try {
        await navigator.share({ text: ad });
      } catch {
        /* בוטל */
      }
    } else {
      copy();
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--color-text-subtle)]">
        צור טקסט מודעה מוכן להעתקה ליד2 / פייסבוק, מבוסס על נתוני הרכב.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium block mb-1.5">מחיר מבוקש (₪)</label>
          <Input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="למשל: 65000"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">הערות (אופציונלי)</label>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="למשל: טופל תמיד במוסך מורשה"
          />
        </div>
      </div>

      <Button onClick={generate}>
        <Sparkles size={16} />
        {ad ? "צור מחדש" : "צור מודעה"}
      </Button>

      {ad && (
        <div className="space-y-2">
          <textarea
            value={ad}
            onChange={(e) => setAd(e.target.value)}
            rows={12}
            dir="rtl"
            className="w-full rounded-lg border border-[var(--color-border)] p-3 text-sm leading-relaxed bg-[var(--color-bg-subtle)] focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20"
          />
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={copy}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "הועתק!" : "העתק מודעה"}
            </Button>
            <Button variant="outline" size="sm" onClick={share}>
              <Share2 size={16} /> שתף
            </Button>
          </div>
          <p className="text-xs text-[var(--color-text-subtle)]">
            אפשר לערוך את הטקסט ישירות לפני ההעתקה.
          </p>
        </div>
      )}
    </div>
  );
}
