// REPLACE FILE
// FILE: js/core/state.js

/* -----------------------------------
   GLOBAL APP STATE
----------------------------------- */

export const APP_STATE = {
  /* central store */
  store: null,

  /* default active tab */
  activeTab:
    "dashboard",

  /* dynamic filters */
  filters: {
    /* auto set after load */
    month: "AUTO",

    /* custom day range */
    startDate: "",
    endDate: "",

    /* dropdowns */
    brand: "ALL",
    poType: "ALL",

    /* style / sku search */
    search: ""
  },

  /* ui helpers */
  ui: {
    loading: true,
    mobile: false
  }
};

/* -----------------------------------
   TAB HELPERS
----------------------------------- */

export function getActiveTab() {
  return (
    APP_STATE.activeTab
  );
}

export function setActiveTab(
  tabId
) {
  APP_STATE.activeTab =
    tabId;
}

/* -----------------------------------
   FILTER HELPERS
----------------------------------- */

export function setFilter(
  key,
  value
) {
  APP_STATE.filters[
    key
  ] = value;
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
   AUTO MONTH
----------------------------------- */

export function resolveAutoMonth() {
  if (
    !APP_STATE.store
  ) {
    return "ALL";
  }

  const months =
    APP_STATE.store.meta
      ?.months || [];

  return (
    months[0] ||
    "ALL"
  );
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