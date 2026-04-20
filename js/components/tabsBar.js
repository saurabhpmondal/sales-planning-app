// FULL REPLACEMENT FILE
// FILE: js/components/tabsBar.js

/* -----------------------------------
   TABS BAR
   SAFE ADDITIVE VERSION
----------------------------------- */

export function createTabsBar() {
  const wrap =
    document.createElement(
      "div"
    );

  wrap.className =
    "tabs-bar";

  wrap.innerHTML = `
    <button class="tab-btn tab-btn--active" data-tab="dashboard">
      Dashboard
    </button>

    <button class="tab-btn" data-tab="sales">
      Sales
    </button>

    <button class="tab-btn" data-tab="dayOnDay">
      Day on Day
    </button>

    <button class="tab-btn" data-tab="sjitPlanning">
      SJIT Planning
    </button>

    <button class="tab-btn" data-tab="sorPlanning">
      SOR Planning
    </button>
  `;

  injectCss();

  return wrap;
}

/* ----------------------------------- */

let done = false;

function injectCss() {
  if (done) return;
  done = true;

  const s =
    document.createElement(
      "style"
    );

  s.textContent = `
    .tabs-bar{
      display:flex;
      gap:8px;
      padding:10px 0;
      overflow:auto;
      scrollbar-width:none;
    }

    .tabs-bar::-webkit-scrollbar{
      display:none;
    }

    .tab-btn{
      border:none;
      padding:9px 14px;
      border-radius:10px;
      white-space:nowrap;
      font-size:12px;
      font-weight:700;
      cursor:pointer;
      background:#eef2f7;
    }

    .tab-btn--active{
      background:#111827;
      color:#fff;
    }
  `;

  document.head.appendChild(s);
}