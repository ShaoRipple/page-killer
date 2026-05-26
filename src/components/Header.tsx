import { formatGreeting, type Lang } from "../i18n";
import type { Quote } from "../useQuote";

interface Props {
  lang: Lang;
  quote: Quote | null;
}

export function Header({ lang, quote }: Props) {
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
    </header>
  );
}
