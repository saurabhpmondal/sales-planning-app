// FILE: js/utils/dom.js

/* -----------------------------------
   DOM HELPERS
----------------------------------- */

/**
 * Query selector
 */
export function $(
  selector,
  root = document
) {
  return root.querySelector(
    selector
  );
}

/**
 * Query selector all
 */
export function $$(
  selector,
  root = document
) {
  return Array.from(
    root.querySelectorAll(
      selector
    )
  );
}

/**
 * Create element
 */
export function create(
  tag = "div",
  className = ""
) {
  const el =
    document.createElement(
      tag
    );

  if (className) {
    el.className =
      className;
  }

  return el;
}

/**
 * Empty node
 */
export function clear(
  el
) {
  if (!el) return;

  el.innerHTML = "";
}

/**
 * Append many
 */
export function append(
  parent,
  ...children
) {
  children.forEach(
    (child) => {
      if (child) {
        parent.appendChild(
          child
        );
      }
    }
  );

  return parent;
}

/**
 * HTML inject
 */
export function html(
  el,
  content = ""
) {
  if (!el) return;

  el.innerHTML =
    content;
}

/**
 * Text inject
 */
export function text(
  el,
  value = ""
) {
  if (!el) return;

  el.textContent =
    value;
}

/**
 * Event bind
 */
export function on(
  el,
  event,
  handler,
  options
) {
  if (!el) return;

  el.addEventListener(
    event,
    handler,
    options
  );
}

/**
 * Toggle class
 */
export function toggle(
  el,
  className,
  state
) {
  if (!el) return;

  el.classList.toggle(
    className,
    state
  );
}
