// REPLACE FILE
// FILE: js/components/kpiCards.js

/* -----------------------------------
   KPI GRID
   Premium responsive UI
----------------------------------- */

export function createKpiGrid(
  items = []
) {
  const wrap =
    document.createElement(
      "div"
    );

  wrap.className =
    "kpi-grid";

  wrap.innerHTML =
    items
      .map(
        (item) => `
      <div class="kpi-card">
        <div class="kpi-top">
          <div class="kpi-icon">
            ${
              item.icon ||
              "•"
            }
          </div>

          <div class="kpi-label">
            ${
              item.label
            }
          </div>
        </div>

        <div class="kpi-value">
          ${fmt(
            item.value,
            item.format
          )}
        </div>
      </div>
    `
      )
      .join("");

  injectCss();

  return wrap;
}

/* -----------------------------------
   FORMAT
----------------------------------- */

function fmt(
  value,
  type
) {
  const n =
    Number(value) || 0;

  if (
    type ===
    "currency"
  ) {
    return (
      "₹" +
      n.toLocaleString(
        "en-IN",
        {
          maximumFractionDigits: 0
        }
      )
    );
  }

  if (
    type ===
    "percent"
  ) {
    return (
      n.toFixed(
        2
      ) + "%"
    );
  }

  return n.toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2
    }
  );
}

/* -----------------------------------
   CSS
----------------------------------- */

let done = false;

function injectCss() {
  if (done) return;
  done = true;

  const style =
    document.createElement(
      "style"
    );

  style.textContent = `
    .kpi-grid{
      display:grid;
      grid-template-columns:
        repeat(3,minmax(0,1fr));
      gap:14px;
      margin-bottom:16px;
    }

    .kpi-card{
      background:#ffffff;
      border:1px solid #e5e7eb;
      border-radius:16px;
      padding:14px;
      box-shadow:
        0 4px 14px rgba(15,23,42,.05);
      min-height:92px;
      display:flex;
      flex-direction:column;
      justify-content:space-between;
    }

    .kpi-top{
      display:flex;
      align-items:center;
      gap:10px;
    }

    .kpi-icon{
      width:34px;
      height:34px;
      border-radius:12px;
      background:#f1f5f9;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:16px;
    }

    .kpi-label{
      font-size:12px;
      font-weight:700;
      color:#64748b;
      letter-spacing:.2px;
    }

    .kpi-value{
      font-size:24px;
      line-height:1.1;
      font-weight:800;
      color:#0f172a;
      margin-top:8px;
    }

    @media(max-width:900px){
      .kpi-grid{
        grid-template-columns:
          repeat(2,minmax(0,1fr));
      }

      .kpi-value{
        font-size:20px;
      }
    }
  `;

  document.head.appendChild(
    style
  );
}