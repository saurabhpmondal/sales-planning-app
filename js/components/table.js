// REPLACE FILE
// FILE: js/components/table.js

import { formatCurrency } from "../utils/format.js";

/* -----------------------------------
   ULTRA COMPACT WIDTH PASS
----------------------------------- */

export function createTable({
  title = "",
  meta = "",
  columns = [],
  rows = [],
  compact = false,
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

    <div class="table-scroll">
      ${
        rows.length
          ? render(
              columns,
              rows,
              compact,
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
  compact,
  minWidth
) {
  return `
    <table
      class="data-table"
      ${
        minWidth
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
              c
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
                c
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

function w(c) {
  const k =
    String(
      c.key || ""
    ).toLowerCase();

  if (
    /^d\d+$/.test(k)
  )
    return 20;

  if (
    k.includes(
      "style"
    )
  )
    return 58;

  if (
    k.includes(
      "sku"
    )
  )
    return 62;

  if (
    k.includes(
      "brand"
    )
  )
    return 66;

  if (
    k.includes(
      "status"
    )
  )
    return 68;

  if (
    k.includes(
      "bucket"
    ) ||
    k.includes(
      "range"
    )
  )
    return 52;

  if (
    k.includes(
      "gmv"
    )
  )
    return 58;

  if (
    k.includes(
      "asp"
    )
  )
    return 40;

  if (
    k.includes(
      "unit"
    )
  )
    return 36;

  if (
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
    return 36;

  if (
    k.includes(
      "ctr"
    ) ||
    k.includes(
      "cvr"
    ) ||
    k.includes(
      "growth"
    ) ||
    k.includes(
      "drr"
    ) ||
    k.includes(
      "ret"
    )
  )
    return 34;

  if (
    k.includes(
      "rank"
    ) ||
    k === "#"
  )
    return 18;

  return 42;
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
  ) {
    return formatCurrency(
      n
    );
  }

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

let done = false;

function injectCss() {
  if (done) return;
  done = true;

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
      align-items:center;
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

    .data-table{
      width:100%;
      border-collapse:collapse;
      table-layout:fixed;
      font-size:10px;
    }

    .data-table th{
      background:#f8fafc;
      padding:5px 2px;
      text-align:center;
      white-space:nowrap;
      border-bottom:1px solid #e5e7eb;
      font-weight:800;
    }

    .data-table td{
      padding:4px 2px;
      text-align:center;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      border-bottom:1px solid #f1f5f9;
      font-weight:600;
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