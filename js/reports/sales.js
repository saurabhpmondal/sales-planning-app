// REPLACE FILE
// FILE: js/reports/sales.js

import { buildReportData } from "../engines/reportEngine.js";
import { createTable } from "../components/table.js";

/* -----------------------------------
   SALES REPORT
   Compact final version
----------------------------------- */

export function renderSales({
  el,
  state
}) {
  const data =
    buildReportData(
      state.store,
      state.filters
    );

  const rows =
    buildRows(
      data,
      state.store
    );

  el.className =
    "report-page";

  el.appendChild(
    createTable({
      title:
        "Sales Report",
      meta:
        `${rows.length} styles`,
      columns:
        cols(),
      rows,
      compact:true,
      minWidth:2300
    })
  );
}

/* ----------------------------------- */

function buildRows(
  data,
  store
) {
  const ids=
    Object.keys(
      data.maps
        .salesByStyle
    );

  const rows=
    ids.map((id)=>{
      const s=
        data.maps
          .salesByStyle[id]||{};

      const t=
        data.maps
          .trafficByStyle[id]||{};

      const pm=
        store.lookups
          .productByStyle[id]||{};

      const clicks=
        t.clicks||0;

      const units=
        s.netUnits||0;

      return {
        rank:0,
        styleId:id,
        erpSku:
          pm.erpSku||"",
        brand:
          pm.brand||"",
        rating:
          t.rating||0,
        gmv:
          s.netGmv||0,
        units,
        asp:
          s.asp||0,
        ret:
          data.maps
            .returnPercentByStyle[id]||0,
        growth:
          data.maps
            .growthByStyle[id]||0,
        drr:
          data.maps
            .drrByStyle[id]||0,
        sjit:
          data.maps
            .sjitStockByStyle[id]||0,
        sor:
          data.maps
            .sorStockByStyle[id]||0,
        imp:
          t.impressions||0,
        clicks,
        atc:
          t.addToCarts||0,
        ctr:
          t.ctr||0,
        cvr:
          clicks
          ? (units/clicks)*100
          :0
      };
    });

  rows.sort(
    (a,b)=>
      b.units-a.units
  );

  rows.forEach(
    (r,i)=>
      r.rank=i+1
  );

  return rows;
}

function cols(){
  return [
    {key:"rank",label:"#",format:"number"},
    {key:"styleId",label:"Style"},
    {key:"erpSku",label:"SKU"},
    {key:"brand",label:"Brand"},
    {key:"rating",label:"Rate",format:"number"},
    {key:"gmv",label:"GMV",format:"currency"},
    {key:"units",label:"Units",format:"number"},
    {key:"asp",label:"ASP",format:"currency"},
    {key:"ret",label:"Ret%",format:"percent"},
    {key:"growth",label:"Gr%",format:"percent"},
    {key:"drr",label:"DRR",format:"number"},
    {key:"sjit",label:"SJIT",format:"number"},
    {key:"sor",label:"SOR",format:"number"},
    {key:"imp",label:"Imp",format:"number"},
    {key:"clicks",label:"Clk",format:"number"},
    {key:"atc",label:"ATC",format:"number"},
    {key:"ctr",label:"CTR%",format:"percent"},
    {key:"cvr",label:"CVR%",format:"percent"}
  ];
}