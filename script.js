// Mobile menu
(function () {
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

  // Product grid: shows items from products.js that have a real link
  var box = document.getElementById('shop');
  var grid = document.getElementById('shop-grid');
  if (box && grid && window.PRODUCTS) {
    var cat = box.getAttribute('data-cat');
    var items = window.PRODUCTS.filter(function (p) {
      return p.link && p.link.indexOf('http') === 0 && (cat === 'all' || p.category === cat);
    });
    if (items.length) {
      items.forEach(function (p) {
        var a = document.createElement('a');
        a.className = 'product';
        a.href = p.link;
        a.target = '_blank';
        a.rel = 'sponsored nofollow noopener';
        var m = document.createElement('span'); m.className = 'media';
        var img = document.createElement('img');
        img.src = p.image; img.alt = p.title; img.loading = 'lazy';
        m.appendChild(img);
        var h = document.createElement('h3'); h.textContent = p.title;
        a.appendChild(m); a.appendChild(h);
        if (p.price) {
          var pr = document.createElement('span'); pr.className = 'price'; pr.textContent = p.price;
          a.appendChild(pr);
        }
        grid.appendChild(a);
      });
      box.hidden = false;
    }
  }

  // Header shadow on scroll
  var header = document.querySelector('.site-header');
  // Reading progress bar on articles
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
  var items = document.querySelectorAll('.card, .product, .tag, .shop-box, .about-strip > *, .section-head');
  items.forEach(function (el) {
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
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }
})();
