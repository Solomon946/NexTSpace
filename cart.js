/* ============================================
   NEXUS PLATFORM — CART & CHECKOUT ENGINE
   Full Cart Page + Checkout Flow
   ============================================ */

const NexusCart = (() => {

  /* ── Full Cart Page ── */
  const initCartPage = () => {
    const cartRoot = document.getElementById('cart-page-root');
    if (!cartRoot) return;

    const render = () => {
      const items = NexusStorage.cart.get();
      const total = NexusStorage.cart.total();

      if (!items.length) {
        cartRoot.innerHTML = `
          <div style="text-align:center;padding:var(--space-20);">
            <div style="font-size:4rem;margin-bottom:var(--space-6);">🛒</div>
            <h2 style="font-family:var(--font-heading);font-size:var(--text-3xl);margin-bottom:var(--space-4);">Your cart is empty</h2>
            <p style="color:var(--text-secondary);margin-bottom:var(--space-8);">Discover our premium digital products and services.</p>
            <a href="products.html" class="btn btn-primary btn-lg btn-ripple">Browse Products</a>
          </div>
        `;
        return;
      }

      cartRoot.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 360px;gap:var(--space-10);align-items:start;">
          <!-- Cart Items -->
          <div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-6);">
              <h2 style="font-family:var(--font-heading);font-size:var(--text-2xl);font-weight:800;">Shopping Cart <span style="color:var(--text-muted);font-size:var(--text-lg);">(${items.length} items)</span></h2>
              <button class="btn btn-ghost btn-sm" id="clear-cart-btn">Clear All</button>
            </div>
            <div id="cart-items-list">
              ${items.map(item => `
                <div class="card" style="padding:var(--space-5);display:flex;align-items:center;gap:var(--space-5);margin-bottom:var(--space-4);transition:all var(--transition-base);" data-cart-row="${item.id}">
                  <div style="width:80px;height:80px;border-radius:var(--radius-xl);background:linear-gradient(135deg,var(--navy-800),var(--navy-700));display:flex;align-items:center;justify-content:center;font-size:2rem;flex-shrink:0;">
                    ${item.emoji || '📦'}
                  </div>
                  <div style="flex:1;min-width:0;">
                    <div style="font-weight:700;font-size:var(--text-base);margin-bottom:var(--space-1);">${item.name}</div>
                    <div style="font-size:var(--text-xs);color:var(--text-muted);margin-bottom:var(--space-3);">${item.category}</div>
                    <div style="display:flex;align-items:center;gap:var(--space-4);">
                      <div class="qty-control">
                        <button class="qty-btn" data-cart-dec="${item.id}">−</button>
                        <span class="qty-value">${item.qty}</span>
                        <button class="qty-btn" data-cart-inc="${item.id}">+</button>
                      </div>
                      <span style="font-size:var(--text-xs);color:var(--text-muted);">$${item.price} each</span>
                    </div>
                  </div>
                  <div style="text-align:right;flex-shrink:0;">
                    <div style="font-family:var(--font-heading);font-size:var(--text-xl);font-weight:800;margin-bottom:var(--space-2);">$${(item.price*item.qty).toFixed(0)}</div>
                    <button class="btn btn-ghost btn-sm" data-cart-remove="${item.id}" style="color:var(--error);font-size:var(--text-xs);">✕ Remove</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Order Summary -->
          <div style="position:sticky;top:calc(68px + var(--space-6));">
            <div class="card">
              <div class="card-body">
                <h3 style="font-family:var(--font-heading);font-size:var(--text-lg);font-weight:700;margin-bottom:var(--space-6);">Order Summary</h3>
                ${items.map(i => `
                  <div style="display:flex;justify-content:space-between;font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-3);">
                    <span>${i.name} × ${i.qty}</span>
                    <span>$${(i.price*i.qty).toFixed(0)}</span>
                  </div>
                `).join('')}
                <div style="border-top:1px solid var(--border-color);margin:var(--space-4) 0;padding-top:var(--space-4);">
                  <div style="display:flex;justify-content:space-between;font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-2);">
                    <span>Subtotal</span><span>$${total.toFixed(2)}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-2);">
                    <span>Discount</span><span style="color:var(--success);">-$0.00</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;font-family:var(--font-heading);font-size:var(--text-xl);font-weight:900;margin-top:var(--space-4);padding-top:var(--space-4);border-top:1px solid var(--border-color);">
                    <span>Total</span><span>$${total.toFixed(2)}</span>
                  </div>
                </div>

                <!-- Promo Code -->
                <div style="display:flex;gap:var(--space-2);margin-bottom:var(--space-4);">
                  <input type="text" class="form-input" id="promo-input" placeholder="Promo code" style="flex:1;">
                  <button class="btn btn-secondary btn-sm" id="apply-promo-btn">Apply</button>
                </div>

                <a href="checkout.html" class="btn btn-primary btn-lg btn-ripple" style="width:100%;justify-content:center;margin-bottom:var(--space-3);">
                  Checkout → $${total.toFixed(2)}
                </a>
                <a href="products.html" class="btn btn-ghost" style="width:100%;justify-content:center;font-size:var(--text-sm);">
                  ← Continue Shopping
                </a>

                <div style="display:flex;justify-content:center;gap:var(--space-4);margin-top:var(--space-4);">
                  ${['🔒 Secure','⚡ Instant','♾ Lifetime'].map(t=>`<span style="font-size:var(--text-xs);color:var(--text-muted);">${t}</span>`).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Event listeners
      document.getElementById('clear-cart-btn')?.addEventListener('click', () => {
        if (confirm('Clear all items from cart?')) {
          NexusStorage.cart.clear();
          render();
          NexusApp.updateCartCount();
          NexusApp.Toast.info('Cart Cleared', 'All items removed.');
        }
      });

      document.querySelectorAll('[data-cart-remove]').forEach(btn => {
        btn.addEventListener('click', () => {
          NexusStorage.cart.remove(btn.dataset.cartRemove);
          render();
          NexusApp.updateCartCount();
          NexusApp.Toast.info('Removed', 'Item removed from cart.');
        });
      });

      document.querySelectorAll('[data-cart-dec]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.cartDec;
          const item = NexusStorage.cart.get().find(i => i.id === id);
          if (item) NexusStorage.cart.updateQty(id, item.qty - 1);
          render();
          NexusApp.updateCartCount();
        });
      });

      document.querySelectorAll('[data-cart-inc]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.cartInc;
          const item = NexusStorage.cart.get().find(i => i.id === id);
          if (item) NexusStorage.cart.updateQty(id, item.qty + 1);
          render();
          NexusApp.updateCartCount();
        });
      });

      document.getElementById('apply-promo-btn')?.addEventListener('click', () => {
        const code = document.getElementById('promo-input')?.value.trim().toUpperCase();
        if (code === 'NEXUS20') {
          NexusApp.Toast.success('Promo Applied!', '20% discount activated.');
        } else if (code) {
          NexusApp.Toast.error('Invalid Code', 'That promo code is not valid.');
        }
      });
    };

    render();
  };

  /* ── Checkout Page ── */
  const initCheckoutPage = () => {
    const root = document.getElementById('checkout-root');
    if (!root) return;

    const items = NexusStorage.cart.get();
    const total = NexusStorage.cart.total();

    if (!items.length) {
      root.innerHTML = `
        <div style="text-align:center;padding:var(--space-20);">
          <div style="font-size:3rem;margin-bottom:var(--space-4);">🛒</div>
          <h2 style="margin-bottom:var(--space-4);">Nothing to checkout</h2>
          <a href="products.html" class="btn btn-primary">Browse Products</a>
        </div>
      `;
      return;
    }

    root.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 380px;gap:var(--space-10);align-items:start;">
        <!-- Form -->
        <div>
          <h2 style="font-family:var(--font-heading);font-size:var(--text-2xl);font-weight:800;margin-bottom:var(--space-8);">Checkout</h2>

          <form data-form="checkout" id="checkout-form">
            <!-- Contact -->
            <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-xl);padding:var(--space-6);margin-bottom:var(--space-5);">
              <h3 style="font-family:var(--font-heading);font-size:var(--text-lg);font-weight:700;margin-bottom:var(--space-5);">📧 Contact Information</h3>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);">
                <div class="form-group">
                  <label class="form-label">First Name</label>
                  <input type="text" class="form-input" data-validate="required" placeholder="Alex" value="Alex">
                  <span class="form-error">First name is required</span>
                </div>
                <div class="form-group">
                  <label class="form-label">Last Name</label>
                  <input type="text" class="form-input" data-validate="required" placeholder="Morrison" value="Morrison">
                  <span class="form-error">Last name is required</span>
                </div>
              </div>
              <div class="form-group" style="margin-top:var(--space-4);">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-input" data-validate="required,email" placeholder="alex@example.com" value="alex@example.com">
                <span class="form-error">A valid email is required</span>
              </div>
            </div>

            <!-- Payment -->
            <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-xl);padding:var(--space-6);margin-bottom:var(--space-5);">
              <h3 style="font-family:var(--font-heading);font-size:var(--text-lg);font-weight:700;margin-bottom:var(--space-5);">💳 Payment Details</h3>
              <div class="form-group" style="margin-bottom:var(--space-4);">
                <label class="form-label">Card Number</label>
                <input type="text" class="form-input" data-validate="required" placeholder="4242 4242 4242 4242" maxlength="19" id="card-number">
                <span class="form-error">Card number is required</span>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-4);">
                <div class="form-group">
                  <label class="form-label">Expiry MM</label>
                  <input type="text" class="form-input" data-validate="required" placeholder="12" maxlength="2">
                  <span class="form-error">Required</span>
                </div>
                <div class="form-group">
                  <label class="form-label">Expiry YY</label>
                  <input type="text" class="form-input" data-validate="required" placeholder="28" maxlength="2">
                  <span class="form-error">Required</span>
                </div>
                <div class="form-group">
                  <label class="form-label">CVV</label>
                  <input type="text" class="form-input" data-validate="required" placeholder="123" maxlength="3">
                  <span class="form-error">Required</span>
                </div>
              </div>
            </div>

            <!-- Terms -->
            <div style="display:flex;align-items:flex-start;gap:var(--space-3);margin-bottom:var(--space-6);">
              <input type="checkbox" id="terms-check" required style="margin-top:3px;accent-color:var(--navy-500);">
              <label for="terms-check" style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.5;cursor:pointer;">
                I agree to the <a href="#" style="color:var(--text-brand);">Terms of Service</a> and <a href="#" style="color:var(--text-brand);">Privacy Policy</a>. Digital products are non-refundable after download.
              </label>
            </div>

            <button type="submit" class="btn btn-primary btn-lg btn-ripple" style="width:100%;justify-content:center;">
              🔒 Complete Purchase — $${total.toFixed(2)}
            </button>
          </form>
        </div>

        <!-- Order Summary -->
        <div style="position:sticky;top:calc(68px + var(--space-6));">
          <div class="card">
            <div class="card-body">
              <h3 style="font-family:var(--font-heading);font-size:var(--text-base);font-weight:700;margin-bottom:var(--space-5);">Order Summary</h3>
              ${items.map(i => `
                <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-4);">
                  <div style="width:40px;height:40px;background:linear-gradient(135deg,var(--navy-800),var(--navy-700));border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;">${i.emoji}</div>
                  <div style="flex:1;min-width:0;">
                    <div style="font-size:var(--text-sm);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${i.name}</div>
                    <div style="font-size:var(--text-xs);color:var(--text-muted);">Qty: ${i.qty}</div>
                  </div>
                  <span style="font-weight:700;font-size:var(--text-sm);">$${(i.price*i.qty).toFixed(0)}</span>
                </div>
              `).join('')}
              <div style="border-top:1px solid var(--border-color);padding-top:var(--space-4);margin-top:var(--space-2);">
                <div style="display:flex;justify-content:space-between;font-family:var(--font-heading);font-size:var(--text-xl);font-weight:900;">
                  <span>Total</span><span>$${total.toFixed(2)}</span>
                </div>
              </div>
              <div style="margin-top:var(--space-5);padding:var(--space-4);background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.15);border-radius:var(--radius-lg);">
                ${['🔒 256-bit SSL encryption','⚡ Instant download after payment','💬 12-month priority support'].map(t=>`<div style="font-size:var(--text-xs);color:var(--text-secondary);padding:var(--space-1) 0;">${t}</div>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Card number formatting
    document.getElementById('card-number')?.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      e.target.value = val.replace(/(.{4})/g, '$1 ').trim();
    });

    NexusApp.FormValidator.initLive(document.getElementById('checkout-form'));
    document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const termsCheck = document.getElementById('terms-check');
      if (!termsCheck?.checked) {
        NexusApp.Toast.warning('Terms Required', 'Please accept the terms to continue.');
        return;
      }
      if (NexusApp.FormValidator.validate(document.getElementById('checkout-form'))) {
        NexusApp.FormHandlers.checkout(document.getElementById('checkout-form'));
      }
    });
  };

  /* ── Auto-init ── */
  const autoInit = () => {
    const path = window.location.pathname;
    if (path.includes('cart.html')) initCartPage();
    if (path.includes('checkout.html')) initCheckoutPage();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  return { initCartPage, initCheckoutPage };
})();
