// REPLACE FILE
// FILE: js/engines/filterEngine.js

import { parseMonthYear } from "../utils/dates.js";
import { getFilters } from "../core/state.js";

/* -----------------------------------
   FILTER ENGINE
   Fixed:
   - default current month
   - proper month filtering
   - date range within month
----------------------------------- */

export function getFilteredData(
  store,
  inputFilters = {}
) {
  const filters = {
    ...getFilters(),
    ...inputFilters
  };

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
      filterStock(
        store.sjitStock ||
          [],
        store,
        filters
      ),

    sorStock:
      filterStock(
        store.sorStock ||
          [],
        store,
        filters
      ),

    sellerStock:
      store.sellerStock ||
      [],

    productMaster:
      filterMaster(
        store.productMaster ||
          [],
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
      monthOk(
        row,
        filters
      ) &&
      dateOk(
        row,
        filters
      ) &&
      brandOk(
        row.brand,
        filters
      ) &&
      poOk(
        row.poType,
        filters
      ) &&
      searchOk(
        row.styleId,
        row.erpSku,
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
      monthOk(
        row,
        filters
      ) &&
      dateOk(
        row,
        filters
      ) &&
      searchOk(
        row.styleId,
        "",
        filters
      )
  );
}

/* -----------------------------------
   TRAFFIC
----------------------------------- */

function filterTraffic(
  rows,
  filters
) {
  return rows.filter(
    (row) =>
      brandOk(
        row.brand,
        filters
      ) &&
      searchOk(
        row.styleId,
        "",
        filters
      )
  );
}

/* -----------------------------------
   MASTER
----------------------------------- */

function filterMaster(
  rows,
  filters
) {
  return rows.filter(
    (row) =>
      brandOk(
        row.brand,
        filters
      ) &&
      searchOk(
        row.styleId,
        row.erpSku,
        filters
      )
  );
}

/* -----------------------------------
   STOCK
----------------------------------- */

function filterStock(
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

function monthOk(
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

function dateOk(
  row,
  filters
) {
  const day =
    Number(row.date);

  if (
    filters.startDate
  ) {
    const start =
      Number(
        filters.startDate.split(
          "-"
        )[2]
      );

    if (day < start)
      return false;
  }

  if (
    filters.endDate
  ) {
    const end =
      Number(
        filters.endDate.split(
          "-"
        )[2]
      );

    if (day > end)
      return false;
  }

  return true;
}

function brandOk(
  brand,
  filters
) {
  return (
    filters.brand ===
      "ALL" ||
    brand ===
      filters.brand
  );
}

function poOk(
  po,
  filters
) {
  return (
    filters.poType ===
      "ALL" ||
    po ===
      filters.poType
  );
}

function searchOk(
  styleId,
  sku,
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

  return (
    String(styleId)
      .toLowerCase()
      .includes(q) ||
    String(sku)
      .toLowerCase()
      .includes(q)
  );
}