/* ═══════════════════════════════════════════════════════════════════
   NISA — checkout.
   The order is priced from the catalogue, never from what the browser
   sends. Placing it does three things: builds an order reference,
   delivers the order by whichever channel is configured, and hands the
   customer a prefilled WhatsApp message so nothing depends on email.

   To plug in a real gateway, replace the body of pay() — the shapes it
   returns are documented inline.
   ═══════════════════════════════════════════════════════════════════ */
window.NisaPage = function () {
  var U = window.NisaUtil, $ = U.$, $$ = U.$$, esc = U.esc, u = U.u;
  var B = window.NisaBag, M = window.NisaMoney, fmt = M.fmt, CFG = window.NISA, D = window.NisaData;

  function ref() {
    var d = new Date();
    return 'NISA-' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') +
      '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  }

  function priced() {
    /* re-price every line against the catalogue */
    return B.read().map(function (l) {
      var p = D.byId(l.id);
      var s = p && p.sizes.filter(function (x) { return x.ml === l.ml; })[0];
      return s ? { id: l.id, name: p.brand + ' ' + p.name, ml: l.ml, q: l.q, price: s.price, line: s.price * l.q } : null;
    }).filter(Boolean);
  }

  var coupon = null;

  function discountOf(lines, sub) {
    if (!coupon) return 0;
    if (coupon.freeDelivery) return 0;
    if (coupon.family) {
      var part = lines.reduce(function (a, l) {
        var p = D.byId(l.id);
        return a + (p && p.family === coupon.family ? l.line : 0);
      }, 0);
      return Math.round(part * coupon.pct / 100);
    }
    return Math.round(sub * coupon.pct / 100);
  }

  function paint() {
    var lines = priced();
    if (!lines.length) {
      $('#co-body').innerHTML = '<div class="empty"><h2 class="d3">Your bag is empty.</h2><p class="muted">Nothing to check out yet.</p>' +
        '<div style="margin-top:20px"><a class="b gold" href="' + u('shop.html') + '"><span>Go to the shop</span></a></div></div>';
      return;
    }
    var sub = lines.reduce(function (a, l) { return a + l.line; }, 0);
    var disc = discountOf(lines, sub);
    var ship = (sub - disc) >= CFG.freeDeliveryOver ? 0 : 350;
    if (coupon && coupon.freeDelivery) ship = 0;
    var total = sub - disc + ship;

    $('#co-body').innerHTML =
      '<div class="split wide" style="align-items:start">' +
        '<form data-nisa="order" id="co-form" novalidate>' +
          '<h2 class="d3">Where it goes</h2>' +
          '<div class="grid cols-2" style="gap:var(--space-4);margin-top:var(--space-4)">' +
            '<div class="field"><label for="c-first">First name</label><input class="in" id="c-first" name="first_name" required></div>' +
            '<div class="field"><label for="c-last">Last name</label><input class="in" id="c-last" name="last_name" required></div>' +
          '</div>' +
          '<div class="grid cols-2" style="gap:var(--space-4)">' +
            '<div class="field"><label for="c-mail">Email</label><input class="in" id="c-mail" name="email" type="email" required></div>' +
            '<div class="field"><label for="c-tel">Phone (M-Pesa number if paying by M-Pesa)</label><input class="in" id="c-tel" name="phone" type="tel" required></div>' +
          '</div>' +
          '<div class="grid cols-2" style="gap:var(--space-4)">' +
            '<div class="field"><label for="c-country">Country</label><select class="in" id="c-country" name="country">' +
              M.deliveryMarkets().map(function (m) { return '<option value="' + m.country + '"' + (m.code === M.market().code ? ' selected' : '') + '>' + m.flag + ' ' + m.country + '</option>'; }).join('') +
            '</select></div>' +
            '<div class="field"><label for="c-city">City or town</label><input class="in" id="c-city" name="city" required></div>' +
          '</div>' +
          '<div class="field"><label for="c-addr">Delivery address or pickup point</label><textarea class="in" id="c-addr" name="address" style="min-height:88px" required></textarea></div>' +
          '<div class="field"><label for="c-note">Anything we should know</label><textarea class="in" id="c-note" name="notes" style="min-height:72px"></textarea></div>' +

          '<h2 class="d3" style="margin-top:var(--space-8)">How you would like to pay</h2>' +
          '<div style="display:grid;gap:10px;margin-top:var(--space-4)">' +
            ['mpesa|M-Pesa|We send an STK push to the number above.',
             'card|Card|Visa or Mastercard, taken on a secure page.',
             'paypal|PayPal|For customers paying from outside the region.',
             'cod|Cash on delivery|Nairobi, Mombasa and Kisumu only.'].map(function (o, i) {
              var b = o.split('|');
              return '<label style="display:grid;grid-template-columns:22px 1fr;gap:12px;align-items:start;border:1px solid var(--rule);padding:var(--space-4);cursor:pointer">' +
                '<input type="radio" name="payment" value="' + b[0] + '"' + (i === 0 ? ' checked' : '') + ' style="accent-color:var(--color-accent);margin-top:3px">' +
                '<span><strong style="font-family:var(--font-heading);font-size:19px;font-weight:400">' + b[1] + '</strong>' +
                '<span class="small muted" style="display:block">' + b[2] + '</span></span></label>';
            }).join('') +
          '</div>' +
          '<div class="hp"><input name="botcheck" tabindex="-1" aria-hidden="true"></div>' +
          '<button class="b gold" type="submit" style="width:100%;margin-top:var(--space-6)"><span>Place the order</span></button>' +
          '<div data-out style="margin-top:var(--space-4)"></div>' +
        '</form>' +

        '<aside style="border:1px solid var(--rule);padding:var(--space-6);position:sticky;top:104px">' +
          '<h2 class="d3">Your order</h2>' +
          '<div style="display:grid;gap:var(--space-3);margin:var(--space-4) 0">' + lines.map(function (l) {
            return '<div style="display:flex;justify-content:space-between;gap:12px;font-size:14px"><span>' + esc(l.name) +
              ' <span class="muted num">' + l.ml + 'ml ×' + l.q + '</span></span><span class="num">' + fmt(l.line) + '</span></div>';
          }).join('') + '</div>' +
          '<div style="height:1px;background:var(--rule);margin:var(--space-4) 0"></div>' +
          '<div style="display:flex;gap:6px;align-items:center">' +
            '<input class="in" id="co-code" placeholder="Discount code" value="' + (coupon ? esc(coupon.code) : '') + '" aria-label="Discount code" style="text-transform:uppercase">' +
            '<button class="b sm" type="button" id="co-code-go" style="flex-shrink:0"><span>' + (coupon ? 'Remove' : 'Apply') + '</span></button>' +
          '</div>' +
          '<div id="co-code-msg" class="small muted" style="margin-top:6px">' + (coupon ? coupon.label : '') + '</div>' +
          (disc ? '<div style="display:flex;justify-content:space-between;font-size:14px;margin-top:var(--space-3);color:var(--color-accent-700)"><span>' + esc(coupon.code) + '</span><span class="num">− ' + fmt(disc) + '</span></div>' : '') +
          '<div style="display:flex;justify-content:space-between;font-size:14px;margin-top:var(--space-3)"><span class="muted">Delivery</span><span class="num">' + (ship ? fmt(ship) : 'Complimentary') + '</span></div>' +
          '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:var(--space-4)"><span class="d3">Total</span><span class="d3 num">' + fmt(total) + '</span></div>' +
          '<p class="small muted" style="margin-top:var(--space-4)">' + esc(M.market().delivery || M.deliveryMarkets()[0].delivery) + '</p>' +
          '<a class="lnk" href="' + u('cart.html') + '">Edit the bag</a>' +
        '</aside>' +
      '</div>';

    var codeGo = $('#co-code-go');
    if (codeGo) codeGo.onclick = function () {
      if (coupon) { coupon = null; paint(); return; }
      var raw = ($('#co-code').value || '').trim().toUpperCase();
      var hit = CFG.coupons && CFG.coupons[raw];
      if (!hit) { $('#co-code-msg').textContent = 'That code is not recognised.'; return; }
      coupon = { code: raw, pct: hit.pct, label: hit.label, family: hit.family, freeDelivery: hit.freeDelivery };
      paint();
    };

    /* Our own submit handler takes precedence over the generic one. */
    var f = $('#co-form');
    f.removeAttribute('data-nisa');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (f.botcheck && f.botcheck.value) return;
      var bad = $$('[required]', f).filter(function (i) { return !i.value.trim(); });
      if (bad.length) {
        bad[0].focus();
        $('[data-out]', f).className = 'note';
        $('[data-out]', f).textContent = 'A few fields still need filling in.';
        return;
      }
      var data = {}; new FormData(f).forEach(function (v, k) { data[k] = v; });
      var order = { ref: ref(), lines: lines, subtotal: sub, discount: disc, code: coupon ? coupon.code : '', delivery: ship, total: total, currency: M.market().currency, customer: data };
      pay(order);
    });
  }

  /* ── payment ──────────────────────────────────────────────────
     Each branch should end by sending the customer somewhere.
       · M-Pesa  → POST your order to a small endpoint that calls the
                   Daraja STK push, then poll for the callback.
       · Card    → create a Stripe Checkout Session server-side and
                   assign location.href = session.url.
       · PayPal  → create an order and redirect to the approve link.
     Until a gateway is connected, the order is delivered by form
     service and WhatsApp, which is a legitimate way to trade here.
     ────────────────────────────────────────────────────────────── */
  function pay(order) {
    var out = $('[data-out]');
    var msg = 'Order ' + order.ref + '\n' +
      order.lines.map(function (l) { return '· ' + l.name + ' ' + l.ml + 'ml ×' + l.q + ' — ' + fmt(l.line); }).join('\n') +
      (order.discount ? '\nDiscount ' + order.code + ' − ' + fmt(order.discount) : '') +
      '\nTotal ' + fmt(order.total) + '\n\n' + order.customer.first_name + ' ' + order.customer.last_name +
      '\n' + order.customer.phone + ' · ' + order.customer.email +
      '\n' + order.customer.address + ', ' + order.customer.city + ', ' + order.customer.country +
      '\nPayment: ' + order.customer.payment;
    var wa = 'https://wa.me/' + CFG.phoneRaw + '?text=' + encodeURIComponent(msg);

    function confirmed(extra) {
      localStorage.setItem('nisa:last-order', JSON.stringify(order));
      B.clear();
      $('#co-body').innerHTML =
        '<div class="split" style="align-items:start"><div>' +
          '<p class="kicker">Order placed</p>' +
          '<h2 class="d2">Thank you, ' + esc(order.customer.first_name) + '.</h2>' +
          '<p class="lead muted">Your reference is <strong class="num">' + order.ref + '</strong>. ' + extra + '</p>' +
          '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:var(--space-6)">' +
            '<a class="b gold" href="' + wa + '" target="_blank" rel="noopener"><span>Confirm on WhatsApp</span></a>' +
            '<a class="b" href="' + u('shop.html') + '"><span>Back to the shop</span></a></div>' +
        '</div><div style="border:1px solid var(--rule);padding:var(--space-6)">' +
          '<h3 class="d3">What we have</h3>' +
          order.lines.map(function (l) { return '<div style="display:flex;justify-content:space-between;font-size:14px;padding:6px 0;border-bottom:1px solid var(--rule)"><span>' + esc(l.name) + ' <span class="muted num">' + l.ml + 'ml ×' + l.q + '</span></span><span class="num">' + fmt(l.line) + '</span></div>'; }).join('') +
          '<div style="display:flex;justify-content:space-between;margin-top:var(--space-4)"><span class="d3">Total</span><span class="d3 num">' + fmt(order.total) + '</span></div>' +
        '</div></div>';
      scrollTo({ top: 0, behavior: 'smooth' });
    }

    var line = { mpesa: 'We will send an M-Pesa request to ' + order.customer.phone + ' shortly.',
      card: 'We will send a secure card link to ' + order.customer.email + '.',
      paypal: 'We will send a PayPal request to ' + order.customer.email + '.',
      cod: 'Pay the rider on delivery — ' + fmt(order.total) + ', exact change appreciated.' }[order.customer.payment];

    if (!CFG.formKey) { confirmed(line + ' Tap below so we see it immediately.'); return; }
    out.className = 'note'; out.textContent = 'Placing the order…';
    fetch(CFG.formEndpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: CFG.formKey, subject: 'Nisa order ' + order.ref, order: JSON.stringify(order, null, 1) })
    }).then(function (r) { return r.json(); })
      .then(function () { confirmed(line); })
      .catch(function () { confirmed(line + ' Tap below so we see it immediately.'); });
  }

  paint();
  window.NisaRepaint = paint;
};
