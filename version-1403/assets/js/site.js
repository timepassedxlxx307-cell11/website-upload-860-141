
(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var navToggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-main-nav]");

    if (navToggle && nav) {
      navToggle.addEventListener("click", function () {
        nav.classList.toggle("is-open");
        document.body.classList.toggle("nav-open", nav.classList.contains("is-open"));
      });
    }

    document.addEventListener(
      "error",
      function (event) {
        var target = event.target;
        if (target && target.matches && target.matches("img[data-cover]")) {
          target.remove();
        }
      },
      true
    );

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var activeIndex = 0;

      function showSlide(index) {
        if (!slides.length) {
          return;
        }
        activeIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === activeIndex);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === activeIndex);
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
        });
      });

      if (slides.length > 1) {
        window.setInterval(function () {
          showSlide(activeIndex + 1);
        }, 5200);
      }
    }

    var searchInput = document.querySelector("[data-search-input]");
    var filterSelect = document.querySelector("[data-filter-select]");
    var sortSelect = document.querySelector("[data-sort-select]");
    var movieList = document.querySelector("[data-movie-list]");
    var emptyState = document.querySelector("[data-empty-state]");

    if (searchInput && movieList) {
      var params = new URLSearchParams(window.location.search);
      var q = params.get("q");
      if (q) {
        searchInput.value = q;
      }

      function normalize(value) {
        return String(value || "").toLowerCase().replace(/\s+/g, "");
      }

      function cardText(card) {
        return normalize(
          [
            card.getAttribute("data-title"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-tags"),
            card.getAttribute("data-year"),
            card.getAttribute("data-category"),
            card.textContent
          ].join(" ")
        );
      }

      function filterCards() {
        var query = normalize(searchInput.value);
        var filterValue = filterSelect ? filterSelect.value : "all";
        var visible = 0;
        var cards = Array.prototype.slice.call(movieList.querySelectorAll("[data-movie-card]"));

        cards.forEach(function (card) {
          var haystack = cardText(card);
          var matchesQuery = !query || haystack.indexOf(query) !== -1;
          var matchesFilter =
            filterValue === "all" ||
            normalize(card.getAttribute("data-genre")).indexOf(normalize(filterValue)) !== -1 ||
            normalize(card.getAttribute("data-category")) === normalize(filterValue);
          var shouldShow = matchesQuery && matchesFilter;
          card.classList.toggle("is-hidden", !shouldShow);
          if (shouldShow) {
            visible += 1;
          }
        });

        if (emptyState) {
          emptyState.hidden = visible !== 0;
        }
      }

      function sortCards() {
        if (!sortSelect) {
          return;
        }
        var value = sortSelect.value;
        var cards = Array.prototype.slice.call(movieList.querySelectorAll("[data-movie-card]"));
        cards.sort(function (a, b) {
          if (value === "year-desc") {
            return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
          }
          if (value === "year-asc") {
            return Number(a.getAttribute("data-year")) - Number(b.getAttribute("data-year"));
          }
          if (value === "title") {
            return String(a.getAttribute("data-title")).localeCompare(String(b.getAttribute("data-title")), "zh-Hans-CN");
          }
          return Number(b.getAttribute("data-hot")) - Number(a.getAttribute("data-hot"));
        });
        cards.forEach(function (card) {
          movieList.appendChild(card);
        });
      }

      searchInput.addEventListener("input", filterCards);
      if (filterSelect) {
        filterSelect.addEventListener("change", filterCards);
      }
      if (sortSelect) {
        sortSelect.addEventListener("change", function () {
          sortCards();
          filterCards();
        });
      }

      sortCards();
      filterCards();
    }
  });
})();
