// FILE: js/data/datastore.js

import { MONTH_ORDER } from "../core/constants.js";

/* -----------------------------------
   BUILD CENTRAL DATA STORE
   Single source of truth after load
----------------------------------- */

export function buildDataStore(data = {}) {
  const store = {
    raw: data,

    sales: data.saleData || [],
    returns: data.returnData || [],
    traffic: data.traffic || [],

    sjitStock: data.sjitStock || [],
    sorStock: data.sorStock || [],
    sellerStock:
      data.sellerStock || [],

    productMaster:
      data.productMaster || [],

    lookups: {},
    meta: {}
  };

  /* Build lookup maps */
  store.lookups = buildLookups(store);

  /* Build meta info */
  store.meta = buildMeta(store);

  return store;
}

/* -----------------------------------
   LOOKUPS
----------------------------------- */

function buildLookups(store) {
  const byStyle = {};
  const byErpSku = {};
  const productByStyle = {};

  for (const row of store.productMaster) {
    const styleId = row.styleId;
    const erpSku = row.erpSku;

    if (styleId) {
      productByStyle[styleId] = row;
      byStyle[styleId] = row;
    }

    if (erpSku) {
      byErpSku[erpSku] = row;
    }
  }

  return {
    productByStyle,
    byStyle,
    byErpSku
  };
}

/* -----------------------------------
   META
----------------------------------- */

function buildMeta(store) {
  return {
    brands: getBrands(store),
    months: getMonths(store),
    totalStyles:
      Object.keys(
        store.lookups.byStyle
      ).length,

    latestSalesDate:
      getLatestSalesDate(store),

    generatedAt:
      new Date().toISOString()
  };
}

/* -----------------------------------
   BRANDS
----------------------------------- */

function getBrands(store) {
  const set = new Set();

  store.productMaster.forEach(
    (row) => {
      if (row.brand) {
        set.add(row.brand);
      }
    }
  );

  return Array.from(set).sort();
}

/* -----------------------------------
   MONTHS
----------------------------------- */

function getMonths(store) {
  const set = new Set();

  store.sales.forEach((row) => {
    if (
      row.month &&
      row.year
    ) {
      set.add(
        `${row.month} ${row.year}`
      );
    }
  });

  const items =
    Array.from(set);

  return items.sort(sortMonthYear);
}

function sortMonthYear(a, b) {
  const [ma, ya] =
    a.split(" ");
  const [mb, yb] =
    b.split(" ");

  const yearDiff =
    Number(yb) -
    Number(ya);

  if (yearDiff !== 0)
    return yearDiff;

  return (
    MONTH_ORDER.indexOf(mb) -
    MONTH_ORDER.indexOf(ma)
  );
}

/* -----------------------------------
   LATEST DATE
----------------------------------- */

function getLatestSalesDate(
  store
) {
  let latest = 0;

  store.sales.forEach((row) => {
    const score =
      row.year * 10000 +
      monthNo(row.month) *
        100 +
      row.date;

    if (score > latest) {
      latest = score;
    }
  });

  return latest;
}

function monthNo(month) {
  const index =
    MONTH_ORDER.indexOf(month);

  return index + 1;
}