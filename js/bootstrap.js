// FILE: js/bootstrap.js

import { createAppShell } from "./components/appShell.js";
import { createHeader } from "./components/header.js";
import { createFiltersBar } from "./components/filtersBar.js";
import { createTabsBar } from "./components/tabsBar.js";

import { APP_STATE } from "./core/state.js";
import { registerReports } from "./core/registry.js";
import { mountRouter } from "./core/router.js";

import { loadAllSources } from "./data/fetcher.js";
import { mapAllDatasets } from "./data/mapper.js";
import { normalizeAllDatasets } from "./data/normalizer.js";
import { buildDataStore } from "./data/datastore.js";

/* -----------------------------------
   PUBLIC BOOT FUNCTION
----------------------------------- */

export async function bootApplication() {
  showLoaderText("Loading data sources...");

  /* 1. Fetch CSV sources */
  const rawData = await loadAllSources();

  showLoaderText("Mapping columns...");

  /* 2. Map source columns once */
  const mappedData = mapAllDatasets(rawData);

  showLoaderText("Normalizing datasets...");

  /* 3. Normalize values */
  const normalizedData = normalizeAllDatasets(mappedData);

  showLoaderText("Building data store...");

  /* 4. Create global store/cache */
  const store = buildDataStore(normalizedData);

  /* 5. Save to state */
  APP_STATE.store = store;

  showLoaderText("Rendering application...");

  /* 6. Render shell */
  renderApplication();

  /* 7. Register reports */
  registerReports();

  /* 8. Mount router */
  mountRouter();

  /* 9. Hide loader */
  hideBootLoader();
}

/* -----------------------------------
   RENDER APP STRUCTURE
----------------------------------- */

function renderApplication() {
  const root = document.getElementById("app");

  if (!root) {
    throw new Error("Missing #app root element.");
  }

  root.innerHTML = "";

  const shell = createAppShell();

  root.appendChild(shell);

  /* Header */
  const headerTarget = document.getElementById("header-slot");
  headerTarget.appendChild(createHeader());

  /* Filters */
  const filtersTarget = document.getElementById("filters-slot");
  filtersTarget.appendChild(createFiltersBar());

  /* Tabs */
  const tabsTarget = document.getElementById("tabs-slot");
  tabsTarget.appendChild(createTabsBar());
}

/* -----------------------------------
   LOADER HELPERS
----------------------------------- */

function showLoaderText(message) {
  const el = document.querySelector(".boot-loader__text");

  if (el) el.textContent = message;
}

function hideBootLoader() {
  const loader = document.getElementById("boot-loader");

  if (!loader) return;

  loader.style.opacity = "0";
  loader.style.pointerEvents = "none";
  loader.style.transition = "opacity .25s ease";

  setTimeout(() => {
    loader.remove();
  }, 260);
}