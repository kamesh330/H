// ============================================================
// FEATURE 2: FOOD MENU CARD
// Renders exactly 6 deterministic food items for a given diet.
// ============================================================

import { DIET_FOOD_MAP, DIET_ICONS, DIET_COLORS } from "../data/dietMenu";
import { C, panel, mono } from "../data/theme";
import Badge from "./ui/Badge";

const FoodMenuCard = ({ diet }) => {
  const foods  = DIET_FOOD_MAP[diet] || [];
  const icon   = DIET_ICONS[diet]    || "🍽";
  const dColor = DIET_COLORS[diet]   || "#00cfff";

  return (
    <div style={{
      background: "#070f1c",
      border: `1px solid ${dColor}33`,
      borderRadius: 8,
      padding: "12px 14px",
      marginTop: 10,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <div>
          <div style={{ fontSize: 9, color: C.muted, fontFamily: mono, letterSpacing: 1.2 }}>
            PRESCRIBED FOOD MENU
          </div>
          <div style={{ fontSize: 11, color: dColor, fontWeight: 600, marginTop: 1 }}>
            {diet}
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <span style={{
            fontSize: 9, color: C.muted, fontFamily: mono,
            background: dColor + "12", border: `1px solid ${dColor}30`,
            borderRadius: 10, padding: "2px 8px",
          }}>
            6 ITEMS
          </span>
        </div>
      </div>

      {/* Food grid — exactly 6 items */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
        {foods.map((food, i) => (
          <div key={i} style={{
            background: C.panel, border: `1px solid ${C.border}`,
            borderRadius: 5, padding: "7px 10px",
            fontSize: 11, color: C.text,
            display: "flex", alignItems: "center", gap: 7,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: dColor, flexShrink: 0,
              boxShadow: `0 0 5px ${dColor}99`,
            }} />
            {food}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodMenuCard;
