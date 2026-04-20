// FILE: js/data/validator.js

/* -----------------------------------
   DATA VALIDATOR
   Run sanity checks after load
----------------------------------- */

export function validateStore(store) {
  const issues = [];

  if (!store) {
    issues.push("Missing store object.");
    return issues;
  }

  checkArray(store.sales, "sales", issues);
  checkArray(store.returns, "returns", issues);
  checkArray(store.traffic, "traffic", issues);
  checkArray(
    store.productMaster,
    "productMaster",
    issues
  );

  checkRequiredFields(
    store.sales,
    ["styleId", "qty"],
    "sales",
    issues
  );

  checkRequiredFields(
    store.productMaster,
    ["styleId", "erpSku"],
    "productMaster",
    issues
  );

  return issues;
}

/* -----------------------------------
   HELPERS
----------------------------------- */

function checkArray(
  value,
  name,
  issues
) {
  if (!Array.isArray(value)) {
    issues.push(
      `${name} is not an array.`
    );
  }
}

function checkRequiredFields(
  rows,
  fields,
  label,
  issues
) {
  if (!Array.isArray(rows))
    return;

  rows.forEach((row, index) => {
    fields.forEach((field) => {
      if (
        row[field] ===
          undefined ||
        row[field] === null
      ) {
        issues.push(
          `${label}[${index}] missing ${field}`
        );
      }
    });
  });
}