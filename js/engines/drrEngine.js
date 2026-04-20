// FILE: js/engines/drrEngine.js

import { DRR_WINDOW_DAYS } from "../core/constants.js";
import {
  getDateScore,
  withinLastNDays
} from "../utils/dates.js";

/* -----------------------------------
   DRR ENGINE
   Always use last 30 days
----------------------------------- */

/**
 * Style DRR map
 */
export function getDrrByStyle(
  salesRows = []
) {
  if (!salesRows.length) {
    return {};
  }

  const latestScore =
    getLatestScore(
      salesRows
    );

  const map = {};

  salesRows.forEach((row) => {
    const score =
      getDateScore({
        date: row.date,
        month:
          row.month,
        year:
          row.year
      });

    if (
      !withinLastNDays(
        latestScore,
        score,
        DRR_WINDOW_DAYS
      )
    ) {
      return;
    }

    const id =
      row.styleId;

    if (!id) return;

    map[id] =
      (map[id] || 0) +
      (Number(
        row.qty
      ) || 0);
  });

  Object.keys(
    map
  ).forEach((id) => {
    map[id] =
      map[id] /
      DRR_WINDOW_DAYS;
  });

  return map;
}

/**
 * Brand DRR map
 */
export function getDrrByBrand(
  salesRows = []
) {
  if (!salesRows.length) {
    return {};
  }

  const latestScore =
    getLatestScore(
      salesRows
    );

  const map = {};

  salesRows.forEach((row) => {
    const score =
      getDateScore({
        date: row.date,
        month:
          row.month,
        year:
          row.year
      });

    if (
      !withinLastNDays(
        latestScore,
        score,
        DRR_WINDOW_DAYS
      )
    ) {
      return;
    }

    const key =
      row.brand ||
      "Unknown";

    map[key] =
      (map[key] || 0) +
      (Number(
        row.qty
      ) || 0);
  });

  Object.keys(
    map
  ).forEach((key) => {
    map[key] =
      map[key] /
      DRR_WINDOW_DAYS;
  });

  return map;
}

/* -----------------------------------
   HELPERS
----------------------------------- */

function getLatestScore(
  rows = []
) {
  let latest = 0;

  rows.forEach((row) => {
    const score =
      getDateScore({
        date: row.date,
        month:
          row.month,
        year:
          row.year
      });

    if (score > latest) {
      latest = score;
    }
  });

  return latest;
}
