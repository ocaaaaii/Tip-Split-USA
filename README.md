# TipSplit USA 🧾

> Smart tip calculator & fair bill splitter for dining in the United States
> 美國小費計算 × 公平分帳一站搞定

**Live app →** [tipsplit-usa.vercel.app](https://tipsplit-usa.vercel.app)

---

## ✨ What It Does

TipSplit USA takes the math and awkwardness out of splitting the check. Enter your bill, pick a tip, and it instantly shows everyone's share — taxes, tips, and all — down to the cent.

---

## 🚀 Quick Start

1. Open the app and **enter your bill amount** on the number pad
2. Toggle **"Pre-tax"** if your receipt already includes tax
3. Pick a **tip percentage** (or enter a custom amount)
4. Choose a **dining scenario** to get context-aware suggestions
5. Head to **Split** to divide the bill

---

## 📱 Feature Guide

### 🧮 Calculator (Home Screen)

| Feature | How to use |
|---|---|
| **Number pad** | Tap digits to enter bill amount |
| **Pre-tax toggle** | Enable if the amount on your receipt already includes tax — app back-calculates the pre-tax base |
| **Tip buttons** | Quick-select 15 / 18 / 20 / 25 % or tap **Custom** to type any amount |
| **Scenario selector** | Swipe through 7 scenarios (Restaurant / Takeout / Bar / Taxi / Hotel / Salon / Delivery) — each has context tips |
| **Live breakdown** | Subtotal · Tax · Tip · Total updates in real time as you type |

---

### 🌐 Location & Tax Rate

The app auto-detects your location via browser geolocation and looks up the local tax rate for your state (and city where applicable).

- **Online**: pulls live tax data for 50 states + major cities
- **Offline / Location denied**: falls back to a built-in tax library — just tap the tax badge to set it manually

---

### 👥 Split — Even Split

Go to **Split → Even Split**:

1. Use **＋ / −** to set the number of people
2. The app shows each person's share including their proportional tax and tip
3. The first person absorbs any 1-cent rounding remainder automatically
4. Tap **Summary** to share the result

---

### 🧾 Split — Itemized

Go to **Split → Itemized** when people ordered different things:

1. **Add participants** — each gets a color dot
2. **Add items** — enter item name and price, then assign it to one or more people
3. Mark items as 🍷 **Alcohol** to exclude non-drinkers from that cost
4. Tax and tip are distributed **proportionally** based on each person's food total
5. 1-cent rounding is handled automatically

> **Math:** `Person's tax = Total tax × (Person's subtotal ÷ Bill subtotal)`

---

### 📋 Summary & Sharing

The Summary page shows each person's final amount with:

- Individual QR codes — tablemates scan to see exactly what they owe
- **Copy** button for each person's breakdown
- **Share** button to send the full split via iMessage, WhatsApp, or any app
- Bill auto-saves to history (last 20 bills stored locally)

---

### 💱 Currency Conversion

Tap the **currency button** (top right) to see amounts in:

| Currency | |
|---|---|
| TWD 🇹🇼 | NT$ |
| KRW 🇰🇷 | ₩ |
| JPY 🇯🇵 | ¥ |
| CNY 🇨🇳 | ¥ |
| HKD 🇭🇰 | HK$ |
| BRL 🇧🇷 | R$ |
| MXN 🇲🇽 | MX$ |
| SGD 🇸🇬 | S$ |
| EUR 🇪🇺 | € |
| **✕ No conversion** | USD only |

- 🟢 **Live rates**: fetched from open.er-api.com (refreshed hourly)
- 🟡 **Est. Rate**: offline fallback — rates are approximate

---

### 🌍 Language

Tap the language button to switch between:

**English · 繁體中文 · 简体中文 · 日本語 · 한국어 · Español · Português**

All UI text, tip culture cards, and alerts switch instantly.

---

### 🌙 Dark Mode

Tap the **💻 / 🌙 / ☀️** button to cycle through:

- **💻 Auto** — follows your device system setting
- **🌙 Dark** — Maillard dark theme (warm espresso tones)
- **☀️ Light** — Morandi cream palette

---

### 📊 Stats Dashboard

The **Stats** tab tracks your tipping history:

- Total spent, average tip %, number of bills
- Breakdown by scenario (Restaurant / Bar / Hotel…)
- Recent bill log with dates and amounts

---

### 📚 Tip Culture Cards

Tap the **🎓** button on the home screen to open scenario-specific tipping guides:

- Expected tip ranges by meal type (lunch vs. dinner) and venue tier
- When auto-gratuity applies (usually 6+ people, can reach 25–30%)
- Cash vs. card: cash tips go directly to your server; card tips may enter a tip pool
- Post-COVID tip fatigue: pressing 0% or Skip on takeout iPads is perfectly fine
- State minimum wage context (e.g. CA at $18–20/hr still expects tips)

---

### ⚠️ Smart Alerts

| Alert | Trigger |
|---|---|
| **Auto-Gratuity** | 6+ people — service charge may already be included |
| **Tip-screen pressure** | Takeout / fast food — reminder that tipping is optional |
| **Service charge detected** | Keywords like "service charge" or "gratuity" found in receipt |

---

## 🔢 The Math

```
Pre-tax base    = Inclusive amount ÷ (1 + tax rate)
Tax amount      = Pre-tax base × tax rate
Tip amount      = Pre-tax base × tip %
Total           = Pre-tax base + tax + tip

── Itemized split ──
Person's tax    = Total tax  × (Person's items ÷ Bill subtotal)
Person's tip    = Total tip  × (Person's items ÷ Bill subtotal)
Person's total  = Person's items + Person's tax + Person's tip
1¢ remainder   → absorbed by the first person
```

---

## 🛠 Tech Stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| State | Zustand |
| Exchange rates | open.er-api.com (with offline fallback) |
| i18n | Custom lightweight system (7 languages) |
| PWA | Service Worker + Web App Manifest |

---

*developed by CA & SC*
