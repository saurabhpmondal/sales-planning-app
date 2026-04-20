// REPLACE FILE
// FILE: js/reports/dayOnDaySale.js

import { buildReportData } from "../engines/reportEngine.js";
import { createTable } from "../components/table.js";

/* -----------------------------------
   DAY ON DAY SALE
   Compact version
----------------------------------- */

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
      data.filtered.sales
    );

  el.className =
    "report-page";

  el.appendChild(
    createTable({
      title:
        "Day on Day Sale",
      meta:
        `${rows.length} styles`,
      columns:
        getCols(),
      rows,
      compact:true,
      minWidth:1800
    })
  );
}

/* ----------------------------------- */

function buildRows(
  sales=[]
) {
  const map={};

  sales.forEach((r)=>{
    const id=
      r.styleId;

    if(!id)return;

    if(!map[id]){
      map[id]={
        styleId:id,
        total:0
      };

      for(
        let i=1;
        i<=31;
        i++
      ){
        map[id][
          "d"+i
        ]=0;
      }
    }

    const qty=
      Number(
        r.qty
      )||0;

    const d=
      Number(
        r.date
      )||0;

    map[id].total+=qty;

    if(
      d>=1 &&
      d<=31
    ){
      map[id][
        "d"+d
      ]+=qty;
    }
  });

  const divisor=
    Math.max(
      new Date()
      .getDate()-1,
      1
    );

  return Object.values(
    map
  )
  .map((r)=>({
    ...r,
    drr:
      r.total/
      divisor
  }))
  .sort(
    (a,b)=>
      b.total-a.total
  );
}

function getCols(){
  const cols=[
    {
      key:"styleId",
      label:"Style ID"
    },
    {
      key:"total",
      label:"MTD",
      format:"number"
    },
    {
      key:"drr",
      label:"DRR",
      format:"number"
    }
  ];

  for(
    let i=1;
    i<=31;
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