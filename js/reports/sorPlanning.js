// FULL REPLACEMENT FILE
// FILE: js/reports/sorPlanning.js

import { getSorPlanningRows } from "../engines/sorPlanningEngine.js";
import { createTable } from "../components/table.js";

const PAGE_SIZE = 50;
let page = 1;
let selectedDays = 30;

export function renderSorPlanning({ el, state }) {
  const rows = getSorPlanningRows({
    store: state.store,
    filters: {
      ...state.filters,
      planningDays: selectedDays
    }
  });

  const visible = rows.slice(0, PAGE_SIZE * page);

  el.className = "report-page";
  el.innerHTML = "";

  el.appendChild(createToolbar(el, state));

  el.appendChild(
    createTable({
      title: "SOR Planning",
      meta: `${visible.length}/${rows.length} styles`,
      mode: "grid",
      minWidth: 1700,
      columns: getColumns(),
      rows: visible
    })
  );

  if (visible.length < rows.length) {
    const btn = document.createElement("button");
    btn.className = "load-more-btn";
    btn.textContent = "Load More";

    btn.onclick = () => {
      page++;
      renderSorPlanning({ el, state });
    };

    el.appendChild(btn);
  }

  injectCss();
}

function createToolbar(el, state) {
  const wrap = document.createElement("div");
  wrap.className = "planning-toolbar";

  wrap.innerHTML = `
    <label class="planning-label">
      Sales Days
      <select class="planning-select">
        <option value="30">30</option>
        <option value="45">45</option>
        <option value="60">60</option>
      </select>
    </label>
  `;

  const select =
    wrap.querySelector("select");

  select.value =
    String(selectedDays);

  select.onchange = () => {
    selectedDays =
      Number(select.value);

    page = 1;

    renderSorPlanning({
      el,
      state
    });
  };

  return wrap;
}

function getColumns() {
  return [
    { key: "styleId", label: "Style" },
    { key: "erpSku", label: "ERP SKU" },
    { key: "erpStatus", label: "ERP Status" },
    { key: "brand", label: "Brand" },
    { key: "rating", label: "Rating", format: "number" },
    { key: "grossUnits", label: "Gross", format: "number" },
    { key: "returnUnits", label: "Return", format: "number" },
    { key: "net", label: "Net", format: "number" },
    { key: "returnPercent", label: "Ret%", format: "percent" },
    { key: "drr", label: "DRR", format: "number" },
    { key: "stockCol", label: "SOR Stock", format: "number" },
    { key: "sc", label: "SC", format: "number" },
    { key: "shipmentQty", label: "Shipment", format: "number" },
    { key: "recallQty", label: "Recall", format: "number" }
  ];
}

let cssDone = false;

function injectCss() {
  if (cssDone) return;
  cssDone = true;

  const style = document.createElement("style");
  style.textContent = `
    .planning-toolbar{
      display:flex;
      justify-content:flex-end;
      margin-bottom:12px;
    }

    .planning-label{
      display:flex;
      gap:8px;
      align-items:center;
      font-weight:700;
    }

    .planning-select{
      padding:8px 10px;
      border-radius:8px;
    }

    .load-more-btn{
      margin:12px auto;
      display:block;
      padding:10px 18px;
      border:none;
      border-radius:10px;
      font-weight:700;
      cursor:pointer;
    }
  `;

  document.head.appendChild(style);
}