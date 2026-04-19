import type { Lang } from "../i18n";

interface Props {
  count: number;
  onCloseExtras: () => void;
  onDismiss: () => void;
  lang: Lang;
}

export function MultiKillerBanner({ count, onCloseExtras, onDismiss, lang }: Props) {
  const message =
    lang === "en"
      ? `Page Killer × ${count} · overkill`
      : `Page Killer × ${count}，火力过剩了`;
  const extraLabel = `Kill ${count - 1}`;
  const dismissLabel = "Dismiss";
  return (
    <div className="banner" role="alert">
      <div className="banner__body">
        <span className="banner__icon">⚠︎</span>
        <span>{message}</span>
      </div>
      <div className="banner__actions">
        <button type="button" className="btn-pill btn-pill--danger" onClick={onCloseExtras}>
          {extraLabel}
        </button>
        <button type="button" className="btn-pill" onClick={onDismiss}>
          {dismissLabel}
        </button>
      </div>
    </div>
  );
}
