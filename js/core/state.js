// REPLACE FILE
// FILE: js/core/state.js

/* -----------------------------------
   GLOBAL STATE
   FIX:
   Initial month truly applied
----------------------------------- */

export const APP_STATE = {
  store: null,

  activeTab:
    "dashboard",

  filters: {
    month: "AUTO",
    startDate: "",
    endDate: "",
    brand: "ALL",
    poType: "ALL",
    search: ""
  },

  ui: {
    loading: true
  }
};

/* -----------------------------------
   TAB
----------------------------------- */

export function getActiveTab() {
  return APP_STATE.activeTab;
}

export function setActiveTab(
  tab
) {
  APP_STATE.activeTab =
    tab;
}

/* -----------------------------------
   FILTERS
----------------------------------- */

export function setFilter(
  key,
  value
) {
  APP_STATE.filters[
    key
  ] = value;
}

export function setFilters(
  obj = {}
) {
  APP_STATE.filters = {
    ...APP_STATE.filters,
    ...obj
  };
}

export function resetFilters() {
  APP_STATE.filters = {
    month:
      resolveAutoMonth(),
    startDate: "",
    endDate: "",
    brand: "ALL",
    poType: "ALL",
    search: ""
  };
}

export function getFilters() {
  const out = {
    ...APP_STATE.filters
  };

  if (
    out.month ===
    "AUTO"
  ) {
    out.month =
      resolveAutoMonth();
  }

  return out;
}

/* -----------------------------------
   AUTO MONTH
----------------------------------- */

export function resolveAutoMonth() {
  const months =
    APP_STATE.store
      ?.meta
      ?.months || [];

  return (
    months[0] ||
    "ALL"
  );
}

/* -----------------------------------
   AFTER STORE LOAD
----------------------------------- */

export function hydrateInitialFilters() {
  APP_STATE.filters.month =
    resolveAutoMonth();
}