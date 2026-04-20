// FILE: js/utils/format.js

/* -----------------------------------
   NUMBER FORMATTERS
----------------------------------- */

export function formatNumber(
  value = 0,
  decimals = 0
) {
  const num =
    Number(value) || 0;

  return num.toLocaleString(
    "en-IN",
    {
      minimumFractionDigits:
        decimals,
      maximumFractionDigits:
        decimals
    }
  );
}

/* -----------------------------------
   CURRENCY
----------------------------------- */

export function formatCurrency(
  value = 0,
  decimals = 0
) {
  const num =
    Number(value) || 0;

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits:
        decimals,
      minimumFractionDigits:
        decimals
    }
  ).format(num);
}

/* -----------------------------------
   PERCENT
----------------------------------- */

export function formatPercent(
  value = 0,
  decimals = 2
) {
  const num =
    Number(value) || 0;

  return `${num.toFixed(
    decimals
  )}%`;
}

/* -----------------------------------
   SHORT NUMBERS
----------------------------------- */

export function formatCompact(
  value = 0
) {
  const num =
    Number(value) || 0;

  return new Intl.NumberFormat(
    "en-IN",
    {
      notation:
        "compact",
      maximumFractionDigits: 1
    }
  ).format(num);
}

/* -----------------------------------
   TEXT
----------------------------------- */

export function titleCase(
  value = ""
) {
  return String(value)
    .toLowerCase()
    .split(" ")
    .map(
      (word) =>
        word.charAt(0)
          .toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

/* -----------------------------------
   SAFE
----------------------------------- */

export function safeText(
  value = ""
) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}