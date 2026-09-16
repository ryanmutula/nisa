/* NISA — product detail. */
window.NisaPage = function () {
  var U = window.NisaUtil, $ = U.$, $$ = U.$$, esc = U.esc, u = U.u;
  var D = window.NisaData, P = D.products, fmt = window.NisaMoney.fmt;
  var CFG = window.NISA, ICON = window.NisaIcons;

  var id = new URLSearchParams(location.search).get('id');
  var p = D.byId(id) || P[0];
  var ml = p.sizes[0].ml;

  document.title = p.brand + ' ' + p.name + ' — Nisa Perfumes';
  $('#crumb').innerHTML = '<a href="' + u('index.html') + '">Home</a> · <a href="' + u('shop.html') + '">Shop</a> · <a href="' + u('shop.html?brand=' + p.brandSlug) + '">' + esc(p.brand) + '</a> · ' + esc(p.name);

  var avail = (p.availability || []).map(function (c) {
    var m = window.NisaMoney.deliveryMarkets().filter(function (x) { return x.code === c; })[0];
    return m ? m.flag + ' ' + m.country : c;
  }).join(' · ');

  $('#pdp').innerHTML =
    '<div class="gal" data-r="scale">' +
      '<div class="main"><img id="pdp-img" src="' + u(p.image) + '" alt="' + esc(p.brand + ' ' + p.name + ' bottle') + '"></div>' +
      '<p class="small muted" id="gal-hint">Official packshot, supplied by the house.</p>' +
    '</div>' +
    '<div data-r>' +
      '<div class="house" style="font-size:11px;letter-spacing:.17em;text-transform:uppercase;color:var(--color-accent-700)" data-s="1">' +
        '<a href="' + u('shop.html?brand=' + p.brandSlug) + '" style="color:inherit;text-decoration:none">' + esc(p.brand) + '</a></div>' +
      '<h1 class="d2" style="margin:4px 0 6px" data-s="2">' + esc(p.name) + '</h1>' +
      '<p class="it muted" data-s="2">' + esc(p.concentration) + ' · ' +
        '<a href="' + u('shop.html?family=' + p.family) + '" style="color:inherit">' + esc(p.familyLabel || D.famLabel(p.family)) + '</a>' +
        ' · ' + esc(p.gender) + '</p>' +
      '<p class="lead" style="margin-top:var(--space-4)" data-s="3">' + esc(p.description) + '</p>' +
      '<div class="pyr" data-s="4">' +
        '<div><span class="t">Top</span><span class="n">' + p.notes.top.join(', ') + '</span></div>' +
        '<div><span class="t">Heart</span><span class="n">' + p.notes.heart.join(', ') + '</span></div>' +
        '<div><span class="t">Base</span><span class="n">' + p.notes.base.join(', ') + '</span></div>' +
      '</div>' +
      '<div class="pills" id="pdp-sizes" data-s="5">' + p.sizes.map(function (s, i) {
        return '<button type="button" data-ml="' + s.ml + '" aria-pressed="' + (i === 0) + '">' + s.ml + 'ml · ' + fmt(s.price) + '</button>';
      }).join('') + '</div>' +
      '<div style="display:flex;align-items:baseline;gap:var(--space-4);margin:var(--space-6) 0 var(--space-4)" data-s="5">' +
        '<span class="d2 num" id="pdp-price">' + fmt(p.sizes[0].price) + '</span>' +
        '<span class="small muted">incl. duty · ' + (p.sizes[0].price >= CFG.freeDeliveryOver ? 'free delivery' : 'delivery from KSh 350') + '</span></div>' +
      '<div style="display:flex;gap:var(--space-3);flex-wrap:wrap" data-s="6">' +
        '<div class="qty" style="height:48px"><button data-q="down" aria-label="One fewer">−</button><span class="num" id="qn">1</span><button data-q="up" aria-label="One more">+</button></div>' +
        '<button class="b fill" id="pdp-add" style="flex:1;min-width:200px"><span>Add to bag</span></button>' +
        '<button class="ib cmp-b" data-heart="' + p.id + '" aria-pressed="false" aria-label="Save this fragrance" style="width:48px;height:48px">' + ICON.heart + '</button>' +
        '<button class="ib cmp-b" data-cmp="' + p.id + '" aria-pressed="false" aria-label="Add to compare" title="Compare" style="width:48px;height:48px">' + ICON.scales + '</button>' +
      '</div>' +
      '<p class="small muted" style="margin-top:var(--space-4)">Two 2ml samples travel with every order. Stocked for: ' + avail + '.</p>' +
      '<div class="note" style="margin-top:var(--space-4)">Prefer to buy over WhatsApp? <a href="https://wa.me/' + CFG.phoneRaw +
        '?text=' + encodeURIComponent('Hello Nisa — is ' + p.brand + ' ' + p.name + ' in stock?') + '" target="_blank" rel="noopener">Ask about this bottle</a>.</div>' +
    '</div>';

  function setSize(v) {
    ml = v;
    var s = p.sizes.filter(function (x) { return x.ml === ml; })[0];
    $('#pdp-price').textContent = fmt(s.price);
    $$('#pdp-sizes button').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.dataset.ml === ml)); });
  }
  $$('#pdp-sizes button').forEach(function (b) { b.onclick = function () { setSize(+b.dataset.ml); }; });

  var qty = 1;
  $('[data-q=up]').onclick = function () { qty++; $('#qn').textContent = qty; };
  $('[data-q=down]').onclick = function () { qty = Math.max(1, qty - 1); $('#qn').textContent = qty; };
  $('#pdp-add').onclick = function () { window.NisaBag.add(p.id, ml, qty, this); };
  $('[data-heart]').onclick = function () { window.NisaSaved.toggle(p.id); };
  $('[data-cmp]').onclick = function () { window.NisaCompare.toggle(p.id); };
  window.NisaSaved.paint();
  window.NisaCompare.paint();

  window.NisaSeen.note(p.id);
  window.NisaSeen.paint(window.NisaUtil.$('#seen'), p.id);

  /* — related — */
  var rel = P.filter(function (x) { return x.id !== p.id && (x.family === p.family || x.brandSlug === p.brandSlug); }).slice(0, 8);
  if (rel.length) {
    $('#related-wrap').hidden = false;
    $('#related').innerHTML = rel.map(window.NisaCard).join('');
    window.NisaWireCards($('#related'));
  }

  window.NisaRepaint = function () {
    setSize(ml);
    $$('#pdp-sizes button').forEach(function (b) {
      var s = p.sizes.filter(function (x) { return x.ml === +b.dataset.ml; })[0];
      b.textContent = s.ml + 'ml · ' + fmt(s.price);
    });
  };
};
