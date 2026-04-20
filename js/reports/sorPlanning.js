// NEW FILE
// FILE: js/reports/sorPlanning.js

import { buildReportData } from "../engines/reportEngine.js";
import { createKpiGrid } from "../components/kpiCards.js";
import { createTable } from "../components/table.js";
import { getSorPlanRow } from "../engines/planningEngine.js";

/* -----------------------------------
   SOR PLANNING REPORT
----------------------------------- */

export function renderSorPlanning({
  el,
  state
}) {
  const data =
    buildReportData(
      state.store,
      state.filters
    );

  const rows =
    buildRows(
      data,
      state.store
    );

  el.className =
    "report-page planning-table";

  el.appendChild(
    createKpiGrid([
      {
        label:
          "Shipment Qty",
        value:
          total(
            rows,
            "shipmentQty"
          ),
        icon: "🚚"
      },
      {
        label:
          "Recall Qty",
        value:
          total(
            rows,
            "recallQty"
          ),
        icon: "↩"
      },
      {
        label:
          "Ship Styles",
        value:
          rows.filter(
            (r) =>
              r.shipmentQty >
              0
          ).length,
        icon: "📦"
      },
      {
        label:
          "Recall Styles",
        value:
          rows.filter(
            (r) =>
              r.recallQty >
              0
          ).length,
        icon: "📤"
      }
    ])
  );

  el.appendChild(
    createTable({
      title:
        "SOR Planning",
      meta: `${rows.length} styles`,
      columns:
        getColumns(),
      rows,
      minWidth: 2400
    })
  );
}

/* -----------------------------------
   BUILD ROWS
----------------------------------- */

function buildRows(
  data,
  store
) {
  const rows = [];

  Object.keys(
    data.maps
      .salesByStyle
  ).forEach(
    (styleId) => {
      const pm =
        store.lookups
          .productByStyle[
          styleId
        ] || {};

      const gross =
        data.maps
          .salesByStyle[
          styleId
        ]
          .grossUnits ||
        0;

      const returns =
        data.maps
          .returnsByStyle[
          styleId
        ] || 0;

      const drr =
        data.maps
          .drrByStyle[
          styleId
        ] || 0;

      const stock =
        data.maps
          .sorStockByStyle[
          styleId
        ] || 0;

      const plan =
        getSorPlanRow({
          gross,
          returns,
          drr,
          stock
        });

      rows.push({
        "#":
          rows.length +
          1,
        styleId,
        erpSku:
          pm.erpSku ||
          "",
        erpStatus:
          pm.status ||
          "",
        brand:
          pm.brand ||
          "",
        rating: 0,
        ...plan
      });
    }
  );

  rows.sort(
    (a, b) =>
      b.shipmentQty -
      a.shipmentQty
  );

  rows.forEach(
    (row, i) =>
      (row["#"] =
        i + 1)
  );

  return rows;
}

/* -----------------------------------
   COLUMNS
----------------------------------- */

function getColumns() {
  return [
    { key: "#", label: "#", align: "right", format: "number" },
    { key: "styleId", label: "Style ID" },
    { key: "erpSku", label: "ERP SKU" },
    { key: "erpStatus", label: "ERP Status" },
    { key: "brand", label: "Brand" },
    { key: "rating", label: "Rating", align: "right", format: "number" },
    { key: "gross", label: "Gross", align: "right", format: "number" },
    { key: "returns", label: "Return", align: "right", format: "number" },
    { key: "net", label: "Net", align: "right", format: "number" },
    { key: "returnPercent", label: "Return %", align: "right", format: "percent" },
    { key: "drr", label: "DRR", align: "right", format: "number" },
    { key: "stock", label: "SOR Stock", align: "right", format: "number" },
    { key: "sc", label: "SC", align: "right", format: "number" },
    { key: "shipmentQty", label: "Shipment Qty", align: "right", format: "number" },
    { key: "recallQty", label: "Recall Qty", align: "right", format: "number" }
  ];
}

/* -----------------------------------
   HELPERS
----------------------------------- */

function total(
  rows,
  key
) {
  return rows.reduce(
    (a, b) =>
      a +
      (Number(
        b[key]
      ) || 0),
    0
  );
}
