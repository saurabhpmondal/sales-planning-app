// REPLACE FILE
// FILE: js/data/fetcher.js

import { DATA_SOURCES } from "../config/dataSources.js";

/* -----------------------------------
   FAST LOADER ARCHITECTURE
   Phase 1 = critical files
   Phase 2 = traffic async
----------------------------------- */

export async function loadAllSources() {
  const core = {};
  const traffic = [];

  /* -------------------------------
     PHASE 1 : CORE DATA
  -------------------------------- */
  for (const item of DATA_SOURCES) {
    if (
      item.key ===
      "traffic"
    ) {
      continue;
    }

    updateLoader(
      `Loading ${item.label}...`
    );

    try {
      const rows =
        await fetchCsv(
          item.url
        );

      core[item.key] =
        rows;
    } catch (error) {
      console.error(
        `Failed: ${item.key}`,
        error
      );

      core[item.key] =
        [];
    }
  }

  /* -------------------------------
     PHASE 2 : TRAFFIC BACKGROUND
  -------------------------------- */
  loadTrafficAsync(
    DATA_SOURCES.find(
      (x) =>
        x.key ===
        "traffic"
    )
  );

  return {
    saleData:
      core.saleData ||
      [],
    returnData:
      core.returnData ||
      [],
    sjitStock:
      core.sjitStock ||
      [],
    sorStock:
      core.sorStock ||
      [],
    sellerStock:
      core.sellerStock ||
      [],
    productMaster:
      core.productMaster ||
      [],
    traffic
  };
}

/* -----------------------------------
   BACKGROUND TRAFFIC
----------------------------------- */

async function loadTrafficAsync(
  item
) {
  if (!item) return;

  try {
    console.log(
      "Loading traffic in background..."
    );

    const rows =
      await fetchCsv(
        item.url
      );

    window.__TRAFFIC_DATA__ =
      rows;

    window.dispatchEvent(
      new CustomEvent(
        "trafficLoaded",
        {
          detail: rows
        }
      )
    );

    console.log(
      "Traffic loaded."
    );
  } catch (error) {
    console.error(
      "Traffic failed:",
      error
    );
  }
}

/* -----------------------------------
   FETCH CSV
----------------------------------- */

async function fetchCsv(
  url
) {
  const controller =
    new AbortController();

  const timer =
    setTimeout(() => {
      controller.abort();
    }, 25000);

  const res =
    await fetch(url, {
      signal:
        controller.signal,
      cache:
        "no-store"
    });

  clearTimeout(
    timer
  );

  if (!res.ok) {
    throw new Error(
      `HTTP ${res.status}`
    );
  }

  const text =
    await res.text();

  return parseCsv(
    text
  );
}

/* -----------------------------------
   CSV PARSER
----------------------------------- */

function parseCsv(
  text = ""
) {
  const lines =
    text
      .trim()
      .split(/\r?\n/);

  if (!lines.length)
    return [];

  const headers =
    splitCsvLine(
      lines[0]
    );

  const rows = [];

  for (
    let i = 1;
    i < lines.length;
    i++
  ) {
    const values =
      splitCsvLine(
        lines[i]
      );

    const row = {};

    headers.forEach(
      (key, idx) => {
        row[key] =
          values[
            idx
          ] || "";
      }
    );

    rows.push(row);
  }

  return rows;
}

function splitCsvLine(
  line = ""
) {
  const out = [];
  let current =
    "";
  let inside =
    false;

  for (
    let i = 0;
    i < line.length;
    i++
  ) {
    const ch =
      line[i];

    if (
      ch === '"'
    ) {
      inside =
        !inside;
      continue;
    }

    if (
      ch === "," &&
      !inside
    ) {
      out.push(
        current
      );
      current =
        "";
      continue;
    }

    current += ch;
  }

  out.push(current);

  return out.map(
    (x) =>
      x.trim()
  );
}

/* -----------------------------------
   UI LOADER TEXT
----------------------------------- */

function updateLoader(
  msg
) {
  const el =
    document.querySelector(
      ".boot-loader__text"
    );

  if (el) {
    el.textContent =
      msg;
  }
}