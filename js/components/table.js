// REPLACE FILE
// FILE: js/components/table.js

import { formatCurrency } from "../utils/format.js";

/* -----------------------------------
   TABLE COMPONENT
   Upgraded:
   - supports custom render()
   - safer formatting
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
    document.createElement(
      "div"
    );

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

    <div class="table-scroll">
      ${
        rows.length
          ? `
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
          const raw =
            row[
              col.key
            ];

          const value =
            typeof col.render ===
            "function"
              ? col.render(
                  raw,
                  row
                )
              : formatCell(
                  raw,
                  col.format
                );

          return `
            <td class="${
              col.align
                ? "t-" +
                  col.align
                : ""
            }">
              ${value}
            </td>
          `;
        })
        .join("")}
    </tr>
  `;
}

/* -----------------------------------
   FORMATTERS
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

  return safe(
    value
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
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    );
}