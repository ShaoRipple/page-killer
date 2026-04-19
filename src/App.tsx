import { useEffect, useRef, useState } from "react";
import "./global.css";
import { useTabs, closeTabs, saveTab } from "./useTabs";
import { useSettings } from "./useSettings";
import { useQuote } from "./useQuote";
import { clearSaved } from "./saved";
import { tr } from "./i18n";
import { Header } from "./components/Header";
import { DomainGrid } from "./components/DomainGrid";
import { EmptyState } from "./components/EmptyState";
import { SavedSection } from "./components/SavedSection";
import { BookmarkDrawer } from "./components/BookmarkDrawer";
import { SettingsDrawer } from "./components/SettingsDrawer";
import { BombEffect, shouldDegrade } from "./components/CyberEffects";
import { playTrashSound } from "./sound";

function Skeleton() {
  return (
    <div className="skeleton">
      <div className="skeleton__card" />
      <div className="skeleton__card" />
      <div className="skeleton__card" />
      <div className="skeleton__card" />
    </div>
  );
}

interface Toast {
  id: number;
  text: string;
}

export function App() {
  const { loading, groups, totalTabs, killerTabIds, selfTabId } = useTabs();
  const { settings, update } = useSettings();
  const quote = useQuote(settings.showQuote);

  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bombing, setBombing] = useState(false);
  const closeSettingsTimer = useRef<ReturnType<typeof setTimeout>>();

  const openSettings = () => {
    clearTimeout(closeSettingsTimer.current);
    setSettingsOpen(true);
  };
  const scheduleCloseSettings = () => {
    closeSettingsTimer.current = setTimeout(() => setSettingsOpen(false), 150);
  };

  // 屏幕抖动
  useEffect(() => {
    if (!bombing) return;
    document.body.classList.add("screen-shake");
    const id = setTimeout(() => document.body.classList.remove("screen-shake"), 220);
    return () => {
      clearTimeout(id);
      document.body.classList.remove("screen-shake");
    };
  }, [bombing]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (text: string) => setToast({ id: Date.now(), text });

  const handleSave = async (tab: chrome.tabs.Tab) => {
    const result = await saveTab(tab);
    if (!result.ok) {
      showToast(tr("save_failed", settings.language));
    } else if (result.duplicate) {
      showToast(tr("in_saved", settings.language));
    }
  };

  const handleCloseAll = () => {
    const ids = groups
      .flatMap((g) => g.tabs)
      .map((t) => t.id)
      .filter((id): id is number => id != null);
    if (!ids.length) return;
    if (settings.trashSound) playTrashSound();
    if (shouldDegrade(settings.cyberEffects)) {
      closeTabs(ids);
      showToast(`Killed ${ids.length} page${ids.length > 1 ? "s" : ""}`);
      return;
    }
    setBombing(true);
    setTimeout(() => {
      closeTabs(ids);
      showToast(`Killed ${ids.length} page${ids.length > 1 ? "s" : ""}`);
    }, 600);
    setTimeout(() => setBombing(false), 1200);
  };

  const handleClose = (count: number) => {
    showToast(`Killed ${count} page${count > 1 ? "s" : ""}`);
  };

  const handleCloseExtras = () => {
    const extras = killerTabIds.filter((id) => id !== selfTabId);
    if (!extras.length) return;
    if (settings.trashSound) playTrashSound();
    closeTabs(extras);
  };

  const handleClearSaved = () => {
    clearSaved();
  };

  const domainCount = groups.length;
  const showBanner = killerTabIds.length >= 2 && !bannerDismissed;
  const lang = settings.language;

  // 接管开关关闭态：不渲染主界面
  if (!settings.takeoverNewTab) {
    return (
      <main className="app app--disabled">
        <div className="disabled">
          <div className="disabled__mark">⏸</div>
          <p>{tr("newtab_disabled", lang)}</p>
          <button
            type="button"
            className="btn-pill btn-pill--accent"
            onClick={() => update({ takeoverNewTab: true })}
          >
            {lang === "en" ? "Re-enable" : "重新开启"}
          </button>
        </div>
      </main>
    );
  }

  const openTabsTitle = lang === "en" ? "Open pages" : "当前打开";
  const domainsCountCopy = `${domainCount} domain${domainCount > 1 ? "s" : ""}`;
  const closeAllCopy = `Kill All`;

  return (
    <>
      <BookmarkDrawer lang={lang} />
      <main className="app">
        <Header
          lang={lang}
          quote={settings.showQuote ? quote : null}
          banner={showBanner ? {
            count: killerTabIds.length,
            onKillExtras: handleCloseExtras,
            onDismiss: () => setBannerDismissed(true),
            lang,
          } : null}
        />

        <div className="main-columns">
          <section className="section main-columns__primary">
            <div className="section__header">
              <h2 className="section__title">{openTabsTitle}</h2>
              {!loading && totalTabs > 0 && (
                <div className="section__meta">
                  <span>{domainsCountCopy}</span>
                  <button
                    type="button"
                    className="btn-pill btn-pill--danger"
                    onClick={handleCloseAll}
                  >
                    {closeAllCopy}
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <Skeleton />
            ) : groups.length === 0 ? (
              <EmptyState lang={lang} />
            ) : (
              <DomainGrid
                groups={groups}
                onSave={handleSave}
                onClose={handleClose}
                cyberEnabled={settings.cyberEffects}
                trashSound={settings.trashSound}
                lang={lang}
              />
            )}
          </section>

          <div className="main-columns__sidebar">
            <SavedSection lang={lang} cyberEnabled={settings.cyberEffects} trashSound={settings.trashSound} />
          </div>
        </div>

        <button
          type="button"
          className="settings-rail"
          aria-label="设置"
          title="设置"
          onMouseEnter={openSettings}
          onMouseLeave={scheduleCloseSettings}
        >
          ⚙
        </button>

        {toast && (
          <div className="toast">
            <span className="toast__icon">✓</span>
            {toast.text}
          </div>
        )}
      </main>

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onPanelEnter={openSettings}
        onPanelLeave={scheduleCloseSettings}
        settings={settings}
        update={update}
        onClearSaved={handleClearSaved}
        lang={lang}
      />

      <BombEffect active={bombing} onDone={() => setBombing(false)} />
    </>
  );
}
