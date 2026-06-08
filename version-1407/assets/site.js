(function () {
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let index = 0;

    const showSlide = function (nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    };

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(index + 1);
      }, 5600);
    }
  }

  const inputs = Array.from(document.querySelectorAll('.js-filter-input'));

  inputs.forEach(function (input) {
    const parentSection = input.closest('main') || document;
    const cards = Array.from(parentSection.querySelectorAll('.movie-card[data-search]'));

    input.addEventListener('input', function () {
      const query = input.value.trim().toLowerCase();

      cards.forEach(function (card) {
        const haystack = card.getAttribute('data-search') || '';
        card.classList.toggle('is-hidden-by-filter', query.length > 0 && haystack.indexOf(query) === -1);
      });
    });
  });
})();
