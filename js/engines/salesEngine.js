// REPLACE FILE
// FILE: js/engines/salesEngine.js

import { divide } from "../utils/math.js";

export function getSalesSummary(rows = []) {
  const x = empty();

  rows.forEach(r => apply(x, r));

  return x;
}

export function getSalesByStyle(rows = []) {
  const map = {};
  rows.forEach(r => {
    const id = r.styleId;
    if (!id) return;
    if (!map[id]) map[id] = empty();
    apply(map[id], r);
  });
  return map;
}

export function getSalesByBrand(rows = []) {
  const map = {};
  rows.forEach(r => {
    const k = r.brand || "Unknown";
    if (!map[k]) map[k] = empty();
    apply(map[k], r);
  });
  return map;
}

export function getSalesByPoType(rows = []) {
  const map = {};
  rows.forEach(r => {
    const k = r.poType || "Unknown";
    if (!map[k]) map[k] = empty();
    apply(map[k], r);
  });
  return map;
}

export function getUnitsByDate(rows = []) {
  const map = {};
  rows.forEach(r => {
    const d = Number(r.date || 0);
    map[d] = (map[d] || 0) + (Number(r.qty) || 0);
  });
  return map;
}

function apply(o, r) {
  const qty = Number(r.qty) || 0;
  const gmv = Number(r.finalAmount) || 0;

  o.grossUnits += qty;
  o.netUnits += qty;

  o.grossGmv += gmv;
  o.netGmv += gmv;

  o.asp = divide(o.netGmv, o.netUnits);
}

function empty() {
  return {
    grossUnits: 0,
    cancelledUnits: 0,
    netUnits: 0,
    grossGmv: 0,
    cancelledGmv: 0,
    netGmv: 0,
    asp: 0
  };
}