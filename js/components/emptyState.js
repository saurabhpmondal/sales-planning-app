// FILE: js/components/emptyState.js

/* -----------------------------------
   EMPTY STATE COMPONENT
----------------------------------- */

export function createEmptyState({
  title = "No Data Found",
  message = "There is no data available for the selected filters."
} = {}) {
  const el =
    document.createElement("div");

  el.className =
    "empty-card";

  el.innerHTML = `
    <div style="
      font-size:34px;
      margin-bottom:12px;
    ">
      📭
    </div>

    <div class="empty-card__title">
      ${title}
    </div>

    <div class="empty-card__text">
      ${message}
    </div>
  `;

  return el;
}