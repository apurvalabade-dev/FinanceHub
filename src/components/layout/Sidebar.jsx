import { LayoutDashboard, Receipt, Lightbulb } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useTheme } from "../../hooks/useTheme";
import { AMBER } from "../../utils/constants";

const NAV_ITEMS = [
  { id: "dashboard",    label: "Dashboard",    Icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", Icon: Receipt         },
  { id: "insights",     label: "Insights",     Icon: Lightbulb       },
];

/**
 * Collapsible sidebar with navigation links.
 * Clicking the logo text collapses/expands the sidebar.
 *
 * Props:
 *  collapsed    — boolean
 *  setCollapsed — setter
 */
export default function Sidebar({ collapsed, setCollapsed }) {
  const { page, setPage } = useApp();
  const th = useTheme();

  return (
    <aside style={{
      width: collapsed ? 54 : 188,
      minHeight: "100vh",
      background: th.card,
      borderRight: `1px solid ${th.border}`,
      display: "flex", flexDirection: "column",
      padding: "16px 8px 14px", gap: 2,
      flexShrink: 0,
      transition: "width .3s cubic-bezier(.4,0,.2,1)",
      overflow: "hidden",
    }}>
      {/* Logo / collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        style={{
          padding: "4px 8px 18px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
          userSelect: "none", background: "none", border: "none",
          color: "inherit", textAlign: "left",
        }}
      >
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: AMBER, flexShrink: 0 }}>F</span>
        {!collapsed && (
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: AMBER, whiteSpace: "nowrap" }}>
            inanceHub
          </span>
        )}
      </button>

      {/* Navigation */}
      {NAV_ITEMS.map((item) => {
        const active = page === item.id;
        return (
          <button
            key={item.id}
            className="nav"
            onClick={() => setPage(item.id)}
            style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "9px 10px", borderRadius: 10,
              background: active ? (th.dark ? "#292524" : "#fff7ed") : "transparent",
              border: "none",
              color: active ? AMBER : th.muted,
              cursor: "pointer", fontSize: 12,
              fontWeight: active ? 600 : 400,
              transition: "all .2s", whiteSpace: "nowrap",
              width: "100%", fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <item.Icon size={15} style={{ flexShrink: 0 }} />
            {!collapsed && item.label}
          </button>
        );
      })}

      <div style={{ flex: 1 }} />

      {/* Version tag */}
      {!collapsed && (
        <div style={{
          padding: "8px 10px 0",
          borderTop: `1px solid ${th.border}`,
          fontSize: 9, color: th.muted,
          textTransform: "uppercase", letterSpacing: "0.5px",
        }}>
          FinanceHub v2.0
        </div>
      )}
    </aside>
  );
}
