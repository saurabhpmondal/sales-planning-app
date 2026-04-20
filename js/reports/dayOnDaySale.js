// FULL REPLACEMENT FILE
// FILE: js/reports/dayOnDaySale.js

import { buildReportData } from "../engines/reportEngine.js";
import { createTable } from "../components/table.js";

/* -----------------------------------
   DAY ON DAY SALE
   FINAL MERGED VERSION
   - ERP SKU restored
   - ERP Status restored
   - Lazy Load kept
   - Current month till yesterday
   - Past month full days
----------------------------------- */

const PAGE_SIZE = 50;
let page = 1;

/* ----------------------------------- */

export function renderDayOnDaySale({
  el,
  state
}) {
  const data =
    buildReportData(
      state.store,
      state.filters
    );

  const monthStr =
    state.filters.month || "";

  const maxDay =
    getVisibleDay(
      monthStr
    );

  const rows =
    buildRows(
      data.filtered.sales || [],
      state.store,
      maxDay,
      monthStr
    );

  const visible =
    rows.slice(
      0,
      PAGE_SIZE * page
    );

  el.className =
    "report-page";

  el.innerHTML = "";

  el.appendChild(
    createTable({
      title:"Day on Day Sale",
      meta:`${visible.length}/${rows.length} styles`,
      mode:"grid",
      minWidth:
        980 + (maxDay * 24),
      columns:
        getColumns(maxDay),
      rows:visible
    })
  );

  if (
    visible.length <
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
  store,
  maxDay,
  monthStr
) {
  const map = {};

  sales.forEach((r)=>{

    const id =
      r.styleId;

    if(!id) return;

    const p =
      store.lookups
        ?.productByStyle?.[id] || {};

    if(!map[id]){

      map[id] = {
        styleId:id,
        erpSku:
          p.erpSku || "",

        erpStatus:
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

    const qty =
      +r.qty || 0;

    const d =
      +r.date || 0;

    map[id].mtd += qty;

    if(
      d>=1 &&
      d<=maxDay
    ){
      map[id]["d"+d]+=qty;
    }

  });

  const div =
    isCurrentMonth(
      monthStr
    )
    ? Math.max(
        new Date()
          .getDate()-1,
        1
      )
    : maxDay;

  return Object.values(map)
    .map((r)=>({
      ...r,
      drr:
        r.mtd/div
    }))
    .sort(
      (a,b)=>
        b.mtd-a.mtd
    );
}

/* ----------------------------------- */

function getColumns(
  maxDay
){
  const cols = [

    {key:"styleId",label:"Style"},
    {key:"erpSku",label:"ERP SKU"},
    {key:"erpStatus",label:"ERP Status"},

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

/* ----------------------------------- */

function getVisibleDay(
  monthStr=""
){
  if(
    isCurrentMonth(
      monthStr
    )
  ){
    return Math.max(
      new Date()
        .getDate()-1,
      1
    );
  }

  return getMonthDays(
    monthStr
  );
}

function isCurrentMonth(
  monthStr=""
){
  const d =
    new Date();

  const names = [
    "JAN","FEB","MAR","APR","MAY","JUN",
    "JUL","AUG","SEP","OCT","NOV","DEC"
  ];

  const cur =
    names[d.getMonth()] +
    " " +
    d.getFullYear();

  return monthStr===cur;
}

function getMonthDays(
  monthStr=""
){
  const p =
    monthStr.split(" ");

  const mon =
    p[0];

  const year =
    +p[1] ||
    new Date()
      .getFullYear();

  const idx = {
    JAN:0,FEB:1,MAR:2,APR:3,MAY:4,JUN:5,
    JUL:6,AUG:7,SEP:8,OCT:9,NOV:10,DEC:11
  }[mon];

  if(
    idx===undefined
  ) return 31;

  return new Date(
    year,
    idx+1,
    0
  ).getDate();
}

/* ----------------------------------- */

let done=false;

function injectCss(){
  if(done)return;
  done=true;

  const s =
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