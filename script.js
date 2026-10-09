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
        var img = document.createElement('img');
        img.src = p.image; img.alt = p.title; img.loading = 'lazy';
        var h = document.createElement('h3'); h.textContent = p.title;
        a.appendChild(img); a.appendChild(h);
        if (p.price) {
          var pr = document.createElement('span'); pr.className = 'price'; pr.textContent = p.price;
          a.appendChild(pr);
        }
        grid.appendChild(a);
      });
      box.hidden = false;
    }
  }
})();
