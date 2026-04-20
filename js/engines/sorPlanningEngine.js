// FULL REPLACEMENT FILE
// FILE: js/engines/sorPlanningEngine.js

import { getPlanningRows } from "./planningCoreEngine.js";

/* -----------------------------------
   SOR WRAPPER ENGINE
----------------------------------- */

export function getSorPlanningRows({
  store,
  filters
}) {
  return getPlanningRows({
    store,
    filters,
    stockType: "sor",
    enableZone: false
  });
}