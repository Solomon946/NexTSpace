/* ============================================
   NEXUS PLATFORM — PRODUCTS ENGINE
   Listing, Filtering, Sorting, Detail
   ============================================ */

const NexusProducts = (() => {

  /* ── Render single product card ── */
  const renderCard = (product) => {
    const isWishlisted = NexusStorage.wishlist.has(product.id);
    const badgeColor = {
      bestseller: 'style="background:#1E4D8C;"',
      new:        'style="background:#059669;"',
      sale:       'style="background:#DC2626;"',
      hot:        'style="background:#D97706;"',
    }[product.badge] || '';

    return `
      <div class="product-card card-hover reveal-scale" data-product-id="${product.id}">
        <div class="product-card-image">
          <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:4rem;background:linear-gradient(135deg,var(--navy-800) 0%,var(--navy-700) 100%);">
            ${product.emoji}
          </div>
          ${product.badge ? `<div class="product-card-badge" ${badgeColor}>${product.badgeLabel}</div>` : ''}
          <button class="wishlist-btn ${isWishlisted ? 'active' : ''}"
            data-wishlist="${product.id}"
            title="${isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}"
          >${isWishlisted ? '♥' : '♡'}</button>
        </div>
        <div class="product-card-body">
          <div class="product-category">${product.category}</div>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-desc">${product.desc}</p>
          <div class="product-meta">
            <div>
              <span class="product-price">$${product.price}</span>
              ${product.oldPrice ? `<span class="product-price-old">$${product.oldPrice}</span>` : ''}
            </div>
            <div class="product-rating">
              <span class="stars">${'★'.repeat(Math.round(product.rating))}</span>
              <span>${product.rating} (${product.reviews})</span>
            </div>
          </div>
        </div>
        <div class="product-card-footer">
          <button class="btn btn-secondary btn-sm" onclick="NexusProducts.viewDetail('${product.id}')">
            Details
          </button>
          <button class="btn btn-primary btn-sm btn-ripple" onclick="NexusProducts.addToCart('${product.id}')">
            🛒 Add to Cart
          </button>
        </div>
      </div>
    `;
  };

  /* ── Render product grid ── */
  const renderGrid = (products, container) => {
    if (!container) return;
    if (!products.length) {
      container.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:var(--space-20);color:var(--text-muted);">
          <div style="font-size:3rem;margin-bottom:var(--space-4);">🔍</div>
          <h3 style="font-family:var(--font-heading);color:var(--text-secondary);margin-bottom:var(--space-2);">No products found</h3>
          <p>Try adjusting your filters or search query.</p>
        </div>
      `;
      return;
    }
    container.innerHTML = products.map(renderCard).join('');
    NexusAnimations.initScrollReveal();

    // Re-init stagger
    const cards = container.querySelectorAll('.product-card');
    cards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 80}ms`;
    });
  };

  /* ── Filter & Sort Engine ── */
  const filterAndSort = ({ products, category, sort, search }) => {
    let result = [...products];

    if (category && category !== 'all') {
      result = result.filter(p => p.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags?.some(t => t.includes(q))
      );
    }

    switch (sort) {
      case 'price-asc':  result.sort((a,b) => a.price - b.price); break;
      case 'price-desc': result.sort((a,b) => b.price - a.price); break;
      case 'rating':     result.sort((a,b) => b.rating - a.rating); break;
      case 'newest':     result.sort((a,b) => b.id.localeCompare(a.id)); break;
      default: break;
    }

    return result;
  };

  /* ── Products Page Init ── */
  const initProductsPage = () => {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    const urlParams = new URLSearchParams(window.location.search);
    let state = {
      category: urlParams.get('category') || 'all',
      sort:     urlParams.get('sort') || 'featured',
      search:   urlParams.get('search') || '',
    };

    // Search input
    const searchInput = document.getElementById('product-search');
    if (searchInput && state.search) searchInput.value = state.search;

    const updateGrid = () => {
      const result = filterAndSort({ products: PRODUCTS, ...state });
      const countEl = document.getElementById('product-count');
      if (countEl) countEl.textContent = `${result.length} products`;
      renderGrid(result, grid);
      updateActiveFilters();
      initWishlistButtons();
    };

    const updateActiveFilters = () => {
      document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.category === state.category);
      });
      const sortEl = document.getElementById('sort-select');
      if (sortEl) sortEl.value = state.sort;
    };

    // Filter chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        state.category = chip.dataset.category;
        updateGrid();
      });
    });

    // Sort
    document.getElementById('sort-select')?.addEventListener('change', (e) => {
      state.sort = e.target.value;
      updateGrid();
    });

    // Search
    let searchDebounce;
    searchInput?.addEventListener('input', (e) => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        state.search = e.target.value.trim();
        updateGrid();
      }, 350);
    });

    // Initial render
    updateGrid();
  };

  /* ── Product Detail Page Init ── */
  const initDetailPage = () => {
    const detailRoot = document.getElementById('product-detail');
    if (!detailRoot) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = PRODUCTS.find(p => p.id === productId);

    if (!product) {
      detailRoot.innerHTML = `
        <div style="text-align:center;padding:var(--space-20);">
          <div style="font-size:3rem;margin-bottom:var(--space-4);">😕</div>
          <h2>Product not found</h2>
          <a href="products.html" class="btn btn-primary" style="margin-top:var(--space-6);">Browse Products</a>
        </div>
      `;
      return;
    }

    NexusStorage.recently.add(product);

    // Render detail page
    const isWishlisted = NexusStorage.wishlist.has(product.id);

    detailRoot.innerHTML = `
      <div class="container">
        <div class="breadcrumb" style="margin-bottom:var(--space-6);">
          <a href="/">Home</a>
          <span class="breadcrumb-sep">›</span>
          <a href="products.html">Products</a>
          <span class="breadcrumb-sep">›</span>
          <span class="breadcrumb-current">${product.name}</span>
        </div>

        <div style="display:grid;grid-template-columns:1fr 420px;gap:var(--space-12);align-items:start;">
          <!-- Left: Image & Info -->
          <div>
            <div class="reveal-left" style="background:linear-gradient(135deg,var(--navy-800) 0%,var(--navy-700) 100%);border-radius:var(--radius-2xl);height:400px;display:flex;align-items:center;justify-content:center;font-size:8rem;margin-bottom:var(--space-8);border:1px solid var(--border-color);">
              ${product.emoji}
            </div>

            <div class="reveal">
              <h1 style="font-size:var(--text-3xl);font-weight:900;margin-bottom:var(--space-4);letter-spacing:-0.02em;">${product.name}</h1>
              <div style="display:flex;align-items:center;gap:var(--space-4);margin-bottom:var(--space-5);">
                <span class="stars" style="font-size:1rem;">★★★★★</span>
                <span style="font-size:var(--text-sm);color:var(--text-tertiary);">${product.rating} (${product.reviews} reviews)</span>
                <span class="badge badge-blue">${product.category}</span>
              </div>
              <p style="font-size:var(--text-base);color:var(--text-secondary);line-height:1.8;margin-bottom:var(--space-8);">${product.longDesc}</p>

              <h3 style="font-family:var(--font-heading);font-size:var(--text-lg);font-weight:700;margin-bottom:var(--space-4);">What's Included</h3>
              <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:var(--space-3);">
                ${product.features.map(f => `
                  <div style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-3) var(--space-4);background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);">
                    <span style="width:20px;height:20px;background:rgba(16,185,129,0.12);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--success);flex-shrink:0;">✓</span>
                    <span style="font-size:var(--text-sm);font-weight:500;">${f}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Right: Purchase Card -->
          <div>
            <div class="card card-glass reveal-right" style="position:sticky;top:calc(68px + var(--space-6));">
              <div class="card-body">
                <div style="margin-bottom:var(--space-5);">
                  <div style="display:flex;align-items:baseline;gap:var(--space-3);margin-bottom:var(--space-2);">
                    <span style="font-family:var(--font-heading);font-size:2.5rem;font-weight:900;">$${product.price}</span>
                    ${product.oldPrice ? `<span style="font-size:var(--text-lg);color:var(--text-muted);text-decoration:line-through;">$${product.oldPrice}</span>` : ''}
                    ${product.oldPrice ? `<span class="badge badge-red">-${Math.round((1-product.price/product.oldPrice)*100)}%</span>` : ''}
                  </div>
                  <p style="font-size:var(--text-xs);color:var(--text-muted);">One-time payment. Lifetime access.</p>
                </div>

                <button class="btn btn-primary btn-lg btn-ripple" style="width:100%;margin-bottom:var(--space-3);justify-content:center;" onclick="NexusProducts.addToCart('${product.id}')">
                  🛒 Add to Cart
                </button>
                <button class="btn btn-secondary" style="width:100%;margin-bottom:var(--space-3);justify-content:center;" id="detail-wishlist-btn" onclick="NexusProducts.toggleWishlist('${product.id}', this)">
                  ${isWishlisted ? '♥ Remove from Wishlist' : '♡ Add to Wishlist'}
                </button>

                <div style="padding:var(--space-4);background:var(--bg-secondary);border-radius:var(--radius-lg);margin-top:var(--space-4);">
                  ${[
                    ['⚡', 'Instant digital delivery'],
                    ['🔄', 'Lifetime updates included'],
                    ['💬', '12-month support'],
                    ['🔒', 'Secure payment'],
                  ].map(([icon,text]) => `
                    <div style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-2) 0;font-size:var(--text-xs);color:var(--text-secondary);">
                      <span>${icon}</span><span>${text}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Related Products -->
        <div style="margin-top:var(--space-20);">
          <h2 class="section-title reveal" style="margin-bottom:var(--space-8);">Related Products</h2>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-6);" id="related-grid"></div>
        </div>
      </div>
    `;

    // Related
    const relatedGrid = document.getElementById('related-grid');
    const related = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);
    if (relatedGrid) renderGrid(related.length ? related : PRODUCTS.slice(0,3), relatedGrid);

    NexusAnimations.initScrollReveal();
    initWishlistButtons();
  };

  /* ── Add to Cart ── */
  const addToCart = (productId) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    NexusStorage.cart.add(product);
    NexusApp.Toast.success('Added to Cart!', `${product.name} has been added to your cart.`);
    NexusApp.updateCartCount();

    // Open cart drawer
    setTimeout(() => NexusApp.CartDrawer.open(), 400);
  };

  /* ── Toggle Wishlist ── */
  const toggleWishlist = (productId, btn) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const added = NexusStorage.wishlist.toggle(product);
    if (btn) {
      btn.textContent = added ? '♥ Remove from Wishlist' : '♡ Add to Wishlist';
    }
    NexusApp.Toast[added ? 'success' : 'info'](
      added ? 'Added to Wishlist' : 'Removed from Wishlist',
      product.name
    );
  };

  /* ── Wishlist buttons in grid ── */
  const initWishlistButtons = () => {
    document.querySelectorAll('[data-wishlist]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.wishlist;
        const product = PRODUCTS.find(p => p.id === id);
        if (!product) return;
        const added = NexusStorage.wishlist.toggle(product);
        btn.textContent = added ? '♥' : '♡';
        btn.classList.toggle('active', added);
        NexusApp.Toast[added ? 'success' : 'info'](
          added ? 'Added to Wishlist' : 'Removed',
          product.name
        );
      });
    });
  };

  /* ── Navigate to detail ── */
  const viewDetail = (productId) => {
    window.location.href = `product-detail.html?id=${productId}`;
  };

  /* ── Recently Viewed ── */
  const renderRecentlyViewed = (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const recent = NexusStorage.recently.get().slice(0, 4);
    if (!recent.length) {
      container.closest('[data-recently-section]')?.remove();
      return;
    }
    renderGrid(recent, container);
    initWishlistButtons();
  };

  /* ── Auto-init based on page ── */
  const autoInit = () => {
    const path = window.location.pathname;
    if (path.includes('products.html') || path === '/') {
      initProductsPage();
    }
    if (path.includes('product-detail.html')) {
      initDetailPage();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  return {
    renderCard,
    renderGrid,
    filterAndSort,
    addToCart,
    toggleWishlist,
    viewDetail,
    initWishlistButtons,
    renderRecentlyViewed,
  };
})();
