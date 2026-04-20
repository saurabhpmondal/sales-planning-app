// REPLACE FILE
// FILE: js/reports/dashboard.js

import { buildReportData } from "../engines/reportEngine.js";
import { createKpiGrid } from "../components/kpiCards.js";
import { createTable } from "../components/table.js";

/* -----------------------------------
   DASHBOARD
   Exact business tables
----------------------------------- */

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
      {
        label:"GMV",
        value:
          summary.netGmv,
        format:
          "currency",
        icon:"₹"
      },
      {
        label:"Units",
        value:
          summary.netUnits,
        icon:"📦"
      },
      {
        label:"Return %",
        value:
          summary.returnPercent,
        format:
          "percent",
        icon:"↩"
      },
      {
        label:"SJIT Stock",
        value:
          sumMap(
            maps.sjitStockByStyle
          ),
        icon:"🚚"
      },
      {
        label:"SOR Stock",
        value:
          sumMap(
            maps.sorStockByStyle
          ),
        icon:"🏬"
      },
      {
        label:"Growth %",
        value:
          avgMap(
            maps.growthByStyle
          ),
        format:
          "percent",
        icon:"📈"
      }
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
      title:
        "Brand Performance",
      columns:[
        {key:"brand",label:"Brand"},
        {key:"gmv",label:"GMV",format:"currency"},
        {key:"units",label:"Units",format:"number"},
        {key:"asp",label:"ASP",format:"currency"}
      ],
      rows:
        brandRows(
          maps.salesByBrand
        ),
      compact:true
    })
  );

  grid.appendChild(
    createTable({
      title:
        "PO Type Analysis",
      columns:[
        {key:"po",label:"PO Type"},
        {key:"gmv",label:"GMV",format:"currency"},
        {key:"units",label:"Units",format:"number"},
        {key:"asp",label:"ASP",format:"currency"}
      ],
      rows:
        poRows(
          maps.salesByPoType
        ),
      compact:true
    })
  );

  grid.appendChild(
    createTable({
      title:
        "Price Range Analysis",
      columns:[
        {key:"bucket",label:"Price Range"},
        {key:"units",label:"Units",format:"number"},
        {key:"brand",label:"Top Brand"}
      ],
      rows:
        priceRows(
          maps.salesByStyle,
          state.store
        ),
      compact:true
    })
  );

  grid.appendChild(
    createTable({
      title:
        "ERP Status Analysis",
      columns:[
        {key:"status",label:"ERP Status"},
        {key:"gmv",label:"GMV",format:"currency"},
        {key:"units",label:"Units",format:"number"},
        {key:"asp",label:"ASP",format:"currency"}
      ],
      rows:
        erpRows(
          maps,
          state.store
        ),
      compact:true
    })
  );

  grid.appendChild(
    createTable({
      title:
        "Stock Cover Analysis",
      columns:[
        {key:"bucket",label:"Bucket"},
        {key:"sjit",label:"SJIT Units",format:"number"},
        {key:"sor",label:"SOR Units",format:"number"}
      ],
      rows:
        stockRows(
          maps
        ),
      compact:true
    })
  );

  grid.appendChild(
    createTable({
      title:
        "Traffic Analysis",
      columns:[
        {key:"brand",label:"Brand"},
        {key:"impressions",label:"Impr.",format:"number"},
        {key:"clicks",label:"Clicks",format:"number"},
        {key:"atc",label:"ATC",format:"number"}
      ],
      rows:
        trafficRows(
          maps.trafficByBrand
        ),
      compact:true
    })
  );

  el.appendChild(
    grid
  );

  injectCss();
}

/* ----------------------------------- */

function brandRows(map={}) {
  return Object.entries(map)
    .map(([k,v])=>({
      brand:k,
      gmv:v.netGmv,
      units:v.netUnits,
      asp:v.asp
    }))
    .sort((a,b)=>b.units-a.units);
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

function priceRows(map={},store) {
  const buckets = [
    [0,300,"0-300"],
    [301,600,"301-600"],
    [601,800,"601-800"],
    [801,1000,"801-1000"],
    [1001,1500,"1001-1500"],
    [1501,2000,"1501-2000"],
    [2001,999999,">2000"]
  ];

  return buckets.map(
    ([a,b,name])=>{
      let units=0;
      const brand={};

      Object.entries(map)
      .forEach(([id,v])=>{
        const asp=
          Number(v.asp)||0;

        if(
          asp>=a &&
          asp<=b
        ){
          units+=
            v.netUnits;

          const br=
            store.lookups
              .productByStyle[id]
              ?.brand ||
            "NA";

          brand[br]=
            (brand[br]||0)+
            v.netUnits;
        }
      });

      const top =
        Object.entries(brand)
        .sort((x,y)=>
          y[1]-x[1]
        )[0]?.[0] || "";

      return {
        bucket:name,
        units,
        brand:top
      };
    }
  );
}

function erpRows(maps,store){
  const out={};

  Object.entries(
    maps.salesByStyle
  ).forEach(([id,v])=>{
    const st=
      store.lookups
        .productByStyle[id]
        ?.status ||
      "Blank";

    if(!out[st]){
      out[st]={
        gmv:0,
        units:0
      };
    }

    out[st].gmv+=
      v.netGmv;

    out[st].units+=
      v.netUnits;
  });

  return Object.entries(out)
    .map(([k,v])=>({
      status:k,
      gmv:v.gmv,
      units:v.units,
      asp:
        v.units
        ? v.gmv/v.units
        :0
    }));
}

function stockRows(maps){
  const ranges=[
    [0,30,"0-30"],
    [31,45,"31-45"],
    [46,60,"46-60"],
    [61,90,"61-90"],
    [91,120,"91-120"],
    [121,99999,">120"]
  ];

  const out=
    ranges.map(r=>({
      bucket:r[2],
      sjit:0,
      sor:0
    }));

  Object.keys(
    maps.salesByStyle
  ).forEach((id)=>{
    const drr=
      maps.drrByStyle[id]||1;

    const sj=
      maps.sjitStockByStyle[id]||0;

    const so=
      maps.sorStockByStyle[id]||0;

    const sc=
      (sj+so)/drr;

    const idx=
      ranges.findIndex(
        r=>
          sc>=r[0] &&
          sc<=r[1]
      );

    if(idx>-1){
      out[idx].sjit+=sj;
      out[idx].sor+=so;
    }
  });

  return out;
}

function trafficRows(map={}){
  return Object.entries(map)
    .map(([k,v])=>({
      brand:k,
      impressions:
        v.impressions,
      clicks:v.clicks,
      atc:
        v.addToCarts
    }))
    .sort((a,b)=>
      b.clicks-a.clicks
    );
}

function sumMap(map={}){
  return Object.values(map)
    .reduce((a,b)=>
      a+(+b||0),0);
}

function avgMap(map={}){
  const x=
    Object.values(map);

  return x.length
    ? x.reduce((a,b)=>
        a+(+b||0),0
      )/x.length
    :0;
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