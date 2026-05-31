// מחולל טקסט מודעת מכירה אוטומטי מנתוני הרכב (ללא AI — תבנית חכמה, חינמי).

export interface AdInput {
  manufacturer: string;
  model: string;
  year: number | null;
  color?: string | null;
  fuelType?: string | null;
  ownerCount?: number | null;
  km?: number | null;
  testExpiry?: string | null; // ISO או DD/MM/YYYY
  structuralChange?: boolean | null;
  hasOpenRecalls?: boolean | null;
  askingPrice?: number | null;
  notes?: string;
}

function formatDate(d: string | null | undefined): string | null {
  if (!d) return null;
  const iso = d.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[2]}/${iso[1]}`;
  return d;
}

const yadWords: Record<number, string> = {
  1: "ראשונה",
  2: "שנייה",
  3: "שלישית",
  4: "רביעית",
};

export function generateSaleAd(input: AdInput): string {
  const title = `${input.manufacturer} ${input.model}${input.year ? ` ${input.year}` : ""}`.trim();

  const lines: string[] = [];
  lines.push(`🚗 למכירה: ${title}`);
  lines.push("");

  // שורת מאפיינים עיקריים
  const specs: string[] = [];
  if (input.ownerCount && input.ownerCount > 0) {
    specs.push(`יד ${yadWords[input.ownerCount] ?? input.ownerCount}`);
  }
  if (input.km && input.km > 0) specs.push(`${input.km.toLocaleString()} ק״מ`);
  if (input.fuelType) specs.push(input.fuelType);
  if (input.color) specs.push(input.color);
  if (specs.length) lines.push(`✦ ${specs.join(" | ")}`);

  // נקודות מכירה אוטומטיות
  const age = input.year ? new Date().getFullYear() - input.year : null;
  const kmPerYear = input.km && age && age > 0 ? input.km / age : null;

  if (kmPerYear && kmPerYear < 12000) {
    lines.push("✦ קילומטראז׳ נמוך יחסית לשנתון 👍");
  }
  if (input.ownerCount === 1) {
    lines.push("✦ יד ראשונה מהיבואן");
  }
  const testFmt = formatDate(input.testExpiry);
  if (testFmt) lines.push(`✦ טסט בתוקף עד ${testFmt}`);
  if (input.structuralChange === false) lines.push("✦ ללא שינויי מבנה");
  if (input.hasOpenRecalls === false) lines.push("✦ ללא ריקולים פתוחים");

  // מחיר
  if (input.askingPrice && input.askingPrice > 0) {
    lines.push("");
    lines.push(`💰 מחיר מבוקש: ₪${input.askingPrice.toLocaleString()}`);
  }

  // הערות חופשיות
  if (input.notes?.trim()) {
    lines.push("");
    lines.push(input.notes.trim());
  }

  // סיום
  lines.push("");
  lines.push("📞 לפרטים ותיאום בדיקה — צרו קשר.");
  lines.push("✅ נתוני הרכב נבדקו ב-MyCarPortal (היסטוריית בעלויות, טסט, ריקולים ודירוג סיכון).");

  return lines.join("\n");
}
