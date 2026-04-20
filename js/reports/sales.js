// REPLACE FILE
// FILE: js/reports/sales.js

import { buildReportData } from "../engines/reportEngine.js";
import { createTable } from "../components/table.js";

/* -----------------------------------
   SALES REPORT
   Fixed:
   - traffic values loaded immediately
   - growth %
   - rankings
----------------------------------- */

export function renderSales({
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
    "report-page";

  el.appendChild(
    createTable({
      title:
        "Sales Report",
      meta: `${rows.length} styles`,
      columns:
        getColumns(),
      rows,
      minWidth: 3200
    })
  );
}

/* -----------------------------------
   BUILD
----------------------------------- */

function buildRows(
  data,
  store
) {
  const ids =
    Object.keys(
      data.maps
        .salesByStyle
    );

  const rows =
    ids.map(
      (styleId) => {
        const sales =
          data.maps
            .salesByStyle[
            styleId
          ] || {};

        const pm =
          store.lookups
            .productByStyle[
            styleId
          ] || {};

        const traffic =
          data.maps
            .trafficByStyle[
            styleId
          ] || {};

        return {
          rank: 0,
          styleId,
          erpSku:
            pm.erpSku ||
            "",
          brand:
            pm.brand ||
            "",

          rating:
            traffic.rating ||
            0,

          gmv:
            sales.netGmv ||
            0,

          units:
            sales.netUnits ||
            0,

          asp:
            sales.asp ||
            0,

          returnPercent:
            data.maps
              .returnPercentByStyle[
              styleId
            ] || 0,

          ppmp:
            share(
              data,
              styleId,
              "PPMP"
            ),

          sjit:
            share(
              data,
              styleId,
              "SJIT"
            ),

          sor:
            share(
              data,
              styleId,
              "SOR"
            ),

          growth:
            data.maps
              .growthByStyle[
              styleId
            ] || 0,

          demand:
            data.maps
              .drrByStyle[
              styleId
            ] || 0,

          sjitStock:
            data.maps
              .sjitStockByStyle[
              styleId
            ] || 0,

          sorStock:
            data.maps
              .sorStockByStyle[
              styleId
            ] || 0,

          impressions:
            traffic.impressions ||
            0,

          clicks:
            traffic.clicks ||
            0,

          atc:
            traffic.addToCarts ||
            0,

          ctr:
            traffic.ctr ||
            0,

          cvr: 0
        };
      }
    );

  rows.sort(
    (a, b) =>
      b.units -
      a.units
  );

  rows.forEach(
    (r, i) =>
      (r.rank =
        i + 1)
  );

  return rows;
}

/* -----------------------------------
   SHARE %
----------------------------------- */

function share(
  data,
  styleId,
  poType
) {
  const rows =
    data.filtered.sales.filter(
      (r) =>
        r.styleId ===
          styleId &&
        r.poType ===
          poType
    );

  const qty =
    rows.reduce(
      (a, b) =>
        a +
        (Number(
          b.qty
        ) || 0),
      0
    );

  const total =
    data.maps
      .salesByStyle[
      styleId
    ]?.netUnits || 0;

  if (!total)
    return 0;

  return (
    (qty / total) *
    100
  );
}

/* -----------------------------------
   COLUMNS
----------------------------------- */

function getColumns() {
  return [
    { key: "rank", label: "#", align: "right", format: "number" },
    { key: "styleId", label: "Style ID" },
    { key: "erpSku", label: "ERP SKU" },
    { key: "brand", label: "Brand" },
    { key: "rating", label: "Rating", align: "right", format: "number" },
    { key: "gmv", label: "GMV", align: "right", format: "currency" },
    { key: "units", label: "Units", align: "right", format: "number" },
    { key: "asp", label: "ASP", align: "right", format: "currency" },
    { key: "returnPercent", label: "Return %", align: "right", format: "percent" },
    { key: "ppmp", label: "PPMP %", align: "right", format: "percent" },
    { key: "sjit", label: "SJIT %", align: "right", format: "percent" },
    { key: "sor", label: "SOR %", align: "right", format: "percent" },
    { key: "growth", label: "Growth %", align: "right", format: "percent" },
    { key: "demand", label: "Demand", align: "right", format: "number" },
    { key: "sjitStock", label: "SJIT Stock", align: "right", format: "number" },
    { key: "sorStock", label: "SOR Stock", align: "right", format: "number" },
    { key: "impressions", label: "Impressions", align: "right", format: "number" },
    { key: "clicks", label: "Clicks", align: "right", format: "number" },
    { key: "atc", label: "ATC", align: "right", format: "number" },
    { key: "ctr", label: "CTR %", align: "right", format: "percent" },
    { key: "cvr", label: "CVR %", align: "right", format: "percent" }
  ];
}