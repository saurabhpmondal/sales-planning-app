// FILE: js/data/parser.js

/* -----------------------------------
   LIGHTWEIGHT CSV PARSER
   Handles:
   - quoted values
   - commas inside quotes
   - CRLF / LF
----------------------------------- */

export function parseCSV(csvText = "") {
  const text = String(csvText || "").trim();

  if (!text) return [];

  const rows = splitCsvRows(text);

  if (!rows.length) return [];

  const headers = splitCsvLine(rows[0]).map(cleanValue);

  const output = [];

  for (let i = 1; i < rows.length; i++) {
    const line = rows[i];

    if (!line.trim()) continue;

    const values = splitCsvLine(line);

    const record = {};

    headers.forEach((header, index) => {
      record[header] = cleanValue(
        values[index] ?? ""
      );
    });

    output.push(record);
  }

  return output;
}

/* -----------------------------------
   SPLIT ROWS
----------------------------------- */

function splitCsvRows(text) {
  const rows = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }

      continue;
    }

    if (
      !inQuotes &&
      (char === "\n" || char === "\r")
    ) {
      if (current !== "") {
        rows.push(current);
        current = "";
      }

      if (
        char === "\r" &&
        next === "\n"
      ) {
        i++;
      }

      continue;
    }

    current += char;
  }

  if (current !== "") {
    rows.push(current);
  }

  return rows;
}

/* -----------------------------------
   SPLIT LINE INTO CELLS
----------------------------------- */

function splitCsvLine(line = "") {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }

      continue;
    }

    if (!inQuotes && char === ",") {
      cells.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current);

  return cells;
}

/* -----------------------------------
   CLEAN VALUE
----------------------------------- */

function cleanValue(value = "") {
  return String(value)
    .replace(/\uFEFF/g, "")
    .trim();
}