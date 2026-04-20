// FILE: js/core/registry.js

import { renderDashboard } from "../reports/dashboard.js";
import { renderDayOnDaySale } from "../reports/dayOnDaySale.js";
import { renderSales } from "../reports/sales.js";
import { renderSjitPlanning } from "../reports/sjitPlanning.js";
import { renderSorPlanning } from "../reports/sorPlanning.js";
import { renderStyleDeepAnalysis } from "../reports/styleDeepAnalysis.js";
import { renderExportCenter } from "../reports/exportCenter.js";

/* -----------------------------------
   REPORT REGISTRY
   One place to bind all report files.
----------------------------------- */

const REPORTS = new Map();

/* -----------------------------------
   PUBLIC
----------------------------------- */

export function registerReports() {
  REPORTS.clear();

  REPORTS.set("dashboard", renderDashboard);
  REPORTS.set("dayOnDaySale", renderDayOnDaySale);
  REPORTS.set("sales", renderSales);
  REPORTS.set("sjitPlanning", renderSjitPlanning);
  REPORTS.set("sorPlanning", renderSorPlanning);
  REPORTS.set("styleDeepAnalysis", renderStyleDeepAnalysis);
  REPORTS.set("exportCenter", renderExportCenter);
}

export function getReportRenderer(reportId) {
  return REPORTS.get(reportId) || null;
}

export function getRegisteredReports() {
  return Array.from(REPORTS.keys());
}