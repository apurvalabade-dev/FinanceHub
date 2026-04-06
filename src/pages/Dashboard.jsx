import { Plus, TrendingUp, TrendingDown, Pencil, Trash2, ArrowRight } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { useApp } from "../context/AppContext";
import { useTheme } from "../hooks/useTheme";
import { AMBER, CATEGORY_CONFIG } from "../utils/constants";
import { fmt } from "../utils/helpers";
import Empty from "../components/common/Empty";

// ─── Skeleton loader ──────────────────────────────────────────────────────────

const Skel = ({ w = "100%", h = 16, r = 6, mb = 0 }) => (
  <div className="sk" style={{ width: w, height: h, borderRadius: r, marginBottom: mb }} />
);

function DashSkel() {
  const th = useTheme();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Skel h={26} w="160px" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ background: th.card, borderRadius: 12, padding: "14px 16px", border: `1px solid ${th.border}` }}>
            <Skel h={10} w="55%" mb={12} /><Skel h={22} w="75%" mb={8} /><Skel h={10} w="45%" />
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 10 }}>
        <div style={{ background: th.card, borderRadius: 12, padding: "14px 16px", border: `1px solid ${th.border}`, height: 200 }}>
          <Skel h={10} w="110px" mb={14} /><Skel h={158} />
        </div>
        <div style={{ background: th.card, borderRadius: 12, padding: "14px 16px", border: `1px solid ${th.border}` }}>
          <Skel h={10} w="90px" mb={12} /><Skel h={100} mb={10} />
          {[0, 1, 2].map((i) => <Skel key={i} h={9} mb={7} />)}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[0, 1].map((i) => (
          <div key={i} style={{ background: th.card, borderRadius: 12, padding: "14px 16px", border: `1px solid ${th.border}` }}>
            <Skel h={10} w="110px" mb={14} />
            {[0, 1, 2].map((j) => <Skel key={j} h={42} mb={8} r={9} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Summary cards ────────────────────────────────────────────────────────────

function DashCards() {
  const { balance, totalIncome, totalExpenses, expDelta, incDelta } = useApp();
  const th = useTheme();

  const cards = [
    { label: "Balance",  icon: "💰", value: fmt(Math.abs(balance)),  color: balance >= 0 ? "#10b981" : "#ef4444", prefix: balance < 0 ? "-" : "", delta: "All time net",                                            up: null       },
    { label: "Income",   icon: "💵", value: fmt(totalIncome),         color: "#10b981",                            prefix: "",                       delta: `${incDelta > 0 ? "+" : ""}${incDelta}% vs last month`, up: incDelta >= 0 },
    { label: "Expenses", icon: "💸", value: fmt(totalExpenses),        color: "#ef4444",                            prefix: "",                       delta: `${expDelta > 0 ? "+" : ""}${expDelta}% vs last month`, up: expDelta <= 0 },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
      {cards.map((c, i) => (
        <div key={c.label} className={`card fu d${i}`} style={{ background: th.card, borderRadius: 12, padding: "14px 16px", border: `1px solid ${th.border}`, cursor: "default" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 10, color: th.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{c.label}</span>
            <span style={{ fontSize: 16 }}>{c.icon}</span>
          </div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: c.color, letterSpacing: "-0.5px", marginBottom: 6 }}>{c.prefix}{c.value}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: c.up === null ? th.muted : c.up ? "#10b981" : "#ef4444" }}>
            {c.up === true  && <TrendingUp   size={9} />}
            {c.up === false && <TrendingDown size={9} />}
            {c.delta}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Charts ───────────────────────────────────────────────────────────────────

function DashCharts() {
  const { monthlyData, catData } = useApp();
  const th = useTheme();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 10 }}>
      {/* Balance trend area chart */}
      <div className="card fu d3" style={{ background: th.card, borderRadius: 12, padding: "14px 16px", border: `1px solid ${th.border}` }}>
        <h3 style={{ fontSize: 11, fontWeight: 600, marginBottom: 12 }}>📈 Balance Trend</h3>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={158}>
            <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -14, bottom: 0 }}>
              <defs>
                <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={AMBER} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={AMBER} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={th.border} />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: th.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: th.muted }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 8, fontSize: 11, color: th.text }} formatter={(v) => [fmt(v), "Balance"]} />
              <Area type="monotone" dataKey="balance" stroke={AMBER} strokeWidth={2.5} fill="url(#gb)" dot={{ fill: AMBER, r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <Empty icon="📈" msg="No data yet" sub="Add income or expenses to see your balance trend" />
        )}
      </div>

      {/* Spending by category donut */}
      <div className="card fu d4" style={{ background: th.card, borderRadius: 12, padding: "14px 16px", border: `1px solid ${th.border}` }}>
        <h3 style={{ fontSize: 11, fontWeight: 600, marginBottom: 8 }}>🥧 By Category</h3>
        {catData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={98}>
              <PieChart>
                <Pie data={catData} cx="50%" cy="50%" innerRadius={26} outerRadius={42} paddingAngle={2} dataKey="value">
                  {catData.map((d, i) => <Cell key={i} fill={CATEGORY_CONFIG[d.name]?.color || "#6b7280"} />)}
                </Pie>
                <Tooltip contentStyle={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 8, fontSize: 11, color: th.text }} formatter={(v) => [fmt(v)]} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 6 }}>
              {catData.slice(0, 4).map((d) => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: CATEGORY_CONFIG[d.name]?.color || "#6b7280", flexShrink: 0 }} />
                  <span style={{ flex: 1, color: th.muted }}>{d.name}</span>
                  <span style={{ fontWeight: 600, color: th.text }}>{fmt(d.value)}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <Empty icon="🥧" msg="No expenses yet" sub="Add an expense to see spending by category" />
        )}
      </div>
    </div>
  );
}

// ─── Smart Insights card ──────────────────────────────────────────────────────

function DashInsights() {
  const { insights } = useApp();
  const th = useTheme();

  return (
    <div className="card fu d4" style={{ background: th.card, borderRadius: 12, padding: "14px 16px", border: `1px solid ${th.border}` }}>
      <h3 style={{ fontSize: 11, fontWeight: 600, marginBottom: 3 }}>💡 Smart Insights</h3>
      <p style={{ fontSize: 10, color: th.muted, marginBottom: 12 }}>Auto-generated from your spending patterns</p>
      {insights.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {insights.map((ins, i) => (
            <div key={i} className={`sl d${i}`} style={{ display: "flex", gap: 9, alignItems: "flex-start", padding: "9px 12px", background: th.inset, borderRadius: 9, borderLeft: `3px solid ${AMBER}` }}>
              <span style={{ fontSize: 12, flexShrink: 0 }}>{ins.icon}</span>
              <div>
                <div style={{ fontSize: 11, color: th.text, marginBottom: 3, lineHeight: 1.5 }}>{ins.text}</div>
                <div style={{ fontSize: 10, color: AMBER, fontWeight: 600 }}>→ {ins.tip}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Empty icon="💡" msg="No insights yet" sub="Add at least 2 months of transactions to generate smart insights" />
      )}
    </div>
  );
}

// ─── Recent Transactions widget ───────────────────────────────────────────────

function RecentTxns({ openEdit }) {
  const { recentTxns, deleteTxn, isAdmin, setPage } = useApp();
  const th = useTheme();

  return (
    <div className="card fu d5" style={{ background: th.card, borderRadius: 12, padding: "14px 16px", border: `1px solid ${th.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ fontSize: 11, fontWeight: 600 }}>🕐 Recent Transactions</h3>
        <button
          onClick={() => setPage("transactions")}
          style={{ display: "flex", alignItems: "center", gap: 3, background: "none", border: "none", color: AMBER, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
        >
          View all <ArrowRight size={10} />
        </button>
      </div>

      {recentTxns.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {recentTxns.map((txn, i) => {
            const cc = CATEGORY_CONFIG[txn.category]?.color || "#6b7280";
            return (
              <div
                key={txn.id}
                className={`sl d${i}`}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, background: th.hover, transition: "background .15s", cursor: "default" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = th.border)}
                onMouseLeave={(e) => (e.currentTarget.style.background = th.hover)}
              >
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${cc}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>
                  {CATEGORY_CONFIG[txn.category]?.emoji || "📦"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: th.text, marginBottom: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{txn.note || txn.category}</div>
                  <div style={{ fontSize: 10, color: th.muted }}>{new Date(txn.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</div>
                </div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 13, fontWeight: 700, color: txn.type === "income" ? "#10b981" : "#ef4444", flexShrink: 0 }}>
                  {txn.type === "income" ? "+" : "-"}{fmt(txn.amount)}
                </div>
                {isAdmin && (
                  <div style={{ display: "flex", gap: 1 }}>
                    <button onClick={() => openEdit(txn)} style={{ background: "none", border: "none", color: th.muted, cursor: "pointer", padding: 3, display: "flex", transition: "color .15s" }} onMouseEnter={(e) => (e.currentTarget.style.color = th.text)} onMouseLeave={(e) => (e.currentTarget.style.color = th.muted)}><Pencil size={10} /></button>
                    <button onClick={() => deleteTxn(txn.id)} style={{ background: "none", border: "none", color: th.muted, cursor: "pointer", padding: 3, display: "flex", transition: "color .15s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")} onMouseLeave={(e) => (e.currentTarget.style.color = th.muted)}><Trash2 size={10} /></button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <Empty icon="🕐" msg="No transactions yet" sub="Click 'Add' in the top bar to record your first transaction" />
      )}
    </div>
  );
}

// ─── Dashboard page (exported) ────────────────────────────────────────────────

export default function Dashboard({ openAdd, openEdit }) {
  const { loading, isAdmin } = useApp();
  const th = useTheme();

  if (loading) return <DashSkel />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header */}
      <div className="fu d0" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, letterSpacing: "-0.5px" }}>Dashboard</h1>
          <p style={{ fontSize: 11, color: th.muted, marginTop: 2 }}>Track your income, expenses, and financial trends</p>
        </div>
        {isAdmin && (
          <button className="bp fu d1" onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 13px", borderRadius: 9, fontSize: 11 }}>
            <Plus size={11} /> Add Transaction
          </button>
        )}
      </div>

      <DashCards />
      <DashCharts />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <DashInsights />
        <RecentTxns openEdit={openEdit} />
      </div>
    </div>
  );
}
