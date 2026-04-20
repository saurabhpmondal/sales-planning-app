// REPLACE FILE
// FILE: js/engines/growthEngine.js

/* -----------------------------------
   GROWTH ENGINE
   Month vs Previous Month
----------------------------------- */

export function getGrowthByStyle(
  salesRows = [],
  filters = {}
) {
  const selected =
    filters.month ||
    "";

  if (!selected)
    return {};

  const [
    month,
    yearText
  ] =
    selected.split(
      " "
    );

  const year =
    Number(
      yearText
    );

  const prev =
    previousMonth(
      month,
      year
    );

  const curMap = {};
  const prevMap = {};

  salesRows.forEach((r) => {
    const id =
      r.styleId;

    if (!id) return;

    const qty =
      Number(
        r.qty
      ) || 0;

    if (
      r.month ===
        month &&
      Number(
        r.year
      ) === year
    ) {
      curMap[id] =
        (curMap[id] ||
          0) + qty;
    }

    if (
      r.month ===
        prev.month &&
      Number(
        r.year
      ) ===
        prev.year
    ) {
      prevMap[id] =
        (prevMap[id] ||
          0) + qty;
    }
  });

  const out = {};
  const ids =
    new Set([
      ...Object.keys(
        curMap
      ),
      ...Object.keys(
        prevMap
      )
    ]);

  ids.forEach((id) => {
    const cur =
      curMap[id] || 0;

    const old =
      prevMap[id] || 0;

    if (!old) {
      out[id] =
        cur
          ? 100
          : 0;
    } else {
      out[id] =
        ((cur -
          old) /
          old) *
        100;
    }
  });

  return out;
}

/* -----------------------------------
   HELPERS
----------------------------------- */

function previousMonth(
  month,
  year
) {
  const arr = [
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
  ];

  let idx =
    arr.indexOf(
      month
    );

  idx--;

  if (idx < 0) {
    idx = 11;
    year--;
  }

  return {
    month:
      arr[idx],
    year
  };
}