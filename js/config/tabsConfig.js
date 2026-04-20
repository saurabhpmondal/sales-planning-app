// FILE: js/config/tabsConfig.js

import { TAB_IDS } from "../core/constants.js";

/* -----------------------------------
   TAB CONFIGURATION
   Add / remove / hide tabs here only
----------------------------------- */

export const TABS_CONFIG = [
  {
    id: TAB_IDS.DASHBOARD,
    label: "Dashboard",
    icon: "📊",
    enabled: true,
    order: 1
  },
  {
    id: TAB_IDS.DAY_ON_DAY,
    label: "Day on Day sale",
    icon: "📅",
    enabled: true,
    order: 2
  },
  {
    id: TAB_IDS.SALES,
    label: "Sales",
    icon: "📈",
    enabled: true,
    order: 3
  },
  {
    id: TAB_IDS.SJIT,
    label: "SJIT planning",
    icon: "🚚",
    enabled: true,
    order: 4
  },
  {
    id: TAB_IDS.SOR,
    label: "SOR planning",
    icon: "🏬",
    enabled: true,
    order: 5
  },
  {
    id: TAB_IDS.STYLE_DEEP,
    label: "Style Deep Analysis",
    icon: "🔍",
    enabled: true,
    order: 6
  },
  {
    id: TAB_IDS.EXPORT,
    label: "Export center",
    icon: "⬇️",
    enabled: true,
    order: 7
  }
];

/* -----------------------------------
   HELPERS
----------------------------------- */

export function getEnabledTabs() {
  return TABS_CONFIG
    .filter((tab) => tab.enabled)
    .sort((a, b) => a.order - b.order);
}

export function getTabById(id) {
  return TABS_CONFIG.find((tab) => tab.id === id) || null;
}