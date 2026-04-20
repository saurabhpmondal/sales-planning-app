// FILE: js/engines/filterEngine.js

import { parseMonthYear } from "../utils/dates.js";

/* -----------------------------------
   MAIN FILTER ENGINE
----------------------------------- */

export function getFilteredData(
  store,
  filters = {}
) {
  return {
    sales: filterSales(
      store.sales || [],
      filters
    ),

    returns: filterReturns(
      store.returns || [],
      filters
    ),

    traffic: filterTraffic(
      store.traffic || [],
      filters
    ),

    sjitStock:
      filterByBrandViaMaster(
        store.sjitStock || [],
        store,
        filters
      ),

    sorStock:
      filterByBrandViaMaster(
        store.sorStock || [],
        store,
        filters
      ),

    sellerStock:
      store.sellerStock || [],

    productMaster:
      filterProductMaster(
        store.productMaster || [],
        filters
      )
  };
}

/* -----------------------------------
   SALES
----------------------------------- */

function filterSales(
  rows,
  filters
) {
  return rows.filter(
    (row) =>
      monthMatch(
        row,
        filters
      ) &&
      dateMatch(
        row,
        filters
      ) &&
      brandMatch(
        row.brand,
        filters
      ) &&
      poTypeMatch(
        row.poType,
        filters
      ) &&
      searchMatch(
        row.styleId,
        row,
        filters
      )
  );
}

/* -----------------------------------
   RETURNS
----------------------------------- */

function filterReturns(
  rows,
  filters
) {
  return rows.filter(
    (row) =>
      monthMatch(
        row,
        filters
      ) &&
      dateMatch(
        row,
        filters
      ) &&
      searchMatch(
        row.styleId,
        row,
        filters
      )
  );
}

/* -----------------------------------
   TRAFFIC
   no date logic
----------------------------------- */

function filterTraffic(
  rows,
  filters
) {
  return rows.filter(
    (row) =>
      brandMatch(
        row.brand,
        filters
      ) &&
      searchMatch(
        row.styleId,
        row,
        filters
      )
  );
}

/* -----------------------------------
   PRODUCT MASTER
----------------------------------- */

function filterProductMaster(
  rows,
  filters
) {
  return rows.filter(
    (row) =>
      brandMatch(
        row.brand,
        filters
      ) &&
      searchMatch(
        row.styleId,
        row,
        filters
      )
  );
}

/* -----------------------------------
   STOCK WITH BRAND
----------------------------------- */

function filterByBrandViaMaster(
  rows,
  store,
  filters
) {
  if (
    filters.brand ===
    "ALL"
  ) {
    return rows;
  }

  const map =
    store.lookups
      .productByStyle ||
    {};

  return rows.filter(
    (row) =>
      map[row.styleId]
        ?.brand ===
      filters.brand
  );
}

/* -----------------------------------
   MATCHERS
----------------------------------- */

function monthMatch(
  row,
  filters
) {
  if (
    !filters.month ||
    filters.month ===
      "ALL"
  ) {
    return true;
  }

  const {
    month,
    year
  } =
    parseMonthYear(
      filters.month
    );

  return (
    row.month ===
      month &&
    Number(row.year) ===
      Number(year)
  );
}

function dateMatch(
  row,
  filters
) {
  if (
    !filters.startDate &&
    !filters.endDate
  ) {
    return true;
  }

  const day =
    Number(row.date);

  if (
    filters.startDate
  ) {
    const start =
      new Date(
        filters.startDate
      ).getDate();

    if (day < start)
      return false;
  }

  if (
    filters.endDate
  ) {
    const end =
      new Date(
        filters.endDate
      ).getDate();

    if (day > end)
      return false;
  }

  return true;
}

function brandMatch(
  brand,
  filters
) {
  return (
    !filters.brand ||
    filters.brand ===
      "ALL" ||
    brand ===
      filters.brand
  );
}

function poTypeMatch(
  poType,
  filters
) {
  return (
    !filters.poType ||
    filters.poType ===
      "ALL" ||
    poType ===
      filters.poType
  );
}

function searchMatch(
  styleId,
  row,
  filters
) {
  const q =
    String(
      filters.search ||
        ""
    )
      .trim()
      .toLowerCase();

  if (!q) return true;

  const erpSku =
    row.erpSku || "";

  return (
    String(styleId)
      .toLowerCase()
      .includes(q) ||
    String(erpSku)
      .toLowerCase()
      .includes(q)
  );
}
