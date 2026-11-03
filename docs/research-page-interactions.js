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
      const disclosure = target.matches("details") ? target :
        target.closest("details") || target.querySelector(":scope > details.research-disclosure");
      if (disclosure && !disclosure.open) {
        disclosure.open = true;
        requestAnimationFrame(() => target.scrollIntoView({block:"start",behavior:"auto"}));
      }
    }
    window.addEventListener("hashchange", revealTarget);
    revealTarget();

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
        const heading = trigger.closest(".research-figure")?.querySelector(".figure-heading h3");
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
