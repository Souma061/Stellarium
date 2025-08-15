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

  // Simple Slider
  const sliders = document.querySelectorAll('[data-slider]');
  sliders.forEach(slider => {
    const track = slider.querySelector('.sf-track');
    const slides = track.querySelectorAll('.sf-slide');
    const nav = slider.querySelector('.sf-nav');

    let currentSlide = 0;

    // Create navigation dots
    slides.forEach((_, i) => {
      const button = document.createElement('button');
      if (i === 0) button.classList.add('active');
      button.addEventListener('click', () => goToSlide(i));
      nav.appendChild(button);
    });

    function goToSlide(index) {
      currentSlide = index;
      track.style.transform = `translateX(-${index * 20}%)`;

      // Update active dot
      nav.querySelectorAll('button').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
      });
    }

    // Auto-play
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      goToSlide(currentSlide);
    }, 4000);
  });

  // Map Toggle Functionality
  const mapToggles = document.querySelectorAll('.map-toggle');
  const mapIframe = document.querySelector('.map-wrapper iframe');

  if (mapToggles.length > 0 && mapIframe) {
    mapToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        // Remove active class from all toggles
        mapToggles.forEach(t => t.classList.remove('active'));
        // Add active class to clicked toggle
        toggle.classList.add('active');

        // Update map view based on selection
        const mapType = toggle.getAttribute('data-map');
        const currentSrc = mapIframe.src;

        if (mapType === 'satellite') {
          // Switch to satellite view
          if (!currentSrc.includes('&t=k')) {
            mapIframe.src = currentSrc + '&t=k';
          }
        } else {
          // Switch to map view
          mapIframe.src = currentSrc.replace('&t=k', '');
        }
      });
    });
  }
});
