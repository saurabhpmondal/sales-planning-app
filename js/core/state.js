// FILE: js/core/state.js

/* -----------------------------------
   GLOBAL APPLICATION STATE
----------------------------------- */

export const APP_STATE = {
  /* Data store loaded after boot */
  store: null,

  /* Active tab */
  activeTab: "dashboard",

  /* Global filters */
  filters: {
    month: "ALL",
    startDate: "",
    endDate: "",
    brand: "ALL",
    poType: "ALL",
    search: ""
  },

  /* Sort memory per report */
  sorting: {
    sales: {
      key: "units",
      order: "desc"
    },
    dayOnDaySale: {
      key: "styleId",
      order: "asc"
    },
    sjitPlanning: {
      key: "shipmentQty",
      order: "desc"
    },
    sorPlanning: {
      key: "shipmentQty",
      order: "desc"
    }
  },

  /* UI state */
  ui: {
    loading: false,
    darkMode: false
  }
};

/* -----------------------------------
   GETTERS
----------------------------------- */

export function getState() {
  return APP_STATE;
}

export function getFilters() {
  return APP_STATE.filters;
}

export function getStore() {
  return APP_STATE.store;
}

export function getActiveTab() {
  return APP_STATE.activeTab;
}

/* -----------------------------------
   TAB STATE
----------------------------------- */

export function setActiveTab(tabId) {
  APP_STATE.activeTab = tabId;
}

/* -----------------------------------
   FILTER STATE
----------------------------------- */

export function setFilters(patch = {}) {
  APP_STATE.filters = {
    ...APP_STATE.filters,
    ...patch
  };
}

export function resetFilters() {
  APP_STATE.filters = {
    month: "ALL",
    startDate: "",
    endDate: "",
    brand: "ALL",
    poType: "ALL",
    search: ""
  };
}

/* -----------------------------------
   SORTING STATE
----------------------------------- */

export function setSorting(reportId, key, order = "asc") {
  APP_STATE.sorting[reportId] = { key, order };
}

export function getSorting(reportId) {
  return APP_STATE.sorting[reportId] || null;
}

/* -----------------------------------
   UI STATE
----------------------------------- */

export function setLoading(value) {
  APP_STATE.ui.loading = Boolean(value);
}

export function setDarkMode(value) {
  APP_STATE.ui.darkMode = Boolean(value);
}