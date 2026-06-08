(function() {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function initMobileMenu() {
    var button = qs("[data-menu-button]");
    var panel = qs("[data-mobile-panel]");
    if (!button || !panel) {
      return;
    }

    button.addEventListener("click", function() {
      var isOpen = panel.classList.toggle("open");
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    qsa("a", panel).forEach(function(link) {
      link.addEventListener("click", function() {
        panel.classList.remove("open");
        button.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initGlobalSearch() {
    qsa("[data-global-search]").forEach(function(form) {
      form.addEventListener("submit", function(event) {
        event.preventDefault();
        var input = qs("input[type='search']", form);
        var query = input ? input.value.trim() : "";
        if (query) {
          window.location.href = "./search.html?q=" + encodeURIComponent(query);
        } else {
          window.location.href = "./search.html";
        }
      });
    });
  }

  function initHero() {
    var hero = qs("[data-hero]");
    if (!hero) {
      return;
    }

    var slides = qsa("[data-hero-slide]", hero);
    var dots = qsa("[data-hero-dot]", hero);
    if (!slides.length) {
      return;
    }

    var current = 0;
    var timer = null;

    function activate(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function() {
        activate(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function(dot, index) {
      dot.addEventListener("click", function() {
        activate(index);
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);

    activate(0);
    start();
  }

  function normalize(value) {
    return (value || "").toString().toLowerCase();
  }

  function initSearchPage() {
    var page = qs("[data-search-page]");
    if (!page) {
      return;
    }

    var input = qs("[data-search-input]", page);
    var category = qs("[data-category-filter]", page);
    var year = qs("[data-year-filter]", page);
    var cards = qsa("[data-movie-card]", page);
    var empty = qs("[data-empty-result]", page);
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";

    if (input && initialQuery) {
      input.value = initialQuery;
    }

    function applyFilter() {
      var query = normalize(input ? input.value.trim() : "");
      var selectedCategory = category ? category.value : "";
      var selectedYear = year ? year.value : "";
      var visible = 0;

      cards.forEach(function(card) {
        var haystack = normalize(card.getAttribute("data-search"));
        var cardCategory = card.getAttribute("data-category") || "";
        var cardYear = card.getAttribute("data-year") || "";
        var matchQuery = !query || haystack.indexOf(query) !== -1;
        var matchCategory = !selectedCategory || cardCategory === selectedCategory;
        var matchYear = !selectedYear || cardYear === selectedYear;
        var show = matchQuery && matchCategory && matchYear;
        card.style.display = show ? "" : "none";
        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("show", visible === 0);
      }
    }

    if (input) {
      input.addEventListener("input", applyFilter);
    }
    if (category) {
      category.addEventListener("change", applyFilter);
    }
    if (year) {
      year.addEventListener("change", applyFilter);
    }

    applyFilter();
  }

  function initImages() {
    qsa("img").forEach(function(img) {
      img.addEventListener("error", function() {
        img.style.opacity = "0";
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function() {
    initMobileMenu();
    initGlobalSearch();
    initHero();
    initSearchPage();
    initImages();
  });
})();
