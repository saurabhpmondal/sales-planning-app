// FILE: js/core/events.js

import { renderCurrentRoute } from "./router.js";
import { setFilters, resetFilters } from "./state.js";

/* -----------------------------------
   GLOBAL EVENT BINDINGS
----------------------------------- */

export function bindGlobalEvents() {
  bindFilterEvents();
  bindSearchEvents();
  bindResetEvents();
  bindRefreshEvents();
}

/* -----------------------------------
   FILTER CHANGE EVENTS
----------------------------------- */

function bindFilterEvents() {
  document.addEventListener("change", (event) => {
    const target = event.target;

    if (!target.matches("[data-filter]")) return;

    const key = target.dataset.filter;
    const value = target.value;

    setFilters({
      [key]: value
    });

    renderCurrentRoute();
  });
}

/* -----------------------------------
   SEARCH INPUT
----------------------------------- */

function bindSearchEvents() {
  let timer = null;

  document.addEventListener("input", (event) => {
    const target = event.target;

    if (!target.matches("[data-filter='search']")) return;

    clearTimeout(timer);

    timer = setTimeout(() => {
      setFilters({
        search: target.value.trim()
      });

      renderCurrentRoute();
    }, 250);
  });
}

/* -----------------------------------
   RESET FILTERS
----------------------------------- */

function bindResetEvents() {
  document.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-action='reset-filters']");

    if (!btn) return;

    resetFilters();

    syncInputs();

    renderCurrentRoute();
  });
}

/* -----------------------------------
   MANUAL REFRESH
----------------------------------- */

function bindRefreshEvents() {
  document.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-action='refresh-report']");

    if (!btn) return;

    renderCurrentRoute();
  });
}

/* -----------------------------------
   UI SYNC
----------------------------------- */

function syncInputs() {
  document
    .querySelectorAll("[data-filter]")
    .forEach((input) => {
      const key = input.dataset.filter;

      if (key === "search") {
        input.value = "";
        return;
      }

      if (
        key === "startDate" ||
        key === "endDate"
      ) {
        input.value = "";
        return;
      }

      input.value = "ALL";
    });
}