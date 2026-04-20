// FULL REPLACEMENT FILE
// FILE: js/engines/planningCoreEngine.js

import { buildReportData } from "./reportEngine.js";

/* -----------------------------------
   SHARED PLANNING CORE ENGINE
   FIXED:
   - Uses real reportEngine maps
   - Fix zero stock
   - Fix zero rating
   - Fix DRR
   - Fix returns
----------------------------------- */

export function getPlanningRows({
  store,
  filters,
  stockType = "sjit",
  enableZone = false
}) {
  const data =
    buildReportData(
      store,
      filters
    );

  const salesRows =
    data.filtered.sales || [];

  const days =
    getSelectedDays(
      filters
    );

  const grouped = {};

  salesRows.forEach((r) => {
    const id =
      r.styleId;

    if (!id) return;

    if (!grouped[id]) {
      const pm =
        store
          ?.lookups
          ?.productByStyle?.[id] || {};

      const tf =
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
          +tf.rating || 0,

        grossUnits: 0,
        returnUnits: 0,
        zoneMap: {}
      };
    }

    grouped[id].grossUnits +=
      +r.qty || 0;

    const st =
      r.state || "";

    if (
      enableZone &&
      st
    ) {
      const z =
        getZone(st);

      grouped[id]
        .zoneMap[z] =
        (
          grouped[id]
            .zoneMap[z] || 0
        ) +
        (+r.qty || 0);
    }
  });

  const out =
    Object.values(grouped)
      .map((row) => {
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
          +data.maps
            .drrByStyle?.[id] ||
          (
            row.net / days
          );

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

        const recall =
          row.sc > 60 ||
          row.erpStatus !==
            "Continue" ||
          row.rating < 3.5 ||
          row.drr === 0;

        const target =
          row.drr * 45;

        row.shipmentQty = 0;
        row.recallQty = 0;

        if (recall) {
          row.recallQty =
            row.drr === 0
              ? row.stockCol
              : Math.max(
                  row.stockCol -
                    target,
                  0
                );
        } else {
          row.shipmentQty =
            Math.max(
              target -
                row.stockCol,
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
      })
      .sort(
        (a, b) =>
          b.net - a.net
      );

  return out;
}

/* ----------------------------------- */

function getSelectedDays(
  filters = {}
) {
  const s =
    filters.startDate;
  const e =
    filters.endDate;

  if (!s || !e)
    return 30;

  const start =
    new Date(s);
  const end =
    new Date(e);

  const diff =
    Math.floor(
      (end - start) /
        86400000
    ) + 1;

  return Math.max(
    diff,
    1
  );
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
  const z = {
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
    z[st] ||
    "Other Zone"
  );
}