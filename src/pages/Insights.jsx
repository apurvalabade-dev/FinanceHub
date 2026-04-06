import { useApp } from "../context/AppContext";
import { useTheme } from "../hooks/useTheme";
import { AMBER, CATEGORY_CONFIG } from "../utils/constants";
import { fmt } from "../utils/helpers";
import Empty from "../components/common/Empty";

/**
 * Insights page showing:
 *  - Top category, monthly comparison, expense trend cards
 *  - Animated category breakdown bars
 *  - Auto-generated smart insights
 */
export default function Insights() {
  const { catData, insights, expDelta, thisMonthExp, lastMonthExp, totalExpenses } = useApp();
  const th  = useTheme();
  const tot = totalExpenses || 1;

  const trend      = expDelta > 5 ? "Increasing" : expDelta < -5 ? "Decreasing" : "Stable";
  const trendColor = expDelta > 5 ? "#ef4444"   : expDelta < -5 ? "#10b981"   : th.muted;
  const topCat     = catData[0] || null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Header */}
      <div className="fu d0">
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, letterSpacing: "-0.5px" }}>Insights</h1>
        <p style={{ fontSize: 11, color: th.muted, marginTop: 2 }}>Deep analysis of your spending patterns</p>
      </div>

      {/* Metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>

        {/* Top Category */}
        <div className="card fu d1" style={{ background: th.card, borderRadius: 12, padding: "14px 16px", border: `1px solid ${th.border}` }}>
          <div style={{ fontSize: 9, color: th.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>🥇 Top Category</div>
          {topCat ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: CATEGORY_CONFIG[topCat.name]?.color || "#6b7280" }} />
                <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16 }}>{topCat.name}</span>
              </div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: CATEGORY_CONFIG[topCat.name]?.color || th.text, marginBottom: 2 }}>{fmt(topCat.value)}</div>
              <div style={{ fontSize: 10, color: th.muted, marginBottom: 9 }}>{Math.round((topCat.value / tot) * 100)}% of total</div>
              <div style={{ fontSize: 10, color: AMBER, fontWeight: 600 }}>→ Consider reducing here</div>
            </>
          ) : (
            <Empty icon="🥇" msg="No expense data yet" sub="Add your first expense to see top spending categories" />
          )}
        </div>

        {/* Monthly Compare */}
        <div className="card fu d2" style={{ background: th.card, borderRadius: 12, padding: "14px 16px", border: `1px solid ${th.border}` }}>
          <div style={{ fontSize: 9, color: th.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>📊 Monthly Compare</div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: th.muted, marginBottom: 2 }}>This Month</div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#ef4444" }}>{fmt(thisMonthExp)}</div>
          </div>
          <div style={{ marginBottom: 9 }}>
            <div style={{ fontSize: 10, color: th.muted, marginBottom: 2 }}>Last Month</div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 15, color: th.text }}>{fmt(lastMonthExp)}</div>
          </div>
          <div style={{ fontSize: 10, color: AMBER, fontWeight: 600 }}>
            → {expDelta > 0 ? `Up ${expDelta}%` : expDelta < 0 ? `Down ${Math.abs(expDelta)}%` : "Holding steady"}
          </div>
        </div>

        {/* Expense Trend */}
        <div className="card fu d3" style={{ background: th.card, borderRadius: 12, padding: "14px 16px", border: `1px solid ${th.border}` }}>
          <div style={{ fontSize: 9, color: th.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>📈 Expense Trend</div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: trendColor, marginBottom: 4 }}>{trend}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: trendColor, marginBottom: 9 }}>{expDelta > 0 ? "+" : ""}{expDelta}%</div>
          <div style={{ fontSize: 10, color: AMBER, fontWeight: 600 }}>→ Monitor monthly closely</div>
        </div>
      </div>

      {/* Category Breakdown bars */}
      <div className="card fu d4" style={{ background: th.card, borderRadius: 12, padding: "14px 16px", border: `1px solid ${th.border}` }}>
        <h3 style={{ fontSize: 11, fontWeight: 600, marginBottom: 14 }}>Category Breakdown</h3>
        {catData.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {catData.map((d, i) => {
              const pct   = Math.round((d.value / tot) * 100);
              const color = CATEGORY_CONFIG[d.name]?.color || "#6b7280";
              return (
                <div key={d.name} className={`sl d${Math.min(i, 5)}`}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
                      <span style={{ fontWeight: 500 }}>{d.name}</span>
                    </div>
                    <span style={{ color: th.muted }}>{fmt(d.value)} <span style={{ color: th.text }}>({pct}%)</span></span>
                  </div>
                  <div style={{ height: 5, background: th.border, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width .7s cubic-bezier(.4,0,.2,1)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Empty icon="📊" msg="No expense data" sub="Add expenses to see a breakdown" />
        )}
      </div>

      {/* Smart Insights */}
      {insights.length > 0 && (
        <div className="card fu d5" style={{ background: th.card, borderRadius: 12, padding: "14px 16px", border: `1px solid ${th.border}` }}>
          <h3 style={{ fontSize: 11, fontWeight: 600, marginBottom: 3 }}>💡 Smart Insights</h3>
          <p style={{ fontSize: 10, color: th.muted, marginBottom: 12 }}>Auto-generated from your spending patterns</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {insights.map((ins, i) => (
              <div key={i} className={`sl d${Math.min(i, 5)}`} style={{ display: "flex", gap: 9, alignItems: "flex-start", padding: "9px 12px", background: th.inset, borderRadius: 9, borderLeft: `3px solid ${AMBER}` }}>
                <span style={{ fontSize: 12, flexShrink: 0 }}>{ins.icon}</span>
                <div>
                  <div style={{ fontSize: 11, color: th.text, marginBottom: 2, lineHeight: 1.5 }}>{ins.text}</div>
                  <div style={{ fontSize: 10, color: AMBER, fontWeight: 600 }}>→ {ins.tip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
