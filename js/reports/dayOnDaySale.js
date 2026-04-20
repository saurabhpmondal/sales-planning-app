// REPLACE FILE
// FILE: js/reports/dayOnDaySale.js

import { buildReportData } from "../engines/reportEngine.js";
import { createTable } from "../components/table.js";

/* -----------------------------------
   DAY ON DAY SALE
   - Lazy load 50
   - ERP SKU
   - ERP Status
   - Color logic columns
----------------------------------- */

const PAGE_SIZE = 50;
let page = 1;

export function renderDayOnDaySale({
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
      data.filtered.sales,
      state.store
    );

  const shown =
    rows.slice(
      0,
      PAGE_SIZE * page
    );

  const maxDay =
    getVisibleDay();

  el.className =
    "report-page";

  el.innerHTML = "";

  el.appendChild(
    createTable({
      title:"Day on Day Sale",
      meta:`${shown.length}/${rows.length} styles`,
      mode:"grid",
      minWidth:
        650 + maxDay*32,
      columns:getCols(maxDay),
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
      ()=>{
        page++;
        renderDayOnDaySale({
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
  sales,
  store
) {
  const maxDay =
    getVisibleDay();

  const map = {};

  sales.forEach(r=>{
    const id =
      r.styleId;

    if(!id)return;

    const p =
      store.lookups
        .productByStyle[id] || {};

    if(!map[id]){
      map[id]={
        styleId:id,
        erpSku:
          p.erpSku || "",
        status:
          p.status || "",
        mtd:0
      };

      for(
        let i=1;
        i<=maxDay;
        i++
      ){
        map[id]["d"+i]=0;
      }
    }

    const q =
      +r.qty || 0;

    const d =
      +r.date || 0;

    map[id].mtd += q;

    if(
      d>=1 &&
      d<=maxDay
    ){
      map[id]["d"+d]+=q;
    }
  });

  const div =
    Math.max(
      new Date()
      .getDate()-1,
      1
    );

  return Object.values(map)
    .map(r=>({
      ...r,
      drr:r.mtd/div
    }))
    .sort(
      (a,b)=>
        b.mtd-a.mtd
    );
}

function getCols(
  maxDay
){
  const cols = [
    {key:"styleId",label:"Style"},
    {key:"erpSku",label:"SKU"},
    {key:"status",label:"Status"},
    {key:"mtd",label:"MTD",format:"number"},
    {key:"drr",label:"DRR",format:"number"}
  ];

  for(
    let i=1;
    i<=maxDay;
    i++
  ){
    cols.push({
      key:"d"+i,
      label:String(i),
      format:"number"
    });
  }

  return cols;
}

function getVisibleDay(){
  return Math.max(
    new Date()
      .getDate()-1,
    1
  );
}

let done=false;

function injectCss(){
  if(done)return;
  done=true;

  const s=
    document.createElement(
      "style"
    );

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