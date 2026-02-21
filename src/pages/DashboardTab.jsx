import { useState } from "react";
import { C, mono, severityColor, stressColor, panel } from "../data/theme";
import { DIET_ICONS } from "../data/dietMenu";
import Badge from "../components/ui/Badge";
import MetricBar from "../components/ui/MetricBar";
import FoodMenuCard from "../components/FoodMenuCard";

const DashboardTab = ({ processed, hm, patientCount, onPatientClick }) => {
  const [foodOpen, setFoodOpen] = useState({});

  const criticalCount  = processed.filter((p) => p.severity === "Critical").length;
  const moderateCount  = processed.filter((p) => p.severity === "Moderate").length;
  const stableCount    = processed.filter((p) => p.severity === "Stable").length;

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 14 }}>
        {[
          { label: "Total Patients", val: patientCount, col: C.accent  },
          { label: "Critical",       val: criticalCount, col: C.red    },
          { label: "Moderate",       val: moderateCount, col: C.yellow },
          { label: "Stable",         val: stableCount,   col: C.green  },
        ].map(({ label, val, col }) => (
          <div key={label} style={{ ...panel, textAlign: "center", padding: "14px 10px", marginBottom: 0, borderColor: col + "33" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: col, fontFamily: mono, textShadow: `0 0 10px ${col}55` }}>{val}</div>
            <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1, marginTop: 3, textTransform: "uppercase" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {hm.alerts.length > 0 && (
        <div style={{ ...panel, borderColor: C.red + "55", background: C.red + "06", marginBottom: 14 }}>
          <div style={{ fontSize: 9, color: C.red, letterSpacing: 2, marginBottom: 8, fontFamily: mono }}>▲ ACTIVE SYSTEM ALERTS</div>
          {hm.alerts.map((a, i) => (
            <div key={i} style={{ color: C.red, fontSize: 12, padding: "4px 0", borderBottom: i < hm.alerts.length - 1 ? `1px solid ${C.red}18` : "none" }}>{a}</div>
          ))}
        </div>
      )}

      {/* Hospital metrics + weight hierarchy */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div style={panel}>
          <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, marginBottom: 12, fontFamily: mono }}>HOSPITAL STRESS METRICS</div>
          <MetricBar label="Bed Occupancy"       value={1 - hm.bedAvailRatio}  color={hm.bedAvailRatio < 0.1 ? C.red : C.yellow} />
          <MetricBar label="ICU Occupancy"       value={1 - hm.icuAvailRatio}  color={C.red} />
          <MetricBar label="ER Load"             value={hm.erLoadRatio}         color={hm.erLoadRatio >= 0.85 ? C.red : C.yellow} />
          <MetricBar label="Operation Load"      value={hm.opLoadRatio}         color={C.accent2} />
          <MetricBar label="Ventilator Pressure" value={hm.ventPressure}        color={C.accent} />
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: C.muted }}>Stress Index</span>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 22, fontFamily: mono, color: stressColor(hm.stress), fontWeight: 700 }}>{(hm.stress * 100).toFixed(1)}%</div>
              <Badge label={hm.stressClass} color={stressColor(hm.stress)} />
            </div>
          </div>
        </div>

        <div style={panel}>
          <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, marginBottom: 12, fontFamily: mono }}>ER & ADMISSION STATUS</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {[
              ["ER STATUS",   hm.erStatus,   hm.erStatus === "Admit" ? C.green : C.red],
              ["ADMISSIONS",  hm.admitStatus === "Accepting Patients" ? "OPEN" : "CLOSED", hm.admitStatus === "Accepting Patients" ? C.green : C.red],
            ].map(([title, val, col]) => (
              <div key={title} style={{ flex: 1, background: "#07101a", borderRadius: 6, padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: 9, color: C.muted, marginBottom: 5 }}>{title}</div>
                <Badge label={val} color={col} />
              </div>
            ))}
          </div>
          <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1, marginBottom: 6, fontFamily: mono }}>WEIGHT HIERARCHY (Σ=1.00)</div>
          {[
            ["O₂ Sat","0.20"],["Heart Rate","0.15"],["Blood Pressure","0.15"],
            ["Fever","0.10"],["Respiratory","0.10"],["Sugar","0.08"],
            ["Age","0.07"],["BMI","0.05"],["Hemoglobin","0.05"],["Hydration","0.05"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, padding: "2px 0", borderBottom: `1px solid ${C.border}22` }}>
              <span style={{ color: C.text }}>{k}</span>
              <span style={{ color: C.accent, fontFamily: mono }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Patient priority table */}
      <div style={panel}>
        <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, marginBottom: 12, fontFamily: mono }}>
          PATIENT PRIORITY QUEUE — sorted by descending risk score
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "70px 60px 90px 1fr 100px 100px 90px", gap: 8, padding: "5px 0", borderBottom: `1px solid ${C.borderHi}`, marginBottom: 4 }}>
          {["ID","SCORE","SEVERITY","DIET / MENU","ROOM TEMP","BED","FLAGS"].map((h) => (
            <div key={h} style={{ fontSize: 8, color: C.muted, fontFamily: mono, letterSpacing: 1 }}>{h}</div>
          ))}
        </div>

        {processed.map((p) => {
          const fo = foodOpen[p.patient_id];
          const sc = severityColor(p.severity);
          return (
            <div key={p.patient_id} style={{ borderBottom: `1px solid ${C.border}22`, paddingBottom: fo ? 10 : 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "70px 60px 90px 1fr 100px 100px 90px", gap: 8, padding: "8px 0", alignItems: "center" }}>
                <span
                  onClick={() => onPatientClick(p.patient_id)}
                  style={{ fontFamily: mono, color: C.accent, fontSize: 11, cursor: "pointer", textDecoration: "underline dotted" }}
                >
                  {p.patient_id}
                </span>
                <span style={{ fontFamily: mono, fontSize: 13, color: sc, fontWeight: 700 }}>{p.score.toFixed(1)}</span>
                <Badge label={p.severity} color={sc} />
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 10, color: C.text }}>{DIET_ICONS[p.diet]} {p.diet}</span>
                  <button
                    onClick={() => setFoodOpen({ ...foodOpen, [p.patient_id]: !fo })}
                    style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, fontSize: 8, borderRadius: 3, padding: "2px 6px", cursor: "pointer", fontFamily: mono, flexShrink: 0 }}
                  >
                    {fo ? "▲" : "▼ MENU"}
                  </button>
                </div>
                <span style={{ fontSize: 10, color: C.mutedHi, fontFamily: mono }}>{p.roomTemp}</span>
                <Badge label={p.bed} color={p.bed === "ICU" ? C.red : p.bed === "General Bed" ? C.yellow : C.green} />
                <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                  {p.chronic_disease_flag === 1 && <Badge label="CHR" color={C.yellow} small />}
                  {p.emergency_case_flag === 1   && <Badge label="EMG" color={C.red}   small />}
                  {p.icu_required_flag === 1      && <Badge label="ICU" color={C.red}   small />}
                </div>
              </div>
              {fo && <FoodMenuCard diet={p.diet} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardTab;
