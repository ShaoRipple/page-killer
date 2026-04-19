import { useEffect, useState } from "react";
import { defaultLang, type Lang } from "./i18n";

export interface Settings {
  language: Lang;
  takeoverNewTab: boolean;
  showQuote: boolean;
  cyberEffects: boolean;
  trashSound: boolean;
}

const KEY = "settings";

const defaults: Settings = {
  language: defaultLang,
  takeoverNewTab: true,
  showQuote: true,
  cyberEffects: true,
  trashSound: true,
};

export async function readSettings(): Promise<Settings> {
  try {
    const res = await chrome.storage.local.get(KEY);
    return { ...defaults, ...(res[KEY] || {}) };
  } catch {
    return defaults;
  }
}

export async function writeSettings(patch: Partial<Settings>): Promise<boolean> {
  try {
    const cur = await readSettings();
    await chrome.storage.local.set({ [KEY]: { ...cur, ...patch } });
    return true;
  } catch {
    return false;
  }
}

export function useSettings(): {
  settings: Settings;
  loading: boolean;
  update: (patch: Partial<Settings>) => Promise<boolean>;
} {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    readSettings().then((s) => {
      if (!cancelled) {
        setSettings(s);
        setLoading(false);
      }
    });

    const listener = (
      changes: { [key: string]: chrome.storage.StorageChange },
      area: chrome.storage.AreaName,
    ) => {
      if (area === "local" && KEY in changes) {
        readSettings().then((s) => {
          if (!cancelled) setSettings(s);
        });
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => {
      cancelled = true;
      chrome.storage.onChanged.removeListener(listener);
    };
  }, []);

  const update = async (patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
    return writeSettings(patch);
  };

  return { settings, loading, update };
}
