// FILE: js/utils/arrays.js

/* -----------------------------------
   ARRAY HELPERS
----------------------------------- */

/**
 * Unique primitive values
 */
export function unique(
  arr = []
) {
  return Array.from(
    new Set(arr)
  );
}

/**
 * Group array by key selector
 */
export function groupBy(
  arr = [],
  selector
) {
  const map = {};

  arr.forEach((item) => {
    const key =
      typeof selector ===
      "function"
        ? selector(item)
        : item[selector];

    const finalKey =
      String(
        key ?? ""
      );

    if (!map[finalKey]) {
      map[finalKey] = [];
    }

    map[finalKey].push(
      item
    );
  });

  return map;
}

/**
 * Sort copy asc
 */
export function sortAsc(
  arr = [],
  selector
) {
  return [...arr].sort(
    (a, b) =>
      getValue(
        a,
        selector
      ) -
      getValue(
        b,
        selector
      )
  );
}

/**
 * Sort copy desc
 */
export function sortDesc(
  arr = [],
  selector
) {
  return [...arr].sort(
    (a, b) =>
      getValue(
        b,
        selector
      ) -
      getValue(
        a,
        selector
      )
  );
}

/**
 * Chunk array
 */
export function chunk(
  arr = [],
  size = 50
) {
  const out = [];

  for (
    let i = 0;
    i < arr.length;
    i += size
  ) {
    out.push(
      arr.slice(
        i,
        i + size
      )
    );
  }

  return out;
}

/**
 * Get top N
 */
export function topN(
  arr = [],
  n = 10
) {
  return arr.slice(0, n);
}

/**
 * Safe selector
 */
function getValue(
  item,
  selector
) {
  if (
    typeof selector ===
    "function"
  ) {
    return (
      Number(
        selector(item)
      ) || 0
    );
  }

  return (
    Number(
      item?.[
        selector
      ]
    ) || 0
  );
}