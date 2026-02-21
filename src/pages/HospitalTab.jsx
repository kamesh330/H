import { useState } from "react";
import { C, mono, stressColor, panel } from "../data/theme";
import Badge from "../components/ui/Badge";
import MetricBar from "../components/ui/MetricBar";
import NInput from "../components/ui/NInput";

const HospitalTab = ({ hm, hospital, onUpdateHospital }) => {
  const [editMode, setEditMode] = useState(false);

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, fontFamily: mono }}>HOSPITAL RESOURCE ENGINE</div>
        <button onClick={() => setEditMode(!editMode)} style={{
          background: C.accent2, color: "#000", border: "none", borderRadius: 4,
          padding: "6px 14px", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: mono,
        }}>
          {editMode ? "DONE EDITING" : "EDIT HOSPITAL DATA"}
        </button>
      </div>

      {editMode && (
        <div style={{ ...panel, borderColor: C.accent2 + "55" }}>
          <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, marginBottom: 12, fontFamily: mono }}>
            HOSPITAL_RESOURCE_STATUS — EDIT MODE
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {[
              ["total_beds",              "Total Beds"],
              ["occupied_beds",           "Occupied Beds"],
              ["icu_beds_total",          "ICU Total"],
              ["icu_beds_occupied",       "ICU Occupied"],
              ["er_capacity",             "ER Capacity"],
              ["er_occupied",             "ER Occupied"],
              ["ongoing_operations_count","Ongoing Operations"],
              ["available_doctors",       "Available Doctors"],
              ["ventilators_available",   "Ventilators Available"],
            ].map(([field, label]) => (
              <NInput key={field} label={label} value={hospital[field]} onChange={(v) => onUpdateHospital(field, v)} />
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={panel}>
          <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, marginBottom: 12, fontFamily: mono }}>COMPUTED RATIOS</div>
          {[
            ["Bed Availability",    hm.bedAvailRatio,  C.green  ],
            ["ICU Availability",    hm.icuAvailRatio,  C.yellow ],
            ["ER Load",             hm.erLoadRatio,    C.red    ],
            ["Operation Load",      hm.opLoadRatio,    C.accent2],
            ["Ventilator Pressure", hm.ventPressure,   C.accent ],
          ].map(([label, val, col]) => (
            <div key={label} style={{ marginBottom: 10 }}>
              <MetricBar label={label} value={val} color={col} />
              <div style={{ fontSize: 9, color: C.muted, fontFamily: mono }}>= {val.toFixed(4)}</div>
            </div>
          ))}
        </div>

        <div style={panel}>
          <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, marginBottom: 12, fontFamily: mono }}>STRESS INDEX FORMULA</div>
          <div style={{ background: "#03060e", borderRadius: 6, padding: 12, fontFamily: mono, fontSize: 10, color: C.accent, marginBottom: 12, lineHeight: 1.9 }}>
            <div>Stress = a×(1-Bed) + b×(1-ICU) + c×ER + d×Op + e×Vent</div>
            <div style={{ color: C.muted }}>a=0.25, b=0.30, c=0.20, d=0.15, e=0.10 · Σ=1.00</div>
            <div style={{ marginTop: 6, color: C.green, fontSize: 13 }}>= {hm.stress.toFixed(4)}</div>
          </div>
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ fontSize: 44, fontFamily: mono, fontWeight: 700, color: stressColor(hm.stress), textShadow: `0 0 14px ${stressColor(hm.stress)}66` }}>
              {(hm.stress * 100).toFixed(1)}
            </div>
            <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1 }}>STRESS INDEX / 100</div>
            <div style={{ marginTop: 8 }}><Badge label={hm.stressClass} color={stressColor(hm.stress)} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              ["ER STATUS",   hm.erStatus,   hm.erStatus === "Admit" ? C.green : C.red],
              ["ADMISSIONS",  hm.admitStatus === "Accepting Patients" ? "OPEN" : "CLOSED", hm.admitStatus === "Accepting Patients" ? C.green : C.red],
            ].map(([title, val, col]) => (
              <div key={title} style={{ background: "#07101a", borderRadius: 6, padding: 10, textAlign: "center" }}>
                <div style={{ fontSize: 9, color: C.muted, marginBottom: 4 }}>{title}</div>
                <Badge label={val} color={col} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={panel}>
        <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, marginBottom: 8, fontFamily: mono }}>SYSTEM ALERTS</div>
        {hm.alerts.length === 0
          ? <div style={{ color: C.green, fontSize: 12 }}>✓ No active alerts – system operating within normal parameters</div>
          : hm.alerts.map((a, i) => (
            <div key={i} style={{ color: C.red, fontSize: 12, padding: "5px 0", borderBottom: `1px solid ${C.red}18` }}>{a}</div>
          ))
        }
      </div>
    </div>
  );
};

export default HospitalTab;
