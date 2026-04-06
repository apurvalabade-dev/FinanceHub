import { useState, useEffect, useCallback } from "react";
import { useApp } from "./context/AppContext";
import { useTheme } from "./hooks/useTheme";
import GlobalStyles from "./styles/GlobalStyles";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import Modal from "./components/common/Modal";
import Toasts from "./components/common/Toasts";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";

/**
 * Root application shell.
 * Owns modal state and keyboard shortcuts — everything else lives in context or pages.
 */
export default function App() {
  const { page } = useApp();
  const th = useTheme();

  const [collapsed, setCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTxn,   setEditTxn]   = useState(null);

  const openAdd  = useCallback(() =>      { setEditTxn(null); setModalOpen(true); }, []);
  const openEdit = useCallback((txn) =>   { setEditTxn(txn);  setModalOpen(true); }, []);
  const closeModal = useCallback(() =>    setModalOpen(false),                       []);

  // ── Global keyboard shortcuts ──────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      // ⌘K / Ctrl+K → focus search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("fh-search")?.focus();
      }
      // ⌘N / Ctrl+N → open Add modal (admin only)
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        openAdd();
      }
      // Escape → close modal
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openAdd]);

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: th.bg, color: th.text,
      height: "100vh", display: "flex", overflow: "hidden",
      transition: "background .3s, color .3s",
    }}>
      <GlobalStyles />

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <Topbar openAdd={openAdd} />

        <main style={{ flex: 1, padding: 16, overflowY: "auto" }}>
          {page === "dashboard"    && <Dashboard    openAdd={openAdd} openEdit={openEdit} />}
          {page === "transactions" && <Transactions openAdd={openAdd} openEdit={openEdit} />}
          {page === "insights"     && <Insights />}
        </main>
      </div>

      <Modal open={modalOpen} onClose={closeModal} editTxn={editTxn} />
      <Toasts />
    </div>
  );
}
