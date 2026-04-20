// FILE: js/engines/returnsEngine.js

import {
  VALID_RETURN_TYPE,
  RETURN_WINDOW_DAYS
} from "../core/constants.js";

import { percent } from "../utils/math.js";
import { getDateScore } from "../utils/dates.js";

/* -----------------------------------
   RETURNS ENGINE
----------------------------------- */

/**
 * Summary
 */
export function getReturnSummary(
  returnRows = [],
  salesUnits = 0
) {
  const valid =
    returnRows.filter(
      isValidReturn
    );

  const units =
    valid.length;

  return {
    returnUnits: units,
    returnPercent:
      percent(
        units,
        salesUnits
      )
  };
}

/* -----------------------------------
   STYLE LEVEL RETURNS
----------------------------------- */

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
   RETURN WINDOW
   Sale period + 60 days
----------------------------------- */

export function getReturnRowsForSalesWindow(
  salesRows = [],
  returnRows = []
) {
  if (!salesRows.length) {
    return [];
  }

  let minScore =
    Infinity;
  let maxScore = 0;

  salesRows.forEach((row) => {
    const score =
      getDateScore({
        date: row.date,
        month:
          row.month,
        year:
          row.year
      });

    if (score < minScore)
      minScore = score;

    if (score > maxScore)
      maxScore = score;
  });

  const allowedMax =
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
          date: row.date,
          month:
            row.month,
          year:
            row.year
        });

      return (
        score >=
          minScore &&
        score <=
          allowedMax
      );
    }
  );
}

/* -----------------------------------
   STYLE RETURN %
----------------------------------- */

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
