// FILE: js/config/stockCover.js

import { STOCK_COVER_BUCKETS } from "../core/constants.js";

/* -----------------------------------
   STOCK COVER CONFIG
   Exact approved buckets
----------------------------------- */

export const STOCK_COVER_CONFIG =
  STOCK_COVER_BUCKETS;

/* -----------------------------------
   HELPERS
----------------------------------- */

export function getStockCoverBuckets() {
  return STOCK_COVER_CONFIG;
}

/**
 * Returns bucket label by cover days
 * @param {number} cover
 * @returns {string}
 */
export function getStockCoverLabel(
  cover = 0
) {
  const value = Number(cover) || 0;

  const bucket =
    STOCK_COVER_CONFIG.find(
      (item) =>
        value >= item.min &&
        value <= item.max
    );

  return bucket?.label || ">90";
}