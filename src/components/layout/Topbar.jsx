import { useState } from "react";
import { Search, Moon, Sun, ChevronDown, Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useTheme } from "../../hooks/useTheme";
import { AMBER } from "../../utils/constants";

/**
 * Top navigation bar with search, dark-mode toggle, role selector, and Add button.
 * Cmd+K / Ctrl+K focuses the search input (wired in App.jsx).
 *
 * Props:
 *  openAdd — callback to open the Add Transaction modal
 */
export default function Topbar({ openAdd }) {
  const { dark, setDark, role, setRole, isAdmin } = useApp();
  const th = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <header style={{
      height: 56, background: th.card,
      borderBottom: `1px solid ${th.border}`,
      display: "flex", alignItems: "center",
      padding: "0 16px", gap: 10,
      flexShrink: 0, zIndex: 30,
    }}>
      {/* Search — id="fh-search" targeted by Cmd+K shortcut */}
      <div style={{
        display: "flex", alignItems: "center", gap: 7,
        background: th.input, borderRadius: 9, padding: "6px 11px",
        flex: 1, maxWidth: 280,
        border: `1px solid ${focused ? AMBER : th.border}`,
        transition: "border-color .2s",
      }}>
        <Search size={12} color={th.muted} />
        <input
          id="fh-search"
          placeholder="Search transactions…"
          style={{ border: "none", background: "none", outline: "none", fontSize: 12, color: th.text, width: "100%", fontFamily: "'DM Sans', sans-serif" }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <span style={{ fontSize: 9, color: th.muted, whiteSpace: "nowrap", opacity: .6 }}>⌘K</span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Admin: Add shortcut button */}
      {isAdmin && (
        <button className="bp" onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, fontSize: 11 }}>
          <Plus size={11} /> Add
        </button>
      )}

      {/* Dark / light toggle */}
      <button
        onClick={() => setDark((d) => !d)}
        style={{ background: th.input, border: "none", borderRadius: 8, padding: 7, cursor: "pointer", color: th.text, display: "flex", alignItems: "center", transition: "all .2s" }}
      >
        {dark ? <Sun size={14} /> : <Moon size={14} />}
      </button>

      {/* Role selector — title gives tooltip explaining each role */}
      <div style={{ position: "relative" }}>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          title={role === "admin" ? "Admin: can add, edit and delete transactions" : "Viewer: read-only access"}
          style={{
            background: th.input, border: `1px solid ${th.border}`,
            borderRadius: 8, padding: "5px 24px 5px 9px",
            color: th.text, fontSize: 11, cursor: "pointer",
            outline: "none", fontFamily: "'DM Sans', sans-serif", appearance: "none",
          }}
        >
          <option value="admin">👑 Admin</option>
          <option value="viewer">👁 Viewer</option>
        </select>
        <ChevronDown size={10} style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", color: th.muted, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -16, left: 0, fontSize: 8, color: th.muted, whiteSpace: "nowrap" }}>
          {role === "admin" ? "Full access" : "Read only"}
        </div>
      </div>

      <div style={{ fontSize: 11, color: th.muted }}>👋 Hi!</div>
    </header>
  );
}
