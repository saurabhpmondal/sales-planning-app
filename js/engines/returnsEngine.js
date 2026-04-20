// REPLACE FILE
// FILE: js/engines/returnsEngine.js

import {
  VALID_RETURN_TYPE,
  RETURN_WINDOW_DAYS
} from "../core/constants.js";

import {
  percent
} from "../utils/math.js";

import {
  getDateScore,
  parseMonthYear
} from "../utils/dates.js";

/* -----------------------------------
   RETURNS ENGINE
   Fixed Logic:
   Current selected month = MTD only
   Past month = sale month + 60 days
----------------------------------- */

/**
 * Summary
 */
export function getReturnSummary(
  rows = [],
  salesUnits = 0
) {
  const valid =
    rows.filter(
      isValidReturn
    );

  const returnUnits =
    valid.length;

  return {
    returnUnits,
    returnPercent:
      percent(
        returnUnits,
        salesUnits
      )
  };
}

/**
 * By style
 */
export function getReturnsByStyle(
  rows = []
) {
  const map = {};

  rows.forEach((row) => {
    if (
      !isValidReturn(
        row
      )
    ) {
      return;
    }

    const id =
      row.styleId;

    if (!id) return;

    map[id] =
      (map[id] || 0) + 1;
  });

  return map;
}

/* -----------------------------------
   MAIN WINDOW LOGIC
----------------------------------- */

export function getReturnRowsForSalesWindow(
  salesRows = [],
  returnRows = [],
  filters = {}
) {
  if (!salesRows.length) {
    return [];
  }

  const selected =
    filters.month ||
    "";

  const latestSaleDay =
    Math.max(
      ...salesRows.map(
        (r) =>
          Number(
            r.date
          ) || 1
      ),
      1
    );

  /* current month compare */
  const latestMonth =
    detectLatestMonth(
      salesRows
    );

  const isCurrentMonth =
    selected ===
    latestMonth;

  /* --------------------------------
     CURRENT MONTH = MTD ONLY
  -------------------------------- */
  if (
    isCurrentMonth
  ) {
    const {
      month,
      year
    } =
      parseMonthYear(
        selected
      );

    return returnRows.filter(
      (row) =>
        isValidReturn(
          row
        ) &&
        row.month ===
          month &&
        Number(
          row.year
        ) ===
          Number(
            year
          ) &&
        Number(
          row.date
        ) <=
          latestSaleDay
    );
  }

  /* --------------------------------
     PAST MONTH = +60 days
  -------------------------------- */
  let minScore =
    Infinity;

  let maxScore = 0;

  salesRows.forEach((r) => {
    const score =
      getDateScore({
        date: r.date,
        month:
          r.month,
        year:
          r.year
      });

    if (score < minScore)
      minScore = score;

    if (score > maxScore)
      maxScore = score;
  });

  const maxAllowed =
    maxScore +
    RETURN_WINDOW_DAYS;

  return returnRows.filter(
    (row) => {
      if (
        !isValidReturn(
          row
        )
      ) {
        return false;
      }

      const score =
        getDateScore({
          date:
            row.date,
          month:
            row.month,
          year:
            row.year
        });

      return (
        score >=
          minScore &&
        score <=
          maxAllowed
      );
    }
  );
}

/**
 * Return % by style
 */
export function getReturnPercentByStyle(
  returnMap = {},
  salesMap = {}
) {
  const out = {};

  const keys =
    new Set([
      ...Object.keys(
        returnMap
      ),
      ...Object.keys(
        salesMap
      )
    ]);

  keys.forEach((id) => {
    out[id] =
      percent(
        returnMap[id] ||
          0,
        salesMap[id]
          ?.netUnits || 0
      );
  });

  return out;
}

/* -----------------------------------
   HELPERS
----------------------------------- */

function isValidReturn(
  row = {}
) {
  return (
    String(
      row.type || ""
    ).trim() ===
    VALID_RETURN_TYPE
  );
}

function detectLatestMonth(
  rows = []
) {
  let best = {
    score: 0,
    label: ""
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