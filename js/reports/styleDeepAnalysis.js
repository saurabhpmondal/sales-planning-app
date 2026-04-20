// NEW FILE
// FILE: js/reports/styleDeepAnalysis.js

import { buildReportData } from "../engines/reportEngine.js";
import { createTable } from "../components/table.js";
import { createEmptyState } from "../components/emptyState.js";
import { createKpiGrid } from "../components/kpiCards.js";

/* -----------------------------------
   STYLE DEEP ANALYSIS
   Search driven report
----------------------------------- */

export function renderStyleDeepAnalysis({
  el,
  state
}) {
  const query =
    String(
      state.filters.search ||
        ""
    ).trim();

  el.className =
    "report-page";

  if (!query) {
    el.appendChild(
      createEmptyState({
        title:
          "Search a Style",
        message:
          "Use search box with Style ID or ERP SKU to open deep analysis."
      })
    );

    return;
  }

  const data =
    buildReportData(
      state.store,
      state.filters
    );

  const styleId =
    findStyleId(
      query,
      state.store
    );

  if (!styleId) {
    el.appendChild(
      createEmptyState({
        title:
          "Style Not Found",
        message:
          "No matching style ID / ERP SKU found."
      })
    );

    return;
  }

  const pm =
    state.store.lookups
      .productByStyle[
      styleId
    ] || {};

  const sales =
    data.maps
      .salesByStyle[
      styleId
    ] || {};

  const traffic =
    data.maps
      .trafficByStyle[
      styleId
    ] || {};

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

  const growth =
    data.maps
      .growthByStyle[
      styleId
    ] || 0;

  const sjit =
    data.maps
      .sjitStockByStyle[
      styleId
    ] || 0;

  const sor =
    data.maps
      .sorStockByStyle[
      styleId
    ] || 0;

  /* KPI */
  el.appendChild(
    createKpiGrid([
      {
        label:
          "Units",
        value:
          sales.netUnits ||
          0,
        icon: "📦"
      },
      {
        label:
          "GMV",
        value:
          sales.netGmv ||
          0,
        format:
          "currency",
        icon: "₹"
      },
      {
        label:
          "Returns",
        value:
          returns,
        icon: "↩"
      },
      {
        label:
          "DRR",
        value:
          drr,
        format:
          "number",
        icon: "📈"
      },
      {
        label:
          "SJIT Stock",
        value: sjit,
        icon: "🚚"
      },
      {
        label:
          "SOR Stock",
        value: sor,
        icon: "🏬"
      }
    ])
  );

  /* MASTER */
  el.appendChild(
    createTable({
      title:
        "Master Information",
      meta:
        styleId,
      columns: [
        {
          key: "field",
          label:
            "Field"
        },
        {
          key: "value",
          label:
            "Value"
        }
      ],
      rows: [
        {
          field:
            "Style ID",
          value:
            styleId
        },
        {
          field:
            "ERP SKU",
          value:
            pm.erpSku ||
            ""
        },
        {
          field:
            "Brand",
          value:
            pm.brand ||
            ""
        },
        {
          field:
            "Article Type",
          value:
            pm.articleType ||
            ""
        },
        {
          field:
            "ERP Status",
          value:
            pm.status ||
            ""
        },
        {
          field:
            "MRP",
          value:
            pm.mrp || 0
        },
        {
          field:
            "TP",
          value:
            pm.tp || 0
        },
        {
          field:
            "Growth %",
          value:
            growth.toFixed(
              2
            ) + "%"
        }
      ]
    })
  );

  /* TRAFFIC */
  el.appendChild(
    createTable({
      title:
        "Traffic Metrics",
      meta:
        "Current snapshot",
      columns: [
        {
          key:
            "metric",
          label:
            "Metric"
        },
        {
          key:
            "value",
          label:
            "Value"
        }
      ],
      rows: [
        {
          metric:
            "Impressions",
          value:
            traffic.impressions ||
            0
        },
        {
          metric:
            "Clicks",
          value:
            traffic.clicks ||
            0
        },
        {
          metric:
            "Add To Cart",
          value:
            traffic.addToCarts ||
            0
        },
        {
          metric:
            "CTR %",
          value:
            (
              traffic.ctr ||
              0
            ).toFixed(
              2
            ) + "%"
        },
        {
          metric:
            "Rating",
          value:
            traffic.rating ||
            0
        }
      ]
    })
  );
}

/* -----------------------------------
   HELPERS
----------------------------------- */

function findStyleId(
  query,
  store
) {
  const q =
    query.toLowerCase();

  if (
    store.lookups
      .productByStyle[
      query
    ]
  ) {
    return query;
  }

  const sku =
    Object.values(
      store.lookups
        .productByStyle
    ).find(
      (row) =>
        String(
          row.erpSku
        )
          .toLowerCase()
          .includes(q)
    );

  return sku
    ? sku.styleId
    : null;
}