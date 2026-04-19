export interface SavedItem {
  id: string;
  url: string;
  title: string;
  favicon_url?: string;
  savedAt: number;
}

const STORAGE_KEY = "saved";

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function readSaved(): Promise<SavedItem[]> {
  const res = await chrome.storage.local.get(STORAGE_KEY);
  const arr = res[STORAGE_KEY];
  return Array.isArray(arr) ? arr : [];
}

async function writeSaved(list: SavedItem[]): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: list });
}

export async function addSaved(tab: chrome.tabs.Tab): Promise<{ ok: boolean; duplicate: boolean }> {
  const url = tab.url || tab.pendingUrl;
  if (!url) return { ok: false, duplicate: false };
  const list = await readSaved();
  if (list.some((s) => s.url === url)) {
    return { ok: true, duplicate: true };
  }
  const item: SavedItem = {
    id: uuid(),
    url,
    title: tab.title || url,
    favicon_url: tab.favIconUrl,
    savedAt: Date.now(),
  };
  try {
    await writeSaved([item, ...list]);
    return { ok: true, duplicate: false };
  } catch {
    return { ok: false, duplicate: false };
  }
}

export async function removeSaved(id: string): Promise<boolean> {
  const list = await readSaved();
  try {
    await writeSaved(list.filter((s) => s.id !== id));
    return true;
  } catch {
    return false;
  }
}

export async function clearSaved(): Promise<boolean> {
  try {
    await writeSaved([]);
    return true;
  } catch {
    return false;
  }
}

const EN_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function relativeTime(ts: number, now = Date.now(), lang: "zh" | "en" = "zh"): string {
  const diffMs = now - ts;
  const hourMs = 3600_000;
  const d = new Date(ts);
  const n = new Date(now);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const sameDay = d.toDateString() === n.toDateString();
  const yest = new Date(n);
  yest.setDate(n.getDate() - 1);
  const isYesterday = yest.toDateString() === d.toDateString();

  if (lang === "en") {
    if (diffMs < hourMs) return "just now";
    if (sameDay) return `today ${hh}:${mm}`;
    if (isYesterday) return "yesterday";
    if (d.getFullYear() === n.getFullYear()) {
      return `${EN_MONTHS[d.getMonth()]} ${d.getDate()}`;
    }
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${y}-${mo}-${da}`;
  }

  if (diffMs < hourMs) return "刚刚";
  if (sameDay) return `今天 ${hh}:${mm}`;
  if (isYesterday) return "昨天";
  if (d.getFullYear() === n.getFullYear()) {
    return `${d.getMonth() + 1} 月 ${d.getDate()} 日`;
  }
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${da}`;
}
