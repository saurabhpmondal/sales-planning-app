// REPLACE FILE
// FILE: js/reports/sales.js

import { buildReportData } from "../engines/reportEngine.js";
import { createTable } from "../components/table.js";

/* -----------------------------------
   SALES REPORT
   Final polish:
   - Growth %
   - CVR %
   - Better ranking
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
        cols(),
      rows,
      minWidth: 3300
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
      (id) => {
        const sales =
          data.maps
            .salesByStyle[
            id
          ] || {};

        const pm =
          store.lookups
            .productByStyle[
            id
          ] || {};

        const tf =
          data.maps
            .trafficByStyle[
            id
          ] || {};

        const clicks =
          tf.clicks ||
          0;

        const units =
          sales.netUnits ||
          0;

        return {
          rank: 0,
          styleId: id,
          erpSku:
            pm.erpSku ||
            "",
          brand:
            pm.brand ||
            "",
          rating:
            tf.rating ||
            0,

          gmv:
            sales.netGmv,
          units,
          asp:
            sales.asp,

          returnPercent:
            data.maps
              .returnPercentByStyle[
              id
            ] || 0,

          growth:
            data.maps
              .growthByStyle[
              id
            ] || 0,

          demand:
            data.maps
              .drrByStyle[
              id
            ] || 0,

          sjitStock:
            data.maps
              .sjitStockByStyle[
              id
            ] || 0,

          sorStock:
            data.maps
              .sorStockByStyle[
              id
            ] || 0,

          impressions:
            tf.impressions ||
            0,

          clicks,

          atc:
            tf.addToCarts ||
            0,

          ctr:
            tf.ctr || 0,

          cvr:
            clicks
              ? (units /
                  clicks) *
                100
              : 0
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
   COLS
----------------------------------- */

function cols() {
  return [
    { key: "rank", label: "#", format: "number" },
    { key: "styleId", label: "Style ID" },
    { key: "erpSku", label: "ERP SKU" },
    { key: "brand", label: "Brand" },
    { key: "rating", label: "Rating", format: "number" },

    { key: "gmv", label: "GMV", format: "currency" },
    { key: "units", label: "Units", format: "number" },
    { key: "asp", label: "ASP", format: "currency" },

    { key: "returnPercent", label: "Return %", format: "percent" },
    { key: "growth", label: "Growth %", format: "percent" },
    { key: "demand", label: "DRR", format: "number" },

    { key: "sjitStock", label: "SJIT", format: "number" },
    { key: "sorStock", label: "SOR", format: "number" },

    { key: "impressions", label: "Impr.", format: "number" },
    { key: "clicks", label: "Clicks", format: "number" },
    { key: "atc", label: "ATC", format: "number" },
    { key: "ctr", label: "CTR %", format: "percent" },
    { key: "cvr", label: "CVR %", format: "percent" }
  ];
}