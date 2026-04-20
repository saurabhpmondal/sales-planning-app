// FILE: js/main.js

import { bootApplication } from "./bootstrap.js";

/* -----------------------------------
   APP ENTRY POINT
----------------------------------- */

(async function init() {
  try {
    await bootApplication();
  } catch (error) {
    console.error("Application boot failed:", error);

    const root = document.getElementById("app");

    if (root) {
      root.innerHTML = `
        <div style="
          min-height:100vh;
          display:grid;
          place-items:center;
          padding:24px;
          font-family:Inter,Arial,sans-serif;
          background:#f8fafc;
        ">
          <div style="
            width:min(100%,520px);
            background:#ffffff;
            border:1px solid #e2e8f0;
            border-radius:18px;
            padding:28px;
            box-shadow:0 10px 30px rgba(15,23,42,.08);
          ">
            <h1 style="
              margin:0 0 10px;
              font-size:22px;
              color:#0f172a;
            ">
              Sales & Planning
            </h1>

            <p style="
              margin:0 0 16px;
              color:#475569;
              font-size:14px;
              line-height:1.5;
            ">
              The application could not initialize properly.
            </p>

            <pre style="
              margin:0;
              padding:14px;
              border-radius:12px;
              background:#f8fafc;
              border:1px solid #e2e8f0;
              color:#dc2626;
              font-size:12px;
              white-space:pre-wrap;
              overflow:auto;
            ">${error?.message || "Unknown error"}</pre>
          </div>
        </div>
      `;
    }
  }
})();