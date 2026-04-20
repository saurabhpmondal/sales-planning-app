// REPLACE FILE
// FILE: js/core/state.js

/* -----------------------------------
   GLOBAL APP STATE
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
    loading: true,
    mobile: false
  }
};

/* -----------------------------------
   TAB
----------------------------------- */

export function getActiveTab() {
  return APP_STATE.activeTab;
}

export function setActiveTab(
  tabId
) {
  APP_STATE.activeTab =
    tabId;
}

/* -----------------------------------
   FILTERS
----------------------------------- */

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

export function setFilter(
  key,
  value
) {
  APP_STATE.filters[
    key
  ] = value;
}

/* compatibility */
export function setFilters(
  payload = {}
) {
  APP_STATE.filters = {
    ...APP_STATE.filters,
    ...payload
  };
}

export function resetFilters() {
  APP_STATE.filters = {
    month: "AUTO",
    startDate: "",
    endDate: "",
    brand: "ALL",
    poType: "ALL",
    search: ""
  };
}

/* -----------------------------------
   HELPERS
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