/* ═══════════════════════════════════════════════════════════════════
   NISA — site shell. Plain script, no modules, no build step.
   Header/footer, the opening film, custom cursor, scroll choreography,
   bag state, quick view and form delivery all live here.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CFG = window.NISA, CAT = window.NISA_CATALOG;
  var P = CAT.products, BRANDS = CAT.brands, FAMS = CAT.families;
  /* The decorative effects (cursor, dolly, drift, 3D, the flying intro) run
     regardless of the OS motion setting — the client asked for the full
     experience. Page-level scroll jumping is still left alone in CSS. */
  var reduced = false;
  window.NisaReduced = reduced;   // one flag, read by every page script
  var base = document.documentElement.getAttribute('data-base') || '';
  var page = document.body.getAttribute('data-page') || '';

  /* ── helpers ─────────────────────────────────────────────────── */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(t, a, h) { var n = document.createElement(t); if (a) for (var k in a) n.setAttribute(k, a[k]); if (h != null) n.innerHTML = h; return n; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function u(p) { return base + p; }
  window.NisaUtil = { $: $, $$: $$, el: el, esc: esc, u: u };

  var ICON = {
    bag: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    x: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    eye: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    wa: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.1c-.2.6-1.2 1.2-1.7 1.2-.4 0-1.6-.1-3.6-1.4-2.2-1.4-3.6-3.9-3.7-4.1-.3-.5-.6-1.4-.3-2.2.2-.6.9-1.1 1.2-1.1h.6c.2 0 .4 0 .6.5l.7 1.7c0 .2 0 .3-.1.5l-.4.5c-.1.2-.2.3-.1.5.3.6.8 1.3 1.4 1.8.7.6 1.3.9 1.6 1 .2 0 .3 0 .5-.2l.7-.8c.2-.2.3-.1.5-.1l1.6.8c.2.1.4.2.4.3.1.2.1.8 0 1.1Z"/></svg>',
    mute: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M11 5 6 9H2v6h4l5 4Z"/><path d="m17 9 4 6M21 9l-4 6"/></svg>',
    unmute: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M11 5 6 9H2v6h4l5 4Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
    heart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 20s-7-4.4-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.6 12 20 12 20Z"/></svg>',
    heartOn: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 20s-7-4.4-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.6 12 20 12 20Z"/></svg>',
    scales: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 3v18M5 7h14M7 7l-3 7h6Zm10 0-3 7h6Z"/></svg>',
    spark: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z"/><path d="M18 16l.8 2.2L21 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8Z"/></svg>',
    moon: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10Z"/></svg>',
    sun: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>',
    play: '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8Z"/></svg>',
    pause: '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4h4v16H7zM13 4h4v16h-4z"/></svg>'
  };
  window.NisaIcons = ICON;

  /* ── market / money ──────────────────────────────────────────── */
  function deliveryMarkets() { return CFG.markets.filter(function (m) { return !m.currencyOnly; }); }
  function market() {
    var code = localStorage.getItem('nisa:market:v2') || CFG.defaultMarket || 'KE';
    return CFG.markets.filter(function (m) { return m.code === code; })[0] || CFG.markets[0];
  }
  function fmt(kes) {
    var m = market(), v = kes * m.rate;
    var cents = m.rate < 0.05;              // USD/EUR need decimals, shillings do not
    var d = cents ? Math.round(v * 100) / 100 : Math.round(v);
    return m.symbol + ' ' + d.toLocaleString('en-US', cents ? { minimumFractionDigits: 2 } : {});
  }
  window.NisaMoney = { fmt: fmt, market: market, deliveryMarkets: deliveryMarkets };

  function byId(id) { return P.filter(function (p) { return p.id === id; })[0]; }
  function brandOf(slug) { return BRANDS.filter(function (b) { return b.slug === slug; })[0] || {}; }
  function famLabel(slug) { var f = FAMS.filter(function (x) { return x.slug === slug; })[0]; return f ? f.label : slug; }
  window.NisaData = { products: P, brands: BRANDS, families: FAMS, byId: byId, brandOf: brandOf, famLabel: famLabel };

  /* ── chrome ──────────────────────────────────────────────────── */
  var NAVLINKS = [
    ['index.html', 'Home'], ['shop.html', 'Shop'], ['about.html', 'Our house'],
    ['wholesale.html', 'Wholesale'], ['contact.html', 'Contact']
  ];

  function buildHeader() {
    var h = el('header', { class: 'site-head' });
    var opts = CFG.markets.map(function (m) {
      return '<option value="' + m.code + '"' + (m.code === market().code ? ' selected' : '') + '>' + m.flag + ' ' + m.currency + '</option>';
    }).join('');
    h.innerHTML =
      '<div class="head-in">' +
        '<a class="brand" href="' + u('index.html') + '" aria-label="Nisa Perfumes, home">' +
          '<img id="head-mark" src="' + u('assets/img/brand/nisa-mark-dark.png') + '" alt="Nisa Perfumes">' +
        '</a>' +
        '<nav class="nav" id="nav">' +
          NAVLINKS.map(function (l) {
            return '<a href="' + u(l[0]) + '"' + (page === l[0].replace('.html', '') ? ' aria-current="page"' : '') + '>' + l[1] + '</a>';
          }).join('') +
        '</nav>' +
        '<div class="head-act">' +
          '<button class="ib" id="btn-theme" aria-label="Switch to dark mode" title="Light or dark">' + ICON.moon + '</button>' +
          '<select class="cur-sel mkt-sel" id="mkt" aria-label="Country and currency">' + opts + '</select>' +
          '<button class="ib" id="btn-search" aria-label="Search the catalogue">' + ICON.search + '</button>' +
          '<button class="ib" id="btn-saved" aria-label="Your saved fragrances">' + ICON.heart + '<span class="badge num" id="save-n">0</span></button>' +
          '<button class="ib" id="btn-bag" aria-label="Open your bag">' + ICON.bag + '<span class="badge num" id="bag-n">0</span></button>' +
          '<button class="ib burger" id="btn-menu" aria-label="Menu" aria-expanded="false">' + ICON.menu + '</button>' +
          '<a class="b fill sm shop-cta" href="' + u('shop.html') + '"><span>Shop now</span></a>' +
        '</div>' +
      '</div>';
    document.body.insertBefore(h, document.body.firstChild);

    function setMarket(code) {
      localStorage.setItem('nisa:market:v2', code);
      $$('.mkt-sel').forEach(function (s) { s.value = code; });
      document.dispatchEvent(new CustomEvent('nisa:market'));
      repriceAll();
    }
    $('#mkt').addEventListener('change', function () { setMarket(this.value); });
    $('#btn-bag').addEventListener('click', openBag);
    $('#btn-saved').addEventListener('click', openSaved);
    $('#btn-menu').addEventListener('click', function () {
      var n = $('#nav'), on = n.classList.toggle('open');
      this.setAttribute('aria-expanded', String(on));
      this.innerHTML = on ? ICON.x : ICON.menu;
    });
    $('#btn-search').addEventListener('click', openSearch);

    var themeBtn = $('#btn-theme');
    function paintTheme() {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      themeBtn.innerHTML = dark ? ICON.sun : ICON.moon;
      themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      var mark = $('#head-mark');
      if (mark) mark.src = u('assets/img/brand/nisa-mark-' + (dark ? 'light' : 'dark') + '.png');
    }
    themeBtn.addEventListener('click', function () {
      var root = document.documentElement;
      var dark = root.getAttribute('data-theme') === 'dark';
      root.setAttribute('data-theme', dark ? 'light' : 'dark');
      localStorage.setItem('nisa:theme', dark ? 'light' : 'dark');
      paintTheme();
    });
    paintTheme();

    var util = el('div', { class: 'nav-util' },
      '<label class="nav-util-row"><span>Currency</span>' +
        '<select class="cur-sel mkt-sel" aria-label="Country and currency">' + opts + '</select></label>' +
      '<button class="nav-util-row" type="button" data-u="search"><span>Search the catalogue</span>' + ICON.search + '</button>' +
      '<button class="nav-util-row" type="button" data-u="saved"><span>Saved fragrances</span>' + ICON.heart + '</button>' +
      '<button class="nav-util-row" type="button" data-u="theme"><span>Light or dark</span>' + ICON.moon + '</button>');
    $('#nav').appendChild(util);
    $('select', util).addEventListener('change', function () { setMarket(this.value); });
    $$('[data-u]', util).forEach(function (b) {
      b.onclick = function () {
        $('#nav').classList.remove('open');
        $('#btn-menu').setAttribute('aria-expanded', 'false');
        $('#btn-menu').innerHTML = ICON.menu;
        if (b.dataset.u === 'search') openSearch();
        else if (b.dataset.u === 'saved') openSaved();
        else $('#btn-theme').click();
      };
    });

    addEventListener('scroll', function () { h.classList.toggle('stuck', scrollY > 12); }, { passive: true });
  }

  /* ── the shop is the priority: a slim bar once the hero is past ── */
  function shopBar() {
    if (page === 'cart' || page === 'checkout') return;

    if (isPhone()) {
      var mb = el('nav', { class: 'mobar', 'aria-label': 'Quick actions' },
        '<a href="' + u('shop.html') + '">' + ICON.bag + '<span>Shop</span></a>' +
        '<button type="button" data-advisor>' + ICON.spark + '<span>Find my scent</span></button>' +
        '<a href="https://wa.me/' + CFG.phoneRaw + '" target="_blank" rel="noopener">' + ICON.wa + '<span>WhatsApp</span></a>');
      document.body.appendChild(mb);
      document.body.classList.add('mobar-on');
      return;
    }

    var bar = el('div', { class: 'shopbar' },
      '<p class="muted">Eleven houses, stocked in Nairobi. Free delivery over <span data-kes="' + CFG.freeDeliveryOver + '">' + fmt(CFG.freeDeliveryOver) + '</span>.</p>' +
      '<a class="b fill sm" href="' + u('shop.html') + '"><span>Shop the shelf</span></a>');
    document.body.appendChild(bar);
    addEventListener('scroll', function () {
      var on = scrollY > innerHeight * 0.7;
      bar.classList.toggle('on', on);
      document.body.classList.toggle('shopbar-on', on);
    }, { passive: true });
  }

  /* ── recently viewed ─────────────────────────────────────────── */
  function noteSeen(id) {
    var seen = [];
    try { seen = JSON.parse(localStorage.getItem('nisa:seen') || '[]'); } catch (e) {}
    seen = [id].concat(seen.filter(function (x) { return x !== id; })).slice(0, 10);
    localStorage.setItem('nisa:seen', JSON.stringify(seen));
  }
  function seenList() {
    var ids = [];
    try { ids = JSON.parse(localStorage.getItem('nisa:seen') || '[]'); } catch (e) {}
    return ids.map(byId).filter(Boolean);
  }
  function paintSeen(node, skipId) {
    if (!node) return;
    var list = seenList().filter(function (p) { return p.id !== skipId; }).slice(0, 8);
    var wrap = node.closest('section') || node;
    if (list.length < 2) { wrap.hidden = true; return; }
    wrap.hidden = false;
    node.innerHTML = list.map(function (p) {
      return '<a href="' + u('product.html?id=' + p.id) + '"><img src="' + u(p.thumb) + '" alt="" loading="lazy">' +
        '<span class="muted">' + esc(p.brand) + '</span><span>' + esc(p.name) + '</span></a>';
    }).join('');
  }
  window.NisaSeen = { note: noteSeen, list: seenList, paint: paintSeen };

  function buildFooter() {
    var f = el('footer', { class: 'site-foot' });
    f.innerHTML =
      '<div class="wrap">' +
        '<div class="foot-grid">' +
          '<div>' +
            '<img src="' + u('assets/img/brand/nisa-mark-light.png') + '" alt="Nisa Perfumes" style="height:54px;width:auto;margin-bottom:18px">' +
            '<p class="muted" style="max-width:34ch;font-size:14px">Arabic attars, niche houses and designer fragrance, sourced at origin and distributed across Kenya, Uganda, Tanzania, Rwanda and Zambia.</p>' +
          '</div>' +
          '<div><h4>Shop</h4><ul>' +
            '<li><a href="' + u('shop.html') + '">All fragrance</a></li>' +
            '<li><a href="' + u('shop.html?family=oud') + '">Oud &amp; incense</a></li>' +
            '<li><a href="' + u('shop.html?tag=attar') + '">Attars</a></li>' +
            '<li><a href="' + u('shop.html?tag=new') + '">New arrivals</a></li>' +
            '<li><a href="' + u('shop.html?tag=bestseller') + '">Bestsellers</a></li>' +
          '</ul></div>' +
          '<div><h4>House</h4><ul>' +
            '<li><a href="' + u('about.html') + '">Our house</a></li>' +
            '<li><a href="' + u('wholesale.html') + '">Wholesale &amp; distribution</a></li>' +
            '<li><a href="' + u('wholesale.html#stockist') + '">Become a stockist</a></li>' +
            '<li><a href="' + u('contact.html') + '">Contact</a></li>' +
            '<li><a href="' + u('legal.html') + '">Terms &amp; privacy</a></li>' +
          '</ul></div>' +
          '<div><h4>Reach us</h4><ul>' +
            '<li><a href="tel:' + CFG.phoneRaw + '">' + CFG.phone + '</a></li>' +
            '<li><a href="mailto:' + CFG.email + '">' + CFG.email + '</a></li>' +
            '<li><a href="https://wa.me/' + CFG.phoneRaw + '">WhatsApp</a></li>' +
            '<li><a href="' + CFG.instagram + '">Instagram</a></li>' +
            '<li class="muted" style="font-size:13px">' + CFG.hours + '</li>' +
          '</ul></div>' +
        '</div>' +
        '<div class="foot-b">' +
          '<span class="muted">© ' + new Date().getFullYear() + ' Nisa Perfumes. All fragrance sourced from authorised channels.</span>' +
          '<div class="pay"><span>M-PESA</span><span>VISA</span><span>MASTERCARD</span><span>PAYPAL</span><span>CASH ON DELIVERY</span></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(f);

    var wa = el('a', { class: 'wa', href: 'https://wa.me/' + CFG.phoneRaw, target: '_blank', rel: 'noopener', 'aria-label': 'Message us on WhatsApp' }, ICON.wa);
    document.body.appendChild(wa);
  }

  /* ── opening film ────────────────────────────────────────────── */
  function isPhone() {
    return matchMedia('(max-width: 720px)').matches ||
      (matchMedia('(pointer: coarse)').matches && matchMedia('(max-width: 1024px)').matches);
  }

  function intro() {
    var replay = /[?&]intro=1/.test(location.search);
    if (page !== 'index' && !replay) return;
    if (isPhone() && !replay) return;
    /* Once per VISIT: it plays on a fresh arrival, not on every reload or
       every trip back to the home page within the same browsing session.
       Want it once per visitor for ever? Swap sessionStorage for
       localStorage on the two lines below. Want it every load? Delete them. */
    if (!replay) {
      if (sessionStorage.getItem('nisa:intro')) return;
      sessionStorage.setItem('nisa:intro', '1');
    }

    var doc = document.documentElement;
    var box = el('div', { id: 'intro', style: 'opacity:0' });
    box.innerHTML =
      '<video muted playsinline autoplay preload="auto"></video>' +
      '<div class="vig"></div><div class="bloom"></div><div class="bar"></div>' +
      '<button class="sound" type="button" aria-label="Turn the sound on"></button>' +
      '<button class="skip" type="button">Skip</button>';
    document.body.appendChild(box);

    var v = $('video', box), bar = $('.bar', box), done = false;

    /* ── the film file ──────────────────────────────────────────
       Drop your clip in at video/logo.mp4 and it plays automatically.
       These are tried in order; the first that loads wins. If none of
       them exist the intro is skipped silently and the page loads as
       normal, so the site never waits on a missing file. */
    /* The clip's picture ends before the file does — stop here rather than
       sitting on its trailing black frames. Set to null to play to the end. */
    var END_AT = 4.82;
    /* First that loads wins. Drop your own film in at video/logo.mp4 and it
       takes over; the bundled clip is only the stand-in until you do. */
    var SOURCES = ['video/logo.mp4', 'video/logo.webm', 'assets/video/nisa-intro.mp4'];
    var si = -1;
    function nextSource() {
      si++;
      if (si >= SOURCES.length) return finish();
      v.src = u(SOURCES[si]);
      v.load();
      withSound();
    }
    /* If the browser refuses to autoplay, wait for any interaction rather
       than throwing the film away. */
    /* ── sound ───────────────────────────────────────────────────
       Try to play it as it was made — with audio. Every browser blocks
       that until the visitor has interacted with the page, so on refusal
       we fall back to muted and offer a one-tap unmute. */
    var sound = $('.sound', box);
    function paintSound() {
      sound.innerHTML = v.muted ? ICON.mute : ICON.unmute;
      sound.setAttribute('aria-label', v.muted ? 'Turn the sound on' : 'Turn the sound off');
      sound.classList.toggle('nudge', v.muted);
    }
    function withSound() {
      v.muted = false;
      v.play().then(paintSound).catch(function () {
        v.muted = true;
        paintSound();
        v.play().catch(waitForTap);
      });
    }
    sound.addEventListener('click', function (e) {
      e.stopPropagation();
      v.muted = !v.muted;
      if (!v.muted) v.play().catch(function () {});
      paintSound();
    });
    function waitForTap() {
      if (done) return;
      $('.skip', box).textContent = 'Tap to play';
      ['pointerdown', 'keydown'].forEach(function (ev) {
        addEventListener(ev, function once() { removeEventListener(ev, once); v.play().catch(function () {}); }, { once: true });
      });
    }
    paintSound();
    v.addEventListener('error', function () { if (!done) nextSource(); });
    nextSource();
    /* The curtain only goes up once a film is actually decodable, so a
       missing or broken file never blanks the page. */
    v.addEventListener('loadeddata', function () {
      if (done || doc.classList.contains('intro-on')) return;
      doc.classList.add('intro-on');
      box.style.transition = 'opacity .3s';
      box.style.opacity = '1';
    });
    var stopAt = function () { return END_AT || v.duration || 0; };
    v.addEventListener('timeupdate', function () {
      var end = stopAt();
      if (end) bar.style.width = Math.min(100, v.currentTime / end * 100) + '%';
      if (END_AT && v.currentTime >= END_AT) finish();
    });
    v.addEventListener('ended', finish);
    /* anywhere on the film skips it */
    box.addEventListener('click', finish);
    addEventListener('keydown', function (e) { if (e.key === 'Escape' || e.key === ' ') finish(); });
    /* nothing decodable within twelve seconds — get out of the way */
    setTimeout(function () { if (!done && v.readyState < 2) finish(); }, 12000);

    function finish() {
      if (done) return; done = true;
      v.pause();
      var head = $('#head-mark');
      if (head && !reduced) {
        /* A gilt bloom opens from where the mark will land, the frame flies
           into the header at the header's own size, and the page rises up
           through it. */
        var r = head.getBoundingClientRect(), vb = v.getBoundingClientRect();
        var bloom = $('.bloom', box);
        bloom.style.left = (r.left + r.width / 2) + 'px';
        bloom.style.top = (r.top + r.height / 2) + 'px';
        if (vb.width && vb.height) {
          var s = Math.max(r.width / vb.width, r.height / vb.height);
          var tx = (r.left + r.width / 2) - (vb.left + vb.width / 2);
          var ty = (r.top + r.height / 2) - (vb.top + vb.height / 2);
          v.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + s + ')';
        }
        head.animate([
          { transform: 'scale(.72)', opacity: .35, filter: 'brightness(1.8)' },
          { transform: 'scale(1.1)', opacity: 1, filter: 'brightness(1.25)', offset: .62 },
          { transform: 'scale(1)', opacity: 1, filter: 'none' }
        ], { duration: 1250, easing: 'cubic-bezier(.22,1,.36,1)', delay: 520 });
      }
      box.classList.add('out');
      doc.classList.remove('intro-on');
      setTimeout(function () { box.remove(); }, 1300);
    }
  }

  /* ── custom cursor ───────────────────────────────────────────── */
  function cursor() {
    if (reduced || matchMedia('(hover: none)').matches) return;
    var ring = el('div', { class: 'cur' }), dot = el('div', { class: 'cur-dot' });
    document.body.appendChild(ring); document.body.appendChild(dot);
    document.body.classList.add('cur-on');
    var tx = innerWidth / 2, ty = innerHeight / 2, rx = tx, ry = ty;
    addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
      var hot = e.target.closest('a,button,select,input,textarea,[role=button],.card,.fam-tile');
      document.body.classList.toggle('cur-hot', !!hot);
    }, { passive: true });
    addEventListener('mouseout', function (e) { if (!e.relatedTarget) document.body.classList.add('cur-hide'); });
    addEventListener('mouseover', function () { document.body.classList.remove('cur-hide'); });
    (function loop() { rx += (tx - rx) * .16; ry += (ty - ry) * .16; ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)'; requestAnimationFrame(loop); })();
  }

  /* ── scroll choreography ─────────────────────────────────────── */
  function showAll(root) { $$('[data-r]', root || document).forEach(function (n) { n.classList.add('is-in'); }); }

  /* Reveal on measured position, not on IntersectionObserver — the observer
     is throttled or inert in some embedding contexts, and a reveal that does
     not fire must never be the reason copy is invisible. */
  var watched = [], scanQueued = false;
  function scan() {
    scanQueued = false;
    var edge = innerHeight * 0.94;
    watched = watched.filter(function (n) {
      var r = n.getBoundingClientRect();
      if (r.top < edge && r.bottom > 0) { n.classList.add('is-in'); return false; }
      return true;
    });
  }
  function queueScan() { if (!scanQueued) { scanQueued = true; setTimeout(scan, 16); } }

  function reveal(root) {
    document.documentElement.classList.add('js-reveal');
    $$('[data-r]', root || document).forEach(function (n) {
      if (!n.classList.contains('is-in') && watched.indexOf(n) < 0) watched.push(n);
    });
    scan();
    if (!reveal._bound) {
      reveal._bound = true;
      addEventListener('scroll', queueScan, { passive: true });
      addEventListener('resize', queueScan);
      /* final safety net: nothing stays hidden for more than four seconds */
      setTimeout(function () { showAll(); }, 4000);
    }
  }
  window.NisaReveal = reveal;

  function parallax() {
    if (reduced) return;
    var items = $$('[data-par]');
    if (!items.length) return;
    var run = false;
    function tick() {
      run = false;
      items.forEach(function (n) {
        var r = n.getBoundingClientRect(), mid = r.top + r.height / 2 - innerHeight / 2;
        n.style.transform = 'translate3d(0,' + (mid * -(parseFloat(n.getAttribute('data-par')) || .08)) + 'px,0)';
      });
    }
    addEventListener('scroll', function () { if (!run) { run = true; setTimeout(tick, 16); } }, { passive: true });
    tick();
  }

  /* ── bag ─────────────────────────────────────────────────────── */
  function read() { try { return JSON.parse(localStorage.getItem('nisa:bag') || '[]'); } catch (e) { return []; } }
  function write(b) { localStorage.setItem('nisa:bag', JSON.stringify(b)); paintBadge(); document.dispatchEvent(new CustomEvent('nisa:bag')); }
  function bagCount() { return read().reduce(function (a, l) { return a + l.q; }, 0); }
  function bagTotal() { return read().reduce(function (a, l) { return a + l.price * l.q; }, 0); }
  function add(id, ml, q, fromEl) {
    var p = byId(id); if (!p) return;
    var size = p.sizes.filter(function (s) { return s.ml === ml; })[0] || p.sizes[0];
    var b = read(), key = id + ':' + size.ml, hit = b.filter(function (l) { return l.key === key; })[0];
    if (hit) hit.q += (q || 1);
    else b.push({ key: key, id: id, ml: size.ml, price: size.price, q: q || 1, name: p.name, brand: p.brand, thumb: p.thumb || p.image });
    write(b);
    if (fromEl) flyToBag(fromEl, p);
    toast(p.brand + ' ' + p.name + ' · ' + size.ml + 'ml added');
  }
  function setQty(key, q) {
    var b = read().map(function (l) { if (l.key === key) l.q = q; return l; }).filter(function (l) { return l.q > 0; });
    write(b);
  }
  function clear() { write([]); }
  window.NisaBag = { read: read, add: add, setQty: setQty, clear: clear, count: bagCount, total: bagTotal };

  function progHTML(total) {
    var need = CFG.freeDeliveryOver - total;
    var pct = Math.max(0, Math.min(1, total / CFG.freeDeliveryOver));
    return '<div class="prog"><div class="prog-rail"><span style="transform:scaleX(' + pct + ')"></span></div>' +
      '<p class="small muted" style="margin:0">' + (need <= 0 ? 'Delivery is on us.' : fmt(need) + ' more for free delivery.') + '</p></div>';
  }
  window.NisaProg = progHTML;

  function paintBadge() {
    var n = $('#bag-n'); if (!n) return;
    var c = bagCount(); n.textContent = c; n.classList.toggle('on', c > 0);
  }

  function flyToBag(from, p) {
    if (reduced) return;
    var img = from.closest('.card, .qv-in, .pdp') ? $('img', from.closest('.card, .qv-in, .pdp')) : null;
    var src = (img && img.src) || u(p.thumb || p.image);
    var r = (img || from).getBoundingClientRect(), t = $('#btn-bag').getBoundingClientRect();
    var f = el('div', { class: 'fly' }, '<img src="' + src + '" alt="">');
    f.style.left = (r.left + r.width / 2 - 37) + 'px';
    f.style.top = (r.top + r.height / 2 - 37) + 'px';
    document.body.appendChild(f);
    f.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: 'translate(' + ((t.left + 19) - (r.left + r.width / 2)) + 'px,' + ((t.top + 19) - (r.top + r.height / 2)) + 'px) scale(.18)', opacity: .2 }
    ], { duration: 720, easing: 'cubic-bezier(.5,0,.35,1)' }).onfinish = function () {
      f.remove();
      var b = $('#btn-bag'); b.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 380 });
    };
  }

  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = el('div', { class: 'toast', role: 'status' }); document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add('on');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove('on'); }, 2600);
  }
  window.NisaToast = toast;

  /* ── saved list ──────────────────────────────────────────────── */
  function saved() { try { return JSON.parse(localStorage.getItem('nisa:saved') || '[]'); } catch (e) { return []; } }
  function isSaved(id) { return saved().indexOf(id) > -1; }
  function toggleSaved(id) {
    var s = saved(), i = s.indexOf(id);
    if (i > -1) s.splice(i, 1); else s.push(id);
    localStorage.setItem('nisa:saved', JSON.stringify(s));
    paintHearts();
    var n = $('#save-n');
    if (n) { n.textContent = s.length; n.classList.toggle('on', s.length > 0); }
    toast(i > -1 ? 'Removed from your saved list' : 'Saved. It will be here when you return.');
    return i < 0;
  }
  function paintHearts() {
    $$('[data-heart]').forEach(function (b) {
      var on = isSaved(b.getAttribute('data-heart'));
      b.innerHTML = on ? ICON.heartOn : ICON.heart;
      b.setAttribute('aria-pressed', String(on));
      b.style.color = on ? 'var(--color-accent-700)' : '';
    });
  }
  window.NisaSaved = { list: saved, has: isSaved, toggle: toggleSaved, paint: paintHearts };

  function openSaved() {
    var d = el('aside', { class: 'sheet drawer', role: 'dialog', 'aria-label': 'Saved fragrances' });
    document.body.appendChild(d);
    function paint() {
      var list = saved().map(byId).filter(Boolean);
      d.innerHTML =
        '<div class="drawer-head"><button class="ib x" aria-label="Close">' + ICON.x + '</button>' +
          '<h2 class="d3" style="margin:0">Saved</h2>' +
          '<p class="muted small" style="margin:4px 0 0">' + (list.length ? list.length + ' put aside' : 'Nothing saved yet') + '</p></div>' +
        '<div class="bag-list">' + (list.length ? list.map(function (p) {
          return '<div class="bag-row"><img src="' + u(p.thumb) + '" alt="' + esc(p.name) + '">' +
            '<div><div class="small muted">' + esc(p.brand) + '</div>' +
            '<a href="' + u('product.html?id=' + p.id) + '" style="font-family:var(--font-heading);font-size:20px;text-decoration:none;color:inherit">' + esc(p.name) + '</a>' +
            '<div class="small muted num">from ' + fmt(p.sizes[0].price) + '</div></div>' +
            '<div style="display:grid;gap:6px;justify-items:end">' +
              '<button class="b sm" data-tobag="' + p.id + '"><span>Add</span></button>' +
              '<button class="lnk" data-drop="' + p.id + '" style="background:none;border:0;cursor:pointer">Remove</button>' +
            '</div></div>';
        }).join('') : '<p class="muted" style="padding:28px 0">Tap the heart on any fragrance and it will wait for you here.</p>') + '</div>' +
        '<div class="drawer-foot"><a class="b" href="' + u('shop.html') + '"><span>Browse the shop</span></a></div>';
      $('.x', d).onclick = close;
      $$('[data-drop]', d).forEach(function (b) { b.onclick = function () { toggleSaved(b.dataset.drop); paint(); }; });
      $$('[data-tobag]', d).forEach(function (b) { b.onclick = function () { add(b.dataset.tobag, null, 1, this); }; });
    }
    paint();
    showScrim(close);
    d.classList.add('on');
    function close() { d.classList.remove('on'); hideScrim(); setTimeout(function () { d.remove(); }, 600); }
  }
  window.NisaOpenSaved = openSaved;

  /* ── compare ─────────────────────────────────────────────────── */
  var cmp = [];
  function cmpToggle(id) {
    var i = cmp.indexOf(id);
    if (i > -1) cmp.splice(i, 1);
    else { if (cmp.length >= 3) { toast('Three at a time is the most useful comparison.'); return; } cmp.push(id); }
    paintCmp();
  }
  function paintCmp() {
    var tray = $('#cmp-tray');
    if (!tray) {
      tray = el('div', { class: 'cmptray', id: 'cmp-tray' });
      document.body.appendChild(tray);
    }
    tray.classList.toggle('on', cmp.length > 0);
    document.body.classList.toggle('cmp-on', cmp.length > 0);
    tray.innerHTML = cmp.map(function (id) {
      var p = byId(id);
      return '<button class="cmp-chip" data-cmpoff="' + id + '" aria-label="Remove ' + esc(p.name) + '">' +
        '<img src="' + u(p.thumb) + '" alt=""><span>' + esc(p.name) + '</span>' + ICON.x + '</button>';
    }).join('') +
      '<button class="b fill sm" id="cmp-go"' + (cmp.length < 2 ? ' disabled' : '') + '><span>Compare ' + cmp.length + '</span></button>';
    $$('[data-cmpoff]', tray).forEach(function (b) { b.onclick = function () { cmpToggle(b.dataset.cmpoff); }; });
    var go = $('#cmp-go', tray); if (go) go.onclick = showCompare;
    $$('[data-cmp]').forEach(function (b) { b.setAttribute('aria-pressed', String(cmp.indexOf(b.getAttribute('data-cmp')) > -1)); });
  }
  function showCompare() {
    var rows = [
      ['House', function (p) { return esc(p.brand); }],
      ['Family', function (p) { return esc(p.familyLabel || famLabel(p.family)); }],
      ['Concentration', function (p) { return esc(p.concentration); }],
      ['Wear', function (p) { return esc(p.gender); }],
      ['Top', function (p) { return p.notes.top.join(', '); }],
      ['Heart', function (p) { return p.notes.heart.join(', '); }],
      ['Base', function (p) { return p.notes.base.join(', '); }],
      ['Sizes', function (p) { return p.sizes.map(function (s) { return s.ml + 'ml'; }).join(' · '); }],
      ['From', function (p) { return '<span class="num">' + fmt(p.sizes[0].price) + '</span>'; }]
    ];
    var list = cmp.map(byId).filter(Boolean);
    var d = el('div', { class: 'sheet qv', role: 'dialog', 'aria-label': 'Compare fragrances' });
    d.innerHTML = '<button class="ib x" aria-label="Close">' + ICON.x + '</button>' +
      '<div style="padding:clamp(22px,3vw,40px)"><h2 class="d3">Side by side</h2>' +
      '<div style="overflow-x:auto;margin-top:var(--space-4)"><table class="tbl" style="min-width:520px"><thead><tr><th></th>' +
      list.map(function (p) {
        return '<th style="min-width:170px"><img src="' + u(p.thumb) + '" alt="" style="width:74px;height:88px;object-fit:contain;margin-bottom:8px">' +
          '<span style="display:block;font-family:var(--font-heading);font-size:19px;text-transform:none;letter-spacing:0">' + esc(p.name) + '</span></th>';
      }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr><td class="muted" style="white-space:nowrap">' + r[0] + '</td>' +
          list.map(function (p) { return '<td>' + r[1](p) + '</td>'; }).join('') + '</tr>';
      }).join('') +
      '<tr><td></td>' + list.map(function (p) {
        return '<td><button class="b sm" data-add="' + p.id + '"><span>Add to bag</span></button></td>';
      }).join('') + '</tr></tbody></table></div></div>';
    document.body.appendChild(d);
    showScrim(close);
    d.classList.add('on');
    $('.x', d).onclick = close;
    $$('[data-add]', d).forEach(function (b) { b.onclick = function () { add(b.dataset.add, null, 1, this); }; });
    function close() { d.classList.remove('on'); hideScrim(); setTimeout(function () { d.remove(); }, 600); }
  }
  window.NisaCompare = { toggle: cmpToggle, paint: paintCmp, list: function () { return cmp; } };

  /* ── overlays ────────────────────────────────────────────────── */
  var scrim;
  function showScrim(onClose) {
    if (!scrim) { scrim = el('div', { class: 'scrim' }); document.body.appendChild(scrim); }
    scrim.style.display = 'block';
    scrim.classList.add('on');
    scrim.onclick = onClose;
    document.body.style.overflow = 'hidden';
  }
  function hideScrim() {
    if (scrim) { scrim.classList.remove('on'); setTimeout(function () { scrim.style.display = 'none'; }, 400); }
    document.body.style.overflow = '';
  }

  function openBag() {
    var d = el('aside', { class: 'sheet drawer', role: 'dialog', 'aria-label': 'Your bag' });
    document.body.appendChild(d);
    function paint() {
      var b = read();
      d.innerHTML =
        '<div class="drawer-head"><button class="ib x" aria-label="Close">' + ICON.x + '</button>' +
          '<h2 class="d3" style="margin:0">Your bag</h2>' +
          '<p class="muted small" style="margin:4px 0 0">' + (b.length ? bagCount() + ' item' + (bagCount() > 1 ? 's' : '') : 'Nothing here yet') + '</p></div>' +
        '<div class="bag-list">' + (b.length ? b.map(function (l) {
          return '<div class="bag-row"><img src="' + u(l.thumb) + '" alt="' + esc(l.name) + '">' +
            '<div><div class="small muted">' + esc(l.brand) + '</div><strong style="font-family:var(--font-heading);font-size:19px;font-weight:400">' + esc(l.name) + '</strong>' +
            '<div class="small muted num">' + l.ml + 'ml · ' + fmt(l.price) + '</div>' +
            '<div class="qty" style="margin-top:7px"><button data-m="' + l.key + '" aria-label="One fewer">−</button><span class="num">' + l.q + '</span><button data-p="' + l.key + '" aria-label="One more">+</button></div></div>' +
            '<div class="num">' + fmt(l.price * l.q) + '</div></div>';
        }).join('') : '<p class="muted" style="padding:28px 0">Add a fragrance and it will appear here.</p>') + '</div>' +
        '<div class="drawer-foot">' +
          (b.length ? '<div style="display:flex;justify-content:space-between;font-family:var(--font-heading);font-size:22px"><span>Subtotal</span><span class="num">' + fmt(bagTotal()) + '</span></div>' +
            progHTML(bagTotal()) +
            '<a class="b gold" href="' + u('checkout.html') + '"><span>Checkout</span></a><a class="b" href="' + u('cart.html') + '"><span>View full bag</span></a>'
            : '<a class="b" href="' + u('shop.html') + '"><span>Browse the shop</span></a>') +
        '</div>';
      $('.x', d).onclick = close;
      $$('[data-m]', d).forEach(function (bt) { bt.onclick = function () { var l = read().filter(function (x) { return x.key === bt.dataset.m; })[0]; setQty(bt.dataset.m, l.q - 1); paint(); }; });
      $$('[data-p]', d).forEach(function (bt) { bt.onclick = function () { var l = read().filter(function (x) { return x.key === bt.dataset.p; })[0]; setQty(bt.dataset.p, l.q + 1); paint(); }; });
    }
    paint();
    showScrim(close);
    d.classList.add('on');
    function close() { d.classList.remove('on'); hideScrim(); setTimeout(function () { d.remove(); }, 600); }
  }
  window.NisaOpenBag = openBag;

  /* ── quick view ──────────────────────────────────────────────── */
  function quickView(id) {
    var p = byId(id); if (!p) return;
    var ml = p.sizes[0].ml;
    var d = el('div', { class: 'sheet qv', role: 'dialog', 'aria-label': p.brand + ' ' + p.name });
    d.innerHTML =
      '<button class="ib x" aria-label="Close">' + ICON.x + '</button>' +
      '<div class="qv-in">' +
        '<div class="stage"><img src="' + u(p.image) + '" alt="' + esc(p.brand + ' ' + p.name) + '"></div>' +
        '<div class="meta">' +
          '<div class="house">' + esc(p.brand) + '</div>' +
          '<h2 class="d2" style="margin:2px 0 6px">' + esc(p.name) + '</h2>' +
          '<p class="small it muted">' + esc(p.concentration) + ' · ' + esc(p.familyLabel || famLabel(p.family)) + '</p>' +
          '<p style="max-width:44ch">' + esc(p.description) + '</p>' +
          '<div class="pyr">' +
            '<div><span class="t">Top</span><span class="n">' + p.notes.top.join(', ') + '</span></div>' +
            '<div><span class="t">Heart</span><span class="n">' + p.notes.heart.join(', ') + '</span></div>' +
            '<div><span class="t">Base</span><span class="n">' + p.notes.base.join(', ') + '</span></div>' +
          '</div>' +
          '<div class="pills" id="qv-sizes">' + p.sizes.map(function (s, i) {
            return '<button type="button" data-ml="' + s.ml + '" aria-pressed="' + (i === 0) + '">' + s.ml + 'ml</button>';
          }).join('') + '</div>' +
          '<div style="display:flex;align-items:baseline;justify-content:space-between;margin:18px 0 14px"><span class="d3 num" id="qv-price">' + fmt(p.sizes[0].price) + '</span>' +
            '<a class="lnk" href="' + u('product.html?id=' + p.id) + '">Full detail</a></div>' +
          '<button class="b gold" id="qv-add" style="width:100%"><span>Add to bag</span></button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(d);
    showScrim(close);
    d.classList.add('on');
    $('.x', d).onclick = close;
    $$('#qv-sizes button', d).forEach(function (b) {
      b.onclick = function () {
        ml = +b.dataset.ml;
        $$('#qv-sizes button', d).forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        $('#qv-price', d).textContent = fmt(p.sizes.filter(function (s) { return s.ml === ml; })[0].price);
      };
    });
    $('#qv-add', d).onclick = function () { add(p.id, ml, 1, this); };
    function close() { d.classList.remove('on'); hideScrim(); setTimeout(function () { d.remove(); }, 600); }
  }
  window.NisaQuickView = quickView;

  /* ── search ──────────────────────────────────────────────────── */
  function openSearch() {
    var d = el('div', { class: 'sheet qv', role: 'dialog', 'aria-label': 'Search' });
    d.style.width = 'min(680px,92vw)';
    d.innerHTML = '<div style="padding:28px"><input class="in" id="sq" placeholder="A house, a note, a name…" autocomplete="off" aria-label="Search"><div id="sr" style="margin-top:18px;max-height:52vh;overflow:auto"></div></div>';
    document.body.appendChild(d);
    showScrim(close);
    d.classList.add('on'); $('#sq', d).focus();
    $('#sq', d).oninput = function () {
      var q = this.value.trim().toLowerCase();
      var hits = !q ? [] : P.filter(function (p) {
        return (p.name + ' ' + p.brand + ' ' + p.familyLabel + ' ' + [].concat(p.notes.top, p.notes.heart, p.notes.base).join(' ')).toLowerCase().indexOf(q) > -1;
      }).slice(0, 8);
      $('#sr', d).innerHTML = hits.length ? hits.map(function (p) {
        return '<a href="' + u('product.html?id=' + p.id) + '" style="display:grid;grid-template-columns:48px 1fr auto;gap:14px;align-items:center;padding:10px 0;border-bottom:1px solid var(--rule);text-decoration:none;color:inherit">' +
          '<img src="' + u(p.thumb) + '" alt="" style="width:48px;height:56px;object-fit:contain">' +
          '<span><span class="small muted">' + esc(p.brand) + '</span><br><strong style="font-family:var(--font-heading);font-size:19px;font-weight:400">' + esc(p.name) + '</strong></span>' +
          '<span class="num small">' + fmt(p.sizes[0].price) + '</span></a>';
      }).join('') : (q ? '<p class="muted">Nothing under that name. <a href="' + u('shop.html') + '">Browse everything</a>.</p>' : '');
    };
    addEventListener('keydown', function esc2(e) { if (e.key === 'Escape') { close(); removeEventListener('keydown', esc2); } });
    function close() { d.classList.remove('on'); hideScrim(); setTimeout(function () { d.remove(); }, 600); }
  }

  /* ── cards ───────────────────────────────────────────────────── */
  function cardHTML(p) {
    var tag = (p.tags || [])[0];
    return '<article class="card" data-id="' + p.id + '">' +
      '<span class="flag">' + (tag ? esc(tag) : '') + '</span>' +
      '<div class="card-tools">' +
        '<button class="ib" data-heart="' + p.id + '" aria-pressed="false" aria-label="Save ' + esc(p.name) + '">' + ICON.heart + '</button>' +
        '<button class="ib" data-qv="' + p.id + '" aria-label="Quick view ' + esc(p.name) + '">' + ICON.eye + '</button>' +
      '</div>' +
      '<a class="ph" href="' + u('product.html?id=' + p.id) + '" aria-label="' + esc(p.brand + ' ' + p.name) + '"><img src="' + u(p.thumb || p.image) + '" alt="' + esc(p.brand + ' ' + p.name + ' bottle') + '" loading="lazy"></a>' +
      '<div class="house">' + esc(p.brand) + '</div>' +
      '<h3><a href="' + u('product.html?id=' + p.id) + '" style="text-decoration:none;color:inherit">' + esc(p.name) + '</a></h3>' +
      '<div class="fam muted">' + esc(p.familyLabel || famLabel(p.family)) + '</div>' +
      '<div class="pills">' + p.sizes.map(function (s, i) { return '<button type="button" data-ml="' + s.ml + '" aria-pressed="' + (i === 0) + '">' + s.ml + 'ml</button>'; }).join('') + '</div>' +
      '<div class="price"><span class="d3 num" data-price>' + fmt(p.sizes[0].price) + '</span></div>' +
      '<div class="row"><button class="b sm" data-add="' + p.id + '"><span>Add to bag</span></button>' +
        '<button class="ib cmp-b" data-cmp="' + p.id + '" aria-pressed="false" aria-label="Compare ' + esc(p.name) + '" title="Compare">' + ICON.scales + '</button></div>' +
      '</article>';
  }
  window.NisaCard = cardHTML;

  function wireCards(root) {
    $$('.card', root || document).forEach(function (c) {
      if (c._wired) return; c._wired = true;
      var id = c.dataset.id, p = byId(id), ml = p.sizes[0].ml;
      $$('.pills button', c).forEach(function (b) {
        b.onclick = function () {
          ml = +b.dataset.ml;
          $$('.pills button', c).forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
          $('[data-price]', c).textContent = fmt(p.sizes.filter(function (s) { return s.ml === ml; })[0].price);
        };
      });
      var addB = $('[data-add]', c); if (addB) addB.onclick = function () { add(id, ml, 1, this); };
      var qv = $('[data-qv]', c); if (qv) qv.onclick = function () { quickView(id); };
      var hb = $('[data-heart]', c); if (hb) hb.onclick = function () { toggleSaved(id); };
      var cb = $('[data-cmp]', c); if (cb) cb.onclick = function () { cmpToggle(id); };
      c._reprice = function () { $('[data-price]', c).textContent = fmt(p.sizes.filter(function (s) { return s.ml === ml; })[0].price); };
    });
  }
  window.NisaWireCards = wireCards;

  function repriceAll() {
    $$('.card').forEach(function (c) { if (c._reprice) c._reprice(); });
    $$('[data-kes]').forEach(function (n) { n.textContent = fmt(+n.getAttribute('data-kes')); });
  }
  window.NisaReprice = repriceAll;

  /* ── forms ───────────────────────────────────────────────────── */
  function wireForms() {
    $$('form[data-nisa]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        if (f.querySelector('.hp input') && f.querySelector('.hp input').value) return;
        var out = $('[data-out]', f), data = {};
        new FormData(f).forEach(function (v, k) { data[k] = v; });
        var btn = $('button[type=submit]', f), label = btn ? btn.innerHTML : '';
        if (btn) { btn.disabled = true; btn.innerHTML = '<span>Sending…</span>'; }

        function ok(msg) {
          if (out) { out.className = 'note'; out.innerHTML = msg; }
          f.reset(); if (btn) { btn.disabled = false; btn.innerHTML = label; }
        }
        function waFallback() {
          var lines = Object.keys(data).filter(function (k) { return k !== 'access_key' && data[k]; }).map(function (k) { return k.replace(/_/g, ' ') + ': ' + data[k]; });
          var href = 'https://wa.me/' + CFG.phoneRaw + '?text=' + encodeURIComponent((f.dataset.nisa === 'wholesale' ? 'Trade enquiry' : 'Enquiry') + ' via nisaparfums.com\n\n' + lines.join('\n'));
          ok('Our form service is not connected yet — <a href="' + href + '" target="_blank" rel="noopener">send this to us on WhatsApp instead</a>, or email <a href="mailto:' + CFG.email + '">' + CFG.email + '</a>.');
        }

        if (!CFG.formKey) return waFallback();
        data.access_key = CFG.formKey;
        data.subject = 'Nisa — ' + (f.dataset.nisa || 'enquiry');
        fetch(CFG.formEndpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data)
        }).then(function (r) { return r.json(); }).then(function (r) {
          if (r.success) ok('Thank you — we have it. Expect a reply within one working day.');
          else waFallback();
        }).catch(waFallback);
      });
    });
  }


  /* ── the scent advisor ───────────────────────────────────────────
     A short conversation instead of a filter panel: who it is for,
     what they already reach for, how loud they want it, what they can
     spend, and anything they already love. It scores the catalogue and
     explains why each bottle came back. No server, no tracking. */
  function advisor() {
    if (!isPhone()) {
      var launcher = el('button', { class: 'bot-fab', 'aria-label': 'Ask the scent advisor' },
        ICON.spark + '<span>Find my scent</span>');
      document.body.appendChild(launcher);
      launcher.onclick = open;
    }
    $$('[data-advisor]').forEach(function (b) { b.onclick = open; });
    document.addEventListener('nisa:advisor', open);

    var answers = { forWho: '', fams: [], loud: '', budget: 0, loves: '' };
    var panel = null, step = 0;

    function buildSteps() { return [
      { q: 'Who are we buying for?', k: 'forWho', type: 'one',
        opts: [['me', 'Myself'], ['gift', 'A gift for someone']] },
      { q: 'What do you already reach for?', k: 'fams', type: 'many', hint: 'Pick as many as feel right.',
        opts: FAMS.map(function (f) { return [f.slug, f.label]; }) },
      { q: 'How loud should it be?', k: 'loud', type: 'one',
        opts: [['quiet', 'Close to the skin'], ['mid', 'Noticed in a room'], ['loud', 'A statement']] },
      { q: 'What are you comfortable spending?', k: 'budget', type: 'one',
        opts: [[15000, 'Up to ' + fmt(15000)], [30000, 'Up to ' + fmt(30000)], [60000, 'Up to ' + fmt(60000)], [0, 'No limit']] },
      { q: 'Anything you already love?', k: 'loves', type: 'text', hint: 'A name or a note — Layton, oud, vanilla. Skip if nothing comes to mind.' }
    ]; }
    var STEPS = buildSteps();
    /* Prices in the budget question are converted, so they have to be
       rebuilt when the visitor changes market mid-conversation. */
    document.addEventListener('nisa:market', function () {
      STEPS = buildSteps();
      if (panel && step < STEPS.length) draw();
    });

    function open() {
      if (panel) return;
      step = 0;
      STEPS = buildSteps();
      panel = el('div', { class: 'bot', role: 'dialog', 'aria-label': 'Scent advisor' });
      document.body.appendChild(panel);
      panel.classList.add('on');
      draw();
    }
    function close() { if (!panel) return; panel.classList.remove('on'); var p = panel; panel = null; setTimeout(function () { p.remove(); }, 450); }

    function head(sub) {
      return '<div class="bot-head"><div><strong>The scent advisor</strong>' +
        '<span class="muted small" style="display:block">' + sub + '</span></div>' +
        '<button class="ib" data-x aria-label="Close">' + ICON.x + '</button></div>';
    }

    function draw() {
      var s = STEPS[step];
      panel.innerHTML = head('Question ' + (step + 1) + ' of ' + STEPS.length) +
        '<div class="bot-body"><p class="bot-q">' + s.q + '</p>' +
        (s.hint ? '<p class="muted small" style="margin:-6px 0 12px">' + s.hint + '</p>' : '') +
        (s.type === 'text'
          ? '<input class="in" id="bot-text" placeholder="e.g. Layton, or oud and vanilla" autocomplete="off">'
          : '<div class="bot-opts">' + s.opts.map(function (o) {
              var on = s.type === 'many' ? answers[s.k].indexOf(o[0]) > -1 : answers[s.k] === o[0];
              return '<button type="button" data-v="' + o[0] + '" aria-pressed="' + on + '">' + esc(o[1]) + '</button>';
            }).join('') + '</div>') +
        '</div>' +
        '<div class="bot-foot">' +
          (step ? '<button class="lnk" data-back style="background:none;border:0;cursor:pointer">Back</button>' : '<span></span>') +
          '<button class="b fill sm" data-next><span>' + (step === STEPS.length - 1 ? 'Show me' : 'Next') + '</span></button>' +
        '</div>' +
        '<div class="bot-rail"><span style="transform:scaleX(' + ((step + 1) / STEPS.length) + ')"></span></div>';
      wire(s);
    }

    function wire(s) {
      $('[data-x]', panel).onclick = close;
      var back = $('[data-back]', panel); if (back) back.onclick = function () { step--; draw(); };
      $$('[data-v]', panel).forEach(function (b) {
        b.onclick = function () {
          var v = isNaN(+b.dataset.v) ? b.dataset.v : +b.dataset.v;
          if (s.type === 'many') {
            var i = answers[s.k].indexOf(v);
            if (i > -1) answers[s.k].splice(i, 1); else answers[s.k].push(v);
            b.setAttribute('aria-pressed', String(i < 0));
          } else {
            answers[s.k] = v;
            $$('[data-v]', panel).forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
            setTimeout(next, 220);
          }
        };
      });
      $('[data-next]', panel).onclick = next;
    }

    function next() {
      var s = STEPS[step];
      if (s.type === 'text') { var t = $('#bot-text', panel); if (t) answers.loves = t.value; }
      if (step === STEPS.length - 1) return results();
      step++; draw();
    }

    function results() {
      var loves = (answers.loves || '').toLowerCase().trim();
      var lovedNotes = [];
      if (loves) {
        var hit = P.filter(function (p) { return loves.indexOf(p.name.toLowerCase()) > -1 || p.name.toLowerCase().indexOf(loves) > -1; })[0];
        if (hit) lovedNotes = [].concat(hit.notes.top, hit.notes.heart, hit.notes.base).map(function (n) { return n.toLowerCase(); });
        else lovedNotes = loves.split(/[ ,]+/).filter(Boolean);
      }
      var loudRank = { quiet: ['eau de toilette', 'eau de parfum'], mid: ['eau de parfum'], loud: ['extrait', 'parfum', 'attar'] };

      var scored = P.map(function (p) {
        var sc = 0, why = [];
        if (answers.fams.indexOf(p.family) > -1) { sc += 4; why.push('it is ' + (p.familyLabel || famLabel(p.family)).toLowerCase()); }
        var conc = (p.concentration || '').toLowerCase();
        if ((loudRank[answers.loud] || []).some(function (c) { return conc.indexOf(c) > -1; })) { sc += 2; why.push(answers.loud === 'loud' ? 'it is a high concentration' : 'it wears close'); }
        if (answers.budget) { if (p.sizes[0].price <= answers.budget) sc += 2; else sc -= 6; }
        var notes = [].concat(p.notes.top, p.notes.heart, p.notes.base).map(function (n) { return n.toLowerCase(); });
        var shared = lovedNotes.filter(function (n) { return n.length > 2 && notes.some(function (x) { return x.indexOf(n) > -1; }); });
        if (shared.length) { sc += shared.length * 2; why.push('it shares ' + shared.slice(0, 3).join(', ') + ' with what you named'); }
        if ((p.tags || []).indexOf('bestseller') > -1) sc += 1;
        if (answers.forWho === 'gift' && (p.tags || []).indexOf('signature') > -1) { sc += 1; why.push('it gives well'); }
        return { p: p, sc: sc, why: why };
      }).filter(function (r) { return r.sc > 0; }).sort(function (a, b) { return b.sc - a.sc; }).slice(0, 3);

      if (!scored.length) scored = P.filter(function (p) { return (p.tags || []).indexOf('bestseller') > -1; }).slice(0, 3)
        .map(function (p) { return { p: p, why: ['it is what the region is wearing'] }; });

      panel.innerHTML = head('Three to start with') +
        '<div class="bot-body bot-res">' + scored.map(function (r) {
          return '<div class="bot-hit"><img src="' + u(r.p.thumb) + '" alt="">' +
            '<div><span class="small muted">' + esc(r.p.brand) + '</span>' +
            '<strong style="display:block;font-family:var(--font-heading);font-size:20px;font-weight:400">' + esc(r.p.name) + '</strong>' +
            '<span class="small muted num">from ' + fmt(r.p.sizes[0].price) + '</span>' +
            '<p class="small" style="margin:6px 0 8px">Because ' + esc(r.why.slice(0, 2).join(', and ')) + '.</p>' +
            '<div style="display:flex;gap:6px;flex-wrap:wrap">' +
              '<button class="b sm" data-add="' + r.p.id + '"><span>Add to bag</span></button>' +
              '<a class="lnk" href="' + u('product.html?id=' + r.p.id) + '">Detail</a>' +
            '</div></div></div>';
        }).join('') + '</div>' +
        '<div class="bot-foot"><button class="lnk" data-again style="background:none;border:0;cursor:pointer">Start again</button>' +
          '<a class="b fill sm" href="' + u('shop.html' + (answers.fams.length ? '?family=' + answers.fams.join('&family=') : '')) + '"><span>See the whole shelf</span></a></div>';
      $('[data-x]', panel).onclick = close;
      $('[data-again]', panel).onclick = function () { answers = { forWho: '', fams: [], loud: '', budget: 0, loves: '' }; step = 0; draw(); };
      $$('[data-add]', panel).forEach(function (b) { b.onclick = function () { add(b.dataset.add, null, 1, this); }; });
    }
  }

  /* ── boot ────────────────────────────────────────────────────── */
  function enableTransitions() {
    var doc = document.documentElement;
    function t() { try { return Number(document.timeline && document.timeline.currentTime) || 0; } catch (e) { return 0; } }
    var a = t();
    setTimeout(function () {
      if (t() > a) doc.classList.remove('no-anim');
    }, 200);
  }

  function boot() {
    buildHeader();
    buildFooter();
    paintBadge();
    intro();
    cursor();
    shopBar();
    advisor();
    if (typeof window.NisaPage === 'function') window.NisaPage();
    wireCards();
    paintHearts();
    paintCmp();
    var sn = $('#save-n'), sc = saved().length;
    if (sn) { sn.textContent = sc; sn.classList.toggle('on', sc > 0); }
    wireForms();
    reveal();
    parallax();
    enableTransitions();
    document.addEventListener('nisa:bag', paintBadge);
    document.addEventListener('nisa:market', function () { if (typeof window.NisaPage === 'function' && window.NisaRepaint) window.NisaRepaint(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
