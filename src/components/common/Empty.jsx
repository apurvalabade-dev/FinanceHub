import { useTheme } from "../../hooks/useTheme";

/**
 * Generic empty state with icon, title, and optional subtitle.
 * Used across Dashboard, Transactions, and Insights pages.
 */
export default function Empty({ icon, msg, sub }) {
  const th = useTheme();
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "26px 16px", textAlign: "center",
    }}>
      <div style={{ fontSize: 26, marginBottom: 7 }}>{icon}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: th.text, marginBottom: 3 }}>{msg}</div>
      {sub && <div style={{ fontSize: 10, color: th.muted }}>{sub}</div>}
    </div>
  );
}
