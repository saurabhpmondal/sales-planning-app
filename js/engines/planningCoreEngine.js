// FULL REPLACEMENT FILE
// FILE: js/engines/planningCoreEngine.js

import { buildReportData } from "./reportEngine.js";

/* -----------------------------------
   SHARED PLANNING CORE ENGINE
   Stable version:
   - Uses existing reportEngine
   - No UI/global filter mutation
   - Internal 30 day planning logic
   - SJIT / SOR shared core
----------------------------------- */

export function getPlanningRows({
  store,
  filters = {},
  stockType = "sjit",
  enableZone = false
}) {
  const data = buildReportData(
    store,
    filters
  );

  const salesRows =
    data.filtered.sales || [];

  const grouped = {};

  salesRows.forEach((row) => {
    const id =
      row.styleId;

    if (!id) return;

    if (!grouped[id]) {
      const pm =
        store?.lookups
          ?.productByStyle?.[id] || {};

      const traffic =
        data.maps
          .trafficByStyle?.[id] || {};

      grouped[id] = {
        styleId: id,
        erpSku:
          pm.erpSku || "",
        erpStatus:
          pm.status || "",
        brand:
          pm.brand || "",
        rating:
          +traffic.rating || 0,

        grossUnits: 0,
        returnUnits: 0,
        zoneMap: {}
      };
    }

    const qty =
      +row.qty || 0;

    grouped[id].grossUnits += qty;

    if (
      enableZone &&
      row.state
    ) {
      const zone =
        getZone(row.state);

      grouped[id]
        .zoneMap[zone] =
        (
          grouped[id]
            .zoneMap[zone] || 0
        ) + qty;
    }
  });

  return Object.values(
    grouped
  )
    .map((row) =>
      finalizeRow(
        row,
        data,
        stockType,
        enableZone
      )
    )
    .sort(
      (a, b) =>
        b.net - a.net
    );
}

/* ----------------------------------- */

function finalizeRow(
  row,
  data,
  stockType,
  enableZone
) {
  const id =
    row.styleId;

  row.returnUnits =
    +data.maps
      .returnsByStyle?.[id] || 0;

  row.net =
    row.grossUnits -
    row.returnUnits;

  row.returnPercent =
    +data.maps
      .returnPercentByStyle?.[id] || 0;

  row.drr =
    row.net > 0
      ? row.net / 30
      : 0;

  row.stockCol =
    stockType === "sjit"
      ? +data.maps
          .sjitStockByStyle?.[id] || 0
      : +data.maps
          .sorStockByStyle?.[id] || 0;

  row.sc =
    row.drr > 0
      ? row.stockCol /
        row.drr
      : 0;

  const recallFlag =
    row.sc > 60 ||
    row.erpStatus !==
      "Continue" ||
    row.rating < 3.5 ||
    row.drr === 0;

  const target =
    row.drr * 45;

  row.shipmentQty = 0;
  row.recallQty = 0;

  if (recallFlag) {
    row.recallQty =
      row.drr === 0
        ? row.stockCol
        : Math.max(
            Math.round(
              row.stockCol -
              target
            ),
            0
          );
  } else {
    row.shipmentQty =
      Math.max(
        Math.round(
          target -
          row.stockCol
        ),
        0
      );
  }

  row.zone =
    enableZone
      ? getTopZone(
          row.zoneMap
        )
      : "";

  return row;
}

/* ----------------------------------- */

function getTopZone(
  map = {}
) {
  let best = "";
  let max = 0;

  Object.entries(map)
    .forEach(
      ([k, v]) => {
        if (v > max) {
          max = v;
          best = k;
        }
      }
    );

  return best;
}

/* ----------------------------------- */

function getZone(
  st = ""
) {
  const zones = {
    UP: "North Zone",
    DL: "North Zone",
    HR: "North Zone",
    PB: "North Zone",
    UT: "North Zone",

    KA: "South Zone",
    TN: "South Zone",
    TG: "South Zone",
    AP: "South Zone",
    KL: "South Zone",

    MH: "West Zone",
    GJ: "West Zone",
    RJ: "West Zone",

    WB: "East Zone",
    BR: "East Zone",
    OR: "East Zone",
    JH: "East Zone"
  };

  return (
    zones[st] ||
    "Other Zone"
  );
}