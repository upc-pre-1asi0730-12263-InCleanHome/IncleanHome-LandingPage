/* ============================================================
   InCleanHome – script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Mobile Menu ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      // Animate bars
      const bars = hamburger.querySelectorAll('span');
      if (isOpen) {
        bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        bars[1].style.opacity   = '0';
        bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
      }
    });
  }

  /* ---- Scroll-triggered animations ---- */
  const animatedEls = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children in the same parent
        const siblings = [...entry.target.parentElement.querySelectorAll('[data-animate]')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 120);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animatedEls.forEach(el => observer.observe(el));

  /* ---- Navbar sticky shadow ---- */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.style.boxShadow = '0 4px 20px rgba(26,46,74,0.1)';
    } else {
      navbar.style.boxShadow = '0 2px 10px rgba(26,46,74,0.05)';
    }
  }, { passive: true });

  /* ---- Search Tabs ---- */
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  /* ---- Search Button ---- */
  const searchBtn = document.querySelector('.btn-search');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const city = document.querySelector('.form-group select')?.value;
      if (!city || city === 'Selecciona tu ciudad') {
        showToast('Por favor selecciona tu ciudad', 'warning');
        return;
      }
      searchBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Buscando...';
      searchBtn.disabled = true;
      setTimeout(() => {
        searchBtn.innerHTML = '<i class="fa fa-magnifying-glass"></i> Buscar profesionales';
        searchBtn.disabled = false;
        showToast('¡Búsqueda completada! Mostrando resultados.', 'success');
      }, 1800);
    });
  }

  /* ---- Newsletter Form ---- */
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    const newsletterBtn = newsletterForm.querySelector('.btn');
    newsletterBtn.addEventListener('click', () => {
      const input = newsletterForm.querySelector('input[type="email"]');
      const email = input?.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Ingresa un correo válido', 'warning');
        return;
      }
      newsletterBtn.textContent = '✓ Suscrito';
      newsletterBtn.style.background = '#00b272';
      input.value = '';
      setTimeout(() => {
        newsletterBtn.textContent = 'Suscribir';
        newsletterBtn.style.background = '';
      }, 3000);
    });
  }

  /* ---- "Ver todas las reseñas" button ---- */
  const moreBtn = document.querySelector('.reviews-more .btn');
  if (moreBtn) {
    moreBtn.addEventListener('click', () => {
      showToast('Cargando más reseñas...', 'info');
    });
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---- Toast Notification ---- */
  function showToast(msg, type = 'info') {
    // Remove existing
    document.querySelector('.toast-notification')?.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    const icons = { success: '✓', warning: '⚠', info: 'ℹ' };
    const colors = { success: '#00b272', warning: '#f59e0b', info: '#3b82f6' };
    toast.innerHTML = `
      <span class="toast-icon" style="color:${colors[type]}">${icons[type]}</span>
      <span>${msg}</span>
    `;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      background: '#fff',
      color: '#1a2e4a',
      border: `1.5px solid ${colors[type]}`,
      borderLeft: `5px solid ${colors[type]}`,
      borderRadius: '10px',
      padding: '14px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 8px 30px rgba(26,46,74,0.14)',
      zIndex: '9999',
      animation: 'slideInToast 0.35s ease forwards',
    });
    document.body.appendChild(toast);

    // Inject keyframes once
    if (!document.querySelector('#toastStyle')) {
      const style = document.createElement('style');
      style.id = 'toastStyle';
      style.textContent = `
        @keyframes slideInToast {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideOutToast {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(10px); }
        }
        .toast-icon { font-size: 18px; flex-shrink: 0; }
      `;
      document.head.appendChild(style);
    }

    setTimeout(() => {
      toast.style.animation = 'slideOutToast 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  /* ---- Counter animation for hero stats ---- */
  const stats = document.querySelectorAll('.stat strong');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(s => statsObserver.observe(s));

  function animateCounter(el) {
    const text = el.textContent;
    const prefix = text.includes('+') ? '+' : '';
    const suffix = text.includes('★') ? ' ★' : '';
    const raw = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (isNaN(raw)) return;
    const isDecimal = text.includes('.');
    const duration = 1200;
    const steps = 50;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const value = raw * ease;
      el.textContent = prefix + (isDecimal ? value.toFixed(1) : Math.floor(value).toLocaleString()) + suffix;
      if (step >= steps) {
        el.textContent = prefix + (isDecimal ? raw.toFixed(1) : raw.toLocaleString()) + suffix;
        clearInterval(interval);
      }
    }, duration / steps);
  }

});