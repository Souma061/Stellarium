document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  const applyScrollState = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', applyScrollState);
  applyScrollState();

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth"
        });
      }
      // close menu if open (mobile)
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  });

  // Mobile Navigation Toggle
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isActive = navLinks.classList.toggle('active');
      toggle.classList.toggle('active', isActive);
      toggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');

      // Prevent body scroll when menu is open
      document.body.style.overflow = isActive ? 'hidden' : '';

      // Close mega menu when closing mobile nav
      if (!isActive) {
        const megaMenu = document.querySelector('.mega-menu');
        if (megaMenu) {
          megaMenu.classList.remove('open');
          const megaTrigger = document.querySelector('.mega-trigger');
          if (megaTrigger) {
            megaTrigger.setAttribute('aria-expanded', 'false');
          }
        }
      }

      // Animate hamburger bars
      const bars = toggle.querySelectorAll('.bar');
      if (isActive) {
        bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
      } else {
        bars.forEach(bar => {
          bar.style.transform = '';
          bar.style.opacity = '';
        });
      }
    });

    // Close mobile menu when clicking on links
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        // Don't close if it's the mega trigger
        if (!link.classList.contains('mega-trigger')) {
          navLinks.classList.remove('active');
          toggle.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';

          // Reset hamburger animation
          const bars = toggle.querySelectorAll('.bar');
          bars.forEach(bar => {
            bar.style.transform = '';
            bar.style.opacity = '';
          });

          // Also close mega menu if open
          const megaMenu = document.querySelector('.mega-menu');
          if (megaMenu) {
            megaMenu.classList.remove('open');
          }
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';

        // Reset hamburger animation
        const bars = toggle.querySelectorAll('.bar');
        bars.forEach(bar => {
          bar.style.transform = '';
          bar.style.opacity = '';
        });
      }
    });

    // Handle window resize - close mobile menu on desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';

        // Reset hamburger animation
        const bars = toggle.querySelectorAll('.bar');
        bars.forEach(bar => {
          bar.style.transform = '';
          bar.style.opacity = '';
        });
      }
    });
  }

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

  // Mega menu toggle (shared)
  const megaTrigger = document.querySelector('.mega-trigger');
  const megaMenu = document.querySelector('.mega-menu');
  if (megaTrigger && megaMenu) {
    let hoverTimer;
    const parentLi = megaTrigger.closest('.has-mega');
    const openMega = () => { megaMenu.classList.add('open'); megaTrigger.setAttribute('aria-expanded', 'true'); };
    const closeMega = () => { megaMenu.classList.remove('open'); megaTrigger.setAttribute('aria-expanded', 'false'); };

    // Desktop hover intent
    parentLi.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(openMega, 110);
    });
    parentLi.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(closeMega, 140);
    });

    // Click / keyboard toggle (mobile & accessibility)
    megaTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      megaMenu.classList.toggle('open');
      const isOpen = megaMenu.classList.contains('open');
      megaTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!parentLi.contains(e.target) && megaMenu.classList.contains('open')) {
        closeMega();
      }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && megaMenu.classList.contains('open')) {
        closeMega();
        megaTrigger.focus();
      }
    });

    // Basic focus management: close when tabbing away
    const focusable = megaMenu.querySelectorAll('a');
    focusable[focusable.length - 1]?.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && !e.shiftKey) { closeMega(); }
    });

    // Close mobile navigation when clicking mega menu links
    const megaLinks = megaMenu.querySelectorAll('a');
    megaLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Check if we're in mobile view
        if (window.innerWidth <= 880) {
          const toggle = document.querySelector('.nav-toggle');
          const navLinks = document.querySelector('.nav-links');

          if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';

            // Reset hamburger animation
            const bars = toggle.querySelectorAll('.bar');
            bars.forEach(bar => {
              bar.style.transform = '';
              bar.style.opacity = '';
            });
          }

          // Close mega menu
          closeMega();
        }
      });
    });
  }
});
