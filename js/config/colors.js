// FILE: js/config/colors.js

/* -----------------------------------
   CENTRAL COLOR TOKENS FOR JS USE
   (Charts / badges / conditional UI)
----------------------------------- */

export const COLORS = {
  primary: "#2563eb",
  primarySoft: "#dbeafe",

  success: "#16a34a",
  successSoft: "#dcfce7",

  danger: "#dc2626",
  dangerSoft: "#fee2e2",

  warning: "#d97706",
  warningSoft: "#fef3c7",

  slate900: "#0f172a",
  slate700: "#334155",
  slate600: "#475569",
  slate500: "#64748b",
  slate400: "#94a3b8",

  border: "#e2e8f0",
  surface: "#ffffff",
  surfaceSoft: "#f8fafc"
};

/* -----------------------------------
   HELPERS
----------------------------------- */

export function getGrowthColor(value = 0) {
  const num = Number(value) || 0;

  if (num > 0) return COLORS.success;
  if (num < 0) return COLORS.danger;

  return COLORS.slate500;
}

export function getStatusColor(status = "") {
  const key = String(status).toUpperCase();

  if (
    key === "LIVE" ||
    key === "ACTIVE"
  ) {
    return COLORS.success;
  }

  if (
    key === "INACTIVE" ||
    key === "DELISTED" ||
    key === "BLOCKED"
  ) {
    return COLORS.danger;
  }

  return COLORS.slate500;
}