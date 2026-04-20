// FILE: js/components/header.js

import { APP_INFO } from "../core/constants.js";

/* -----------------------------------
   HEADER COMPONENT
----------------------------------- */

export function createHeader() {
  const el =
    document.createElement("div");

  el.className = "app-header";

  el.innerHTML = `
    <!-- LEFT -->
    <div class="brand-block">

      <div class="brand-logo">
        SP
      </div>

      <div class="brand-meta">
        <div class="brand-title">
          ${APP_INFO.name}
        </div>

        <div class="brand-subtitle">
          Sales Intelligence • Planning Engine
        </div>
      </div>

    </div>

    <!-- CENTER -->
    <div class="header-status">

      <div class="status-pill">
        <span class="status-dot"></span>
        <span>
          Data Connected
        </span>
      </div>

      <div class="header-counter">
        Version:
        <span class="header-counter__value">
          ${APP_INFO.version}
        </span>
      </div>

    </div>

    <!-- RIGHT -->
    <div class="header-actions">

      <button
        class="header-btn"
        data-action="refresh-report"
        title="Refresh Current Report"
      >
        <span class="header-btn__icon">↻</span>
        <span>Refresh</span>
      </button>

      <button
        class="header-btn header-btn--primary"
        data-tab="exportCenter"
        title="Open Export Center"
      >
        <span class="header-btn__icon">⬇</span>
        <span>Export</span>
      </button>

    </div>
  `;

  return el;
}