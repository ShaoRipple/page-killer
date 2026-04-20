# Page Killer

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**中文** | [English](#english)

> 一个让你在新标签页里"杀"页面的 Chrome 插件 —— 按域名自动归类、一键清扫重复页、把舍不得关的收进"小黑屋"。

## 📖 故事背景

作为一个 **典型性 tab 开太多患者**，我每天在 Chrome 里打开几十个标签页，结果经常内存报警😭

发现 [zara 的 Tab-out](https://github.com/zarazhangrui/tab-out) 完美解决了这个痛点，遂决定学习其核心思路，当作自己 Vibe Coding 的第一个练手项目。

> 🧎‍♂️ **特此声明**：本插件的核心创意参考自 [zara/Tab-out](https://github.com/zarazhangrui/tab-out)，在原项目基础上加了一些交互改进。感谢 zara 的开源精神！

---

## ✨ 核心功能

- **Domain 自动分组** — 所有打开的 tab 按域名实时归类，无需手动整理
- **重复 tab 检测** — 自动标出同一 URL 开了多次的页面，一键关闭多余的
- **稍后再看** — 把暂时舍不得关的页面收起来，关闭浏览器也不怕丢失
- **一键 Kill** — 按卡片关闭、按域名全关、清空稍后再看、或全部清空
- **关闭特效** — 卡片消除动画 + 烟花粒子（可在设置中关闭）
- **关闭音效** — 丢垃圾音效反馈，爽感拉满（可在设置中关闭）
- **每日金句** — 新标签页顶部随机显示一句话（可关闭）
- **中英双语** — 支持中文 / English 切换

---

## 📦 安装（开发者模式）

1. Clone 本仓库或下载 zip
   ```bash
   git clone https://github.com/ShaoRipple/page-killer.git
   cd page-killer
   ```

2. 安装依赖并构建
   ```bash
   npm install
   npm run build
   ```

3. 加载到 Chrome
   - 打开 Chrome，访问 `chrome://extensions/`
   - 右上角开启 **开发者模式**
   - 点击 **加载未打包的扩展程序**，选择 `dist/` 目录
   - 打开新标签页即可使用

---

## 🛠️ 本地开发

修改代码后：
```bash
npm run build
```

然后在 `chrome://extensions/` 点击扩展的刷新按钮即可。

---

## 📚 技术栈

- React + TypeScript
- Vite
- Chrome Extension Manifest V3

---

## 🙏 致谢 & 声明

- 核心创意与解题思路：[zara / Tab-out](https://github.com/zarazhangrui/tab-out)
- 本项目用于个人学习与分享，非商业用途

---

## 📄 License

MIT — 详见 [LICENSE](LICENSE)

---

# English

**[中文](#page-killer)** | English

> A Chrome extension that lets you "kill" tabs on the new tab page — auto-group by domain, close duplicates in one click, stash tabs you're not ready to close yet.

## 📖 Story

As someone who habitually opens dozens of tabs in Chrome, I constantly hit memory limits 😭

I discovered [zara's Tab-out](https://github.com/zarazhangrui/tab-out) and it solved my problem perfectly. I decided to learn from it and build this as my first Vibe Coding project.

> 🧎‍♂️ **Shout-out**: The core idea of this extension is inspired by [zara/Tab-out](https://github.com/zarazhangrui/tab-out). I added some UI/UX improvements on top. Thanks zara for open-sourcing it!

---

## ✨ Features

- **Auto domain grouping** — All tabs grouped by hostname in real time, no manual sorting
- **Duplicate detection** — Highlights pages opened more than once, close extras in one click
- **Save for later** — Stash tabs you're not ready to close; they'll still be there after restart
- **One-click Kill** — Close by card, by domain, all saved tabs, or everything at once
- **Close effects** — Card shatter animation + fireworks particles (optional)
- **Trash sound** — Satisfying audio feedback on close (optional)
- **Daily quote** — A random quote at the top of each new tab (optional)
- **Bilingual** — Chinese / English support

---

## 📦 Installation (Developer Mode)

1. Clone the repo or download the zip
   ```bash
   git clone https://github.com/ShaoRipple/page-killer.git
   cd page-killer
   ```

2. Install and build
   ```bash
   npm install
   npm run build
   ```

3. Load into Chrome
   - Open Chrome and go to `chrome://extensions/`
   - Enable **Developer mode** (top-right corner)
   - Click **Load unpacked** and select the `dist/` folder
   - Open a new tab and enjoy

---

## 🛠️ Development

After editing code:
```bash
npm run build
```

Then click the refresh button on the extension in `chrome://extensions/`.

---

## 📚 Tech Stack

- React + TypeScript
- Vite
- Chrome Extension Manifest V3

---

## 🙏 Credits & Disclaimer

- Core idea & inspiration: [zara / Tab-out](https://github.com/zarazhangrui/tab-out)
- This project is for personal learning and sharing, not commercial use

---

## 📄 License

MIT — see [LICENSE](LICENSE)
