import { CheckCircle, AlertCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useTheme } from "../../hooks/useTheme";

/**
 * Renders active toast notifications in the bottom-right corner.
 * Toasts are managed via AppContext and auto-dismiss after 3 s.
 */
export default function Toasts() {
  const { toasts } = useApp();
  const th = useTheme();

  return (
    <div style={{
      position: "fixed", bottom: 18, right: 18, zIndex: 999,
      display: "flex", flexDirection: "column", gap: 7,
    }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className="ti"
          style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "9px 13px",
            background: t.type === "error"
              ? (th.dark ? "#450a0a" : "#fef2f2")
              : (th.dark ? "#022c22" : "#ecfdf5"),
            border: `1px solid ${t.type === "error" ? "#ef4444" : "#10b981"}`,
            borderRadius: 10, fontSize: 11, fontWeight: 500,
            color: t.type === "error" ? "#ef4444" : "#10b981",
            boxShadow: "0 8px 24px rgba(0,0,0,.25)", maxWidth: 270,
          }}
        >
          {t.type === "error" ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
          {t.msg}
        </div>
      ))}
    </div>
  );
}
