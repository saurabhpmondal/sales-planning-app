// REPLACE FILE
// FILE: js/reports/dashboard.js

import { buildReportData } from "../engines/reportEngine.js";
import { createKpiGrid } from "../components/kpiCards.js";
import { createTable } from "../components/table.js";

/* -----------------------------------
   PREMIUM DASHBOARD
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

  /* GRID */
  const grid =
    document.createElement(
      "div"
    );

  grid.className =
    "dash-grid";

  grid.appendChild(
    createTable({
      title:
        "Brand Performance",
      meta:
        "Top brands",
      columns: colsA(),
      rows:
        topBrandRows(
          maps.salesByBrand
        ),
      compact: true
    })
  );

  grid.appendChild(
    createTable({
      title:
        "PO Type Analysis",
      meta:
        "Sales mix",
      columns: colsA(),
      rows:
        poRows(
          maps.salesByPoType
        ),
      compact: true
    })
  );

  grid.appendChild(
    createTable({
      title:
        "Price Range Analysis",
      meta:
        "By ASP",
      columns: colsB(),
      rows:
        priceRows(
          maps.salesByStyle
        ),
      compact: true
    })
  );

  grid.appendChild(
    createTable({
      title:
        "ERP Status Analysis",
      meta:
        "Master status",
      columns: colsB(),
      rows:
        erpRows(
          state.store
        ),
      compact: true
    })
  );

  grid.appendChild(
    createTable({
      title:
        "Stock Cover Analysis",
      meta:
        "SJIT + SOR",
      columns: colsB(),
      rows:
        stockCoverRows(
          maps
        ),
      compact: true
    })
  );

  grid.appendChild(
    createTable({
      title:
        "Traffic Analysis",
      meta:
        "Brand level",
      columns: colsC(),
      rows:
        trafficRows(
          maps
            .trafficByBrand
        ),
      compact: true
    })
  );

  el.appendChild(
    grid
  );

  injectCss();
}

/* -----------------------------------
   COLUMNS
----------------------------------- */

function colsA() {
  return [
    {
      key:
        "name",
      label:
        "Name"
    },
    {
      key:
        "units",
      label:
        "Units",
      align:
        "center",
      format:
        "number"
    },
    {
      key:
        "gmv",
      label:
        "GMV",
      align:
        "center",
      format:
        "currency"
    }
  ];
}

function colsB() {
  return [
    {
      key:
        "name",
      label:
        "Bucket"
    },
    {
      key:
        "units",
      label:
        "Units",
      align:
        "center",
      format:
        "number"
    }
  ];
}

function colsC() {
  return [
    {
      key:
        "name",
      label:
        "Brand"
    },
    {
      key:
        "clicks",
      label:
        "Clicks",
      align:
        "center",
      format:
        "number"
    },
    {
      key:
        "ctr",
      label:
        "CTR %",
      align:
        "center",
      format:
        "percent"
    }
  ];
}

/* -----------------------------------
   ROWS
----------------------------------- */

function topBrandRows(
  map = {}
) {
  return Object.entries(
    map
  )
    .map(
      ([k, v]) => ({
        name: k,
        units:
          v.netUnits,
        gmv:
          v.netGmv
      })
    )
    .sort(
      (a, b) =>
        b.units -
        a.units
    )
    .slice(0, 8);
}

function poRows(
  map = {}
) {
  return Object.entries(
    map
  ).map(
    ([k, v]) => ({
      name: k,
      units:
        v.netUnits,
      gmv:
        v.netGmv
    })
  );
}

function priceRows(
  map = {}
) {
  const out = {
    "0-499": 0,
    "500-999": 0,
    "1000-1499": 0,
    "1500+": 0
  };

  Object.values(
    map
  ).forEach((v) => {
    const asp =
      Number(
        v.asp
      ) || 0;

    if (asp < 500)
      out["0-499"] +=
        v.netUnits;
    else if (
      asp < 1000
    )
      out[
        "500-999"
      ] +=
        v.netUnits;
    else if (
      asp < 1500
    )
      out[
        "1000-1499"
      ] +=
        v.netUnits;
    else
      out["1500+"] +=
        v.netUnits;
  });

  return Object.entries(
    out
  ).map(
    ([k, v]) => ({
      name: k,
      units: v
    })
  );
}

function erpRows(
  store
) {
  const map = {};

  (
    store
      .productMaster ||
    []
  ).forEach((r) => {
    const k =
      r.status ||
      "Blank";

    map[k] =
      (map[k] || 0) +
      1;
  });

  return Object.entries(
    map
  ).map(
    ([k, v]) => ({
      name: k,
      units: v
    })
  );
}

function stockCoverRows(
  maps
) {
  let low = 0;
  let med = 0;
  let high = 0;

  const ids =
    Object.keys(
      maps
        .salesByStyle
    );

  ids.forEach((id) => {
    const stock =
      (maps
        .sjitStockByStyle[
        id
      ] || 0) +
      (maps
        .sorStockByStyle[
        id
      ] || 0);

    const drr =
      maps
        .drrByStyle[
        id
      ] || 1;

    const sc =
      stock / drr;

    if (sc < 30)
      low++;
    else if (
      sc < 60
    )
      med++;
    else high++;
  });

  return [
    {
      name: "<30",
      units: low
    },
    {
      name: "30-60",
      units: med
    },
    {
      name: "60+",
      units: high
    }
  ];
}

function trafficRows(
  map = {}
) {
  return Object.entries(
    map
  )
    .map(
      ([k, v]) => ({
        name: k,
        clicks:
          v.clicks,
        ctr: v.ctr
      })
    )
    .sort(
      (a, b) =>
        b.clicks -
        a.clicks
    )
    .slice(0, 8);
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

/* -----------------------------------
   CSS
----------------------------------- */

let done = false;

function injectCss() {
  if (done) return;
  done = true;

  const s =
    document.createElement(
      "style"
    );

  s.textContent = `
    .dash-grid{
      display:grid;
      grid-template-columns:
        repeat(2,minmax(0,1fr));
      gap:14px;
    }

    @media(max-width:900px){
      .dash-grid{
        grid-template-columns:1fr;
      }
    }
  `;

  document.head.appendChild(
    s
  );
}