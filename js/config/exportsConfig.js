// FILE: js/config/exportsConfig.js

/* -----------------------------------
   EXPORT CENTER CONFIG
   Single place to manage all exports
----------------------------------- */

export const EXPORTS_CONFIG = [
  {
    id: "dashboard-summary",
    title: "Dashboard Summary",
    description:
      "Export KPI cards, brand performance, PO type analysis and dashboard tables.",
    type: "csv",
    enabled: true
  },
  {
    id: "day-on-day-sale",
    title: "Day on Day Sale",
    description:
      "Export daily sales matrix with dates, DRR and monthly totals.",
    type: "csv",
    enabled: true
  },
  {
    id: "sales-report",
    title: "Sales Report",
    description:
      "Export ranked sales report with GMV, units, return %, shares, stock and traffic.",
    type: "csv",
    enabled: true
  },
  {
    id: "sjit-planning",
    title: "SJIT Planning",
    description:
      "Export shipment planning, recall quantities and stock cover for SJIT styles.",
    type: "csv",
    enabled: true
  },
  {
    id: "sor-planning",
    title: "SOR Planning",
    description:
      "Export shipment planning, recall quantities and stock cover for SOR styles.",
    type: "csv",
    enabled: true
  },
  {
    id: "style-deep-analysis",
    title: "Style Deep Analysis",
    description:
      "Export detailed style-level metrics, history and operational data.",
    type: "csv",
    enabled: true
  },
  {
    id: "master-data",
    title: "Master Data Dump",
    description:
      "Export normalized joined style metrics for all styles.",
    type: "csv",
    enabled: true
  }
];

/* -----------------------------------
   HELPERS
----------------------------------- */

export function getEnabledExports() {
  return EXPORTS_CONFIG.filter(
    (item) => item.enabled
  );
}

export function getExportById(id) {
  return (
    EXPORTS_CONFIG.find(
      (item) => item.id === id
    ) || null
  );
}