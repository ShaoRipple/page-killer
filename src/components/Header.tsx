import { formatGreeting, type Lang } from "../i18n";
import type { Quote } from "../useQuote";

interface BannerProps {
  count: number;
  onKillExtras: () => void;
  onDismiss: () => void;
  lang: Lang;
}

interface Props {
  lang: Lang;
  quote: Quote | null;
  banner?: BannerProps | null;
}

export function Header({ lang, quote, banner }: Props) {
  const now = new Date();
  const g = formatGreeting(lang, now.getHours());
  return (
    <header className="header-row">
      <div className="header-row__left">
        <h1 className="header__greeting">{g.text}</h1>
        {g.subtle && <div className="header__subtle">{g.subtle}</div>}
      </div>
      {quote && (
        <div className="header-row__right">
          <div className="quote__text">&ldquo;{quote.text}&rdquo;</div>
          <div className="quote__meta">
            —— {quote.author}
            {quote.source}
          </div>
        </div>
      )}
      {banner && (
        <div className="header-row__alert">
          <div className="header-alert__body">
            <span className="header-alert__icon">💡</span>
            <span className="header-alert__text">
              {banner.lang === "en"
                ? `Page Killer × ${banner.count} · overkill`
                : `Page Killer × ${banner.count}，火力过剩了`}
            </span>
          </div>
          <div className="header-alert__actions">
            <button
              type="button"
              className="btn-pill btn-pill--danger"
              onClick={banner.onKillExtras}
            >
              Kill {banner.count - 1}
            </button>
            <button
              type="button"
              className="btn-pill btn-pill--accent"
              onClick={banner.onDismiss}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
