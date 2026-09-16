/* NISA — full bag page. */
window.NisaPage = function () {
  var U = window.NisaUtil, $ = U.$, $$ = U.$$, esc = U.esc, u = U.u;
  var B = window.NisaBag, fmt = window.NisaMoney.fmt, CFG = window.NISA, D = window.NisaData;

  function paint() {
    var lines = B.read(), sub = B.total();
    var ship = !lines.length ? 0 : (sub >= CFG.freeDeliveryOver ? 0 : 350);
    if (!lines.length) {
      $('#cart-body').innerHTML = '<div class="empty"><h2 class="d3">Nothing in the bag yet.</h2>' +
        '<p class="muted">Start with what the region is wearing, or dig into the attar library.</p>' +
        '<div style="display:flex;gap:12px;justify-content:center;margin-top:22px;flex-wrap:wrap">' +
        '<a class="b gold" href="' + u('shop.html?tag=bestseller') + '"><span>Bestsellers</span></a>' +
        '<a class="b" href="' + u('shop.html?tag=attar') + '"><span>Attars</span></a></div></div>';
      $('#also').hidden = true;
      return;
    }
    $('#cart-body').innerHTML =
      '<div class="split wide" style="align-items:start">' +
        '<div>' + lines.map(function (l) {
          return '<div class="bag-row" style="grid-template-columns:88px 1fr auto"><img src="' + u(l.thumb) + '" alt="' + esc(l.name) + '" style="width:88px;height:104px">' +
            '<div><div class="small muted">' + esc(l.brand) + '</div>' +
            '<a href="' + u('product.html?id=' + l.id) + '" style="font-family:var(--font-heading);font-size:23px;text-decoration:none;color:inherit">' + esc(l.name) + '</a>' +
            '<div class="small muted num">' + l.ml + 'ml · ' + fmt(l.price) + ' each</div>' +
            '<div class="qty" style="margin-top:9px"><button data-m="' + l.key + '" aria-label="One fewer">−</button><span class="num">' + l.q + '</span><button data-p="' + l.key + '" aria-label="One more">+</button></div></div>' +
            '<div style="text-align:right"><div class="d3 num">' + fmt(l.price * l.q) + '</div>' +
            '<button class="lnk" data-x="' + l.key + '" style="background:none;border:0;cursor:pointer;margin-top:8px">Remove</button></div></div>';
        }).join('') + '</div>' +
        '<aside style="border:1px solid var(--rule);padding:var(--space-6)">' +
          '<h2 class="d3">Summary</h2>' +
          '<div style="display:grid;gap:10px;margin:var(--space-4) 0;font-size:14px">' +
            '<div style="display:flex;justify-content:space-between"><span class="muted">Subtotal</span><span class="num">' + fmt(sub) + '</span></div>' +
            '<div style="display:flex;justify-content:space-between"><span class="muted">Delivery</span><span class="num">' + (ship ? fmt(ship) : 'Complimentary') + '</span></div>' +
            '<div style="display:flex;justify-content:space-between"><span class="muted">Samples</span><span>2 vials, included</span></div>' +
          '</div>' +
          '<div class="hr" style="height:1px;background:var(--rule);border:0;margin:var(--space-4) 0"></div>' +
          '<div style="display:flex;justify-content:space-between;align-items:baseline"><span class="d3">Total</span><span class="d3 num">' + fmt(sub + ship) + '</span></div>' +
          '<div style="margin-top:var(--space-4)">' + window.NisaProg(sub) + '</div>' +
          '<div style="display:grid;gap:10px;margin-top:var(--space-6)">' +
            '<a class="b gold" href="' + u('checkout.html') + '"><span>Checkout</span></a>' +
            '<a class="b" href="https://wa.me/' + CFG.phoneRaw + '?text=' + encodeURIComponent('Hello Nisa, I would like to order:\n' + lines.map(function (l) { return '· ' + l.brand + ' ' + l.name + ' ' + l.ml + 'ml ×' + l.q; }).join('\n')) + '" target="_blank" rel="noopener"><span>Order on WhatsApp</span></a>' +
            '<a class="lnk" href="' + u('shop.html') + '" style="text-align:center;margin-top:6px">Keep looking</a>' +
          '</div>' +
        '</aside>' +
      '</div>';

    $$('[data-m]').forEach(function (b) { b.onclick = function () { var l = B.read().filter(function (x) { return x.key === b.dataset.m; })[0]; B.setQty(b.dataset.m, l.q - 1); paint(); }; });
    $$('[data-p]').forEach(function (b) { b.onclick = function () { var l = B.read().filter(function (x) { return x.key === b.dataset.p; })[0]; B.setQty(b.dataset.p, l.q + 1); paint(); }; });
    $$('[data-x]').forEach(function (b) { b.onclick = function () { B.setQty(b.dataset.x, 0); paint(); }; });

    /* — suggestions from the families already in the bag — */
    var fams = lines.map(function (l) { var p = D.byId(l.id); return p && p.family; });
    var have = lines.map(function (l) { return l.id; });
    var also = D.products.filter(function (p) { return have.indexOf(p.id) < 0 && fams.indexOf(p.family) > -1; }).slice(0, 4);
    $('#also').hidden = !also.length;
    $('#also-shelf').innerHTML = also.map(window.NisaCard).join('');
    window.NisaWireCards($('#also-shelf'));
  }

  paint();
  window.NisaRepaint = paint;
};
