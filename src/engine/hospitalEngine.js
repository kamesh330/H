// ============================================================
// HOSPITAL RESOURCE ENGINE
// Deterministic. No ML. All ratios bounded in [0, 1].
// ============================================================

import { clamp } from "./clinicalEngine";

// ============================================================
// HOSPITAL STRESS INDEX WEIGHTS (sum = 1.0)
// b highest — ICU unavailability is most critical resource risk
// ============================================================
const STRESS_W = {
  a: 0.25, // Bed occupancy weight
  b: 0.30, // ICU occupancy weight — highest, ICU shortage is most critical
  c: 0.20, // ER load weight
  d: 0.15, // Operation load weight
  e: 0.10, // Ventilator pressure weight
  // TOTAL = 1.00
};

export const computeHospitalMetrics = (h, criticalCount) => {
  // ---- Ratios ----
  const bedAvailRatio  = clamp((h.total_beds - h.occupied_beds) / h.total_beds);
  const icuAvailRatio  = clamp((h.icu_beds_total - h.icu_beds_occupied) / h.icu_beds_total);
  const erLoadRatio    = clamp(h.er_occupied / h.er_capacity);
  const opLoadRatio    = clamp(h.ongoing_operations_count / Math.max(1, h.available_doctors));
  const ventPressure   = clamp(criticalCount / Math.max(1, h.ventilators_available));

  // ---- Stress Index ----
  const stress =
    STRESS_W.a * (1 - bedAvailRatio) +
    STRESS_W.b * (1 - icuAvailRatio) +
    STRESS_W.c * erLoadRatio         +
    STRESS_W.d * opLoadRatio         +
    STRESS_W.e * ventPressure;

  // ---- Classification ----
  const stressClass =
    stress > 0.85  ? "Emergency Escalation" :
    stress >= 0.60 ? "Capacity Warning"     :
                     "Normal";

  // ---- ER Admission Logic ----
  // Stress > 0.9  → Temporary ER Freeze
  // ER Load >= 0.85 → Redirect
  // Otherwise       → Admit
  const erStatus =
    stress > 0.9       ? "ER Freeze" :
    erLoadRatio >= 0.85 ? "Redirect"  :
                          "Admit";

  // ---- Bed Admission Logic ----
  const admitStatus = bedAvailRatio < 0.1 ? "Stop Admissions" : "Accepting Patients";

  // ---- Alerts ----
  const alerts = [];
  if (icuAvailRatio === 0)                  alerts.push("⚠ ICU Unavailable – Escalation Required");
  if (bedAvailRatio < 0.1)                  alerts.push("⚠ Bed Capacity Critical – New Admissions Halted");
  if (stress > 0.85)                        alerts.push("🚨 Emergency Escalation – Hospital at Crisis Level");
  if (erLoadRatio >= 0.85 && stress <= 0.9) alerts.push("⚠ ER Overloaded – Redirecting Patients");

  return {
    bedAvailRatio,
    icuAvailRatio,
    erLoadRatio,
    opLoadRatio,
    ventPressure,
    stress,
    stressClass,
    erStatus,
    admitStatus,
    alerts,
  };
};
