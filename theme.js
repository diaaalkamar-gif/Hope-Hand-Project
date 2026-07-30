
(function () {
  'use strict';

  const STORAGE_KEY = 'hopehand-theme';

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    return 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateToggleIcons(theme);
    updateLogos(theme);
  }

  function updateLogos(theme) {
    const isSubpage = window.location.pathname.toLowerCase().includes('/assets/pages/');
    const defaultPrefix = isSubpage ? '../../images/' : 'images/';

    const headerLogos = document.querySelectorAll('.brand-logo img');
    headerLogos.forEach(img => {
      const srcAttr = img.getAttribute('src') || '';
      let prefix = defaultPrefix;
      if (srcAttr.startsWith('../../images/')) prefix = '../../images/';
      else if (srcAttr.startsWith('../images/')) prefix = '../images/';
      else if (srcAttr.startsWith('images/')) prefix = 'images/';

      if (theme === 'dark') {
        img.src = prefix + 'logo-light.svg';
      } else {
        img.src = prefix + 'logo.svg';
      }
    });

    const footerLogos = document.querySelectorAll('.footer-brand-logo img');
    footerLogos.forEach(img => {
      const srcAttr = img.getAttribute('src') || '';
      let prefix = defaultPrefix;
      if (srcAttr.startsWith('../../images/')) prefix = '../../images/';
      else if (srcAttr.startsWith('../images/')) prefix = '../images/';
      else if (srcAttr.startsWith('images/')) prefix = 'images/';

      img.src = prefix + 'logo-light.svg';
    });
  }

  function updateToggleIcons(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'fa-solid fa-sun';
          btn.setAttribute('aria-label', 'Switch to light mode');
          btn.setAttribute('title', 'Switch to Light Mode');
        } else {
          icon.className = 'fa-solid fa-moon';
          btn.setAttribute('aria-label', 'Switch to dark mode');
          btn.setAttribute('title', 'Switch to Dark Mode');
        }
      }
    });
  }

  function toggleTheme() {
    const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  }


  window.toggleTheme = toggleTheme;


  function initPageTransitionOverlay() {
    let overlay = document.getElementById('pageTransitionOverlay');
    if (!overlay && document.body) {
      overlay = document.createElement('div');
      overlay.id = 'pageTransitionOverlay';
      overlay.innerHTML = '<div class="transition-progress-bar"></div>';
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  function handleBlogTransitions() {
    const overlay = initPageTransitionOverlay();
    if (overlay) {
      setTimeout(() => {
        overlay.classList.remove('is-active');
      }, 50);
    }

    const mainTarget = document.querySelector('main') || document.querySelector('article');
    if (mainTarget && !mainTarget.classList.contains('page-fade-in')) {
      mainTarget.classList.add('page-fade-in');
    }

    document.addEventListener('click', (e) => {
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:') || link.getAttribute('target') === '_blank') return;

      const isBlogLink = link.classList.contains('card-link') ||
        link.closest('.blog-card') ||
        link.classList.contains('back-link') ||
        href.includes('assets/pages/') ||
        (window.location.pathname.toLowerCase().includes('/assets/pages/') && (href.includes('blog.html') || href.includes('hopehand.html')));

      if (isBlogLink) {
        e.preventDefault();
        const card = link.closest('.blog-card');
        if (card) {
          card.classList.add('card-clicked');
        }
        const activeOverlay = initPageTransitionOverlay();
        if (activeOverlay) {
          activeOverlay.classList.add('is-active');
        }
        setTimeout(() => {
          window.location.href = href;
        }, 320);
      }
    });
  }


  document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('.theme-toggle-btn');
    if (toggleBtn) {
      e.preventDefault();
      toggleTheme();
    }
  }, true);


  const currentTheme = getPreferredTheme();
  applyTheme(currentTheme);


  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(document.documentElement.getAttribute('data-theme') || currentTheme);
    handleBlogTransitions();


    const mobileBtn = document.querySelector('.mobile-toggle-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileBtn && navMenu) {
      const updateMenuState = () => {
        const isOpen = navMenu.classList.contains('is-open');
        mobileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        mobileBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
      };

      mobileBtn.addEventListener('click', () => {
        navMenu.classList.toggle('is-open');
        updateMenuState();
      });

      navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('is-open');
          updateMenuState();
        });
      });

      document.addEventListener('click', (e) => {
        if (!mobileBtn.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('is-open')) {
          navMenu.classList.remove('is-open');
          updateMenuState();
        }
      });
    }


    const navLinks = document.querySelectorAll('.nav-link');
    const rawPath = window.location.pathname.split('/').pop() || 'hopehand.html';
    const currentFileName = rawPath.toLowerCase();

    function updateActiveNavLink() {
      const sections = Array.from(document.querySelectorAll('section[id], div[id], header[id]'))
        .filter(sec => sec.id && !['customInputWrapper', 'filterWrap', 'blogGrid', 'accordionExample'].includes(sec.id));

      let currentSectionId = '';
      const scrollPosition = window.scrollY + 180;

      if (window.scrollY < 120) {
        currentSectionId = '';
      } else {
        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSectionId = section.id;
          }
        });
      }

      navLinks.forEach(link => {
        const href = (link.getAttribute('href') || '').toLowerCase();
        if (!href) return;

        if (href.includes('#')) {
          const parts = href.split('#');
          const pagePart = parts[0].split('/').pop();
          const hashPart = parts[1];
          const isCurrentPage = !pagePart || pagePart === currentFileName ||
            (currentFileName === 'index.html' && pagePart === 'hopehand.html') ||
            (currentFileName === 'hopehand.html' && pagePart === 'index.html') ||
            (currentFileName === '' && (pagePart === 'hopehand.html' || pagePart === 'index.html'));

          if (isCurrentPage && currentSectionId) {
            if (hashPart === currentSectionId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          } else if (isCurrentPage && !currentSectionId && (hashPart === 'home' || hashPart === '' || link.textContent.trim().toLowerCase() === 'home')) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        } else {
          const linkPath = href.split('/').pop();
          if (!currentSectionId && (linkPath === currentFileName || (currentFileName === 'index.html' && linkPath === 'hopehand.html') || (currentFileName === '' && linkPath === 'hopehand.html'))) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        }
      });
    }

    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink, { passive: true });

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          backToTopBtn.classList.add('is-visible');
        } else {
          backToTopBtn.classList.remove('is-visible');
        }
      });

      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    // Donation Card Amount Selection & Custom Input Toggle
    const donationCards = document.querySelectorAll('.donation-card');
    donationCards.forEach(card => {
      const amountBtns = card.querySelectorAll('.amount-btn');
      const customWrapper = card.querySelector('.custom-input-wrapper');
      const customInput = card.querySelector('.custom-amount-input');

      amountBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          amountBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const amountVal = btn.getAttribute('data-amount') || btn.textContent.trim().toLowerCase();
          if (amountVal === 'custom') {
            if (customWrapper) {
              customWrapper.style.display = 'flex';
              if (customInput) customInput.focus();
            }
          } else {
            if (customWrapper) {
              customWrapper.style.display = 'none';
            }
          }
        });
      });
    });

    // Smooth Scroll for "See Our Impact" and Anchor Links
    document.querySelectorAll('a[href*="#impact"], a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;

        const hashIndex = href.indexOf('#');
        if (hashIndex !== -1) {
          const hash = href.substring(hashIndex);
          const targetEl = document.querySelector(hash);

          if (targetEl) {
            const rawPath = window.location.pathname.split('/').pop() || 'hopehand.html';
            const pagePart = href.substring(0, hashIndex).split('/').pop();
            const isSamePage = !pagePart || pagePart.toLowerCase() === rawPath.toLowerCase() ||
              (rawPath.toLowerCase() === 'index.html' && pagePart.toLowerCase() === 'hopehand.html') ||
              (rawPath.toLowerCase() === 'hopehand.html' && pagePart.toLowerCase() === 'index.html') ||
              (rawPath.toLowerCase() === '' && (pagePart.toLowerCase() === 'hopehand.html' || pagePart.toLowerCase() === 'index.html'));

            if (isSamePage) {
              e.preventDefault();
              const headerOffset = 80;
              const elementPosition = targetEl.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }
          }
        }
      });
    });

    // Scroll-Triggered Progress Bar Animation for Active Campaigns
    const progressBars = document.querySelectorAll('.progress');
    if (progressBars.length > 0) {
      const triggerProgressAnimation = (bar) => {
        let targetPercent = 0;
        const dataVal = bar.getAttribute('data-progress');
        if (dataVal) {
          targetPercent = parseInt(dataVal, 10);
        }

        if (!targetPercent) {
          const parent = bar.closest('.campaign');
          if (parent) {
            const match = parent.textContent.match(/(\d+)%/);
            if (match) {
              targetPercent = parseInt(match[1], 10);
            }
          }
        }

        if (!targetPercent) {
          const classList = Array.from(bar.classList);
          const fillMatch = classList.find(c => c.startsWith('fill-'));
          if (fillMatch) {
            targetPercent = parseInt(fillMatch.replace('fill-', ''), 10);
          }
        }

        if (targetPercent > 0) {
          setTimeout(() => {
            bar.style.width = targetPercent + '%';
            bar.setAttribute('data-filled', 'true');
            bar.classList.add('animated');
          }, 100);
        }
      };

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              triggerProgressAnimation(entry.target);
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });

        progressBars.forEach(bar => observer.observe(bar));
      } else {
        progressBars.forEach(triggerProgressAnimation);
      }
    }
  });
})();
