// FILE: js/config/filtersConfig.js

/* -----------------------------------
   GLOBAL FILTER CONFIG
----------------------------------- */

export const FILTERS_CONFIG = [
  {
    key: "month",
    label: "Month",
    type: "select",
    defaultValue: "ALL",
    dynamic: true
  },
  {
    key: "startDate",
    label: "Start Date",
    type: "date",
    defaultValue: ""
  },
  {
    key: "endDate",
    label: "End Date",
    type: "date",
    defaultValue: ""
  },
  {
    key: "brand",
    label: "Brand",
    type: "select",
    defaultValue: "ALL",
    dynamic: true
  },
  {
    key: "poType",
    label: "PO Type",
    type: "select",
    defaultValue: "ALL",
    dynamic: false,
    options: [
      "ALL",
      "FC",
      "PPMP",
      "SJIT",
      "SOR"
    ]
  },
  {
    key: "search",
    label: "Search",
    type: "search",
    placeholder: "Search style ID / ERP SKU"
  }
];

/* -----------------------------------
   HELPERS
----------------------------------- */

export function getFiltersConfig() {
  return FILTERS_CONFIG;
}