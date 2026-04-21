// FULL REPLACEMENT FILE
// FILE: js/engines/planningCoreEngine.js

import { buildReportData } from "./reportEngine.js";

/* -----------------------------------
   FINAL FIXED PLANNING CORE ENGINE

   Rules implemented:
   1. Use latest available sales date in dataset
   2. Backward 30 / 45 / 60 inclusive
   3. Shipment only for healthy items
   4. Discontinue / low rating / no demand => no shipment
   5. Remarks column added
----------------------------------- */

export function getPlanningRows({
  store,
  filters = {},
  stockType = "sjit",
  enableZone = false
}) {
  const days =
    Number(filters.planningDays) || 30;

  const latestDate =
    getLatestSalesDate(store);

  const windowFilters =
    buildRollingWindow(
      filters,
      latestDate,
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
    const id = row.styleId;
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

  return Object.values(grouped)
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

  row.shipmentQty = 0;
  row.recallQty = 0;
  row.remarks = "";

  const isContinue =
    String(
      row.erpStatus || ""
    )
      .trim()
      .toUpperCase() ===
    "CONTINUE";

  const goodRating =
    row.rating >= 3.5;

  const hasDemand =
    row.drr > 0;

  if (!isContinue) {
    row.remarks =
      "Discontinue";
  } else if (!goodRating) {
    row.remarks =
      "Low Rating";
  } else if (!hasDemand) {
    row.remarks =
      "No Demand";
  } else if (row.sc < 45) {
    row.shipmentQty =
      Math.max(
        Math.round(
          row.drr * 45 -
          row.stockCol
        ),
        0
      );

    row.remarks =
      "Shipment Required";
  } else if (row.sc > 60) {
    row.recallQty =
      Math.max(
        Math.round(
          row.stockCol -
          row.drr * 45
        ),
        0
      );

    row.remarks =
      "Excess Stock";
  } else {
    row.remarks =
      "Healthy";
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

function getLatestSalesDate(
  store
) {
  const rows =
    store?.sales || [];

  let latest =
    new Date(
      "2000-01-01"
    );

  rows.forEach((r) => {
    const d =
      rowToDate(r);

    if (
      d &&
      d > latest
    ) {
      latest = d;
    }
  });

  return latest;
}

function rowToDate(r) {
  if (
    r.fullDate
  ) {
    const d =
      new Date(
        r.fullDate
      );
    if (!isNaN(d))
      return d;
  }

  if (
    r.year &&
    r.month &&
    r.date
  ) {
    const m =
      monthIndex(
        r.month
      );

    const d =
      new Date(
        Number(
          r.year
        ),
        m,
        Number(
          r.date
        )
      );

    if (!isNaN(d))
      return d;
  }

  return null;
}

function monthIndex(m) {
  const arr = [
    "JAN","FEB","MAR","APR","MAY","JUN",
    "JUL","AUG","SEP","OCT","NOV","DEC"
  ];

  return Math.max(
    arr.indexOf(
      String(m)
        .trim()
        .toUpperCase()
    ),
    0
  );
}

function buildRollingWindow(
  filters,
  end,
  days
) {
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
    UP:"North Zone",
    DL:"North Zone",
    HR:"North Zone",
    PB:"North Zone",
    UT:"North Zone",

    KA:"South Zone",
    TN:"South Zone",
    TG:"South Zone",
    AP:"South Zone",
    KL:"South Zone",

    MH:"West Zone",
    GJ:"West Zone",
    RJ:"West Zone",

    WB:"East Zone",
    BR:"East Zone",
    OR:"East Zone",
    JH:"East Zone"
  };

  return (
    zones[st] ||
    "Other Zone"
  );
}