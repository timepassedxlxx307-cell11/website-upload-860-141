import { H as Hls } from "./hls.js";

function setStatus(player, text) {
  var status = player.querySelector("[data-player-status]");
  if (status) {
    status.textContent = text;
  }
}

function togglePlayback(video) {
  if (!video) {
    return;
  }

  if (video.paused) {
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function() {});
    }
  } else {
    video.pause();
  }
}

function initOnePlayer(player) {
  var video = player.querySelector("video");
  var source = player.getAttribute("data-src");
  var overlay = player.querySelector("[data-player-overlay]");
  var playButtons = player.querySelectorAll("[data-player-toggle]");
  var muteButton = player.querySelector("[data-player-mute]");
  var fullscreenButton = player.querySelector("[data-player-fullscreen]");

  if (!video || !source) {
    setStatus(player, "播放源加载中");
    return;
  }

  player.classList.add("is-paused");
  video.setAttribute("playsinline", "playsinline");

  if (Hls && Hls.isSupported()) {
    var hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });

    hls.loadSource(source);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, function() {
      setStatus(player, "点击播放");
    });

    hls.on(Hls.Events.ERROR, function(eventName, data) {
      if (data && data.fatal) {
        setStatus(player, "视频加载失败");
      }
    });
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = source;
    video.addEventListener("loadedmetadata", function() {
      setStatus(player, "点击播放");
    });
  } else {
    setStatus(player, "当前浏览器不支持该播放格式");
  }

  Array.prototype.forEach.call(playButtons, function(button) {
    button.addEventListener("click", function(event) {
      event.preventDefault();
      event.stopPropagation();
      togglePlayback(video);
    });
  });

  if (overlay) {
    overlay.addEventListener("click", function(event) {
      event.preventDefault();
      togglePlayback(video);
    });
  }

  video.addEventListener("click", function() {
    togglePlayback(video);
  });

  video.addEventListener("play", function() {
    player.classList.add("is-playing");
    player.classList.remove("is-paused");
    setStatus(player, "正在播放");
  });

  video.addEventListener("pause", function() {
    player.classList.remove("is-playing");
    player.classList.add("is-paused");
    setStatus(player, "已暂停");
  });

  video.addEventListener("ended", function() {
    player.classList.remove("is-playing");
    player.classList.add("is-paused");
    setStatus(player, "播放结束");
  });

  if (muteButton) {
    muteButton.addEventListener("click", function(event) {
      event.preventDefault();
      event.stopPropagation();
      video.muted = !video.muted;
      muteButton.textContent = video.muted ? "取消静音" : "静音";
    });
  }

  if (fullscreenButton) {
    fullscreenButton.addEventListener("click", function(event) {
      event.preventDefault();
      event.stopPropagation();
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (player.requestFullscreen) {
        player.requestFullscreen();
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", function() {
  Array.prototype.forEach.call(document.querySelectorAll("[data-player]"), initOnePlayer);
});
