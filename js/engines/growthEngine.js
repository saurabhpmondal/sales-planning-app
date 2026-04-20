// FULL REPLACEMENT FILE

/* -----------------------------------
   FINAL GROWTH ENGINE (CLEAN + SAFE)
----------------------------------- */

export function getGrowthPack(
  salesRows = [],
  filters = {}
) {
  const ctx = getContext(filters.month);

  const grouped = groupAll(
    salesRows,
    ctx
  );

  return {
    totalGmvGrowth: calcGrowth(
      grouped.curTotalGmv,
      grouped.prevTotalGmv,
      ctx
    ),

    totalUnitsGrowth: calcGrowth(
      grouped.curTotalUnits,
      grouped.prevTotalUnits,
      ctx
    ),

    brandGrowth: mapGrowth(
      grouped.curBrand,
      grouped.prevBrand,
      ctx
    ),

    styleGrowth: mapGrowth(
      grouped.curStyle,
      grouped.prevStyle,
      ctx
    )
  };
}

/* ----------------------------------- */

function getContext(monthStr="") {
  const months = [
    "JAN","FEB","MAR","APR","MAY","JUN",
    "JUL","AUG","SEP","OCT","NOV","DEC"
  ];

  const [m,y] = monthStr.split(" ");
  let idx = months.indexOf(m);
  let year = +y || new Date().getFullYear();

  if(idx<0){
    idx = new Date().getMonth();
  }

  let prevIdx = idx-1;
  let prevYear = year;

  if(prevIdx<0){
    prevIdx=11;
    prevYear--;
  }

  const today = new Date();

  return {
    curMonth: months[idx],
    curYear: year,
    prevMonth: months[prevIdx],
    prevYear,
    elapsedDays: Math.max(today.getDate()-1,1),
    totalDays: new Date(year, idx+1, 0).getDate()
  };
}

/* ----------------------------------- */

function groupAll(rows,ctx){

  const out = {
    curTotalGmv:0,
    prevTotalGmv:0,
    curTotalUnits:0,
    prevTotalUnits:0,
    curBrand:{},
    prevBrand:{},
    curStyle:{},
    prevStyle:{}
  };

  rows.forEach(r=>{

    const g = +r.finalAmount || 0;
    const u = +r.qty || 0;

    const isCur =
      r.month===ctx.curMonth &&
      +r.year===ctx.curYear;

    const isPrev =
      r.month===ctx.prevMonth &&
      +r.year===ctx.prevYear;

    if(isCur){
      out.curTotalGmv+=g;
      out.curTotalUnits+=u;

      out.curBrand[r.brand] =
        (out.curBrand[r.brand]||0)+g;

      out.curStyle[r.styleId] =
        (out.curStyle[r.styleId]||0)+g;
    }

    if(isPrev){
      out.prevTotalGmv+=g;
      out.prevTotalUnits+=u;

      out.prevBrand[r.brand] =
        (out.prevBrand[r.brand]||0)+g;

      out.prevStyle[r.styleId] =
        (out.prevStyle[r.styleId]||0)+g;
    }

  });

  return out;
}

/* ----------------------------------- */

function calcGrowth(cur,prev,ctx){

  const projected =
    (cur/ctx.elapsedDays)*
    ctx.totalDays;

  if(!prev){
    return projected ? 100 : 0;
  }

  return (
    (projected-prev)/prev
  )*100;
}

function mapGrowth(curMap,prevMap,ctx){

  const keys = new Set([
    ...Object.keys(curMap),
    ...Object.keys(prevMap)
  ]);

  const out = {};

  keys.forEach(k=>{
    out[k] = calcGrowth(
      curMap[k]||0,
      prevMap[k]||0,
      ctx
    );
  });

  return out;
}