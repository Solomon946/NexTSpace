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
