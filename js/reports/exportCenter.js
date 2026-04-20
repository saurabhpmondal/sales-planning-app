// NEW FILE
// FILE: js/reports/exportCenter.js

import { getEnabledExports } from "../config/exportsConfig.js";
import { createEmptyState } from "../components/emptyState.js";
import { showToast } from "../components/toast.js";

import { buildReportData } from "../engines/reportEngine.js";

import { createCsvBlob } from "../utils/csv.js";
import { downloadBlob } from "../utils/download.js";

/* -----------------------------------
   EXPORT CENTER REPORT
----------------------------------- */

export function renderExportCenter({
  el,
  state
}) {
  const exportsList =
    getEnabledExports();

  el.className =
    "report-page";

  if (!exportsList.length) {
    el.appendChild(
      createEmptyState({
        title:
          "No Exports Enabled",
        message:
          "Enable exports from config."
      })
    );

    return;
  }

  const wrap =
    document.createElement(
      "div"
    );

  wrap.className =
    "export-grid";

  wrap.innerHTML =
    exportsList
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
          class="header-btn header-btn--primary"
          data-export="${item.id}"
          type="button"
        >
          Export CSV
        </button>
      </div>
    `
      )
      .join("");

  el.appendChild(
    wrap
  );

  bindExports(
    wrap,
    state
  );
}

/* -----------------------------------
   BIND EVENTS
----------------------------------- */

function bindExports(
  root,
  state
) {
  root.addEventListener(
    "click",
    (event) => {
      const btn =
        event.target.closest(
          "[data-export]"
        );

      if (!btn) return;

      const id =
        btn.dataset
          .export;

      exportNow(
        id,
        state
      );
    }
  );
}

/* -----------------------------------
   EXPORT LOGIC
----------------------------------- */

function exportNow(
  id,
  state
) {
  const data =
    buildReportData(
      state.store,
      state.filters
    );

  let rows = [];

  switch (id) {
    case "master-data":
      rows =
        buildMasterDump(
          data,
          state.store
        );
      break;

    default:
      rows =
        buildMasterDump(
          data,
          state.store
        );
      break;
  }

  const blob =
    createCsvBlob(
      rows
    );

  downloadBlob(
    blob,
    `${id}.csv`
  );

  showToast(
    "Export downloaded",
    "success"
  );
}

/* -----------------------------------
   MASTER DATASET
----------------------------------- */

function buildMasterDump(
  data,
  store
) {
  return Object.keys(
    data.maps
      .salesByStyle
  ).map(
    (styleId) => {
      const pm =
        store.lookups
          .productByStyle[
          styleId
        ] || {};

      const sales =
        data.maps
          .salesByStyle[
          styleId
        ] || {};

      return {
        styleId,
        erpSku:
          pm.erpSku ||
          "",
        brand:
          pm.brand ||
          "",
        status:
          pm.status ||
          "",
        units:
          sales.netUnits ||
          0,
        gmv:
          sales.netGmv ||
          0,
        asp:
          sales.asp ||
          0,
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
          ] || 0,
        drr:
          data.maps
            .drrByStyle[
            styleId
          ] || 0,
        growth:
          data.maps
            .growthByStyle[
            styleId
          ] || 0
      };
    }
  );
}
