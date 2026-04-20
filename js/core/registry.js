// FULL REPLACEMENT FILE
// FILE: js/core/registry.js

import { renderDashboard } from "../reports/dashboard.js";
import { renderSales } from "../reports/sales.js";
import { renderDayOnDaySale } from "../reports/dayOnDaySale.js";
import { renderSjitPlanning } from "../reports/sjitPlanning.js";
import { renderSorPlanning } from "../reports/sorPlanning.js";

/* -----------------------------------
   REPORT REGISTRY
----------------------------------- */

const REPORTS = {};

/* ----------------------------------- */

export function registerReports() {
  REPORTS.dashboard =
    renderDashboard;

  REPORTS.sales =
    renderSales;

  REPORTS.dayOnDay =
    renderDayOnDaySale;

  REPORTS.sjitPlanning =
    renderSjitPlanning;

  REPORTS.sorPlanning =
    renderSorPlanning;
}

/* ----------------------------------- */

export function getReportRenderer(
  key
) {
  return REPORTS[key];
}