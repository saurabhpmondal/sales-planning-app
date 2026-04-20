// REPLACE FILE
// FILE: js/reports/sales.js

import { buildReportData } from "../engines/reportEngine.js";
import { createTable } from "../components/table.js";

/* -----------------------------------
   SALES REPORT
   Final polish:
   - Growth %
   - CVR %
   - Better ranking
----------------------------------- */

export function renderSales({
  el,
  state
}) {
  const data =
    buildReportData(
      state.store,
      state.filters
    );

  const rows =
    buildRows(
      data,
      state.store
    );

  el.className =
    "report-page";

  el.appendChild(
    createTable({
      title:
        "Sales Report",
      meta: `${rows.length} styles`,
      columns:
        cols(),
      rows,
      minWidth: 3300
    })
  );
}

/* -----------------------------------
   BUILD
----------------------------------- */

function buildRows(
  data,
  store
) {
  const ids =
    Object.keys(
      data.maps
        .salesByStyle
    );

  const rows =
    ids.map(
      (id) => {
        const sales =
          data.maps
            .salesByStyle[
            id
          ] || {};

        const pm =
          store.lookups
            .productByStyle[
            id
          ] || {};

        const tf =
          data.maps
            .trafficByStyle[
            id
          ] || {};

        const clicks =
          tf.clicks ||
          0;

        const