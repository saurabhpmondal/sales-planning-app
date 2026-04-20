// NEW FILE
// FILE: js/reports/dayOnDaySale.js

import { buildReportData } from "../engines/reportEngine.js";
import { createTable } from "../components/table.js";
import { getDaysInMonth } from "../utils/dates.js";

/* -----------------------------------
   DAY ON DAY SALE REPORT
----------------------------------- */

export function renderDayOnDaySale({
  el,
  state
}) {
  const data =
    buildReportData(
      state.store,
      state.filters
    );

  const salesRows =
    data.filtered.sales;

  const monthInfo =
    getActiveMonthInfo(
      salesRows,
      state.filters
    );

  const maxDays =
    getDaysInMonth(
      monthInfo.month,
      monthInfo.year
    );

  const rows =
    buildRows(
      salesRows,
      state.store,
      maxDays
    );

  el.className =
    "report-page day-table";

  el.appendChild(
    createTable({
      title:
        "Day on Day Sale",
      meta: `${monthInfo.month} ${monthInfo.year}`,
      columns:
        buildColumns(
          maxDays
        ),
      rows,
      minWidth: 1800
    })
  );
}

/* -----------------------------------
   BUILD ROWS
----------------------------------- */

function buildRows(
  rows,
  store,
  maxDays
) {
  const map = {};

  rows.forEach((row) => {
    const id =
      row.styleId;

    if (!id) return;

    if (!map[id]) {
      const pm =
        store.lookups
          .productByStyle[
          id
        ] || {};

      map[id] = {
        styleId: id,
        brand:
          row.brand,
        erpSku:
          pm.erpSku ||
          "",
        erpStatus:
          pm.status ||
          "",
        monthTotal: 0,
        drr: 0
      };

      for (
        let i = 1;
        i <= maxDays;
        i++
      ) {
        map[id][
          `d${i}`
        ] = 0;
      }
    }

    const qty =
      Number(
        row.qty
      ) || 0;

    const day =
      Number(
        row.date
      ) || 0;

    map[id].monthTotal +=
      qty;

    if (
      day >= 1 &&
      day <= maxDays
    ) {
      map[id][
        `d${day}`
      ] += qty;
    }
  });

  Object.values(
    map
  ).forEach((r) => {
    r.drr =
      r.monthTotal /
      maxDays;
  });

  return Object.values(
    map
  ).sort(
    (a, b) =>
      b.monthTotal -
      a.monthTotal
  );
}

/* -----------------------------------
   COLUMNS
----------------------------------- */

function buildColumns(
  maxDays
) {
  const cols = [
    {
      key:
        "styleId",
      label:
        "Style ID"
    },
    {
      key: "brand",
      label:
        "Brand"
    },
    {
      key:
        "erpSku",
      label:
        "ERP SKU"
    },
    {
      key:
        "erpStatus",
      label:
        "ERP Status"
    },
    {
      key:
        "monthTotal",
      label:
        "Month Total",
      format:
        "number",
      align:
        "right"
    },
    {
      key: "drr",
      label:
        "DRR",
      format:
        "number",
      align:
        "right"
    }
  ];

  for (
    let i = 1;
    i <= maxDays;
    i++
  ) {
    cols.push({
      key: `d${i}`,
      label:
        String(i),
      format:
        "number",
      align:
        "right"
    });
  }

  return cols;
}

/* -----------------------------------
   MONTH INFO
----------------------------------- */

function getActiveMonthInfo(
  rows,
  filters
) {
  if (
    filters.month &&
    filters.month !==
      "ALL"
  ) {
    const [
      month,
      year
    ] =
      filters.month.split(
        " "
      );

    return {
      month,
      year:
        Number(
          year
        )
    };
  }

  let best = {
    score: 0,
    month: "APR",
    year: 2026
  };

  rows.forEach((r) => {
    const score =
      Number(
        r.year
      ) *
        100 +
      monthNo(
        r.month
      );

    if (
      score >
      best.score
    ) {
      best = {
        score,
        month:
          r.month,
        year:
          r.year
      };
    }
  });

  return best;
}

function monthNo(
  month
) {
  return [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC"
  ].indexOf(month) + 1;
}