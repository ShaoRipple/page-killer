import { useMemo, useRef, useState } from "react";
import { activateTab, closeTab, closeTabs } from "../useTabs";
import {
  friendlyName,
  hostDisplayName,
  normalizedUrl,
  type TabGroup,
} from "../domain";
import type { Lang } from "../i18n";
import { shouldDegrade, CardFirework, type FireworkOrigin } from "./CyberEffects";
import { playTrashSound } from "../sound";

const COLLAPSED_LIMIT = 5;

interface DedupedRow {
  tab: chrome.tabs.Tab;
  tabIds: number[];
  multiplicity: number;
}

function dedupTabs(tabs: chrome.tabs.Tab[]): DedupedRow[] {
  const seen = new Map<string, DedupedRow>();
  const rows: DedupedRow[] = [];
  for (const t of tabs) {
    const key = normalizedUrl(t);
    if (!key) {
      // 无法归一化的（非 http/chrome/file）独立成行
      rows.push({
        tab: t,
        tabIds: t.id != null ? [t.id] : [],
        multiplicity: 1,
      });
      continue;
    }
    const existing = seen.get(key);
    if (existing) {
      if (t.id != null) existing.tabIds.push(t.id);
      existing.multiplicity = existing.tabIds.length;
    } else {
      const row: DedupedRow = {
        tab: t,
        tabIds: t.id != null ? [t.id] : [],
        multiplicity: 1,
      };
      seen.set(key, row);
      rows.push(row);
    }
  }
  return rows;
}

interface FaviconProps {
  src: string | undefined;
  fallbackColor: string;
  fallbackLetter: string;
  variant?: "card" | "tab";
}

function Favicon({ src, fallbackColor, fallbackLetter, variant = "card" }: FaviconProps) {
  const [failed, setFailed] = useState(!src);
  const cls = variant === "card" ? "card__logo" : "tab-item__favicon";
  if (failed) {
    if (variant === "card") {
      return (
        <div className="card__logo-fallback" style={{ background: fallbackColor }}>
          {fallbackLetter}
        </div>
      );
    }
    return (
      <div
        className="card__logo-fallback"
        style={{ background: fallbackColor, width: 16, height: 16, fontSize: 9 }}
      >
        {fallbackLetter}
      </div>
    );
  }
  return <img className={cls} src={src} alt="" onError={() => setFailed(true)} />;
}

interface TabItemProps {
  row: DedupedRow;
  fallbackColor: string;
  fallbackLetter: string;
  onSave: (tab: chrome.tabs.Tab) => void;
  onClose?: (count: number) => void;
  trashSound: boolean;
  lang: Lang;
}

function TabItem({ row, fallbackColor, fallbackLetter, onSave, onClose, trashSound, lang }: TabItemProps) {
  const { tab, tabIds, multiplicity } = row;
  const title = tab.title || tab.url || (lang === "en" ? "(untitled)" : "(无标题)");
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    const count = tabIds.length > 1 ? tabIds.length : 1;
    if (trashSound) playTrashSound();
    if (tabIds.length > 1) {
      closeTabs(tabIds);
    } else if (tab.id != null) {
      closeTab(tab.id);
    }
    onClose?.(count);
  };
  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave(tab);
  };
  return (
    <li className="tab-item" onClick={() => activateTab(tab)}>
      <Favicon
        src={tab.favIconUrl}
        fallbackColor={fallbackColor}
        fallbackLetter={fallbackLetter}
        variant="tab"
      />
      <span className="tab-item__title" title={title}>
        {title}
        {multiplicity > 1 ? (
          <span className="tab-item__dup"> ({multiplicity}x)</span>
        ) : null}
      </span>
      <button
        type="button"
        className="tab-item__btn tab-item__save"
        aria-label={lang === "en" ? "Save for later" : "稍后再看"}
        title={lang === "en" ? "Save for later" : "稍后再看"}
        onClick={handleSave}
      >
        +
      </button>
      <button
        type="button"
        className="tab-item__btn tab-item__close"
        aria-label={lang === "en" ? "Close tab" : "关闭 tab"}
        onClick={handleClose}
      >
        ×
      </button>
    </li>
  );
}

interface DomainCardProps {
  group: TabGroup;
  onSave: (tab: chrome.tabs.Tab) => void;
  onClose?: (count: number) => void;
  cyberEnabled: boolean;
  trashSound: boolean;
  lang: Lang;
}

function DomainCard({ group, onSave, onClose, cyberEnabled, trashSound, lang }: DomainCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [shattering, setShattering] = useState(false);
  const [firework, setFirework] = useState<FireworkOrigin | null>(null);
  const cardRef = useRef<HTMLElement>(null);
  const rows = useMemo(() => dedupTabs(group.tabs), [group.tabs]);

  const visibleRows =
    expanded || rows.length <= COLLAPSED_LIMIT
      ? rows
      : rows.slice(0, COLLAPSED_LIMIT);
  const hidden = rows.length - visibleRows.length;

  const handleCloseAll = () => {
    const ids = group.tabs.map((t) => t.id).filter((id): id is number => id != null);
    if (!ids.length) return;
    if (trashSound) playTrashSound();
    const rect = cardRef.current?.getBoundingClientRect();
    const origin: FireworkOrigin | null = rect
      ? {
          x: Math.round(rect.left + rect.width / 2),
          y: Math.round(rect.top + rect.height / 2),
        }
      : null;
    if (shouldDegrade(cyberEnabled)) {
      closeTabs(ids);
      onClose?.(ids.length);
      return;
    }
    if (origin) setFirework(origin);
    setShattering(true);
    setTimeout(() => {
      closeTabs(ids);
      onClose?.(ids.length);
    }, 420);
  };

  const handleCloseDuplicates = () => {
    const dupIds = rows
      .filter((r) => r.multiplicity > 1)
      .flatMap((r) => r.tabIds.slice(1));
    if (!dupIds.length) return;
    if (trashSound) playTrashSound();
    closeTabs(dupIds);
    onClose?.(dupIds.length);
  };

  // 计算重复的额外数量
  const dupExtraCount = rows
    .filter((r) => r.multiplicity > 1)
    .reduce((sum, r) => sum + r.multiplicity - 1, 0);
  const hasDups = dupExtraCount > 0;

  const friendly = friendlyName(group.hostname, group.hostname);
  const displayName = hostDisplayName(group.hostname, friendly);

  const countLabel = `${group.tabs.length} page${group.tabs.length > 1 ? "s" : ""}`;
  const closeAllLabel = `Kill ${group.tabs.length} page${group.tabs.length > 1 ? "s" : ""}`;
  const closeDupLabel = `Kill ${dupExtraCount} dupe${dupExtraCount > 1 ? "s" : ""}`;

  return (
    <article
      ref={cardRef}
      className={`card card--${Math.min(rows.length, 6)}${hasDups ? " card--has-dups" : ""}${shattering ? " card--shatter" : ""}`}
    >
      <CardFirework origin={firework} onDone={() => setFirework(null)} />
      <header className="card__head">
        <h3 className="card__title" title={group.hostname}>
          {displayName}
        </h3>
        <span className="card__count">
          <span className="card__count-icon">📄</span>
          {countLabel}
          {hasDups && <span className="card__dup-pill">{dupExtraCount} dupe{dupExtraCount > 1 ? "s" : ""}</span>}
        </span>
      </header>

      <ul className="card__list">
        {visibleRows.map((row) => (
          <TabItem
            key={row.tab.id ?? row.tab.url}
            row={row}
            fallbackColor={group.fallbackColor}
            fallbackLetter={group.fallbackLetter}
            onSave={onSave}
            onClose={onClose}
            trashSound={trashSound}
            lang={lang}
          />
        ))}
      </ul>

      {hidden > 0 && (
        <button type="button" className="tab-more" onClick={() => setExpanded(true)}>
          Show {hidden} more
        </button>
      )}
      {expanded && rows.length > COLLAPSED_LIMIT && (
        <button type="button" className="tab-more" onClick={() => setExpanded(false)}>
          Less
        </button>
      )}

      <div className="card__footer">
        {hasDups && (
          <button
            type="button"
            className="btn-pill btn-pill--danger"
            onClick={handleCloseDuplicates}
          >
            {closeDupLabel}
          </button>
        )}
        <button
          type="button"
          className="btn-pill btn-pill--accent"
          onClick={handleCloseAll}
        >
          {closeAllLabel}
        </button>
      </div>
    </article>
  );
}

interface DomainGridProps {
  groups: TabGroup[];
  onSave: (tab: chrome.tabs.Tab) => void;
  onClose?: (count: number) => void;
  cyberEnabled: boolean;
  trashSound: boolean;
  lang: Lang;
}

export function DomainGrid({ groups, onSave, onClose, cyberEnabled, trashSound, lang }: DomainGridProps) {
  return (
    <div className="grid">
      {groups.map((group) => (
        <DomainCard
          key={group.hostname}
          group={group}
          onSave={onSave}
          onClose={onClose}
          cyberEnabled={cyberEnabled}
          trashSound={trashSound}
          lang={lang}
        />
      ))}
    </div>
  );
}
