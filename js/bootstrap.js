// REPLACE FILE
// FILE: js/bootstrap.js

import { createAppShell } from "./components/appShell.js";
import { createHeader } from "./components/header.js";
import { createFiltersBar } from "./components/filtersBar.js";
import { createTabsBar } from "./components/tabsBar.js";

import { APP_STATE } from "./core/state.js";
import { registerReports } from "./core/registry.js";
import { mountRouter } from "./core/router.js";
import { bindGlobalEvents } from "./core/events.js";

import { loadAllSources } from "./data/fetcher.js";
import { mapAllDatasets } from "./data/mapper.js";
import { normalizeAllDatasets } from "./data/normalizer.js";
import { buildDataStore } from "./data/datastore.js";
import { validateStore } from "./data/validator.js";

/* -----------------------------------
   PUBLIC BOOT FUNCTION
----------------------------------- */

export async function bootApplication() {
  showLoaderText(
    "Loading data sources..."
  );

  /* 1. Fetch CSV */
  const rawData =
    await loadAllSources();

  showLoaderText(
    "Mapping columns..."
  );

  /* 2. Map columns */
  const mapped =
    mapAllDatasets(
      rawData
    );

  showLoaderText(
    "Normalizing datasets..."
  );

  /* 3. Normalize */
  const normalized =
    normalizeAllDatasets(
      mapped
    );

  showLoaderText(
    "Building store..."
  );

  /* 4. Store */
  const store =
    buildDataStore(
      normalized
    );

  /* 5. Validate */
  const issues =
    validateStore(
      store
    );

  if (
    issues.length
  ) {
    console.warn(
      "Validation issues:",
      issues
    );
  }

  APP_STATE.store =
    store;

  showLoaderText(
    "Rendering app..."
  );

  /* 6. Shell */
  renderApplication();

  /* 7. Register reports */
  registerReports();

  /* 8. Bind events */
  bindGlobalEvents();

  /* 9. Router */
  mountRouter();

  /* 10. Hide loader */
  hideBootLoader();
}

/* -----------------------------------
   RENDER
----------------------------------- */

function renderApplication() {
  const root =
    document.getElementById(
      "app"
    );

  if (!root) {
    throw new Error(
      "Missing #app root"
    );
  }

  root.innerHTML =
    "";

  const shell =
    createAppShell();

  root.appendChild(
    shell
  );

  document
    .getElementById(
      "header-slot"
    )
    .appendChild(
      createHeader()
    );

  document
    .getElementById(
      "filters-slot"
    )
    .appendChild(
      createFiltersBar()
    );

  document
    .getElementById(
      "tabs-slot"
    )
    .appendChild(
      createTabsBar()
    );
}

/* -----------------------------------
   LOADER HELPERS
----------------------------------- */

function showLoaderText(
  message
) {
  const el =
    document.querySelector(
      ".boot-loader__text"
    );

  if (el) {
    el.textContent =
      message;
  }
}

function hideBootLoader() {
  const loader =
    document.getElementById(
      "boot-loader"
    );

  if (!loader)
    return;

  loader.style.opacity =
    "0";
  loader.style.pointerEvents =
    "none";

  setTimeout(() => {
    loader.remove();
  }, 260);
}