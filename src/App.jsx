import { useState } from "react";

// Engine
import { processPatients }       from "./engine/clinicalEngine";
import { computeHospitalMetrics } from "./engine/hospitalEngine";

// Data
import { DEFAULT_PATIENTS, DEFAULT_HOSPITAL } from "./data/sampleData";

// Theme
import { C, serif } from "./data/theme";

// Pages / Layout
import LoginPage    from "./pages/LoginPage";
import DashboardTab from "./pages/DashboardTab";
import PatientsTab  from "./pages/PatientsTab";
import HospitalTab  from "./pages/HospitalTab";
import DataEntryTab from "./pages/DataEntryTab";
import TopBar       from "./components/TopBar";
import NavTabs      from "./components/NavTabs";

export default function App() {
  // ---- Auth State ----
  const [loggedIn,  setLoggedIn]  = useState(false);
  const [loggedHId, setLoggedHId] = useState("");

  // ---- App State ----
  const [patients,   setPatients]   = useState(DEFAULT_PATIENTS);
  const [hospital,   setHospital]   = useState(DEFAULT_HOSPITAL);
  const [activeTab,  setActiveTab]  = useState("dashboard");
  const [selectedPid, setSelectedPid] = useState(null);
  const [editingPid,  setEditingPid]  = useState(null);

  // ---- Auth Handlers ----
  const handleLogin  = (id) => { setLoggedIn(true); setLoggedHId(id); };
  const handleLogout = ()   => { setLoggedIn(false); setLoggedHId(""); setActiveTab("dashboard"); };

  // ---- Guard: show login if not authenticated ----
  if (!loggedIn) return <LoginPage onLogin={handleLogin} />;

  // ---- O(n) data processing ----
  const processed     = processPatients(patients);
  const criticalCount = processed.filter((p) => p.severity === "Critical").length;
  const hm            = computeHospitalMetrics(hospital, criticalCount);

  // ---- Patient Mutations ----
  const addPatient = () => {
    const newP = {
      patient_id:                `P${String(patients.length + 1).padStart(3, "0")}`,
      age: 40, gender: "M",
      heart_rate_bpm: 75,
      systolic_bp_mmHg: 115,    diastolic_bp_mmHg: 75,
      oxygen_saturation_percent: 98, body_temperature_celsius: 37.0,
      respiratory_rate_bpm: 16, blood_sugar_mg_dl: 100,
      bmi: 22.5,
      chronic_disease_flag: 0,  emergency_case_flag: 0, icu_required_flag: 0,
      admission_type: "Elective", diagnosis_category: "General",
      hydration_level_percent: 70, hemoglobin_g_dl: 14.0,
    };
    setPatients([...patients, newP]);
    setEditingPid(newP.patient_id);
    setActiveTab("data-entry");
  };

  const updatePatient = (pid, field, val) =>
    setPatients(patients.map((p) => p.patient_id === pid ? { ...p, [field]: val } : p));

  const updateHospital = (field, val) =>
    setHospital({ ...hospital, [field]: val });

  // ---- Navigate to patient detail ----
  const handlePatientClick = (pid) => {
    setSelectedPid(pid);
    setActiveTab("patients");
  };

  return (
    <div style={{
      background: C.bg, minHeight: "100vh", color: C.text, fontFamily: serif,
      backgroundImage: `
        radial-gradient(ellipse at 0% 0%, #001028 0%, transparent 50%),
        radial-gradient(ellipse at 100% 100%, #100028 0%, transparent 50%)
      `,
    }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        input:focus { border-color: ${C.accent} !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${C.bgDeep}; }
        ::-webkit-scrollbar-thumb { background: ${C.borderHi}; border-radius: 4px; }
      `}</style>

      <TopBar
        hospitalId={loggedHId}
        patientCount={patients.length}
        stressClass={hm.stressClass}
        stress={hm.stress}
        onLogout={handleLogout}
      />

      <NavTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div style={{ padding: "20px 24px", maxWidth: 1200, margin: "0 auto" }}>

        {activeTab === "dashboard" && (
          <DashboardTab
            processed={processed}
            hm={hm}
            patientCount={patients.length}
            onPatientClick={handlePatientClick}
          />
        )}

        {activeTab === "patients" && (
          <PatientsTab
            processed={processed}
            selectedPid={selectedPid}
            onSelectPid={setSelectedPid}
            onAddPatient={addPatient}
          />
        )}

        {activeTab === "hospital" && (
          <HospitalTab
            hm={hm}
            hospital={hospital}
            onUpdateHospital={updateHospital}
          />
        )}

        {activeTab === "data-entry" && (
          <DataEntryTab
            patients={patients}
            onAddPatient={addPatient}
            onUpdatePatient={updatePatient}
            editingPid={editingPid}
            onSetEditingPid={setEditingPid}
          />
        )}
      </div>
    </div>
  );
}
