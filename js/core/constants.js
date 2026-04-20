// FILE: js/core/constants.js

/* -----------------------------------
   APP META
----------------------------------- */

export const APP_INFO = {
  name: "Sales & Planning",
  version: "V1.0 Foundation",
  currency: "INR",
  locale: "en-IN"
};

/* -----------------------------------
   TAB IDS
----------------------------------- */

export const TAB_IDS = {
  DASHBOARD: "dashboard",
  DAY_ON_DAY: "dayOnDaySale",
  SALES: "sales",
  SJIT: "sjitPlanning",
  SOR: "sorPlanning",
  STYLE_DEEP: "styleDeepAnalysis",
  EXPORT: "exportCenter"
};

/* -----------------------------------
   SALES STATUS RULES
----------------------------------- */

export const SALE_STATUSES = [
  "C",
  "SH",
  "SALE",
  "WP",
  "PK"
];

export const CANCEL_STATUSES = [
  "F",
  "RTO"
];

/* -----------------------------------
   PO TYPES
----------------------------------- */

export const PO_TYPES = [
  "FC",
  "PPMP",
  "SJIT",
  "SOR"
];

/* -----------------------------------
   RETURN RULES
----------------------------------- */

export const VALID_RETURN_TYPE = "Return";

export const RETURN_WINDOW_DAYS = 60;

/* -----------------------------------
   PRICE RANGES
----------------------------------- */

export const PRICE_RANGES = [
  { label: "0-300", min: 0, max: 300 },
  { label: "301-600", min: 301, max: 600 },
  { label: "601-800", min: 601, max: 800 },
  { label: "801-1000", min: 801, max: 1000 },
  { label: "1001-1500", min: 1001, max: 1500 },
  { label: "1501-2000", min: 1501, max: 2000 },
  { label: ">2000", min: 2001, max: Infinity }
];

/* -----------------------------------
   STOCK COVER BUCKETS
----------------------------------- */

export const STOCK_COVER_BUCKETS = [
  { label: "<30", min: 0, max: 29.99 },
  { label: "30-45", min: 30, max: 45 },
  { label: "45-60", min: 45.01, max: 60 },
  { label: "60