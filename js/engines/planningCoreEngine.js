// FULL REPLACEMENT FILE
// FILE: js/engines/planningCoreEngine.js

import { buildReportData } from "./reportEngine.js";

/* -----------------------------------
   SHARED PLANNING CORE ENGINE
   Uses planningDays dropdown:
   30 / 45 / 60
----------------------------------- */

export function getPlanningRows({
  store,
  filters = {},
  stockType = "sjit",
  enableZone = false
}) {
  const days =
    Number(
      filters.planningDays
    ) || 30;

  const windowFilters =
    buildRollingWindow(
      filters,
      days
    );

  const data =
    buildReportData(
      store,
      windowFilters
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
        days,
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
  days,
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
      ? row.net / days
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

  const target =
    row.drr * 45;

  row.shipmentQty =
    row.sc < 45
      ? Math.max(
          Math.round(
            target -
            row.stockCol
          ),
          0
        )
      : 0;

  row.recallQty =
    row.sc > 60
      ? Math.max(
          Math.round(
            row.stockCol -
            target
          ),
          0
        )
      : 0;

  row.zone =
    enableZone
      ? getTopZone(
          row.zoneMap
        )
      : "";

  return row;
}

/* ----------------------------------- */

function buildRollingWindow(
  filters,
  days
) {
  const end =
    new Date();

  end.setDate(
    end.getDate() - 1
  );

  const start =
    new Date(end);

  start.setDate(
    end.getDate() -
    (days - 1)
  );

  return {
    ...filters,
    month: "ALL",
    startDate:
      iso(start),
    endDate:
      iso(end)
  };
}

function iso(d) {
  return d
    .toISOString()
    .slice(0, 10);
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