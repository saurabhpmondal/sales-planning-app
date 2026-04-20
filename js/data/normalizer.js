// FILE: js/data/normalizer.js

/* -----------------------------------
   NORMALIZE ALL DATASETS
   Convert strings -> numbers / text
   Clean blanks / uppercase months
----------------------------------- */

export function normalizeAllDatasets(
  data = {}
) {
  return {
    saleData: normalizeSales(
      data.saleData || []
    ),
    returnData: normalizeReturns(
      data.returnData || []
    ),
    traffic: normalizeTraffic(
      data.traffic || []
    ),
    sjitStock: normalizeSjitStock(
      data.sjitStock || []
    ),
    sorStock: normalizeSorStock(
      data.sorStock || []
    ),
    sellerStock:
      normalizeSellerStock(
        data.sellerStock || []
      ),
    productMaster:
      normalizeProductMaster(
        data.productMaster || []
      )
  };
}

/* -----------------------------------
   SALES
----------------------------------- */

function normalizeSales(rows) {
  return rows.map((r) => ({
    ...r,
    sellerId: text(r.sellerId),
    poType: upper(r.poType),
    createdOn: text(r.createdOn),

    date: int(r.date),
    month: upper(r.month),
    year: int(r.year),

    styleId: text(r.styleId),
    brand: text(r.brand),
    articleType: text(r.articleType),

    orderStatus: upper(
      r.orderStatus
    ),

    qty: num(r.qty),
    finalAmount: num(
      r.finalAmount
    ),
    sellerPrice: num(
      r.sellerPrice
    ),

    state: text(r.state),
    warehouseId: text(
      r.warehouseId
    ),
    orderLineId: text(
      r.orderLineId
    )
  }));
}

/* -----------------------------------
   RETURNS
----------------------------------- */

function normalizeReturns(rows) {
  return rows.map((r) => ({
    ...r,
    sourceMonth: upper(
      r.sourceMonth
    ),

    sellerId: text(r.sellerId),
    warehouseId: text(
      r.warehouseId
    ),

    model: text(r.model),
    styleId: text(r.styleId),

    type: text(r.type),
    status: text(r.status),
    returnReason: text(
      r.returnReason
    ),

    orderLineId: text(
      r.orderLineId
    ),

    date: int(r.date),
    month: upper(r.month),
    year: int(r.year)
  }));
}

/* -----------------------------------
   TRAFFIC
----------------------------------- */

function normalizeTraffic(rows) {
  return rows.map((r) => ({
    ...r,
    styleId: text(r.styleId),
    sellerId: text(r.sellerId),

    articleType: text(
      r.articleType
    ),
    brand: text(r.brand),
    gender: text(r.gender),

    sellerMrp: num(
      r.sellerMrp
    ),
    inventoryAge: num(
      r.inventoryAge
    ),

    impressions: num(
      r.impressions
    ),
    clicks: num(r.clicks),
    addToCarts: num(
      r.addToCarts
    ),
    purchases: num(
      r.purchases
    ),

    rating: num(r.rating)
  }));
}

/* -----------------------------------
   SJIT STOCK
----------------------------------- */

function normalizeSjitStock(rows) {
  return rows.map((r) => ({
    ...r,
    sellerId: text(r.sellerId),
    warehouseId: text(
      r.warehouseId
    ),
    warehouseName: text(
      r.warehouseName
    ),

    sellerSkuCode: text(
      r.sellerSkuCode
    ),
    skuId: text(r.skuId),
    skuCode: text(r.skuCode),

    styleId: text(r.styleId),

    inventoryCount: num(
      r.inventoryCount
    ),

    sellableInventoryCount:
      num(
        r.sellableInventoryCount
      ),

    isActive: text(r.isActive)
  }));
}

/* -----------------------------------
   SOR STOCK
----------------------------------- */

function normalizeSorStock(rows) {
  return rows.map((r) => ({
    ...r,
    styleId: text(r.styleId),
    brand: text(r.brand),
    articleType: text(
      r.articleType
    ),
    skuId: text(r.skuId),
    instockedWhName: text(
      r.instockedWhName
    ),
    units: num(r.units)
  }));
}

/* -----------------------------------
   SELLER STOCK
----------------------------------- */

function normalizeSellerStock(
  rows
) {
  return rows.map((r) => ({
    ...r,
    erpSku: text(r.erpSku),
    units: num(r.units)
  }));
}

/* -----------------------------------
   PRODUCT MASTER
----------------------------------- */

function normalizeProductMaster(
  rows
) {
  return rows.map((r) => ({
    ...r,
    styleId: text(r.styleId),
    launchDate: text(
      r.launchDate
    ),
    liveDate: text(r.liveDate),

    erpSku: text(r.erpSku),
    brand: text(r.brand),
    articleType: text(
      r.articleType
    ),

    status: text(r.status),

    mrp: num(r.mrp),
    tp: num(r.tp)
  }));
}

/* -----------------------------------
   HELPERS
----------------------------------- */

export function num(value) {
  const clean = String(
    value ?? ""
  ).replace(/,/g, "");

  const n = Number(clean);

  return Number.isFinite(n)
    ? n
    : 0;
}

export function int(value) {
  return Math.trunc(
    num(value)
  );
}

export function text(value) {
  return String(
    value ?? ""
  ).trim();
}

export function upper(value) {
  return text(value)
    .toUpperCase();
}