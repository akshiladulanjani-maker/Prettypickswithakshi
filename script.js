(function () {
  // Mobile menu
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Pinterest save buttons: build the share link from the current page
  document.querySelectorAll('[data-pin]').forEach(function (a) {
    var url = encodeURIComponent(location.href.split('#')[0]);
    var media = encodeURIComponent(a.getAttribute('data-img'));
    var desc = encodeURIComponent(a.getAttribute('data-desc'));
    a.href = 'https://www.pinterest.com/pin/create/button/?url=' + url + '&media=' + media + '&description=' + desc;
  });

  // Products (from products.js). Only items with a real http link are shown.
  var CATNAMES = { 'fashion': 'Fashion', 'beauty': 'Beauty', 'home-bedroom': 'Home & Bedroom', 'gifts': 'Gifts', 'lifestyle': 'Lifestyle' };
  var valid = (window.PRODUCTS || []).filter(function (p) {
    return p && p.link && p.link.indexOf('http') === 0;
  });

  function text(cls, str) {
    var s = document.createElement('span'); s.className = cls; s.textContent = str; return s;
  }
  function productCard(p) {
    var card = document.createElement('article');
    card.className = 'pc';
    var m = document.createElement('a');
    m.className = 'pc-media';
    m.href = p.link; m.target = '_blank'; m.rel = 'sponsored nofollow noopener';
    m.setAttribute('aria-label', (p.title || 'Product') + ' on Amazon');
    m.tabIndex = -1;
    if (p.image) {
      var img = document.createElement('img');
      img.src = p.image; img.alt = p.title || ''; img.loading = 'lazy';
      img.onerror = function () { img.style.display = 'none'; };
      m.appendChild(img);
      if (p.badge) m.appendChild(text('pc-badge', p.badge));
    } else {
      var ph = document.createElement('span');
      ph.className = 'ph ph-' + (p.category || 'x');
      ph.appendChild(text('ph-text', p.badge || CATNAMES[p.category] || ''));
      m.appendChild(ph);
    }
    var body = document.createElement('div'); body.className = 'pc-body';
    body.appendChild(text('label', p.store || CATNAMES[p.category] || ''));
    var h = document.createElement('h3'); h.textContent = p.title || ''; body.appendChild(h);
    if (p.description) { var d = document.createElement('p'); d.className = 'pc-desc'; d.textContent = p.description; body.appendChild(d); }
    if (p.price) body.appendChild(text('price', p.price));
    var b = document.createElement('a');
    b.className = 'btn pc-btn';
    b.href = p.link; b.target = '_blank'; b.rel = 'sponsored nofollow noopener';
    b.appendChild(document.createTextNode((p.button || 'Shop on Amazon') + ' '));
    var arr = document.createElement('span'); arr.setAttribute('aria-hidden', 'true'); arr.textContent = '\u2192';
    b.appendChild(arr);
    body.appendChild(b);
    card.appendChild(m); card.appendChild(body);
    return card;
  }

  var grid = document.getElementById('shop-grid');
  var box = document.getElementById('shop');          // home + category sections
  var page = document.getElementById('shop-page');    // full shop page

  if (box && grid) {
    var cat = box.getAttribute('data-cat');
    var items = valid.filter(function (p) { return cat === 'all' || p.category === cat; });
    if (cat === 'all') items = items.slice(0, 4);
    items.forEach(function (p) { grid.appendChild(productCard(p)); });
    box.hidden = !items.length;
  }

  if (page && grid) {
    var empty = document.getElementById('shop-empty');
    var filters = page.querySelectorAll('.filter');
    var render = function (f) {
      grid.innerHTML = '';
      var list = valid.filter(function (p) { return f === 'all' || p.category === f; });
      list.forEach(function (p) {
        var c = productCard(p); c.classList.add('reveal', 'in'); grid.appendChild(c);
      });
      empty.hidden = list.length > 0;
      if (!list.length && f !== 'all') empty.firstChild.textContent = 'No picks in this category yet. ';
    };
    filters.forEach(function (b) {
      b.addEventListener('click', function () {
        filters.forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        render(b.getAttribute('data-f'));
      });
    });
    render('all');
    var wanted = location.hash.replace('#', '');
    filters.forEach(function (b) { if (b.getAttribute('data-f') === wanted) b.click(); });
  }

  // Header shadow on scroll + reading progress bar on articles
  var header = document.querySelector('.site-header');
  var art = document.querySelector('.article');
  var bar = null;
  if (art) { bar = document.createElement('div'); bar.className = 'progress'; document.body.appendChild(bar); }
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? Math.min(100, window.scrollY / h * 100) : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Gentle reveal as things scroll into view
  var items2 = document.querySelectorAll('.card, .pc:not(.in), .pick:not(.in), .panel, .feat, .shop-box, .picks-intro > *, .about-strip > *');
  items2.forEach(function (el) {
    el.classList.add('reveal');
    var sibs = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.setProperty('--i', Math.min(sibs, 5));
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items2.forEach(function (el) { io.observe(el); });
  } else {
    items2.forEach(function (el) { el.classList.add('in'); });
  }
})();
