(function () {
  const player = document.querySelector('[data-player]');

  if (!player) {
    return;
  }

  const video = player.querySelector('video');
  const cover = player.querySelector('[data-play-layer]');
  const streamUrl = player.getAttribute('data-stream');
  let attached = false;
  let hls = null;

  const attachStream = function () {
    if (!video || !streamUrl || attached) {
      return;
    }

    attached = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      return;
    }

    video.src = streamUrl;
  };

  const startPlayback = function () {
    attachStream();

    if (cover) {
      cover.classList.add('is-hidden');
    }

    const playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  };

  if (cover) {
    cover.addEventListener('click', startPlayback);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        startPlayback();
      }
    });

    video.addEventListener('play', function () {
      if (cover) {
        cover.classList.add('is-hidden');
      }
    });

    attachStream();
  }

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
})();
