// REPLACE FILE
// FILE: js/components/table.js

import { formatCurrency } from "../utils/format.js";

/* -----------------------------------
   WIDTH PRIORITY TABLE SYSTEM
   Goal:
   - Dashboard tables fit cards
   - Less ugly scrollers
   - Better readability
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

/* ----------------------------------- */

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
            <th
              style="width:${colW(
                c
              )}px"
              class="${
                c.align
                  ? "t-" +
                    c.align
                  : ""
              }"
            >
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
              <td
                style="width:${colW(
                  c
                )}px"
                class="${
                  c.align
                    ? "t-" +
                      c.align
                    : ""
                }"
              >
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
   COLUMN WIDTH LOGIC
----------------------------------- */

function colW(c) {
  const k =
    String(
      c.key || ""
    ).toLowerCase();

  const l =
    String(
      c.label || ""
    ).toLowerCase();

  if (
    k.includes(
      "style"
    ) ||
    l.includes(
      "style"
    )
  )
    return 92;

  if (
    k.includes(
      "sku"
    )
  )
    return 92;

  if (
    k.includes(
      "brand"
    )
  )
    return 105;

  if (
    k.includes(
      "status"
    )
  )
    return 105;

  if (
    k.includes(
      "bucket"
    ) ||
    l.includes(
      "range"
    )
  )
    return 88;

  if (
    k.includes(
      "gmv"
    )
  )
    return 92;

  if (
    k.includes(
      "asp"
    )
  )
    return 78;

  if (
    k.includes(
      "units"
    ) ||
    k.includes(
      "click"
    ) ||
    k.includes(
      "impression"
    ) ||
    k.includes(
      "atc"
    )
  )
    return 70;

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
      "growth"
    )
  )
    return 64;

  if (
    /^d\d+$/.test(k)
  )
    return 38;

  return 80;
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
      padding:10px 12px;
      display:flex;
      justify-content:space-between;
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
      table-layout:fixed;
      font-size:11px;
    }

    .data-table th{
      background:#f8fafc;
      padding:7px 4px;
      text-align:center;
      white-space:nowrap;
      border-bottom:1px solid #e5e7eb;
      font-weight:800;
    }

    .data-table td{
      padding:6px 4px;
      text-align:center;
      white-space:nowrap;
      border-bottom:1px solid #f1f5f9;
      overflow:hidden;
      text-overflow:ellipsis;
      font-weight:600;
    }

    .data-table tbody tr:nth-child(even){
      background:#fcfcfd;
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