// ============================================================
// DESIGN TOKENS — Shared color & font constants
// ============================================================

export const C = {
  bg:       "#060b14",
  bgDeep:   "#03060e",
  panel:    "#0b1221",
  panelAlt: "#0d1628",
  border:   "#172135",
  borderHi: "#1e3050",
  accent:   "#00cfff",
  accent2:  "#ff6930",
  green:    "#00e87a",
  yellow:   "#ffb300",
  red:      "#ff2d55",
  text:     "#ddeeff",
  muted:    "#4a6a8a",
  mutedHi:  "#7a9ab8",
};

export const mono  = "'Courier New','Lucida Console',monospace";
export const serif = "'Georgia','Times New Roman',serif";

export const severityColor = (s) =>
  s === "Critical" ? C.red : s === "Moderate" ? C.yellow : C.green;

export const stressColor = (v) =>
  v > 0.85 ? C.red : v >= 0.6 ? C.yellow : C.green;

export const panel = {
  background: C.panel,
  border:     `1px solid ${C.border}`,
  borderRadius: 8,
  padding: 18,
  marginBottom: 14,
};
