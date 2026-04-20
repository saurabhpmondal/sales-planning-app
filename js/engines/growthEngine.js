// FILE: js/engines/growthEngine.js

import { getPreviousMonth } from "../utils/dates.js";
import { growth } from "../utils/math.js";

/* -----------------------------------
   GROWTH ENGINE
   Current month projection vs previous month
----------------------------------- */

/**
 * Style level growth %
 */
export function getGrowthByStyle(
  salesRows = [],
  filters = {}
) {
  const current =
    getSelectedMonth(
      salesRows,
      filters
    );

  if (!current.month) {
    return {};
  }

  const previous =
    getPreviousMonth(
      current.month,
      current.year
    );

  const currentRows =
    salesRows.filter(
      (r) =>
        r.month ===
          current.month &&
        Number(
          r.year
        ) ===
          Number(
            current.year
          )
    );

  const previousRows =
    salesRows.filter(
      (r) =>
        r.month ===
          previous.month &&
        Number(
          r.year
        ) ===
          Number(
            previous.year
          )
    );

  const currentMap =
    aggregateUnitsByStyle(
      currentRows
    );

  const previousMap =
    aggregateUnitsByStyle(
      previousRows
    );

  const projected =
    projectCurrentMonth(
      currentRows,
      currentMap
    );

  const keys =
    new Set([
      ...Object.keys(
        projected
      ),
      ...Object.keys(
        previousMap
      )
    ]);

  const out = {};

  keys.forEach((id) => {
    out[id] =
      growth(
        projected[id] ||
          0,
        previousMap[id] ||
          0
      );
  });

  return out;
}

/**
 * Brand growth %
 */
export function getGrowthByBrand(
  salesRows = [],
  filters = {}
) {
  const styleMap =
    getGrowthByStyle(
      salesRows,
      filters
    );

  const brandMap = {};

  salesRows.forEach((row) => {
    const brand =
      row.brand ||
      "Unknown";

    const val =
      styleMap[
        row.styleId
      ];

    if (
      val ===
      undefined
    )
      return;

    if (
      !brandMap[
        brand
      ]
    ) {
      brandMap[
        brand
      ] = [];
    }

    brandMap[
      brand
    ].push(val);
  });

  const out = {};

  Object.keys(
    brandMap
  ).forEach((brand) => {
    const arr =
      brandMap[
        brand
      ];

    out[brand] =
      arr.reduce(
        (a, b) =>
          a + b,
        0
      ) / arr.length;
  });

  return out;
}

/* -----------------------------------
   HELPERS
----------------------------------- */

function getSelectedMonth(
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
    score: 0
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

function aggregateUnitsByStyle(
  rows
) {
  const map = {};

  rows.forEach((r) => {
    map[
      r.styleId
    ] =
      (map[
        r.styleId
      ] || 0) +
      (Number(
        r.qty
      ) || 0);
  });

  return map;
}

function projectCurrentMonth(
  rows,
  currentMap
) {
  const maxDay =
    Math.max(
      ...rows.map(
        (r) =>
          Number(
            r.date
          ) || 1
      ),
      1
    );

  const daysInMonth =
    30;

  const factor =
    daysInMonth /
    maxDay;

  const out = {};

  Object.keys(
    currentMap
  ).forEach((id) => {
    out[id] =
      currentMap[id] *
      factor;
  });

  return out;
}
