// FILE: js/components/searchBox.js

/* -----------------------------------
   REUSABLE SEARCH BOX COMPONENT
   Can be used inside reports later
----------------------------------- */

export function createSearchBox({
  placeholder = "Search...",
  value = "",
  filterKey = "search"
} = {}) {
  const wrapper =
    document.createElement("div");

  wrapper.className =
    "search-wrap";

  wrapper.innerHTML = `
    <input
      type="text"
      class="search-input"
      data-filter="${filterKey}"
      placeholder="${placeholder}"
      value="${escapeHtml(value)}"
    />

    <span class="search-icon">
      🔍
    </span>
  `;

  return wrapper;
}

/* -----------------------------------
   HELPERS
----------------------------------- */

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}