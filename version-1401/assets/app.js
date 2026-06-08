(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  function normalize(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function applyFilter(input) {
    var scope = input.closest("main") || document;
    var cards = scope.querySelectorAll("[data-filter-card]");
    var query = normalize(input.value);
    cards.forEach(function (card) {
      var haystack = normalize(card.getAttribute("data-search"));
      card.classList.toggle("is-hidden", query && haystack.indexOf(query) === -1);
    });
  }

  function setupFilters() {
    document.querySelectorAll("[data-card-filter-input]").forEach(function (input) {
      input.addEventListener("input", function () {
        applyFilter(input);
      });
    });

    var searchInput = document.querySelector("[data-search-page-input]");
    if (searchInput) {
      var params = new URLSearchParams(window.location.search);
      var keyword = params.get("q") || "";
      searchInput.value = keyword;
      applyFilter(searchInput);
    }
  }

  function setupMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("is-open");
      button.textContent = nav.classList.contains("is-open") ? "×" : "☰";
    });
  }

  function setupHero() {
    var carousel = document.querySelector("[data-hero-carousel]");
    if (!carousel) {
      return;
    }
    var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
    var index = 0;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
  }

  ready(function () {
    setupMenu();
    setupFilters();
    setupHero();
  });
})();
