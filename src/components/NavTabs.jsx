import { C, mono } from "../data/theme";

const TABS = ["dashboard", "patients", "hospital", "data-entry"];

const NavTabs = ({ activeTab, onTabChange }) => (
  <div style={{
    padding: "8px 24px",
    borderBottom: `1px solid ${C.border}22`,
    display: "flex", gap: 4, background: "#060b14",
  }}>
    {TABS.map((t) => (
      <button
        key={t}
        onClick={() => onTabChange(t)}
        style={{
          padding: "7px 16px",
          background: activeTab === t ? C.accent : "transparent",
          color: activeTab === t ? "#000" : C.muted,
          border: "none", cursor: "pointer",
          fontFamily: mono, fontSize: 10, fontWeight: 700,
          letterSpacing: 1.5, textTransform: "uppercase",
          borderRadius: 3, transition: "all 0.2s",
        }}
      >
        {t.replace("-", " ")}
      </button>
    ))}
  </div>
);

export default NavTabs;
