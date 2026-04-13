/* ============================================
   NEXUS PLATFORM — SERVICES ENGINE
   ============================================ */

const NexusServices = (() => {

  const renderServiceCard = (svc) => `
    <div class="card card-hover reveal-scale" style="cursor:pointer;" onclick="NexusServices.viewDetail('${svc.id}')">
      <div style="height:160px;background:linear-gradient(135deg,var(--navy-800) 0%,var(--navy-700) 100%);display:flex;align-items:center;justify-content:center;font-size:3.5rem;">
        ${svc.emoji}
      </div>
      <div class="card-body">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-3);">
          <span class="badge badge-blue">${svc.category}</span>
          <div style="display:flex;align-items:center;gap:var(--space-1);font-size:var(--text-xs);color:var(--text-muted);">
            <span style="color:#F59E0B;">★</span> ${svc.rating}
          </div>
        </div>
        <h3 style="font-family:var(--font-heading);font-size:var(--text-lg);font-weight:700;margin-bottom:var(--space-2);">${svc.name}</h3>
        <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.65;margin-bottom:var(--space-4);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${svc.desc}</p>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div style="font-size:var(--text-xs);color:var(--text-muted);">${svc.priceLabel}</div>
            <div style="font-family:var(--font-heading);font-size:var(--text-xl);font-weight:800;">$${svc.price.toLocaleString()}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:var(--text-xs);color:var(--text-muted);">Timeline</div>
            <div style="font-size:var(--text-sm);font-weight:600;color:var(--text-primary);">${svc.timeline}</div>
          </div>
        </div>
      </div>
      <div class="card-footer" style="display:flex;gap:var(--space-3);">
        <button class="btn btn-secondary btn-sm" style="flex:1;" onclick="event.stopPropagation();NexusServices.viewDetail('${svc.id}')">Learn More</button>
        <button class="btn btn-primary btn-sm btn-ripple" style="flex:1;" onclick="event.stopPropagation();NexusServices.openRequest('${svc.id}')">Get Started</button>
      </div>
    </div>
  `;

  const initServicesPage = () => {
    const grid = document.getElementById('services-grid');
    if (!grid) return;
    grid.innerHTML = SERVICES.map(renderServiceCard).join('');
    NexusAnimations.initScrollReveal();
    const cards = grid.querySelectorAll('.card');
    cards.forEach((c, i) => c.style.transitionDelay = `${i*80}ms`);
  };

  const viewDetail = (svcId) => {
    window.location.href = `services.html?id=${svcId}`;
  };

  const openRequest = (svcId) => {
    const svc = SERVICES.find(s => s.id === svcId);
    if (!svc) return;
    NexusApp.Modal.open('service-modal');
    const title = document.getElementById('service-modal-title');
    if (title) title.textContent = `Request: ${svc.name}`;
    const hiddenInput = document.getElementById('service-id-input');
    if (hiddenInput) hiddenInput.value = svcId;
  };

  const initServiceDetail = () => {
    const root = document.getElementById('service-detail');
    if (!root) return;

    const params = new URLSearchParams(window.location.search);
    const svc = SERVICES.find(s => s.id === params.get('id'));
    if (!svc) {
      root.innerHTML = `<div style="text-align:center;padding:var(--space-20);"><h2>Service not found</h2><a href="services.html" class="btn btn-primary" style="margin-top:var(--space-6);">View All Services</a></div>`;
      return;
    }

    root.innerHTML = `
      <div class="container">
        <div class="breadcrumb" style="margin-bottom:var(--space-6);">
          <a href="index.html">Home</a><span class="breadcrumb-sep">›</span>
          <a href="services.html">Services</a><span class="breadcrumb-sep">›</span>
          <span class="breadcrumb-current">${svc.name}</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 380px;gap:var(--space-12);align-items:start;">
          <div>
            <div class="reveal-left" style="height:300px;background:linear-gradient(135deg,var(--navy-800),var(--navy-700));border-radius:var(--radius-2xl);display:flex;align-items:center;justify-content:center;font-size:6rem;margin-bottom:var(--space-8);border:1px solid var(--border-color);">${svc.emoji}</div>
            <div class="reveal">
              <span class="badge badge-blue" style="margin-bottom:var(--space-4);">${svc.category}</span>
              <h1 style="font-size:var(--text-4xl);font-weight:900;margin-bottom:var(--space-4);letter-spacing:-0.02em;">${svc.name}</h1>
              <p style="font-size:var(--text-lg);color:var(--text-secondary);line-height:1.8;margin-bottom:var(--space-8);">${svc.desc}</p>

              <h3 style="font-family:var(--font-heading);font-size:var(--text-xl);font-weight:700;margin-bottom:var(--space-5);">What You Get</h3>
              <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:var(--space-3);margin-bottom:var(--space-10);">
                ${svc.features.map(f=>`
                  <div style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-4);background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);">
                    <span style="width:22px;height:22px;background:rgba(16,185,129,0.12);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--success);flex-shrink:0;">✓</span>
                    <span style="font-size:var(--text-sm);font-weight:500;">${f}</span>
                  </div>
                `).join('')}
              </div>

              <h3 style="font-family:var(--font-heading);font-size:var(--text-xl);font-weight:700;margin-bottom:var(--space-5);">Our Process</h3>
              <div style="display:flex;flex-direction:column;gap:0;">
                ${svc.process.map((step, i)=>`
                  <div style="display:flex;gap:var(--space-4);padding:var(--space-5) 0;${i<svc.process.length-1?'border-bottom:1px solid var(--border-color);':''}">
                    <div style="width:36px;height:36px;background:linear-gradient(135deg,var(--navy-700),var(--navy-500));border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:var(--text-sm);flex-shrink:0;">${i+1}</div>
                    <div style="padding-top:var(--space-1);">
                      <div style="font-weight:700;font-size:var(--text-base);color:var(--text-primary);">${step}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div style="position:sticky;top:calc(68px + var(--space-6));">
            <div class="card card-glass reveal-right">
              <div class="card-body">
                <div style="margin-bottom:var(--space-5);">
                  <div style="font-size:var(--text-xs);color:var(--text-muted);margin-bottom:var(--space-2);">${svc.priceLabel}</div>
                  <div style="font-family:var(--font-heading);font-size:2.5rem;font-weight:900;">$${svc.price.toLocaleString()}</div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);margin-bottom:var(--space-5);">
                  <div style="padding:var(--space-4);background:var(--bg-secondary);border-radius:var(--radius-lg);text-align:center;">
                    <div style="font-family:var(--font-heading);font-size:var(--text-sm);font-weight:700;">⏱ Timeline</div>
                    <div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:var(--space-1);">${svc.timeline}</div>
                  </div>
                  <div style="padding:var(--space-4);background:var(--bg-secondary);border-radius:var(--radius-lg);text-align:center;">
                    <div style="font-family:var(--font-heading);font-size:var(--text-sm);font-weight:700;">⭐ Rating</div>
                    <div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:var(--space-1);">${svc.rating}/5.0</div>
                  </div>
                </div>
                <button class="btn btn-primary btn-lg btn-ripple" style="width:100%;justify-content:center;margin-bottom:var(--space-3);" onclick="NexusServices.openRequest('${svc.id}')">
                  🚀 Get Started
                </button>
                <a href="services.html" class="btn btn-ghost" style="width:100%;justify-content:center;">← Back to Services</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    NexusAnimations.initScrollReveal();
  };

  const autoInit = () => {
    const path = window.location.pathname;
    if (path.includes('services.html')) {
      if (new URLSearchParams(window.location.search).get('id')) {
        initServiceDetail();
      } else {
        initServicesPage();
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else { autoInit(); }

  return { initServicesPage, viewDetail, openRequest };
})();

/* ============================================
   NEXUS PLATFORM — DASHBOARD ENGINE
   ============================================ */

const NexusDashboard = (() => {

  const statusBadge = (status) => {
    const map = {
      completed: 'badge-green',
      processing: 'badge-yellow',
      cancelled: 'badge-red',
      pending: 'badge-gray',
    };
    return `<span class="badge ${map[status] || 'badge-gray'}" style="text-transform:capitalize;">${status}</span>`;
  };

  const initDashboard = () => {
    const root = document.getElementById('dashboard-root');
    if (!root) return;

    const user = NexusStorage.user.get();
    const orders = NexusStorage.orders.get();
    const wishlistCount = NexusStorage.wishlist.count();
    const cartCount = NexusStorage.cart.count();

    root.innerHTML = `
      <!-- Welcome -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-8);">
        <div>
          <h1 style="font-family:var(--font-heading);font-size:var(--text-3xl);font-weight:900;margin-bottom:var(--space-2);">Welcome back, ${user.name.split(' ')[0]} 👋</h1>
          <p style="color:var(--text-secondary);">Here's what's happening with your account today.</p>
        </div>
        <span class="badge badge-blue" style="padding:var(--space-2) var(--space-4);font-size:var(--text-xs);">⭐ ${user.plan} Plan</span>
      </div>

      <!-- Stats -->
      <div class="dash-stats-grid">
        ${[
          { label:'Total Orders', value:orders.length, icon:'📦', color:'rgba(37,99,235,0.12)', change:'+2', up:true },
          { label:'Wishlist Items', value:wishlistCount, icon:'♥', color:'rgba(239,68,68,0.12)', change:'Same', up:true },
          { label:'Cart Items', value:cartCount, icon:'🛒', color:'rgba(16,185,129,0.12)', change:cartCount?'+'+cartCount:'0', up:true },
          { label:'Total Spent', value:'$'+orders.reduce((s,o)=>s+o.total,0), icon:'💰', color:'rgba(245,158,11,0.12)', change:'+$149', up:true },
        ].map(s=>`
          <div class="dash-stat-card reveal-scale">
            <div class="dash-stat-header">
              <div class="dash-stat-icon" style="background:${s.color};">${s.icon}</div>
              <span class="dash-stat-change up">${s.change}</span>
            </div>
            <div class="dash-stat-value">${s.value}</div>
            <div class="dash-stat-label">${s.label}</div>
          </div>
        `).join('')}
      </div>

      <!-- Orders -->
      <div class="card reveal" style="margin-bottom:var(--space-8);">
        <div class="card-body">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-6);">
            <h2 style="font-family:var(--font-heading);font-size:var(--text-xl);font-weight:700;">Recent Orders</h2>
            <a href="#" class="btn btn-ghost btn-sm">View All →</a>
          </div>
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="border-bottom:1px solid var(--border-color);">
                  ${['Order ID','Date','Items','Total','Status'].map(h=>`<th style="text-align:left;padding:var(--space-3) var(--space-4);font-size:var(--text-xs);font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;">${h}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${orders.slice(0,5).map(order=>`
                  <tr style="border-bottom:1px solid var(--border-color);transition:background var(--transition-fast);" onmouseenter="this.style.background='var(--bg-secondary)'" onmouseleave="this.style.background='transparent'">
                    <td style="padding:var(--space-4);font-weight:700;font-size:var(--text-sm);font-family:var(--font-mono);">${order.id}</td>
                    <td style="padding:var(--space-4);font-size:var(--text-sm);color:var(--text-secondary);">${new Date(order.date).toLocaleDateString()}</td>
                    <td style="padding:var(--space-4);font-size:var(--text-sm);color:var(--text-secondary);">${order.items.map(i=>i.name).join(', ').substring(0,40)}…</td>
                    <td style="padding:var(--space-4);font-family:var(--font-heading);font-weight:700;">$${order.total}</td>
                    <td style="padding:var(--space-4);">${statusBadge(order.status)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Activity -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-6);">
        <div class="card reveal-left">
          <div class="card-body">
            <h3 style="font-family:var(--font-heading);font-weight:700;margin-bottom:var(--space-5);">Quick Actions</h3>
            <div style="display:flex;flex-direction:column;gap:var(--space-3);">
              ${[
                ['🛒', 'Browse Products', 'products.html'],
                ['⚙️', 'Explore Services', 'services.html'],
                ['📦', 'View Cart', 'cart.html'],
                ['💳', 'Upgrade to Enterprise', 'pricing.html'],
              ].map(([icon,label,href])=>`
                <a href="${href}" style="display:flex;align-items:center;gap:var(--space-4);padding:var(--space-4);background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:var(--radius-lg);transition:all var(--transition-fast);" onmouseenter="this.style.borderColor='rgba(37,99,235,0.3)'" onmouseleave="this.style.borderColor='var(--border-color)'">
                  <span style="font-size:1.25rem;">${icon}</span>
                  <span style="font-size:var(--text-sm);font-weight:600;color:var(--text-primary);">${label}</span>
                  <span style="margin-left:auto;color:var(--text-muted);">→</span>
                </a>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="card reveal-right">
          <div class="card-body">
            <h3 style="font-family:var(--font-heading);font-weight:700;margin-bottom:var(--space-5);">Activity Timeline</h3>
            <div style="display:flex;flex-direction:column;gap:0;">
              ${[
                { icon:'✅', text:'Order ORD-7X9K2M completed', time:'7 days ago', color:'var(--success)' },
                { icon:'📦', text:'Enterprise Dashboard Kit downloaded', time:'7 days ago', color:'var(--info)' },
                { icon:'✅', text:'Order ORD-3P8F4N completed', time:'14 days ago', color:'var(--success)' },
                { icon:'🛒', text:'SaaS Landing Template purchased', time:'14 days ago', color:'var(--navy-400)' },
                { icon:'👤', text:'Account created', time:'3 months ago', color:'var(--accent-teal)' },
              ].map((item, i, arr)=>`
                <div style="display:flex;gap:var(--space-3);padding-bottom:var(--space-4);${i<arr.length-1?'border-left:2px solid var(--border-color);margin-left:var(--space-3);padding-left:var(--space-4);':'padding-left:var(--space-4);margin-left:var(--space-3);'}position:relative;">
                  <div style="position:absolute;left:-9px;top:0;width:16px;height:16px;background:${item.color};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:8px;">${item.icon}</div>
                  <div>
                    <div style="font-size:var(--text-sm);font-weight:500;color:var(--text-primary);">${item.text}</div>
                    <div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:2px;">${item.time}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    NexusAnimations.initScrollReveal();
  };

  const autoInit = () => {
    if (window.location.pathname.includes('dashboard.html')) {
      initDashboard();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else { autoInit(); }

  return { initDashboard };
})();
