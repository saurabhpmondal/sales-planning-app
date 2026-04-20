
// NEW FILE
// FILE: js/reports/sjitPlanning.js

import { buildReportData } from "../engines/reportEngine.js";
import { createKpiGrid } from "../components/kpiCards.js";
import { createTable } from "../components/table.js";
import { getSjitPlanRow } from "../engines/planningEngine.js";

/* -----------------------------------
   SJIT PLANNING REPORT
----------------------------------- */

export function renderSjitPlanning({
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
          "North Ship Qty",
        value:
          sum(
            rows,
            "northShipQty"
          ),
        icon: "⬆"
      },
      {
        label:
          "South Ship Qty",
        value:
          sum(
            rows,
            "southShipQty"
          ),
        icon: "⬇"
      },
      {
        label:
          "Total Ship Qty",
        value:
          sum(
            rows,
            "totalShipQty"
          ),
        icon: "🚚"
      },
      {
        label:
          "Recall Qty",
        value:
          sum(
            rows,
            "recallQty"
          ),
        icon: "↩"
      }
    ])
  );

  el.appendChild(
    createTable({
      title:
        "SJIT Planning",
      meta: `${rows.length} styles`,
      columns:
        getColumns(),
      rows,
      minWidth: 2600
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

      const ret =
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
          .sjitStockByStyle[
          styleId
        ] || 0;

      const plan =
        getSjitPlanRow({
          gross,
          returns: ret,
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
      b.totalShipQty -
      a.totalShipQty
  );

  rows.forEach(
    (r, i) =>
      (r["#"] =
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
    { key: "stock", label: "SJIT Stock", align: "right", format: "number" },
    { key: "sc", label: "SC", align: "right", format: "number" },
    { key: "northShipQty", label: "North Ship Qty", align: "right", format: "number" },
    { key: "southShipQty", label: "South Ship Qty", align: "right", format: "number" },
    { key: "totalShipQty", label: "Total Ship Qty", align: "right", format: "number" },
    { key: "recallQty", label: "Recall Qty", align: "right", format: "number" }
  ];
}

/* -----------------------------------
   HELPERS
----------------------------------- */

function sum(
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