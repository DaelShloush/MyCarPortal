// ניהול היסטוריית חיפושים לאורחים (לא מחוברים) דרך localStorage
// משתמשים מחוברים נשמרים ב-Supabase

export interface GuestHistoryItem {
  plate: string;
  manufacturer: string;
  model: string;
  year: number;
  searchedAt: string; // ISO
}

const KEY = "mcp_guest_search_history";
const MAX_ITEMS = 20;
const CHANGE_EVENT = "mcp-guest-history-change";

// ===== useSyncExternalStore support =====
const EMPTY: GuestHistoryItem[] = [];
let cachedRaw: string | null = null;
let cachedList: GuestHistoryItem[] = EMPTY;

// snapshot יציב — מחזיר אותה הפניה כל עוד ה-localStorage לא השתנה
export function getGuestHistorySnapshot(): GuestHistoryItem[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = localStorage.getItem(KEY) ?? "";
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedList = getGuestHistory();
  }
  return cachedList;
}

export function getGuestHistoryServerSnapshot(): GuestHistoryItem[] {
  return EMPTY;
}

export function subscribeGuestHistory(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", cb);
  window.addEventListener(CHANGE_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(CHANGE_EVENT, cb);
  };
}

function notifyChange(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CHANGE_EVENT));
}

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
    notifyChange();
  } catch {
    /* localStorage מלא / חסום — מתעלמים */
  }
}

export function clearGuestHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
    notifyChange();
  } catch {
    /* ignore */
  }
}
