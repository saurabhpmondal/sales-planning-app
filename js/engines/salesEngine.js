
// FILE: js/engines/salesEngine.js

import {
  SALE_STATUSES,
  CANCEL_STATUSES
} from "../core/constants.js";

import { divide } from "../utils/math.js";

/* -----------------------------------
   SALES ENGINE
----------------------------------- */

/**
 * Full summary from rows
 */
export function getSalesSummary(
  rows = []
) {
  let grossUnits = 0;
  let cancelledUnits = 0;
  let netUnits = 0;

  let grossGmv = 0;
  let cancelledGmv = 0;
  let netGmv = 0;

  rows.forEach((row) => {
    const qty =
      Number(row.qty) || 0;

    const gmv =
      Number(
        row.finalAmount
      ) || 0;

    grossUnits += qty;
    grossGmv += gmv;

    if (
      isCancelled(
        row.orderStatus
      )
    ) {
      cancelledUnits +=
        qty;

      cancelledGmv +=
        gmv;
    }

    if (
      isSale(
        row.orderStatus
      )
    ) {
      netUnits += qty;
      netGmv += gmv;
    }
  });

  return {
    grossUnits,
    cancelledUnits,
    netUnits,

    grossGmv,
    cancelledGmv,
    netGmv,

    asp: divide(
      netGmv,
      netUnits
    )
  };
}

/* -----------------------------------
   STYLE LEVEL MAP
----------------------------------- */

export function getSalesByStyle(
  rows = []
) {
  const map = {};

  rows.forEach((row) => {
    const id =
      row.styleId;

    if (!id) return;

    if (!map[id]) {
      map[id] =
        getEmptyMetrics();
    }

    applyRow(
      map[id],
      row
    );
  });

  return map;
}

/* -----------------------------------
   BRAND LEVEL MAP
----------------------------------- */

export function getSalesByBrand(
  rows = []
) {
  const map = {};

  rows.forEach((row) => {
    const key =
      row.brand ||
      "Unknown";

    if (!map[key]) {
      map[key] =
        getEmptyMetrics();
    }

    applyRow(
      map[key],
      row
    );
  });

  return map;
}

/* -----------------------------------
   PO TYPE MAP
----------------------------------- */

export function getSalesByPoType(
  rows = []
) {
  const map = {};

  rows.forEach((row) => {
    const key =
      row.poType ||
      "Unknown";

    if (!map[key]) {
      map[key] =
        getEmptyMetrics();
    }

    applyRow(
      map[key],
      row
    );
  });

  return map;
}

/* -----------------------------------
   DAILY UNITS
----------------------------------- */

export function getUnitsByDate(
  rows = []
) {
  const map = {};

  rows.forEach((row) => {
    if (
      !isSale(
        row.orderStatus
      )
    ) {
      return;
    }

    const day =
      Number(
        row.date
      ) || 0;

    map[day] =
      (map[day] || 0) +
      (Number(
        row.qty
      ) || 0);
  });

  return map;
}

/* -----------------------------------
   HELPERS
----------------------------------- */

function applyRow(
  bucket,
  row
) {
  const qty =
    Number