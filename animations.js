/* ============================================
   NEXUS PLATFORM — ANIMATION ENGINE
   Scroll-reveal, Tilt, Ripple, Counters
   ============================================ */

const NexusAnimations = (() => {

  /* ── Scroll Reveal (Intersection Observer) ── */
  const initScrollReveal = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Don't unobserve so re-entry works on revisit
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
      .forEach(el => observer.observe(el));

    return observer;
  };

  /* ── Stagger Children ── */
  const staggerChildren = (parent, selector = '.reveal', baseDelay = 100) => {
    const children = parent.querySelectorAll(selector);
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * baseDelay}ms`;
    });
  };

  /* ── Ripple Effect ── */
  const initRipple = () => {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-ripple');
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 2;

      ripple.classList.add('ripple-effect');
      Object.assign(ripple.style, {
        width:  `${size}px`,
        height: `${size}px`,
        top:    `${e.clientY - rect.top - size / 2}px`,
        left:   `${e.clientX - rect.left - size / 2}px`,
      });

      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  };

  /* ── 3D Tilt on Cards ── */
  const initTilt = () => {
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -6;
        const rotateY = ((x - cx) / cx) * 6;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      });
    });
  };

  /* ── Animated Number Counter ── */
  const animateCounter = (el, target, duration = 1800, prefix = '', suffix = '') => {
    const start = performance.now();
    const startVal = 0;

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * eased);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  const initCounters = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          const target = parseFloat(entry.target.dataset.target || 0);
          const prefix = entry.target.dataset.prefix || '';
          const suffix = entry.target.dataset.suffix || '';
          animateCounter(entry.target, target, 1800, prefix, suffix);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-counter]').forEach(el => observer.observe(el));
  };

  /* ── Parallax on Hero ── */
  const initParallax = () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const blobs = hero.querySelectorAll('.hero-blob-1, .hero-blob-2');

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        blobs.forEach((blob, i) => {
          const speed = i === 0 ? 0.35 : 0.2;
          blob.style.transform = `translateY(${scrolled * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }, { passive: true });
  };

  /* ── Navbar scroll effect ── */
  const initNavbar = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const scroll = window.pageYOffset;
      if (scroll > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastScroll = scroll;
    }, { passive: true });
  };

  /* ── Skeleton Loader ── */
  const showSkeleton = (container, count = 4) => {
    const html = Array.from({ length: count }, () => `
      <div class="card">
        <div class="skeleton" style="height:200px;border-radius:12px 12px 0 0;"></div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:10px;">
          <div class="skeleton" style="height:14px;width:60%;border-radius:6px;"></div>
          <div class="skeleton" style="height:20px;width:90%;border-radius:6px;"></div>
          <div class="skeleton" style="height:14px;width:80%;border-radius:6px;"></div>
          <div class="skeleton" style="height:14px;width:45%;border-radius:6px;"></div>
        </div>
      </div>
    `).join('');
    container.innerHTML = html;
  };

  /* ── Page Transition ── */
  const pageTransition = (href) => {
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      background: 'var(--navy-900)',
      zIndex: '9999',
      opacity: '0',
      transition: 'opacity 0.25s ease',
      pointerEvents: 'none',
    });
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      setTimeout(() => {
        window.location.href = href;
      }, 260);
    });
  };

  /* ── Smooth link transitions ── */
  const initPageTransitions = () => {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-transition]');
      if (!link || link.target === '_blank') return;
      e.preventDefault();
      pageTransition(link.href);
    });
  };

  /* ── Accordion ── */
  const initAccordions = () => {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-accordion-trigger]');
      if (!trigger) return;

      const item = trigger.closest('[data-accordion-item]');
      const content = item?.querySelector('[data-accordion-content]');
      if (!item || !content) return;

      const isOpen = item.classList.contains('accordion-open');

      // Close siblings in same group
      const group = item.closest('[data-accordion-group]');
      if (group) {
        group.querySelectorAll('[data-accordion-item].accordion-open').forEach(sibling => {
          if (sibling !== item) {
            sibling.classList.remove('accordion-open');
            sibling.querySelector('[data-accordion-content]')?.classList.remove('open');
          }
        });
      }

      item.classList.toggle('accordion-open', !isOpen);
      content.classList.toggle('open', !isOpen);
    });
  };

  /* ── Tabs ── */
  const initTabs = (container) => {
    if (!container) return;

    const triggers = container.querySelectorAll('[data-tab]');
    const contents = container.querySelectorAll('[data-tab-content]');

    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const target = trigger.dataset.tab;

        triggers.forEach(t => t.classList.remove('active'));
        trigger.classList.add('active');

        contents.forEach(c => {
          c.classList.remove('active');
          if (c.dataset.tabContent === target) {
            setTimeout(() => c.classList.add('active'), 10);
          }
        });
      });
    });
  };

  /* ── Typing Effect ── */
  const typeEffect = (el, texts, speed = 100, pause = 2000) => {
    let textIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    const type = () => {
      const text = texts[textIdx];
      const displayed = isDeleting
        ? text.substring(0, charIdx - 1)
        : text.substring(0, charIdx + 1);

      el.textContent = displayed;

      if (!isDeleting && charIdx === text.length - 1) {
        isDeleting = true;
        setTimeout(type, pause);
        return;
      }

      if (isDeleting && charIdx === 0) {
        isDeleting = false;
        textIdx = (textIdx + 1) % texts.length;
      }

      charIdx = isDeleting ? charIdx - 1 : charIdx + 1;
      setTimeout(type, isDeleting ? speed / 2 : speed);
    };

    type();
  };

  /* ── Cursor Effect (subtle blue dot) ── */
  const initCursor = () => {
    if (window.matchMedia('(pointer:coarse)').matches) return; // skip on touch

    const cursor = document.createElement('div');
    cursor.id = 'nexus-cursor';
    Object.assign(cursor.style, {
      position: 'fixed',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: 'rgba(37,99,235,0.6)',
      pointerEvents: 'none',
      zIndex: '9999',
      transition: 'transform 0.1s ease, opacity 0.3s ease',
      transform: 'translate(-50%, -50%)',
      mixBlendMode: 'screen',
    });
    document.body.appendChild(cursor);

    let cx = -100, cy = -100;
    document.addEventListener('mousemove', (e) => {
      cx = e.clientX;
      cy = e.clientY;
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
    });

    document.addEventListener('mousedown', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
    });

    document.addEventListener('mouseup', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    document.querySelectorAll('a, button, .btn, .card-hover').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
        cursor.style.background = 'rgba(37,99,235,0.4)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.background = 'rgba(37,99,235,0.6)';
      });
    });
  };

  /* ── Progress Bar (top of page) ── */
  const initPageProgress = () => {
    const bar = document.createElement('div');
    Object.assign(bar.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      height: '3px',
      background: 'linear-gradient(90deg, #1E4D8C, #2563EB, #3B82F6)',
      width: '0%',
      zIndex: '9999',
      transition: 'width 0.1s linear',
      borderRadius: '0 3px 3px 0',
    });
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  };

  /* ── Fade-in page on load ── */
  const initPageLoad = () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    window.addEventListener('load', () => {
      requestAnimationFrame(() => {
        document.body.style.opacity = '1';
      });
    });
    // Fallback
    setTimeout(() => { document.body.style.opacity = '1'; }, 300);
  };

  /* ── Initialize All ── */
  const init = () => {
    initScrollReveal();
    initRipple();
    initAccordions();
    initNavbar();
    initCounters();
    initPageProgress();

    // Stagger card children
    document.querySelectorAll('[data-stagger]').forEach(parent => {
      const delay = parseInt(parent.dataset.stagger) || 100;
      staggerChildren(parent, '.reveal, .reveal-scale', delay);
      // Re-run observer for newly staggered items
      initScrollReveal();
    });

    // Init tabs
    document.querySelectorAll('[data-tabs]').forEach(initTabs);

    // Parallax
    if (document.querySelector('.hero')) {
      initParallax();
    }

    // Tilt on desktop only
    if (!window.matchMedia('(pointer:coarse)').matches) {
      initTilt();
    }

    // Page transitions
    initPageTransitions();

    // Typing effect
    const typer = document.querySelector('[data-typing]');
    if (typer) {
      const texts = JSON.parse(typer.dataset.typing || '[]');
      if (texts.length) typeEffect(typer, texts);
    }

    // Cursor
    // initCursor(); // Uncomment to enable custom cursor
  };

  // Public API
  return {
    init,
    initScrollReveal,
    initTilt,
    initAccordions,
    initTabs,
    animateCounter,
    showSkeleton,
    typeEffect,
    pageTransition,
  };
})();

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', NexusAnimations.init);
} else {
  NexusAnimations.init();
}
