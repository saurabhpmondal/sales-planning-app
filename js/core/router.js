// FILE: js/core/router.js

import { getReportRenderer } from "./registry.js";
import {
  APP_STATE,
  getActiveTab,
  setActiveTab
} from "./state.js";

/* -----------------------------------
   ROUTER INIT
----------------------------------- */

export function mountRouter() {
  bindTabClicks();
  renderCurrentRoute();
}

/* -----------------------------------
   TAB EVENTS
----------------------------------- */

function bindTabClicks() {
  document.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-tab]");

    if (!btn) return;

    const tabId = btn.dataset.tab;

    if (!tabId) return;

    navigate(tabId);
  });
}

/* -----------------------------------
   NAVIGATION
----------------------------------- */

export function navigate(tabId) {
  if (tabId === getActiveTab()) return;

  setActiveTab(tabId);

  syncTabButtons();

  renderCurrentRoute();
}

/* -----------------------------------
   MAIN RENDER
----------------------------------- */

export function renderCurrentRoute() {
  const view = document.getElementById("report-slot");

  if (!view) {
    throw new Error("Missing #report-slot container.");
  }

  const tabId = getActiveTab();

  const renderer = getReportRenderer(tabId);

  if (!renderer) {
    view.innerHTML = createMissingView(tabId);
    return;
  }

  try {
    view.innerHTML = "";

    renderer({
      el: view,
      state: APP_STATE
    });

    syncTabButtons();
  } catch (error) {
    console.error(`Render failed for tab: ${tabId}`, error);

    view.innerHTML = createErrorView(tabId, error);
  }
}

/* -----------------------------------
   TAB ACTIVE UI
----------------------------------- */

function syncTabButtons() {
  const activeId = getActiveTab();

  document.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.classList.toggle(
      "tab-btn--active",
      btn.dataset.tab === activeId
    );
  });
}

/* -----------------------------------
   STATES
----------------------------------- */

function createMissingView(tabId) {
  return `
    <div class="empty-card">
      <div class="empty-card__title">
        Report not found
      </div>
      <div class="empty-card__text">
        No renderer registered for "${tabId}".
      </div>
    </div>
  `;
}

function createErrorView(tabId, error) {
  return `
    <div class="empty-card">
      <div class="empty-card__title">
        Failed to render ${tabId}
      </div>
      <div class="empty-card__text">
        ${escapeHtml(error?.message || "Unknown error")}
      </div>
    </div>
  `;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}