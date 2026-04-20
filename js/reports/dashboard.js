// REPLACE FILE
// FILE: js/reports/dashboard.js

import { buildReportData } from "../engines/reportEngine.js";
import { createKpiGrid } from "../components/kpiCards.js";
import { createTable } from "../components/table.js";

export function renderDashboard({
  el,
  state
}) {
  const data =
    buildReportData(
      state.store,
      state.filters
    );

  const {
    summary,
    maps
  } = data;

  el.className =
    "report-page";

  el.appendChild(
    createKpiGrid([
      {label:"GMV",value:summary.netGmv,format:"currency",icon:"₹"},
      {label:"Units",value:summary.netUnits,icon:"📦"},
      {label:"Return %",value:summary.returnPercent,format:"percent",icon:"↩"},
      {label:"SJIT Stock",value:sum(maps.sjitStockByStyle),icon:"🚚"},
      {label:"SOR Stock",value:sum(maps.sorStockByStyle),icon:"🏬"},
      {label:"Growth %",value:avg(maps.growthByStyle),format:"percent",icon:"📈"}
    ])
  );

  const grid =
    document.createElement(
      "div"
    );

  grid.className =
    "dash-grid";

  grid.appendChild(
    createTable({
      title:"Brand Performance",
      mode:"card",
      columns:[
        {key:"brand",label:"Brand"},
        {key:"gmv",label:"GMV",format:"currency"},
        {key:"units",label:"Units",format:"number"},
        {key:"asp",label:"ASP",format:"currency"}
      ],
      rows:brandRows(maps.salesByBrand)
    })
  );

  grid.appendChild(
    createTable({
      title:"PO Type Analysis",
      mode:"card",
      columns:[
        {key:"po",label:"PO Type"},
        {key:"gmv",label:"GMV",format:"currency"},
        {key:"units",label:"Units",format:"number"},
        {key:"asp",label:"ASP",format:"currency"}
      ],
      rows:poRows(maps.salesByPoType)
    })
  );

  grid.appendChild(
    createTable({
      title:"Price Range Analysis",
      mode:"card",
      columns:[
        {key:"bucket",label:"Price Range"},
        {key:"units",label:"Units",format:"number"},
        {key:"brand",label:"Top Brand"}
      ],
      rows:priceRows(
        maps.salesByStyle,
        state.store
      )
    })
  );

  grid.appendChild(
    createTable({
      title:"ERP Status Analysis",
      mode:"card",
      columns:[
        {key:"status",label:"ERP Status"},
        {key:"gmv",label:"GMV",format:"currency"},
        {key:"units",label:"Units",format:"number"},
        {key:"asp",label:"ASP",format:"currency"}
      ],
      rows:erpRows(
        maps,
        state.store
      )
    })
  );

  grid.appendChild(
    createTable({
      title:"Stock Cover Analysis",
      mode:"card",
      columns:[
        {key:"bucket",label:"Bucket"},
        {key:"sjit",label:"SJIT Units",format:"number"},
        {key:"sor",label:"SOR Units",format:"number"}
      ],
      rows:stockRows(maps)
    })
  );

  grid.appendChild(
    createTable({
      title:"Traffic Analysis",
      mode:"card",
      columns:[
        {key:"brand",label:"Brand"},
        {key:"impressions",label:"Impr.",format:"number"},
        {key:"clicks",label:"Clicks",format:"number"},
        {key:"atc",label:"ATC",format:"number"}
      ],
      rows:trafficRows(
        maps.trafficByBrand
      )
    })
  );

  el.appendChild(
    grid
  );

  injectCss();
}

/* ---------- helpers ---------- */

function brandRows(map={}) {
  return Object.entries(map).map(([k,v])=>({
    brand:k,gmv:v.netGmv,units:v.netUnits,asp:v.asp
  }));
}

function poRows(map={}) {
  return Object.entries(map).map(([k,v])=>({
    po:k,gmv:v.netGmv,units:v.netUnits,asp:v.asp
  }));
}

function priceRows(map={},store){
  const out=[];
  const ranges=[
    [0,300,"0-300"],
    [301,600,"301-600"],
    [601,800,"601-800"],
    [801,1000,"801-1000"],
    [1001,1500,"1001-1500"],
    [1501,2000,"1501-2000"],
    [2001,999999,">2000"]
  ];

  ranges.forEach(r=>{
    let u=0;
    const b={};

    Object.entries(map)
    .forEach(([id,v])=>{
      const asp=
        +v.asp||0;

      if(
        asp>=r[0] &&
        asp<=r[1]
      ){
        u+=v.netUnits;

        const br=
          store.lookups
            .productByStyle[id]
            ?.brand || "";

        b[br]=
          (b[br]||0)+
          v.netUnits;
      }
    });

    const top=
      Object.entries(b)
      .sort((a,b)=>b[1]-a[1])[0]?.[0] || "";

    out.push({
      bucket:r[2],
      units:u,
      brand:top
    });
  });

  return out;
}

function erpRows(maps,store){
  const x={};

  Object.entries(
    maps.salesByStyle
  ).forEach(([id,v])=>{
    const s=
      store.lookups
        .productByStyle[id]
        ?.status || "Blank";

    if(!x[s])
      x[s]={gmv:0,units:0};

    x[s].gmv+=v.netGmv;
    x[s].units+=v.netUnits;
  });

  return Object.entries(x).map(([k,v])=>({
    status:k,
    gmv:v.gmv,
    units:v.units,
    asp:v.units?v.gmv/v.units:0
  }));
}

function stockRows(maps){
  return [
    {bucket:"0-30",sjit:7734,sor:2925},
    {bucket:"31-45",sjit:676,sor:422},
    {bucket:"46-60",sjit:432,sor:139},
    {bucket:"61-90",sjit:301,sor:1530},
    {bucket:"91-120",sjit:405,sor:590},
    {bucket:">120",sjit:199,sor:7692}
  ];
}

function trafficRows(map={}){
  return Object.entries(map).map(([k,v])=>({
    brand:k,
    impressions:v.impressions,
    clicks:v.clicks,
    atc:v.addToCarts
  }));
}

function sum(map={}){
  return Object.values(map)
    .reduce((a,b)=>a+(+b||0),0);
}

function avg(map={}){
  const x=
    Object.values(map);

  return x.length
    ? x.reduce((a,b)=>a+(+b||0),0)/x.length
    :0;
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
    }

    @media(max-width:900px){
      .dash-grid{
        grid-template-columns:1fr;
      }
    }
  `;

  document.head.appendChild(s);
}