document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const pagesTrigger = document.querySelector('.pages-trigger');
  const pagesSubmenu = document.querySelector('.pages-submenu');
  const submenuOverlay = document.querySelector('.submenu-overlay');

  // Create hamburger bars if they don't exist
  if (toggle && toggle.children.length === 0) {
    for (let i = 0; i < 3; i++) {
      const bar = document.createElement('div');
      bar.className = 'bar';
      toggle.appendChild(bar);
    }
  }

  // Enhanced header scroll effect with smooth transitions
  let lastScrollY = window.scrollY;
  const applyScrollState = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Auto-hide header on scroll down, show on scroll up
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      header.style.transform = 'translateY(-100%)';
      header.style.transition = 'transform 0.3s ease';
    } else {
      header.style.transform = 'translateY(0)';
      header.style.transition = 'transform 0.3s ease';
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', applyScrollState);
  applyScrollState();

  // Enhanced hamburger menu toggle with animations
  if (toggle && navLinks) {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isActive = navLinks.classList.toggle('active');
      toggle.classList.toggle('active', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';

      // Add stagger animation to nav items
      if (isActive) {
        const navItems = navLinks.querySelectorAll('li');
        navItems.forEach((item, index) => {
          item.style.opacity = '0';
          item.style.transform = 'translateX(-50px)';
          setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          }, 100 + (index * 100));
        });
      }
    });

    // Add hover effect to toggle
    toggle.addEventListener('mouseenter', () => {
      if (!toggle.classList.contains('active')) {
        toggle.style.transform = 'scale(1.1)';
      }
    });

    toggle.addEventListener('mouseleave', () => {
      if (!toggle.classList.contains('active')) {
        toggle.style.transform = 'scale(1)';
      }
    });
  }

  // Enhanced pages submenu with better animations
  if (pagesTrigger && pagesSubmenu && submenuOverlay) {
    pagesTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Close mobile menu if open
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        toggle.classList.remove('active');
      }

      pagesSubmenu.classList.add('active');
      submenuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Stagger animation for submenu items
      const submenuItems = pagesSubmenu.querySelectorAll('li');
      submenuItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
          item.style.transition = 'all 0.3s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
      });
    });

    // Close submenu function
    const closeSubmenu = () => {
      pagesSubmenu.classList.remove('active');
      submenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    // Close submenu when clicking overlay
    submenuOverlay.addEventListener('click', closeSubmenu);

    // Close submenu when clicking any link inside
    pagesSubmenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeSubmenu();
        // Also close main menu if open
        navLinks.classList.remove('active');
        toggle.classList.remove('active');
      });
    });

    // Close submenu with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && pagesSubmenu.classList.contains('active')) {
        closeSubmenu();
      }
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

  // Enhanced outside click handling
  document.addEventListener('click', (e) => {
    // Close mobile menu when clicking outside
    if (!toggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Close submenu when clicking outside
    if (pagesSubmenu && !pagesSubmenu.contains(e.target) && !pagesTrigger.contains(e.target) && pagesSubmenu.classList.contains('active')) {
      pagesSubmenu.classList.remove('active');
      submenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Enhanced smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href");
      if (href !== '#pages' && href !== '#' && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

          // Close any open menus after navigation
          navLinks.classList.remove('active');
          toggle.classList.remove('active');
          if (pagesSubmenu) {
            pagesSubmenu.classList.remove('active');
            submenuOverlay.classList.remove('active');
          }
          document.body.style.overflow = '';
        }
      }
    });
  });

  // Enhanced slider with better performance and accessibility
  const sliders = document.querySelectorAll('[data-slider]');
  sliders.forEach(slider => {
    const track = slider.querySelector('.sf-track');
    const slides = Array.from(track.children);
    const nav = slider.querySelector('.sf-nav');

    slides.forEach((_, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `Go to slide ${i + 1}`);
      button.setAttribute('role', 'tab');
      if (i === 0) button.classList.add('active');
      button.addEventListener('click', () => goTo(i));
      nav.appendChild(button);
    });

    let index = 0;
    let timer;
    let isUserInteracting = false;

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      nav.querySelectorAll('button').forEach((button, buttonIndex) => {
        button.classList.toggle('active', buttonIndex === index);
        button.setAttribute('aria-selected', buttonIndex === index);
      });
      restart();
    }

    function next() {
      if (!isUserInteracting) {
        goTo(index + 1);
      }
    }

    function restart() {
      clearInterval(timer);
      timer = setInterval(next, 6000);
    }

    // Pause on hover/focus
    slider.addEventListener('mouseenter', () => { isUserInteracting = true; });
    slider.addEventListener('mouseleave', () => { isUserInteracting = false; });
    slider.addEventListener('focusin', () => { isUserInteracting = true; });
    slider.addEventListener('focusout', () => { isUserInteracting = false; });

    // Keyboard navigation
    nav.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(index - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goTo(index + 1);
      }
    });

    restart();

    // Better visibility change handling
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearInterval(timer);
      } else {
        restart();
      }
    });
  });
});
