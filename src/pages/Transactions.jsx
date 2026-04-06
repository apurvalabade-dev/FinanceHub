import { useState, useMemo } from "react";
import { Plus, Download, Pencil, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useTheme } from "../hooks/useTheme";
import { CATEGORIES, CATEGORY_CONFIG } from "../utils/constants";
import { fmt } from "../utils/helpers";
import Empty from "../components/common/Empty";

/**
 * Transactions page with filter controls, sortable table, CSV export,
 * and inline edit/delete actions (admin only).
 *
 * Props:
 *  openAdd  — opens Add modal
 *  openEdit — opens Edit modal with selected transaction
 */
export default function Transactions({ openAdd, openEdit }) {
  const { txns, deleteTxn, exportCSV, isAdmin } = useApp();
  const th = useTheme();

  const [ft, setFt] = useState("all");        // type filter
  const [fc, setFc] = useState("all");        // category filter
  const [sb, setSb] = useState("date-desc"); // sort order

  // Apply filters and sort
  const list = useMemo(() => {
    let l = [...txns];
    if (ft !== "all") l = l.filter((t) => t.type === t.type && t.type === ft);
    if (fc !== "all") l = l.filter((t) => t.category === fc);
    if (sb === "date-desc")    l.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sb === "date-asc")    l.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (sb === "amount-desc") l.sort((a, b) => b.amount - a.amount);
    else                           l.sort((a, b) => a.amount - b.amount);
    return l;
  }, [txns, ft, fc, sb]);

  const selStyle = {
    background: th.input, border: `1px solid ${th.border}`,
    borderRadius: 7, padding: "5px 9px", color: th.text,
    fontSize: 11, cursor: "pointer", outline: "none",
    fontFamily: "'DM Sans', sans-serif",
  };

  const columns = ["Date", "Category", "Note", "Amount", "Type", ...(isAdmin ? ["Action"] : [])];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Page header */}
      <div className="fu d0" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, letterSpacing: "-0.5px" }}>Transactions</h1>
          <p style={{ fontSize: 11, color: th.muted, marginTop: 2 }}>{list.length} record{list.length !== 1 ? "s" : ""}</p>
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          <button className="bg" onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 11px", borderRadius: 7, fontSize: 11 }}>
            <Download size={11} /> Export as CSV
          </button>
          {isAdmin && (
            <button className="bp" onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 7, fontSize: 11 }}>
              <Plus size={11} /> Add
            </button>
          )}
        </div>
      </div>

      {/* Filters & sort */}
      <div className="fu d1" style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        <select value={ft} onChange={(e) => setFt(e.target.value)} style={selStyle}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={fc} onChange={(e) => setFc(e.target.value)} style={selStyle}>
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sb} onChange={(e) => setSb(e.target.value)} style={selStyle}>
          <option value="date-desc">Latest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>

      {/* Table */}
      <div className="fu d2" style={{ background: th.card, borderRadius: 12, border: `1px solid ${th.border}`, overflow: "hidden" }}>
        {list.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${th.border}` }}>
                  {columns.map((h) => (
                    <th key={h} style={{ padding: "9px 13px", textAlign: "left", color: th.muted, fontWeight: 600, fontSize: 9, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.map((txn, i) => {
                  const cc = CATEGORY_CONFIG[txn.category]?.color || "#6b7280";
                  return (
                    <tr key={txn.id} className="row" style={{ borderBottom: i < list.length - 1 ? `1px solid ${th.border}` : "none" }}>
                      <td style={{ padding: "9px 13px", color: th.muted, whiteSpace: "nowrap" }}>
                        {new Date(txn.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                      </td>
                      <td style={{ padding: "9px 13px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: cc, flexShrink: 0 }} />
                          <span style={{ fontWeight: 500 }}>{txn.category}</span>
                        </div>
                      </td>
                      <td style={{ padding: "9px 13px", color: th.muted, maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {txn.note || "—"}
                      </td>
                      <td style={{ padding: "9px 13px", fontWeight: 700, fontFamily: "'DM Serif Display', serif", fontSize: 12, color: txn.type === "income" ? "#10b981" : "#ef4444" }}>
                        {txn.type === "income" ? "+" : "-"}{fmt(txn.amount)}
                      </td>
                      <td style={{ padding: "9px 13px" }}>
                        <span style={{
                          display: "inline-block", padding: "2px 8px", borderRadius: 20,
                          fontSize: 9, fontWeight: 600,
                          background: txn.type === "income" ? (th.dark ? "#022c22" : "#ecfdf5") : (th.dark ? "#450a0a" : "#fef2f2"),
                          color: txn.type === "income" ? "#10b981" : "#ef4444",
                        }}>
                          {txn.type === "income" ? "Income" : "Expense"}
                        </span>
                      </td>
                      {isAdmin && (
                        <td style={{ padding: "9px 13px" }}>
                          <div style={{ display: "flex", gap: 2 }}>
                            <button onClick={() => openEdit(txn)} style={{ background: "none", border: "none", color: th.muted, cursor: "pointer", padding: 3, display: "flex", transition: "color .15s" }} onMouseEnter={(e) => (e.currentTarget.style.color = th.text)} onMouseLeave={(e) => (e.currentTarget.style.color = th.muted)}>
                              <Pencil size={10} />
                            </button>
                            <button onClick={() => deleteTxn(txn.id)} style={{ background: "none", border: "none", color: th.muted, cursor: "pointer", padding: 3, display: "flex", transition: "color .15s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")} onMouseLeave={(e) => (e.currentTarget.style.color = th.muted)}>
                              <Trash2 size={10} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            icon="📭"
            msg="No transactions found"
            sub={isAdmin ? "Try adjusting your filters, or click 'Add' to create one" : "Try adjusting your filters"}
          />
        )}
      </div>
    </div>
  );
}
