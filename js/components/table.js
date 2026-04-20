// REPLACE FILE
// FILE: js/components/table.js

import { formatCurrency } from "../utils/format.js";

/* -----------------------------------
   FINAL WIDTH TUNED ENGINE
----------------------------------- */

export function createTable({
  title="",
  meta="",
  columns=[],
  rows=[],
  mode="grid",
  minWidth=""
}={}){

  const box=document.createElement("div");
  box.className="table-card";

  box.innerHTML=`
    <div class="table-toolbar">
      <div class="table-title">${title}</div>
      <div class="table-meta">${meta}</div>
    </div>

    <div class="table-scroll ${mode==="card"?"table-scroll--card":""}">
      ${
        rows.length
        ? render(columns,rows,mode,minWidth)
        : `<div class="table-empty">No data available</div>`
      }
    </div>
  `;

  injectCss();
  return box;
}

/* ----------------------------------- */

function render(cols,rows,mode,minWidth){
  return `
    <table
      class="data-table ${mode==="card"?"data-table--card":"data-table--grid"}"
      ${mode==="grid" && minWidth ? `style="min-width:${minWidth}px"`:""}
    >
      <thead>
        <tr>
          ${cols.map(c=>`
            <th style="width:${w(c,mode)}px">
              ${c.label}
            </th>
          `).join("")}
        </tr>
      </thead>

      <tbody>
        ${rows.map(r=>`
          <tr>
            ${cols.map(c=>`
              <td style="width:${w(c,mode)}px">
                ${fmt(r[c.key],c.format)}
              </td>
            `).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

/* ----------------------------------- */

function w(c,mode){
  const k=String(c.key||"").toLowerCase();

  /* DASHBOARD */
  if(mode==="card"){

    if(k.includes("brand")) return 44;
    if(k.includes("status")) return 52;
    if(k.includes("bucket")) return 42;
    if(k.includes("range")) return 42;
    if(k.includes("gmv")) return 42;
    if(k.includes("unit")) return 32;
    if(k.includes("asp")) return 34;
    if(k.includes("click")) return 32;
    if(k.includes("impr")) return 38;
    if(k.includes("atc")) return 28;

    return 36;
  }

  /* REPORT GRID */

  if(/^d\d+$/.test(k)) return 22;

  if(k==="#") return 18;
  if(k.includes("style")) return 42;
  if(k.includes("sku")) return 48;
  if(k.includes("brand")) return 42;
  if(k.includes("rate")) return 22;
  if(k.includes("gmv")) return 40;
  if(k.includes("unit")) return 32;
  if(k.includes("asp")) return 32;
  if(k.includes("ret")) return 24;
  if(k.includes("gr")) return 24;
  if(k.includes("drr")) return 22;
  if(k.includes("sjit")) return 26;
  if(k.includes("sor")) return 26;
  if(k.includes("mtd")) return 48;

  return 30;
}

/* ----------------------------------- */

function fmt(v,type){
  const n=Number(v);

  if(type==="currency")
    return formatCurrency(n);

  if(type==="number")
    return (Number.isNaN(n)?0:n)
      .toLocaleString("en-IN",{maximumFractionDigits:1});

  if(type==="percent")
    return `${(Number.isNaN(n)?0:n).toFixed(1)}%`;

  return String(v??"");
}

/* ----------------------------------- */

let done=false;

function injectCss(){
  if(done)return;
  done=true;

  const s=document.createElement("style");

  s.textContent=`
    .table-card{
      background:#fff;
      border:1px solid #e5e7eb;
      border-radius:14px;
      overflow:hidden;
    }

    .table-toolbar{
      padding:7px 10px;
      display:flex;
      justify-content:space-between;
      border-bottom:1px solid #eef2f7;
    }

    .table-title{
      font-size:12px;
      font-weight:800;
    }

    .table-meta{
      font-size:9px;
      color:#64748b;
      font-weight:700;
    }

    .table-scroll{
      overflow:auto;
    }

    .table-scroll--card{
      overflow:hidden;
    }

    .data-table{
      border-collapse:collapse;
      font-size:10px;
    }

    .data-table--grid{
      width:100%;
      table-layout:fixed;
    }

    .data-table--card{
      width:100%;
      table-layout:auto;
    }

    .data-table th{
      background:#f8fafc;
      padding:4px 1px;
      text-align:center;
      border-bottom:1px solid #e5e7eb;
      white-space:nowrap;
      font-weight:800;
    }

    .data-table td{
      padding:3px 1px;
      text-align:center;
      border-bottom:1px solid #f1f5f9;
      white-space:nowrap;
      font-weight:600;
      overflow:hidden;
      text-overflow:ellipsis;
    }

    .data-table tbody tr:nth-child(even){
      background:#fcfcfd;
    }

    .table-empty{
      padding:14px;
      text-align:center;
      color:#64748b;
      font-weight:700;
    }
  `;

  document.head.appendChild(s);
}