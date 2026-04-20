// FULL REPLACEMENT FILE
// FILE: js/reports/dayOnDaySale.js

import { buildReportData } from "../engines/reportEngine.js";
import { createTable } from "../components/table.js";

/* -----------------------------------
   DAY ON DAY SALE
   FIXED:
   - Current month = till yesterday
   - Past month = full month
----------------------------------- */

export function renderDayOnDaySale({ el, state }) {
  const data = buildReportData(
    state.store,
    state.filters
  );

  const sales = data.filtered.sales || [];

  const maxDay = getVisibleDay(
    state.filters.month
  );

  const rows = buildRows(
    sales,
    maxDay,
    state.filters.month
  );

  el.className = "report-page";

  el.appendChild(
    createTable({
      title: "Day on Day Sale",
      meta: `${rows.length} styles`,
      compact: true,
      minWidth: 520 + (maxDay * 34),
      columns: getCols(maxDay),
      rows
    })
  );
}

/* ----------------------------------- */

function buildRows(
  sales,
  maxDay,
  month
) {
  const map = {};

  sales.forEach(r => {
    const id = r.styleId;
    if (!id) return;

    if (!map[id]) {
      map[id] = {
        styleId: id,
        mtd: 0
      };

      for (let i = 1; i <= maxDay; i++) {
        map[id]["d" + i] = 0;
      }
    }

    const qty =
      Number(r.qty) || 0;

    const d =
      Number(r.date) || 0;

    map[id].mtd += qty;

    if (d >= 1 && d <= maxDay) {
      map[id]["d" + d] += qty;
    }
  });

  const div =
    isCurrentMonth(month)
      ? Math.max(new Date().getDate() - 1, 1)
      : maxDay;

  return Object.values(map)
    .map(r => ({
      ...r,
      drr: r.mtd / div
    }))
    .sort((a, b) => b.mtd - a.mtd);
}

/* ----------------------------------- */

function getCols(maxDay) {
  const cols = [
    { key: "styleId", label: "Style" },
    { key: "mtd", label: "MTD", format: "number" },
    { key: "drr", label: "DRR", format: "number" }
  ];

  for (let i = 1; i <= maxDay; i++) {
    cols.push({
      key: "d" + i,
      label: String(i),
      format: "number"
    });
  }

  return cols;
}

/* ----------------------------------- */

function getVisibleDay(monthStr = "") {
  if (isCurrentMonth(monthStr)) {
    return Math.max(
      new Date().getDate() - 1,
      1
    );
  }

  const parts =
    monthStr.split(" ");

  const mon = parts[0];
  const year = +parts[1];

  const months = {
    JAN:0,FEB:1,MAR:2,APR:3,MAY:4,JUN:5,
    JUL:6,AUG:7,SEP:8,OCT:9,NOV:10,DEC:11
  };

  const idx = months[mon];

  if (idx === undefined) return 31;

  return new Date(
    year,
    idx + 1,
    0
  ).getDate();
}

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