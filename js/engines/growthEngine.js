// NEW FILE
// FILE: js/engines/growthEngine.js

/* -----------------------------------
   FINAL GROWTH ENGINE
   Multi-metric reusable engine
----------------------------------- */

/* -----------------------------------
   PUBLIC
----------------------------------- */

export function getGrowthPack(
  salesRows = [],
  filters = {}
) {
  const ctx =
    getContext(
      filters.month
    );

  const grouped =
    groupAll(
      salesRows,
      ctx
    );

  return {
    totalGmvGrowth:
      calcGrowth(
        grouped.curTotalGmv,
        grouped.prevTotalGmv,
        ctx
      ),

    totalUnitsGrowth:
      calcGrowth(
        grouped.curTotalUnits,
        grouped.prevTotalUnits,
        ctx
      ),

    brandGrowth:
      mapGrowth(
        grouped.curBrand,
        grouped.prevBrand,
        ctx
      ),

    styleGrowth:
      mapGrowth(
        grouped.curStyle,
        grouped.prevStyle,
        ctx
      )
  };
}

/* -----------------------------------
   CONTEXT
----------------------------------- */

function getContext(
  selectedMonth = ""
) {
  const [
    month,
    yearText
  ] =
    selectedMonth.split(
      " "
    );

  const year =
    Number(
      yearText
    ) || new Date()
      .getFullYear();

  const months = [
    "JAN","FEB","MAR","APR",
    "MAY","JUN","JUL","AUG",
    "SEP","OCT","NOV","DEC"
  ];

  let idx =
    months.indexOf(
      month
    );

  if (idx < 0)
    idx =
      new Date()
        .getMonth();

  let pIdx =
    idx - 1;

  let pYear =
    year;

  if (pIdx < 0) {
    pIdx = 11;
    pYear--;
  }

  const today =
    new Date();

  const elapsedDays =
    Math.max(
      today.getDate() - 1,
      1
    );

  const totalDays =
    new Date(
      year,
      idx + 1,
      0
    ).getDate();

  return {
    curMonth:
      months[idx],
    curYear: year,

    prevMonth:
      months[pIdx],
    prevYear: pYear,

    elapsedDays,
    totalDays
  };
}

/* -----------------------------------
   GROUP DATA
----------------------------------- */

function groupAll(
  rows,
  ctx
) {
  const out = {
    curTotalGmv:0,
    prevTotalGmv:0,

    curTotalUnits:0,
    prevTotalUnits:0,

    curBrand:{},
    prevBrand:{},

    curStyle:{},
    prevStyle:{}
  };

  rows.forEach((r)=>{
    const month =
      r.month;

    const year =
      Number(
        r.year
      );

    const gmv =
      Number(
        r.finalAmount
      ) || 0;

    const units =
      Number(
        r.qty
      ) || 0;

    const brand =
      r.brand ||
      "Unknown";

    const style =
      r.styleId ||
      "";

    const isCur =
      month ===
        ctx.curMonth &&
      year ===
        ctx.curYear;

    const isPrev =
      month ===
        ctx.prevMonth &&
      year ===
        ctx.prevYear;

    if (isCur) {
      out.curTotalGmv +=
        gmv;

      out.curTotalUnits +=
        units;

      out.curBrand[
        brand
      ] =
        (out.curBrand[
          brand
        ] || 0) +
        gmv;

      out.curStyle[
        style
      ] =
        (out.curStyle[
          style
        ] || 0) +
        gmv;
    }

    if (isPrev) {
      out.prevTotalGmv +=
        gmv;

      out.prevTotalUnits +=
        units;

      out.prevBrand[
        brand
      ] =
        (out.prevBrand[
          brand
        ] || 0) +
        gmv;

      out.prevStyle[
        style
      ] =
        (out.prevStyle[
          style
        ] || 0) +
        gmv;
    }
  });

  return out;
}

/* -----------------------------------
   CORE CALC
----------------------------------- */

function calcGrowth(
  curMtd,
  prevFull,
  ctx
) {
  const projected =
    (curMtd /
      ctx.elapsedDays) *
    ctx.totalDays;

  if (!prevFull) {
    return projected
      ? 100
      : 0;
  }

  return (
    ((projected -
      prevFull) /
      prevFull) *
    100
  );
}

function mapGrowth(
  curMap,
  prevMap,
  ctx
) {
  const ids =
    new Set([
      ...Object.keys(
        curMap
      ),
      ...Object.keys(
        prevMap
      )
    ]);

  const out = {};

  ids.forEach((k)=>{
    out[k] =
      calcGrowth(
        curMap[k] || 0,
        prevMap[k] || 0,
        ctx
      );
  });

  return out;
}