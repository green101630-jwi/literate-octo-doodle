(() => {
  "use strict";
  const dialog = document.getElementById("smolvla-diagram-modal");
  const image = document.getElementById("smolvla-diagram-image");
  const title = document.getElementById("smolvla-diagram-title");
  const viewport = dialog?.querySelector(".smolvla-modal-viewport");
  const close = dialog?.querySelector(".smolvla-modal-close");
  if (!dialog || !image || !title || !viewport || !close) return;
  let trigger = null;
  document.querySelectorAll("[data-smolvla-diagram]").forEach(button => {
    button.addEventListener("click", () => {
      const article = button.closest(".smolvla-model");
      const lang = document.documentElement.lang === "ko" ? "ko" : "en";
      const label = article.querySelector(`h3 [data-locale="${lang}"]`)?.textContent || "SmolVLA";
      if (typeof dialog.showModal !== "function") {
        article.querySelector(".smolvla-diagram-scroll")?.focus();
        return;
      }
      trigger = button;
      title.textContent = article.querySelector(".smolvla-model-number").textContent + " · " + label;
      image.src = button.dataset.smolvlaDiagram;
      image.alt = article.querySelector("figure img").alt;
      dialog.showModal();
      viewport.scrollLeft = 0;
      viewport.scrollTop = 0;
      close.focus();
    });
  });
  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    image.removeAttribute("src");
    trigger?.focus({preventScroll:true});
    trigger = null;
  });
})();
