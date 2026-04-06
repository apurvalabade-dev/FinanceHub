import { useState, useEffect, useMemo, useContext, createContext, useCallback } from "react";
import { SEED_DATA } from "../utils/constants";
import { fmt, monthKey, monthLabel } from "../utils/helpers";

const AppCtx = createContext(null);

/** Access global app state from any component */
export const useApp = () => useContext(AppCtx);

export function AppProvider({ children }) {
  const [txns,    setTxns]    = useState(SEED_DATA);
  const [dark,    setDark]    = useState(true);
  const [role,    setRole]    = useState("admin");
  const [page,    setPage]    = useState("dashboard");
  const [toasts,  setToasts]  = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate initial data load
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  // ── Toast system ──────────────────────────────────────────────────────────
  const toast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  }, []);

  // ── CRUD actions ──────────────────────────────────────────────────────────
  const addTxn = useCallback(
    (txn) => { setTxns((p) => [...p, { ...txn, id: Date.now() }]); toast(`Added — ${fmt(txn.amount)}`); },
    [toast]
  );

  const updateTxn = useCallback(
    (id, txn) => { setTxns((p) => p.map((t) => (t.id === id ? { ...txn, id } : t))); toast("Transaction updated"); },
    [toast]
  );

  const deleteTxn = useCallback(
    (id) => { setTxns((p) => p.filter((t) => t.id !== id)); toast("Transaction deleted", "error"); },
    [toast]
  );

  const exportCSV = useCallback(() => {
    const rows = [
      ["Date", "Category", "Amount", "Type", "Note"],
      ...txns.map((t) => [t.date, t.category, t.amount, t.type, t.note || ""]),
    ];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: "transactions.csv",
    });
    a.click();
    toast("CSV exported");
  }, [txns, toast]);

  // ── Derived totals ────────────────────────────────────────────────────────
  const totalIncome   = useMemo(() => txns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),  [txns]);
  const totalExpenses = useMemo(() => txns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0), [txns]);
  const balance       = totalIncome - totalExpenses;

  // ── Monthly breakdown ─────────────────────────────────────────────────────
  const monthlyData = useMemo(() => {
    const map = {};
    txns.forEach((t) => {
      const k = monthKey(t.date);
      if (!map[k]) map[k] = { month: monthLabel(k), income: 0, expenses: 0 };
      t.type === "income" ? (map[k].income += t.amount) : (map[k].expenses += t.amount);
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => ({ ...v, balance: v.income - v.expenses }));
  }, [txns]);

  // ── Category breakdown (expenses only) ───────────────────────────────────
  const catData = useMemo(() => {
    const map = {};
    txns.filter((t) => t.type === "expense").forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [txns]);

  // ── Real trend logic: compares last two months ────────────────────────────
  const { expDelta, incDelta, thisMonthExp, lastMonthExp } = useMemo(() => {
    const cur  = monthlyData[monthlyData.length - 1] || { income: 0, expenses: 0 };
    const prev = monthlyData[monthlyData.length - 2] || { income: 0, expenses: 0 };
    return {
      expDelta:     prev.expenses ? Math.round(((cur.expenses - prev.expenses) / prev.expenses) * 100) : 0,
      incDelta:     prev.income   ? Math.round(((cur.income   - prev.income)   / prev.income)   * 100) : 0,
      thisMonthExp: cur.expenses,
      lastMonthExp: prev.expenses,
    };
  }, [monthlyData]);

  // ── Recent 5 transactions ─────────────────────────────────────────────────
  const recentTxns = useMemo(
    () => [...txns].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    [txns]
  );

  // ── Auto-generated insights ───────────────────────────────────────────────
  const insights = useMemo(() => {
    const tot = catData.reduce((s, d) => s + d.value, 0) || 1;
    const top = catData[0] || null;
    const r   = [];
    if (top)          r.push({ icon: "⚠️", text: `You spent ${Math.round((top.value / tot) * 100)}% on ${top.name} — highest category.`, tip: "Consider setting a category budget." });
    if (expDelta > 5) r.push({ icon: "📈", text: `Expenses grew ${expDelta}% vs last month.`,                                             tip: "Review recent high-ticket transactions." });
    if (expDelta < -5)r.push({ icon: "✅", text: `Expenses dropped ${Math.abs(expDelta)}% — great discipline!`,                           tip: "Keep this momentum going." });
    if (incDelta > 0) r.push({ icon: "💵", text: `Income is up ${incDelta}% this month.`,                                                 tip: "A great time to top up your savings." });
    if (balance > 0)  r.push({ icon: "💡", text: `You have a positive balance of ${fmt(balance)}.`,                                       tip: "Consider allocating to investments." });
    return r;
  }, [catData, expDelta, incDelta, balance]);

  const value = {
    // State
    txns, dark, setDark, role, setRole, page, setPage, loading, toasts,
    // Actions
    addTxn, updateTxn, deleteTxn, exportCSV, toast,
    // Derived
    totalIncome, totalExpenses, balance,
    monthlyData, catData,
    expDelta, incDelta, thisMonthExp, lastMonthExp,
    recentTxns, insights,
    // Computed role flag
    isAdmin: role === "admin",
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
