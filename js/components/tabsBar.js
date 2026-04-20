// FILE: js/components/tabsBar.js

import { getEnabledTabs } from "../config/tabsConfig.js";
import { getActiveTab } from "../core/state.js";

/* -----------------------------------
   TABS BAR COMPONENT
----------------------------------- */

export function createTabsBar() {
  const el =
    document.createElement("div");

  el.className = "tabs-bar";

  const tabs =
    getEnabledTabs();

  const active =
    getActiveTab();

  el.innerHTML = `
    <div class="tab-list">
      ${tabs
        .map((tab) =>
          createTabButton(
            tab,
            active
          )
        )
        .join("")}
    </div>
  `;

  return el;
}

/* -----------------------------------
   TAB BUTTON
----------------------------------- */

function createTabButton(
  tab,
  activeId
) {
  const isActive =
    tab.id === activeId;

  return `
    <button
      class="tab-btn ${
        isActive
          ? "tab-btn--active"
          : ""
      }"
      data-tab="${tab.id}"
      type="button"
      title="${tab.label}"
    >
      <span class="tab-btn__icon">
        ${tab.icon || "•"}
      </span>

      <span>
        ${tab.label}
      </span>
    </button>
  `;
}