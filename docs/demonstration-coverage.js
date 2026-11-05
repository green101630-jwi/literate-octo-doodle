(() => {
  "use strict";

  function initialize() {
    document.querySelectorAll("[data-demo-coverage]").forEach((root) => {
      const controls = root.querySelector("[data-demo-coverage-tabs]");
      const tabs = Array.from(root.querySelectorAll("[data-demo-coverage-tab]"));
      const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));
      if (!controls || !tabs.length || panels.some((panel) => !panel || !root.contains(panel))) return;

      function selectTab(index, focus = false) {
        tabs.forEach((tab, tabIndex) => {
          const selected = tabIndex === index;
          tab.setAttribute("aria-selected", String(selected));
          tab.tabIndex = selected ? 0 : -1;
          panels[tabIndex].hidden = !selected;
        });
        if (focus) tabs[index].focus();
      }

      tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => selectTab(index));
        tab.addEventListener("keydown", (event) => {
          let next;
          if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
          else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = tabs.length - 1;
          else return;
          event.preventDefault();
          selectTab(next, true);
        });
      });

      selectTab(0);
      controls.hidden = false;
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
