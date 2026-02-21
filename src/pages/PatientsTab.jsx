import { useState } from "react";
import { C, mono, severityColor, panel } from "../data/theme";
import { DIET_ICONS } from "../data/dietMenu";
import Badge from "../components/ui/Badge";
import FoodMenuCard from "../components/FoodMenuCard";

const PatientsTab = ({ processed, selectedPid, onSelectPid, onAddPatient }) => {
  const [showLog, setShowLog] = useState({});

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, fontFamily: mono }}>PATIENT ANALYSIS ENGINE</div>
        <button onClick={onAddPatient} style={{
          background: C.accent, color: "#000", border: "none", borderRadius: 4,
          padding: "6px 14px", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: mono, letterSpacing: 1,
        }}>
          + ADD PATIENT
        </button>
      </div>

      {processed.map((p) => {
        const isSel = selectedPid === p.patient_id;
        const logO  = showLog[p.patient_id];
        const sc    = severityColor(p.severity);

        return (
          <div key={p.patient_id} style={{ ...panel, borderColor: isSel ? sc + "88" : C.border, transition: "border-color 0.25s" }}>
            {/* Card header */}
            <div
              onClick={() => onSelectPid(isSel ? null : p.patient_id)}
              style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
            >
              <div style={{
                width: 46, height: 46, borderRadius: "50%",
                background: sc + "18", border: `2px solid ${sc}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: mono, fontWeight: 700, color: sc, fontSize: 11, flexShrink: 0,
              }}>
                {p.score.toFixed(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: mono, fontSize: 13, color: C.text }}>
                  {p.patient_id}
                  <span style={{ fontSize: 10, color: C.muted, marginLeft: 10 }}>
                    Age {p.age} · {p.gender} · {p.admission_type} · {p.diagnosis_category}
                  </span>
                </div>
                <div style={{ marginTop: 4, display: "flex", gap: 5, flexWrap: "wrap" }}>
                  <Badge label={p.severity} color={sc} />
                  <Badge label={p.bed} color={p.bed === "ICU" ? C.red : p.bed === "General Bed" ? C.yellow : C.green} />
                  <span style={{ fontSize: 10, color: C.text }}>{DIET_ICONS[p.diet]} {p.diet}</span>
                  {p.chronic_disease_flag === 1 && <Badge label="CHRONIC"   color={C.yellow} small />}
                  {p.emergency_case_flag === 1   && <Badge label="EMERGENCY" color={C.red}   small />}
                  {p.icu_required_flag === 1      && <Badge label="ICU REQ"  color={C.red}   small />}
                </div>
              </div>
              <span style={{ fontSize: 9, color: C.muted, fontFamily: mono }}>{isSel ? "▲" : "▼"}</span>
            </div>

            {/* Expanded detail */}
            {isSel && (
              <div style={{ marginTop: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>

                  {/* Deviation indices */}
                  <div style={{ background: "#060f1a", borderRadius: 6, padding: 12 }}>
                    <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1, marginBottom: 8, fontFamily: mono }}>DEVIATION INDICES</div>
                    {[
                      ["Heart Rate",    p.deviations.HR],
                      ["Blood Pressure",p.deviations.BP],
                      ["O₂ Sat",        p.deviations.O2],
                      ["Fever",         p.deviations.Fever],
                      ["Respiratory",   p.deviations.Resp],
                      ["Blood Sugar",   p.deviations.Sugar],
                      ["Age Risk",      p.deviations.Age],
                      ["BMI",           p.deviations.BMI],
                      ["Hemoglobin",    p.deviations.Hgb],
                      ["Hydration",     p.deviations.Hyd],
                    ].map(([label, val]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, padding: "2px 0" }}>
                        <span style={{ color: C.muted }}>{label}</span>
                        <span style={{ fontFamily: mono, color: val > 0.6 ? C.red : val > 0.3 ? C.yellow : C.green }}>
                          {val.toFixed(3)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Recommendations */}
                  <div style={{ background: "#060f1a", borderRadius: 6, padding: 12 }}>
                    <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1, marginBottom: 8, fontFamily: mono }}>RECOMMENDATIONS</div>
                    {[
                      ["DIET",          `${DIET_ICONS[p.diet]} ${p.diet}`, C.accent ],
                      ["ROOM TEMP",     p.roomTemp,                         C.accent2],
                      ["BED ALLOCATION",p.bed,                              sc       ],
                    ].map(([lbl, val, col]) => (
                      <div key={lbl} style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: 9, color: C.muted, marginBottom: 3 }}>{lbl}</div>
                        <Badge label={val} color={col} />
                      </div>
                    ))}
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 9, color: C.muted, marginBottom: 3 }}>RISK SCORE</div>
                      <span style={{ fontFamily: mono, fontSize: 20, fontWeight: 700, color: sc }}>{p.score.toFixed(2)}</span>
                      <span style={{ fontFamily: mono, fontSize: 10, color: C.muted }}> / 100</span>
                    </div>
                  </div>

                  {/* Vitals */}
                  <div style={{ background: "#060f1a", borderRadius: 6, padding: 12 }}>
                    <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1, marginBottom: 8, fontFamily: mono }}>VITAL PARAMETERS</div>
                    {[
                      ["HR",        `${p.heart_rate_bpm} bpm`],
                      ["SBP/DBP",   `${p.systolic_bp_mmHg}/${p.diastolic_bp_mmHg} mmHg`],
                      ["O₂ Sat",    `${p.oxygen_saturation_percent}%`],
                      ["Temp",      `${p.body_temperature_celsius}°C`],
                      ["RR",        `${p.respiratory_rate_bpm} bpm`],
                      ["B.Sugar",   `${p.blood_sugar_mg_dl} mg/dL`],
                      ["BMI",       p.bmi.toFixed(1)],
                      ["Hgb",       `${p.hemoglobin_g_dl} g/dL`],
                      ["Hydration", `${p.hydration_level_percent}%`],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, padding: "2px 0" }}>
                        <span style={{ color: C.muted }}>{k}</span>
                        <span style={{ fontFamily: mono, color: C.text }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Food menu */}
                <FoodMenuCard diet={p.diet} />

                {/* Explanation log */}
                <div style={{ marginTop: 10 }}>
                  <button
                    onClick={() => setShowLog({ ...showLog, [p.patient_id]: !logO })}
                    style={{
                      background: "transparent", border: `1px solid ${C.border}`, color: C.muted,
                      padding: "4px 12px", borderRadius: 4, cursor: "pointer", fontSize: 9, fontFamily: mono, letterSpacing: 1,
                    }}
                  >
                    {logO ? "▲ HIDE" : "▼ SHOW"} EXPLANATION LOG
                  </button>
                  {logO && (
                    <div style={{ marginTop: 6, background: "#03060e", borderRadius: 6, padding: 12, fontFamily: mono, fontSize: 10, border: `1px solid ${C.border}` }}>
                      {p.log.map((line, i) => (
                        <div key={i} style={{ padding: "1px 0", color: i === p.log.length - 1 ? C.green : C.accent }}>
                          &gt; {line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PatientsTab;
