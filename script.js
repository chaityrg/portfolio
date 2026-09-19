document.addEventListener('DOMContentLoaded', () => {
  // 1. Lenis Smooth Scroll Setup
  if (typeof Lenis !== 'undefined') {
    window.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false
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



  // 1. Mobile Navigation Toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking on any nav link
    navLinks.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Active Section Scroll Spy
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  const onScroll = () => {
    let current = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      const href = item.getAttribute('href');
      item.classList.toggle('active', href === '#' + current);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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
});
