document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const pagesTrigger = document.querySelector('.pages-trigger');
  const pagesSubmenu = document.querySelector('.pages-submenu');
  const submenuOverlay = document.querySelector('.submenu-overlay');

  // Header scroll effect
  const applyScrollState = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', applyScrollState);
  applyScrollState();

  // Simple hamburger menu toggle
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isActive = navLinks.classList.toggle('active');
      toggle.classList.toggle('active', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });
  }

  // Simple pages submenu
  if (pagesTrigger && pagesSubmenu && submenuOverlay) {
    pagesTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      pagesSubmenu.classList.add('active');
      submenuOverlay.classList.add('active');
    });

    // Close submenu when clicking overlay
    submenuOverlay.addEventListener('click', () => {
      pagesSubmenu.classList.remove('active');
      submenuOverlay.classList.remove('active');
    });

    // Close submenu when clicking any link inside
    pagesSubmenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        pagesSubmenu.classList.remove('active');
        submenuOverlay.classList.remove('active');
        // Also close main menu if open
        navLinks.classList.remove('active');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Close mobile menu when clicking on regular nav links
  navLinks.querySelectorAll('a:not(.pages-trigger)').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Simple slider for blog feature - handle multiple sliders
  const sliders = document.querySelectorAll('[data-slider]');
  sliders.forEach(slider => {
    const track = slider.querySelector('.sf-track');
    const slides = Array.from(track.children);
    const nav = slider.querySelector('.sf-nav');
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', () => goTo(i));
      nav.appendChild(b);
    });
    let index = 0;
    let timer;
    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      nav.querySelectorAll('button').forEach((b, bi) => b.classList.toggle('active', bi === index));
      restart();
    }
    function next() { goTo(index + 1); }
    function restart() { clearInterval(timer); timer = setInterval(next, 6000); }
    restart();
    window.addEventListener('visibilitychange', () => { if (document.hidden) clearInterval(timer); else restart(); });
  });
});
