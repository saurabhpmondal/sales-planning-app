// NEW FILE
// FILE: js/reports/exportCenter.js

import { getEnabledExports } from "../config/exportsConfig.js";
import { buildReportData } from "../engines/reportEngine.js";
import { createCsvBlob } from "../utils/csv.js";
import { downloadBlob } from "../utils/download.js";
import { showToast } from "../components/toast.js";

/* -----------------------------------
   EXPORT CENTER REPORT
----------------------------------- */

export function renderExportCenter({
  el,
  state
}) {
  const exports =
    getEnabledExports();

  el.className =
    "report-page";

  const wrapper =
    document.createElement(
      "div"
    );

  wrapper.className =
    "export-grid";

  wrapper.innerHTML =
    exports
      .map(
        (item) => `
      <div class="export-card">
        <div class="export-card__title">
          ${item.title}
        </div>

        <div class="export-card__text">
          ${item.description}
        </div>

        <button
          class="filter-btn"
          data-export-id="${item.id}"
          type="button"
        >
          Export ${item.type.toUpperCase()}
        </button>
      </div>
    `
      )
      .join("");

  el.appendChild(
    wrapper
  );

  bindExportEvents(
    el,
    state
  );
}

/* -----------------------------------
   EVENTS
----------------------------------- */

function bindExportEvents(
  root,
  state
) {
  root
    .querySelectorAll(
      "[data-export-id]"
    )
    .forEach((btn) => {
      btn.addEventListener(
        "click",
        () => {
          const id =
            btn.dataset
              .exportId;

          runExport(
            id,
            state
          );
        }
      );
    });
}

/* -----------------------------------
   EXPORT RUNNER
----------------------------------- */

function runExport(
  exportId,
  state
) {
  const data =
    buildReportData(
      state.store,
      state.filters
    );

  let rows = [];

  switch (
    exportId
  ) {
    case "dashboard-summary":
      rows =
        buildDashboardRows(
          data
        );
      break;

    case "sales-report":
      rows =
        buildSalesRows(
          data
        );
      break;

    case "master-data":
      rows =
        buildMasterRows(
          data,
          state
        );
      break;

    default:
      rows =
        buildRawRows(
          data
        );
      break;
  }

  const blob =
    createCsvBlob(
      rows
    );

  const fileName = `${exportId}-${dateStamp()}.csv`;

  downloadBlob(
    blob,
    fileName
  );

  showToast(
    "Export downloaded",
    "success"
  );
}

/* -----------------------------------
   DATA BUILDERS
----------------------------------- */

function buildDashboardRows(
  data
) {
  return [
    {
      GMV:
        data.summary
          .netGmv,
      Units:
        data.summary
          .netUnits,
      ReturnPercent:
        data.summary
          .returnPercent,
      ReturnUnits:
        data.summary
          .returnUnits
    }
  ];
}

function buildSalesRows(
  data
) {
  return Object.entries(
    data.maps
      .salesByStyle
  ).map(
    ([styleId, v]) => ({
      styleId,
      units:
        v.netUnits,
      gmv:
        v.netGmv,
      asp: v.asp,
      returnPercent:
        data.maps
          .returnPercentByStyle[
          styleId
        ] || 0,
      sjitStock:
        data.maps
          .sjitStockByStyle[
          styleId
        ] || 0,
      sorStock:
        data.maps
          .sorStockByStyle[
          styleId
        ] || 0
    })
  );
}

function buildMasterRows(
  data,
  state
) {
  return state.store
    .productMaster.map(
      (row) => ({
        styleId:
          row.styleId,
        erpSku:
          row.erpSku,
        brand:
          row.brand,
        articleType:
          row.articleType,
        status:
          row.status,
        mrp: row.mrp,
        tp: row.tp,
        units:
          data.maps
            .salesByStyle[
            row.styleId
          ]
            ?.netUnits ||
          0
      })
    );
}

function buildRawRows(
  data
) {
  return data.filtered.sales.map(
    (r) => ({
      styleId:
        r.styleId,
      brand:
        r.brand,
      qty: r.qty,
      gmv:
        r.finalAmount,
      poType:
        r.poType,
      status:
        r.orderStatus
    })
  );
}

/* -----------------------------------
   HELPERS
----------------------------------- */

function dateStamp() {
  const d =
    new Date();

  return `${d.getFullYear()}-${String(
    d.getMonth() +
      1
  ).padStart(
    2,
    "0"
  )}-${String(
    d.getDate()
  ).padStart(
    2,
    "0"
  )}`;
}