// FILE: js/components/appShell.js

/* -----------------------------------
   APP SHELL
   Static layout only
----------------------------------- */

export function createAppShell() {
  const wrapper =
    document.createElement("div");

  wrapper.className =
    "app-shell";

  wrapper.innerHTML = `
    <!-- HEADER -->
    <header class="app-header-wrap">
      <div id="header-slot"></div>
    </header>

    <!-- FILTERS -->
    <section class="filters-wrap">
      <div id="filters-slot"></div>
    </section>

    <!-- TABS -->
    <nav class="tabs-wrap">
      <div id="tabs-slot"></div>
    </nav>

    <!-- MAIN -->
    <main class="app-main">
      <div class="app-main-inner">
        <div
          id="report-slot"
          class="report-view"
        ></div>
      </div>
    </main>

    <!-- FOOTER -->
    <footer class="app-footer">
      <div class="app-footer-inner">
        <div>
          Sales & Planning
        </div>

        <div>
          Built for analytics &
          planning
        </div>
      </div>
    </footer>
  `;

  return wrapper;
}