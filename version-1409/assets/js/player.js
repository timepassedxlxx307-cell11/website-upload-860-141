import { H as Hls } from "./hls-dru42stk.js";

const initPlayers = function () {
    const shells = Array.from(document.querySelectorAll(".video-shell"));

    shells.forEach(function (shell) {
        const video = shell.querySelector("video");
        const button = shell.querySelector(".player-overlay");
        if (!video) {
            return;
        }

        const url = video.getAttribute("data-video-url") || "";
        let loaded = false;
        let hls = null;

        const load = function () {
            if (loaded || !url) {
                return;
            }
            loaded = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = url;
                return;
            }

            if (Hls && Hls.isSupported()) {
                hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(url);
                hls.attachMedia(video);
                return;
            }

            video.src = url;
        };

        const play = function () {
            load();
            const action = video.play();
            shell.classList.add("is-playing");
            if (action && typeof action.catch === "function") {
                action.catch(function () {
                    shell.classList.remove("is-playing");
                });
            }
        };

        if (button) {
            button.addEventListener("click", play);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });

        video.addEventListener("play", function () {
            shell.classList.add("is-playing");
        });

        video.addEventListener("pause", function () {
            if (!video.ended) {
                shell.classList.remove("is-playing");
            }
        });

        video.addEventListener("ended", function () {
            shell.classList.remove("is-playing");
        });

        window.addEventListener("pagehide", function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    });
};

if (document.readyState !== "loading") {
    initPlayers();
} else {
    document.addEventListener("DOMContentLoaded", initPlayers);
}
