// ============================================================
// CLINICAL RISK ENGINE
// Deterministic. No ML. No randomness. O(n) complexity.
// All inputs → identical outputs, always.
// ============================================================

// Clamp value between lo and hi (default [0, 1])
export const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

/**
 * Quadratic deviation penalty.
 * Deviation(x) = min(1, ((|x - mid| - halfRange) / allowedRange)^2)
 * Returns a score in [0, 1] where 0 = within normal, 1 = maximally abnormal.
 */
export const quadDev = (x, lo, hi, allowedRange) => {
  const mid       = (lo + hi) / 2;
  const halfRange = (hi - lo) / 2;
  const excess    = Math.max(0, Math.abs(x - mid) - halfRange);
  return clamp((excess / allowedRange) ** 2);
};

// ============================================================
// 10 DEVIATION INDICES
// ============================================================
export const computeDeviations = (p) => {
  // 1. Heart Rate Deviation Index (normal: 60-100 bpm)
  const HR = quadDev(p.heart_rate_bpm, 60, 100, 40);

  // 2. Blood Pressure Deviation Index (systolic 90-120, diastolic 60-80)
  const sysD = quadDev(p.systolic_bp_mmHg, 90, 120, 30);
  const diaD = quadDev(p.diastolic_bp_mmHg, 60, 80, 20);
  const BP   = clamp((sysD + diaD) / 2);

  // 3. Oxygen Desaturation Index (normal >= 95%)
  const O2 = p.oxygen_saturation_percent >= 95
    ? 0
    : clamp(((95 - p.oxygen_saturation_percent) / 10) ** 2);

  // 4. Fever Index (normal: 36.5-37.5°C)
  const Fever = quadDev(p.body_temperature_celsius, 36.5, 37.5, 3);

  // 5. Respiratory Instability Index (normal: 12-20 bpm)
  const Resp = quadDev(p.respiratory_rate_bpm, 12, 20, 8);

  // 6. Sugar Risk Index (normal: 70-140 mg/dL)
  const Sugar = quadDev(p.blood_sugar_mg_dl, 70, 140, 70);

  // 7. Age Risk Factor (scaled after age 60)
  const Age = p.age <= 60 ? 0 : clamp(((p.age - 60) / 40) ** 2);

  // 8. BMI Risk Factor (normal: 18.5-24.9)
  const BMI = quadDev(p.bmi, 18.5, 24.9, 10);

  // 9. Hemoglobin Anemia Index (normal: 12-16 g/dL)
  const Hgb = quadDev(p.hemoglobin_g_dl, 12, 16, 4);

  // 10. Hydration Deficit Index (normal >= 60%)
  const Hyd = p.hydration_level_percent >= 60
    ? 0
    : clamp(((60 - p.hydration_level_percent) / 40) ** 2);

  return { HR, BP, O2, Fever, Resp, Sugar, Age, BMI, Hgb, Hyd };
};

// ============================================================
// WEIGHT MODEL
// All weights sum to exactly 1.0
// Justified: O2 most acutely life-threatening → highest weight
// ============================================================
export const WEIGHTS = {
  w1:  0.15, // Heart Rate         — critical cardiac indicator
  w2:  0.15, // Blood Pressure     — immediate hemodynamic risk
  w3:  0.20, // Oxygen Saturation  — most acute life-threat
  w4:  0.10, // Fever              — infection / systemic risk
  w5:  0.10, // Respiratory Rate   — respiratory compromise
  w6:  0.08, // Blood Sugar        — metabolic, sub-acute
  w7:  0.07, // Age                — population risk modifier
  w8:  0.05, // BMI                — chronic risk, lower acuity
  w9:  0.05, // Hemoglobin         — chronic anemia
  w10: 0.05, // Hydration          — acute dehydration
  // TOTAL = 1.00
};

// ============================================================
// TOTAL RISK SCORE COMPUTATION
// ============================================================
export const computeRiskScore = (p) => {
  const d   = computeDeviations(p);
  const log = [];

  // Weighted sum
  const raw =
    WEIGHTS.w1  * d.HR    +
    WEIGHTS.w2  * d.BP    +
    WEIGHTS.w3  * d.O2    +
    WEIGHTS.w4  * d.Fever +
    WEIGHTS.w5  * d.Resp  +
    WEIGHTS.w6  * d.Sugar +
    WEIGHTS.w7  * d.Age   +
    WEIGHTS.w8  * d.BMI   +
    WEIGHTS.w9  * d.Hgb   +
    WEIGHTS.w10 * d.Hyd;

  log.push(`Raw Risk = ${raw.toFixed(4)}`);

  // Escalation 1: chronic disease multiplier
  let adjusted = raw;
  if (p.chronic_disease_flag === 1) {
    adjusted *= 1.15;
    log.push(`Chronic disease ×1.15 → ${adjusted.toFixed(4)}`);
  }

  // Scale to [0, 100]
  let finalScore = Math.min(100, adjusted * 100);

  // Escalation 2: emergency case +10 points
  if (p.emergency_case_flag === 1) {
    finalScore = Math.min(100, finalScore + 10);
    log.push(`Emergency +10 → ${finalScore.toFixed(2)}`);
  }

  // Escalation 3: ICU required → force ≥ 85
  if (p.icu_required_flag === 1 && finalScore < 85) {
    finalScore = 85;
    log.push(`ICU flag → forced ≥ 85`);
  }

  log.push(`Final Risk Score = ${finalScore.toFixed(2)}`);
  return { score: finalScore, deviations: d, log };
};

// ============================================================
// SEVERITY CLASSIFICATION (non-overlapping thresholds)
// ============================================================
export const getSeverity = (score) => {
  if (score >= 70) return "Critical";
  if (score >= 40) return "Moderate";
  return "Stable";
};

// ============================================================
// DIET RECOMMENDATION ENGINE
// Priority: Iron-Rich(1) > Electrolyte(2) > Low-Carb(3) >
//           Low-Sodium(4) > High-Fluid(5) > Balanced(6)
// Exactly ONE diet returned.
// ============================================================
export const getDiet = (p) => {
  const triggers = [];
  if (p.hemoglobin_g_dl < 10)            triggers.push({ priority: 1, diet: "Iron-Rich Diet" });
  if (p.hydration_level_percent < 50)    triggers.push({ priority: 2, diet: "Electrolyte-Enriched Diet" });
  if (p.blood_sugar_mg_dl > 200)         triggers.push({ priority: 3, diet: "Low-Carbohydrate Diet" });
  if (p.systolic_bp_mmHg > 150)          triggers.push({ priority: 4, diet: "Low-Sodium Diet" });
  if (p.body_temperature_celsius > 38.5) triggers.push({ priority: 5, diet: "High-Fluid Diet" });
  if (triggers.length === 0)             return "Balanced Diet";
  triggers.sort((a, b) => a.priority - b.priority);
  return triggers[0].diet;
};

// ============================================================
// ROOM TEMPERATURE RECOMMENDATION
// ============================================================
export const getRoomTemp = (severity, bodyTemp) => {
  const ranges = { Critical: [22, 24], Moderate: [24, 26], Stable: [26, 28] };
  let [lo, hi] = ranges[severity];
  if (bodyTemp > 39) { lo -= 2; hi -= 2; }
  return `${lo}–${hi}°C`;
};

// ============================================================
// BED ALLOCATION LOGIC
// ============================================================
export const getBedAllocation = (severity) => {
  if (severity === "Critical") return "ICU";
  if (severity === "Moderate") return "General Bed";
  return "Observation";
};

// ============================================================
// FULL PATIENT PROCESSOR — O(n) single pass
// ============================================================
export const processPatients = (patients) =>
  patients
    .map((p) => {
      const { score, deviations, log } = computeRiskScore(p);
      const severity = getSeverity(score);
      const diet     = getDiet(p);
      const roomTemp = getRoomTemp(severity, p.body_temperature_celsius);
      const bed      = getBedAllocation(severity);
      return { ...p, score, severity, diet, roomTemp, bed, deviations, log };
    })
    .sort((a, b) => b.score - a.score); // descending risk
