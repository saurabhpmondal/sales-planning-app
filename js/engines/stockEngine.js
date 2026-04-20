// FILE: js/engines/stockEngine.js

import { divide } from "../utils/math.js";
import { getStockCoverLabel } from "../config/stockCover.js";

/* -----------------------------------
   STOCK ENGINE
----------------------------------- */

/**
 * Consolidated SJIT stock by style_id
 */
export function getSjitStockByStyle(
  rows = []
) {
  const map = {};

  rows.forEach((row) => {
    const id =
      row.styleId;

    if (!id) return;

    const qty =
      Number(
        row.sellableInventoryCount
      ) ||
      Number(
        row.inventoryCount
      ) ||
      0;

    map[id] =
      (map[id] || 0) + qty;
  });

  return map;
}

/**
 * Consolidated SOR stock by style_id
 */
export function getSorStockByStyle(
  rows = []
) {
  const map = {};

  rows.forEach((row) => {
    const id =
      row.styleId;

    if (!id) return;

    map[id] =
      (map[id] || 0) +
      (Number(
        row.units
      ) || 0);
  });

  return map;
}

/**
 * Consolidated seller stock by erp sku
 */
export function getSellerStockBySku(
  rows = []
) {
  const map = {};

  rows.forEach((row) => {
    const sku =
      row.erpSku;

    if (!sku) return;

    map[sku] =
      (map[sku] || 0) +
      (Number(
        row.units
      ) || 0);
  });

  return map;
}

/* -----------------------------------
   COVER DAYS
----------------------------------- */

export function getStockCover(
  stock = 0,
  drr = 0
) {
  return divide(
    stock,
    drr
  );
}

/**
 * Bucket label
 */
export function getStockCoverBucket(
  stock = 0,
  drr = 0
) {
  const cover =
    getStockCover(
      stock,
      drr
    );

  return getStockCoverLabel(
    cover
  );
}

/* -----------------------------------
   COVER SUMMARY TABLE
----------------------------------- */

export function getCoverDistribution(
  stockMap = {},
  drrMap = {}
) {
  const output = {};

  Object.keys(
    stockMap
  ).forEach((styleId) => {
    const stock =
      stockMap[
        styleId
      ] || 0;

    const drr =
      drrMap[
        styleId
      ] || 0;

    const bucket =
      getStockCoverBucket(
        stock,
        drr
      );

    output[bucket] =
      (output[
        bucket
      ] || 0) + stock;
  });

  return output;
}

/* -----------------------------------
   TOTALS
----------------------------------- */

export function getStockTotals({
  sjitMap = {},
  sorMap = {}
} = {}) {
  return {
    sjitUnits:
      sumMap(
        sjitMap
      ),
    sorUnits:
      sumMap(
        sorMap
      )
  };
}

/* -----------------------------------
   HELPERS
----------------------------------- */

function sumMap(
  map = {}
) {
  return Object.values(
    map
  ).reduce(
    (a, b) =>
      a +
      (Number(b) ||
        0),
    0
  );
}
