// FILE: js/reports/dashboard.js

import { buildReportData } from "../engines/reportEngine.js";
import { createKpiGrid } from "../components/kpiCards.js";
import { createTable } from "../components/table.js";
import { createChartPlaceholder } from "../components/chart.js";
import { formatPercent } from "../utils/format.js";

/* -----------------------------------
   DASHBOARD REPORT
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

  /* KPI GRID */
  el.appendChild(
    createKpiGrid([
      {
        label: "GMV",
        value:
          summary.netGmv,
        format:
          "currency",
        icon: "₹"
      },
      {
        label: "Units",
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
        "Date wise Units",
      message:
        "Day-wise units chart will render in next phase."
    })
  );

  /* TABLE GRID */
  el.appendChild(
    createTable({
      title:
        "Brand Performance",
      meta: "GMV • Units • ASP",
      columns: [
        {
          key: "brand",
          label: "Brand"
        },
        {
          key: "gmv",
          label: "GMV",
          format:
            "currency",
          align:
            "right"
        },
        {
          key: "units",
          label: "Units",
          format:
            "number",
          align:
            "right"
        },
        {
          key: "asp",
          label: "ASP",
          format:
            "currency",
          align:
            "right"
        }
      ],
      rows:
        brandRows(
          maps.salesByBrand
        )
    })
  );

  el.appendChild(
    createTable({
      title:
        "PO Type Analysis",
      meta: "GMV • Units • ASP",
      columns: [
        {
          key: "poType",
          label:
            "PO Type"
        },
        {
          key: "gmv",
          label: "GMV",
          format:
            "currency",
          align:
            "right"
        },
        {
          key: "units",
          label: "Units",
          format:
            "number",
          align:
            "right"
        },
        {
          key: "asp",
          label: "ASP",
          format:
            "currency",
          align:
            "right"
        }
      ],
      rows:
        poRows(
          maps.salesByPoType
        )
    })
  );

  el.appendChild(
    createTable({
      title:
        "Traffic Analysis",
      meta: "Brand level traffic",
      columns: [
        {
          key: "brand",
          label: "Brand"
        },
        {
          key:
            "impressions",
          label:
            "Impressions",
          format:
            "number",
          align:
            "right"
        },
        {
          key: "clicks",
          label:
            "Clicks",
          format:
            "number",
          align:
            "right"
        },
        {
          key:
            "addToCarts",
          label:
            "ATC",
          format:
            "number",
          align:
            "right"
        },
        {
          key: "ctr",
          label:
            "CTR %",
          align:
            "right"
        }
      ],
      rows:
        trafficRows(
          maps.trafficByBrand
        )
    })
  );
}

/* -----------------------------------
   HELPERS
----------------------------------- */

function brandRows(
  map = {}
) {
  return Object.entries(
    map
  ).map(
    ([brand, v]) => ({
      brand,
      gmv:
        v.netGmv,
      units:
        v.netUnits,
      asp: v.asp
    })
  );
}

function poRows(
  map = {}
) {
  return Object.entries(
    map
  ).map(
    ([poType, v]) => ({
      poType,
      gmv:
        v.netGmv,
      units:
        v.netUnits,
      asp: v.asp
    })
  );
}

function trafficRows(
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
        formatPercent(
          v.ctr
        )
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
