// FULL REPLACEMENT FILE
// FILE: js/reports/sjitPlanning.js

import { setFilters } from "../core/state.js";
import { getSjitPlanningRows } from "../engines/sjitPlanningEngine.js";
import { createTable } from "../components/table.js";

/* -----------------------------------
   SJIT PLANNING REPORT
   FIXED:
   - Force rolling 30 filters first
   - Then build rows
   - Lazy load preserved
----------------------------------- */

const PAGE_SIZE = 50;
let page = 1;

export function renderSjitPlanning({
  el,
  state
}) {
  applyRollingWindow(
    state,
    30
  );

  const rows =
    getSjitPlanningRows({
      store:
        state.store,
      filters:
        state.filters
    });

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
      title:
        "SJIT Planning",
      meta:
        `${visible.length}/${rows.length} styles`,
      mode:"grid",
      minWidth:1800,
      columns:cols(),
      rows:visible
    })
  );

  if(
    visible.length <
    rows.length
  ){
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
        renderSjitPlanning({
          el,
          state
        });
      };

    el.appendChild(btn);
  }

  injectCss();
}

/* ----------------------------------- */

function applyRollingWindow(
  state,
  days
){
  const end =
    new Date();

  const start =
    new Date();

  start.setDate(
    end.getDate() -
    (days - 1)
  );

  const next = {
    month:"ALL",
    startDate:
      iso(start),
    endDate:
      iso(end)
  };

  setFilters(next);

  state.filters =
    {
      ...state.filters,
      ...next
    };
}

function iso(d){
  return d
    .toISOString()
    .slice(0,10);
}

/* ----------------------------------- */

function cols(){
  return [
    {key:"styleId",label:"Style"},
    {key:"erpSku",label:"ERP SKU"},
    {key:"erpStatus",label:"ERP Status"},
    {key:"brand",label:"Brand"},
    {key:"rating",label:"Rating",format:"number"},
    {key:"grossUnits",label:"Gross",format:"number"},
    {key:"returnUnits",label:"Return",format:"number"},
    {key:"net",label:"Net",format:"number"},
    {key:"returnPercent",label:"Ret%",format:"percent"},
    {key:"zone",label:"Zone"},
    {key:"drr",label:"DRR",format:"number"},
    {key:"stockCol",label:"SJIT Stock",format:"number"},
    {key:"sc",label:"SC",format:"number"},
    {key:"shipmentQty",label:"Shipment",format:"number"},
    {key:"recallQty",label:"Recall",format:"number"}
  ];
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

  s.textContent = `
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