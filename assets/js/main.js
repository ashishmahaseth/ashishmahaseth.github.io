// Initialize AOS
if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, once: true, offset: 100 });
}

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-24 right-4 z-[100000] p-4 rounded shadow-lg transform translate-x-full transition-transform duration-300 font-mono-labels text-xs border ${
        type === 'success'
            ? 'bg-surface-container text-primary-container border-primary-container'
            : 'bg-surface-container text-secondary border-secondary'
    }`;
    const icon = type === 'success' ? 'terminal' : 'warning';
    notification.innerHTML = `<div class="flex items-center space-x-3"><span class="material-symbols-outlined text-sm">${icon}</span><span>${message}</span></div>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.remove('translate-x-full'), 100);
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3500);
}

// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.html = document.documentElement;
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }
    init() {
        this.setTheme(this.currentTheme);
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
    setTheme(theme) {
        this.currentTheme = theme;
        const isDark = theme === 'dark';
        this.html.classList.toggle('dark', isDark);
        this.html.classList.toggle('light-theme', !isDark);
        localStorage.setItem('theme', theme);
        this.updateButtonIcon();
    }
    toggleTheme() {
        this.setTheme(this.currentTheme === 'dark' ? 'light' : 'dark');
    }
    updateButtonIcon() {
        if (!this.themeToggle) return;
        const moonIcon = this.themeToggle.querySelector('span.dark\\:hidden');
        const sunIcon = this.themeToggle.querySelector('span.hidden');
    }
}

// Palette Manager
class PaletteManager {
    constructor() {
        this.paletteToggle = document.getElementById('palette-toggle');
        this.palettesCount = 4;
        this.currentPalette = localStorage.getItem('palette') || '0';
        this.initialized = false;
        this.paletteDropdown = document.getElementById('palette-dropdown');
        this.init();
    }
    init() {
        if (this.paletteToggle) {
            this.paletteToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.paletteDropdown) {
                    this.paletteDropdown.classList.toggle('hidden');
                } else {
                    this.togglePalette();
                }
            });
        }
        if (this.paletteDropdown) {
            document.addEventListener('click', () => this.paletteDropdown.classList.add('hidden'));
            this.paletteDropdown.addEventListener('click', (e) => e.stopPropagation());
            this.paletteDropdown.querySelectorAll('.palette-option').forEach(opt => {
                opt.addEventListener('click', () => {
                    this.applyPalette(opt.dataset.palette);
                    this.paletteDropdown.classList.add('hidden');
                });
            });
        }
        this.applyPalette(this.currentPalette);
    }
    applyPalette(index) {
        document.documentElement.setAttribute('data-palette', index);
        localStorage.setItem('palette', index);
        this.currentPalette = index;
        const paletteNames = ['Grid Power', 'Classic Blueprint', 'High-Voltage Amber', 'Automation Terminal'];
        if (this.initialized) showNotification(`Palette: ${paletteNames[index]}`, 'success');
        this.initialized = true;
        if (this.paletteDropdown) {
            this.paletteDropdown.querySelectorAll('.palette-option').forEach(opt => {
                opt.classList.toggle('active', opt.dataset.palette === String(index));
            });
        }
    }
    togglePalette() {
        this.applyPalette((parseInt(this.currentPalette) + 1) % this.palettesCount);
    }
}

const themeManager = new ThemeManager();
const paletteManager = new PaletteManager();

// Mobile menu
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            const offset = 80;
            window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
        }
    });
});

// Active nav highlight
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');
function highlightActiveSection() {
    let current = '';
    const scrollPos = window.pageYOffset;
    sections.forEach(section => {
        const top = section.getBoundingClientRect().top + scrollPos - 120;
        if (scrollPos >= top && scrollPos < top + section.getBoundingClientRect().height) {
            current = section.getAttribute('id');
        }
    });
    navLinksAll.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}
window.addEventListener('scroll', highlightActiveSection);

// Skill bar animation
const skillItems = document.querySelectorAll('.skill-item');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target.querySelector('.progress-bar-fill');
            if (bar) {
                bar.style.width = '0%';
                setTimeout(() => { bar.style.width = bar.dataset.width; }, 200);
            }
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });
skillItems.forEach(item => skillObserver.observe(item));

// Contact form
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('TRANSMISSION RECEIVED. MESSAGE LOGGED. (DEMO MODE)', 'success');
        contactForm.reset();
    });
}

// Back to top button
const backToTop = document.createElement('button');
backToTop.id = 'back-to-top';
backToTop.innerHTML = '<span class="material-symbols-outlined">arrow_upward</span>';
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
window.addEventListener('scroll', () => {
    backToTop.style.opacity = window.pageYOffset > 300 ? '1' : '0';
    backToTop.style.pointerEvents = window.pageYOffset > 300 ? 'auto' : 'none';
});
document.body.appendChild(backToTop);

// Dynamic experience counter
function initExperienceCounters() {
    const totalExpEl = document.getElementById('dynamic-exp-counter');
    const kakaduTenureEl = document.getElementById('kakadu-tenure-ticker');
    const totalStartDate = new Date('2021-07-01T00:00:00');
    const kakaduStartDate = new Date('2023-10-01T00:00:00');

    function calcDiff(startDate, now) {
        let y = now.getFullYear() - startDate.getFullYear();
        let m = now.getMonth() - startDate.getMonth();
        let d = now.getDate() - startDate.getDate();
        if (d < 0) { const prev = new Date(now.getFullYear(), now.getMonth(), 0); d += prev.getDate(); m--; }
        if (m < 0) { m += 12; y--; }
        return { y, m, d };
    }

    function update() {
        const now = new Date();
        if (totalExpEl) {
            const { y, m, d } = calcDiff(totalStartDate, now);
            totalExpEl.textContent = `${y} Years, ${m} Months, ${d} Days`;
        }
        if (kakaduTenureEl) {
            const { y, m, d } = calcDiff(kakaduStartDate, now);
            kakaduTenureEl.textContent = y >= 1 ? `${y}y ${m}m ${d}d` : `${m} Months, ${d} Days`;
        }
    }
    setInterval(update, 60000);
    update();
}

// Footer uptime
function initFooterUptime() {
    const el = document.getElementById('footer-uptime-ticker');
    if (!el) return;
    const start = new Date('2021-07-01T00:00:00');
    function update() {
        const years = (new Date() - start) / (1000 * 60 * 60 * 24 * 365.25);
        el.textContent = years >= 5.0 ? `UPTIME: ${Math.floor(years)} YEARS` : `UPTIME: ${years.toFixed(1)} YEARS`;
    }
    setInterval(update, 60000);
    update();
}

initExperienceCounters();
initFooterUptime();
