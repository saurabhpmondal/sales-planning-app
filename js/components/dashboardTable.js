// NEW FILE
// FILE: js/components/dashboardTable.js

import { formatCurrency } from "../utils/format.js";

/* -----------------------------------
   DASHBOARD ONLY TABLE
   Clean fit layout
----------------------------------- */

export function createDashboardTable({
  title="",
  columns=[],
  rows=[]
}={}){

  const box=document.createElement("div");
  box.className="dash-table-card";

  box.innerHTML=`
    <div class="dash-table-head">
      ${title}
    </div>

    <table class="dash-table">
      <thead>
        <tr>
          ${columns.map(c=>`
            <th>${c.label}</th>
          `).join("")}
        </tr>
      </thead>

      <tbody>
        ${rows.map(r=>`
          <tr>
            ${columns.map(c=>`
              <td>${fmt(r[c.key],c.format)}</td>
            `).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

  injectCss();
  return box;
}

/* ----------------------------------- */

function fmt(v,type){
  const n=Number(v);

  if(type==="currency")
    return formatCurrency(n);

  if(type==="number")
    return (Number.isNaN(n)?0:n)
      .toLocaleString("en-IN");

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
    .dash-table-card{
      background:#fff;
      border:1px solid #e5e7eb;
      border-radius:14px;
      overflow:hidden;
    }

    .dash-table-head{
      padding:10px 12px;
      border-bottom:1px solid #eef2f7;
      font-size:12px;
      font-weight:800;
    }

    .dash-table{
      width:100%;
      border-collapse:collapse;
      table-layout:auto;
      font-size:11px;
    }

    .dash-table th{
      background:#f8fafc;
      padding:6px 8px;
      text-align:center;
      font-weight:800;
      white-space:nowrap;
      border-bottom:1px solid #e5e7eb;
    }

    .dash-table td{
      padding:6px 8px;
      text-align:center;
      white-space:nowrap;
      border-bottom:1px solid #f1f5f9;
      font-weight:600;
    }

    .dash-table tbody tr:nth-child(even){
      background:#fcfcfd;
    }
  `;

  document.head.appendChild(s);
}