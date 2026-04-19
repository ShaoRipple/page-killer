import { useEffect, useMemo, useRef, useState } from "react";
import {
  useBookmarks,
  countBookmarks,
  flatten,
  type BmNode,
  type FlatBm,
} from "../useBookmarks";
import { tr, type Lang } from "../i18n";
import { hostnameOf, colorFor, letterFor } from "../domain";

const MAX_FLAT_RESULTS = 500;

function openBookmark(url: string) {
  chrome.tabs.create({ url });
}

function BmFavicon({ url }: { url: string }) {
  const [failed, setFailed] = useState(false);
  const host = hostnameOf(url) || url;
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=32`;
  if (failed) {
    return (
      <div
        className="card__logo-fallback"
        style={{
          background: colorFor(host),
          width: 16,
          height: 16,
          fontSize: 9,
        }}
      >
        {letterFor(host)}
      </div>
    );
  }
  return (
    <img
      className="tab-item__favicon"
      src={faviconUrl}
      alt=""
      onError={() => setFailed(true)}
    />
  );
}

function BookmarkItem({ node }: { node: BmNode }) {
  if (!node.url) return null;
  return (
    <li
      className="bm-item"
      onClick={(e) => {
        e.stopPropagation();
        openBookmark(node.url!);
      }}
    >
      <BmFavicon url={node.url} />
      <span className="bm-item__title" title={node.url}>
        {node.title || node.url}
      </span>
    </li>
  );
}

function Folder({ node, depth }: { node: BmNode; depth: number }) {
  const [open, setOpen] = useState(false);
  const children = node.children || [];
  return (
    <>
      <li
        className="bm-folder"
        style={{ paddingLeft: depth * 16 + 8 }}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="bm-folder__icon">{open ? "📂" : "📁"}</span>
        <span className="bm-folder__title">{node.title || "(未命名文件夹)"}</span>
      </li>
      {open && (
        <>
          {children.map((c) =>
            c.url ? (
              <li
                key={c.id}
                className="bm-item"
                style={{ paddingLeft: (depth + 1) * 16 + 8 }}
                onClick={(e) => {
                  e.stopPropagation();
                  openBookmark(c.url!);
                }}
              >
                <BmFavicon url={c.url} />
                <span className="bm-item__title" title={c.url}>
                  {c.title || c.url}
                </span>
              </li>
            ) : (
              <Folder key={c.id} node={c} depth={depth + 1} />
            ),
          )}
        </>
      )}
    </>
  );
}

function Highlight({ text, kw }: { text: string; kw: string }) {
  if (!kw) return <>{text}</>;
  const lower = text.toLowerCase();
  const lk = kw.toLowerCase();
  const idx = lower.indexOf(lk);
  if (idx < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bm-hl">{text.slice(idx, idx + kw.length)}</mark>
      {text.slice(idx + kw.length)}
    </>
  );
}

export function BookmarkDrawer({ lang }: { lang: Lang }) {
  const { loading, roots, error } = useBookmarks();
  const [hovered, setHovered] = useState(false);
  const [raw, setRaw] = useState("");
  const [debounced, setDebounced] = useState("");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    setHovered(true);
  };
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setHovered(false), 180);
  };

  // 防抖
  useMemoDebounce(raw, setDebounced, 200);

  const total = useMemo(() => countBookmarks(roots), [roots]);

  const searchHits: FlatBm[] | null = useMemo(() => {
    const kw = debounced.trim().toLowerCase();
    if (!kw) return null;
    const flat = flatten(roots);
    return flat
      .filter(
        (b) =>
          b.title.toLowerCase().includes(kw) || b.url.toLowerCase().includes(kw),
      )
      .slice(0, MAX_FLAT_RESULTS);
  }, [debounced, roots]);

  return (
    <div
      className={`drawer${hovered ? " drawer--open" : ""}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="drawer__rail" aria-hidden={hovered}>
        📚
      </div>
      <aside className="drawer__panel">
        <header className="drawer__head">
          <h2 className="drawer__title">📚 {tr("bookmarks", lang)}</h2>
          <div className="drawer__count">
            {lang === "en" ? `${total} bookmarks` : `${total} 个书签`}
          </div>
        </header>

        <div className="drawer__search">
          <input
            type="text"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder={tr("search_bookmarks", lang)}
          />
          {raw && (
            <button
              type="button"
              className="drawer__search-clear"
              aria-label="清空搜索"
              onClick={() => {
                setRaw("");
                setDebounced("");
              }}
            >
              ×
            </button>
          )}
        </div>

        <div className="drawer__body">
          {loading ? null : error ? (
            <div className="drawer__empty">{tr("empty_bookmarks", lang)}</div>
          ) : total === 0 ? (
            <div className="drawer__empty">{tr("empty_bookmarks", lang)}</div>
          ) : searchHits ? (
            searchHits.length === 0 ? (
              <div className="drawer__empty">{tr("no_match", lang)}</div>
            ) : (
              <ul className="bm-list">
                {searchHits.map((b) => (
                  <li
                    key={b.id}
                    className="bm-item"
                    onClick={() => openBookmark(b.url)}
                  >
                    <BmFavicon url={b.url} />
                    <span className="bm-item__title" title={b.url}>
                      <Highlight text={b.title || b.url} kw={debounced} />
                    </span>
                  </li>
                ))}
                {searchHits.length === MAX_FLAT_RESULTS && (
                  <li className="bm-more">
                    {lang === "en"
                      ? "More results — refine your keyword."
                      : "还有更多，请输入更精确的关键字"}
                  </li>
                )}
              </ul>
            )
          ) : (
            <ul className="bm-list">
              {roots.map((n) =>
                n.url ? (
                  <BookmarkItem key={n.id} node={n} />
                ) : (
                  <Folder key={n.id} node={n} depth={0} />
                ),
              )}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}

function useMemoDebounce<T>(value: T, setOut: (v: T) => void, delay: number) {
  useEffect(() => {
    const id = setTimeout(() => setOut(value), delay);
    return () => clearTimeout(id);
  }, [value, delay, setOut]);
}
