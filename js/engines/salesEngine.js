// REPLACE FILE
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
 * Full summary
 */
export function getSalesSummary(
  rows = []
) {
  const summary =
    getEmptyMetrics();

  rows.forEach((row) => {
    applyRow(
      summary,
      row
    );
  });

  return summary;
}

/**
 * By Style
 */
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

/**
 * By Brand
 */
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

/**
 * By PO Type
 */
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

/**
 * Date wise units
 */
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
   INTERNALS
----------------------------------- */

function applyRow(
  bucket,
  row
) {
  const qty =
    Number(row.qty) || 0;

  const gmv =
    Number(
      row.finalAmount
    ) || 0;

  bucket.grossUnits +=
    qty;

  bucket.grossGmv +=
    gmv;

  if (
    isCancelled(
      row.orderStatus
    )
  ) {
    bucket.cancelledUnits +=
      qty;

    bucket.cancelledGmv +=
      gmv;
  }

  if (
    isSale(
      row.orderStatus
    )
  ) {
    bucket.netUnits +=
      qty;

    bucket.netGmv +=
      gmv;
  }

  bucket.asp =
    divide(
      bucket.netGmv,
      bucket.netUnits
    );
}

function getEmptyMetrics() {
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

function isSale(
  status = ""
) {
  return SALE_STATUSES.includes(
    String(status)
      .toUpperCase()
  );
}

function isCancelled(
  status = ""
) {
  return CANCEL_STATUSES.includes(
    String(status)
      .toUpperCase()
  );
}