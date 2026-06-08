document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".player-shell").forEach(function (shell) {
    var video = shell.querySelector("video");
    var overlay = shell.querySelector(".player-overlay");
    var videoUrl = shell.getAttribute("data-video-url") || "";
    var hlsInstance = null;
    var isReady = false;

    var prepare = function () {
      if (!video || !videoUrl || isReady) {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoUrl;
        isReady = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(videoUrl);
        hlsInstance.attachMedia(video);
        isReady = true;
        return;
      }

      video.src = videoUrl;
      isReady = true;
    };

    var play = function () {
      prepare();
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      if (video) {
        video.controls = true;
        var playRequest = video.play();
        if (playRequest && typeof playRequest.catch === "function") {
          playRequest.catch(function () {});
        }
      }
    };

    if (overlay) {
      overlay.addEventListener("click", play);
    }

    if (video) {
      video.addEventListener("click", function () {
        if (!isReady) {
          play();
        }
      });

      video.addEventListener("play", function () {
        if (overlay) {
          overlay.classList.add("is-hidden");
        }
      });
    }

    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
});
