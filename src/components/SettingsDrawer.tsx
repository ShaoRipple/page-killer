import { useEffect } from "react";
import { tr, type Lang } from "../i18n";
import type { Settings } from "../useSettings";

const VERSION = "0.1.0";
const GITHUB_URL = "https://github.com/Kar-98/page-killer";

interface Props {
  open: boolean;
  onClose: () => void;
  onPanelEnter?: () => void;
  onPanelLeave?: () => void;
  settings: Settings;
  update: (patch: Partial<Settings>) => Promise<boolean>;
  onClearSaved: () => void;
  lang: Lang;
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="set-row">
      <div className="set-row__label">
        {label}
        {hint && (
          <span className="set-row__hint" data-tip={hint} aria-label={hint} />
        )}
      </div>
      <div className="set-row__ctrl">{children}</div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`toggle${checked ? " toggle--on" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle__knob" />
    </button>
  );
}

export function SettingsDrawer({
  open,
  onClose,
  onPanelEnter,
  onPanelLeave,
  settings,
  update,
  onClearSaved,
  lang,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <aside
      className={`set-drawer${open ? " set-drawer--open" : ""}`}
      aria-hidden={!open}
      onMouseEnter={onPanelEnter}
      onMouseLeave={onPanelLeave}
    >
      <header className="set-drawer__head">
        <h2>⚙ {tr("settings", lang)}</h2>
        <button type="button" aria-label="关闭" className="set-drawer__close" onClick={onClose}>
          ×
        </button>
      </header>

      <div className="set-drawer__body">
        <Row label={tr("lang_label", lang)}>
          <div className="lang-group">
            <button
              type="button"
              className={`lang-btn${settings.language === "zh" ? " lang-btn--on" : ""}`}
              onClick={() => update({ language: "zh" })}
            >
              中文
            </button>
            <button
              type="button"
              className={`lang-btn${settings.language === "en" ? " lang-btn--on" : ""}`}
              onClick={() => update({ language: "en" })}
            >
              English
            </button>
          </div>
        </Row>

        <Row label={tr("takeover", lang)} hint={tr("takeover_hint", lang)}>
          <Toggle
            checked={settings.takeoverNewTab}
            onChange={(v) => update({ takeoverNewTab: v })}
            label={tr("takeover", lang)}
          />
        </Row>

        <Row label={tr("show_quote", lang)}>
          <Toggle
            checked={settings.showQuote}
            onChange={(v) => update({ showQuote: v })}
            label={tr("show_quote", lang)}
          />
        </Row>

        <Row label={tr("cyber", lang)}>
          <Toggle
            checked={settings.cyberEffects}
            onChange={(v) => update({ cyberEffects: v })}
            label={tr("cyber", lang)}
          />
        </Row>

        <Row label={tr("trash_sound", lang)}>
          <Toggle
            checked={settings.trashSound}
            onChange={(v) => update({ trashSound: v })}
            label={tr("trash_sound", lang)}
          />
        </Row>

        <div className="set-divider" />

        <Row label={tr("clear_saved_label", lang)}>
          <button type="button" className="btn-pill btn-pill--danger" onClick={onClearSaved}>
            {tr("clear", lang)}
          </button>
        </Row>

        <div className="set-divider" />

        <div className="set-about">
          <div className="set-about__title">{tr("about", lang)}</div>
          <div className="set-about__line">Page Killer · v{VERSION}</div>
          <div className="set-about__line">
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              GitHub →
            </a>
          </div>
          <div className="set-about__line">
            {tr("author", lang)}：novin.shao
          </div>
        </div>
      </div>
    </aside>
  );
}
