
(function () {
  function initMoviePlayer(options) {
    var video = document.getElementById(options.videoId);
    var overlay = document.getElementById(options.overlayId);
    var button = document.getElementById(options.buttonId);
    var source = options.source;
    var attached = false;
    var attachPromise = null;

    if (!video || !source) {
      return;
    }

    function hideOverlay() {
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
    }

    function attachMedia() {
      if (attachPromise) {
        return attachPromise;
      }

      attachPromise = new Promise(function (resolve) {
        if (attached) {
          resolve();
          return;
        }

        attached = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
          resolve();
          return;
        }

        import("./hls.js")
          .then(function (module) {
            var Hls = module.H || module.default || window.Hls;
            if (Hls && Hls.isSupported && Hls.isSupported()) {
              var hls = new Hls({
                maxBufferLength: 30,
                enableWorker: true
              });
              hls.loadSource(source);
              hls.attachMedia(video);
              if (Hls.Events && Hls.Events.MANIFEST_PARSED) {
                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                  resolve();
                });
              } else {
                window.setTimeout(resolve, 400);
              }
              window.setTimeout(resolve, 1200);
            } else {
              video.src = source;
              resolve();
            }
          })
          .catch(function () {
            video.src = source;
            resolve();
          });
      });

      return attachPromise;
    }

    function startPlayback() {
      hideOverlay();
      attachMedia().then(function () {
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {});
        }
      });
    }

    if (overlay) {
      overlay.addEventListener("click", startPlayback);
    }

    if (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        startPlayback();
      });
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        startPlayback();
      }
    });

    video.addEventListener("play", hideOverlay);
  }

  window.initMoviePlayer = initMoviePlayer;
})();
