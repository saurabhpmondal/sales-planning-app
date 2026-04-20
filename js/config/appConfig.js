// FILE: js/config/appConfig.js

import { APP_INFO } from "../core/constants.js";

/* -----------------------------------
   MASTER APP CONFIG
----------------------------------- */

export const APP_CONFIG = {
  /* Identity */
  name: APP_INFO.name,
  version: APP_INFO.version,

  /* Theme */
  theme: {
    defaultMode: "light",
    allowDarkMode: false
  },

  /* Layout */
  layout: {
    maxWidth: 1600,
    stickyHeader: true,
    stickyFilters: true,
    stickyTabs: true
  },

  /* Data */
  data: {
    autoLoadOnStart: true,
    enableCache: true,
    retryCount: 2
  },

  /* Reports */
  reports: {
    defaultTab: "dashboard",
    enableExports: true
  },

  /* Search */
  search: {
    enabled: true,
    keys: ["styleId", "erpSku"]
  },

  /* Formatting */
  format: {
    currency: "INR",
    locale: "en-IN",
    decimals: 2
  },

  /* Debug */
  debug: {
    enabled: false,
    consoleLogs: false
  }
};

/* -----------------------------------
   HELPERS
----------------------------------- */

export function getAppConfig() {
  return APP_CONFIG;
}