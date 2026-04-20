// FILE: js/data/fetcher.js

import { DATA_URLS } from "./urls.js";
import { parseCSV } from "./parser.js";

/* -----------------------------------
   LOAD ALL DATA SOURCES
----------------------------------- */

export async function loadAllSources() {
  const entries = Object.entries(DATA_URLS);

  const responses = await Promise.all(
    entries.map(async ([key, url]) => {
      const rows = await fetchCsvRows(url);
      return [key, rows];
    })
  );

  return Object.fromEntries(responses);
}

/* -----------------------------------
   FETCH SINGLE CSV
----------------------------------- */

export async function fetchCsvRows(url) {
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch CSV: ${response.status}`
    );
  }

  const csvText = await response.text();

  return parseCSV(csvText);
}

/* -----------------------------------
   RELOAD ONE SOURCE
----------------------------------- */

export async function reloadSource(key) {
  const url = DATA_URLS[key];

  if (!url) {
    throw new Error(
      `Unknown data source: ${key}`
    );
  }

  return fetchCsvRows(url);
}