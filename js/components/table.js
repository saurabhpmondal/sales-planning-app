// REPLACE FILE
// FILE: js/components/table.js

import { formatCurrency } from "../utils/format.js";

/* -----------------------------------
   COMPACT TABLE UI
   Less padding / less scroll
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
    document.createElement(
      "div"
    );

  box.className =
    "table-card";

  box.innerHTML = `
    <div class="table-toolbar">
      <div class="table-title">
        ${title}
      </div>
      <div class="table-meta">
        ${meta}
      </div>
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

/* -----------------------------------
   HTML
----------------------------------- */

function render(
  cols,
  rows,
  compact,
  minWidth
) {
  return `
    <table
      class="data-table ${
        compact
          ? "data-table--compact"
          : ""
      }"
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
            <th class="${
              c.align
                ? "t-" +
                  c.align
                : ""
            }">
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
              <td class="${
                c.align
                  ? "t-" +
                    c.align
                  : ""
              }">
                ${fmt(
                  row[
                    c.key
                  ],
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
   FORMAT
----------------------------------- */

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
        maximumFractionDigits: 1
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

/* -----------------------------------
   CSS
----------------------------------- */

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
      padding:10px 12px;
      display:flex;
      justify-content:space-between;
      align-items:center;
      border-bottom:1px solid #eef2f7;
    }

    .table-title{
      font-size:13px;
      font-weight:800;
    }

    .table-meta{
      font-size:10px;
      color:#64748b;
      font-weight:700;
    }

    .table-scroll{
      overflow:auto;
    }

    .data-table{
      width:100%;
      border-collapse:collapse;
      font-size:11px;
    }

    .data-table th{
      background:#f8fafc;
      padding:7px 6px;
      text-align:center;
      font-weight:800;
      white-space:nowrap;
      border-bottom:1px solid #e5e7eb;
    }

    .data-table td{
      padding:6px;
      text-align:center;
      white-space:nowrap;
      border-bottom:1px solid #f1f5f9;
      font-weight:600;
    }

    .data-table tbody tr:nth-child(even){
      background:#fcfcfd;
    }

    .data-table--compact th,
    .data-table--compact td{
      padding:5px;
      font-size:10px;
    }

    .table-empty{
      padding:18px;
      text-align:center;
      color:#64748b;
      font-weight:700;
    }
  `;

  document.head.appendChild(
    s
  );
}