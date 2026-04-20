// FILE: js/utils/dates.js

import { MONTH_ORDER } from "../core/constants.js";

/* -----------------------------------
   MONTH HELPERS
----------------------------------- */

export function getMonthIndex(
  month = ""
) {
  return MONTH_ORDER.indexOf(
    String(month).toUpperCase()
  );
}

export function getMonthName(
  index = 0
) {
  return (
    MONTH_ORDER[index] || ""
  );
}

/* -----------------------------------
   DAYS IN MONTH
----------------------------------- */

export function getDaysInMonth(
  month,
  year
) {
  const idx =
    getMonthIndex(month);

  if (idx < 0) return 30;

  const jsMonth = idx + 1;

  return new Date(
    Number(year),
    jsMonth,
    0
  ).getDate();
}

/* -----------------------------------
   MONTH YEAR LABEL
----------------------------------- */

export function toMonthYear(
  month,
  year
) {
  return `${month} ${year}`;
}

/* -----------------------------------
   PARSE LABEL
----------------------------------- */

export function parseMonthYear(
  label = ""
) {
  const parts =
    String(label).split(" ");

  return {
    month:
      parts[0] || "",
    year:
      Number(parts[1]) || 0
  };
}

/* -----------------------------------
   PREVIOUS MONTH
----------------------------------- */

export function getPreviousMonth(
  month,
  year
) {
  const idx =
    getMonthIndex(month);

  if (idx <= 0) {
    return {
      month: "DEC",
      year:
        Number(year) - 1
    };
  }

  return {
    month:
      MONTH_ORDER[idx - 1],
    year:
      Number(year)
  };
}

/* -----------------------------------
   SERIAL SCORE
----------------------------------- */

export function getDateScore({
  date = 1,
  month = "",
  year = 0
} = {}) {
  return (
    Number(year) *
      10000 +
    (getMonthIndex(
      month
    ) +
      1) *
      100 +
    Number(date)
  );
}

/* -----------------------------------
   LAST 30 DAY WINDOW
   Based on dataset serial score
----------------------------------- */

export function withinLastNDays(
  currentScore,
  rowScore,
  days = 30
) {
  return (
    rowScore <=
      currentScore &&
    rowScore >=
      currentScore -
        days
  );
}