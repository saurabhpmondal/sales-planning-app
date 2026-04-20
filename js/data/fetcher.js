// REPLACE FILE
// FILE: js/data/fetcher.js

import { DATA_SOURCES } from "../config/dataSources.js";

/* -----------------------------------
   LOAD ALL FILES TOGETHER
----------------------------------- */

export async function loadAllSources() {
  updateLoader(
    "Connecting data sources..."
  );

  const jobs =
    DATA_SOURCES.map(
      async (item) => {
        try {
          updateLoader(
            `Loading ${item.label}...`
          );

          const rows =
            await fetchCsv(
              item.url
            );

          return {
            key: item.key,
            rows
          };
        } catch (error) {
          console.error(
            item.key,
            error
          );

          return {
            key: item.key,
            rows: []
          };
        }
      }
    );

  const result =
    await Promise.all(
      jobs
    );

  const output = {};

  result.forEach(
    (item) => {
      output[
        item.key
      ] = item.rows;
    }
  );

  updateLoader(
    "Data loaded successfully..."
  );

  return {
    saleData:
      output.saleData ||
      [],
    returnData:
      output.returnData ||
      [],
    traffic:
      output.traffic ||
      [],
    sjitStock:
      output.sjitStock ||
      [],
    sorStock:
      output.sorStock ||
      [],
    sellerStock:
      output.sellerStock ||
      [],
    productMaster:
      output.productMaster ||
      []
  };
}

/* -----------------------------------
   FETCH CSV
----------------------------------- */

async function fetchCsv(
  url
) {
  const res =
    await fetch(url, {
      cache:
        "no-store"
    });

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
    splitLine(
      lines[0]
    );

  const rows = [];

  for (
    let i = 1;
    i < lines.length;
    i++
  ) {
    const values =
      splitLine(
        lines[i]
      );

    const row = {};

    headers.forEach(
      (h, idx) => {
        row[h] =
          values[
            idx
          ] || "";
      }
    );

    rows.push(row);
  }

  return rows;
}

function splitLine(
  line = ""
) {
  const out = [];
  let cur =
    "";
  let quote =
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
      quote =
        !quote;
      continue;
    }

    if (
      ch === "," &&
      !quote
    ) {
      out.push(
        cur
      );
      cur = "";
      continue;
    }

    cur += ch;
  }

  out.push(cur);

  return out.map(
    (x) =>
      x.trim()
  );
}

/* -----------------------------------
   UI
----------------------------------- */

function updateLoader(
  text
) {
  const el =
    document.querySelector(
      ".boot-loader__text"
    );

  if (el) {
    el.textContent =
      text;
  }
}