// ============================================================
// FEATURE 2: DIET → FOOD MENU MAPPING
// Deterministic static map. Exactly 6 items per diet.
// No external API. No AI-generated items.
// ============================================================

export const DIET_FOOD_MAP = {
  "Iron-Rich Diet": [
    "Spinach",
    "Lentils",
    "Beetroot",
    "Pomegranate",
    "Red Meat",
    "Dates",
  ],
  "Electrolyte-Enriched Diet": [
    "Coconut Water",
    "Oral Rehydration Solution",
    "Banana",
    "Yogurt",
    "Citrus Fruits",
    "Vegetable Soup",
  ],
  "Low-Carbohydrate Diet": [
    "Grilled Chicken",
    "Boiled Eggs",
    "Paneer",
    "Broccoli",
    "Almonds",
    "Salad Bowl",
  ],
  "Low-Sodium Diet": [
    "Steamed Vegetables",
    "Brown Rice",
    "Oats",
    "Fresh Fruits",
    "Unsalted Nuts",
    "Herbal Tea",
  ],
  "High-Fluid Diet": [
    "Vegetable Broth",
    "Fruit Juices (no added sugar)",
    "Watermelon",
    "Cucumber",
    "Lemon Water",
    "Clear Soup",
  ],
  "Balanced Diet": [
    "Rice",
    "Chapati",
    "Dal",
    "Mixed Vegetables",
    "Curd",
    "Seasonal Fruits",
  ],
};

export const DIET_ICONS = {
  "Iron-Rich Diet":            "🩸",
  "Electrolyte-Enriched Diet": "💧",
  "Low-Carbohydrate Diet":     "🥩",
  "Low-Sodium Diet":           "🌿",
  "High-Fluid Diet":           "🫗",
  "Balanced Diet":             "🥗",
};

export const DIET_COLORS = {
  "Iron-Rich Diet":            "#ff6b6b",
  "Electrolyte-Enriched Diet": "#4ecdc4",
  "Low-Carbohydrate Diet":     "#ffe66d",
  "Low-Sodium Diet":           "#a8e6cf",
  "High-Fluid Diet":           "#88d3ff",
  "Balanced Diet":             "#b8b0ff",
};
