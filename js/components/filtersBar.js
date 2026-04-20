// REPLACE FILE
// FILE: js/components/filtersBar.js

import {
  APP_STATE,
  getFilters
} from "../core/state.js";

import { getFiltersConfig } from "../config/filtersConfig.js";

/* -----------------------------------
   COMPACT FILTER BAR
   Single line responsive
----------------------------------- */

export function createFiltersBar() {
  const el =
    document.createElement(
      "div"
    );

  el.className =
    "filters-bar filters-bar--compact";

  const filters =
    getFilters();

  const config =
    getFiltersConfig();

  el.innerHTML = `
    <div class="filters-grid">
      ${config
        .map((item) =>
          renderControl(
            item,
            filters
          )
        )
        .join("")}
    </div>

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

  injectCss();

  return el;
}

/* -----------------------------------
   CONTROLS
----------------------------------- */

function renderControl(
  item,
  filters
) {
  if (
    item.type ===
    "select"
  ) {
    return `
      <div class="filter-box">
        <label>${item.label}</label>
        <select
          class="filter-control"
          data-filter="${item.key}"
        >
          ${getOptions(
            item
          )
            .map(
              (opt) => `
            <option
              value="${opt}"
              ${
                filters[
                  item.key
                ] === opt
                  ? "selected"
                  : ""
              }
            >
              ${opt}
            </option>
          `
            )
            .join("")}
        </select>
      </div>
    `;
  }

  if (
    item.type ===
    "date"
  ) {
    return `
      <div class="filter-box">
        <label>${item.label}</label>
        <input
          type="date"
          class="filter-control"
          data-filter="${item.key}"
          value="${
            filters[
              item.key
            ] || ""
          }"
        />
      </div>
    `;
  }

  return `
    <div class="filter-box filter-box--search">
      <label>${item.label}</label>
      <input
        type="text"
        class="filter-control"
        data-filter="search"
        placeholder="${item.placeholder}"
        value="${APP_STATE.filters.search}"
      />
    </div>
  `;
}

/* -----------------------------------
   OPTIONS
----------------------------------- */

function getOptions(
  item
) {
  if (
    item.key ===
    "month"
  ) {
    return [
      ...(APP_STATE.store
        ?.meta
        ?.months || [])
    ];
  }

  if (
    item.key ===
    "brand"
  ) {
    return [
      "ALL",
      ...(APP_STATE.store
        ?.meta
        ?.brands || [])
    ];
  }

  return (
    item.options || [
      "ALL"
    ]
  );
}

/* -----------------------------------
   CSS
----------------------------------- */

let done = false;

function injectCss() {
  if (done) return;
  done = true;

  const style =
    document.createElement(
      "style"
    );

  style.textContent = `
    .filters-bar--compact{
      display:flex;
      gap:10px;
      align-items:end;
      flex-wrap:nowrap;
    }

    .filters-grid{
      flex:1;
      display:grid;
      grid-template-columns:
        160px
        140px
        140px
        170px
        140px
        minmax(180px,1fr);
      gap:10px;
    }

    .filter-box{
      display:flex;
      flex-direction:column;
      gap:6px;
    }

    .filter-box label{
      font-size:11px;
      color:#64748b;
      font-weight:600;
    }

    .filter-control{
      height:38px;
    }

    @media(max-width:900px){
      .filters-bar--compact{
        flex-wrap:wrap;
      }

      .filters-grid{
        grid-template-columns:
          repeat(2,1fr);
      }
    }
  `;

  document.head.appendChild(
    style
  );
}