// REPLACE FILE
// FILE: js/engines/drrEngine.js

/* -----------------------------------
   DRR ENGINE
   Locked Rule:
   Current calendar day - 1
----------------------------------- */

export function getDrrByStyle(
  salesRows = []
) {
  const divisor =
    getDrrDays();

  const map = {};

  salesRows.forEach((row) => {
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
      divisor;
  });

  return map;
}

export function getDrrByBrand(
  salesRows = []
) {
  const divisor =
    getDrrDays();

  const map = {};

  salesRows.forEach((row) => {
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
      divisor;
  });

  return map;
}

/* -----------------------------------
   HELPER
----------------------------------- */

function getDrrDays() {
  const today =
    new Date().getDate();

  return Math.max(
    today - 1,
    1
  );
}