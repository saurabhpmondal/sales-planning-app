// FULL REPLACEMENT FILE
// FILE: js/reports/sjitPlanning.js

import { getSjitPlanningRows } from "../engines/sjitPlanningEngine.js";
import { createTable } from "../components/table.js";

/* -----------------------------------
   SJIT PLANNING REPORT
   - Lazy load
   - Fast render
----------------------------------- */

const PAGE_SIZE = 50;
let page = 1;

export function renderSjitPlanning({
  el,
  state
}) {
  autoApplyRolling30(
    state
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
      title:"SJIT Planning",
      meta:`${visible.length}/${rows.length} styles`,
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

function autoApplyRolling30(
  state
){
  if(
    state.filters
      .startDate &&
    state.filters
      .endDate
  ) return;

  const end =
    new Date();

  const start =
    new Date();

  start.setDate(
    end.getDate()-29
  );

  state.filters
    .startDate =
    iso(start);

  state.filters
    .endDate =
    iso(end);
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