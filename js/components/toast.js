// FILE: js/components/toast.js

/* -----------------------------------
   TOAST NOTIFICATION SYSTEM
----------------------------------- */

let holderReady = false;

/* -----------------------------------
   PUBLIC
----------------------------------- */

export function showToast(
  message = "Done",
  type = "info"
) {
  ensureHolder();

  const holder =
    document.getElementById(
      "toast-holder"
    );

  const toast =
    document.createElement(
      "div"
    );

  toast.className = `
    toast-item
    toast-item--${type}
  `;

  toast.textContent =
    message;

  holder.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add(
      "toast-item--show"
    );
  });

  setTimeout(() => {
    toast.classList.remove(
      "toast-item--show"
    );

    setTimeout(() => {
      toast.remove();
    }, 220);
  }, 2600);
}

/* -----------------------------------
   HOLDER
----------------------------------- */

function ensureHolder() {
  if (holderReady) return;

  holderReady = true;

  const holder =
    document.createElement(
      "div"
    );

  holder.id =
    "toast-holder";

  holder.className =
    "toast-holder";

  document.body.appendChild(
    holder
  );

  injectStyles();
}

/* -----------------------------------
   STYLES
----------------------------------- */

function injectStyles() {
  const style =
    document.createElement(
      "style"
    );

  style.textContent = `
    .toast-holder{
      position:fixed;
      top:16px;
      right:16px;
      z-index:9999;
      display:flex;
      flex-direction:column;
      gap:10px;
      pointer-events:none;
    }

    .toast-item{
      min-width:220px;
      max-width:340px;
      padding:12px 14px;
      border-radius:12px;
      background:#0f172a;
      color:#fff;
      font-size:14px;
      box-shadow:0 10px 24px rgba(15,23,42,.18);
      opacity:0;
      transform:translateY(-8px);
      transition:all .22s ease;
    }

    .toast-item--show{
      opacity:1;
      transform:translateY(0);
    }

    .toast-item--success{
      background:#16a34a;
    }

    .toast-item--error{
      background:#dc2626;
    }

    .toast-item--warning{
      background:#d97706;
    }

    .toast-item--info{
      background:#2563eb;
    }
  `;

  document.head.appendChild(
    style
  );
}