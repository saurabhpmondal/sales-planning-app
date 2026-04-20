// FULL REPLACEMENT FILE
// FILE: js/engines/growthEngine.js

/* -----------------------------------
   FINAL GROWTH ENGINE
   + BACKWARD COMPATIBLE EXPORTS
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
   COMPATIBILITY EXPORTS
----------------------------------- */

export function getGrowthByStyle(
  salesRows = [],
  filters = {}
) {
  return getGrowthPack(
    salesRows,
    filters
  ).styleGrowth;
}

export function getGrowthByBrand(
  salesRows = [],
  filters = {}
) {
  return getGrowthPack(
    salesRows,
    filters
  ).brandGrowth;
}

export function getTotalGrowth(
  salesRows = [],
  filters = {}
) {
  const pack =
    getGrowthPack(
      salesRows,
      filters
    );

  return {
    gmv:
      pack.totalGmvGrowth,

    units:
      pack.totalUnitsGrowth
  };
}

/* ----------------------------------- */

function getContext(
  monthStr = ""
) {
  const months = [
    "JAN","FEB","MAR","APR",
    "MAY","JUN","JUL","AUG",
    "SEP","OCT","NOV","DEC"
  ];

  const parts =
    monthStr
      .trim()
      .split(" ");

  let monthCode =
    parts[0] || "";

  let year =
    Number(parts[1]) ||
    new Date().getFullYear();

  let idx =
    months.indexOf(
      monthCode
    );

  if (idx < 0) {
    idx =
      new Date()
        .getMonth();
  }

  let prevIdx =
    idx - 1;

  let prevYear =
    year;

  if (prevIdx < 0) {
    prevIdx = 11;
    prevYear--;
  }

  const today =
    new Date();

  return {
    curMonth:
      months[idx],

    curYear:
      year,

    prevMonth:
      months[prevIdx],

    prevYear,

    elapsedDays:
      Math.max(
        today.getDate() - 1,
        1
      ),

    totalDays:
      new Date(
        year,
        idx + 1,
        0
      ).getDate()
  };
}

/* ----------------------------------- */

function groupAll(
  rows,
  ctx
) {
  const out = {
    curTotalGmv: 0,
    prevTotalGmv: 0,

    curTotalUnits: 0,
    prevTotalUnits: 0,

    curBrand: {},
    prevBrand: {},

    curStyle: {},
    prevStyle: {}
  };

  rows.forEach(
    (r) => {
      const g =
        Number(
          r.finalAmount
        ) || 0;

      const u =
        Number(
          r.qty
        ) || 0;

      const isCur =
        r.month ===
          ctx.curMonth &&
        Number(
          r.year
        ) ===
          ctx.curYear;

      const isPrev =
        r.month ===
          ctx.prevMonth &&
        Number(
          r.year
        ) ===
          ctx.prevYear;

      if (isCur) {
        out.curTotalGmv += g;
        out.curTotalUnits += u;

        const brand =
          r.brand ||
          "UNKNOWN";

        const style =
          r.styleId ||
          "UNKNOWN";

        out.curBrand[
          brand
        ] =
          (
            out.curBrand[
              brand
            ] || 0
          ) + g;

        out.curStyle[
          style
        ] =
          (
            out.curStyle[
              style
            ] || 0
          ) + g;
      }

      if (isPrev) {
        out.prevTotalGmv += g;
        out.prevTotalUnits += u;

        const brand =
          r.brand ||
          "UNKNOWN";

        const style =
          r.styleId ||
          "UNKNOWN";

        out.prevBrand[
          brand
        ] =
          (
            out.prevBrand[
              brand
            ] || 0
          ) + g;

        out.prevStyle[
          style
        ] =
          (
            out.prevStyle[
              style
            ] || 0
          ) + g;
      }
    }
  );

  return out;
}

/* ----------------------------------- */

function calcGrowth(
  cur,
  prev,
  ctx
) {
  const projected =
    (
      cur /
      ctx.elapsedDays
    ) *
    ctx.totalDays;

  if (!prev) {
    return projected
      ? 100
      : 0;
  }

  return (
    (
      projected -
      prev
    ) /
    prev
  ) * 100;
}

function mapGrowth(
  curMap,
  prevMap,
  ctx
) {
  const keys =
    new Set([
      ...Object.keys(
        curMap
      ),
      ...Object.keys(
        prevMap
      )
    ]);

  const out = {};

  keys.forEach(
    (k) => {
      out[k] =
        calcGrowth(
          curMap[k] || 0,
          prevMap[k] || 0,
          ctx
        );
    }
  );

  return out;
}