import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useTheme } from "../../hooks/useTheme";
import { AMBER, CATEGORIES, CATEGORY_CONFIG } from "../../utils/constants";
import { todayStr } from "../../utils/helpers";

const BLANK = { amount: "", category: "Food", type: "expense", date: todayStr(), note: "" };

/**
 * Modal for adding a new transaction or editing an existing one.
 * Includes inline validation with error feedback and toast on invalid submit.
 *
 * Props:
 *  open     — boolean, controls visibility
 *  onClose  — callback to close the modal
 *  editTxn  — transaction object to edit, or null for "add" mode
 */
export default function Modal({ open, onClose, editTxn }) {
  const { addTxn, updateTxn, toast } = useApp();
  const th = useTheme();

  const [form, setForm] = useState(BLANK);
  const [err,  setErr]  = useState("");

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErr(""); };

  useEffect(() => {
    if (!open) return;
    setErr("");
    setForm(
      editTxn
        ? { amount: String(editTxn.amount), category: editTxn.category, type: editTxn.type, date: editTxn.date, note: editTxn.note || "" }
        : { ...BLANK, date: todayStr() }
    );
  }, [open, editTxn]);

  if (!open) return null;

  const save = () => {
    const amt = Number(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) {
      setErr("Please enter a valid amount greater than 0");
      toast("Enter a valid amount", "error");
      return;
    }
    editTxn ? updateTxn(editTxn.id, { ...form, amount: amt }) : addTxn({ ...form, amount: amt });
    onClose();
  };

  const inp = {
    width: "100%", padding: "9px 11px", borderRadius: 8,
    background: th.input, color: th.text, fontSize: 12,
    outline: "none", fontFamily: "'DM Sans', sans-serif", transition: "border-color .2s",
  };
  const lbl = {
    fontSize: 9, fontWeight: 600, color: th.muted, marginBottom: 5,
    display: "block", textTransform: "uppercase", letterSpacing: "0.8px",
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,.72)", zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="si"
        style={{
          background: th.card, borderRadius: 16, width: "100%", maxWidth: 408,
          padding: 24, border: `1px solid ${th.border}`, boxShadow: "0 28px 72px rgba(0,0,0,.5)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, fontWeight: 400 }}>
            {editTxn ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: th.muted, cursor: "pointer", display: "flex", padding: 4, borderRadius: 6, transition: "color .2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = th.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = th.muted)}
          >
            <X size={14} />
          </button>
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>

          {/* Amount with validation */}
          <div>
            <label style={lbl}>Amount (₹)</label>
            <input
              autoFocus type="number" placeholder="0"
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
              style={{ ...inp, border: `1px solid ${err ? "#ef4444" : th.border}` }}
              onFocus={(e) => (e.target.style.borderColor = err ? "#ef4444" : AMBER)}
              onBlur={(e)  => (e.target.style.borderColor = err ? "#ef4444" : th.border)}
            />
            {err && <div style={{ fontSize: 10, color: "#ef4444", marginTop: 5 }}>{err}</div>}
          </div>

          {/* Category */}
          <div>
            <label style={lbl}>Category</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              style={{ ...inp, border: `1px solid ${th.border}`, cursor: "pointer" }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_CONFIG[c].emoji} {c}</option>
              ))}
            </select>
          </div>

          {/* Type toggle */}
          <div>
            <label style={lbl}>Type</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["income", "expense"].map((type) => (
                <button
                  key={type}
                  onClick={() => set("type", type)}
                  style={{
                    flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer",
                    fontWeight: 600, fontSize: 11, fontFamily: "'DM Sans', sans-serif",
                    transition: "all .2s",
                    border: `1px solid ${form.type === type ? (type === "income" ? "#10b981" : "#ef4444") : th.border}`,
                    background: form.type === type
                      ? (type === "income" ? (th.dark ? "#022c22" : "#ecfdf5") : (th.dark ? "#450a0a" : "#fef2f2"))
                      : "transparent",
                    color: form.type === type ? (type === "income" ? "#10b981" : "#ef4444") : th.muted,
                  }}
                >
                  {type === "income" ? "💵 Income" : "💸 Expense"}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label style={lbl}>Date</label>
            <input
              type="date" value={form.date}
              onChange={(e) => set("date", e.target.value)}
              style={{ ...inp, border: `1px solid ${th.border}` }}
              onFocus={(e) => (e.target.style.borderColor = AMBER)}
              onBlur={(e)  => (e.target.style.borderColor = th.border)}
            />
          </div>

          {/* Note */}
          <div>
            <label style={lbl}>Note (optional)</label>
            <input
              type="text" placeholder="Brief description…"
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
              style={{ ...inp, border: `1px solid ${th.border}` }}
              onFocus={(e) => (e.target.style.borderColor = AMBER)}
              onBlur={(e)  => (e.target.style.borderColor = th.border)}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <button className="bg" onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 9, fontSize: 12 }}>
            Cancel
          </button>
          <button className="bp" onClick={save} style={{ flex: 2, padding: "10px", borderRadius: 9, fontSize: 13 }}>
            Save Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
