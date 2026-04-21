// FULL REPLACEMENT FILE
// FILE: js/engines/planningCoreEngine.js

import { buildReportData } from "./reportEngine.js";

/* -----------------------------------
   FINAL PLANNING CORE ENGINE
   FIXED:
   - Uses latest available sales date
   - 30/45/60 always data if sales exist
   - Shipment only for healthy items
   - Adds remarks
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

  const salesBase =
    store?.sales || [];

  const endDate =
    getLatestSalesDate(
      salesBase
    );

  const windowFilters =
    buildRollingWindow(
      filters,
      endDate,
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
    .sort