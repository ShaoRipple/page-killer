import { tr, type Lang } from "../i18n";

export function EmptyState({ lang }: { lang: Lang }) {
  return (
    <div className="empty empty--full">
      <img src="/empty-tabs.png" alt="" className="empty__illustration" />
      <div>{tr("empty_tabs", lang)}</div>
    </div>
  );
}
