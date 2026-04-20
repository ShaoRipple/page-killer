# Page Killer

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**中文** | [English](#english)

> 一个让你在新标签页里"杀"页面的 Chrome 插件 —— 按域名自动归类、一键清扫重复页、把舍不得关的收进"小黑屋"，内存不足再也不怕了。

## 📖 故事背景

作为一个赶晚集的 **典型性产品非经理** / 最近开始 Vibe Coding，我每天在 Chrome 里打开几十个标签页，结果经常内存报警，有的时候直接就崩溃了🤡，可那些没看完的网页找起来就会痛苦万分……

带着这个痛点在 GitHub 上闲逛，发现 [zara 的 Tab-out](https://github.com/zarazhangrui/tab-out) 完美解决我的痛点。试用之后不禁感叹：**这解题思路太妙了！** 于是决定"抄"过来，当作我 Vibe Coding 的第一个练手项目。

> 🧎‍♂️ **特此声明**：本插件的核心创意均参考自 [zara/Tab-out](https://github.com/zarazhangrui/tab-out)，我只是在原项目基础上加了一些细微的交互小改动。感谢 zara 的开源精神！

---

## ✨ 核心功能

### 🚪 唤起方式
打开 Chrome 新标签页 → 自动进入 **Page Killer** 页面。不用点任何按钮，它已经在等你了。

### 📂 当前打开 – 按域名乖乖站好
所有 Chrome 里打开的页面，按 `hostname` 自动分组，一眼就能看清某个域名打开了哪些 page。

### 🎭 重复 Page 检测
同一个网址开了 N 个？域名卡片上会标出"重复页"，点击按钮一键关闭那些 **小跟班**。

### 🧸 稍后再看（持久化存储）
"坏了！内存又红了！可是还有好多网页没看完！"  
别慌，点击域名卡片上的"+"，把暂时舍不得关的页面暂时安放在 **"稍后再看"**。  

> 💡 即使你关闭了整个浏览器，下次打开 Chrome 新标签页，这些链接依然乖乖躺在那里等你。**再也不怕被迫关浏览器了！**

### 💣 一键 Kill
四种快乐，想杀就杀：
- 关闭某个域名下的 **所有 page**
- 关闭某个域名下的 **重复 page**
- 关闭 **所有"稍后再看"的 page**
- 关闭 Chrome 中 **所有多余的 pagekiller**

想全局清空？顶栏还有爽感拉满的 **"通杀"** 按钮。

### 🔊 关闭音效 + ✨ 特效
卡片关闭时会伴随一声 **"咻～"** 的音效，外加粒子特效（像把垃圾精准投进垃圾桶）。  
如果你的电脑卡得像 PPT，或者你觉得太吵——去 **设置** 里手动关掉它们。

### 📜 每日金句（毒鸡汤）
每天打开新标签页，Page Killer 会随机喂你一句 **毒鸡汤**。  
"大郎，该喝药了"——不想喝的话，设置里也可以关掉。

### 🌍 中英双语
一键切换中文 / English，欢迎五湖四海的朋友来杀页面。

---

## 📦 安装（开发者模式）

1. 把代码 clone 下来（或直接下载 zip）
   ```bash
   git clone https://github.com/ShaoRipple/page-killer.git
   cd page-killer
   ```

2. 进入项目目录，安装依赖并打包
   ```bash
   npm install
   npm run build
   ```

3. 打开 Chrome，地址栏输入 `chrome://extensions/`

4. 右上角打开 **开发者模式**

5. 点击 **加载未打包的扩展程序**，选择项目里的 `dist/` 文件夹

6. 打开一个新标签页 —— 恭喜，你的 page 管理终于有暴力美学了

---

## 🛠️ 本地开发

改完代码重新 `npm run build`，然后在 `chrome://extensions/` 里点击插件的 **刷新按钮**。

---

## 📚 技术栈

- React + TypeScript（假装自己很专业）
- Vite（快到飞起）
- Chrome Extension Manifest V3（紧跟时代）

---

## 🙏 致谢 & 声明

- 核心创意与解题思路：[zara / Tab-out](https://github.com/zarazhangrui/tab-out)
- 本项目仅用于个人学习 Vibe Coding，非商业用途。如原作者有任何意见，欢迎联系。

---

## 📄 License

MIT

---

# English

**[中文](#page-killer)** | English

> A Chrome extension that lets you "kill" tabs on the new tab page — auto-group by domain, close duplicates in one click, stash tabs you're not ready to close yet, and never worry about running out of memory again.

## 📖 Story

As a self-proclaimed "typical person who opens too many tabs" / recently started Vibe Coding, I open dozens of tabs in Chrome every day. The result? Constant memory warnings, sometimes even crashes 🤡, and finding those unfinished webpages becomes a nightmare……

While browsing GitHub with this pain point in mind, I discovered [zara's Tab-out](https://github.com/zarazhangrui/tab-out) which perfectly solved my problem. After trying it out, I couldn't help but think: **This solution is so clever!** So I decided to "borrow" the idea and use it as my first Vibe Coding practice project.

> 🧎‍♂️ **Special thanks**: The core idea of this extension is inspired by [zara/Tab-out](https://github.com/zarazhangrui/tab-out). I only added some minor UI/UX improvements on top of the original project. Thanks to zara for the open-source spirit!

---

## ✨ Features

### 🚪 How to Use
Open a new Chrome tab → automatically enter the **Page Killer** page. No buttons to click, it's already waiting for you.

### 📂 Current Open – All Tabs Organized by Domain
All pages open in Chrome are automatically grouped by `hostname`, so you can see at a glance which pages are open under each domain.

### 🎭 Duplicate Tab Detection
Opened the same URL multiple times? The domain card will flag "duplicate pages", and one click closes those **little followers**.

### 🧸 Save for Later (Persistent Storage)
"Oh no! Memory's full again! But I haven't finished reading so many pages!"  
Don't panic, click the "+" button on the domain card to temporarily stash pages you're not ready to close in **"Save for later"**.  

> 💡 Even if you close the entire browser, the next time you open a new Chrome tab, these links will still be waiting for you. **Never have to force-close the browser again!**

### 💣 One-Click Kill
Four kinds of happiness, kill however you want:
- Close **all pages** under a domain
- Close **duplicate pages** under a domain
- Close **all pages in "Save for later"**
- Close **all extra Page Killer tabs** in Chrome

Want to nuke everything globally? The top bar has a **"Kill All"** button that's oh-so-satisfying.

### 🔊 Trash Sound + ✨ Effects
When a card closes, you'll hear a satisfying **"whoosh~"** sound effect, plus particle effects (like precisely tossing trash into a garbage bin).  
If your computer lags like a PowerPoint, or if you find it too loud — head to **Settings** and turn them off manually.

### 📜 Daily Quote (Bitter Wisdom)
Every time you open a new tab, Page Killer randomly feeds you a **bitter wisdom quote**.  
"Big brother, time to drink your medicine" — if you don't want to drink it, you can turn it off in Settings too.

### 🌍 Bilingual Support
Switch between Chinese / English with one click. Welcome tab-killers from all over the world.

---

## 📦 Installation (Developer Mode)

1. Clone the code (or download the zip)
   ```bash
   git clone https://github.com/ShaoRipple/page-killer.git
   cd page-killer
   ```

2. Enter the project directory, install dependencies and build
   ```bash
   npm install
   npm run build
   ```

3. Open Chrome and type `chrome://extensions/` in the address bar

4. Enable **Developer mode** in the top-right corner

5. Click **Load unpacked** and select the `dist/` folder from the project

6. Open a new tab — Congratulations, your tab management finally has style!

---

## 🛠️ Local Development

After editing code, re-run `npm run build`, then click the **refresh button** on the extension in `chrome://extensions/`.

---

## 📚 Tech Stack

- React + TypeScript (pretending to be professional)
- Vite (blazingly fast)
- Chrome Extension Manifest V3 (keeping up with the times)

---

## 🙏 Credits & Disclaimer

- Core idea and solution approach: [zara / Tab-out](https://github.com/zarazhangrui/tab-out)
- This project is solely for personal learning in Vibe Coding, not for commercial use. If the original author has any concerns, please feel free to reach out.

---

## 📄 License

MIT
