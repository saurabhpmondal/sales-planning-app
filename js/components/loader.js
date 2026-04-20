// FILE: js/components/loader.js

/* -----------------------------------
   INLINE LOADER COMPONENT
----------------------------------- */

export function createLoader({
  text = "Loading..."
} = {}) {
  const el =
    document.createElement("div");

  el.className =
    "empty-card";

  el.innerHTML = `
    <div style="
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:14px;
    ">
      <div style="
        width:34px;
        height:34px;
        border-radius:50%;
        border:3px solid #dbeafe;
        border-top-color:#2563eb;
        animation:spinInline .8s linear infinite;
      "></div>

      <div class="empty-card__text">
        ${text}
      </div>
    </div>
  `;

  injectStyle();

  return el;
}

/* -----------------------------------
   STYLE ONCE
----------------------------------- */

let injected = false;

function injectStyle() {
  if (injected) return;

  injected = true;

  const style =
    document.createElement(
      "style"
    );

  style.textContent = `
    @keyframes spinInline {
      to {
        transform:rotate(360deg);
      }
    }
  `;

  document.head.appendChild(
    style
  );
}