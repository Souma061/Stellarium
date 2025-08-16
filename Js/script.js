document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const pagesTrigger = document.querySelector('.pages-trigger');
  const pagesSubmenu = document.querySelector('.pages-submenu');
  const submenuOverlay = document.querySelector('.submenu-overlay');

  if (toggle && toggle.children.length === 0) {
    for (let i = 0; i < 3; i++) {
      const bar = document.createElement('div');
      bar.className = 'bar';
      toggle.appendChild(bar);
    }
  }

  let lastScrollY = window.scrollY;
  const applyScrollState = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

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

  if (toggle && navLinks) {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isActive = navLinks.classList.toggle('active');
      toggle.classList.toggle('active', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';


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

  if (pagesTrigger && pagesSubmenu && submenuOverlay) {
    pagesTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        toggle.classList.remove('active');
      }

      pagesSubmenu.classList.add('active');
      submenuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';

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

    const closeSubmenu = () => {
      pagesSubmenu.classList.remove('active');
      submenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    submenuOverlay.addEventListener('click', closeSubmenu);

    pagesSubmenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeSubmenu();
        navLinks.classList.remove('active');
        toggle.classList.remove('active');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && pagesSubmenu.classList.contains('active')) {
        closeSubmenu();
      }
    });
  }

  navLinks.querySelectorAll('a:not(.pages-trigger)').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (!pagesTrigger.contains(e.target) && !pagesSubmenu.contains(e.target) && pagesSubmenu.classList.contains('active')) {
      pagesSubmenu.classList.remove('active');
      submenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

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

  const sliders = document.querySelectorAll('[data-slider]');

  sliders.forEach(slider => {
    const track = slider.querySelector('.sf-track');
    const slides = track.querySelectorAll('.sf-slide');
    const nav = slider.querySelector('.sf-nav');

    if (slides.length === 0) return;

    let currentIndex = 0;
    let autoPlayInterval;

    function initSlider() {
      nav.innerHTML = '';

      track.style.position = 'relative';
      track.style.width = '100%';
      track.style.height = '100%';
      track.style.overflow = 'hidden';

      slides.forEach((slide, index) => {
        slide.style.position = 'absolute';
        slide.style.top = '0';
        slide.style.left = '0';
        slide.style.width = '100%';
        slide.style.height = '100%';
        slide.style.opacity = index === 0 ? '1' : '0';
        slide.style.transition = 'opacity 0.5s ease-in-out';
        slide.style.zIndex = index === 0 ? '2' : '1';

        const dot = document.createElement('button');
        dot.className = 'nav-dot';
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        if (index === 0) dot.classList.add('active');

        dot.addEventListener('click', () => showSlide(index));
        nav.appendChild(dot);
      });

      startAutoPlay();
    }

    function showSlide(index) {
      if (index === currentIndex) return;


      slides[currentIndex].style.opacity = '0';
      slides[currentIndex].style.zIndex = '1';

      currentIndex = index;
      slides[currentIndex].style.opacity = '1';
      slides[currentIndex].style.zIndex = '2';

      nav.querySelectorAll('.nav-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });

      stopAutoPlay();
      startAutoPlay();
    }

    function nextSlide() {
      const nextIndex = (currentIndex + 1) % slides.length;
      showSlide(nextIndex);
    }

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

    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

    initSlider();
  });  const mapToggles = document.querySelectorAll('.map-toggle');
  const mapIframe = document.querySelector('.map-wrapper iframe');

  if (mapToggles.length > 0 && mapIframe) {
    mapToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        mapToggles.forEach(t => t.classList.remove('active'));
        toggle.classList.add('active');

        const mapType = toggle.getAttribute('data-map');
        const currentSrc = mapIframe.src;

        if (mapType === 'satellite') {
          if (!currentSrc.includes('&t=k')) {
            mapIframe.src = currentSrc + '&t=k';
          }
        } else {
          mapIframe.src = currentSrc.replace('&t=k', '');
        }
      });
    });
  }
});
