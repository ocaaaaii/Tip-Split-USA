# TipSplit USA

> 美國小費與分帳萬能助手 — Smart tip calculator & bill splitter for dining in the US

---

## 快速啟動（本機開發）

```bash
cd "TipSplit USA"
npm install
npm run dev
```

打開瀏覽器訪問 **http://localhost:3000**，用手機掃描 QR Code 或輸入本機 IP 即可行動測試。

---

## 部署到網路（推薦：Vercel）

### 為什麼選 Vercel？
- Next.js 官方親爸爸，零設定即部署
- 免費方案足夠個人/小組使用
- 自動 HTTPS、全球 CDN、自動 CI/CD（推 GitHub 自動重新部署）
- 部署完立刻獲得 `xxx.vercel.app` 公開網址，手機直接可用

### 步驟 1 — 上傳 GitHub

1. 到 [github.com](https://github.com) 建立新 repository（例如：`tipsplit-usa`）
2. 在 `TipSplit USA` 資料夾裡執行：

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的帳號/tipsplit-usa.git
git push -u origin main
```

> 如果沒裝 Git，先到 https://git-scm.com 下載安裝。

### 步驟 2 — Vercel 一鍵部署

1. 去 [vercel.com](https://vercel.com) 用 GitHub 帳號登入（免費）
2. 點 **"Add New Project"**
3. 選擇剛剛的 `tipsplit-usa` repo → 點 **Import**
4. Framework 自動偵測為 **Next.js** ✓
5. 點 **Deploy** — 約 1 分鐘後完成！

部署完成後你會得到：
```
https://tipsplit-usa.vercel.app
```

手機直接輸入這個網址，或掃描 Vercel 提供的 QR Code 即可使用。

### 步驟 3 — 之後更新（自動）

只要推新 commit 到 GitHub，Vercel 自動重新部署：

```bash
git add .
git commit -m "更新功能"
git push
```

---

## 其他部署選項比較

| 方案 | 費用 | 難度 | 適合 |
|------|------|------|------|
| **Vercel（推薦）** | 免費 | ⭐ 超簡單 | 個人/小組 |
| Netlify | 免費 | ⭐ 簡單 | 靜態站（需額外設定 Next.js） |
| Railway | 有免費額度 | ⭐⭐ 中等 | 全端 App |
| 自架 VPS | 月費 $5+ | ⭐⭐⭐ 難 | 進階用戶 |

---

## 功能總覽

| 功能 | 說明 |
|------|------|
| 🌐 GPS 定位 | 自動偵測位置，帶入當地稅率 |
| 📍 離線稅率 | 無網路自動降級至內建庫（20州 + 主要城市） |
| 🧮 稅前/稅後切換 | 推薦稅前計算，幫你省錢 |
| 🍽️ 7 種場景 | 餐廳/外帶/酒吧/計程車/飯店/美髮/外送 |
| 🚨 Auto-Gratuity 警示 | 6 人以上自動提醒 |
| 💡 反勒索國防 | 外帶/快餐提示可按 Skip |
| 👥 均分 + 品項拆帳 | 兩種分帳模式，1 分錢誤差自動處理 |
| 📷 Tesseract OCR | 前端離線掃描收據，不上傳任何資料 |
| ⚖️ 比例分攤演算法 | 稅金與小費按個人消費比例公平分攤 |
| 💱 6 種外幣 | TWD/CNY/JPY/EUR/HKD，即時匯率 |
| 🌍 中英切換 | 頂部一鍵切換全介面語言 |
| 📱 RWD 響應式 | 手機/平板/桌機全適配，桌機顯示居中卡片 |
| 📤 一鍵分享 | iMessage / Venmo / 複製文字 |

## 核心數學公式

```
個人稅金 = 總稅金 × (個人餐費 / 帳單稅前小計)
個人小費 = 總小費 × (個人餐費 / 帳單稅前小計)
個人總額 = 個人餐費 + 個人稅金 + 個人小費

1 分錢誤差 → 自動歸入第一位付款人
含稅金額逆推 → 稅前 = 含稅總額 / (1 + 稅率%)
```

## 技術架構

- **Framework**: Next.js 14 (App Router)
- **樣式**: Tailwind CSS (Morandi Cream Palette)
- **狀態管理**: Zustand
- **OCR**: Tesseract.js (前端離線)
- **匯率 API**: open.er-api.com（免費，有離線 fallback）
- **i18n**: 自製輕量雙語系統（zh-TW / en）
