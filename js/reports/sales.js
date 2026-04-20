// REPLACE FILE
// FILE: js/reports/sales.js

import { buildReportData } from "../engines/reportEngine.js";
import { createTable } from "../components/table.js";

/* -----------------------------------
   SALES REPORT
   - Growth removed
   - Projected GMV added
   - Lazy load 50 rows
----------------------------------- */

const PAGE_SIZE = 50;
let page = 1;

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

  const shown =
    rows.slice(
      0,
      PAGE_SIZE * page
    );

  el.className =
    "report-page";

  el.innerHTML = "";

  el.appendChild(
    createTable({
      title:"Sales Report",
      meta:`${shown.length}/${rows.length} styles`,
      mode:"grid",
      minWidth:2200,
      columns:cols(),
      rows:shown
    })
  );

  if (
    shown.length <
    rows.length
  ) {
    const btn =
      document.createElement(
        "button"
      );

    btn.className =
      "load-more-btn";

    btn.textContent =
      "Load More";

    btn.onclick =
      () => {
        page++;
        renderSales({
          el,
          state
        });
      };

    el.appendChild(btn);
  }

  injectCss();
}

/* ----------------------------------- */

function buildRows(
  data,
  store
) {
  const ids =
    Object.keys(
      data.maps
        .salesByStyle
    );

  return ids
    .map((id)=>{
      const s =
        data.maps
          .salesByStyle[id] || {};

      const t =
        data.maps
          .trafficByStyle[id] || {};

      const p =
        store.lookups
          .productByStyle[id] || {};

      const units =
        s.netUnits || 0;

      const gmv =
        s.netGmv || 0;

      const proj =
        projected(gmv);

      const clicks =
        t.clicks || 0;

      return {
        rank:0,
        styleId:id,
        erpSku:p.erpSku || "",
        brand:p.brand || "",
        rating:t.rating || 0,
        gmv,
        proj,
        units,
        asp:s.asp || 0,
        ret:
          data.maps
            .returnPercentByStyle[id] || 0,
        drr:
          data.maps
            .drrByStyle[id] || 0,
        sjit:
          data.maps
            .sjitStockByStyle[id] || 0,
        sor:
          data.maps
            .sorStockByStyle[id] || 0,
        imp:
          t.impressions || 0,
        clicks,
        atc:
          t.addToCarts || 0,
        ctr:
          t.ctr || 0,
        cvr:
          clicks
            ? (units/clicks)*100
            : 0
      };
    })
    .sort(
      (a,b)=>
        b.units-a.units
    )
    .map((r,i)=>({
      ...r,
      rank:i+1
    }));
}

function projected(
  gmv
) {
  const now =
    new Date();

  const elapsed =
    Math.max(
      now.getDate()-1,
      1
    );

  const total =
    new Date(
      now.getFullYear(),
      now.getMonth()+1,
      0
    ).getDate();

  return (
    gmv/elapsed
  )*total;
}

function cols(){
  return [
    {key:"rank",label:"#",format:"number"},
    {key:"styleId",label:"Style"},
    {key:"erpSku",label:"SKU"},
    {key:"brand",label:"Brand"},
    {key:"rating",label:"Rate",format:"number"},
    {key:"gmv",label:"GMV",format:"currency"},
    {key:"proj",label:"Proj GMV",format:"currency"},
    {key:"units",label:"Units",format:"number"},
    {key:"asp",label:"ASP",format:"currency"},
    {key:"ret",label:"Ret%",format:"percent"},
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

let done=false;

function injectCss(){
  if(done)return;
  done=true;

  const s=
    document.createElement("style");

  s.textContent=`
    .load-more-btn{
      margin:12px auto;
      display:block;
      padding:10px 18px;
      border:none;
      border-radius:10px;
      font-weight:700;
      cursor:pointer;
    }
  `;

  document.head.appendChild(s);
}