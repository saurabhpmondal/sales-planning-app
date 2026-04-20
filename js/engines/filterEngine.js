// REPLACE FILE
// FILE: js/engines/filterEngine.js

import { getFilters } from "../core/state.js";

export function getFilteredData(store, inputFilters = {}) {
  const filters = { ...getFilters(), ...inputFilters };

  const salesBase = store.sales || [];

  let sales = salesBase.filter(row =>
    monthOk(row, filters) &&
    dateOk(row, filters) &&
    brandOk(row.brand, filters) &&
    poOk(row.poType, filters) &&
    searchOk(row.styleId, row.erpSku, filters)
  );

  // safety fallback: if month filter kills all rows, use raw sales
  if (!sales.length && filters.month && filters.month !== "ALL") {
    console.warn("Month filter returned zero rows, fallback applied");
    sales = salesBase.filter(row =>
      brandOk(row.brand, filters) &&
      poOk(row.poType, filters) &&
      searchOk(row.styleId, row.erpSku, filters)
    );
  }

  return {
    sales,
    returns: store.returns || [],
    traffic: store.traffic || [],
    sjitStock: store.sjitStock || [],
    sorStock: store.sorStock || [],
    sellerStock: store.sellerStock || [],
    productMaster: store.productMaster || []
  };
}

function monthOk(row, filters) {
  if (!filters.month || filters.month === "ALL" || filters.month === "AUTO") {
    return true;
  }

  const label = String(filters.month).trim().toUpperCase();
  const rowLabel = `${String(row.month).trim().toUpperCase()} ${String(row.year).trim()}`;

  return rowLabel === label;
}

function dateOk(row, filters) {
  const day = Number(row.date || 0);

  if (filters.startDate) {
    const s = Number(filters.startDate.split("-")[2]);
    if (day < s) return false;
  }

  if (filters.endDate) {
    const e = Number(filters.endDate.split("-")[2]);
    if (day > e) return false;
  }

  return true;
}

function brandOk(v, f) {
  return f.brand === "ALL" || v === f.brand;
}

function poOk(v, f) {
  return f.poType === "ALL" || v === f.poType;
}

function searchOk(styleId, sku, f) {
  const q = String(f.search || "").trim().toLowerCase();
  if (!q) return true;

  return String(styleId).toLowerCase().includes(q) ||
         String(sku || "").toLowerCase().includes(q);
}