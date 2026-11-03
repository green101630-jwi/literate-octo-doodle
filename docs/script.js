(() => {
  "use strict";

  function initializePortfolio() {
    const navigation = document.getElementById("main-nav");
    const menuToggle = document.querySelector(".menu-toggle");

    function setMenuOpen(isOpen) {
      if (!navigation || !menuToggle) return;
      navigation.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    }

    if (navigation && menuToggle) {
      setMenuOpen(false);
      menuToggle.addEventListener("click", () => {
        setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
      });
      navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenuOpen(false));
      });
      document.addEventListener("keydown", (event) => {
        if (
          event.key === "Escape" &&
          menuToggle.getAttribute("aria-expanded") === "true" &&
          !document.getElementById("chart-dialog")?.open
        ) {
          setMenuOpen(false);
          menuToggle.focus();
        }
      });
    }

    const tabs = Array.from(document.querySelectorAll("[data-tab]")).filter(
      (tab) => tab.id === "tab-comparison" || tab.id === "tab-generalization"
    );
    const panels = new Map();
    tabs.forEach((tab) => {
      const panelId = tab.getAttribute("aria-controls") || `panel-${tab.dataset.tab}`;
      const panel = document.getElementById(panelId);
      if (panel) panels.set(tab, panel);
    });

    function selectTab(selectedTab, moveFocus = false) {
      tabs.forEach((tab) => {
        const isSelected = tab === selectedTab;
        tab.setAttribute("aria-selected", String(isSelected));
        tab.tabIndex = isSelected ? 0 : -1;
        const panel = panels.get(tab);
        if (panel) panel.hidden = !isSelected;
      });
      if (moveFocus) selectedTab.focus();
    }

    if (tabs.length) {
      const selected = tabs.find((tab) => tab.getAttribute("aria-selected") === "true");
      selectTab(selected || tabs[0]);
      tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => selectTab(tab));
        tab.addEventListener("keydown", (event) => {
          let nextIndex;
          switch (event.key) {
            case "ArrowLeft":
              nextIndex = (index - 1 + tabs.length) % tabs.length;
              break;
            case "ArrowRight":
              nextIndex = (index + 1) % tabs.length;
              break;
            case "Home":
              nextIndex = 0;
              break;
            case "End":
              nextIndex = tabs.length - 1;
              break;
            default:
              return;
          }
          event.preventDefault();
          selectTab(tabs[nextIndex], true);
        });
      });
    }

    const chartDialog = document.getElementById("chart-dialog");
    const chartImage = document.getElementById("chart-dialog-image");
    const chartTitle = document.getElementById("chart-dialog-title");
    const chartDownload = document.getElementById("chart-download");
    const chartClose = document.getElementById("chart-dialog-close");
    let chartTrigger = null;

    const dialogAvailable = Boolean(
      chartDialog && chartImage && chartTitle && chartDownload && chartClose &&
      typeof chartDialog.showModal === "function"
    );

    document.querySelectorAll("[data-chart]").forEach((button) => {
      button.addEventListener("click", () => {
        const source = button.dataset.chart;
        if (!source) return;
        if (!dialogAvailable) {
          window.open(source, "_blank", "noopener,noreferrer");
          return;
        }

        const title = button.dataset.title || "Research figure";
        chartTitle.textContent = title;
        chartImage.src = source;
        chartImage.alt = title;
        chartDownload.href = source;
        const filename = new URL(source, document.baseURI).pathname.split("/").pop();
        chartDownload.setAttribute("download", filename || "research-figure.svg");
        chartTrigger = button;

        try {
          if (!chartDialog.open) chartDialog.showModal();
          chartClose.focus();
        } catch {
          chartTrigger = null;
          window.open(source, "_blank", "noopener,noreferrer");
        }
      });
    });

    if (dialogAvailable) {
      chartClose.addEventListener("click", () => chartDialog.close());
      chartDialog.addEventListener("click", (event) => {
        if (event.target !== chartDialog) return;
        const bounds = chartDialog.getBoundingClientRect();
        if (
          event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom
        ) {
          chartDialog.close();
        }
      });
      chartDialog.addEventListener("close", () => {
        const previousTrigger = chartTrigger;
        chartTrigger = null;
        if (previousTrigger?.isConnected) previousTrigger.focus({ preventScroll: true });
      });
      // Native dialog behavior handles Escape and keeps focus within the modal.
    }

    const videos = Array.from(document.querySelectorAll("video"));
    videos.forEach((video) => {
      video.setAttribute("playsinline", "");
      video.addEventListener("play", () => {
        videos.forEach((otherVideo) => {
          if (otherVideo !== video && !otherVideo.paused) otherVideo.pause();
        });
      });
    });

    if (navigation) {
      const anchorIds = ["research", "results", "demonstrations", "deployment", "about"];
      const trackedAnchors = anchorIds.map((id) => ({
        id,
        anchor: document.getElementById(id),
        link: navigation.querySelector(`a[href="#${id}"]`),
      })).filter((item) => item.anchor && item.link);
      let activeId = "";
      let updatePending = false;

      function updateActiveNavigation() {
        updatePending = false;
        if (!trackedAnchors.length) return;
        let current = trackedAnchors[0];
        const readingLine = window.innerHeight * 0.28;
        trackedAnchors.forEach((item) => {
          if (item.anchor.getBoundingClientRect().top <= readingLine) current = item;
        });
        if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
          current = trackedAnchors[trackedAnchors.length - 1];
        }
        if (activeId === current.id) return;
        activeId = current.id;
        trackedAnchors.forEach((item) => {
          const isActive = item.id === activeId;
          item.link.classList.toggle("is-active", isActive);
          if (isActive) item.link.setAttribute("aria-current", "location");
          else item.link.removeAttribute("aria-current");
        });
      }

      function scheduleNavigationUpdate() {
        if (updatePending) return;
        updatePending = true;
        window.requestAnimationFrame(updateActiveNavigation);
      }

      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(scheduleNavigationUpdate, {
          rootMargin: "-15% 0px -65% 0px",
          threshold: 0,
        });
        trackedAnchors.forEach((item) => observer.observe(item.anchor));
      }
      // Scroll also covers zero-height anchors and browsers without the observer.
      window.addEventListener("scroll", scheduleNavigationUpdate, { passive: true });
      window.addEventListener("resize", scheduleNavigationUpdate);
      window.addEventListener("hashchange", scheduleNavigationUpdate);
      updateActiveNavigation();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePortfolio, { once: true });
  } else {
    initializePortfolio();
  }
})();
