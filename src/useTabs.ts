import { useEffect, useState } from "react";
import { groupTabs, isOwnNewTab, type TabGroup } from "./domain";
import { addSaved } from "./saved";

export interface TabsState {
  loading: boolean;
  groups: TabGroup[];
  totalTabs: number;
  killerTabIds: number[];
  selfTabId: number | null;
}

async function queryAll(): Promise<chrome.tabs.Tab[]> {
  return chrome.tabs.query({});
}

export function useTabs(): TabsState {
  const [state, setState] = useState<TabsState>({
    loading: true,
    groups: [],
    totalTabs: 0,
    killerTabIds: [],
    selfTabId: null,
  });

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      const [all, self] = await Promise.all([queryAll(), currentTabId()]);
      if (cancelled) return;
      const groups = groupTabs(all);
      const totalTabs = groups.reduce((acc, g) => acc + g.tabs.length, 0);
      const killerTabIds = all
        .filter(isOwnNewTab)
        .map((t) => t.id)
        .filter((id): id is number => id != null);
      if (cancelled) return;
      setState({
        loading: false,
        groups,
        totalTabs,
        killerTabIds,
        selfTabId: self ?? null,
      });
    };

    refresh();

    const events: Array<keyof typeof chrome.tabs> = [
      "onCreated",
      "onRemoved",
      "onUpdated",
      "onMoved",
      "onAttached",
      "onDetached",
      "onReplaced",
    ];
    const listener = () => {
      refresh();
    };
    for (const e of events) {
      (chrome.tabs[e] as chrome.events.Event<() => void>).addListener(listener);
    }

    return () => {
      cancelled = true;
      for (const e of events) {
        (chrome.tabs[e] as chrome.events.Event<() => void>).removeListener(listener);
      }
    };
  }, []);

  return state;
}

export async function activateTab(tab: chrome.tabs.Tab) {
  if (tab.id == null) return;
  await chrome.tabs.update(tab.id, { active: true });
  if (tab.windowId != null) {
    await chrome.windows.update(tab.windowId, { focused: true });
  }
}

async function currentTabId(): Promise<number | undefined> {
  try {
    const cur = await chrome.tabs.getCurrent();
    return cur?.id;
  } catch {
    return undefined;
  }
}

export async function closeTab(tabId: number) {
  const selfId = await currentTabId();
  if (selfId === tabId) return;
  try {
    await chrome.tabs.remove(tabId);
  } catch {
    // tab 可能已被外部关闭，忽略
  }
}

export async function saveTab(
  tab: chrome.tabs.Tab,
): Promise<{ ok: boolean; duplicate: boolean }> {
  const result = await addSaved(tab);
  if (result.ok && tab.id != null) {
    await closeTab(tab.id);
  }
  return result;
}

export async function closeTabs(tabIds: number[]) {
  const selfId = await currentTabId();
  const safe = selfId == null ? tabIds : tabIds.filter((id) => id !== selfId);
  if (safe.length === 0) return;
  try {
    await chrome.tabs.remove(safe);
  } catch {
    // 忽略，下一次 query 会自动修正
  }
}
