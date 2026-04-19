import { useEffect, useState } from "react";

export interface Quote {
  id: string;
  text: string;
  author: string;
  source: string;
}

interface QuoteState {
  unshown: string[];
  shown: string[];
  last_shown_date: string;
  current_quote_id: string;
  version?: string;
}

const KEY = "quote_state";
const QUOTES_VERSION = "2026-04-19-philosophical-50";

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function validate(q: unknown): q is Quote {
  if (!q || typeof q !== "object") return false;
  const r = q as Partial<Quote>;
  return (
    typeof r.id === "string" &&
    typeof r.text === "string" &&
    typeof r.author === "string" &&
    typeof r.source === "string" &&
    r.text.length > 0
  );
}

async function loadAll(): Promise<Quote[]> {
  const url = chrome.runtime.getURL("data/quotes.json");
  const res = await fetch(url);
  const raw = await res.json();
  if (!Array.isArray(raw)) return [];
  return raw.filter(validate);
}

async function pickCurrent(all: Quote[]): Promise<Quote | null> {
  if (all.length === 0) return null;
  const ids = all.map((q) => q.id);
  let state: QuoteState | undefined;
  try {
    const res = await chrome.storage.local.get(KEY);
    state = res[KEY];
  } catch {
    // 回退：按日期取模
    const idx = new Date().getDate() % all.length;
    return all[idx];
  }

  const today = todayKey();
  const versionMatch = state?.version === QUOTES_VERSION;
  if (state && versionMatch && state.last_shown_date === today) {
    const found = all.find((q) => q.id === state!.current_quote_id);
    if (found) return found;
  }

  let unshown = versionMatch ? state?.unshown?.filter((id) => ids.includes(id)) ?? [] : [];
  let shown = versionMatch ? state?.shown?.filter((id) => ids.includes(id)) ?? [] : [];
  if (unshown.length === 0) {
    unshown = [...ids];
    shown = [];
  }
  // 首次加载（或金句库版本更新后首次加载）展示最长金句，方便验证排版
  const firstTime = !state || !versionMatch;
  const longestId = all.reduce((a, b) => (b.text.length > a.text.length ? b : a)).id;
  const pickPool = firstTime && unshown.includes(longestId) ? [longestId] : unshown;
  const idx = Math.floor(Math.random() * pickPool.length);
  const picked = pickPool[idx];
  const newUnshown = unshown.filter((_, i) => i !== idx);
  const newShown = [...shown, picked];
  try {
    await chrome.storage.local.set({
      [KEY]: {
        unshown: newUnshown,
        shown: newShown,
        last_shown_date: today,
        current_quote_id: picked,
        version: QUOTES_VERSION,
      } satisfies QuoteState,
    });
  } catch {
    // 回退
  }
  return all.find((q) => q.id === picked) || all[0];
}

export function useQuote(enabled: boolean): Quote | null {
  const [quote, setQuote] = useState<Quote | null>(null);
  useEffect(() => {
    if (!enabled) {
      setQuote(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const all = await loadAll();
        const picked = await pickCurrent(all);
        if (!cancelled) setQuote(picked);
      } catch {
        // 静默
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled]);
  return quote;
}
