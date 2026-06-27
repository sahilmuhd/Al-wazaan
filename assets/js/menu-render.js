// ===== MENU RENDERING =====
(function () {
  var grid = document.getElementById('menuContent');
  if (!grid) return;

  var searchInput = document.getElementById('menuSearch');
  var filterBar = document.getElementById('menuFilters');
  var activeFilter = 'all';

  function badgeLabel(b) {
    if (b === 'popular') return 'Popular';
    if (b === 'must') return 'Must Try';
    if (b === 'kerala') return 'Kerala';
    if (b === 'arabic') return 'Arabic';
    return '';
  }

  function waLink(itemName) {
    var msg = encodeURIComponent('Hello Al-Wazaan! I would like to order: ' + itemName);
    return 'https://wa.me/96896149264?text=' + msg;
  }

  function renderCategory(catKey, items) {
    var cat = menuCategories.find(function (c) { return c.key === catKey; });
    if (!cat || !items || !items.length) return '';
    var cardsHtml = items.map(function (item) {
      return '<div class="food-card reveal">' +
        '<div class="food-card-body" style="padding-top:1.25rem;">' +
        '<div class="food-card-top">' +
        '<span class="food-card-name">' + item.name + '</span>' +
        '<span class="food-card-price">OMR ' + item.price + '</span>' +
        '</div>' +
        '<div class="food-card-arabic">' + item.arabic + '</div>' +
        '<div class="food-card-desc">' + item.desc + '</div>' +
        '<span class="food-badge ' + item.badge + '" style="position:static;display:inline-block;margin-bottom:0.6rem;">' + badgeLabel(item.badge) + '</span>' +
        '<a class="food-card-order" target="_blank" rel="noopener" href="' + waLink(item.name) + '">📲 Order on WhatsApp</a>' +
        '</div></div>';
    }).join('');
    return '<div class="menu-category-section" id="cat-' + catKey + '">' +
      '<h2 class="menu-cat-title"><span>' + cat.emoji + '</span> ' + cat.name + '</h2>' +
      '<div class="menu-items-grid">' + cardsHtml + '</div></div>';
  }

  function renderAll(filterKey, searchTerm) {
    searchTerm = (searchTerm || '').trim().toLowerCase();
    var html = '';
    var any = false;
    menuCategories.forEach(function (cat) {
      if (filterKey !== 'all' && filterKey !== cat.key) return;
      var items = menuData[cat.key] || [];
      if (searchTerm) {
        items = items.filter(function (it) {
          return it.name.toLowerCase().indexOf(searchTerm) !== -1 ||
                 it.desc.toLowerCase().indexOf(searchTerm) !== -1;
        });
      }
      if (items.length) {
        any = true;
        html += renderCategory(cat.key, items);
      }
    });
    grid.innerHTML = any ? html : '<div class="no-results"><p style="font-size:2rem;">🔍</p><p>No dishes found. Try a different search or category.</p></div>';

    // re-trigger reveal animation
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.05 });
    grid.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });
  }

  // build filter buttons
  if (filterBar) {
    var allBtn = '<button class="filter-btn active" data-key="all">All Items</button>';
    var catBtns = menuCategories.map(function (c) {
      return '<button class="filter-btn" data-key="' + c.key + '">' + c.emoji + ' ' + c.name + '</button>';
    }).join('');
    filterBar.innerHTML = allBtn + catBtns;
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      filterBar.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      activeFilter = btn.dataset.key;
      renderAll(activeFilter, searchInput ? searchInput.value : '');
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      renderAll(activeFilter, searchInput.value);
    });
  }

  renderAll('all', '');

  // If URL has a hash like #cat-biriyani, filter to it
  if (window.location.hash) {
    var key = window.location.hash.replace('#cat-', '');
    var match = menuCategories.find(function (c) { return c.key === key; });
    if (match && filterBar) {
      var btn = filterBar.querySelector('[data-key="' + key + '"]');
      if (btn) btn.click();
    }
  }
})();
