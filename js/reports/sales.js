// FULL REPLACEMENT FILE
// FILE: js/reports/sales.js

import { buildReportData } from "../engines/reportEngine.js";
import { getGrowthPack } from "../engines/growthEngine.js";
import { createTable } from "../components/table.js";

/* -----------------------------------
   SALES REPORT
   FIXED:
   - Past month projected GMV = actual GMV
   - Current month projected live
----------------------------------- */

export function renderSales({
  el,
  state
}) {
  const data = buildReportData(
    state.store,
    state.filters
  );

  const growth = getGrowthPack(
    data.filtered.sales || [],
    state.filters
  );

  const rows = buildRows(
    data,
    state.store,
    growth.styleGrowth,
    state.filters.month
  );

  el.className = "report-page";

  el.appendChild(
    createTable({
      title: "Sales Report",
      meta: `${rows.length} styles`,
      mode: "grid",
      minWidth: 2300,
      columns: cols(),
      rows
    })
  );
}

/* ----------------------------------- */

function buildRows(
  data,
  store,
  styleGrowth = {},
  monthStr = ""
) {
  const ids = Object.keys(
    data.maps.salesByStyle || {}
  );

  const currentMonth =
    isCurrentMonth(monthStr);

  const elapsed =
    Math.max(
      new Date().getDate() - 1,
      1
    );

  const totalDays =
    currentMonth
      ? getMonthDays(monthStr)
      : 0;

  const rows = ids.map(id => {
    const s =
      data.maps.salesByStyle[id] || {};

    const t =
      data.maps.trafficByStyle[id] || {};

    const pm =
      store.lookups
        ?.productByStyle?.[id] || {};

    const gmv =
      s.netGmv || 0;

    const units =
      s.netUnits || 0;

    const projected =
      currentMonth
        ? (gmv / elapsed) * totalDays
        : gmv;

    const clicks =
      t.clicks || 0;

    return {
      rank: 0,
      styleId: id,
      erpSku: pm.erpSku || "",
      brand: pm.brand || "",
      rating: t.rating || 0,

      gmv,
      projGmv: projected,
      units,
      asp: s.asp || 0,

      ret:
        data.maps
          .returnPercentByStyle?.[id] || 0,

      growth:
        styleGrowth[id] || 0,

      drr:
        data.maps
          .drrByStyle?.[id] || 0,

      sjit:
        data.maps
          .sjitStockByStyle?.[id] || 0,

      sor:
        data.maps
          .sorStockByStyle?.[id] || 0
    };
  });

  rows.sort(
    (a, b) => b.units - a.units
  );

  rows.forEach(
    (r, i) => r.rank = i + 1
  );

  return rows;
}

/* ----------------------------------- */

function cols() {
  return [
    { key:"rank", label:"#", format:"number" },
    { key:"styleId", label:"Style" },
    { key:"erpSku", label:"SKU" },
    { key:"brand", label:"Brand" },
    { key:"rating", label:"Rate", format:"number" },

    { key:"gmv", label:"GMV", format:"currency" },
    { key:"projGmv", label:"Proj GMV", format:"currency" },

    { key:"units", label:"Units", format:"number" },
    { key:"asp", label:"ASP", format:"currency" },

    { key:"ret", label:"Ret%", format:"percent" },
    { key:"growth", label:"Gr%", format:"percent" },

    { key:"drr", label:"DRR", format:"number" },
    { key:"sjit", label:"SJIT", format:"number" },
    { key:"sor", label:"SOR", format:"number" }
  ];
}

/* ----------------------------------- */

function isCurrentMonth(monthStr = "") {
  const d = new Date();

  const names = [
    "JAN","FEB","MAR","APR","MAY","JUN",
    "JUL","AUG","SEP","OCT","NOV","DEC"
  ];

  const cur =
    names[d.getMonth()] +
    " " +
    d.getFullYear();

  return monthStr === cur;
}

function getMonthDays(monthStr = "") {
  const parts = monthStr.split(" ");

  const mon = parts[0];
  const year = +parts[1];

  const months = {
    JAN:0,FEB:1,MAR:2,APR:3,MAY:4,JUN:5,
    JUL:6,AUG:7,SEP:8,OCT:9,NOV:10,DEC:11
  };

  const idx = months[mon];

  if (idx === undefined) return 30;

  return new Date(
    year,
    idx + 1,
    0
  ).getDate();
}