// REPLACE FILE
// FILE: js/components/table.js

import { formatCurrency } from "../utils/format.js";

/* -----------------------------------
   REAL TABLE CONTROL FIX
   Modes:
   - card  : dashboard tables auto-fit
   - grid  : large reports scrollable
----------------------------------- */

export function createTable({
  title = "",
  meta = "",
  columns = [],
  rows = [],
  mode = "grid",
  minWidth = ""
} = {}) {
  const box =
    document.createElement("div");

  box.className =
    "table-card";

  box.innerHTML = `
    <div class="table-toolbar">
      <div class="table-title">${title}</div>
      <div class="table-meta">${meta}</div>
    </div>

    <div class="table-scroll ${
      mode === "card"
        ? "table-scroll--card"
        : ""
    }">
      ${
        rows.length
          ? render(
              columns,
              rows,
              mode,
              minWidth
            )
          : `
        <div class="table-empty">
          No data available
        </div>
      `
      }
    </div>
  `;

  injectCss();

  return box;
}

/* ----------------------------------- */

function render(
  cols,
  rows,
  mode,
  minWidth
) {
  return `
    <table
      class="data-table ${
        mode === "card"
          ? "data-table--card"
          : "data-table--grid"
      }"
      ${
        minWidth &&
        mode === "grid"
          ? `style="min-width:${minWidth}px"`
          : ""
      }
    >
      <thead>
        <tr>
          ${cols
            .map(
              (c) => `
            <th style="width:${w(
              c,
              mode
            )}px">
              ${c.label}
            </th>
          `
            )
            .join("")}
        </tr>
      </thead>

      <tbody>
        ${rows
          .map(
            (row) => `
          <tr>
            ${cols
              .map(
                (c) => `
              <td style="width:${w(
                c,
                mode
              )}px">
                ${fmt(
                  row[c.key],
                  c.format
                )}
              </td>
            `
              )
              .join("")}
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

/* -----------------------------------
   WIDTH ENGINE
----------------------------------- */

function w(
  c,
  mode
) {
  const k =
    String(
      c.key || ""
    ).toLowerCase();

  if (
    mode === "card"
  ) {
    if (
      k.includes(
        "brand"
      ) ||
      k.includes(
        "status"
      )
    )
      return 78;

    if (
      k.includes(
        "gmv"
      )
    )
      return 70;

    if (
      k.includes(
        "asp"
      )
    )
      return 56;

    if (
      k.includes(
        "unit"
      ) ||
      k.includes(
        "click"
      ) ||
      k.includes(
        "impr"
      ) ||
      k.includes(
        "atc"
      )
    )
      return 54;

    if (
      k.includes(
        "bucket"
      ) ||
      k.includes(
        "range"
      )
    )
      return 64;

    return 60;
  }

  /* GRID MODE */

  if (
    /^d\d+$/.test(k)
  )
    return 26;

  if (
    k.includes(
      "style"
    )
  )
    return 72;

  if (
    k.includes(
      "sku"
    )
  )
    return 78;

  if (
    k.includes(
      "brand"
    )
  )
    return 74;

  if (
    k.includes(
      "gmv"
    )
  )
    return 74;

  if (
    k.includes(
      "asp"
    )
  )
    return 58;

  if (
    k.includes(
      "unit"
    ) ||
    k.includes(
      "click"
    ) ||
    k.includes(
      "impr"
    ) ||
    k.includes(
      "atc"
    )
  )
    return 54;

  if (
    k.includes(
      "drr"
    ) ||
    k.includes(
      "ctr"
    ) ||
    k.includes(
      "cvr"
    ) ||
    k.includes(
      "ret"
    ) ||
    k.includes(
      "growth"
    )
  )
    return 48;

  if (
    k.includes(
      "rank"
    )
  )
    return 32;

  return 56;
}

/* ----------------------------------- */

function fmt(
  v,
  type
) {
  const n =
    Number(v);

  if (
    type ===
    "currency"
  )
    return formatCurrency(
      n
    );

  if (
    type ===
    "number"
  ) {
    return (
      Number.isNaN(
        n
      )
        ? 0
        : n
    ).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits:1
      }
    );
  }

  if (
    type ===
    "percent"
  ) {
    return `${(
      Number.isNaN(
        n
      )
        ? 0
        : n
    ).toFixed(
      1
    )}%`;
  }

  return String(
    v ?? ""
  );
}

/* ----------------------------------- */

let done=false;

function injectCss() {
  if(done)return;
  done=true;

  const s =
    document.createElement(
      "style"
    );

  s.textContent = `
    .table-card{
      background:#fff;
      border:1px solid #e5e7eb;
      border-radius:14px;
      overflow:hidden;
    }

    .table-toolbar{
      padding:8px 10px;
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
      padding:4px 2px;
      text-align:center;
      border-bottom:1px solid #e5e7eb;
      white-space:nowrap;
      font-weight:800;
    }

    .data-table td{
      padding:4px 2px;
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

  document.head.appendChild(
    s
  );
}