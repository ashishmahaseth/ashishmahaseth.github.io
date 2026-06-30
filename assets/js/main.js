/**
 * Ashish Shrestha — Portfolio main.js
 * Dark/light theme, palette cycling, mobile menu, AOS, counters,
 * progress bars, back-to-top, smooth scroll, active nav, contact form.
 */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /*  Notification helper                                               */
  /* ------------------------------------------------------------------ */
  function showNotification(message, type) {
    const el = document.createElement('div');
    el.className =
      'fixed top-24 right-4 z-[100000] p-4 rounded shadow-lg transform translate-x-full transition-transform duration-300 font-mono-labels text-xs border ' +
      (type === 'success'
        ? 'bg-surface-container text-primary-container border-primary-container'
        : 'bg-surface-container text-secondary border-secondary');
    const icon = type === 'success' ? 'terminal' : 'warning';
    el.innerHTML =
      '<div class="flex items-center space-x-3"><span class="material-symbols-outlined text-sm">' +
      icon +
      '</span><span>' +
      message +
      '</span></div>';
    document.body.appendChild(el);
    setTimeout(() => el.classList.remove('translate-x-full'), 100);
    setTimeout(() => {
      el.classList.add('translate-x-full');
      setTimeout(() => el.remove(), 300);
    }, 3500);
  }

  /* ------------------------------------------------------------------ */
  /*  1. Dark / Light theme toggle                                      */
  /* ------------------------------------------------------------------ */
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  let currentTheme = localStorage.getItem('theme') || 'dark';

  function applyTheme(theme) {
    currentTheme = theme;
    html.classList.toggle('dark', theme === 'dark');
    html.classList.toggle('light-theme', theme !== 'dark');
    localStorage.setItem('theme', theme);
    refreshThemeIcon();
  }

  function refreshThemeIcon() {
    if (!themeToggle) return;
    themeToggle.querySelectorAll('span').forEach((s) => {
      s.textContent = currentTheme === 'dark' ? 'dark_mode' : 'light_mode';
    });
  }

  applyTheme(currentTheme);
  if (themeToggle) {
    themeToggle.addEventListener('click', () =>
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark')
    );
  }

  /* ------------------------------------------------------------------ */
  /*  2 & 3. Color palette cycling + dropdown toggle                    */
  /* ------------------------------------------------------------------ */
  const paletteToggle = document.getElementById('palette-toggle');
  const paletteDropdown = document.getElementById('palette-dropdown');
  const paletteCount = 4;
  const paletteNames = [
    'Grid Power',
    'Classic Blueprint',
    'High-Voltage Amber',
    'Automation Terminal',
  ];
  let currentPalette = parseInt(localStorage.getItem('palette') || '0', 10);
  let paletteInited = false;

  function applyPalette(idx) {
    currentPalette = idx;
    document.documentElement.setAttribute('data-palette', idx);
    localStorage.setItem('palette', idx);
    if (paletteInited) showNotification('Palette: ' + paletteNames[idx], 'success');
    paletteInited = true;
    /* highlight active option */
    if (paletteDropdown) {
      paletteDropdown.querySelectorAll('.palette-option').forEach((opt) => {
        opt.classList.toggle('active', opt.dataset.palette === String(idx));
      });
    }
  }

  if (paletteToggle) {
    paletteToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (paletteDropdown) {
        paletteDropdown.classList.toggle('hidden');
      } else {
        applyPalette((currentPalette + 1) % paletteCount);
      }
    });
  }
  if (paletteDropdown) {
    document.addEventListener('click', () => paletteDropdown.classList.add('hidden'));
    paletteDropdown.addEventListener('click', (e) => e.stopPropagation());
    paletteDropdown.querySelectorAll('.palette-option').forEach((opt) => {
      opt.addEventListener('click', () => {
        applyPalette(parseInt(opt.dataset.palette, 10));
        paletteDropdown.classList.add('hidden');
      });
    });
  }
  applyPalette(currentPalette);

  /* ------------------------------------------------------------------ */
  /*  4. Mobile menu toggle                                             */
  /* ------------------------------------------------------------------ */
  const mobileMenuBtn = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    mobileMenu.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => mobileMenu.classList.add('hidden'))
    );
  }

  /* ------------------------------------------------------------------ */
  /*  5. AOS (Animate On Scroll) initialisation                         */
  /* ------------------------------------------------------------------ */
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, once: true, offset: 100 });
  }

  /* ------------------------------------------------------------------ */
  /*  6. Rolling counter animations                                     */
  /* ------------------------------------------------------------------ */
  const totalStartDate = new Date('2021-07-01T00:00:00');
  const kakaduStartDate = new Date('2023-10-01T00:00:00');

  function calcDiff(start, now) {
    let y = now.getFullYear() - start.getFullYear();
    let m = now.getMonth() - start.getMonth();
    let d = now.getDate() - start.getDate();
    if (d < 0) {
      const prev = new Date(now.getFullYear(), now.getMonth(), 0);
      d += prev.getDate();
      m--;
    }
    if (m < 0) {
      m += 12;
      y--;
    }
    return { y, m, d };
  }

  function animateCounter(el, target, suffix) {
    const duration = 1600;
    const start = performance.now();
    const from = 0;
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(from + (target - from) * ease) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initExperienceCounters() {
    const totalExpEl = document.getElementById('dynamic-exp-counter');
    const kakaduTenureEl = document.getElementById('kakadu-tenure-ticker');

    function update() {
      const now = new Date();
      if (totalExpEl) {
        const { y, m, d } = calcDiff(totalStartDate, now);
        totalExpEl.textContent = y + ' Years, ' + m + ' Months, ' + d + ' Days';
      }
      if (kakaduTenureEl) {
        const { y, m, d } = calcDiff(kakaduStartDate, now);
        kakaduTenureEl.textContent =
          y >= 1 ? y + 'y ' + m + 'm ' + d + 'd' : m + ' Months, ' + d + ' Days';
      }
    }
    setInterval(update, 60000);
    update();

    /* Rolling number animation on first visibility */
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.count, 10);
            const suffix = entry.target.dataset.suffix || '';
            animateCounter(entry.target, target, suffix);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => counterObserver.observe(c));
  }

  /* Footer UPTIME counter (from July 2021) */
  function initFooterUptime() {
    const el = document.getElementById('footer-uptime-ticker');
    if (!el) return;
    const start = new Date('2021-07-01T00:00:00');
    function update() {
      const years = (Date.now() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      el.textContent =
        years >= 5.0
          ? 'UPTIME: ' + Math.floor(years) + ' YEARS'
          : 'UPTIME: ' + years.toFixed(1) + ' YEARS';
    }
    setInterval(update, 60000);
    update();
  }

  initExperienceCounters();
  initFooterUptime();

  /* ------------------------------------------------------------------ */
  /*  7. Progress bar animations  (data-width attribute)                */
  /* ------------------------------------------------------------------ */
  const skillItems = document.querySelectorAll('.skill-item');
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target.querySelector('.progress-bar-fill');
          if (bar) {
            bar.style.width = '0%';
            setTimeout(() => {
              bar.style.width = bar.dataset.width;
            }, 200);
          }
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  skillItems.forEach((item) => skillObserver.observe(item));

  /* ------------------------------------------------------------------ */
  /*  8. Back-to-top button                                             */
  /* ------------------------------------------------------------------ */
  const backToTop = document.createElement('button');
  backToTop.id = 'back-to-top';
  backToTop.innerHTML =
    '<span class="material-symbols-outlined">arrow_upward</span>';
  backToTop.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
  window.addEventListener('scroll', () => {
    const show = window.pageYOffset > 300;
    backToTop.style.opacity = show ? '1' : '0';
    backToTop.style.pointerEvents = show ? 'auto' : 'none';
  });
  document.body.appendChild(backToTop);

  /* ------------------------------------------------------------------ */
  /*  9. Smooth scroll for anchor links                                 */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const offset = 80;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.pageYOffset - offset,
          behavior: 'smooth',
        });
      }
    });
  });

  /* ------------------------------------------------------------------ */
  /*  10. Active nav link highlighting on scroll                        */
  /* ------------------------------------------------------------------ */
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');

  function highlightActiveSection() {
    let current = '';
    const scrollPos = window.pageYOffset;
    sections.forEach((section) => {
      const top = section.getBoundingClientRect().top + scrollPos - 120;
      if (scrollPos >= top && scrollPos < top + section.offsetHeight) {
        current = section.getAttribute('id');
      }
    });
    navLinksAll.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', highlightActiveSection);
  highlightActiveSection();

  /* ------------------------------------------------------------------ */
  /*  11. Contact form handling                                         */
  /* ------------------------------------------------------------------ */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showNotification(
        'TRANSMISSION RECEIVED. MESSAGE LOGGED. (DEMO MODE)',
        'success'
      );
      contactForm.reset();
    });
  }
})();
