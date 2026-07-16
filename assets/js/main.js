/**
 * Ashish Mahaseth — Portfolio main.js
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

/* ============================================================
   TYPING EFFECT
   ============================================================ */
(function() {
    const typedElement = document.getElementById('typed-text');
    const cursorElement = document.getElementById('cursor');
    if (!typedElement) return;
    
    const texts = [
        'IT Support Engineer',
        'MSP Specialist',
        'Azure AD Expert',
        'M365 Administrator',
        'Endpoint Security Engineer'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isPaused) {
            setTimeout(type, 1500);
            isPaused = false;
            isDeleting = true;
            return;
        }
        
        if (isDeleting) {
            typedElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 500);
                return;
            }
            setTimeout(type, 50);
        } else {
            typedElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentText.length) {
                isPaused = true;
                setTimeout(type, 100);
                return;
            }
            setTimeout(type, 100);
        }
    }
    
    // Start typing after a short delay
    setTimeout(type, 1000);
})();

/* ============================================================
   CODE / TERMINAL BACKGROUND GENERATOR
   PowerShell · Automation · Microsoft Graph · Scripting
   ============================================================ */
(function () {
    const target = document.getElementById('code-bg-scroll');
    if (!target) return;

    // Realistic snippets from Ashish's stack. Tokens wrapped for highlight.
    const lines = [
        '<span class="cl-com"># Connect to Microsoft Graph</span>',
        '<span class="cl-cmd">Connect-MgGraph</span> <span class="cl-key">-Scopes</span> <span class="cl-str">"User.ReadWrite.All","Group.ReadWrite.All"</span>',
        '<span class="cl-var">$users</span> = <span class="cl-cmd">Get-MgUser</span> <span class="cl-key">-All</span> <span class="cl-key">-Property</span> DisplayName,UserPrincipalName,AccountEnabled',
        '',
        '<span class="cl-com"># Bulk provision new hires from CSV</span>',
        '<span class="cl-cmd">Import-Csv</span> <span class="cl-str">".\\new_hires.csv"</span> | <span class="cl-key">ForEach-Object</span> {',
        '    <span class="cl-cmd">New-MgUser</span> <span class="cl-key">-DisplayName</span> <span class="cl-var">$_.Name</span> <span class="cl-key">-UserPrincipalName</span> <span class="cl-var">$_.UPN</span> `',
        '        <span class="cl-key">-AccountEnabled</span> <span class="cl-num">$true</span> <span class="cl-key">-MailNickname</span> <span class="cl-var">$_.Alias</span>',
        '}',
        '',
        '<span class="cl-com"># Assign licenses via Graph</span>',
        '<span class="cl-cmd">Set-MgUserLicense</span> <span class="cl-key">-UserId</span> <span class="cl-var">$user.Id</span> <span class="cl-key">-AddLicenses</span> @{ SkuId = <span class="cl-var">$e3Sku</span> } <span class="cl-key">-RemoveLicenses</span> @()',
        '',
        '<span class="cl-com"># Intune: get non-compliant devices</span>',
        '<span class="cl-var">$devices</span> = <span class="cl-cmd">Get-MgDeviceManagementManagedDevice</span> <span class="cl-key">-Filter</span> <span class="cl-str">"complianceState eq \'noncompliant\'"</span>',
        '<span class="cl-var">$devices</span> | <span class="cl-cmd">Select-Object</span> DeviceName, UserPrincipalName, OsVersion',
        '',
        '<span class="cl-com"># Automation: disable stale accounts (90+ days)</span>',
        '<span class="cl-var">$cutoff</span> = (<span class="cl-cmd">Get-Date</span>).AddDays(<span class="cl-num">-90</span>)',
        '<span class="cl-cmd">Get-MgUser</span> <span class="cl-key">-All</span> | <span class="cl-key">Where-Object</span> { <span class="cl-var">$_.SignInActivity.LastSignInDateTime</span> -lt <span class="cl-var">$cutoff</span> } |',
        '    <span class="cl-key">ForEach-Object</span> { <span class="cl-cmd">Update-MgUser</span> <span class="cl-key">-UserId</span> <span class="cl-var">$_.Id</span> <span class="cl-key">-AccountEnabled</span> <span class="cl-num">$false</span> }',
        '',
        '<span class="cl-com"># Conditional Access report</span>',
        '<span class="cl-cmd">Get-MgIdentityConditionalAccessPolicy</span> | <span class="cl-cmd">Select</span> DisplayName, State |',
        '    <span class="cl-cmd">Export-Csv</span> <span class="cl-str">".\\CA_Policies.csv"</span> <span class="cl-key">-NoTypeInformation</span>',
        '',
        '<span class="cl-com"># Exchange Online: mailbox delegation audit</span>',
        '<span class="cl-cmd">Get-Mailbox</span> <span class="cl-key">-ResultSize</span> Unlimited | <span class="cl-cmd">Get-MailboxPermission</span> |',
        '    <span class="cl-key">Where-Object</span> { <span class="cl-var">$_.AccessRights</span> -match <span class="cl-str">"FullAccess"</span> -and -not <span class="cl-var">$_.IsInherited</span> }',
        '',
        '<span class="cl-com"># Power Automate trigger via Graph webhook</span>',
        '<span class="cl-var">$body</span> = @{ changeType = <span class="cl-str">"created"</span>; resource = <span class="cl-str">"/users"</span>; expirationDateTime = <span class="cl-var">$exp</span> }',
        '<span class="cl-cmd">Invoke-MgGraphRequest</span> <span class="cl-key">-Method</span> POST <span class="cl-key">-Uri</span> <span class="cl-str">"/subscriptions"</span> <span class="cl-key">-Body</span> <span class="cl-var">$body</span>',
        '',
        '<span class="cl-com"># Defender: isolate compromised endpoint</span>',
        '<span class="cl-cmd">Invoke-MgGraphRequest</span> <span class="cl-key">-Method</span> POST `',
        '    <span class="cl-key">-Uri</span> <span class="cl-str">"/security/machines/$id/isolate"</span> <span class="cl-key">-Body</span> @{ comment = <span class="cl-str">"Auto-remediation"</span> }',
        '',
        '<span class="cl-com"># Group membership sync loop</span>',
        '<span class="cl-key">foreach</span> (<span class="cl-var">$g</span> <span class="cl-key">in</span> <span class="cl-var">$groups</span>) {',
        '    <span class="cl-cmd">New-MgGroupMember</span> <span class="cl-key">-GroupId</span> <span class="cl-var">$g.Id</span> <span class="cl-key">-DirectoryObjectId</span> <span class="cl-var">$user.Id</span>',
        '    <span class="cl-cmd">Write-Host</span> <span class="cl-str">"[OK] Added $($user.UPN) -> $($g.DisplayName)"</span> <span class="cl-key">-Fore</span> Green',
        '}',
        '',
    ];

    // Build a long block, duplicated for seamless -50% loop.
    const block = lines.join('\n');
    target.innerHTML = block + '\n' + block;
})();
