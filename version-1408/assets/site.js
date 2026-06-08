document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector("[data-mobile-toggle]");
  var nav = document.querySelector("[data-mobile-nav]");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var current = 0;

    var showSlide = function (index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    };

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var index = parseInt(dot.getAttribute("data-hero-dot"), 10);
        showSlide(index);
      });
    });

    window.setInterval(function () {
      showSlide(current + 1);
    }, 5000);
  }

  document.querySelectorAll(".movie-listing").forEach(function (listing) {
    var form = listing.querySelector("[data-filter-form]");
    var cards = Array.prototype.slice.call(listing.querySelectorAll("[data-movie-card]"));

    if (!form || !cards.length) {
      return;
    }

    var queryInput = form.querySelector("[data-filter-query]");
    var typeSelect = form.querySelector("[data-filter-type]");
    var yearSelect = form.querySelector("[data-filter-year]");
    var categorySelect = form.querySelector("[data-filter-category]");

    if (yearSelect) {
      var years = cards.map(function (card) {
        return card.getAttribute("data-year") || "";
      }).filter(Boolean).filter(function (value, index, array) {
        return array.indexOf(value) === index;
      }).sort(function (a, b) {
        return b.localeCompare(a);
      });

      years.forEach(function (year) {
        var option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
      });
    }

    var applyFilters = function () {
      var query = queryInput ? queryInput.value.trim().toLowerCase() : "";
      var type = typeSelect ? typeSelect.value : "";
      var year = yearSelect ? yearSelect.value : "";
      var category = categorySelect ? categorySelect.value : "";

      cards.forEach(function (card) {
        var text = (card.getAttribute("data-search") || "").toLowerCase();
        var matchesQuery = !query || text.indexOf(query) !== -1;
        var matchesType = !type || card.getAttribute("data-type") === type;
        var matchesYear = !year || card.getAttribute("data-year") === year;
        var matchesCategory = !category || card.getAttribute("data-category") === category;
        var visible = matchesQuery && matchesType && matchesYear && matchesCategory;

        card.classList.toggle("is-hidden", !visible);
      });
    };

    form.addEventListener("input", applyFilters);
    form.addEventListener("change", applyFilters);
  });
});
