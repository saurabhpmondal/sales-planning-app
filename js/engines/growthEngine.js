// REPLACE FILE
// FILE: js/engines/growthEngine.js

/* -----------------------------------
   FINAL GROWTH ENGINE
   Projected Current Month GMV
   vs Previous Month GMV
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
    getPrev(
      month,
      year
    );

  const daysElapsed =
    Math.max(
      new Date()
        .getDate() - 1,
      1
    );

  const daysMonth =
    getMonthDays(
      month,
      year
    );

  const cur = {};
  const old = {};

  salesRows.forEach((r) => {
    const id =
      r.styleId;

    if (!id) return;

    const gmv =
      Number(
        r.finalAmount
      ) || 0;

    if (
      r.month ===
        month &&
      Number(
        r.year
      ) === year
    ) {
      cur[id] =
        (cur[id] || 0) +
        gmv;
    }

    if (
      r.month ===
        prev.month &&
      Number(
        r.year
      ) ===
        prev.year
    ) {
      old[id] =
        (old[id] || 0) +
        gmv;
    }
  });

  const out = {};
  const ids =
    new Set([
      ...Object.keys(
        cur
      ),
      ...Object.keys(
        old
      )
    ]);

  ids.forEach((id) => {
    const mtd =
      cur[id] || 0;

    const prevGmv =
      old[id] || 0;

    const proj =
      (mtd /
        daysElapsed) *
      daysMonth;

    if (!prevGmv) {
      out[id] =
        proj
          ? 100
          : 0;
    } else {
      out[id] =
        ((proj -
          prevGmv) /
          prevGmv) *
        100;
    }
  });

  return out;
}

/* ----------------------------------- */

function getPrev(
  month,
  year
) {
  const arr = [
    "JAN","FEB","MAR","APR",
    "MAY","JUN","JUL","AUG",
    "SEP","OCT","NOV","DEC"
  ];

  let i =
    arr.indexOf(
      month
    ) - 1;

  if (i < 0) {
    i = 11;
    year--;
  }

  return {
    month:
      arr[i],
    year
  };
}

function getMonthDays(
  month,
  year
) {
  const map = {
    JAN:1,FEB:2,MAR:3,APR:4,
    MAY:5,JUN:6,JUL:7,AUG:8,
    SEP:9,OCT:10,NOV:11,DEC:12
  };

  return new Date(
    year,
    map[month],
    0
  ).getDate();
}