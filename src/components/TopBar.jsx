import { C, mono, stressColor } from "../data/theme";
import Badge from "./ui/Badge";

const TopBar = ({ hospitalId, patientCount, stressClass, stress, onLogout }) => (
  <div style={{
    borderBottom: `1px solid ${C.border}`,
    padding: "12px 24px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: "#04080f", position: "sticky", top: 0, zIndex: 100,
  }}>
    <div>
      <div style={{
        fontSize: 18, fontWeight: 700, letterSpacing: 3, color: C.accent,
        fontFamily: mono, textShadow: `0 0 12px ${C.accent}55`,
      }}>
        CARE<span style={{ color: C.accent2 }}>PULSE</span>
        <span style={{ color: C.mutedHi, fontSize: 14 }}>++</span>
      </div>
      <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1.5, marginTop: 1 }}>
        SMART PATIENT MONITORING · RESOURCE OPTIMIZATION ENGINE
      </div>
    </div>

    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Badge label={hospitalId}                    color={C.accent} />
      <Badge label={stressClass.toUpperCase()}     color={stressColor(stress)} />
      <Badge label={`${patientCount} PATIENTS`}   color={C.mutedHi} />
      <button onClick={onLogout} style={{
        background: `${C.red}18`, border: `1px solid ${C.red}44`, color: C.red,
        padding: "4px 13px", borderRadius: 4, cursor: "pointer",
        fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: 1,
      }}>
        ⏻ LOGOUT
      </button>
    </div>
  </div>
);

export default TopBar;
