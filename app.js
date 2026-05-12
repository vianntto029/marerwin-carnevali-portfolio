// ===== HEADER SCROLL BEHAVIOR =====
(function() {
  const header = document.getElementById('header');
  let lastScroll = 0;
  let ticking = false;

  function onScroll() {
    const currentScroll = window.scrollY;
    if (currentScroll > 80 && currentScroll > lastScroll) {
      header.classList.add('header--hidden');
    } else {
      header.classList.remove('header--hidden');
    }
    lastScroll = currentScroll;
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
})();

// ===== MOBILE MENU =====
(function() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  const links = menu.querySelectorAll('.mobile-menu__link');

  function closeMenu() {
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function() {
    const isOpen = menu.classList.contains('active');
    if (isOpen) {
      closeMenu();
    } else {
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      menu.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  links.forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });
})();

// ===== COUNTER ANIMATION =====
(function() {
  const counters = document.querySelectorAll('[data-target]');
  let animated = false;

  function animateCounters() {
    if (animated) return;
    animated = true;

    counters.forEach(function(counter) {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 1200;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        counter.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    });
  }

  // Intersection Observer for stats
  const statsSection = document.querySelector('.hero__stats');
  if (statsSection) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });
    observer.observe(statsSection);
  }
})();

// ===== FADE-IN ON SCROLL (fallback for browsers without scroll-timeline) =====
(function() {
  if (CSS.supports && CSS.supports('animation-timeline', 'scroll()')) return;

  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(function(el) {
    el.style.opacity = '0';
    observer.observe(el);
  });
})();

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
