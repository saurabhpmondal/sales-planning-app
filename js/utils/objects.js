// FILE: js/utils/objects.js

/* -----------------------------------
   OBJECT HELPERS
----------------------------------- */

/**
 * Deep clone plain JSON object
 */
export function clone(
  value
) {
  return JSON.parse(
    JSON.stringify(
      value
    )
  );
}

/**
 * Merge shallow objects
 */
export function merge(
  ...objects
) {
  return Object.assign(
    {},
    ...objects
  );
}

/**
 * Safe nested get
 */
export function get(
  obj,
  path = "",
  fallback = undefined
) {
  if (!obj || !path) {
    return fallback;
  }

  const keys =
    String(path).split(".");

  let current = obj;

  for (const key of keys) {
    if (
      current ==
        null ||
      !(key in current)
    ) {
      return fallback;
    }

    current =
      current[key];
  }

  return current;
}

/**
 * Pick keys
 */
export function pick(
  obj = {},
  keys = []
) {
  const out = {};

  keys.forEach((key) => {
    if (
      key in obj
    ) {
      out[key] =
        obj[key];
    }
  });

  return out;
}

/**
 * Omit keys
 */
export function omit(
  obj = {},
  keys = []
) {
  const out = {
    ...obj
  };

  keys.forEach((key) => {
    delete out[key];
  });

  return out;
}

/**
 * Empty object check
 */
export function isEmpty(
  obj = {}
) {
  return (
    Object.keys(obj)
      .length === 0
  );
}