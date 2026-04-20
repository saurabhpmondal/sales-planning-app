// REPLACE FILE
// FILE: js/core/state.js

/* -----------------------------------
   GLOBAL STATE
   FINAL FIX:
   Dashboard first load uses month filter
----------------------------------- */

export const APP_STATE = {
  store: null,

  activeTab:
    "dashboard",

  filters: {
    month: "ALL",
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

/* ----------------------------------- */

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

export function getFilters() {
  return {
    ...APP_STATE.filters
  };
}

export function setFilter(
  key,
  value
) {
  APP_STATE.filters[
    key
  ] = value;
}

export function setFilters(
  obj={}
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
    startDate:"",
    endDate:"",
    brand:"ALL",
    poType:"ALL",
    search:""
  };
}

/* -----------------------------------
   IMPORTANT:
   Call after store load
----------------------------------- */

export function hydrateInitialFilters() {
  APP_STATE.filters.month =
    resolveAutoMonth();

  APP_STATE.filters.startDate =
    "";

  APP_STATE.filters.endDate =
    "";
}

/* ----------------------------------- */

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