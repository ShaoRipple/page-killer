import { useEffect, useState } from "react";

export interface BmNode {
  id: string;
  title: string;
  url?: string;
  children?: BmNode[];
}

export interface FlatBm {
  id: string;
  title: string;
  url: string;
}

function normalize(node: chrome.bookmarks.BookmarkTreeNode): BmNode {
  return {
    id: node.id,
    title: node.title,
    url: node.url,
    children: node.children?.map(normalize),
  };
}

export function countBookmarks(nodes: BmNode[]): number {
  let n = 0;
  const walk = (list: BmNode[]) => {
    for (const it of list) {
      if (it.url) n++;
      if (it.children) walk(it.children);
    }
  };
  walk(nodes);
  return n;
}

export function flatten(nodes: BmNode[]): FlatBm[] {
  const out: FlatBm[] = [];
  const walk = (list: BmNode[]) => {
    for (const it of list) {
      if (it.url) out.push({ id: it.id, title: it.title, url: it.url });
      if (it.children) walk(it.children);
    }
  };
  walk(nodes);
  return out;
}

export function useBookmarks(): { loading: boolean; roots: BmNode[]; error: boolean } {
  const [state, setState] = useState<{ loading: boolean; roots: BmNode[]; error: boolean }>({
    loading: true,
    roots: [],
    error: false,
  });

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      try {
        const tree = await chrome.bookmarks.getTree();
        if (cancelled) return;
        const userRoots: BmNode[] = [];
        for (const r of tree) {
          for (const sys of r.children || []) {
            for (const c of sys.children || []) {
              userRoots.push(normalize(c));
            }
          }
        }
        setState({ loading: false, roots: userRoots, error: false });
      } catch {
        if (!cancelled) setState({ loading: false, roots: [], error: true });
      }
    };
    refresh();

    const listener = () => refresh();
    try {
      chrome.bookmarks.onCreated.addListener(listener);
      chrome.bookmarks.onRemoved.addListener(listener);
      chrome.bookmarks.onChanged.addListener(listener);
      chrome.bookmarks.onMoved.addListener(listener);
    } catch {
      // 权限可能被撤销
    }

    return () => {
      cancelled = true;
      try {
        chrome.bookmarks.onCreated.removeListener(listener);
        chrome.bookmarks.onRemoved.removeListener(listener);
        chrome.bookmarks.onChanged.removeListener(listener);
        chrome.bookmarks.onMoved.removeListener(listener);
      } catch {
        // 忽略
      }
    };
  }, []);

  return state;
}
