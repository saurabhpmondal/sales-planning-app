
// NEW FILE
// FILE: js/reports/sales.js

import { buildReportData } from "../engines/reportEngine.js";
import { createTable } from "../components/table.js";
import { formatPercent } from "../utils/format.js";

/* -----------------------------------
   SALES REPORT
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
    buildSalesRows(
      data,
      state.store
    );

  el.className =
    "report-page sales-table";

  el.appendChild(
    createTable({
      title:
        "Sales Report",
      meta: `${rows.length} styles ranked by units`,
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

function buildSalesRows(
  data,
  store
) {
  const {
    maps
  } = data;

  const styleIds =
    Object.keys(
      maps.salesByStyle
    );

  const rows =
    styleIds.map(
      (styleId) => {
        const sales =
          maps
            .salesByStyle[
            styleId
          ] || {};

        const pm =
          store.lookups
            .productByStyle[
            styleId
          ] || {};

        const traffic =
          maps
            .trafficByStyle[
            styleId
          ] || {};

        const gross =
          sales.netUnits || 0;

        const ppmp =
          share(
            styleId,
            "PPMP",
            data
          );

        const sjit =
          share(
            styleId,
            "SJIT",
            data
          );

        const sor =
          share(
            styleId,
            "SOR",
            data
          );

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
            maps
              .returnPercentByStyle[
              styleId
            ] || 0,

          ppmp:
            ppmp,
          sjit:
            sjit,
          sor:
            sor,

          growth:
            maps
              .growthByStyle[
              styleId
            ] || 0,

          demand:
            maps
              .drrByStyle[
              styleId
            ] || 0,

          sjitStock:
            maps
              .sjitStockByStyle[
              styleId
            ] || 0,

          sorStock:
            maps
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
            traffic.ctr || 0,

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
  styleId,
  poType,
  data
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
    { key: "rank", label: "Rank", align: "right", format: "number" },
    { key: "styleId", label: "Style ID" },
    { key: "erpSku", label: "ERP SKU" },
    { key: "brand", label: "Brand" },
    { key: "rating", label: "Rating", align: "right", format: "number" },
    { key: "gmv", label: "GMV", align: "right", format: "currency" },
    { key: "units", label: "Units", align: "right", format: "number" },
    { key: "asp", label: "ASP", align: "right", format: "currency" },
    { key: "returnPercent", label: "Return %", align: "right", render: pct },
    { key: "ppmp", label: "PPMP %", align: "right", render: pct },
    { key: "sjit", label: "SJIT %", align: "right", render: pct },
    { key: "sor", label: "SOR %", align: "right", render: pct },
    { key: "growth", label: "Growth %", align: "right", render: pct },
    { key: "demand", label: "Demand %", align: "right", format: "number" },
    { key: "sjitStock", label: "SJIT Stock", align: "right", format: "number" },
    { key: "sorStock", label: "SOR Stock", align: "right", format: "number" },
    { key: "impressions", label: "Impressions", align: "right", format: "number" },
    { key: "clicks", label: "Clicks", align: "right", format: "number" },
    { key: "atc", label: "ATC", align: "right", format: "number" },
    { key: "ctr", label: "CTR %", align: "right", render: pct },
    { key: "cvr", label: "CVR %", align: "right", render: pct }
  ];
}

function pct(v) {
  return formatPercent(v);
}