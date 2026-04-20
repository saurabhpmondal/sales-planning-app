// REPLACE FILE
// FILE: js/reports/dashboard.js

import { buildReportData } from "../engines/reportEngine.js";
import { createKpiGrid } from "../components/kpiCards.js";
import { createTable } from "../components/table.js";
import { createChartPlaceholder } from "../components/chart.js";

/* -----------------------------------
   DASHBOARD
   Fixed KPI + exact filtered totals
----------------------------------- */

export function renderDashboard({
  el,
  state
}) {
  const data =
    buildReportData(
      state.store,
      state.filters
    );

  const {
    summary,
    maps
  } = data;

  el.className =
    "report-page";

  /* KPI */
  el.appendChild(
    createKpiGrid([
      {
        label:
          "GMV",
        value:
          summary.netGmv,
        format:
          "currency",
        icon: "₹"
      },
      {
        label:
          "Units",
        value:
          summary.netUnits,
        icon: "📦"
      },
      {
        label:
          "Return %",
        value:
          summary.returnPercent,
        format:
          "percent",
        icon: "↩"
      },
      {
        label:
          "SJIT Stock",
        value:
          sumMap(
            maps
              .sjitStockByStyle
          ),
        icon: "🚚"
      },
      {
        label:
          "SOR Stock",
        value:
          sumMap(
            maps
              .sorStockByStyle
          ),
        icon: "🏬"
      },
      {
        label:
          "Growth %",
        value:
          avgMap(
            maps
              .growthByStyle
          ),
        format:
          "percent",
        icon: "📈"
      }
    ])
  );

  /* CHART */
  el.appendChild(
    createChartPlaceholder({
      title:
        "Date Wise Sales Trend",
      message:
        "Chart engine will be connected in next round."
    })
  );

  /* BRAND TABLE */
  el.appendChild(
    createTable({
      title:
        "Brand Performance",
      meta:
        "Filtered result",
      columns: [
        {
          key:
            "brand",
          label:
            "Brand"
        },
        {
          key:
            "gmv",
          label:
            "GMV",
          format:
            "currency",
          align:
            "right"
        },
        {
          key:
            "units",
          label:
            "Units",
          format:
            "number",
          align:
            "right"
        },
        {
          key:
            "asp",
          label:
            "ASP",
          format:
            "currency",
          align:
            "right"
        }
      ],
      rows:
        buildBrandRows(
          maps.salesByBrand
        )
    })
  );

  /* PO TABLE */
  el.appendChild(
    createTable({
      title:
        "PO Type Analysis",
      meta:
        "Filtered result",
      columns: [
        {
          key:
            "poType",
          label:
            "PO Type"
        },
        {
          key:
            "gmv",
          label:
            "GMV",
          format:
            "currency",
          align:
            "right"
        },
        {
          key:
            "units",
          label:
            "Units",
          format:
            "number",
          align:
            "right"
        },
        {
          key:
            "asp",
          label:
            "ASP",
          format:
            "currency",
          align:
            "right"
        }
      ],
      rows:
        buildPoRows(
          maps.salesByPoType
        )
    })
  );

  /* TRAFFIC */
  el.appendChild(
    createTable({
      title:
        "Traffic Analysis",
      meta:
        "Live data",
      columns: [
        {
          key:
            "brand",
          label:
            "Brand"
        },
        {
          key:
            "impressions",
          label:
            "Impressions",
          align:
            "right",
          format:
            "number"
        },
        {
          key:
            "clicks",
          label:
            "Clicks",
          align:
            "right",
          format:
            "number"
        },
        {
          key:
            "addToCarts",
          label:
            "ATC",
          align:
            "right",
          format:
            "number"
        },
        {
          key:
            "ctr",
          label:
            "CTR %",
          align:
            "right",
          format:
            "percent"
        }
      ],
      rows:
        buildTrafficRows(
          maps
            .trafficByBrand
        )
    })
  );
}

/* -----------------------------------
   HELPERS
----------------------------------- */

function buildBrandRows(
  map = {}
) {
  return Object.entries(
    map
  )
    .map(
      ([brand, v]) => ({
        brand,
        gmv:
          v.netGmv,
        units:
          v.netUnits,
        asp:
          v.asp
      })
    )
    .sort(
      (a, b) =>
        b.units -
        a.units
    );
}

function buildPoRows(
  map = {}
) {
  return Object.entries(
    map
  )
    .map(
      ([poType, v]) => ({
        poType,
        gmv:
          v.netGmv,
        units:
          v.netUnits,
        asp:
          v.asp
      })
    )
    .sort(
      (a, b) =>
        b.units -
        a.units
    );
}

function buildTrafficRows(
  map = {}
) {
  return Object.entries(
    map
  ).map(
    ([brand, v]) => ({
      brand,
      impressions:
        v.impressions,
      clicks:
        v.clicks,
      addToCarts:
        v.addToCarts,
      ctr:
        v.ctr
    })
  );
}

function sumMap(
  map = {}
) {
  return Object.values(
    map
  ).reduce(
    (a, b) =>
      a +
      (Number(b) ||
        0),
    0
  );
}

function avgMap(
  map = {}
) {
  const vals =
    Object.values(map);

  if (!vals.length)
    return 0;

  return (
    vals.reduce(
      (a, b) =>
        a +
        (Number(b) ||
          0),
      0
    ) /
    vals.length
  );
}