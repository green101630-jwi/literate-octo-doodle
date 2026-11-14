(() => {
  "use strict";

  function init() {
    const root = document.getElementById("smolvla-training");
    let activePanel = null;
    const language = () => document.documentElement.lang === "ko" ? "ko" : "en";

    function updateLabels() {
      root?.querySelectorAll("[data-smolvla-label-en]").forEach(element => {
        const text = element.getAttribute("data-smolvla-label-" + language());
        if (text) element.setAttribute("aria-label", text);
      });
    }

    if (root && root.dataset.smolvlaEnhanced !== "true") {
      const tablist = root.querySelector("[data-smolvla-tabs]");
      const tabs = tablist ? Array.from(tablist.querySelectorAll('[role="tab"]')) : [];
      const panels = tabs.map(tab => document.getElementById(tab.getAttribute("aria-controls")));
      if (tabs.length && panels.every(panel => panel && root.contains(panel))) {
        function activate(index, options = {}) {
          if (index < 0 || index >= tabs.length) return;
          tabs.forEach((tab, i) => {
            const selected = i === index;
            tab.setAttribute("aria-selected", String(selected));
            tab.tabIndex = selected ? 0 : -1;
            panels[i].hidden = !selected;
          });
          activePanel = panels[index];
          if (options.focus) tabs[index].focus();
          if (options.hash) {
            try {
              const url = new URL(window.location.href);
              url.hash = activePanel.id;
              window.history.replaceState(window.history.state, "", url);
            } catch (_) {
              window.location.hash = activePanel.id;
            }
          }
          root.dispatchEvent(new CustomEvent("smolvla:modelchange", {
            bubbles: true, detail: {panelId: activePanel.id, model: index + 1}
          }));
        }

        function revealHash(scroll) {
          let id;
          try { id = decodeURIComponent(window.location.hash.slice(1)); }
          catch (_) { return; }
          if (!id) return;
          const target = document.getElementById(id);
          if (!target || !root.contains(target)) return;
          const index = panels.findIndex(panel => panel === target || panel.contains(target));
          if (index !== -1) activate(index);
          for (let node = target; node; node = node.parentElement) {
            if (node.tagName === "DETAILS") node.open = true;
          }
          if (scroll) window.requestAnimationFrame(() => {
            target.scrollIntoView({block: "start", behavior: "auto"});
          });
        }

        tabs.forEach((tab, index) => {
          tab.addEventListener("click", () => activate(index, {hash: true}));
          tab.addEventListener("keydown", event => {
            let next;
            if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
            else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
            else if (event.key === "Home") next = 0;
            else if (event.key === "End") next = tabs.length - 1;
            else return;
            event.preventDefault();
            activate(next, {focus: true, hash: true});
          });
        });
        activate(0);
        tablist.hidden = false;
        root.dataset.smolvlaEnhanced = "true";
        revealHash(true);
        window.addEventListener("hashchange", () => revealHash(true));
      }
    }

    updateLabels();

    // The selector works independently of the existing diagram dialog.
    const dialog = document.getElementById("smolvla-diagram-modal");
    const image = document.getElementById("smolvla-diagram-image");
    const title = document.getElementById("smolvla-diagram-title");
    const viewport = dialog?.querySelector(".smolvla-modal-viewport");
    const close = dialog?.querySelector(".smolvla-modal-close");
    let trigger = null;

    function updateDialogText() {
      if (!trigger || !image || !title) return;
      const article = trigger.closest(".smolvla-model");
      if (!article) return;
      const label = article.querySelector('[data-smolvla-model-title] [data-locale="' + language() + '"]')?.textContent ||
        article.querySelector("h3,h4")?.textContent || "SmolVLA";
      const number = article.querySelector(".smolvla-model-number")?.textContent || "SmolVLA";
      title.textContent = number + " · " + label;
      const original = article.querySelector("figure img");
      image.alt = original?.getAttribute("data-alt-" + language()) || original?.alt || label;
    }

    if (dialog && image && title && viewport && close && dialog.dataset.smolvlaReady !== "true") {
      dialog.dataset.smolvlaReady = "true";
      document.querySelectorAll("[data-smolvla-diagram]").forEach(button => {
        button.addEventListener("click", () => {
          const article = button.closest(".smolvla-model");
          if (!article) return;
          if (typeof dialog.showModal !== "function") {
            article.querySelector(".smolvla-diagram-scroll")?.focus();
            return;
          }
          trigger = button;
          updateDialogText();
          image.src = button.dataset.smolvlaDiagram;
          if (!dialog.open) dialog.showModal();
          viewport.scrollLeft = 0;
          viewport.scrollTop = 0;
          close.focus();
        });
      });
      close.addEventListener("click", () => dialog.close());
      dialog.addEventListener("click", event => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right ||
            event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
      });
      dialog.addEventListener("close", () => {
        image.removeAttribute("src");
        const returnTo = trigger && !trigger.closest("[hidden]") ? trigger :
          root?.querySelector('[role="tab"][aria-selected="true"]');
        trigger = null;
        returnTo?.focus({preventScroll: true});
      });
      root?.addEventListener("smolvla:modelchange", () => {
        if (dialog.open && trigger?.closest(".smolvla-model")?.hidden) dialog.close();
      });
    }

    new MutationObserver(() => {
      updateLabels();
      if (dialog?.open) updateDialogText();
    }).observe(document.documentElement, {attributes: true, attributeFilter: ["lang"]});
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once: true});
  else init();
})();
