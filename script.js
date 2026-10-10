document.addEventListener('DOMContentLoaded', () => {
  // 1. Lenis Smooth Scroll Setup
  if (typeof Lenis !== 'undefined') {
    window.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1
    });

    function raf(time) {
      window.lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Bind Lenis smooth scroll to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          window.lenis.scrollTo(targetElement, { offset: -70 });
        }
      });
    });
  }

  // 2. Navbar Scroll Transition
  const siteHeader = document.getElementById('siteHeader');
  function handleNavScroll() {
    if (siteHeader) {
      if (window.scrollY > 10) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
  }
  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll();

  // 3. Scroll & Load Reveal Animations
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, {
      root: null,
      threshold: 0.05,
      rootMargin: '50px 0px 50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
    
    // Also trigger immediately for elements in/near viewport on load
    setTimeout(() => {
      revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100) {
          el.classList.add('revealed');
        }
      });
    }, 100);
  }



  // 1. Mobile Navigation Toggle (Slide-in Drawer)
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navBackdrop = document.getElementById('navBackdrop');

  function openNav() {
    if (navLinks) navLinks.classList.add('open');
    if (navBackdrop) navBackdrop.classList.add('open');
    document.body.classList.add('nav-open');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'true');
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      }
    }
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    if (navLinks) navLinks.classList.remove('open');
    if (navBackdrop) navBackdrop.classList.remove('open');
    document.body.classList.remove('nav-open');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    }
    document.body.style.overflow = '';
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.contains('open');
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', () => {
        closeNav();
      });
    }

    // Close menu when clicking on any nav link or CTA button inside drawer
    navLinks.querySelectorAll('.nav-item, .nav-cta-btn').forEach(link => {
      link.addEventListener('click', () => {
        closeNav();
      });
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeNav();
      }
    });
  }

  // 4. Active Section Scroll Spy (Highlighting current section)
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-item, .nav-cta-btn');

  const updateActiveSection = () => {
    let current = 'home';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    allNavLinks.forEach(item => {
      const href = item.getAttribute('href');
      item.classList.toggle('active', href === '#' + current);
    });
  };

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  updateActiveSection();

  // 3. Toast Helper
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }

  // 4. BibTeX Citation Copy
  const bibBtns = document.querySelectorAll('.copy-bib-btn');
  bibBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const bibtex = btn.getAttribute('data-bibtex');
      if (!bibtex) return;

      try {
        await navigator.clipboard.writeText(bibtex.trim());
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.borderColor = 'var(--accent-emerald)';
        btn.style.color = 'var(--accent-emerald)';
        showToast('BibTeX citation copied to clipboard');

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2000);
      } catch (err) {
        fallbackCopy(bibtex.trim());
        showToast('BibTeX citation copied to clipboard');
      }
    });
  });

  // 5. Email Copy Button
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const emailVal = document.getElementById('emailVal');
  const copyEmailText = document.getElementById('copyEmailText');

  if (copyEmailBtn && emailVal) {
    copyEmailBtn.addEventListener('click', async () => {
      const text = emailVal.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        if (copyEmailText) copyEmailText.textContent = 'Copied!';
        showToast('Email address copied to clipboard');

        setTimeout(() => {
          if (copyEmailText) copyEmailText.textContent = 'Copy Email';
        }, 2000);
      } catch (err) {
        fallbackCopy(text);
        showToast('Email address copied to clipboard');
      }
    });
  }

  // Fallback clipboard method
  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (e) {
      console.error('Fallback copy failed:', e);
    }
    document.body.removeChild(textarea);
  }

  // Clean up any previously stored theme override so default root styles apply cleanly
  try {
    localStorage.removeItem('portfolio_theme');
  } catch (e) {}

  // 7. Download CV Dropdown Toggle
  const cvDropdownWrap = document.getElementById('cvDropdownWrap');
  const cvDropdownBtn = document.getElementById('cvDropdownBtn');

  if (cvDropdownBtn && cvDropdownWrap) {
    cvDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = cvDropdownWrap.classList.toggle('active');
      cvDropdownBtn.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!cvDropdownWrap.contains(e.target)) {
        cvDropdownWrap.classList.remove('active');
        cvDropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 8. Projects Section "View All Projects" Toggle
  const viewAllProjectsBtn = document.getElementById('viewAllProjectsBtn');
  if (viewAllProjectsBtn) {
    const extraProjectCards = document.querySelectorAll('.project-card-extra');
    const btnText = viewAllProjectsBtn.querySelector('.btn-text');

    viewAllProjectsBtn.addEventListener('click', () => {
      const isExpanded = viewAllProjectsBtn.classList.toggle('is-active');
      viewAllProjectsBtn.setAttribute('aria-expanded', isExpanded);

      extraProjectCards.forEach(card => {
        if (isExpanded) {
          card.classList.add('is-visible');
        } else {
          card.classList.remove('is-visible');
        }
      });

      if (btnText) {
        btnText.textContent = isExpanded ? 'Show Less' : 'View All Projects';
      }
    });
  }

  // 9. Entire Project Card Clickable Navigation
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // If user clicked directly on the anchor or inside it, allow normal link navigation
      if (e.target.closest('a')) return;
      
      const link = card.querySelector('.project-details-link');
      if (link && link.getAttribute('href')) {
        window.location.href = link.getAttribute('href');
      }
    });
  });
});

