(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    if (toggle) {
      toggle.addEventListener("click", function () {
        document.body.classList.toggle("menu-open");
      });
    }

    document.querySelectorAll(".nav-links a").forEach(function (link) {
      link.addEventListener("click", function () {
        document.body.classList.remove("menu-open");
      });
    });

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var current = 0;
      var timer = null;
      function show(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("is-active", i === current);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === current);
        });
      }
      function start() {
        if (slides.length < 2) {
          return;
        }
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5200);
      }
      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          if (timer) {
            window.clearInterval(timer);
          }
          show(i);
          start();
        });
      });
      show(0);
      start();
    }

    var backTop = document.querySelector("[data-back-top]");
    if (backTop) {
      window.addEventListener("scroll", function () {
        backTop.classList.toggle("is-visible", window.scrollY > 360);
      });
      backTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    var filterRoot = document.querySelector("[data-filter-root]");
    if (filterRoot) {
      var keyword = filterRoot.querySelector("[data-filter-keyword]");
      var type = filterRoot.querySelector("[data-filter-type]");
      var year = filterRoot.querySelector("[data-filter-year]");
      var cards = Array.prototype.slice.call(filterRoot.querySelectorAll("[data-movie-card]"));
      var status = filterRoot.querySelector("[data-filter-status]");
      var empty = filterRoot.querySelector("[data-empty-state]");
      function applyFilter() {
        var q = keyword ? keyword.value.trim().toLowerCase() : "";
        var typeValue = type ? type.value : "";
        var yearValue = year ? year.value : "";
        var visible = 0;
        cards.forEach(function (card) {
          var hay = (card.getAttribute("data-search") || "").toLowerCase();
          var cardType = card.getAttribute("data-type") || "";
          var cardYear = card.getAttribute("data-year") || "";
          var matched = (!q || hay.indexOf(q) !== -1) && (!typeValue || cardType === typeValue) && (!yearValue || cardYear === yearValue);
          card.style.display = matched ? "" : "none";
          if (matched) {
            visible += 1;
          }
        });
        if (status) {
          status.textContent = q || typeValue || yearValue ? "当前匹配 " + visible + " 部影片" : "输入关键词或选择条件查找影片";
        }
        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }
      [keyword, type, year].forEach(function (control) {
        if (control) {
          control.addEventListener("input", applyFilter);
          control.addEventListener("change", applyFilter);
        }
      });
      applyFilter();
    }
  });
})();
