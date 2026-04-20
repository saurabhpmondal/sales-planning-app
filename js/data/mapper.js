// FILE: js/data/mapper.js

/* -----------------------------------
   MAP ALL DATASETS ONCE
   Convert raw sheet columns into
   app-safe camelCase objects
----------------------------------- */

export function mapAllDatasets(raw = {}) {
  return {
    saleData: mapSaleData(raw.saleData || []),
    returnData: mapReturnData(raw.returnData || []),
    traffic: mapTraffic(raw.traffic || []),
    sjitStock: mapSjitStock(raw.sjitStock || []),
    sorStock: mapSorStock(raw.sorStock || []),
    sellerStock: mapSellerStock(raw.sellerStock || []),
    productMaster: mapProductMaster(
      raw.productMaster || []
    )
  };
}

/* -----------------------------------
   SALES
----------------------------------- */

function mapSaleData(rows) {
  return rows.map((r) => ({
    sellerId: r["seller id"],
    poType: r["po_type"],
    createdOn: r["created_on"],

    date: r["date"],
    month: r["month"],
    year: r["year"],

    styleId: r["style_id"],
    brand: r["brand"],
    articleType: r["article_type"],

    orderStatus: r["order_status"],
    qty: r["qty"],
    finalAmount: r["final_amount"],
    sellerPrice: r["seller_price"],

    state: r["state"],
    warehouseId: r["warehouse_id"],
    orderLineId: r["order_line_id"]
  }));
}

/* -----------------------------------
   RETURNS
----------------------------------- */

function mapReturnData(rows) {
  return rows.map((r) => ({
    sourceMonth: r["Month"],
    sellerId: r["seller_id"],
    warehouseId: r["warehouse_id"],

    model: r["model"],
    styleId: r["style_id"],

    returnCreatedDate:
      r["return_created_date"],
    refundedDate: r["refunded_date"],
    orderRtoDate: r["order_rto_date"],

    type: r["type"],
    status: r["status"],
    returnReason: r["return_reason"],

    orderLineId: r["order_line_id"],
    finalReturnDate:
      r["final_return_date"],

    date: r["date"],
    month: r["month"],
    year: r["year"]
  }));
}

/* -----------------------------------
   TRAFFIC
----------------------------------- */

function mapTraffic(rows) {
  return rows.map((r) => ({
    startDate: r["start_date"],
    endDate: r["end_date"],

    styleId: r["style_id"],
    sellerId: r["seller_id"],

    articleType: r["article_type"],
    brand: r["brand"],
    gender: r["gender"],

    sellerMrp: r["seller_mrp"],
    inventoryAge: r["inventory_age"],
    rplc: r["rplc"],

    impressions: r["impressions"],
    clicks: r["clicks"],
    addToCarts: r["add_to_carts"],
    purchases: r["purchases"],

    returnPer: r["return_per"],
    considerationPer:
      r["consideration_per"],
    conversionPer:
      r["conversion_per"],

    rating: r["rating"]
  }));
}

/* -----------------------------------
   SJIT STOCK
----------------------------------- */

function mapSjitStock(rows) {
  return rows.map((r) => ({
    sellerId: r["seller_id"],
    warehouseId: r["warehouse_id"],
    warehouseName:
      r["warehouse_name"],

    sellerSkuCode:
      r["seller_sku_code"],
    skuId: r["sku_id"],
    skuCode: r["sku_code"],

    styleId: r["style_id"],

    inventoryCount:
      r["inventory_count"],

    sellableInventoryCount:
      r["sellable_inventory_count"],

    isActive: r["is_active"]
  }));
}

/* -----------------------------------
   SOR STOCK
----------------------------------- */

function mapSorStock(rows) {
  return rows.map((r) => ({
    styleId: r["style_id"],
    brand: r["brand"],
    articleType: r["article_type"],
    skuId: r["sku_id"],
    instockedWhName:
      r["instocked_wh_name"],
    units: r["units"]
  }));
}

/* -----------------------------------
   SELLER STOCK
----------------------------------- */

function mapSellerStock(rows) {
  return rows.map((r) => ({
    erpSku: r["erp_sku"],
    units: r["units"]
  }));
}

/* -----------------------------------
   PRODUCT MASTER
----------------------------------- */

function mapProductMaster(rows) {
  return rows.map((r) => ({
    styleId: r["style_id"],
    launchDate: r["launch_date"],
    liveDate: r["live_date"],

    erpSku: r["erp_sku"],
    brand: r["brand"],
    articleType: r["article_type"],

    status: r["status"],
    mrp: r["mrp"],
    tp: r["tp"]
  }));
}