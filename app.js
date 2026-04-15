/* ============================================
   NexTspace PLATFORM — APP CONTROLLER
   Navbar, Toast, Cart Drawer, Theme, Search
   ============================================ */

const NexusApp = (() => {

  /* ══════════════════════════════════════════
     TOAST NOTIFICATION SYSTEM
  ══════════════════════════════════════════ */
  const Toast = (() => {
    let container;

    const getContainer = () => {
      if (!container) {
        container = document.getElementById('toast-container');
        if (!container) {
          container = document.createElement('div');
          container.id = 'toast-container';
          container.className = 'toast-container';
          document.body.appendChild(container);
        }
      }
      return container;
    };

    const ICONS = {
      success: '✓',
      error:   '✕',
      warning: '⚠',
      info:    'ℹ',
    };

    const show = ({ type = 'info', title, message, duration = 4000 }) => {
      const c = getContainer();
      const el = document.createElement('div');
      el.className = `toast ${type} toast-enter`;
      el.innerHTML = `
        <div class="toast-icon">${ICONS[type] || ICONS.info}</div>
        <div class="toast-body">
          <div class="toast-title">${title}</div>
          ${message ? `<div class="toast-msg">${message}</div>` : ''}
        </div>
        <button class="toast-close" aria-label="Close">✕</button>
      `;

      const close = () => {
        el.classList.remove('toast-enter');
        el.classList.add('toast-exit');
        setTimeout(() => el.remove(), 350);
      };

      el.querySelector('.toast-close').addEventListener('click', close);
      c.appendChild(el);

      if (duration > 0) {
        setTimeout(close, duration);
      }

      return { close };
    };

    return {
      success: (title, message, duration) => show({ type: 'success', title, message, duration }),
      error:   (title, message, duration) => show({ type: 'error',   title, message, duration }),
      warning: (title, message, duration) => show({ type: 'warning', title, message, duration }),
      info:    (title, message, duration) => show({ type: 'info',    title, message, duration }),
      show,
    };
  })();

  /* ══════════════════════════════════════════
     CART DRAWER
  ══════════════════════════════════════════ */
  const CartDrawer = (() => {
    let drawer, overlay, cartBody;

    const open = () => {
      drawer?.classList.add('open');
      overlay?.classList.add('open');
      document.body.style.overflow = 'hidden';
      render();
    };

    const close = () => {
      drawer?.classList.remove('open');
      overlay?.classList.remove('open');
      document.body.style.overflow = '';
    };

    const toggle = () => {
      if (drawer?.classList.contains('open')) close();
      else open();
    };

    const render = () => {
      if (!cartBody) return;
      const items = NexusStorage.cart.get();

      if (!items.length) {
        cartBody.innerHTML = `
          <div class="cart-empty">
            <div class="cart-empty-icon"><i class="fa-solid fa-cart-shopping"></i></div>
            <h4 style="font-family:var(--font-heading);font-size:var(--text-lg);color:var(--text-primary);">Your cart is empty</h4>
            <p style="font-size:var(--text-sm);">Browse our products and add some to your cart.</p>
            <a href="products.html" class="btn btn-primary btn-sm" onclick="NexusApp.CartDrawer.close()">Explore Products</a>
          </div>
        `;
        updateFooter(0);
        return;
      }

      cartBody.innerHTML = items.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-image">
            <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;background:linear-gradient(135deg,var(--navy-800),var(--navy-700));">
              ${item.emoji || '📦'}
            </div>
          </div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-category">${item.category}</div>
            <div class="cart-item-actions">
              <div class="qty-control">
                <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
                <span class="qty-value">${item.qty}</span>
                <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
              </div>
              <span class="cart-item-price">$${(item.price * item.qty).toFixed(0)}</span>
            </div>
          </div>
          <button class="cart-item-remove" data-remove="${item.id}" title="Remove">✕</button>
        </div>
      `).join('');

      updateFooter(NexusStorage.cart.total());
    };

    const updateFooter = (total) => {
      const footer = document.getElementById('cart-footer');
      if (!footer) return;
      footer.innerHTML = `
        <div class="cart-summary-row"><span>Subtotal</span><span>$${total.toFixed(2)}</span></div>
        <div class="cart-summary-row"><span>Processing Fee</span><span>$0.00</span></div>
        <div class="cart-summary-row" style="border-top:1px solid var(--border-color);padding-top:var(--space-3);margin-top:var(--space-2);">
          <span style="font-weight:700;color:var(--text-primary);">Total</span>
          <span class="cart-summary-total">$${total.toFixed(2)}</span>
        </div>
        <a href="checkout.html" class="btn btn-primary btn-ripple" style="width:100%;margin-top:var(--space-4);justify-content:center;" onclick="NexusApp.CartDrawer.close()">
          Proceed to Checkout →
        </a>
        <a href="cart.html" class="btn btn-secondary" style="width:100%;margin-top:var(--space-2);justify-content:center;" onclick="NexusApp.CartDrawer.close()">
          View Cart
        </a>
      `;
    };

    const init = () => {
      drawer  = document.getElementById('cart-drawer');
      overlay = document.getElementById('cart-overlay');
      cartBody = document.getElementById('cart-drawer-body');

      if (!drawer) return;

      // Toggle buttons
      document.querySelectorAll('[data-cart-toggle]').forEach(btn => {
        btn.addEventListener('click', toggle);
      });

      // Close button
      document.querySelectorAll('[data-cart-close]').forEach(btn => {
        btn.addEventListener('click', close);
      });

      // Overlay click
      overlay?.addEventListener('click', close);

      // ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
      });

      // Cart actions (qty, remove)
      cartBody?.addEventListener('click', (e) => {
        const qtyBtn = e.target.closest('[data-action]');
        const removeBtn = e.target.closest('[data-remove]');

        if (qtyBtn) {
          const id = qtyBtn.dataset.id;
          const action = qtyBtn.dataset.action;
          const item = NexusStorage.cart.get().find(i => i.id === id);
          if (!item) return;
          const newQty = action === 'inc' ? item.qty + 1 : item.qty - 1;
          NexusStorage.cart.updateQty(id, newQty);
          render();
          updateCartCount();
        }

        if (removeBtn) {
          NexusStorage.cart.remove(removeBtn.dataset.remove);
          render();
          updateCartCount();
          Toast.info('Item removed', 'Item removed from cart.');
        }
      });

      // Listen for cart updates
      NexusStorage.events.on('cartUpdated', () => {
        updateCartCount();
        if (drawer.classList.contains('open')) render();
      });

      updateCartCount();
    };

    return { init, open, close, toggle, render };
  })();

  /* ══════════════════════════════════════════
     NAVBAR
  ══════════════════════════════════════════ */
  const Navbar = (() => {
    const init = () => {
      // Mobile menu
      const menuToggle = document.getElementById('menu-toggle');
      const mobileMenu = document.getElementById('mobile-menu');

      menuToggle?.addEventListener('click', () => {
        menuToggle.classList.toggle('open');
        mobileMenu?.classList.toggle('open');
      });

      // Close on link click
      mobileMenu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          menuToggle?.classList.remove('open');
          mobileMenu?.classList.remove('open');
        });
      });

      // Set active link
      const currentPath = window.location.pathname;
      document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        if (link.href && link.href.includes(currentPath) && currentPath !== '/') {
          link.classList.add('active');
        }
        if (currentPath === '/' || currentPath.endsWith('index.html')) {
          document.querySelectorAll('.nav-link[href*="index"], .nav-link[href="/"]')
            .forEach(l => l.classList.add('active'));
        }
      });
    };

    return { init };
  })();

  /* ══════════════════════════════════════════
     THEME TOGGLE
  ══════════════════════════════════════════ */
  const ThemeToggle = (() => {
    const ICONS = { dark: '☀', light: '◐', system: '⊙' };

    const init = () => {
      document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
        btn.addEventListener('click', () => {
          const next = NexusStorage.theme.toggle();
          updateIcons(next);
          Toast.info(
            `${next === 'dark' ? 'Dark' : 'Light'} Mode`,
            `Theme switched to ${next} mode.`,
            2000
          );
        });
      });

      // Update icon on init
      updateIcons(NexusStorage.theme.get());
    };

    const updateIcons = (theme) => {
      document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
        btn.textContent = theme === 'dark' ? '☀' : '◐';
        btn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
      });
    };

    return { init };
  })();

  /* ══════════════════════════════════════════
     SEARCH
  ══════════════════════════════════════════ */
  const Search = (() => {
    const init = () => {
      const searchInput = document.getElementById('global-search');
      if (!searchInput) return;

      let debounce;
      searchInput.addEventListener('input', () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          const query = searchInput.value.trim().toLowerCase();
          if (query.length < 2) return;
          // Redirect to products with search query
          window.location.href = `products.html?search=${encodeURIComponent(query)}`;
        }, 600);
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const query = searchInput.value.trim();
          if (query) {
            window.location.href = `products.html?search=${encodeURIComponent(query)}`;
          }
        }
      });
    };

    return { init };
  })();

  /* ══════════════════════════════════════════
     USER STATE & NOTIFICATIONS
  ══════════════════════════════════════════ */
  const updateCartCount = () => {
    const count = NexusStorage.cart.count();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
      el.classList.toggle('hidden', count === 0);
      if (count > 0) el.classList.add('badge-bounce');
      setTimeout(() => el.classList.remove('badge-bounce'), 500);
    });
  };

  const updateUserUI = () => {
    const user = NexusStorage.user.get();
    document.querySelectorAll('[data-user-name]').forEach(el => {
      el.textContent = user.name;
    });
    document.querySelectorAll('[data-user-email]').forEach(el => {
      el.textContent = user.email;
    });
    document.querySelectorAll('[data-user-plan]').forEach(el => {
      el.textContent = user.plan;
    });
    document.querySelectorAll('[data-user-avatar]').forEach(el => {
      el.textContent = user.name.charAt(0).toUpperCase();
    });
  };

  /* ══════════════════════════════════════════
     MODAL SYSTEM
  ══════════════════════════════════════════ */
  const Modal = (() => {
    const open = (id) => {
      const overlay = document.getElementById(id);
      if (!overlay) return;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const close = (id) => {
      const overlay = id
        ? document.getElementById(id)
        : document.querySelector('.modal-overlay.open');
      if (!overlay) return;
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    const init = () => {
      // Open triggers
      document.querySelectorAll('[data-modal-open]').forEach(btn => {
        btn.addEventListener('click', () => open(btn.dataset.modalOpen));
      });

      // Close triggers
      document.querySelectorAll('[data-modal-close]').forEach(btn => {
        btn.addEventListener('click', () => close(btn.dataset.modalClose));
      });

      // Overlay click to close
      document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) close(overlay.id);
        });
      });

      // ESC
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
      });
    };

    return { open, close, init };
  })();

  /* ══════════════════════════════════════════
     FORM VALIDATION
  ══════════════════════════════════════════ */
  const FormValidator = (() => {
    const rules = {
      required: (val) => val.trim().length > 0,
      email:    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      minLen:   (val, n) => val.length >= n,
      phone:    (val) => /^[\d\s\-+()]{7,}$/.test(val),
    };

    const validate = (form) => {
      let valid = true;
      form.querySelectorAll('[data-validate]').forEach(field => {
        const group = field.closest('.form-group');
        const validations = field.dataset.validate.split(',').map(v => v.trim());
        let fieldValid = true;

        for (const rule of validations) {
          const [name, param] = rule.split(':');
          if (!rules[name]?.(field.value, param)) {
            fieldValid = false;
            break;
          }
        }

        group?.classList.toggle('invalid', !fieldValid);
        if (!fieldValid) valid = false;
      });

      return valid;
    };

    const initLive = (form) => {
      form.querySelectorAll('[data-validate]').forEach(field => {
        ['input', 'blur'].forEach(evt => {
          field.addEventListener(evt, () => {
            const group = field.closest('.form-group');
            const validations = field.dataset.validate.split(',').map(v => v.trim());
            let fieldValid = true;

            for (const rule of validations) {
              const [name, param] = rule.split(':');
              if (!rules[name]?.(field.value, param)) {
                fieldValid = false;
                break;
              }
            }

            if (field.value.length > 0) {
              group?.classList.toggle('invalid', !fieldValid);
            } else {
              group?.classList.remove('invalid');
            }
          });
        });
      });
    };

    return { validate, initLive };
  })();

  /* ══════════════════════════════════════════
     MAIN INIT
  ══════════════════════════════════════════ */
  const init = () => {
    Navbar.init();
    CartDrawer.init();
    ThemeToggle.init();
    Search.init();
    Modal.init();
    updateCartCount();
    updateUserUI();

    // Init form validators
    document.querySelectorAll('form[data-form]').forEach(form => {
      FormValidator.initLive(form);
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (FormValidator.validate(form)) {
          const onSubmit = form.dataset.form;
          NexusApp.FormHandlers[onSubmit]?.(form);
        }
      });
    });

    console.log('%c⬛ NEXUS Platform', 'color:#3B82F6;font-size:14px;font-weight:700;');
    console.log('%cBuilt with precision. Powered by Nexus.', 'color:#6B7280;font-size:11px;');
  };

  /* ── Form Handlers ── */
  const FormHandlers = {
    contact: (form) => {
      Toast.success('Message Sent!', 'We\'ll get back to you within 24 hours.');
      form.reset();
    },
    newsletter: (form) => {
      Toast.success('Subscribed!', 'Welcome to the Nexus community.');
      form.reset();
    },
    checkout: (form) => {
      const cartItems = NexusStorage.cart.get();
      if (!cartItems.length) {
        Toast.warning('Cart Empty', 'Add products to cart before checkout.');
        return;
      }
      const order = NexusStorage.orders.add({
        items: cartItems,
        total: NexusStorage.cart.total(),
      });
      NexusStorage.cart.clear();
      Toast.success('Order Placed!', `Order ${order.id} confirmed. Redirecting…`);
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 2000);
    },
    service: (form) => {
      Toast.success('Request Sent!', 'We\'ll contact you within 1 business day.');
      form.reset();
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    Toast,
    CartDrawer,
    Modal,
    FormValidator,
    FormHandlers,
    updateCartCount,
  };
})();

/* ============================================
   NexTSpace PLATFORM — STORAGE & DATA LAYER
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

/* ============================================
   NexTspace PLATFORM — ANIMATION ENGINE
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
