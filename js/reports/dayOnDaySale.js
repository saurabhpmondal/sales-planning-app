// REPLACE FILE
// FILE: js/reports/dayOnDaySale.js

import { buildReportData } from "../engines/reportEngine.js";
import { createTable } from "../components/table.js";
import {
  getDaysInMonth
} from "../utils/dates.js";

/* -----------------------------------
   DAY ON DAY SALE
   Current month = till latest day
   Past month = full month
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

  const rows =
    data.filtered.sales;

  const info =
    getMonthInfo(
      rows,
      state.filters
    );

  const maxDays =
    getVisibleDays(
      rows,
      info.month,
      info.year
    );

  const tableRows =
    buildRows(
      rows,
      state.store,
      maxDays
    );

  el.className =
    "report-page";

  el.appendChild(
    createTable({
      title:
        "Day on Day Sale",
      meta: `${info.month} ${info.year}`,
      columns:
        getColumns(
          maxDays
        ),
      rows:
        tableRows,
      minWidth: 2400
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
        monthTotal: 0
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

function getColumns(
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
      key:
        "brand",
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
      align:
        "right",
      format:
        "number"
    },
    {
      key: "drr",
      label:
        "DRR",
      align:
        "right",
      format:
        "number"
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
      align:
        "right",
      format:
        "number"
    });
  }

  return cols;
}

/* -----------------------------------
   DAY LOGIC
----------------------------------- */

function getVisibleDays(
  rows,
  month,
  year
) {
  const latest =
    detectLatestMonth(
      rows
    );

  const selected =
    `${month} ${year}`;

  /* current month */
  if (
    selected ===
    latest
  ) {
    return Math.max(
      ...rows.map(
        (r) =>
          Number(
            r.date
          ) || 1
      ),
      1
    );
  }

  /* old month */
  return getDaysInMonth(
    month,
    year
  );
}

/* -----------------------------------
   MONTH INFO
----------------------------------- */

function getMonthInfo(
  rows,
  filters
) {
  const label =
    filters.month &&
    filters.month !==
      "AUTO"
      ? filters.month
      : detectLatestMonth(
          rows
        );

  const [
    month,
    year
  ] =
    label.split(
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

function detectLatestMonth(
  rows = []
) {
  let best = {
    score: 0,
    label:
      "APR 2026"
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
        label: `${r.month} ${r.year}`
      };
    }
  });

  return best.label;
}

function monthNo(
  m
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
  ].indexOf(m) + 1;
}