export type Lang = "zh" | "en";

function detectLang(): Lang {
  try {
    const ui = chrome.i18n.getUILanguage();
    return ui.toLowerCase().startsWith("zh") ? "zh" : "en";
  } catch {
    return "zh";
  }
}

export const defaultLang: Lang = detectLang();

const WEEKDAYS_ZH = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const WEEKDAYS_EN = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];
const MONTHS_EN = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

export function formatGreeting(lang: Lang, hour: number): { text: string; subtle?: string } {
  if (lang === "en") {
    if (hour >= 5 && hour < 12) return { text: "Good morning" };
    if (hour >= 12 && hour < 18) return { text: "Good afternoon" };
    if (hour >= 18 && hour < 23) return { text: "Good evening" };
    return { text: "Good night", subtle: "Rest early — tabs can wait till tomorrow." };
  }
  if (hour >= 5 && hour < 12) return { text: "早上好" };
  if (hour >= 12 && hour < 18) return { text: "下午好" };
  if (hour >= 18 && hour < 23) return { text: "晚上好" };
  return { text: "夜深了", subtle: "早点休息，这些 page 留给明天的你" };
}

export function formatDate(lang: Lang, now: Date): string {
  if (lang === "en") {
    return `${WEEKDAYS_EN[now.getDay()]}, ${MONTHS_EN[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  }
  return `${now.getFullYear()} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日 · ${WEEKDAYS_ZH[now.getDay()]}`;
}

export const t = {
  open_tabs: { zh: "当前打开", en: "Open tabs" },
  saved: { zh: "稍后再看", en: "Saved for later" },
  bookmarks: { zh: "书签", en: "Bookmarks" },
  settings: { zh: "设置", en: "Settings" },
  close_extras: { zh: "关掉多余", en: "Close extras" },
  empty_tabs: { zh: "Page 界当前太平无事", en: "All quiet on the page front." },
  empty_saved: {
    zh: "这里会攒下你想稍后再看的东西，现在还空着。",
    en: "Things to read later will pile up here.",
  },
  empty_bookmarks: {
    zh: "你还没添加任何书签，先用一用 Chrome 自带的书签功能吧～",
    en: "You have no bookmarks yet.",
  },
  search_bookmarks: { zh: "搜索书签…", en: "Search bookmarks…" },
  no_match: { zh: "没搜到，换个关键字试试？", en: "No match — try another keyword." },
  in_saved: { zh: "已在待重拾列表中", en: "Already saved" },
  save_failed: { zh: "收藏失败，请重试", en: "Save failed, try again" },
  remove_failed: { zh: "移除失败，请重试", en: "Remove failed, try again" },
  newtab_disabled: {
    zh: "Page Killer 已停用接管。点击右下角 ⚙ 图标进入设置重新开启。",
    en: "Page Killer takeover is off. Click the ⚙ icon at bottom-right to re-enable.",
  },
  lang_label: { zh: "语言", en: "Language" },
  takeover: { zh: "接管新标签页", en: "Take over new tab" },
  show_quote: { zh: "显示欢迎语", en: "Show greeting" },
  cyber: { zh: "关闭特效", en: "Close effects" },
  trash_sound: { zh: "关闭音效", en: "Close sound" },
  takeover_hint: {
    zh: "开启后 Page Killer 将接管每个新标签页，替换 Chrome 默认的新标签页。",
    en: "When on, Page Killer replaces Chrome's default new tab page.",
  },
  clear_saved_label: { zh: "清空稍后再看", en: "Clear Saved for later" },
  clear: { zh: "清空", en: "Clear" },
  about: { zh: "关于", en: "About" },
  version: { zh: "版本", en: "Version" },
  author: { zh: "作者", en: "Author" },
  collapse: { zh: "收起", en: "Collapse" },
  quote_none: { zh: "", en: "" },
};

export type Key = keyof typeof t;

export function tr(key: Key, lang: Lang): string {
  return t[key][lang];
}
