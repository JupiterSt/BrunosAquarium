/* assets/js/main.js — Bruno’s Aquarium */
(function(){
  document.addEventListener('DOMContentLoaded', () => {
    highlightActiveNav();
    smoothAnchors();
    externalLinkSafety();
    loadFeaturedGrid();
  });

  function getFilename(path){
    const last = (path || '').split('/').pop();
    return last && last.length ? last : 'index.html';
  }

  function highlightActiveNav(){
    const current = getFilename(location.pathname);
    document.querySelectorAll('nav a').forEach(a => {
      const href = a.getAttribute('href') || '';
      const file = getFilename(href);
      if (file === current || (current === 'index.html' && (file === '' || file === 'index.html'))){
        a.classList.add('active');
      }
    });
  }

  function smoothAnchors(){
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (el){
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (history.pushState){ history.pushState(null, '', `#${id}`); }
        }
      });
    });
  }

  function externalLinkSafety(){
    document.querySelectorAll('a[href^="http"]').forEach(a => {
      a.setAttribute('target','_blank');
      a.setAttribute('rel','noopener');
    });
  }

  async function loadFeaturedGrid(){
    const grid = document.getElementById('featured-grid');
    if (!grid) return;
    try{
      const res = await fetch('data/products.json', { cache: 'no-store' });
      if(!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      const items = (data.featured || []).slice(0, 8);
      grid.innerHTML = items.map(toCard).join('');
      // Wire Square links when provided per item
      items.forEach(item => {
        if (item.squareLink){
          const btn = grid.querySelector(`[data-sku="${cssEscape(item.sku || '')}"]`);
          if (btn){ btn.href = item.squareLink; btn.target = '_blank'; btn.rel = 'noopener'; }
        }
      });
    }catch(err){
      console.warn('products.json not found or invalid', err);
    }
  }

  function toCard(item){
    const price = item.price ? `$${Number(item.price).toFixed(2)}` : '';
    const img = item.image || 'assets/img/placeholder.webp';
    return `
      <div class="card">
        <img src="${img}" alt="${escapeHtml(item.name)}" style="width:100%;height:180px;object-fit:cover;border-radius:12px" loading="lazy">
        <div class="pad">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
            <strong>${escapeHtml(item.name)}</strong>
            <span class="price">${price}</span>
          </div>
          <p class="muted" style="margin:6px 0 10px">${escapeHtml(item.subtitle || '')}</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <a class="btn" data-sku="${escapeHtml(item.sku || '')}" href="#">Buy on Square</a>
            <a class="btn ghost" href="shop.html">All Products</a>
          </div>
        </div>
      </div>`;
  }

  function escapeHtml(s){
    return (s||'').replace(/[&<>"']/g, (m)=>({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    })[m]);
  }

  function cssEscape(s){
    // Basic escape for attribute selectors
    return (s||'').replace(/[^a-zA-Z0-9_-]/g, r => `\\${r.charCodeAt(0).toString(16)} `);
  }
})();
