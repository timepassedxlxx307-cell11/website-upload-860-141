(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    document.querySelectorAll("[data-player]").forEach(function (box) {
      var video = box.querySelector("video");
      var button = box.querySelector(".player-button");
      var stream = box.getAttribute("data-stream");
      var started = false;
      var hls = null;

      function run() {
        if (!video || !stream) {
          return;
        }
        if (started) {
          if (video.paused) {
            video.play().catch(function () {});
          }
          return;
        }
        started = true;
        box.classList.add("is-playing");
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true });
          hls.loadSource(stream);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal && hls) {
              hls.destroy();
              hls = null;
              video.src = stream;
              video.play().catch(function () {});
            }
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
          video.addEventListener("loadedmetadata", function () {
            video.play().catch(function () {});
          }, { once: true });
        } else {
          video.src = stream;
          video.play().catch(function () {});
        }
      }

      if (button) {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();
          run();
        });
      }

      if (video) {
        video.addEventListener("click", function () {
          if (!started) {
            run();
          }
        });
      }
    });
  });
})();
