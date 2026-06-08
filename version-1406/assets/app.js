(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    ready(function () {
        var button = document.querySelector("[data-menu-button]");
        var mobileNav = document.querySelector("[data-mobile-nav]");
        if (button && mobileNav) {
            button.addEventListener("click", function () {
                mobileNav.classList.toggle("open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dotsBox = document.querySelector("[data-hero-dots]");
        if (slides.length && dotsBox) {
            var dots = Array.prototype.slice.call(dotsBox.querySelectorAll("button"));
            var current = 0;
            function showSlide(index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("active", i === current);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle("active", i === current);
                });
            }
            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    showSlide(index);
                });
            });
            showSlide(0);
            window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        var filterList = document.querySelector("[data-filter-list]");
        if (filterList) {
            var input = document.querySelector("[data-filter-input]");
            var year = document.querySelector("[data-filter-year]");
            var type = document.querySelector("[data-filter-type]");
            var cards = Array.prototype.slice.call(filterList.querySelectorAll(".movie-card"));
            function applyFilter() {
                var q = normalize(input && input.value);
                var y = normalize(year && year.value);
                var t = normalize(type && type.value);
                cards.forEach(function (card) {
                    var hay = normalize([
                        card.dataset.title,
                        card.dataset.genre,
                        card.dataset.region,
                        card.dataset.type,
                        card.dataset.keywords
                    ].join(" "));
                    var okQuery = !q || hay.indexOf(q) !== -1;
                    var okYear = !y || normalize(card.dataset.year) === y;
                    var okType = !t || normalize(card.dataset.type).indexOf(t) !== -1;
                    card.classList.toggle("hidden-card", !(okQuery && okYear && okType));
                });
            }
            [input, year, type].forEach(function (el) {
                if (el) {
                    el.addEventListener("input", applyFilter);
                    el.addEventListener("change", applyFilter);
                }
            });
        }

        var searchResults = document.querySelector("[data-search-results]");
        var searchInput = document.querySelector("[data-search-input]");
        if (searchResults && window.SEARCH_INDEX) {
            var params = new URLSearchParams(window.location.search);
            var qValue = params.get("q") || "";
            if (searchInput) {
                searchInput.value = qValue;
            }
            renderSearch(qValue);
        }
    });

    function renderSearch(query) {
        var box = document.querySelector("[data-search-results]");
        if (!box) {
            return;
        }
        var q = normalize(query);
        var source = window.SEARCH_INDEX || [];
        var results = source.filter(function (item) {
            if (!q) {
                return true;
            }
            var hay = normalize([
                item.title,
                item.year,
                item.region,
                item.type,
                item.genre,
                item.text
            ].join(" "));
            return hay.indexOf(q) !== -1;
        }).slice(0, 240);
        if (!results.length) {
            box.innerHTML = '<div class="empty-result">没有找到匹配影片，请换一个关键词。</div>';
            return;
        }
        box.innerHTML = results.map(function (item) {
            return '<article class="movie-card">' +
                '<a class="poster-wrap" href="' + escapeHtml(item.url) + '" aria-label="' + escapeHtml(item.title) + '">' +
                '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
                '<span class="poster-shine"></span>' +
                '<span class="type-badge">' + escapeHtml(item.type) + '</span>' +
                '</a>' +
                '<div class="movie-card-body">' +
                '<h3><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a></h3>' +
                '<p class="movie-meta">' + escapeHtml(item.year) + ' · ' + escapeHtml(item.region) + '</p>' +
                '<p class="movie-brief">' + escapeHtml(item.text) + '</p>' +
                '<div class="tag-row"><span>' + escapeHtml(item.genre) + '</span></div>' +
                '</div>' +
                '</article>';
        }).join("");
    }

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[char];
        });
    }

    window.setupMoviePlayer = function (videoId, source, overlayId) {
        ready(function () {
            var video = document.getElementById(videoId);
            var overlay = document.getElementById(overlayId);
            if (!video) {
                return;
            }
            var attached = false;
            var hls = null;
            function attachSource() {
                if (attached) {
                    return;
                }
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = source;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                    video.hlsInstance = hls;
                } else {
                    video.src = source;
                }
                attached = true;
            }
            function startPlay() {
                attachSource();
                if (overlay) {
                    overlay.classList.add("is-hidden");
                }
                var playPromise = video.play();
                if (playPromise && typeof playPromise.catch === "function") {
                    playPromise.catch(function () {});
                }
            }
            if (overlay) {
                overlay.addEventListener("click", startPlay);
            }
            video.addEventListener("click", function () {
                if (video.paused) {
                    startPlay();
                }
            });
            video.addEventListener("play", function () {
                if (overlay) {
                    overlay.classList.add("is-hidden");
                }
            });
            video.addEventListener("emptied", function () {
                if (hls && typeof hls.destroy === "function") {
                    hls.destroy();
                }
                hls = null;
                attached = false;
            });
        });
    };
})();
