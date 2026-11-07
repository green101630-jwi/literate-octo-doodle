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
    const emptyToggle = root.querySelector("[data-policy-empty-toggle]");
    let activeFilter = "all";
    let showEmpty = false;
    const wiredVideos = new WeakSet();
    const locale = () => document.documentElement.lang.startsWith("ko") ? "ko" : "en";

    function wireVideo(video) {
      if (wiredVideos.has(video)) return;
      wiredVideos.add(video);
      video.addEventListener("play", () => {
        document.querySelectorAll("video").forEach((other) => {
          if (other !== video && !other.paused) other.pause();
        });
      });
    }

    function updateLanguage() {
      const korean = locale() === "ko";
      if (filterBar) filterBar.setAttribute("aria-label", korean ? "영상 환경 선택" : "Filter videos by environment");
      if (emptyToggle) {
        emptyToggle.setAttribute("aria-pressed", String(showEmpty));
        emptyToggle.textContent = korean ? (showEmpty ? "미등록 슬롯 숨기기" : "미등록 슬롯 보기") : (showEmpty ? "Hide unregistered slots" : "Show unregistered slots");
      }
      if (status) {
        const visible = cards.filter((card) => !card.hidden);
        const count = visible.filter((card) => card.dataset.policyState === "available").length;
        const emptyCount = visible.length - count;
        status.textContent = korean ? `${count}개 영상 표시` : `${count} videos shown`;
        if (emptyCount) status.textContent += korean ? ` · 미등록 슬롯 ${emptyCount}개` : ` · ${emptyCount} unregistered slots`;
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
      cards.forEach((card) => {
        const matchesEnvironment = activeFilter === "all" || card.dataset.environment === activeFilter;
        card.hidden = !matchesEnvironment || (card.dataset.policyState !== "available" && !showEmpty);
        if (card.hidden) card.querySelectorAll("video").forEach((video) => video.pause());
      });
      groups.forEach((group) => {
        group.hidden = !Array.from(group.querySelectorAll("[data-policy-slot]")).some((card) => !card.hidden);
      });
      if (emptyToggle) emptyToggle.hidden = !cards.some((card) => card.dataset.policyState !== "available");
      updateLanguage();
    }

    function revealSlotFromHash() {
      let target;
      try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); }
      catch { return; }
      if (!target || !cards.includes(target)) return;
      if (target.dataset.policyState !== "available") showEmpty = true;
      applyFilter(activeFilter === "all" ? "all" : target.dataset.environment);
      requestAnimationFrame(() => target.scrollIntoView({ block: "start", behavior: "auto" }));
    }

    // Static sources keep registered videos usable even if the manifest cannot load.
    cards.forEach((card) => {
      const video = card.querySelector("video[data-policy-video]");
      card.dataset.policyState = video?.querySelector("source[src]") ? "available" : "empty";
      if (video) wireVideo(video);
    });
    filters.forEach((button) => button.addEventListener("click", () => applyFilter(button.dataset.policyFilter)));
    if (emptyToggle) emptyToggle.addEventListener("click", () => {
      showEmpty = !showEmpty;
      applyFilter(activeFilter);
    });
    if (filterBar) filterBar.hidden = false;
    applyFilter("all");
    window.addEventListener("hashchange", revealSlotFromHash);
    revealSlotFromHash();
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
      if (entry.environment !== card.dataset.environment || entry.policy !== card.dataset.policy || entry.task !== card.dataset.task) return;
      const frame = card.querySelector("[data-policy-frame]");
      if (!frame) return;
      const sourceURL = mediaURL(entry.src);
      if (!sourceURL) {
        card.dataset.policyState = "empty";
        const previousVideo = frame.querySelector("video");
        if (previousVideo) {
          previousVideo.pause();
          const placeholder = document.createElement("div");
          placeholder.className = "policy-video-placeholder";
          const label = document.createElement("span");
          label.className = "policy-video-placeholder-label";
          label.textContent = `${card.dataset.environment === "sim" ? "Sim" : "Real"} · ${card.dataset.policyLabel} · ${card.dataset.taskLabel}`;
          const description = document.createElement("p");
          appendLocalized(description, { en: "No video registered", ko: "미등록 슬롯" });
          placeholder.append(label, description);
          frame.replaceChildren(placeholder);
        }
        return;
      }
      card.dataset.policyState = "available";

      const video = frame.querySelector("video[data-policy-video]") || document.createElement("video");
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.dataset.policyVideo = entry.id;
      video.setAttribute("playsinline", "");
      const posterURL = mediaURL(entry.poster);
      if (posterURL) video.poster = posterURL;
      const source = video.querySelector("source") || document.createElement("source");
      if (source.src !== sourceURL) source.src = sourceURL;
      const types = { mp4: "video/mp4", webm: "video/webm", ogv: "video/ogg" };
      const extension = new URL(sourceURL).pathname.split(".").pop().toLowerCase();
      if (types[extension]) source.type = types[extension];
      if (!video.contains(source)) video.append(source);
      wireVideo(video);
      if (!frame.contains(video)) frame.replaceChildren(video);

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
        applyFilter(activeFilter);
      })
      .catch(() => {
        // Registered static players, empty-slot toggling and filters remain usable.
      });
  }

  function initialize() {
    document.querySelectorAll("[data-policy-gallery]").forEach(initializeGallery);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
