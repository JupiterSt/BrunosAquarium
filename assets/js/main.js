/* assets/js/main.js — Bruno’s Aquarium (with Square category linker) */
(function(){
  document.addEventListener('DOMContentLoaded', () => {
    highlightActiveNav();
    smoothAnchors();
    wireSquareCategoryLinks();     // <-- NEW: set Square hrefs first
    externalLinkSafety();          // then mark http(s) links as external safely
    loadFeaturedGrid();
  });

  /* ===========================
     Central Square link map
     Add data-square-cat="key" on any <a> to auto-link.
     =========================== */
  const SQUARE_CATEGORY_LINKS = {
    // Full catalog / rollups
    eshop: 'https://brunos-aquarium.square.site/s/shop',
    livestock: 'https://brunos-aquarium.square.site/shop/livestock/DHBVDEXHF24SQYM2JPIIVU2X?page=1&limit=30&sort_by=category_order&sort_order=asc',

    // Livestock categories
    saltwaterFish: 'https://brunos-aquarium.square.site/shop/saltwater-fish/BROX7ZL7KQQZZYPXN2UEMDYI?page=1&limit=30&sort_by=category_order&sort_order=asc',
    saltwaterInverts: 'https://brunos-aquarium.square.site/shop/saltwater-inverts/GBYGSII7V6L5ZCKZB7CPF677?page=1&limit=30&sort_by=category_order&sort_order=asc',
    corals: 'https://brunos-aquarium.square.site/shop/corals/OJ63OW4KC6IRFGICS753EBLC?page=1&limit=30&sort_by=category_order&sort_order=asc',
    freshwaterFish: 'https://brunos-aquarium.square.site/shop/freshwater-fish/7A4EOHCYOJGA2OEM7IPPRLIJ?page=1&limit=30&sort_by=category_order&sort_order=asc',
    freshwaterInverts: 'https://brunos-aquarium.square.site/shop/freshwater-inverts/44VOENIFWWUDWIN3PEONUFO3?page=1&limit=30&sort_by=category_order&sort_order=asc',
    freshwaterPlants: 'https://brunos-aquarium.square.site/shop/freshwater-plants/AWRCUU5P2LNBBBNN6W3QKYKO?page=1&limit=30&sort_by=category_order&sort_order=asc',

    // Food
    food: 'https://brunos-aquarium.square.site/shop/food/E4A5V6FJPVACWC7U364BUMPN?page=1&limit=30&sort_by=category_order&sort_order=asc',

    // Supplies / equipment
    aquariumEquipments: 'https://brunos-aquarium.square.site/shop/aquarium-equipments/EYJAES4GMDJ7AH67QXPMWC56?page=1&limit=30&sort_by=category_order&sort_order=asc',
    tankEcosystemEssentials: 'https://brunos-aquarium.square.site/shop/tank-ecosystem-essentials/4T5R36KEU4G4G3R2ZVAXWM72?page=1&limit=30&sort_by=category_order&sort_order=asc',
    dryGoods: 'https://brunos-aquarium.square.site/shop/dry-goods/2RRGBAN3LJF5CF3F5UDLMNK3?page=1&limit=30&sort_by=category_order&sort_order=asc',
    reptileEssential: 'https://brunos-aquarium.square.site/shop/reptile-essential/PCVRUSATI5TCLCMLNQIEFHTS?page=1&limit=30&sort_by=category_order&sort_order=asc',
    otherCreaturesEssential: 'https://brunos-aquarium.square.site/shop/other-creatures-essential/LHDM7U7KAXY4J6S6J2FZSFYJ?page=1&limit=30&sort_by=category_order&sort_order=asc'
  };

  function wireSquareCategoryLinks(){
    for (const [key, url] of Object.entries(SQUARE_CATEGORY_LINKS)){
      document.querySelectorAll(`[data-square-cat="${key}"]`).forEach(a => {
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.dataset.squareLinked = '1';
      });
    }
  }

  /* ---------- Existing helpers ---------- */
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
      // Wire per-item Square links (if provided)
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
