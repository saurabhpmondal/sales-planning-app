// REPLACE FILE
// FILE: js/components/table.js

import { formatCurrency } from "../utils/format.js";

/* -----------------------------------
   PREMIUM TABLE UI
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
  columns,
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
          ${columns
            .map(
              (
                col,
                i
              ) => `
            <th class="
              ${
                col.align
                  ? "t-" +
                    col.align
                  : ""
              }
              ${
                i === 0
                  ? "sticky-1"
                  : ""
              }
              ${
                i === 1
                  ? "sticky-2"
                  : ""
              }
            ">
              ${col.label}
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
            ${columns
              .map(
                (
                  col,
                  i
                ) => `
              <td class="
                ${
                  col.align
                    ? "t-" +
                      col.align
                    : ""
                }
                ${
                  i === 0
                    ? "sticky-1"
                    : ""
                }
                ${
                  i === 1
                    ? "sticky-2"
                    : ""
                }
              ">
                ${cell(
                  row[
                    col.key
                  ],
                  col.format
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

function cell(
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
        maximumFractionDigits: 2
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
      2
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

  const style =
    document.createElement(
      "style"
    );

  style.textContent = `
    .table-card{
      background:#fff;
      border:1px solid #e5e7eb;
      border-radius:16px;
      overflow:hidden;
      box-shadow:
        0 4px 14px rgba(15,23,42,.05);
    }

    .table-toolbar{
      display:flex;
      justify-content:space-between;
      gap:10px;
      align-items:center;
      padding:12px 14px;
      border-bottom:1px solid #eef2f7;
    }

    .table-title{
      font-size:14px;
      font-weight:800;
      color:#0f172a;
    }

    .table-meta{
      font-size:11px;
      color:#64748b;
      font-weight:700;
    }

    .table-scroll{
      overflow:auto;
      max-width:100%;
    }

    .data-table{
      width:100%;
      border-collapse:separate;
      border-spacing:0;
      font-size:12px;
    }

    .data-table th{
      background:#f8fafc;
      color:#475569;
      font-weight:800;
      padding:10px;
      text-align:center;
      border-bottom:1px solid #e5e7eb;
      white-space:nowrap;
    }

    .data-table td{
      padding:10px;
      text-align:center;
      border-bottom:1px solid #f1f5f9;
      white-space:nowrap;
      color:#0f172a;
      font-weight:600;
    }

    .data-table tbody tr:nth-child(even){
      background:#fcfcfd;
    }

    .data-table tbody tr:hover{
      background:#f8fafc;
    }

    .data-table--compact th,
    .data-table--compact td{
      padding:8px;
      font-size:11px;
    }

    .sticky-1{
      position:sticky;
      left:0;
      background:inherit;
      z-index:4;
      min-width:130px;
    }

    .sticky-2{
      position:sticky;
      left:130px;
      background:inherit;
      z-index:4;
      min-width:150px;
    }

    thead .sticky-1,
    thead .sticky-2{
      z-index:8;
      background:#f8fafc;
    }

    .table-empty{
      padding:20px;
      text-align:center;
      color:#64748b;
      font-weight:700;
    }
  `;

  document.head.appendChild(
    style
  );
}