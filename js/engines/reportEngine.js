// REPLACE FILE
// FILE: js/engines/reportEngine.js

import { getFilteredData } from "./filterEngine.js";

import {
  getSalesSummary,
  getSalesByStyle,
  getSalesByBrand,
  getSalesByPoType
} from "./salesEngine.js";

import {
  getReturnRowsForSalesWindow,
  getReturnSummary,
  getReturnsByStyle,
  getReturnPercentByStyle
} from "./returnsEngine.js";

import {
  getSjitStockByStyle,
  getSorStockByStyle
} from "./stockEngine.js";

import {
  getTrafficByStyle,
  getTrafficByBrand
} from "./trafficEngine.js";

import {
  getDrrByStyle
} from "./drrEngine.js";

import {
  getGrowthByStyle
} from "./growthEngine.js";

/* -----------------------------------
   MASTER REPORT ENGINE
   Central reusable joined metrics
----------------------------------- */

export function buildReportData(
  store,
  filters = {}
) {
  /* --------------------------------
     FILTER DATASETS
  -------------------------------- */
  const filtered =
    getFilteredData(
      store,
      filters
    );

  /* --------------------------------
     SALES
  -------------------------------- */
  const salesSummary =
    getSalesSummary(
      filtered.sales
    );

  const salesByStyle =
    getSalesByStyle(
      filtered.sales
    );

  const salesByBrand =
    getSalesByBrand(
      filtered.sales
    );

  const salesByPoType =
    getSalesByPoType(
      filtered.sales
    );

  /* --------------------------------
     RETURNS
  -------------------------------- */
  const returnRows =
    getReturnRowsForSalesWindow(
      filtered.sales,
      filtered.returns,
      filters
    );

  const returnSummary =
    getReturnSummary(
      returnRows,
      salesSummary.netUnits
    );

  const returnsByStyle =
    getReturnsByStyle(
      returnRows
    );

  const returnPercentByStyle =
    getReturnPercentByStyle(
      returnsByStyle,
      salesByStyle
    );

  /* --------------------------------
     STOCK
  -------------------------------- */
  const sjitStockByStyle =
    getSjitStockByStyle(
      filtered.sjitStock
    );

  const sorStockByStyle =
    getSorStockByStyle(
      filtered.sorStock
    );

  /* --------------------------------
     TRAFFIC
  -------------------------------- */
  const trafficByStyle =
    getTrafficByStyle(
      filtered.traffic
    );

  const trafficByBrand =
    getTrafficByBrand(
      filtered.traffic
    );

  /* --------------------------------
     DEMAND
  -------------------------------- */
  const drrByStyle =
    getDrrByStyle(
      filtered.sales
    );

  /* --------------------------------
     GROWTH
  -------------------------------- */
  const growthByStyle =
    getGrowthByStyle(
      filtered.sales,
      filters
    );

  /* --------------------------------
     FINAL
  -------------------------------- */
  return {
    filtered,

    summary: {
      ...salesSummary,
      ...returnSummary
    },

    maps: {
      salesByStyle,
      salesByBrand,
      salesByPoType,

      returnsByStyle,
      returnPercentByStyle,

      sjitStockByStyle,
      sorStockByStyle,

      trafficByStyle,
      trafficByBrand,

      drrByStyle,
      growthByStyle
    }
  };
}