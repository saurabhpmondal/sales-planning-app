// FILE: js/components/chart.js

/* -----------------------------------
   CHART PLACEHOLDER COMPONENT
   Ready for Chart.js integration
----------------------------------- */

let chartId = 0;

/* -----------------------------------
   PUBLIC
----------------------------------- */

export function createChartCard({
  title = "Chart",
  meta = "",
  size = "md",
  canvasId = ""
} = {}) {
  const wrapper =
    document.createElement("div");

  const id =
    canvasId ||
    `chart-${++chartId}`;

  wrapper.className =
    "chart-card";

  wrapper.innerHTML = `
    <div class="chart-card__header">

      <div class="chart-card__title">
        ${title}
      </div>

      <div class="chart-card__meta">
        ${meta}
      </div>

    </div>

    <div class="chart-card__body">
      <div class="chart-box chart-box--${size}">
        <canvas id="${id}"></canvas>
      </div>
    </div>
  `;

  return wrapper;
}

/* -----------------------------------
   EMPTY CHART CARD
----------------------------------- */

export function createChartPlaceholder({
  title = "Chart",
  message = "Visualization will render here."
} = {}) {
  const wrapper =
    document.createElement("div");

  wrapper.className =
    "chart-card";

  wrapper.innerHTML = `
    <div class="chart-card__header">
      <div class="chart-card__title">
        ${title}
      </div>
    </div>

    <div class="chart-card__body">
      <div class="chart-placeholder">

        <div>
          <div class="chart-placeholder__title">
            ${title}
          </div>

          <div class="chart-placeholder__text">
            ${message}
          </div>
        </div>

      </div>
    </div>
  `;

  return wrapper;
}