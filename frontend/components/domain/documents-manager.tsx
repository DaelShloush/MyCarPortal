"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Upload, Trash2, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface DocItem {
  id: string;
  type: string;
  name: string;
  file_path: string;
  file_size: number | null;
  uploaded_at: string;
}

interface Props {
  vehicleId: string;
  userId: string;
  initialDocs: DocItem[];
  maxDocs: number;
}

const TYPES = [
  { value: "license", label: "רישיון רכב" },
  { value: "insurance", label: "ביטוח" },
  { value: "test", label: "טסט" },
  { value: "receipt", label: "קבלה" },
  { value: "other", label: "אחר" },
];

const TYPE_LABEL: Record<string, string> = Object.fromEntries(
  TYPES.map((t) => [t.value, t.label])
);

export function DocumentsManager({ vehicleId, userId, initialDocs, maxDocs }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [docType, setDocType] = useState("license");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const atLimit = initialDocs.length >= maxDocs;

  async function handleUpload(file: File) {
    setError(null);
    if (file.size > 10 * 1024 * 1024) {
      setError("הקובץ גדול מדי (מקסימום 10MB)");
      return;
    }
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${userId}/${vehicleId}/${crypto.randomUUID()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("documents")
        .upload(path, file, { contentType: file.type });
      if (upErr) throw upErr;

      const { error: dbErr } = await supabase.from("documents").insert({
        vehicle_id: vehicleId,
        type: docType,
        name: file.name,
        file_path: path,
        file_size: file.size,
      });
      if (dbErr) throw dbErr;

      router.refresh();
    } catch {
      setError("שגיאה בהעלאת הקובץ. נסה שוב.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleView(doc: DocItem) {
    const { data } = await supabase.storage
      .from("documents")
      .createSignedUrl(doc.file_path, 120);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener");
  }

  async function handleDelete(doc: DocItem) {
    if (!confirm(`למחוק את "${doc.name}"?`)) return;
    setBusy(true);
    try {
      await supabase.storage.from("documents").remove([doc.file_path]);
      await supabase.from("documents").delete().eq("id", doc.id);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4 -mt-1">
        <span className="text-sm text-[var(--color-text-subtle)]">
          {initialDocs.length} / {maxDocs} מסמכים
        </span>
        <div className="flex items-center gap-2">
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            disabled={busy || atLimit}
            className="h-9 rounded-lg border border-[var(--color-border)] px-2 text-sm bg-white"
            aria-label="סוג מסמך"
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
            }}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileRef.current?.click()}
            disabled={busy || atLimit}
            title={atLimit ? "הגעת למגבלת המסמכים" : undefined}
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {busy ? "מעלה..." : "העלה"}
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-[var(--color-danger)] mb-3">{error}</p>
      )}
      {atLimit && (
        <p className="text-xs text-[var(--color-text-subtle)] mb-3">
          הגעת למגבלת {maxDocs} מסמכים. שדרג ל-Premium לאחסון ללא הגבלה.
        </p>
      )}

      {initialDocs.length === 0 ? (
        <p className="text-sm text-[var(--color-text-subtle)] py-4 text-center">
          עוד לא הועלו מסמכים לרכב זה
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {initialDocs.map((d) => (
            <li
              key={d.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg-subtle)]"
            >
              <FileText size={20} className="text-[var(--color-primary-500)] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{d.name}</p>
                <p className="text-xs text-[var(--color-text-subtle)]">
                  {TYPE_LABEL[d.type] ?? "אחר"}
                  {d.file_size ? ` · ${(d.file_size / 1024).toFixed(0)} KB` : ""}
                </p>
              </div>
              <button
                onClick={() => handleView(d)}
                aria-label="הצג"
                className="w-8 h-8 grid place-items-center rounded-lg hover:bg-[var(--color-gray-100)] text-[var(--color-text-subtle)]"
              >
                <Eye size={16} />
              </button>
              <button
                onClick={() => handleDelete(d)}
                disabled={busy}
                aria-label="מחק"
                className="w-8 h-8 grid place-items-center rounded-lg hover:bg-red-50 text-[var(--color-danger)]"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
