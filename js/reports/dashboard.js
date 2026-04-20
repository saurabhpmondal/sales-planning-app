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

  const { summary, maps } = data;

  const projectedGmv =
    getProjectedGmv(
      summary.netGmv
    );

  el.className =
    "report-page";

  /* KPI */
  el.appendChild(
    createKpiGrid([
      {
        label:"GMV",
        value:summary.netGmv,
        format:"currency",
        icon:"₹"
      },
      {
        label:"Units",
        value:summary.netUnits,
        icon:"📦"
      },
      {
        label:"Return %",
        value:summary.returnPercent,
        format:"percent",
        icon:"↩"
      },
      {
        label:"SJIT Stock",
        value:sum(
          maps.sjitStockByStyle
        ),
        icon:"🚚"
      },
      {
        label:"SOR Stock",
        value:sum(
          maps.sorStockByStyle
        ),
        icon:"🏬"
      },
      {
        label:"Projected GMV",
        value:projectedGmv,
        format:"currency",
        icon:"📈"
      }
    ])
  );

  const grid =
    document.createElement("div");

  grid.className =
    "dash-grid";

  grid.appendChild(
    createDashboardTable({
      title:"Brand Performance",
      columns:[
        {key:"brand",label:"Brand"},
        {key:"gmv",label:"GMV",format:"currency"},
        {key:"units",label:"Units",format:"number"},
        {key:"asp",label:"ASP",format:"currency"}
      ],
      rows:brandRows(
        maps.salesByBrand
      )
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
      rows:poRows(
        maps.salesByPoType
      )
    })
  );

  el.appendChild(grid);

  injectCss();
}

/* ----------------------------------- */

function getProjectedGmv(
  mtd
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
    mtd / elapsed
  ) * total;
}

function brandRows(map={}) {
  return Object.entries(map)
    .map(([k,v])=>({
      brand:k,
      gmv:v.netGmv,
      units:v.netUnits,
      asp:v.asp
    }));
}

function poRows(map={}) {
  return Object.entries(map)
    .map(([k,v])=>({
      po:k,
      gmv:v.netGmv,
      units:v.netUnits,
      asp:v.asp
    }));
}

function sum(map={}) {
  return Object.values(map)
    .reduce((a,b)=>a+(+b||0),0);
}

let done=false;

function injectCss(){
  if(done)return;
  done=true;

  const s=
    document.createElement("style");

  s.textContent=`
    .dash-grid{
      display:grid;
      grid-template-columns:
        repeat(2,minmax(0,1fr));
      gap:12px;
      margin-top:12px;
    }

    @media(max-width:900px){
      .dash-grid{
        grid-template-columns:1fr;
      }
    }
  `;

  document.head.appendChild(s);
}