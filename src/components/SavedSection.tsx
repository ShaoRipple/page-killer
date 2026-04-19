import { useRef, useState } from "react";
import { useSaved } from "../useSaved";
import { clearSaved, relativeTime, removeSaved, type SavedItem } from "../saved";
import { hostnameOf, colorFor, letterFor } from "../domain";
import type { Lang } from "../i18n";
import { playTrashSound } from "../sound";
import { CardFirework, shouldDegrade, type FireworkOrigin } from "./CyberEffects";

interface SavedItemRowProps {
  item: SavedItem;
  onRemove: (id: string) => void;
  cyberEnabled: boolean;
  trashSound: boolean;
  lang: Lang;
}

function Favicon({
  src,
  fallbackColor,
  fallbackLetter,
}: {
  src: string | undefined;
  fallbackColor: string;
  fallbackLetter: string;
}) {
  const [failed, setFailed] = useState(!src);
  if (failed) {
    return (
      <div
        className="card__logo-fallback"
        style={{ background: fallbackColor, width: 16, height: 16, fontSize: 9 }}
      >
        {fallbackLetter}
      </div>
    );
  }
  return (
    <img
      className="tab-item__favicon"
      src={src}
      alt=""
      onError={() => setFailed(true)}
    />
  );
}

function SavedRow({ item, onRemove, cyberEnabled, trashSound, lang }: SavedItemRowProps) {
  const host = hostnameOf(item.url) || "";
  const [shattering, setShattering] = useState(false);

  const handleOpen = () => {
    chrome.tabs.create({ url: item.url });
  };
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (trashSound) playTrashSound();
    if (shouldDegrade(cyberEnabled)) {
      onRemove(item.id);
      return;
    }
    setShattering(true);
    setTimeout(() => onRemove(item.id), 420);
  };

  return (
    <li
      className={`saved-item${shattering ? " saved-item--shatter" : ""}`}
      onClick={handleOpen}
    >
      <Favicon
        src={item.favicon_url}
        fallbackColor={colorFor(host || item.url)}
        fallbackLetter={letterFor(host || item.url)}
      />
      <div className="saved-item__main">
        <div className="saved-item__title" title={item.title}>
          {item.title}
        </div>
        <div className="saved-item__meta">
          {host && <span>{host}</span>}
          {host && <span> · </span>}
          <span>{relativeTime(item.savedAt, Date.now(), lang)}</span>
        </div>
      </div>
      <button
        type="button"
        className="tab-item__btn tab-item__close"
        aria-label={lang === "en" ? "Remove" : "移除"}
        onClick={handleRemove}
      >
        ×
      </button>
    </li>
  );
}

interface Props {
  lang: Lang;
  cyberEnabled: boolean;
  trashSound: boolean;
}

export function SavedSection({ lang, cyberEnabled, trashSound }: Props) {
  const { loading, saved } = useSaved();
  const killBtnRef = useRef<HTMLButtonElement>(null);
  const [firework, setFirework] = useState<FireworkOrigin | null>(null);

  const handleClearAll = () => {
    if (saved.length === 0) return;
    if (trashSound) playTrashSound();
    if (shouldDegrade(cyberEnabled)) {
      clearSaved();
      return;
    }
    const rect = killBtnRef.current?.getBoundingClientRect();
    if (rect) {
      setFirework({
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top + rect.height / 2),
      });
    }
    setTimeout(() => clearSaved(), 300);
  };

  if (loading) return null;

  const title = lang === "en" ? "Saved for later" : "稍后再看";
  const items = `${saved.length} item${saved.length > 1 ? "s" : ""}`;
  const emptyCopy =
    lang === "en"
      ? "Pages saved for later will rest here."
      : "这里会安放你想稍后再看的网页。";

  return (
    <section className="section">
      <CardFirework origin={firework} onDone={() => setFirework(null)} />
      <div className="section__header">
        <h2 className="section__title">{title}</h2>
        {saved.length > 0 && (
          <div className="section__meta">
            <span>{items}</span>
            <button
              ref={killBtnRef}
              type="button"
              className="btn-pill btn-pill--danger"
              onClick={handleClearAll}
            >
              Kill All
            </button>
          </div>
        )}
      </div>

      {saved.length === 0 ? (
        <div className="empty empty--sidebar">
          <img src="/empty-saved.png" alt="" className="empty__illustration" />
          <div>{emptyCopy}</div>
        </div>
      ) : (
        <ul className="saved-list">
          {saved.map((item) => (
            <SavedRow
              key={item.id}
              item={item}
              onRemove={removeSaved}
              cyberEnabled={cyberEnabled}
              trashSound={trashSound}
              lang={lang}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
