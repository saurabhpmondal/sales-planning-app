// FULL REPLACEMENT FILE
// FILE: js/engines/sjitPlanningEngine.js

import { getPlanningRows } from "./planningCoreEngine.js";

/* -----------------------------------
   SJIT WRAPPER ENGINE
----------------------------------- */

export function getSjitPlanningRows({
  store,
  filters
}) {
  return getPlanningRows({
    store,
    filters,
    stockType: "sjit",
    enableZone: true
  });
}