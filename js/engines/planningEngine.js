// FILE: js/engines/planningEngine.js

import { ceil } from "../utils/math.js";

/* -----------------------------------
   PLANNING ENGINE
   Placeholder logic ready for upgrade
----------------------------------- */

/**
 * SJIT planning row
 */
export function getSjitPlanRow({
  gross = 0,
  returns = 0,
  drr = 0,
  stock = 0
} = {}) {
  const net =
    gross - returns;

  const sc =
    drr
      ? stock / drr
      : 0;

  let ship = 0;
  let recall = 0;

  if (sc < 30) {
    ship = ceil(
      drr * 30 - stock
    );
  }

  if (sc > 90) {
    recall = ceil(
      stock -
        drr * 60
    );
  }

  const northShipQty =
    ceil(ship / 2);

  const southShipQty =
    ship -
    northShipQty;

  return {
    gross,
    returns,
    net,

    returnPercent:
      gross
        ? (returns /
            gross) *
          100
        : 0,

    drr,
    stock,
    sc,

    northShipQty,
    southShipQty,
    totalShipQty:
      ship,
    recallQty:
      recall
  };
}

/**
 * SOR planning row
 */
export function getSorPlanRow({
  gross = 0,
  returns = 0,
  drr = 0,
  stock = 0
} = {}) {
  const net =
    gross - returns;

  const sc =
    drr
      ? stock / drr
      : 0;

  let shipmentQty = 0;
  let recallQty = 0;

  if (sc < 30) {
    shipmentQty =
      ceil(
        drr * 30 -
          stock
      );
  }

  if (sc > 90) {
    recallQty =
      ceil(
        stock -
          drr * 60
      );
  }

  return {
    gross,
    returns,
    net,

    returnPercent:
      gross
        ? (returns /
            gross) *
          100
        : 0,

    drr,
    stock,
    sc,

    shipmentQty,
    recallQty
  };
}
