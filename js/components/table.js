// REPLACE FILE
// FILE: js/components/table.js

import { formatCurrency } from "../utils/format.js";

/* -----------------------------------
   TABLE COMPONENT
   Fixed:
   - first 2 columns sticky
   - sku visible
   - better horizontal scroll
----------------------------------- */

export function createTable({
  title = "",
  meta = "",
  columns = [],
  rows = [],
  compact = false,
  minWidth = ""
} = {}) {
  const wrap =
    document.createElement(
      "div"
    );

  wrap.className =
    "table-card";

  wrap.innerHTML = `
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
          ? renderTable(
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

  return wrap;
}

/* -----------------------------------
   TABLE HTML
----------------------------------- */

function renderTable(
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
          .map((row) =>
            renderRow(
              columns,
              row
            )
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderRow(
  columns,
  row
) {
  return `
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
  `;
}

/* -----------------------------------
   FORMAT
----------------------------------- */

function cell(
  val,
  format
) {
  if (
    format ===
    "currency"
  ) {
    return formatCurrency(
      val
    );
  }

  if (
    format ===
    "number"
  ) {
    return num(
      val
    ).toLocaleString(
      "en-IN"
    );
  }

  if (
    format ===
    "percent"
  ) {
    return `${num(
      val
    )}%`;
  }

  return safe(
    val
  );
}

function num(v) {
  return (
    Math.round(
      (Number(v) || 0) *
        100
    ) / 100
  );
}

function safe(v) {
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
    .table-scroll{
      overflow:auto;
      position:relative;
    }

    .sticky-1{
      position:sticky;
      left:0;
      z-index:4;
      background:#fff;
      min-width:130px;
    }

    .sticky-2{
      position:sticky;
      left:130px;
      z-index:4;
      background:#fff;
      min-width:150px;
    }

    thead .sticky-1,
    thead .sticky-2{
      z-index:8;
    }
  `;

  document.head.appendChild(
    style
  );
}