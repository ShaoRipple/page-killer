# Page Killer

**中文** | [English](#english)

> 替换 Chrome 新标签页，按 domain 自动分组管理已打开的 tab，一键清理多余页面。

![logo](public/logo.svg)

## 功能特性

- **Domain 自动分组** — 所有打开的 tab 按域名实时归类，无需手动整理
- **重复 tab 检测** — 自动标出同一 URL 开了多次的页面，一键关闭多余的
- **稍后再看** — 把暂时不看的页面收起来，不占 tab 位
- **一键 Kill** — 按卡片关闭、按域名全关、或全部清空
- **关闭特效** — 卡片消除动画 + 烟花粒子（可在设置中关闭）
- **关闭音效** — 丢垃圾音效反馈（可在设置中关闭）
- **每日金句** — 新标签页顶部随机显示一句话（可关闭）
- **中英双语** — 支持中文 / English 切换

## 安装（开发者模式）

1. Clone 本仓库或下载 zip
2. 安装依赖并构建：
   ```bash
   npm install
   npm run build
   ```
3. 打开 Chrome，访问 `chrome://extensions/`
4. 右上角开启 **开发者模式**
5. 点击 **加载未打包的扩展程序**，选择项目内的 `dist/` 目录
6. 打开新标签页即可使用

## 本地开发

```bash
npm install
npm run build
```

修改代码后重新 `npm run build`，然后在 `chrome://extensions/` 点击刷新按钮。

## 技术栈

- React + TypeScript
- Vite
- Chrome Extension Manifest V3

---

# English

**[中文](#page-killer)** | English

> A Chrome extension that replaces the new tab page, automatically groups open tabs by domain, and lets you kill them with one click.

## Features

- **Auto domain grouping** — All open tabs grouped by domain in real time, no manual sorting needed
- **Duplicate tab detection** — Highlights pages opened more than once, close extras in one click
- **Save for later** — Stash tabs you're not ready to close yet
- **One-click Kill** — Close by card, by domain, or kill everything at once
- **Close effects** — Card shatter animation + fireworks particles (can be disabled)
- **Trash sound** — Satisfying audio feedback on close (can be disabled)
- **Daily quote** — A random quote at the top of each new tab (can be disabled)
- **Bilingual** — Chinese / English support

## Installation (Developer Mode)

1. Clone this repo or download the zip
2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```
3. Open Chrome and go to `chrome://extensions/`
4. Enable **Developer mode** in the top-right corner
5. Click **Load unpacked** and select the `dist/` folder
6. Open a new tab and enjoy

## Development

```bash
npm install
npm run build
```

After editing code, re-run `npm run build` and click the refresh button on `chrome://extensions/`.

## Tech Stack

- React + TypeScript
- Vite
- Chrome Extension Manifest V3

## License

MIT
