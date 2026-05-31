// ניהול היסטוריית חיפושים לאורחים (לא מחוברים) דרך localStorage
// משתמשים מחוברים נשמרים ב-Supabase

export interface GuestHistoryItem {
  plate: string;
  manufacturer: string;
  model: string;
  year: number;
  riskScore: number;
  riskTone: string;
  searchedAt: string; // ISO
}

const KEY = "mcp_guest_search_history";
const MAX_ITEMS = 20;

export function getGuestHistory(): GuestHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as GuestHistoryItem[]) : [];
  } catch {
    return [];
  }
}

export function addGuestHistory(item: GuestHistoryItem): void {
  if (typeof window === "undefined") return;
  try {
    const list = getGuestHistory().filter((i) => i.plate !== item.plate);
    list.unshift(item);
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX_ITEMS)));
  } catch {
    /* localStorage מלא / חסום — מתעלמים */
  }
}

export function clearGuestHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
