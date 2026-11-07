(() => {
  "use strict";
  document.querySelectorAll(".project-photo-details").forEach((details) => {
    details.addEventListener("toggle", () => {
      if (!details.open) details.querySelectorAll("video").forEach((video) => video.pause());
    });
  });
})();
