# FinanceHub 💰

A personal finance tracker built with React. Track income, expenses, and financial trends with a clean, role-based UI.

---

## Features

| Feature | Details |
|---|---|
| **Dashboard** | Summary cards with real % trends, balance area chart, spending donut, smart insights, recent transactions |
| **Transactions** | Full CRUD — add, edit, delete. Filter by type & category, sort 4 ways, export as CSV |
| **Insights** | Top category, monthly comparison, expense trend, animated category breakdown bars, auto-generated insights |
| **Role system** | Admin (full access) / Viewer (read-only) — toggle in the top bar |
| **Dark / Light mode** | Full theme toggle with smooth transition |
| **Smart Insights** | Auto-generated from real monthly data — no hardcoded values |
| **Loading skeleton** | Anatomically correct placeholder on first render |
| **Toast notifications** | Success / error feedback for every action |
| **Keyboard shortcuts** | `⌘K` focuses search · `⌘N` opens Add modal · `Esc` closes modal |
| **Validation** | Inline error + toast on invalid form submit |
| **Empty states** | Every section has an actionable empty state |

---

## Tech Stack

- **React 18** — UI
- **Vite 5** — build tooling
- **Recharts** — area chart + donut chart
- **Lucide React** — icons
- **Context API** — global state (no Redux needed)
- **Pure inline styles** — no CSS framework dependency

---

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx        # Collapsible navigation
│   │   └── Topbar.jsx         # Search, dark mode, role selector
│   └── common/
│       ├── Modal.jsx          # Add / Edit transaction modal
│       ├── Toasts.jsx         # Toast notification renderer
│       └── Empty.jsx          # Reusable empty state
│
├── context/
│   └── AppContext.jsx         # Global state, CRUD actions, derived data
│
├── hooks/
│   └── useTheme.js            # Theme tokens from dark/light mode
│
├── pages/
│   ├── Dashboard.jsx          # Cards, charts, insights, recent transactions
│   ├── Transactions.jsx       # Filterable table with CSV export
│   └── Insights.jsx           # Metric cards, breakdown bars, smart insights
│
├── utils/
│   ├── constants.js           # Design tokens, category config, seed data
│   └── helpers.js             # fmt(), monthKey(), monthLabel(), todayStr()
│
├── styles/
│   └── GlobalStyles.jsx       # Injected CSS: animations, utility classes
│
├── App.jsx                    # Root shell: layout + keyboard shortcuts
└── main.jsx                   # React entry point
```

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (opens at http://localhost:3000)
npm run dev

# 3. Build for production
npm run build
```

---

## State Management

All state lives in `AppContext.jsx` and is consumed via the `useApp()` hook.
No prop drilling — any component accesses what it needs directly.

```js
// Example: reading transactions in any component
const { txns, addTxn, deleteTxn } = useApp();
```

---

## Trend Logic

Income and expense deltas are calculated from **real monthly data**, not hardcoded:

```js
const expDelta = prev.expenses
  ? Math.round(((cur.expenses - prev.expenses) / prev.expenses) * 100)
  : 0;
```

---

## Role System

| Role | Permissions |
|---|---|
| 👑 Admin | Add, edit, delete transactions · Export CSV |
| 👁 Viewer | View all data · No write access |

Switch roles using the dropdown in the top bar.
