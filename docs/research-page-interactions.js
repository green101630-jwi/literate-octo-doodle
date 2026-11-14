(() => {
  "use strict";
  function initialize() {
    // Research topic links now point to sections or expandable content in this page.
    function revealTarget() {
      if (!location.hash || location.hash.length < 2) return;
      let id;
      try { id = decodeURIComponent(location.hash.slice(1)); }
      catch { return; }
      const target = document.getElementById(id);
      if (!target) return;
      // Video cards can be hidden by the Sim/Real filter. Show the required group
      // before scrolling to an in-page video-slot anchor.
      const videoGroup = target.closest("[data-policy-environment]");
      if (videoGroup?.hidden) {
        const filterButton = document.querySelector('[data-policy-filter="' + videoGroup.dataset.policyEnvironment + '"]');
        filterButton?.click();
      }
      // Deep links can refer to content inside more than one folded record.
      // Open every enclosing disclosure before scrolling to the target.
      let current = target;
      let opened = false;
      while (current) {
        if (current.matches("details") && !current.open) {
          current.open = true;
          opened = true;
        }
        current = current.parentElement;
      }
      const child = target.matches("[data-reveal-disclosure]") ?
        target.querySelector(":scope > details.research-disclosure") : null;
      if (child && !child.open) { child.open = true; opened = true; }
      if (opened) requestAnimationFrame(() => target.scrollIntoView({block:"start",behavior:"auto"}));
    }
    window.addEventListener("hashchange", revealTarget);
    revealTarget();

    const main = document.getElementById("main");
    const controls = document.querySelector("[data-research-disclosure-controls]");
    if (main && controls) {
      const setAll = open => {
        main.querySelectorAll("details").forEach(detail => { detail.open = open; });
      };
      controls.querySelector("[data-research-expand-all]").addEventListener("click", () => setAll(true));
      controls.querySelector("[data-research-collapse-all]").addEventListener("click", () => setAll(false));
      const updateControlLanguage = () => {
        const lang = document.documentElement.lang === "ko" ? "ko" : "en";
        controls.setAttribute("aria-label", controls.getAttribute("data-label-" + lang));
      };
      updateControlLanguage();
      new MutationObserver(updateControlLanguage).observe(document.documentElement, {
        attributes: true, attributeFilter: ["lang"]
      });
      controls.hidden = false;

      // Closing all disclosures can leave the current fragment inside a fold.
      // Re-clicking that same link must reveal it and select its model/runtime tab.
      main.addEventListener("click", event => {
        if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        const link = event.target.closest("a[href]");
        if (!link) return;
        const destination = new URL(link.href, location.href);
        if (!destination.hash || destination.origin !== location.origin ||
            destination.pathname !== location.pathname || destination.search !== location.search ||
            destination.hash !== location.hash) return;
        requestAnimationFrame(() => window.dispatchEvent(new HashChangeEvent("hashchange", {
          oldURL: location.href, newURL: location.href
        })));
      });
    }

    const dialog = document.getElementById("research-figure-modal");
    const image = document.getElementById("research-figure-modal-image");
    const title = document.getElementById("research-figure-modal-title");
    const closeButton = document.getElementById("research-figure-modal-close");
    let lastTrigger = null;
    if (!dialog || !image || !title || !closeButton) return;
    const language = () => document.documentElement.lang === "ko" ? "ko" : "en";
    document.querySelectorAll("[data-research-figure]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const src = trigger.dataset.researchFigure;
        if (!src) return;
        const heading = trigger.closest(".research-figure")?.querySelector(".figure-heading h3, .figure-heading h4");
        const caption = heading?.querySelector('[data-locale="' + language() + '"]');
        const label = caption?.textContent || heading?.textContent?.trim() || "Research figure";
        if (typeof dialog.showModal !== "function") {
          // Older browsers: preserve access to the evidence without altering current tab.
          window.open(src, "_blank", "noopener,noreferrer");
          return;
        }
        lastTrigger = trigger;
        image.src = src;
        image.alt = label;
        title.textContent = label;
        dialog.showModal();
        closeButton.focus();
      });
    });
    closeButton.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right ||
          event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener("close", () => {
      image.removeAttribute("src");
      if (lastTrigger?.isConnected) lastTrigger.focus({preventScroll:true});
      lastTrigger = null;
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",initialize,{once:true});
  else initialize();
})();
