// FILE: js/config/priceRanges.js

import { PRICE_RANGES } from "../core/constants.js";

/* -----------------------------------
   PRICE RANGE CONFIG
   Exact approved slabs
----------------------------------- */

export const PRICE_RANGE_CONFIG = PRICE_RANGES;

/* -----------------------------------
   HELPERS
----------------------------------- */

export function getPriceRanges() {
  return PRICE_RANGE_CONFIG;
}

/**
 * Return slab label for given price
 * @param {number} price
 * @returns {string}
 */
export function getPriceRangeLabel(price = 0) {
  const value = Number(price) || 0;

  const match = PRICE_RANGE_CONFIG.find(
    (range) =>
      value >= range.min &&
      value <= range.max
  );

  return match?.label || "Unknown";
}