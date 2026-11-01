var THEMES = [
  { id: 'woodsy', name: 'Woodsy Sunset' },
  { id: 'roman', name: 'Roman Classical' },
  { id: 'ivy', name: 'Ivy Academic' },
  { id: 'slate', name: 'Slate & Ember' },
  { id: 'light-academia', name: 'Light Academia' },
  { id: 'dusty-sage', name: 'Dusty Sage & Clay' },
  { id: 'powder-ink', name: 'Powder & Ink' },
  { id: 'lavender-mist', name: 'Lavender Mist' },
  { id: 'sage-honey', name: 'Sage & Honey' },
  { id: 'watercolor-morning', name: 'Watercolor Morning' }
];

function getStoredTheme() {
  try {
    return localStorage.getItem('aahil-theme');
  } catch (e) {
    return null;
  }
}

function storeTheme(id) {
  try {
    localStorage.setItem('aahil-theme', id);
  } catch (e) {
    /* storage unavailable; theme just won't persist across visits */
  }
}

function applyTheme(id) {
  var theme = THEMES.find(function (t) { return t.id === id; }) || THEMES[0];
  document.documentElement.setAttribute('data-theme', theme.id);
  var select = document.getElementById('themeSelect');
  if (select && select.value !== theme.id) select.value = theme.id;
  return theme;
}

document.addEventListener('DOMContentLoaded', function () {
  // Theme switcher: dropdown menu with 10 selectable themes
  var savedId = getStoredTheme();
  var current = applyTheme(savedId || THEMES[0].id);

  var themeSelect = document.getElementById('themeSelect');
  if (themeSelect) {
    themeSelect.value = current.id;
    themeSelect.addEventListener('change', function () {
      applyTheme(themeSelect.value);
      storeTheme(themeSelect.value);
    });
  }

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // Close menu after clicking a link (mobile)
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Right-side quick-nav: slide-out panel to jump to any section from anywhere on the page
  var sideNavToggle = document.getElementById('sideNavToggle');
  var sideNavPanel = document.getElementById('sideNavPanel');
  var sideNavOverlay = document.getElementById('sideNavOverlay');
  var sideNavClose = document.getElementById('sideNavClose');

  function openSideNav() {
    if (sideNavPanel) sideNavPanel.classList.add('open');
    if (sideNavOverlay) sideNavOverlay.classList.add('open');
    if (sideNavToggle) sideNavToggle.setAttribute('aria-expanded', 'true');
  }
  function closeSideNav() {
    if (sideNavPanel) sideNavPanel.classList.remove('open');
    if (sideNavOverlay) sideNavOverlay.classList.remove('open');
    if (sideNavToggle) sideNavToggle.setAttribute('aria-expanded', 'false');
  }
  if (sideNavToggle && sideNavPanel) {
    sideNavToggle.addEventListener('click', function () {
      var isOpen = sideNavPanel.classList.contains('open');
      if (isOpen) { closeSideNav(); } else { openSideNav(); }
    });
    if (sideNavClose) sideNavClose.addEventListener('click', closeSideNav);
    if (sideNavOverlay) sideNavOverlay.addEventListener('click', closeSideNav);
    sideNavPanel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeSideNav);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sideNavPanel.classList.contains('open')) closeSideNav();
    });
  }

  // Scroll-reveal animation
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Expandable info-cards: uniform collapsed size, click/tap/Enter to expand to full content
  var COLLAPSED_HEIGHT = 180;
  var cards = Array.prototype.slice.call(document.querySelectorAll('.info-card'));

  cards.forEach(function (card) {
    var hint = document.createElement('span');
    hint.className = 'card-expand-hint';
    hint.setAttribute('aria-hidden', 'true');
    hint.innerHTML =
      '<span class="card-expand-hint-text">Read more</span>' +
      '<svg class="card-expand-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
    card.appendChild(hint);

    function setExpanded(expand) {
      if (expand) {
        card.style.height = card.scrollHeight + 'px';
        card.classList.add('expanded');
      } else {
        card.style.height = COLLAPSED_HEIGHT + 'px';
        card.classList.remove('expanded');
      }
      card.setAttribute('aria-expanded', expand ? 'true' : 'false');
      var textEl = hint.querySelector('.card-expand-hint-text');
      if (textEl) textEl.textContent = expand ? 'Show less' : 'Read more';
    }

    card.addEventListener('click', function () {
      if (!card.classList.contains('no-overflow')) {
        setExpanded(!card.classList.contains('expanded'));
      }
    });
    card.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') && !card.classList.contains('no-overflow')) {
        e.preventDefault();
        setExpanded(!card.classList.contains('expanded'));
      }
    });
  });

  function refreshCardOverflow() {
    cards.forEach(function (card) {
      var isExpanded = card.classList.contains('expanded');
      var fullHeight = isExpanded ? card.scrollHeight : (function () {
        card.style.height = 'auto';
        var h = card.scrollHeight;
        card.style.height = COLLAPSED_HEIGHT + 'px';
        return h;
      })();
      var overflowing = fullHeight > COLLAPSED_HEIGHT + 4;
      card.classList.toggle('no-overflow', !overflowing);
      if (overflowing) {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        if (!card.hasAttribute('aria-expanded')) card.setAttribute('aria-expanded', 'false');
      } else {
        card.removeAttribute('tabindex');
        card.removeAttribute('role');
        card.removeAttribute('aria-expanded');
      }
      if (isExpanded) card.style.height = fullHeight + 'px';
    });
  }

  window.requestAnimationFrame(refreshCardOverflow);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refreshCardOverflow);
  }
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refreshCardOverflow, 200);
  });

  // Scroll progress bar + back-to-top button
  var progressBar = document.getElementById('scrollProgress');
  var backToTop = document.getElementById('backToTop');
  var ticking = false;

  function updateScrollUI() {
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop;
    var maxScroll = doc.scrollHeight - doc.clientHeight;
    var pct = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
    if (backToTop) backToTop.classList.toggle('visible', scrollTop > window.innerHeight * 0.6);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  });
  updateScrollUI();

  // Highlight active nav link based on scroll position
  var sections = document.querySelectorAll('main .section, .hero');
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && navAnchors.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navAnchors.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { navObserver.observe(s); });
  }
});
