(function () {
    const ready = function (fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    };

    ready(function () {
        const menuButton = document.querySelector(".mobile-menu-button");
        const mobilePanel = document.querySelector(".mobile-panel");
        if (menuButton && mobilePanel) {
            menuButton.addEventListener("click", function () {
                const expanded = menuButton.getAttribute("aria-expanded") === "true";
                menuButton.setAttribute("aria-expanded", String(!expanded));
                mobilePanel.hidden = expanded;
                document.body.classList.toggle("menu-open", !expanded);
            });
        }

        const slides = Array.from(document.querySelectorAll(".hero-slide"));
        if (slides.length > 0) {
            const prev = document.querySelector(".hero-prev");
            const next = document.querySelector(".hero-next");
            const dots = Array.from(document.querySelectorAll("[data-hero-dot]"));
            let current = 0;
            let timer = null;

            const show = function (index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("is-active", i === current);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle("active", i === current);
                });
            };

            const start = function () {
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5000);
            };

            const reset = function () {
                if (timer) {
                    window.clearInterval(timer);
                }
                start();
            };

            if (prev) {
                prev.addEventListener("click", function () {
                    show(current - 1);
                    reset();
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    show(current + 1);
                    reset();
                });
            }

            dots.forEach(function (dot, i) {
                dot.addEventListener("click", function () {
                    show(i);
                    reset();
                });
            });

            show(0);
            start();
        }

        const results = document.getElementById("search-results");
        if (results && Array.isArray(window.SEARCH_MOVIES)) {
            const params = new URLSearchParams(window.location.search);
            const input = document.getElementById("movie-search-input");
            const typeFilter = document.getElementById("type-filter");
            const yearFilter = document.getElementById("year-filter");
            const sortFilter = document.getElementById("sort-filter");
            const categoryButtons = Array.from(document.querySelectorAll("[data-search-category]"));
            let activeCategory = "all";

            if (input) {
                input.value = params.get("q") || "";
            }

            const clear = function (node) {
                while (node.firstChild) {
                    node.removeChild(node.firstChild);
                }
            };

            const make = function (tag, className) {
                const el = document.createElement(tag);
                if (className) {
                    el.className = className;
                }
                return el;
            };

            const addText = function (node, value) {
                node.textContent = value == null ? "" : String(value);
            };

            const renderCard = function (movie) {
                const article = make("article", "movie-card");
                const link = make("a", "poster-link");
                link.href = movie.url;

                const img = document.createElement("img");
                img.src = movie.cover;
                img.alt = movie.title;
                img.loading = "lazy";
                link.appendChild(img);

                const badge = make("span", "rating-badge");
                addText(badge, movie.rating);
                link.appendChild(badge);
                article.appendChild(link);

                const body = make("div", "movie-card-body");
                const meta = make("div", "movie-meta");
                [movie.year, movie.region, movie.type].forEach(function (item) {
                    const span = document.createElement("span");
                    addText(span, item);
                    meta.appendChild(span);
                });
                body.appendChild(meta);

                const h3 = document.createElement("h3");
                const titleLink = document.createElement("a");
                titleLink.href = movie.url;
                addText(titleLink, movie.title);
                h3.appendChild(titleLink);
                body.appendChild(h3);

                const p = document.createElement("p");
                addText(p, movie.oneLine);
                body.appendChild(p);

                const tagRow = make("div", "tag-row");
                movie.tags.slice(0, 4).forEach(function (tag) {
                    const span = document.createElement("span");
                    addText(span, tag);
                    tagRow.appendChild(span);
                });
                body.appendChild(tagRow);
                article.appendChild(body);
                return article;
            };

            const render = function () {
                const keyword = input ? input.value.trim().toLowerCase() : "";
                const typeValue = typeFilter ? typeFilter.value : "all";
                const yearValue = yearFilter ? yearFilter.value : "all";
                const sortValue = sortFilter ? sortFilter.value : "hot";

                let list = window.SEARCH_MOVIES.filter(function (movie) {
                    const haystack = [
                        movie.title,
                        movie.oneLine,
                        movie.summary,
                        movie.region,
                        movie.type,
                        movie.genre,
                        movie.categoryName,
                        movie.tags.join(" ")
                    ].join(" ").toLowerCase();
                    const keywordOk = !keyword || haystack.indexOf(keyword) !== -1;
                    const categoryOk = activeCategory === "all" || movie.category === activeCategory;
                    const typeOk = typeValue === "all" || movie.type.indexOf(typeValue) !== -1;
                    const yearOk = yearValue === "all" || String(movie.year) === yearValue;
                    return keywordOk && categoryOk && typeOk && yearOk;
                });

                list.sort(function (a, b) {
                    if (sortValue === "rating") {
                        return b.rating - a.rating || b.views - a.views;
                    }
                    if (sortValue === "year") {
                        return b.year - a.year || b.views - a.views;
                    }
                    return b.views - a.views || b.rating - a.rating;
                });

                clear(results);
                if (list.length === 0) {
                    const empty = make("div", "empty-state");
                    addText(empty, "暂无匹配影片，请调整关键词或筛选条件。 ");
                    results.appendChild(empty);
                    return;
                }
                list.slice(0, 180).forEach(function (movie) {
                    results.appendChild(renderCard(movie));
                });
            };

            categoryButtons.forEach(function (button) {
                button.addEventListener("click", function () {
                    activeCategory = button.getAttribute("data-search-category") || "all";
                    categoryButtons.forEach(function (item) {
                        item.classList.toggle("active", item === button);
                    });
                    render();
                });
            });

            [input, typeFilter, yearFilter, sortFilter].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", render);
                    control.addEventListener("change", render);
                }
            });

            render();
        }
    });
})();
