// FULL REPLACEMENT FILE
// FILE: js/engines/planningCoreEngine.js

/* -----------------------------------
   SHARED PLANNING CORE ENGINE
   Used by:
   - SJIT Planning
   - SOR Planning

   SAFE ADDITIVE MODULE
----------------------------------- */

export function getPlanningRows({
  store,
  filters,
  stockType = "sjit",
  enableZone = false
}) {
  const sales =
    getSalesRows(
      store
    );

  const days =
    getSelectedDays(
      filters
    );

  const grouped =
    groupByStyle(
      sales,
      store,
      days,
      stockType,
      enableZone
    );

  return Object.values(
    grouped
  )
  .map((row)=>
    finalizeRow(
      row,
      days,
      stockType
    )
  )
  .sort(
    (a,b)=>
      b.net-a.net
  );
}

/* ----------------------------------- */

function getSalesRows(
  store
){
  return (
    store?.normalized
      ?.sales ||

    store?.sales ||

    []
  );
}

/* ----------------------------------- */

function getSelectedDays(
  filters={}
){
  const start =
    new Date(
      filters.startDate
    );

  const end =
    new Date(
      filters.endDate
    );

  if(
    isNaN(start) ||
    isNaN(end)
  ){
    return 30;
  }

  const ms =
    end-start;

  const d =
    Math.floor(
      ms /
      86400000
    ) + 1;

  return Math.max(
    d,
    1
  );
}

/* ----------------------------------- */

function groupByStyle(
  rows,
  store,
  days,
  stockType,
  enableZone
){
  const map = {};

  rows.forEach((r)=>{

    const id =
      r.styleId;

    if(!id) return;

    if(!map[id]){

      const p =
        store?.lookups
          ?.productByStyle?.[id] || {};

      map[id] = {
        styleId:id,
        erpSku:
          p.erpSku || "",
        erpStatus:
          p.status || "",
        brand:
          p.brand || "",
        rating:
          +p.rating || 0,

        grossUnits:0,
        returnUnits:0,
        net:0,

        zoneMap:{}
      };
    }

    const q =
      +r.qty || 0;

    map[id].grossUnits += q;

    const ret =
      +r.returnQty || 0;

    map[id].returnUnits += ret;

    const st =
      r.state || "";

    if(
      enableZone &&
      st
    ){
      const zone =
        getZone(st);

      map[id]
        .zoneMap[
          zone
        ] =
        (
          map[id]
            .zoneMap[
              zone
            ] || 0
        ) + q;
    }

  });

  /* attach stock */
  Object.keys(map)
    .forEach((id)=>{

      map[id].stock =
        getStock(
          store,
          id,
          stockType
        );
    });

  return map;
}

/* ----------------------------------- */

function finalizeRow(
  row,
  days,
  stockType
){
  row.net =
    row.grossUnits -
    row.returnUnits;

  row.returnPercent =
    row.grossUnits
    ? (
        row.returnUnits /
        row.grossUnits
      ) * 100
    : 0;

  row.drr =
    row.net / days;

  row.sc =
    row.drr>0
    ? row.stock /
      row.drr
    : 0;

  const recallFlag =
    row.sc > 60 ||
    row.erpStatus !==
      "Continue" ||
    row.rating < 3.5 ||
    row.drr===0;

  const target =
    row.drr * 45;

  row.shipmentQty = 0;
  row.recallQty = 0;

  if(recallFlag){

    row.recallQty =
      Math.max(
        row.stock -
        target,
        0
      );

    if(
      row.drr===0
    ){
      row.recallQty =
        row.stock;
    }

  }else{

    row.shipmentQty =
      Math.max(
        target -
        row.stock,
        0
      );
  }

  row.zone =
    getTopZone(
      row.zoneMap
    );

  row.stockCol =
    stockType==="sjit"
    ? row.stock
    : row.stock;

  return row;
}

/* ----------------------------------- */

function getStock(
  store,
  id,
  type
){
  if(
    type==="sjit"
  ){
    return +(
      store?.maps
        ?.sjitStockByStyle?.[id]
      || 0
    );
  }

  return +(
    store?.maps
      ?.sorStockByStyle?.[id]
    || 0
  );
}

/* ----------------------------------- */

function getTopZone(
  map={}
){
  let top="";
  let max=0;

  Object.entries(map)
    .forEach(
      ([k,v])=>{
        if(v>max){
          max=v;
          top=k;
        }
      }
    );

  return top;
}

/* ----------------------------------- */

function getZone(
  st=""
){
  const Z = {
    UP:"North Zone",
    MH:"West Zone",
    KA:"South Zone",
    DL:"North Zone",
    BR:"East Zone",
    MP:"Central Zone",
    HR:"North Zone",
    TG:"South Zone",
    RJ:"West Zone",
    WB:"East Zone",
    OR:"East Zone",
    JH:"East Zone",
    AP:"South Zone",
    GJ:"West Zone",
    TN:"South Zone",
    UT:"North Zone",
    AS:"East Zone",
    PB:"North Zone",
    CT:"Central Zone",
    KL:"South Zone",
    HP:"North Zone",
    JK:"North Zone",
    GA:"West Zone",
    CH:"North Zone"
  };

  return (
    Z[st] ||
    "Other Zone"
  );
}