// FILE: js/components/table.js

import { formatCurrency } from "../utils/format.js";

/* -----------------------------------
   TABLE COMPONENT
----------------------------------- */

export function createTable({
  title = "",
  meta = "",
  columns = [],
  rows = [],
  compact = false,
  minWidth = ""
} = {}) {
  const wrapper =
    document.createElement("div");

  wrapper.className =
    "table-card";

  wrapper.innerHTML = `
    <div class="table-toolbar">
      <div class="table-title">
        ${title}
      </div>

      <div class="table-meta">
        ${meta}
      </div>
    </div>

    <div
      class="table-scroll"
      ${
        minWidth
          ? `style="min-width:${minWidth}px"`
          : ""
      }
    >
      ${
        rows.length
          ? `
        <table class="data-table ${
          compact
            ? "data-table--compact"
            : ""
        }">
          <thead>
            <tr>
              ${columns
                .map(
                  (col) => `
                <th class="${
                  col.align
                    ? "t-" +
                      col.align
                    : ""
                }">
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
                createRow(
                  columns,
                  row
                )
              )
              .join("")}
          </tbody>
        </table>
      `
          : `
        <div class="table-empty">
          No data available
        </div>
      `
      }
    </div>
  `;

  return wrapper;
}

/* -----------------------------------
   ROW
----------------------------------- */

function createRow(
  columns,
  row
) {
  return `
    <tr>
      ${columns
        .map((col) => {
          const value =
            row[col.key];

          const cls =
            col.align
              ? "t-" +
                col.align
              : "";

          return `
            <td class="${cls}">
              ${formatCell(
                value,
                col.format
              )}
            </td>
          `;
        })
        .join("")}
    </tr>
  `;
}

/* -----------------------------------
   CELL FORMAT
----------------------------------- */

function formatCell(
  value,
  format
) {
  if (
    format ===
    "currency"
  ) {
    return formatCurrency(
      value
    );
  }

  if (
    format ===
    "percent"
  ) {
    return `${num(
      value
    )}%`;
  }

  if (
    format ===
    "number"
  ) {
    return num(
      value
    ).toLocaleString(
      "en-IN"
    );
  }

  return value ?? "";
}

function num(v) {
  return Math.round(
    (Number(v) || 0) *
      100
  ) / 100;
}