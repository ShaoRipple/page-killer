# Page Killer

> 替换 Chrome 新标签页，按 domain 自动分组管理已打开的 tab，一键清理多余页面。

![logo](public/logo.svg)

---

## 功能

- **Domain 自动分组** — 所有打开的 tab 按域名实时归类，无需手动整理
- **重复 tab 检测** — 自动标出同一 URL 开了多次的页面，一键关闭多余的
- **稍后再看** — 把暂时不看的页面存起来，不占 tab 位
- **一键 Kill** — 按卡片关闭、按域名全关、或全部清空
- **关闭特效** — 卡片消除动画 + 烟花粒子（可在设置中关闭）
- **关闭音效** — 丢垃圾音效反馈（可在设置中关闭）
- **每日金句** — 新标签页顶部随机显示一句话（可关闭）
- **中英双语** — 支持中文 / English 切换

---

## 安装（开发者模式）

1. 下载或 clone 本仓库
2. 安装依赖并构建：
   ```bash
   npm install
   npm run build
   ```
3. 打开 Chrome，访问 `chrome://extensions/`
4. 右上角开启 **开发者模式**
5. 点击 **加载未打包的扩展程序**，选择 `dist/` 目录
6. 打开新标签页即可使用

---

## 本地开发

```bash
npm install
npm run build   # 生产构建
```

修改代码后重新 `npm run build`，然后在 `chrome://extensions/` 点击刷新按钮。

---

## 技术栈

- React + TypeScript
- Vite
- Chrome Extension Manifest V3

---

## License

MIT
