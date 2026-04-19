// 归类 key 按 eTLD+1（registrable domain）合并子域。
// 个别主域的子产品差异过大，豁免到 hostname 级。
const TWO_LEVEL_CCTLDS = new Set([
  "com.cn", "net.cn", "org.cn", "gov.cn", "edu.cn", "ac.cn",
  "com.hk", "com.tw", "com.jp", "co.jp", "ne.jp",
  "co.uk", "org.uk", "ac.uk",
  "co.kr", "com.au", "com.sg",
]);

const SPLIT_BY_REGISTRABLE = new Set([
  "google.com",
  "microsoft.com",
  "apple.com",
  "amazon.com",
]);

// key 既可能是完整 hostname（细分的子产品），也可能是主域名（eTLD+1）。
const FRIENDLY_NAMES: Record<string, string> = {
  // google.com 下的子产品（SPLIT）
  "mail.google.com": "Gmail",
  "docs.google.com": "Google Docs",
  "drive.google.com": "Google Drive",
  "calendar.google.com": "Google Calendar",
  "meet.google.com": "Google Meet",
  "gemini.google.com": "Gemini",
  "www.google.com": "Google",
  // 按主域名合并
  "feishu.cn": "飞书",
  "larkoffice.com": "飞书",
  "github.com": "GitHub",
  "youtube.com": "YouTube",
  "figma.com": "Figma",
  "notion.so": "Notion",
  "bilibili.com": "B站",
  "zhihu.com": "知乎",
  "baidu.com": "百度",
  "weixin.qq.com": "微信",
  "qq.com": "腾讯",
  "twitter.com": "Twitter",
  "x.com": "X",
  "linkedin.com": "LinkedIn",
  "claude.ai": "Claude",
  "openai.com": "OpenAI",
  "chatgpt.com": "ChatGPT",
  "deepseek.com": "DeepSeek",
  "stackoverflow.com": "Stack Overflow",
  "ycombinator.com": "Hacker News",
  "reddit.com": "Reddit",
  // chrome:// 内部页
  "extensions": "Chrome Extensions",
  "settings": "Chrome Settings",
  "history": "Chrome History",
  "downloads": "Chrome Downloads",
  "bookmarks": "Chrome Bookmarks",
  "newtab": "New Tab",
  "new-tab-page": "New Tab",
  "flags": "Chrome Flags",
};

const TITLE_SEPARATORS = /\s[-|·—–:]\s|\s\|\s/;

const CARD_COLORS = [
  "#d97757",
  "#b08968",
  "#8aa779",
  "#6a92b0",
  "#9a7aa0",
  "#c09252",
  "#7a9b8e",
  "#b3756d",
];

export interface TabGroup {
  hostname: string;
  name: string;
  tabs: chrome.tabs.Tab[];
  fallbackColor: string;
  fallbackLetter: string;
}

export function hostnameOf(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.hostname || null;
  } catch {
    return null;
  }
}

export function registrableDomain(hostname: string): string {
  const parts = hostname.split(".");
  if (parts.length <= 2) return hostname;
  const lastTwo = parts.slice(-2).join(".");
  if (TWO_LEVEL_CCTLDS.has(lastTwo) && parts.length >= 3) {
    return parts.slice(-3).join(".");
  }
  return lastTwo;
}

function groupKey(hostname: string): string {
  const reg = registrableDomain(hostname);
  if (SPLIT_BY_REGISTRABLE.has(reg)) return hostname;
  return reg;
}

function isOwnExtensionId(hostname: string): boolean {
  try {
    return typeof chrome !== "undefined" && hostname === chrome.runtime.id;
  } catch {
    return false;
  }
}

export function isOwnNewTab(tab: chrome.tabs.Tab): boolean {
  const url = tab.url || tab.pendingUrl || "";
  try {
    if (url.startsWith(`chrome-extension://${chrome.runtime.id}/`)) return true;
  } catch {
    // ignore
  }
  if (url === "chrome://newtab/" || url === "chrome://newtab") return true;
  return false;
}

function cleanTitle(title: string): string {
  const parts = title.split(TITLE_SEPARATORS).map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return title.trim();
  return parts[parts.length - 1];
}

export function friendlyName(key: string, sampleHostname: string): string | null {
  if (isOwnExtensionId(key) || isOwnExtensionId(sampleHostname)) return "Page Killer";
  if (FRIENDLY_NAMES[key]) return FRIENDLY_NAMES[key];
  if (FRIENDLY_NAMES[sampleHostname]) return FRIENDLY_NAMES[sampleHostname];
  const stripped = sampleHostname.replace(/^www\./, "");
  if (FRIENDLY_NAMES[stripped]) return FRIENDLY_NAMES[stripped];
  return null;
}

export function groupNameFor(
  key: string,
  sampleHostname: string,
  tabs: chrome.tabs.Tab[],
): string {
  const mapped = friendlyName(key, sampleHostname);
  if (mapped) return mapped;
  const firstTitle = tabs.find((t) => t.title)?.title;
  if (firstTitle) return cleanTitle(firstTitle);
  return key;
}

function hashHostname(hostname: string): number {
  let h = 0;
  for (let i = 0; i < hostname.length; i++) {
    h = (h * 31 + hostname.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function colorFor(hostname: string): string {
  return CARD_COLORS[hashHostname(hostname) % CARD_COLORS.length];
}

export function letterFor(hostname: string): string {
  const stripped = hostname.replace(/^www\./, "");
  return (stripped[0] || "?").toUpperCase();
}

export function hostDisplayName(hostname: string, friendly: string | null): string {
  const mapped = friendly || hostname;
  const stripped = mapped.replace(/^www\./, "");
  return stripped
    .split(/[._-]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join(" ");
}

export function normalizedUrl(tab: chrome.tabs.Tab): string | null {
  const raw = tab.url || tab.pendingUrl;
  if (!raw) return null;
  if (!/^https?:/i.test(raw) && !/^chrome:/i.test(raw) && !/^file:/i.test(raw)) {
    return null;
  }
  const hashIdx = raw.indexOf("#");
  return hashIdx >= 0 ? raw.slice(0, hashIdx) : raw;
}

export function groupTabs(tabs: chrome.tabs.Tab[]): TabGroup[] {
  const buckets = new Map<string, chrome.tabs.Tab[]>();
  const sampleHost = new Map<string, string>();

  for (const tab of tabs) {
    // Killer 自身的 newtab 不作为 domain 卡片显示：多 Killer 已由顶部横幅提醒，避免重复功能
    if (isOwnNewTab(tab)) continue;
    const host = hostnameOf(tab.url || tab.pendingUrl);
    const key = host ? groupKey(host) : "local";
    if (!buckets.has(key)) {
      buckets.set(key, []);
      sampleHost.set(key, host || "local");
    }
    buckets.get(key)!.push(tab);
  }

  const groups: TabGroup[] = [];
  for (const [key, bucket] of buckets) {
    bucket.sort((a, b) => {
      if (a.windowId !== b.windowId) return a.windowId - b.windowId;
      return a.index - b.index;
    });
    const host = sampleHost.get(key) || key;
    groups.push({
      hostname: key,
      name: groupNameFor(key, host, bucket),
      tabs: bucket,
      fallbackColor: colorFor(key),
      fallbackLetter: letterFor(host),
    });
  }
  groups.sort((a, b) => {
    if (a.tabs.length !== b.tabs.length) return b.tabs.length - a.tabs.length;
    return a.hostname.localeCompare(b.hostname);
  });
  return groups;
}
