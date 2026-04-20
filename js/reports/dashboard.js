// REPLACE FILE
// FILE: js/reports/dashboard.js

import { buildReportData } from "../engines/reportEngine.js";
import { createKpiGrid } from "../components/kpiCards.js";
import { createDashboardTable } from "../components/dashboardTable.js";

export function renderDashboard({ el, state }) {

  const data = buildReportData(
    state.store,
    state.filters
  );

  const {
    summary,
    filtered
  } = data;

  const sales = filtered.sales || [];

  el.className = "report-page";

  /* KPI */
  el.appendChild(
    createKpiGrid([
      { label:"GMV", value:summary.netGmv, format:"currency", icon:"₹" },
      { label:"Units", value:summary.netUnits, icon:"📦" },
      { label:"Return %", value:summary.returnPercent, format:"percent", icon:"↩" },
      { label:"SJIT Stock", value:summary.sjitStock, icon:"🚚" },
      { label:"SOR Stock", value:summary.sorStock, icon:"🏬" },
      { label:"Growth %", value:summary.growthPercent, format:"percent", icon:"📈" }
    ])
  );

  const grid = document.createElement("div");
  grid.className = "dash-grid";

  /* Build fresh aggregations from FILTERED data */

  const brandMap = {};
  const poMap = {};
  const styleMap = {};

  sales.forEach(r => {
    const g = +r.finalAmount || 0;
    const u = +r.qty || 0;

    /* BRAND */
    if (!brandMap[r.brand]) {
      brandMap[r.brand] = { gmv:0, units:0 };
    }
    brandMap[r.brand].gmv += g;
    brandMap[r.brand].units += u;

    /* PO */
    if (!poMap[r.poType]) {
      poMap[r.poType] = { gmv:0, units:0 };
    }
    poMap[r.poType].gmv += g;
    poMap[r.poType].units += u;

    /* STYLE */
    if (!styleMap[r.styleId]) {
      styleMap[r.styleId] = {
        gmv:0,
        units:0,
        brand:r.brand,
        status:r.erpStatus,
        asp:0
      };
    }

    styleMap[r.styleId].gmv += g;
    styleMap[r.styleId].units += u;
  });

  /* ASP calc */
  Object.values(styleMap).forEach(v=>{
    v.asp = v.units ? v.gmv / v.units : 0;
  });

  /* -------- TABLES -------- */

  grid.appendChild(
    createDashboardTable({
      title:"Brand Performance",
      columns:[
        {key:"brand",label:"Brand"},
        {key:"gmv",label:"GMV",format:"currency"},
        {key:"units",label:"Units",format:"number"},
        {key:"asp",label:"ASP",format:"currency"}
      ],
      rows:Object.entries(brandMap).map(([k,v])=>({
        brand:k,
        gmv:v.gmv,
        units:v.units,
        asp:v.units ? v.gmv/v.units : 0
      }))
    })
  );

  grid.appendChild(
    createDashboardTable({
      title:"PO Type Analysis",
      columns:[
        {key:"po",label:"PO Type"},
        {key:"gmv",label:"GMV",format:"currency"},
        {key:"units",label:"Units",format:"number"},
        {key:"asp",label:"ASP",format:"currency"}
      ],
      rows:Object.entries(poMap).map(([k,v])=>({
        po:k,
        gmv:v.gmv,
        units:v.units,
        asp:v.units ? v.gmv/v.units : 0
      }))
    })
  );

  grid.appendChild(
    createDashboardTable({
      title:"Price Range Analysis",
      columns:[
        {key:"bucket",label:"Price Range"},
        {key:"units",label:"Units",format:"number"},
        {key:"brand",label:"Top Brand"}
      ],
      rows:priceRows(styleMap)
    })
  );

  grid.appendChild(
    createDashboardTable({
      title:"ERP Status Analysis",
      columns:[
        {key:"status",label:"ERP Status"},
        {key:"gmv",label:"GMV",format:"currency"},
        {key:"units",label:"Units",format:"number"},
        {key:"asp",label:"ASP",format:"currency"}
      ],
      rows:erpRows(styleMap)
    })
  );

  grid.appendChild(
    createDashboardTable({
      title:"Stock Cover Analysis",
      columns:[
        {key:"bucket",label:"Bucket"},
        {key:"sjit",label:"SJIT Units",format:"number"},
        {key:"sor",label:"SOR Units",format:"number"}
      ],
      rows:summary.stockBuckets || []
    })
  );

  grid.appendChild(
    createDashboardTable({
      title:"Traffic Analysis",
      columns:[
        {key:"brand",label:"Brand"},
        {key:"impressions",label:"Impr.",format:"number"},
        {key:"clicks",label:"Clicks",format:"number"},
        {key:"atc",label:"ATC",format:"number"}
      ],
      rows:summary.traffic || []
    })
  );

  el.appendChild(grid);

  injectCss();
}

/* ---------- helpers ---------- */

function priceRows(styleMap){
  const buckets = [
    [0,300,"0-300"],
    [301,600,"301-600"],
    [601,800,"601-800"],
    [801,1000,"801-1000"],
    [1001,1500,"1001-1500"],
    [1501,2000,"1501-2000"],
    [2001,999999,">2000"]
  ];

  return buckets.map(b=>{
    let units=0;
    const brandMap={};

    Object.values(styleMap).forEach(v=>{
      if(v.asp>=b[0] && v.asp<=b[1]){
        units+=v.units;
        brandMap[v.brand]=(brandMap[v.brand]||0)+v.units;
      }
    });

    const top =
      Object.entries(brandMap)
        .sort((a,b)=>b[1]-a[1])[0]?.[0] || "";

    return { bucket:b[2], units, brand:top };
  });
}

function erpRows(styleMap){
  const map={};

  Object.values(styleMap).forEach(v=>{
    const s=v.status || "Blank";

    if(!map[s]) map[s]={gmv:0,units:0};

    map[s].gmv+=v.gmv;
    map[s].units+=v.units;
  });

  return Object.entries(map).map(([k,v])=>({
    status:k,
    gmv:v.gmv,
    units:v.units,
    asp:v.units ? v.gmv/v.units : 0
  }));
}

/* CSS same */

let done=false;
function injectCss(){
  if(done)return;
  done=true;

  const s=document.createElement("style");
  s.textContent=`
    .dash-grid{
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:12px;
    }
    @media(max-width:900px){
      .dash-grid{grid-template-columns:1fr;}
    }
  `;
  document.head.appendChild(s);
}