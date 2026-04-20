// FILE: js/components/filtersBar.js

import { getFiltersConfig } from "../config/filtersConfig.js";
import { APP_STATE } from "../core/state.js";

/* -----------------------------------
   FILTER BAR COMPONENT
----------------------------------- */

export function createFiltersBar() {
  const el =
    document.createElement("div");

  el.className = "filters-bar";

  const config =
    getFiltersConfig();

  const html = config
    .map((item) =>
      createControl(item)
    )
    .join("");

  el.innerHTML = `
    ${html}

    <div class="filter-actions">
      <button
        class="filter-btn"
        data-action="reset-filters"
        type="button"
      >
        Reset
      </button>
    </div>
  `;

  return el;
}

/* -----------------------------------
   CONTROL FACTORY
----------------------------------- */

function createControl(item) {
  if (item.type === "select") {
    return createSelect(item);
  }

  if (item.type === "date") {
    return createDate(item);
  }

  if (item.type === "search") {
    return createSearch(item);
  }

  return "";
}

/* -----------------------------------
   SELECT
----------------------------------- */

function createSelect(item) {
  const options =
    getOptions(item);

  return `
    <div class="filter-group">
      <label class="filter-label">
        ${item.label}
      </label>

      <select
        class="filter-control"
        data-filter="${item.key}"
      >
        ${options
          .map(
            (value) => `
          <option value="${value}">
            ${value}
          </option>
        `
          )
          .join("")}
      </select>
    </div>
  `;
}

/* -----------------------------------
   DATE
----------------------------------- */

function createDate(item) {
  return `
    <div class="filter-group">
      <label class="filter-label">
        ${item.label}
      </label>

      <input
        type="date"
        class="filter-control"
        data-filter="${item.key}"
        value=""
      />
    </div>
  `;
}

/* -----------------------------------
   SEARCH
----------------------------------- */

function createSearch(item) {
  return `
    <div class="filter-group">
      <label class="filter-label">
        ${item.label}
      </label>

      <div class="search-wrap">
        <input
          type="text"
          class="search-input"
          data-filter="search"
          placeholder="${item.placeholder}"
          value="${APP_STATE.filters.search}"
        />

        <span class="search-icon">
          🔍
        </span>
      </div>
    </div>
  `;
}

/* -----------------------------------
   OPTIONS
----------------------------------- */

function getOptions(item) {
  if (
    item.key === "month"
  ) {
    return [
      "ALL",
      ...(APP_STATE.store?.meta
        ?.months || [])
    ];
  }

  if (
    item.key === "brand"
  ) {
    return [
      "ALL",
      ...(APP_STATE.store?.meta
        ?.brands || [])
    ];
  }

  return item.options || [
    "ALL"
  ];
}