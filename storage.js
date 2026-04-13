/* ============================================
   NEXUS PLATFORM — STORAGE & DATA LAYER
   localStorage Management + Simulated Data
   ============================================ */

const NexusStorage = (() => {
  const PREFIX = 'nexus_';
  const KEYS = {
    CART: 'cart',
    WISHLIST: 'wishlist',
    ORDERS: 'orders',
    USER: 'user',
    RECENTLY: 'recently_viewed',
    THEME: 'theme',
    NOTIFS: 'notifications',
    SETTINGS: 'settings',
  };

  // ── Core Helpers ──
  const get = (key) => {
    try {
      const val = localStorage.getItem(PREFIX + key);
      return val ? JSON.parse(val) : null;
    } catch { return null; }
  };

  const set = (key, value) => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch { return false; }
  };

  const remove = (key) => {
    localStorage.removeItem(PREFIX + key);
  };

  // ── Cart ──
  const cart = {
    get: () => get(KEYS.CART) || [],

    add: (product, qty = 1) => {
      const items = cart.get();
      const idx = items.findIndex(i => i.id === product.id);
      if (idx > -1) {
        items[idx].qty += qty;
      } else {
        items.push({ ...product, qty });
      }
      set(KEYS.CART, items);
      NexusStorage.events.emit('cartUpdated', cart.get());
      return items;
    },

    remove: (productId) => {
      const items = cart.get().filter(i => i.id !== productId);
      set(KEYS.CART, items);
      NexusStorage.events.emit('cartUpdated', items);
      return items;
    },

    updateQty: (productId, qty) => {
      const items = cart.get();
      const idx = items.findIndex(i => i.id === productId);
      if (idx > -1) {
        if (qty <= 0) return cart.remove(productId);
        items[idx].qty = qty;
        set(KEYS.CART, items);
        NexusStorage.events.emit('cartUpdated', items);
      }
      return items;
    },

    clear: () => {
      set(KEYS.CART, []);
      NexusStorage.events.emit('cartUpdated', []);
    },

    total: () => {
      return cart.get().reduce((sum, i) => sum + i.price * i.qty, 0);
    },

    count: () => {
      return cart.get().reduce((sum, i) => sum + i.qty, 0);
    },
  };

  // ── Wishlist ──
  const wishlist = {
    get: () => get(KEYS.WISHLIST) || [],

    toggle: (product) => {
      const list = wishlist.get();
      const idx = list.findIndex(i => i.id === product.id);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(product);
      }
      set(KEYS.WISHLIST, list);
      NexusStorage.events.emit('wishlistUpdated', list);
      return idx === -1; // returns true if added
    },

    has: (productId) => {
      return wishlist.get().some(i => i.id === productId);
    },

    count: () => wishlist.get().length,
  };

  // ── Orders ──
  const orders = {
    get: () => get(KEYS.ORDERS) || _seedOrders(),

    add: (order) => {
      const list = orders.get();
      const newOrder = {
        ...order,
        id: 'ORD-' + Date.now().toString(36).toUpperCase(),
        date: new Date().toISOString(),
        status: 'processing',
      };
      list.unshift(newOrder);
      set(KEYS.ORDERS, list);
      NexusStorage.events.emit('ordersUpdated', list);
      return newOrder;
    },

    update: (orderId, updates) => {
      const list = orders.get();
      const idx = list.findIndex(o => o.id === orderId);
      if (idx > -1) {
        list[idx] = { ...list[idx], ...updates };
        set(KEYS.ORDERS, list);
      }
      return list;
    },
  };

  // ── Recently Viewed ──
  const recently = {
    get: () => get(KEYS.RECENTLY) || [],

    add: (product) => {
      let list = recently.get().filter(i => i.id !== product.id);
      list.unshift(product);
      list = list.slice(0, 10);
      set(KEYS.RECENTLY, list);
    },
  };

  // ── User ──
  const user = {
    get: () => get(KEYS.USER) || _defaultUser(),
    set: (data) => set(KEYS.USER, data),
    update: (updates) => {
      const u = user.get();
      set(KEYS.USER, { ...u, ...updates });
    },
  };

  // ── Theme ──
  const theme = {
    get: () => get(KEYS.THEME) || 'dark',
    set: (t) => {
      set(KEYS.THEME, t);
      document.documentElement.setAttribute('data-theme', t);
      NexusStorage.events.emit('themeChanged', t);
    },
    toggle: () => {
      const current = theme.get();
      const next = current === 'dark' ? 'light' : 'dark';
      theme.set(next);
      return next;
    },
  };

  // ── Notifications ──
  const notifs = {
    get: () => get(KEYS.NOTIFS) || _defaultNotifs(),
    add: (notif) => {
      const list = notifs.get();
      list.unshift({ id: Date.now(), read: false, date: new Date().toISOString(), ...notif });
      set(KEYS.NOTIFS, list);
    },
    markRead: (id) => {
      const list = notifs.get().map(n => n.id === id ? { ...n, read: true } : n);
      set(KEYS.NOTIFS, list);
    },
    unreadCount: () => notifs.get().filter(n => !n.read).length,
  };

  // ── Event Bus ──
  const events = (() => {
    const listeners = {};
    return {
      on: (event, cb) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(cb);
      },
      off: (event, cb) => {
        if (listeners[event]) {
          listeners[event] = listeners[event].filter(fn => fn !== cb);
        }
      },
      emit: (event, data) => {
        (listeners[event] || []).forEach(cb => cb(data));
      },
    };
  })();

  // ── Seed Data ──
  function _defaultUser() {
    return {
      id: 'user_001',
      name: 'Alex Morrison',
      email: 'alex@example.com',
      plan: 'Pro',
      avatar: null,
      joined: '2024-01-15',
      notifications: true,
    };
  }

  function _defaultNotifs() {
    return [
      { id: 1, read: false, type: 'order', title: 'Order Confirmed', message: 'Your order ORD-ABC123 has been confirmed.', date: new Date(Date.now() - 3600000).toISOString() },
      { id: 2, read: false, type: 'system', title: 'Welcome to Nexus!', message: 'Thanks for joining. Explore our premium products.', date: new Date(Date.now() - 86400000).toISOString() },
      { id: 3, read: true, type: 'promo', title: 'Special Offer', message: 'Get 20% off Pro plan this week only.', date: new Date(Date.now() - 172800000).toISOString() },
    ];
  }

  function _seedOrders() {
    const seed = [
      {
        id: 'ORD-7X9K2M',
        date: new Date(Date.now() - 7 * 86400000).toISOString(),
        status: 'completed',
        total: 149,
        items: [{ name: 'Enterprise Dashboard Kit', qty: 1, price: 149 }],
      },
      {
        id: 'ORD-3P8F4N',
        date: new Date(Date.now() - 14 * 86400000).toISOString(),
        status: 'completed',
        total: 79,
        items: [{ name: 'SaaS Landing Template', qty: 1, price: 79 }],
      },
      {
        id: 'ORD-5W2D9Q',
        date: new Date(Date.now() - 30 * 86400000).toISOString(),
        status: 'processing',
        total: 299,
        items: [{ name: 'Full-Stack Web App', qty: 1, price: 299 }],
      },
    ];
    set(KEYS.ORDERS, seed);
    return seed;
  }

  return { cart, wishlist, orders, recently, user, theme, notifs, events, get, set };
})();

/* ============================================
   PRODUCT DATA
   ============================================ */

const PRODUCTS = [
  {
    id: 'prod_001',
    name: 'Enterprise Dashboard Kit',
    slug: 'enterprise-dashboard-kit',
    category: 'Templates',
    price: 149,
    oldPrice: 199,
    rating: 4.9,
    reviews: 238,
    badge: 'bestseller',
    badgeLabel: 'Best Seller',
    desc: 'A complete enterprise-grade admin dashboard with 60+ components, analytics, and dark/light modes.',
    longDesc: 'The Enterprise Dashboard Kit is a comprehensive UI solution for SaaS and enterprise applications. Includes 60+ pre-built components, responsive layout, charts, tables, and full theme customization. Built with modern HTML, CSS, and vanilla JS.',
    features: ['60+ UI Components', 'Dark & Light Mode', 'Responsive Design', 'Chart Integration', 'Authentication UI', 'Lifetime Updates'],
    tags: ['dashboard', 'admin', 'template', 'ui-kit'],
    color: 'from-blue-800 to-blue-600',
    emoji: '📊',
  },
  {
    id: 'prod_002',
    name: 'SaaS Landing Page Pro',
    slug: 'saas-landing-page-pro',
    category: 'Templates',
    price: 79,
    oldPrice: 99,
    rating: 4.8,
    reviews: 194,
    badge: 'new',
    badgeLabel: 'New',
    desc: 'High-converting SaaS landing page with animations, pricing tables, and testimonials.',
    longDesc: 'Convert visitors into customers with this stunning SaaS landing page. Includes hero section, features, pricing, testimonials, FAQ, and CTA sections — all fully animated and production-ready.',
    features: ['10+ Sections', 'Animated Components', 'SEO Optimized', 'Fast Load', 'Contact Form', '1-Year Support'],
    tags: ['landing', 'saas', 'marketing'],
    color: 'from-cyan-800 to-blue-700',
    emoji: '🚀',
  },
  {
    id: 'prod_003',
    name: 'E-Commerce Store Template',
    slug: 'ecommerce-store-template',
    category: 'Templates',
    price: 119,
    oldPrice: 159,
    rating: 4.7,
    reviews: 156,
    badge: 'sale',
    badgeLabel: 'Sale',
    desc: 'Complete e-commerce storefront with product listings, cart, and checkout — no backend needed.',
    longDesc: 'Launch your online store instantly with this complete e-commerce frontend. Features product catalog, filters, cart drawer, checkout flow, and order tracking — all simulated client-side.',
    features: ['Product Catalog', 'Cart System', 'Checkout Flow', 'Filter & Search', 'Mobile Optimized', 'localStorage Integration'],
    tags: ['ecommerce', 'store', 'shop'],
    // color: 'from-teal-800 to-emerald-700',
    image: './images/ecommerce.png',
    // emoji: '<i class="fa-solid fa-cart-shopping"></i>',
  },
  {
    id: 'prod_004',
    name: 'DevPortfolio Theme',
    slug: 'devportfolio-theme',
    category: 'Templates',
    price: 49,
    oldPrice: null,
    rating: 4.9,
    reviews: 312,
    badge: 'hot',
    badgeLabel: 'Hot',
    desc: 'Minimal developer portfolio with project showcase, blog, and dark/light theme.',
    longDesc: 'Stand out from the crowd with this polished developer portfolio. Features animated hero, project grid, skills section, and blog — optimized for GitHub Pages and Netlify deployment.',
    features: ['Project Showcase', 'Blog Ready', 'Dark/Light Mode', 'GitHub Integration', 'Netlify Ready', '100/100 Lighthouse'],
    tags: ['portfolio', 'developer', 'minimal'],
    color: 'from-slate-800 to-slate-600',
    emoji: '👨‍💻',
  },
  {
    id: 'prod_005',
    name: 'Analytics Dashboard UI',
    slug: 'analytics-dashboard-ui',
    category: 'UI Kits',
    price: 89,
    oldPrice: 119,
    rating: 4.8,
    reviews: 87,
    badge: null,
    badgeLabel: null,
    desc: 'Data-rich analytics dashboard with 30+ chart types and real-time data simulation.',
    longDesc: 'Visualize data beautifully with this analytics dashboard. Includes line, bar, pie, area charts, KPI cards, and data tables — all with smooth animations and responsive design.',
    features: ['30+ Chart Types', 'KPI Cards', 'Data Tables', 'Real-Time Simulation', 'Export Features', 'PDF Reports'],
    tags: ['analytics', 'charts', 'data'],
    color: 'from-indigo-800 to-blue-700',
    emoji: '📈',
  },
  {
    id: 'prod_006',
    name: 'UI Component Library',
    slug: 'ui-component-library',
    category: 'UI Kits',
    price: 199,
    oldPrice: 249,
    rating: 4.9,
    reviews: 432,
    badge: 'bestseller',
    badgeLabel: 'Best Seller',
    desc: '200+ production-ready UI components with variants, states, and documentation.',
    longDesc: 'The most comprehensive UI component library for web projects. Includes buttons, forms, modals, drawers, toasts, cards, tables, navbars, and more — all fully documented and customizable.',
    features: ['200+ Components', 'Full Documentation', 'Figma Source Files', 'Copy-paste Ready', 'Accessibility', 'Regular Updates'],
    tags: ['components', 'library', 'ui-kit'],
    color: 'from-violet-800 to-blue-700',
    emoji: '🧩',
  },
  {
    id: 'prod_007',
    name: 'SaaS Startup Kit',
    slug: 'saas-startup-kit',
    category: 'Bundles',
    price: 299,
    oldPrice: 499,
    rating: 5.0,
    reviews: 64,
    badge: 'new',
    badgeLabel: 'New',
    desc: 'Everything you need to launch a SaaS product: landing, dashboard, docs, and blog.',
    longDesc: 'The ultimate SaaS starter kit. Includes landing page, dashboard, documentation site, blog, authentication pages, pricing, and admin panel — all production-ready and fully customizable.',
    features: ['Landing Page', 'Admin Dashboard', 'Documentation', 'Blog Template', 'Auth Pages', 'Stripe-Ready UI'],
    tags: ['saas', 'startup', 'bundle', 'all-in-one'],
    color: 'from-blue-900 to-navy-700',
    emoji: '🏢',
  },
  {
    id: 'prod_008',
    name: 'Mobile App UI Kit',
    slug: 'mobile-app-ui-kit',
    category: 'UI Kits',
    price: 69,
    oldPrice: null,
    rating: 4.6,
    reviews: 118,
    badge: null,
    badgeLabel: null,
    desc: 'Cross-platform mobile UI kit with iOS and Android design patterns.',
    longDesc: 'Design beautiful mobile apps with this comprehensive UI kit. Includes onboarding, home, profile, settings, and e-commerce screens — all following platform-specific design guidelines.',
    features: ['iOS & Android', 'Onboarding Screens', 'Profile UI', 'E-Commerce Screens', 'Settings Panel', 'Dark Mode'],
    tags: ['mobile', 'ios', 'android', 'ui-kit'],
    color: 'from-rose-900 to-pink-800',
    emoji: '📱',
  },
];

/* ============================================
   SERVICES DATA
   ============================================ */

const SERVICES = [
  {
    id: 'svc_001',
    name: 'Custom Web Development',
    slug: 'custom-web-development',
    category: 'Development',
    price: 1500,
    priceLabel: 'Starting at',
    timeline: '2–4 weeks',
    rating: 4.9,
    reviews: 87,
    desc: 'Full-stack custom web applications built with modern frameworks and best practices.',
    features: ['Requirements Analysis', 'UI/UX Design', 'Frontend Development', 'Backend API', 'Database Design', 'Testing & QA', 'Deployment', '30-day Support'],
    emoji: '⚙️',
    color: 'from-blue-800 to-navy-700',
    process: ['Discovery & Planning', 'Design Mockups', 'Development', 'Testing', 'Launch & Handoff'],
  },
  {
    id: 'svc_002',
    name: 'UI/UX Design System',
    slug: 'ui-ux-design-system',
    category: 'Design',
    price: 800,
    priceLabel: 'Starting at',
    timeline: '1–2 weeks',
    rating: 5.0,
    reviews: 54,
    desc: 'Comprehensive design systems with brand guidelines, component library, and Figma files.',
    features: ['Brand Identity', 'Color System', 'Typography Scale', 'Component Library', 'Figma Source Files', 'Style Guide', 'Icon Library', 'Dark Mode'],
    emoji: '🎨',
    color: 'from-teal-800 to-emerald-700',
    process: ['Brand Discovery', 'Concept Design', 'System Architecture', 'Component Build', 'Delivery'],
  },
  {
    id: 'svc_003',
    name: 'SaaS Platform Setup',
    slug: 'saas-platform-setup',
    category: 'Development',
    price: 3000,
    priceLabel: 'Starting at',
    timeline: '4–8 weeks',
    rating: 4.8,
    reviews: 32,
    desc: 'Complete SaaS MVP with auth, billing, dashboard, and infrastructure setup.',
    features: ['Auth System', 'Stripe Billing', 'User Dashboard', 'Admin Panel', 'Email System', 'Analytics', 'CI/CD Pipeline', 'Documentation'],
    emoji: '🏗️',
    color: 'from-indigo-800 to-blue-700',
    process: ['Architecture', 'Core Features', 'Integrations', 'Testing', 'Launch'],
  },
  {
    id: 'svc_004',
    name: 'Website Maintenance',
    slug: 'website-maintenance',
    category: 'Maintenance',
    price: 299,
    priceLabel: '/month',
    timeline: 'Ongoing',
    rating: 4.9,
    reviews: 143,
    desc: 'Monthly retainer for updates, security patches, performance monitoring, and support.',
    features: ['Security Updates', 'Performance Monitoring', 'Backup Management', 'Bug Fixes', 'Content Updates', 'Uptime Monitoring', 'Monthly Reports', 'Priority Support'],
    emoji: '🛡️',
    color: 'from-slate-800 to-gray-700',
    process: ['Onboarding', 'Audit', 'Ongoing Monitoring', 'Monthly Reviews'],
  },
  {
    id: 'svc_005',
    name: 'SEO & Performance',
    slug: 'seo-performance',
    category: 'Marketing',
    price: 600,
    priceLabel: 'Starting at',
    timeline: '2–3 weeks',
    rating: 4.7,
    reviews: 76,
    desc: 'Technical SEO audit, Core Web Vitals optimization, and performance improvements.',
    features: ['Technical SEO Audit', 'Core Web Vitals', 'Image Optimization', 'Code Splitting', 'CDN Setup', 'Schema Markup', 'Sitemap', 'Analytics Setup'],
    emoji: '🔍',
    color: 'from-amber-900 to-orange-800',
    process: ['Audit', 'Strategy', 'Implementation', 'Testing', 'Reporting'],
  },
  {
    id: 'svc_006',
    name: 'API Integration',
    slug: 'api-integration',
    category: 'Development',
    price: 500,
    priceLabel: 'Starting at',
    timeline: '1 week',
    rating: 4.8,
    reviews: 98,
    desc: 'Third-party API integration including payment, CRM, marketing, and communication tools.',
    features: ['API Assessment', 'Stripe/PayPal', 'Mailchimp/SendGrid', 'Slack/Discord', 'CRM Integration', 'Webhooks', 'Error Handling', 'Documentation'],
    emoji: '🔌',
    color: 'from-cyan-800 to-blue-700',
    process: ['API Review', 'Architecture', 'Implementation', 'Testing', 'Docs'],
  },
];

// Initialize theme on load
(function initTheme() {
  const saved = NexusStorage.theme.get();
  document.documentElement.setAttribute('data-theme', saved || 'dark');
})();
