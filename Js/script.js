document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const pagesTrigger = document.querySelector('.pages-trigger');
  const pagesSubmenu = document.querySelector('.pages-submenu');
  const submenuOverlay = document.querySelector('.submenu-overlay');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');

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

      // Toggle mobile overlay
      if (mobileNavOverlay) {
        mobileNavOverlay.classList.toggle('active', isActive);
      }

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

    // Close mobile menu when clicking overlay
    if (mobileNavOverlay) {
      mobileNavOverlay.addEventListener('click', () => {
        navLinks.classList.remove('active');
        toggle.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Close mobile menu when clicking close button (the ::after pseudo-element)
    navLinks.addEventListener('click', (e) => {
      const rect = navLinks.getBoundingClientRect();
      const closeButtonArea = {
        left: rect.right - 70,
        right: rect.right - 20,
        top: rect.top + 20,
        bottom: rect.top + 70
      };

      if (e.clientX >= closeButtonArea.left && e.clientX <= closeButtonArea.right &&
          e.clientY >= closeButtonArea.top && e.clientY <= closeButtonArea.bottom) {
        navLinks.classList.remove('active');
        toggle.classList.remove('active');
        if (mobileNavOverlay) mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
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

  // Fade-Based Slider (Most Reliable)
  const sliders = document.querySelectorAll('[data-slider]');

  sliders.forEach(slider => {
    const track = slider.querySelector('.sf-track');
    const slides = track.querySelectorAll('.sf-slide');
    const nav = slider.querySelector('.sf-nav');

    if (slides.length === 0) return;

    let currentIndex = 0;
    let autoPlayInterval;

    // Initialize slider with fade approach
    function initSlider() {
      // Clear nav
      nav.innerHTML = '';

      // Setup track
      track.style.position = 'relative';
      track.style.width = '100%';
      track.style.height = '100%';
      track.style.overflow = 'hidden';

      // Setup slides with absolute positioning
      slides.forEach((slide, index) => {
        slide.style.position = 'absolute';
        slide.style.top = '0';
        slide.style.left = '0';
        slide.style.width = '100%';
        slide.style.height = '100%';
        slide.style.opacity = index === 0 ? '1' : '0';
        slide.style.transition = 'opacity 0.5s ease-in-out';
        slide.style.zIndex = index === 0 ? '2' : '1';

        // Create nav dot
        const dot = document.createElement('button');
        dot.className = 'nav-dot';
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        if (index === 0) dot.classList.add('active');

        dot.addEventListener('click', () => showSlide(index));
        nav.appendChild(dot);
      });

      startAutoPlay();
    }

    // Show specific slide
    function showSlide(index) {
      if (index === currentIndex) return;

      // Hide current slide
      slides[currentIndex].style.opacity = '0';
      slides[currentIndex].style.zIndex = '1';

      // Show new slide
      currentIndex = index;
      slides[currentIndex].style.opacity = '1';
      slides[currentIndex].style.zIndex = '2';

      // Update navigation
      nav.querySelectorAll('.nav-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });

      // Restart autoplay
      stopAutoPlay();
      startAutoPlay();
    }

    // Next slide
    function nextSlide() {
      const nextIndex = (currentIndex + 1) % slides.length;
      showSlide(nextIndex);
    }

    // Auto play
    function startAutoPlay() {
      stopAutoPlay();
      autoPlayInterval = setInterval(nextSlide, 4000);
    }

    function stopAutoPlay() {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
      }
    }

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
          showSlide(prevIndex);
        }
      }
      startAutoPlay();
    });

    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

    // Initialize
    initSlider();
  });  // Map Toggle Functionality
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
