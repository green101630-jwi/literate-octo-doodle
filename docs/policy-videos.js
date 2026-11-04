(() => {
  "use strict";

  const fieldLabels = {
    success_rate: ["Success rate", "성공률"],
    model: ["Model", "모델"],
    checkpoint: ["Checkpoint", "체크포인트"],
    dataset: ["Dataset", "데이터셋"],
    condition: ["Condition", "실험 조건"],
    observation: ["Observation", "관측"],
    seed: ["Seed", "시드"],
    notes: ["Notes", "설명"],
  };

  function appendLocalized(parent, value) {
    if (typeof value === "number" && Number.isFinite(value)) value = String(value);
    if (typeof value === "string" && value.trim()) {
      parent.textContent = value;
      return true;
    }
    if (!value || typeof value !== "object") return false;
    const english = typeof value.en === "string" ? value.en.trim() : "";
    const korean = typeof value.ko === "string" ? value.ko.trim() : "";
    if (!english && !korean) return false;
    ["en", "ko"].forEach((locale) => {
      const span = document.createElement("span");
      span.dataset.locale = locale;
      span.textContent = locale === "en" ? english || korean : korean || english;
      parent.append(span);
    });
    return true;
  }

  function initializeGallery(root) {
    const groups = Array.from(root.querySelectorAll("[data-policy-environment]"));
    const cards = Array.from(root.querySelectorAll("[data-policy-slot]"));
    const filterBar = root.querySelector("[data-policy-filters]");
    const filters = Array.from(root.querySelectorAll("[data-policy-filter]"));
    const status = root.querySelector("[data-policy-filter-status]");
    let activeFilter = "all";
    const locale = () => document.documentElement.lang.startsWith("ko") ? "ko" : "en";

    function updateLanguage() {
      const korean = locale() === "ko";
      if (filterBar) filterBar.setAttribute("aria-label", korean ? "영상 환경 선택" : "Filter videos by environment");
      if (status) {
        const count = cards.filter((card) => activeFilter === "all" || card.dataset.environment === activeFilter).length;
        status.textContent = korean ? `${count}개 영상 공간 표시` : `${count} video slots shown`;
      }
      root.querySelectorAll("video[data-policy-video]").forEach((video) => {
        const card = video.closest("[data-policy-slot]");
        const environment = card.dataset.environment === "sim" ? (korean ? "시뮬레이션" : "Simulation") : (korean ? "실로봇" : "Real robot");
        video.setAttribute("aria-label", `${environment} · ${card.dataset.policyLabel} · ${card.dataset.taskLabel}${korean ? " 정책 영상" : " policy video"}`);
      });
    }

    function applyFilter(value) {
      activeFilter = ["all", "sim", "real"].includes(value) ? value : "all";
      filters.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.policyFilter === activeFilter)));
      groups.forEach((group) => {
        group.hidden = activeFilter !== "all" && group.dataset.policyEnvironment !== activeFilter;
        if (group.hidden) group.querySelectorAll("video").forEach((video) => video.pause());
      });
      updateLanguage();
    }

    filters.forEach((button) => button.addEventListener("click", () => applyFilter(button.dataset.policyFilter)));
    if (filterBar) filterBar.hidden = false;
    applyFilter("all");
    if ("MutationObserver" in window) {
      new MutationObserver(updateLanguage).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    }

    const manifestPath = root.dataset.policyManifest;
    if (!manifestPath || typeof window.fetch !== "function") return;
    const manifestURL = new URL(manifestPath, document.baseURI);

    function mediaURL(value) {
      if (typeof value !== "string" || !value.trim()) return null;
      try {
        const url = new URL(value, manifestURL);
        return ["https:", "http:", "file:"].includes(url.protocol) ? url.href : null;
      } catch {
        return null;
      }
    }

    function populateCard(card, entry) {
      // Empty source entries retain the static placeholder without media requests.
      const sourceURL = mediaURL(entry.src);
      if (!sourceURL) return;
      if (entry.environment !== card.dataset.environment || entry.policy !== card.dataset.policy || entry.task !== card.dataset.task) return;
      const frame = card.querySelector("[data-policy-frame]");
      if (!frame) return;

      const video = document.createElement("video");
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.dataset.policyVideo = entry.id;
      video.setAttribute("playsinline", "");
      const posterURL = mediaURL(entry.poster);
      if (posterURL) video.poster = posterURL;
      const source = document.createElement("source");
      source.src = sourceURL;
      const types = { mp4: "video/mp4", webm: "video/webm", ogv: "video/ogg" };
      const extension = new URL(sourceURL).pathname.split(".").pop().toLowerCase();
      if (types[extension]) source.type = types[extension];
      video.append(source);
      video.addEventListener("play", () => {
        document.querySelectorAll("video").forEach((other) => {
          if (other !== video && !other.paused) other.pause();
        });
      });
      frame.replaceChildren(video);

      const caption = card.querySelector("[data-policy-caption]");
      if (caption && appendLocalized(caption, entry.caption)) caption.hidden = false;
      const metadata = card.querySelector("[data-policy-metadata]");
      if (metadata && entry.experiment && typeof entry.experiment === "object") {
        Object.entries(fieldLabels).forEach(([key, labels]) => {
          const description = document.createElement("dd");
          if (!appendLocalized(description, entry.experiment[key])) return;
          if (key === "success_rate") description.classList.add("policy-video-success-rate");
          const term = document.createElement("dt");
          appendLocalized(term, { en: labels[0], ko: labels[1] });
          metadata.append(term, description);
        });
        metadata.hidden = metadata.children.length === 0;
      }
    }

    fetch(manifestURL.href, { credentials: "same-origin", cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((manifest) => {
        if (!manifest || !Array.isArray(manifest.slots)) return;
        const entries = new Map(manifest.slots.filter((entry) => entry && typeof entry.id === "string").map((entry) => [entry.id, entry]));
        cards.forEach((card) => {
          const entry = entries.get(card.dataset.policySlot);
          if (entry) populateCard(card, entry);
        });
        updateLanguage();
      })
      .catch(() => {
        // Static slots and environment filtering remain usable if JSON is unavailable.
      });
  }

  function initialize() {
    document.querySelectorAll("[data-policy-gallery]").forEach(initializeGallery);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
