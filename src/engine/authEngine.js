// ============================================================
// FEATURE 1: DETERMINISTIC AUTHENTICATION ENGINE
//
// Formula:  password = "CARE" + hospital_id + "2026"
// Example:  H001 → CAREH0012026
//
// Rules:
//  - No external database
//  - No randomness
//  - No session memory beyond React state
//  - Identical input always produces identical output
//  - O(1) string comparison
// ============================================================

/**
 * Derives the correct password for a given hospital ID.
 * Pure function — deterministic, no side effects.
 */
export const derivePassword = (hospitalId) =>
  `CARE${hospitalId.trim().toUpperCase()}2026`;

/**
 * Authenticates a hospital login attempt.
 * Returns true if credentials are valid, false otherwise.
 */
export const authenticate = (hospitalId, password) => {
  if (!hospitalId || !password) return false;
  return password === derivePassword(hospitalId);
};
