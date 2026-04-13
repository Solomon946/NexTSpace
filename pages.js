/* ============================================
   NEXUS PLATFORM — PAGES JS ENGINE
   Blog, Careers, Pricing, Cookie, TOC Spy
   ============================================ */

'use strict';

/* ══════════════════════════════════════════
   BLOG DATA
══════════════════════════════════════════ */
const BLOG_POSTS = [
  {
    id: 'bp_001',
    slug: 'building-saas-dashboard-2025',
    title: 'Building a Premium SaaS Dashboard in 2025: Design Principles That Matter',
    excerpt: 'Discover the key design patterns and component architectures that separate great SaaS dashboards from mediocre ones — with real code examples.',
    tag: 'Design',
    emoji: '📊',
    author: 'Sarah Chen',
    authorInitials: 'SC',
    authorRole: 'Head of Design',
    date: 'April 2, 2025',
    readTime: '8 min read',
    featured: true,
    gradient: 'linear-gradient(135deg,#0F2044 0%,#1B3A6B 100%)',
  },
  {
    id: 'bp_002',
    slug: 'css-variables-theming',
    title: 'CSS Custom Properties: The Secret to Scalable Design Systems',
    excerpt: 'How to architect a robust CSS variable system that scales from a simple component library to a full enterprise design system.',
    tag: 'Development',
    emoji: '🎨',
    author: 'Marcus Webb',
    authorInitials: 'MW',
    authorRole: 'Senior Engineer',
    date: 'March 28, 2025',
    readTime: '6 min read',
    featured: false,
    gradient: 'linear-gradient(135deg,#0D9488 0%,#059669 100%)',
  },
  {
    id: 'bp_003',
    slug: 'performance-optimization-web',
    title: 'Web Performance in 2025: Achieving 100/100 Lighthouse Scores',
    excerpt: 'A practical guide to Core Web Vitals, lazy loading, code splitting, and all the techniques that actually move the needle on performance.',
    tag: 'Performance',
    emoji: '⚡',
    author: 'James Liu',
    authorInitials: 'JL',
    authorRole: 'Platform Engineer',
    date: 'March 20, 2025',
    readTime: '10 min read',
    featured: false,
    gradient: 'linear-gradient(135deg,#1E4D8C 0%,#2563EB 100%)',
  },
  {
    id: 'bp_004',
    slug: 'saas-pricing-strategy',
    title: 'SaaS Pricing Strategy: How We Increased Revenue by 40% Without More Customers',
    excerpt: 'The pricing experiments we ran over 6 months — what worked, what failed, and the surprising insights about value-based pricing.',
    tag: 'Business',
    emoji: '💰',
    author: 'Priya Patel',
    authorInitials: 'PP',
    authorRole: 'Head of Growth',
    date: 'March 14, 2025',
    readTime: '7 min read',
    featured: false,
    gradient: 'linear-gradient(135deg,#7C3AED 0%,#6366F1 100%)',
  },
  {
    id: 'bp_005',
    slug: 'dark-mode-implementation',
    title: 'The Right Way to Implement Dark Mode (It\'s Not What You Think)',
    excerpt: 'CSS custom properties, system preferences, and user overrides — a complete guide to building dark mode that users actually love.',
    tag: 'Design',
    emoji: '🌙',
    author: 'Sarah Chen',
    authorInitials: 'SC',
    authorRole: 'Head of Design',
    date: 'March 8, 2025',
    readTime: '5 min read',
    featured: false,
    gradient: 'linear-gradient(135deg,#0A1628 0%,#1B3A6B 100%)',
  },
  {
    id: 'bp_006',
    slug: 'animation-principles-ui',
    title: '12 Animation Principles Every UI Developer Should Master',
    excerpt: 'Borrowed from the Disney animators playbook — how easing, timing, and anticipation create interfaces that feel alive and intuitive.',
    tag: 'Animation',
    emoji: '✨',
    author: 'Alex Rivera',
    authorInitials: 'AR',
    authorRole: 'Frontend Lead',
    date: 'March 1, 2025',
    readTime: '9 min read',
    featured: false,
    gradient: 'linear-gradient(135deg,#D97706 0%,#F59E0B 100%)',
  },
];

/* ══════════════════════════════════════════
   CAREERS DATA
══════════════════════════════════════════ */
const JOB_LISTINGS = [
  {
    id: 'job_001',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Remote (Global)',
    salary: '$120k – $160k',
    level: 'Senior',
    tags: ['React', 'TypeScript', 'CSS'],
    desc: 'Build world-class user interfaces that scale to millions of users. You\'ll architect component systems, own frontend performance, and collaborate closely with design to ship beautiful products.',
    posted: '2 days ago',
  },
  {
    id: 'job_002',
    title: 'UI/UX Designer',
    department: 'Design',
    type: 'Full-time',
    location: 'San Francisco / Remote',
    salary: '$100k – $140k',
    level: 'Mid-Senior',
    tags: ['Figma', 'Design Systems', 'Research'],
    desc: 'Shape how our platform looks and feels. You\'ll own the end-to-end design process — from user research and wireframing to polished Figma components and design system documentation.',
    posted: '5 days ago',
  },
  {
    id: 'job_003',
    title: 'Full-Stack Engineer (Node/React)',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Remote (US/EU)',
    salary: '$110k – $150k',
    level: 'Senior',
    tags: ['Node.js', 'React', 'PostgreSQL'],
    desc: 'Work across our entire stack building new product features, improving APIs, and optimizing database queries. Strong ownership culture — you\'ll take ideas from concept to production.',
    posted: '1 week ago',
  },
  {
    id: 'job_004',
    title: 'Head of Customer Success',
    department: 'Customer Success',
    type: 'Full-time',
    location: 'San Francisco, CA',
    salary: '$90k – $130k',
    level: 'Lead',
    tags: ['SaaS', 'Onboarding', 'Retention'],
    desc: 'Build and lead our customer success function from the ground up. Own onboarding, retention, expansion revenue, and NPS. You\'ll be the voice of the customer internally.',
    posted: '1 week ago',
  },
  {
    id: 'job_005',
    title: 'DevOps / Platform Engineer',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Remote (Global)',
    salary: '$115k – $155k',
    level: 'Senior',
    tags: ['AWS', 'Kubernetes', 'Terraform'],
    desc: 'Own our cloud infrastructure, CI/CD pipelines, and developer tooling. We aim for 99.99% uptime and deploy dozens of times per day — you\'ll make that seamless.',
    posted: '2 weeks ago',
  },
  {
    id: 'job_006',
    title: 'Growth Marketing Manager',
    department: 'Marketing',
    type: 'Full-time',
    location: 'Remote (US)',
    salary: '$85k – $115k',
    level: 'Mid',
    tags: ['SEO', 'Paid Ads', 'Analytics'],
    desc: 'Drive user acquisition and revenue growth through data-driven marketing experiments. Own SEO, paid acquisition, content strategy, and conversion rate optimization.',
    posted: '3 weeks ago',
  },
];

/* ══════════════════════════════════════════
   BLOG PAGE ENGINE
══════════════════════════════════════════ */
const NexusBlog = (() => {

  const renderFeatured = (post) => `
    <div class="blog-featured">
      <div class="blog-featured-image" style="background:${post.gradient};">
        <span style="font-size:7rem;position:relative;z-index:1;">${post.emoji}</span>
      </div>
      <div class="blog-featured-body">
        <div class="blog-tag" style="margin-bottom:var(--space-3);">⭐ Featured · ${post.tag}</div>
        <h2 style="font-family:var(--font-heading);font-size:var(--text-2xl);font-weight:800;line-height:1.3;margin-bottom:var(--space-3);">${post.title}</h2>
        <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.7;margin-bottom:var(--space-5);">${post.excerpt}</p>
        <div class="blog-meta">
          <div class="blog-meta-avatar">${post.authorInitials}</div>
          <span>${post.author}</span>
          <span>·</span>
          <span>${post.date}</span>
          <span>·</span>
          <span>⏱ ${post.readTime}</span>
          <button class="btn btn-primary btn-sm btn-ripple" style="margin-left:auto;" onclick="NexusBlog.openPost('${post.id}')">Read Article →</button>
        </div>
      </div>
    </div>
  `;

  const renderCard = (post) => `
    <div class="blog-card reveal-scale" onclick="NexusBlog.openPost('${post.id}')">
      <div class="blog-card-image" style="background:${post.gradient};">
        <span>${post.emoji}</span>
      </div>
      <div class="blog-card-body">
        <div class="blog-tag">${post.tag}</div>
        <h3 class="blog-card-title">${post.title}</h3>
        <p class="blog-card-excerpt">${post.excerpt}</p>
        <div class="blog-meta">
          <div class="blog-meta-avatar">${post.authorInitials}</div>
          <span>${post.author}</span>
          <span>·</span>
          <span>${post.readTime}</span>
        </div>
      </div>
    </div>
  `;

  const openPost = (id) => {
    const post = BLOG_POSTS.find(p => p.id === id);
    if (!post) return;
    NexusApp.Toast.info('Opening Article', post.title.substring(0,40) + '…');
  };

  const init = () => {
    const featured = document.getElementById('blog-featured');
    const grid = document.getElementById('blog-grid');
    if (!featured || !grid) return;

    const [fp, ...rest] = BLOG_POSTS;
    featured.innerHTML = renderFeatured(fp);
    grid.innerHTML = rest.map(renderCard).join('');
    NexusAnimations.initScrollReveal();

    // Tag filter
    document.querySelectorAll('.blog-sidebar-tag[data-tag]').forEach(t => {
      t.addEventListener('click', () => {
        document.querySelectorAll('.blog-sidebar-tag[data-tag]').forEach(x => x.style.background = '');
        t.style.background = 'rgba(37,99,235,0.12)';
        t.style.borderColor = 'rgba(37,99,235,0.3)';
        t.style.color = 'var(--navy-400)';
        const tag = t.dataset.tag;
        const filtered = tag === 'all' ? rest : rest.filter(p => p.tag === tag);
        grid.innerHTML = filtered.length
          ? filtered.map(renderCard).join('')
          : `<div style="grid-column:1/-1;text-align:center;padding:var(--space-12);color:var(--text-muted);">No posts in this category yet.</div>`;
        NexusAnimations.initScrollReveal();
      });
    });

    // Newsletter form
    const nlForm = document.getElementById('blog-newsletter-form');
    nlForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      NexusApp.Toast.success('Subscribed! 🎉', 'You\'ll get our best articles every week.');
      nlForm.reset();
    });
  };

  return { init, openPost };
})();

/* ══════════════════════════════════════════
   CAREERS PAGE ENGINE
══════════════════════════════════════════ */
const NexusCareers = (() => {

  const deptColors = {
    Engineering: 'badge-blue',
    Design: 'badge-green',
    'Customer Success': 'badge-yellow',
    Marketing: 'badge-gray',
  };

  const renderJob = (job) => `
    <div class="job-card reveal" data-dept="${job.department}">
      <div class="job-card-header">
        <div>
          <h3 class="job-title">${job.title}</h3>
          <div class="job-tags" style="margin-top:var(--space-2);">
            <span class="badge ${deptColors[job.department] || 'badge-blue'}">${job.department}</span>
            <span class="badge badge-gray">${job.type}</span>
            <span class="badge badge-gray">${job.level}</span>
          </div>
        </div>
        <div style="text-align:right;flex-shrink:0;">
          <div style="font-family:var(--font-heading);font-weight:800;font-size:var(--text-base);color:var(--text-primary);">${job.salary}</div>
          <div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:2px;">Posted ${job.posted}</div>
        </div>
      </div>
      <p class="job-desc">${job.desc}</p>
      <div class="job-footer">
        <div class="job-info">
          <div class="job-info-item">📍 ${job.location}</div>
          <div class="job-info-item" style="display:flex;gap:var(--space-1);">
            ${job.tags.map(t => `<span class="badge badge-gray" style="font-size:10px;">${t}</span>`).join('')}
          </div>
        </div>
        <button class="btn btn-primary btn-sm btn-ripple"
          onclick="NexusCareers.apply('${job.id}')">
          Apply Now →
        </button>
      </div>
    </div>
  `;

  const apply = (jobId) => {
    const job = JOB_LISTINGS.find(j => j.id === jobId);
    if (!job) return;
    NexusApp.Modal.open('apply-modal');
    const title = document.getElementById('apply-modal-job-title');
    if (title) title.textContent = job.title;
  };

  const init = () => {
    const list = document.getElementById('jobs-list');
    const count = document.getElementById('jobs-count');
    if (!list) return;

    const render = (jobs) => {
      if (count) count.textContent = `${jobs.length} open positions`;
      list.innerHTML = jobs.map(renderJob).join('');
      NexusAnimations.initScrollReveal();
    };

    render(JOB_LISTINGS);

    // Department filter
    document.querySelectorAll('[data-dept-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-dept-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const dept = btn.dataset.deptFilter;
        render(dept === 'all' ? JOB_LISTINGS : JOB_LISTINGS.filter(j => j.department === dept));
      });
    });

    // Search
    let debounce;
    document.getElementById('job-search')?.addEventListener('input', (e) => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        const q = e.target.value.trim().toLowerCase();
        render(q
          ? JOB_LISTINGS.filter(j =>
              j.title.toLowerCase().includes(q) ||
              j.department.toLowerCase().includes(q) ||
              j.tags.some(t => t.toLowerCase().includes(q))
            )
          : JOB_LISTINGS
        );
      }, 300);
    });
  };

  return { init, apply };
})();

/* ══════════════════════════════════════════
   PRICING PAGE ENGINE
══════════════════════════════════════════ */
const NexusPricing = (() => {

  const PLANS = {
    monthly: { starter: 29, pro: 79, enterprise: 199 },
    annual:  { starter: 22, pro: 59, enterprise: 149 },
  };

  let billing = 'monthly';

  const init = () => {
    const toggle = document.getElementById('billing-toggle');
    const monthlyLabel = document.getElementById('billing-monthly');
    const annualLabel  = document.getElementById('billing-annual');

    toggle?.addEventListener('click', () => {
      billing = billing === 'monthly' ? 'annual' : 'monthly';
      toggle.classList.toggle('annual', billing === 'annual');
      monthlyLabel?.classList.toggle('active', billing === 'monthly');
      annualLabel?.classList.toggle('active',  billing === 'annual');
      updatePrices();
    });

    updatePrices();

    // FAQ
    document.querySelectorAll('[data-pricing-faq]').forEach(item => {
      item.querySelector('[data-faq-q]')?.addEventListener('click', () => {
        const isOpen = item.classList.contains('accordion-open');
        document.querySelectorAll('[data-pricing-faq]').forEach(i => {
          i.classList.remove('accordion-open');
          i.querySelector('[data-accordion-content]')?.classList.remove('open');
        });
        if (!isOpen) {
          item.classList.add('accordion-open');
          item.querySelector('[data-accordion-content]')?.classList.add('open');
        }
      });
    });
  };

  const updatePrices = () => {
    const prices = PLANS[billing];
    const setPrice = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    setPrice('price-starter',    prices.starter);
    setPrice('price-pro',        prices.pro);
    setPrice('price-enterprise', prices.enterprise);

    const perLabel = billing === 'annual' ? '/ mo, billed annually' : '/ month';
    document.querySelectorAll('.price-period').forEach(el => el.textContent = perLabel);

    // Show/hide savings badge
    document.querySelectorAll('.annual-savings-badge').forEach(el => {
      el.style.display = billing === 'annual' ? 'inline-flex' : 'none';
    });
  };

  return { init };
})();

/* ══════════════════════════════════════════
   LEGAL TOC SPY (scroll-aware active link)
══════════════════════════════════════════ */
const NexusTOC = (() => {
  const init = () => {
    const links = document.querySelectorAll('.legal-toc-link');
    if (!links.length) return;

    const sections = Array.from(links).map(link => {
      const id = link.getAttribute('href')?.replace('#', '');
      return { link, section: id ? document.getElementById(id) : null };
    }).filter(x => x.section);

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const match = sections.find(s => s.section === entry.target);
          match?.link.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

    sections.forEach(({ section }) => observer.observe(section));
  };

  return { init };
})();

/* ══════════════════════════════════════════
   COOKIE CONSENT BANNER
══════════════════════════════════════════ */
const NexusCookies = (() => {
  const STORAGE_KEY = 'nexus_cookie_consent';

  const init = () => {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    const accepted = localStorage.getItem(STORAGE_KEY);
    if (accepted) { banner.classList.add('hidden'); return; }

    // Show after small delay
    setTimeout(() => banner.classList.remove('hidden'), 1500);

    document.getElementById('cookie-accept-all')?.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY, 'all');
      banner.classList.add('hidden');
      NexusApp.Toast.success('Preferences Saved', 'All cookies accepted. Thank you!');
    });

    document.getElementById('cookie-accept-essential')?.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY, 'essential');
      banner.classList.add('hidden');
      NexusApp.Toast.info('Preferences Saved', 'Only essential cookies enabled.');
    });

    document.getElementById('cookie-manage')?.addEventListener('click', () => {
      window.location.href = '/pages/cookie-policy.html';
    });
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    NexusApp.Toast.info('Cookies Reset', 'Your cookie preferences have been cleared.');
    setTimeout(() => location.reload(), 1200);
  };

  return { init, reset };
})();

/* ══════════════════════════════════════════
   CONTACT PAGE ENGINE
══════════════════════════════════════════ */
const NexusContact = (() => {
  const init = () => {
    const form = document.getElementById('main-contact-form');
    if (!form) return;

    NexusApp.FormValidator.initLive(form);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (NexusApp.FormValidator.validate(form)) {
        const btn = form.querySelector('[type="submit"]');
        if (btn) {
          btn.innerHTML = '<span class="spinner"></span> Sending…';
          btn.disabled = true;
        }
        setTimeout(() => {
          if (btn) {
            btn.innerHTML = '✓ Message Sent!';
            btn.style.background = 'linear-gradient(135deg,#059669,#10B981)';
          }
          NexusApp.Toast.success('Message Sent!', 'We\'ll get back to you within 24 hours.');
          setTimeout(() => {
            form.reset();
            if (btn) {
              btn.innerHTML = 'Send Message →';
              btn.style.background = '';
              btn.disabled = false;
            }
          }, 3000);
        }, 1400);
      }
    });
  };

  return { init };
})();

/* ══════════════════════════════════════════
   AUTO-INIT
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.includes('blog.html'))           NexusBlog.init();
  if (path.includes('careers.html'))        NexusCareers.init();
  if (path.includes('pricing.html'))        NexusPricing.init();
  if (path.includes('contact.html'))        NexusContact.init();
  if (path.includes('privacy-policy.html') ||
      path.includes('terms-of-service.html') ||
      path.includes('cookie-policy.html'))  NexusTOC.init();

  // Cookie banner on all pages
  NexusCookies.init();
});