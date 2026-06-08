(function () {
  function prepare(video, source) {
    if (video.getAttribute("data-ready") === "1") {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      video._hls = hls;
    } else {
      video.src = source;
    }

    video.setAttribute("data-ready", "1");
  }

  window.bindMoviePlayer = function (options) {
    var video = document.getElementById(options.videoId);
    var cover = document.getElementById(options.coverId);
    var frame = document.getElementById(options.frameId);

    if (!video || !cover || !frame) {
      return;
    }

    function begin() {
      prepare(video, options.source);
      frame.classList.add("is-playing");
      var playTask = video.play();
      if (playTask && typeof playTask.catch === "function") {
        playTask.catch(function () {
          frame.classList.remove("is-playing");
        });
      }
    }

    cover.addEventListener("click", begin);
    frame.addEventListener("click", function (event) {
      if (event.target === frame || event.target === video) {
        begin();
      }
    });
    video.addEventListener("play", function () {
      frame.classList.add("is-playing");
    });
  };
})();
