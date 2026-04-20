// FILE: js/utils/math.js

/* -----------------------------------
   BASIC MATH HELPERS
----------------------------------- */

export function num(
  value = 0
) {
  const n =
    Number(value);

  return Number.isFinite(n)
    ? n
    : 0;
}

/* -----------------------------------
   ROUNDING
----------------------------------- */

export function round(
  value = 0,
  decimals = 2
) {
  const factor =
    10 ** decimals;

  return (
    Math.round(
      num(value) *
        factor
    ) / factor
  );
}

export function floor(
  value = 0
) {
  return Math.floor(
    num(value)
  );
}

export function ceil(
  value = 0
) {
  return Math.ceil(
    num(value)
  );
}

/* -----------------------------------
   DIVIDE SAFE
----------------------------------- */

export function divide(
  a = 0,
  b = 0
) {
  const den =
    num(b);

  if (!den) return 0;

  return num(a) / den;
}

/* -----------------------------------
   PERCENTAGE
----------------------------------- */

export function percent(
  value = 0,
  total = 0,
  decimals = 2
) {
  return round(
    divide(value, total) *
      100,
    decimals
  );
}

/* -----------------------------------
   GROWTH %
----------------------------------- */

export function growth(
  current = 0,
  previous = 0,
  decimals = 2
) {
  if (!num(previous)) {
    return 0;
  }

  return round(
    ((num(current) -
      num(previous)) /
      num(previous)) *
      100,
    decimals
  );
}

/* -----------------------------------
   AVERAGE
----------------------------------- */

export function average(
  arr = [],
  decimals = 2
) {
  if (!arr.length)
    return 0;

  const sum = arr.reduce(
    (a, b) =>
      a + num(b),
    0
  );

  return round(
    sum / arr.length,
    decimals
  );
}

/* -----------------------------------
   SUM
----------------------------------- */

export function sum(
  arr = []
) {
  return arr.reduce(
    (a, b) =>
      a + num(b),
    0
  );
}

/* -----------------------------------
   MIN / MAX
----------------------------------- */

export function min(
  arr = []
) {
  if (!arr.length)
    return 0;

  return Math.min(
    ...arr.map(num)
  );
}

export function max(
  arr = []
) {
  if (!arr.length)
    return 0;

  return Math.max(
    ...arr.map(num)
  );
}