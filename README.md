# CarePulse++ v2.0

**Deterministic Smart Patient Monitoring & Hospital Resource Optimization Engine**

> No ML. No randomness. No external APIs. Fully reproducible. O(n) complexity.

---

## 🚀 Quick Start (VS Code)

### Prerequisites
- [Node.js](https://nodejs.org/) v16 or higher
- npm (included with Node.js)

### Steps

```bash
# 1. Open this folder in VS Code
# 2. Open the integrated terminal (Ctrl+` or View → Terminal)

# 3. Install dependencies
npm install

# 4. Start the development server
npm start
```

The app will open automatically at **http://localhost:3000**

---

## 🔐 Login Credentials

Authentication is fully deterministic — no database required.

| Hospital ID | Password       |
|-------------|----------------|
| H001        | CAREH0012026   |
| H002        | CAREH0022026   |
| DEMO        | CAREDEMOD2026  |

**Formula:** `password = "CARE" + hospital_id + "2026"`

---

## 📁 Project Architecture

```
carepulse-app/
│
├── public/
│   └── index.html                  # HTML shell
│
├── src/
│   ├── index.js                    # React entry point
│   ├── App.jsx                     # Root component — state + routing
│   │
│   ├── engine/                     # ── DETERMINISTIC ENGINE LAYER ──
│   │   ├── clinicalEngine.js       # Risk score, deviations, diet, bed allocation
│   │   ├── hospitalEngine.js       # Stress index, ER/admission logic, alerts
│   │   └── authEngine.js           # Deterministic authentication (Feature 1)
│   │
│   ├── data/                       # ── STATIC DATA LAYER ──
│   │   ├── sampleData.js           # Default Patient_Clinical_Data & Hospital_Resource_Status
│   │   ├── dietMenu.js             # Diet → Food mapping (Feature 2), icons, colors
│   │   └── theme.js                # Design tokens, colors, fonts
│   │
│   ├── components/                 # ── REUSABLE UI COMPONENTS ──
│   │   ├── TopBar.jsx              # App header with hospital ID, stress badge, logout
│   │   ├── NavTabs.jsx             # Dashboard / Patients / Hospital / Data Entry tabs
│   │   ├── FoodMenuCard.jsx        # Diet food menu display (Feature 2)
│   │   └── ui/
│   │       ├── Badge.jsx           # Colored pill badge
│   │       ├── MetricBar.jsx       # Animated progress bar
│   │       ├── NInput.jsx          # Numeric input field
│   │       └── FlagBtn.jsx         # YES/NO toggle button
│   │
│   └── pages/                      # ── PAGE / TAB COMPONENTS ──
│       ├── LoginPage.jsx           # Feature 1: deterministic login screen
│       ├── DashboardTab.jsx        # KPIs, alerts, patient queue, food menu toggles
│       ├── PatientsTab.jsx         # Patient cards with deviation indices + food menu
│       ├── HospitalTab.jsx         # Stress index, ratios, alerts, edit mode
│       └── DataEntryTab.jsx        # Add/edit patient clinical data
│
└── package.json
```

---

## 🧮 Mathematical Engine Summary

### Clinical Risk Score
```
Risk_raw = Σ(wᵢ × Deviationᵢ)   where Σwᵢ = 1.0

Deviation(x) = min(1, ((|x - Normal| - halfRange) / allowedRange)²)

Escalations:
  chronic_disease_flag = 1  →  × 1.15
  emergency_case_flag  = 1  →  + 10 points
  icu_required_flag    = 1  →  force ≥ 85

Final Score ∈ [0, 100]
```

### Weight Hierarchy
| Index | Weight | Rationale |
|-------|--------|-----------|
| O₂ Saturation | 0.20 | Most acute life-threat |
| Heart Rate | 0.15 | Critical cardiac indicator |
| Blood Pressure | 0.15 | Immediate hemodynamic risk |
| Fever | 0.10 | Infection / systemic risk |
| Respiratory Rate | 0.10 | Respiratory compromise |
| Blood Sugar | 0.08 | Metabolic, sub-acute |
| Age | 0.07 | Population risk modifier |
| BMI | 0.05 | Chronic risk |
| Hemoglobin | 0.05 | Chronic anemia |
| Hydration | 0.05 | Acute dehydration |

### Severity Classification
| Score | Severity |
|-------|----------|
| ≥ 70  | Critical |
| 40–69 | Moderate |
| < 40  | Stable   |

### Hospital Stress Index
```
Stress = 0.25×(1-Bed) + 0.30×(1-ICU) + 0.20×ER + 0.15×Op + 0.10×Vent

< 0.60  → Normal
0.60–0.85 → Capacity Warning
> 0.85  → Emergency Escalation
```

---

## ⚙️ Features

| Feature | Description |
|---------|-------------|
| Login Authentication | Deterministic: `password = "CARE" + hospital_id + "2026"` |
| Risk Scoring | 10-index quadratic deviation model |
| Severity Classification | Critical / Moderate / Stable |
| Diet Recommendation | 6-priority rule engine → 1 diet |
| Food Menu | 6 deterministic items per diet |
| Room Temperature | Severity-based + fever adjustment |
| Bed Allocation | ICU / General / Observation |
| Hospital Stress Index | 5-factor weighted formula |
| ER Logic | Load + stress-based admission rules |
| Live Editing | Edit vitals → all outputs recompute instantly |
| Explanation Log | Step-by-step computation trace per patient |

---

## 🔒 Design Constraints Met

- ✅ No machine learning
- ✅ No randomness / non-determinism
- ✅ No external databases or APIs
- ✅ O(n) time complexity — single pass over patients
- ✅ Identical input → identical output, always
- ✅ All weights and thresholds explicitly defined
- ✅ Fully explainable via Explanation Log
