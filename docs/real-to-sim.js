(() => {
  "use strict";
  document.querySelectorAll("[data-real-to-sim]").forEach(root => {
    const video = root.querySelector("video");
    const modes = root.querySelector(".real-to-sim-modes");
    const buttons = Array.from(root.querySelectorAll("[data-demo-view]"));
    if (!video || !modes || !buttons.length) return;
    let selected = "overlay";
    let pending = null;
    let loadController = null;
    modes.hidden = false;
    buttons.forEach(button => button.addEventListener("click", () => {
      if (button.dataset.demoView === selected) return;
      const state = pending || {
        time: Number.isFinite(video.currentTime) ? video.currentTime : 0,
        playing: !video.paused && !video.ended,
        rate: video.playbackRate
      };
      pending = state;
      video.pause();
      loadController?.abort();
      loadController = new AbortController();
      const controller = loadController;
      selected = button.dataset.demoView;
      buttons.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
      video.addEventListener("loadedmetadata", () => {
        if (controller.signal.aborted) return;
        video.currentTime = Math.min(state.time, Number.isFinite(video.duration) ? Math.max(0, video.duration - .01) : state.time);
        video.playbackRate = state.rate;
        pending = null;
        if (state.playing) {
          video.play()?.catch(() => {});
        }
      }, { once: true, signal: controller.signal });
      video.removeAttribute("poster");
      video.src = button.dataset.videoSrc;
      video.load();
    }));
  });
})();
