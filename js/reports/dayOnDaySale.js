// REPLACE FILE
// FILE: js/reports/dayOnDaySale.js

import { buildReportData } from "../engines/reportEngine.js";
import { createTable } from "../components/table.js";

/* -----------------------------------
   DAY ON DAY SALE
   FIXED:
   - Uses filtered rows
   - Current month only visible days
   - Compact widths
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

  const sales =
    data.filtered.sales;

  const maxDay =
    getVisibleDay();

  const rows =
    buildRows(
      sales,
      maxDay
    );

  el.className =
    "report-page";

  el.appendChild(
    createTable({
      title:
        "Day on Day Sale",
      meta:
        `${rows.length} styles`,
      columns:
        getCols(
          maxDay
        ),
      rows,
      compact:true,
      minWidth:
        420 +
        maxDay * 38
    })
  );
}

/* ----------------------------------- */

function buildRows(
  sales,
  maxDay
) {
  const map = {};

  sales.forEach((r) => {
    const id =
      r.styleId;

    if (!id) return;

    if (!map[id]) {
      map[id] = {
        styleId:id,
        mtd:0
      };

      for (
        let i=1;
        i<=maxDay;
        i++
      ) {
        map[id][
          "d"+i
        ] = 0;
      }
    }

    const qty =
      Number(
        r.qty
      ) || 0;

    const d =
      Number(
        r.date
      ) || 0;

    map[id].mtd +=
      qty;

    if (
      d>=1 &&
      d<=maxDay
    ) {
      map[id][
        "d"+d
      ] += qty;
    }
  });

  const div =
    Math.max(
      new Date()
      .getDate()-1,
      1
    );

  return Object.values(
    map
  )
  .map((r)=>({
    ...r,
    drr:
      r.mtd/div
  }))
  .sort(
    (a,b)=>
      b.mtd-a.mtd
  );
}

function getCols(
  maxDay
) {
  const cols = [
    {
      key:"styleId",
      label:"Style"
    },
    {
      key:"mtd",
      label:"MTD",
      format:"number"
    },
    {
      key:"drr",
      label:"DRR",
      format:"number"
    }
  ];

  for (
    let i=1;
    i<=maxDay;
    i++
  ) {
    cols.push({
      key:"d"+i,
      label:String(i),
      format:"number"
    });
  }

  return cols;
}

function getVisibleDay() {
  return Math.max(
    new Date()
      .getDate()-1,
    1
  );
}