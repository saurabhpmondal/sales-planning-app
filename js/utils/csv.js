// FILE: js/utils/csv.js

/* -----------------------------------
   CSV GENERATOR
----------------------------------- */

/**
 * Convert rows to CSV string
 * @param {Array<Object>} rows
 * @returns {string}
 */
export function rowsToCsv(
  rows = []
) {
  if (!rows.length) {
    return "";
  }

  const headers =
    Object.keys(rows[0]);

  const lines = [
    headers.join(",")
  ];

  rows.forEach((row) => {
    const values =
      headers.map(
        (key) =>
          escapeCsv(
            row[key]
          )
      );

    lines.push(
      values.join(",")
    );
  });

  return lines.join(
    "\n"
  );
}

/**
 * Download-safe csv text
 */
export function createCsvBlob(
  rows = []
) {
  const csv =
    rowsToCsv(rows);

  return new Blob(
    ["\uFEFF" + csv],
    {
      type:
        "text/csv;charset=utf-8;"
    }
  );
}

/* -----------------------------------
   HELPERS
----------------------------------- */

function escapeCsv(
  value
) {
  const text = String(
    value ?? ""
  );

  const needsQuotes =
    text.includes(",") ||
    text.includes('"') ||
    text.includes(
      "\n"
    );

  const clean =
    text.replaceAll(
      '"',
      '""'
    );

  return needsQuotes
    ? `"${clean}"`
    : clean;
}
