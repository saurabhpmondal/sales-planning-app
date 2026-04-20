// FILE: js/components/kpiCards.js

import { formatCurrency } from "../utils/format.js";

/* -----------------------------------
   KPI GRID RENDERER
----------------------------------- */

export function createKpiGrid(
  items = []
) {
  const wrapper =
    document.createElement("div");

  wrapper.className =
    "report-kpis";

  wrapper.innerHTML = items
    .map((item) =>
      createKpiCard(item)
    )
    .join("");

  return wrapper;
}

/* -----------------------------------
   SINGLE CARD HTML
----------------------------------- */

export function createKpiCard(
  item = {}
) {
  const {
    label = "-",
    value = 0,
    type = "default",
    icon = "•",
    delta = "",
    sub = "",
    format = "number"
  } = item;

  const displayValue =
    formatValue(
      value,
      format
    );

  const deltaClass =
    getDeltaClass(delta);

  return `
    <div class="kpi-card kpi-card--${type}">
      <div class="kpi-card__top">

        <div class="kpi-card__label">
          ${label}
        </div>

        <div class="kpi-card__icon">
          ${icon}
        </div>

      </div>

      <div class="kpi-card__value">
        ${displayValue}
      </div>

      <div class="kpi-card__meta">

        <div class="kpi-card__delta ${deltaClass}">
          ${delta}
        </div>

        <div class="kpi-card__sub">
          ${sub}
        </div>

      </div>
    </div>
  `;
}

/* -----------------------------------
   HELPERS
----------------------------------- */

function formatValue(
  value,
  mode
) {
  if (mode === "currency") {
    return formatCurrency(
      value
    );
  }

  if (mode === "percent") {
    return `${round(
      value
    )}%`;
  }

  return formatNumber(
    value
  );
}

function formatNumber(v) {
  const num =
    Number(v) || 0;

  return num.toLocaleString(
    "en-IN"
  );
}

function round(v) {
  return (
    Math.round(
      (Number(v) || 0) *
        100
    ) / 100
  );
}

function getDeltaClass(
  value = ""
) {
  const text =
    String(value);

  if (text.includes("-"))
    return "text-danger";

  if (
    text &&
    text !== "0" &&
    text !== "0%"
  ) {
    return "text-success";
  }

  return "text-muted";
}