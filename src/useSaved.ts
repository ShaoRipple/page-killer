import { useEffect, useState } from "react";
import { readSaved, type SavedItem } from "./saved";

export function useSaved(): { loading: boolean; saved: SavedItem[] } {
  const [state, setState] = useState<{ loading: boolean; saved: SavedItem[] }>({
    loading: true,
    saved: [],
  });

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      const saved = await readSaved();
      if (!cancelled) setState({ loading: false, saved });
    };
    refresh();

    const listener = (
      changes: { [key: string]: chrome.storage.StorageChange },
      area: chrome.storage.AreaName,
    ) => {
      if (area === "local" && "saved" in changes) refresh();
    };
    chrome.storage.onChanged.addListener(listener);

    return () => {
      cancelled = true;
      chrome.storage.onChanged.removeListener(listener);
    };
  }, []);

  return state;
}
