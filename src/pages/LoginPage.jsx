// ============================================================
// FEATURE 1: LOGIN PAGE
// Deterministic auth: password = "CARE" + hospital_id + "2026"
// No external auth. No randomness. No session persistence.
// ============================================================

import { useState } from "react";
import { authenticate, derivePassword } from "../engine/authEngine";
import { C, mono, serif } from "../data/theme";

const LoginPage = ({ onLogin }) => {
  const [hospitalId, setHospitalId] = useState("");
  const [password,   setPassword]   = useState("");
  const [error,      setError]      = useState("");
  const [shaking,    setShaking]    = useState(false);

  const handleLogin = () => {
    const id = hospitalId.trim().toUpperCase();
    if (authenticate(id, password)) {
      setError("");
      onLogin(id);
    } else {
      setError("Invalid Hospital Credentials");
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  const iStyle = {
    width: "100%", background: "#04090f",
    border: `1px solid ${C.borderHi}`, borderRadius: 6,
    color: C.text, padding: "12px 14px", fontSize: 14,
    fontFamily: mono, boxSizing: "border-box", outline: "none", letterSpacing: 1,
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, fontFamily: serif,
      position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      backgroundImage: `
        radial-gradient(ellipse at 10% 20%, #001c3a 0%, transparent 50%),
        radial-gradient(ellipse at 90% 80%, #160030 0%, transparent 50%)
      `,
    }}>
      <style>{`
        @keyframes pulse  { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.4} 50%{transform:translate(-50%,-50%) scale(1.05);opacity:0.15} }
        @keyframes pulse2 { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.25} 50%{transform:translate(-50%,-50%) scale(1.03);opacity:0.08} }
        @keyframes pulse3 { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.15} 50%{transform:translate(-50%,-50%) scale(1.02);opacity:0.04} }
        @keyframes shake  { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px)} 40%{transform:translateX(10px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes hbeat  { 0%,100%{transform:scale(1)} 25%{transform:scale(1.15)} 35%{transform:scale(1)} 50%{transform:scale(1.1)} 60%{transform:scale(1)} }
        input[type="text"]:focus, input[type="password"]:focus {
          border-color: ${C.accent} !important;
          box-shadow: 0 0 0 2px ${C.accent}22 !important;
        }
      `}</style>

      {/* Grid texture */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.035, pointerEvents: "none",
        backgroundImage: `linear-gradient(${C.accent} 1px, transparent 1px), linear-gradient(90deg, ${C.accent} 1px, transparent 1px)`,
        backgroundSize: "44px 44px",
      }} />

      {/* Pulse rings */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          position: "absolute", borderRadius: "50%", pointerEvents: "none",
          width: 280 + i * 180, height: 280 + i * 180,
          border: `1px solid ${C.accent}${["18", "0e", "07"][i]}`,
          top: "50%", left: "50%",
          animation: `pulse${i === 0 ? "" : i + 1} ${3 + i * 1.5}s ease-in-out infinite`,
        }} />
      ))}

      <div style={{ width: 440, position: "relative", zIndex: 10, animation: "fadeUp 0.6s ease forwards" }}>

        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 68, height: 68, borderRadius: "50%",
            background: `radial-gradient(circle, ${C.accent}18 0%, transparent 70%)`,
            border: `1px solid ${C.accent}33`, marginBottom: 14, fontSize: 28,
            animation: "hbeat 2s ease-in-out infinite",
          }}>❤️</div>

          <h1 style={{
            margin: 0, fontSize: 36, fontWeight: 700, letterSpacing: 4,
            color: C.accent, fontFamily: mono, textShadow: `0 0 24px ${C.accent}55`,
          }}>
            CARE<span style={{ color: C.accent2 }}>PULSE</span>
            <span style={{ color: C.mutedHi, fontSize: 22 }}>++</span>
          </h1>

          <p style={{ margin: "10px 0 0", fontSize: 11, color: C.muted, letterSpacing: 1.2, lineHeight: 1.7 }}>
            Smart Patient Monitoring &<br />Hospital Resource Optimization System
          </p>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12,
            padding: "3px 12px", border: `1px solid ${C.green}33`,
            borderRadius: 12, background: `${C.green}08`,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.green, animation: "blink 1.8s infinite" }} />
            <span style={{ fontSize: 9, color: C.green, fontFamily: mono, letterSpacing: 1.5 }}>
              SYSTEM ONLINE · DETERMINISTIC ENGINE READY
            </span>
          </div>
        </div>

        {/* Login card */}
        <div style={{
          background: C.panel, border: `1px solid ${C.borderHi}`, borderRadius: 14,
          padding: "32px 30px",
          boxShadow: `0 28px 70px #00000099, 0 0 50px ${C.accent}08`,
          animation: shaking ? "shake 0.4s ease" : "none",
        }}>
          <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2.5, marginBottom: 24, fontFamily: mono, textAlign: "center" }}>
            ─── HOSPITAL AUTHENTICATION ───
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 9, color: C.mutedHi, letterSpacing: 1.2, marginBottom: 6, fontFamily: mono }}>
              HOSPITAL ID
            </label>
            <input
              type="text"
              placeholder="e.g. H001"
              value={hospitalId}
              onChange={(e) => { setHospitalId(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{ ...iStyle, textTransform: "uppercase" }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 9, color: C.mutedHi, letterSpacing: 1.2, marginBottom: 6, fontFamily: mono }}>
              PASSWORD
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={iStyle}
            />
          </div>

          {error && (
            <div style={{
              background: `${C.red}10`, border: `1px solid ${C.red}44`, borderRadius: 6,
              padding: "10px 14px", marginBottom: 16, fontSize: 12, color: C.red,
              fontFamily: mono, textAlign: "center", letterSpacing: 0.5,
            }}>
              ✗ {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            style={{
              width: "100%", background: `linear-gradient(135deg, ${C.accent}, ${C.accent}aa)`,
              border: "none", borderRadius: 8, color: "#000", padding: "13px",
              fontSize: 12, fontWeight: 700, fontFamily: mono, letterSpacing: 2.5,
              cursor: "pointer", textTransform: "uppercase",
              boxShadow: `0 4px 20px ${C.accent}44`, transition: "transform 0.1s",
            }}
          >
            AUTHENTICATE &amp; ENTER
          </button>

          {/* Auth formula hint */}
          <div style={{
            marginTop: 18, padding: "10px 14px", background: "#03070f",
            borderRadius: 7, border: `1px solid ${C.border}`,
          }}>
            <div style={{ fontSize: 9, color: C.muted, fontFamily: mono, letterSpacing: 0.8, marginBottom: 5 }}>
              AUTH DERIVATION FORMULA
            </div>
            <div style={{ fontSize: 10, color: C.mutedHi, fontFamily: mono }}>
              password = <span style={{ color: C.accent }}>"CARE"</span> + hospital_id + <span style={{ color: C.accent }}>"2026"</span>
            </div>
            <div style={{ fontSize: 9, color: C.muted, fontFamily: mono, marginTop: 3 }}>
              Example: H001 → <span style={{ color: C.accent2, letterSpacing: 1 }}>CAREH0012026</span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 18, fontSize: 9, color: C.muted, fontFamily: mono, letterSpacing: 0.8 }}>
          CAREPULSE++ v2.0 · NO ML · NO RANDOMNESS · FULLY REPRODUCIBLE
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
