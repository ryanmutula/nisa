/* ═══════════════════════════════════════════════════════════════════
   NISA — catalogue editor.
   Loads the catalogue that ships with the site, lets you edit it in a
   form, and writes a new catalog.js for you to download. Nothing is
   sent anywhere and nothing saves by itself: the file you download IS
   the save. Keep this page off the live server.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CAT = JSON.parse(JSON.stringify(window.NISA_CATALOG));
  var CFG = window.NISA;
  var sel = CAT.products[0] ? CAT.products[0].id : null;
  var dirty = false;

  function $(s) { return document.querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function kes(n) { return 'KSh ' + Number(n || 0).toLocaleString('en-KE'); }
  function byId(id) { return CAT.products.filter(function (p) { return p.id === id; })[0]; }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

  /* ── list ────────────────────────────────────────────────────── */
  function paintList() {
    var q = ($('#a-q').value || '').toLowerCase().trim();
    var list = CAT.products.filter(function (p) {
      if (!q) return true;
      var hay = (p.name + ' ' + p.brand + ' ' + (p.familyLabel || '') + ' ' +
        [].concat(p.notes.top, p.notes.heart, p.notes.base).join(' ')).toLowerCase();
      return hay.indexOf(q) > -1;
    });
    $('#a-count').textContent = list.length + ' of ' + CAT.products.length + (dirty ? ' · unsaved' : '');
    $('#a-list').innerHTML = list.map(function (p) {
      return '<button class="admin-row" data-p="' + p.id + '" aria-current="' + (p.id === sel) + '">' +
        '<img src="' + esc(p.thumb || p.image || '') + '" alt="">' +
        '<span><span class="small muted">' + esc(p.brand) + '</span>' +
        '<strong>' + esc(p.name) + '</strong>' +
        '<span class="small muted num">' + kes(p.sizes[0] && p.sizes[0].price) + '</span></span></button>';
    }).join('') || '<p class="muted small" style="padding:14px 0">Nothing matches that search.</p>';
    $$('[data-p]').forEach(function (b) { b.onclick = function () { sel = b.dataset.p; paintList(); paintEdit(); }; });
  }

  /* ── editor ──────────────────────────────────────────────────── */
  function field(label, id, val, hint) {
    return '<div class="field"><label for="' + id + '">' + label + '</label>' +
      '<input class="in" id="' + id + '" value="' + esc(val) + '">' +
      (hint ? '<span class="small muted">' + hint + '</span>' : '') + '</div>';
  }
  function area(label, id, val, hint) {
    return '<div class="field"><label for="' + id + '">' + label + '</label>' +
      '<textarea class="in" id="' + id + '" style="min-height:88px">' + esc(val) + '</textarea>' +
      (hint ? '<span class="small muted">' + hint + '</span>' : '') + '</div>';
  }
  function select(label, id, val, opts) {
    return '<div class="field"><label for="' + id + '">' + label + '</label><select class="in" id="' + id + '">' +
      opts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (o[0] === val ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') +
      '</select></div>';
  }

  function paintEdit() {
    var p = byId(sel);
    if (!p) { $('#a-edit').innerHTML = '<p class="muted">Pick a product on the left, or start a new one.</p>'; return; }
    $('#a-edit').innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:start;gap:var(--space-4);flex-wrap:wrap">' +
        '<div><p class="kicker">' + esc(p.brand) + '</p><h1 class="d3" style="margin:0">' + esc(p.name) + '</h1>' +
        '<code class="small muted">' + esc(p.id) + '</code></div>' +
        '<div style="display:flex;gap:6px"><button class="b sm" id="e-dupe"><span>Duplicate</span></button>' +
        '<button class="b sm" id="e-del"><span>Delete</span></button></div>' +
      '</div>' +

      '<div class="grid cols-2" style="gap:var(--space-4);margin-top:var(--space-6)">' +
        field('Name', 'e-name', p.name) +
        select('House', 'e-brand', p.brandSlug, CAT.brands.map(function (b) { return [b.slug, b.name]; })) +
      '</div>' +
      '<div class="grid cols-3" style="gap:var(--space-4)">' +
        select('Family', 'e-family', p.family, CAT.families.map(function (f) { return [f.slug, f.label]; })) +
        select('Wear', 'e-gender', p.gender, [['women', 'Women'], ['men', 'Men'], ['unisex', 'Unisex']]) +
        field('Concentration', 'e-conc', p.concentration) +
      '</div>' +

      '<h3 class="d3" style="margin-top:var(--space-6)">Sizes and prices</h3>' +
      '<p class="small muted">Prices in Kenyan shillings, whole numbers. Every other currency is converted from these.</p>' +
      '<div id="e-sizes" class="admin-sizes"></div>' +
      '<button class="b sm" id="e-addsize" style="margin-top:var(--space-3)"><span>Add a size</span></button>' +

      '<h3 class="d3" style="margin-top:var(--space-6)">Notes</h3>' +
      '<div class="grid cols-3" style="gap:var(--space-4)">' +
        field('Top', 'e-top', p.notes.top.join(', '), 'Comma separated') +
        field('Heart', 'e-heart', p.notes.heart.join(', ')) +
        field('Base', 'e-base', p.notes.base.join(', ')) +
      '</div>' +

      area('Description', 'e-desc', p.description, 'Two or three sentences. This is what the shop card and the product page read from.') +

      '<div class="grid cols-2" style="gap:var(--space-4)">' +
        field('Tags', 'e-tags', (p.tags || []).join(', '), 'bestseller · new · attar · rare · signature · value') +
        '<div class="field"><label>Stocked for</label><div style="display:flex;gap:12px;flex-wrap:wrap;padding-top:8px">' +
          window.NISA.markets.filter(function (m) { return !m.currencyOnly; }).map(function (m) {
            return '<label style="display:flex;gap:6px;align-items:center;font-size:14px;text-transform:none;letter-spacing:0">' +
              '<input type="checkbox" data-av="' + m.code + '"' + ((p.availability || []).indexOf(m.code) > -1 ? ' checked' : '') + '>' +
              m.flag + ' ' + esc(m.country) + '</label>';
          }).join('') +
        '</div></div>' +
      '</div>' +

      '<h3 class="d3" style="margin-top:var(--space-6)">Imagery</h3>' +
      '<div class="split" style="align-items:start;gap:var(--space-6)">' +
        '<div>' +
          field('Card and gallery image', 'e-image', p.image) +
          field('Thumbnail', 'e-thumb', p.thumb) +
          field('Cut-out (used by the 3D viewer)', 'e-cut', p.cutout || '') +
          '<p class="small muted">Put the files in <code>assets/img/products/</code> and name them after the id.</p>' +
        '</div>' +
        '<div style="background:var(--color-surface);aspect-ratio:1;display:grid;place-items:center">' +
          '<img src="' + esc(p.image || '') + '" alt="" style="max-height:86%;width:auto">' +
        '</div>' +
      '</div>' +

      '<div class="note" style="margin-top:var(--space-6)">The 3D silhouette (<code>outline</code>, ' +
        '<code>aspect</code>, <code>tint</code>, <code>shape</code>) is left untouched by this editor. ' +
        (p.outline ? 'This product has one, so its 360° tab works.' : 'This product has none, so its 360° tab falls back to the photograph.') +
      '</div>';

    paintSizes();
    wireEdit();
  }

  function paintSizes() {
    var p = byId(sel);
    $('#e-sizes').innerHTML = p.sizes.map(function (s, i) {
      return '<div class="admin-size"><label class="small muted">ml</label>' +
        '<input class="in" data-ml="' + i + '" value="' + s.ml + '" inputmode="numeric">' +
        '<label class="small muted">price (KES)</label>' +
        '<input class="in" data-price="' + i + '" value="' + s.price + '" inputmode="numeric">' +
        '<button class="b sm" data-rmsize="' + i + '"' + (p.sizes.length < 2 ? ' disabled' : '') + '><span>Remove</span></button></div>';
    }).join('');
    $$('[data-ml]').forEach(function (i) { i.onchange = function () { p.sizes[+i.dataset.ml].ml = +i.value || 0; touch(); }; });
    $$('[data-price]').forEach(function (i) { i.onchange = function () { p.sizes[+i.dataset.price].price = Math.round(+i.value) || 0; touch(); paintList(); }; });
    $$('[data-rmsize]').forEach(function (b) {
      b.onclick = function () { p.sizes.splice(+b.dataset.rmsize, 1); touch(); paintSizes(); };
    });
  }

  function touch() { dirty = true; paintList(); }

  function wireEdit() {
    var p = byId(sel);
    function bind(id, fn) { var n = $(id); if (n) n.onchange = function () { fn(n.value); touch(); }; }
    bind('#e-name', function (v) { p.name = v; paintEdit(); });
    bind('#e-brand', function (v) {
      var b = CAT.brands.filter(function (x) { return x.slug === v; })[0];
      p.brandSlug = v; p.brand = b ? b.name : v; paintEdit();
    });
    bind('#e-family', function (v) {
      var f = CAT.families.filter(function (x) { return x.slug === v; })[0];
      p.family = v; p.familyLabel = f ? f.label : v;
    });
    bind('#e-gender', function (v) { p.gender = v; });
    bind('#e-conc', function (v) { p.concentration = v; });
    bind('#e-top', function (v) { p.notes.top = splitList(v); });
    bind('#e-heart', function (v) { p.notes.heart = splitList(v); });
    bind('#e-base', function (v) { p.notes.base = splitList(v); });
    bind('#e-desc', function (v) { p.description = v; });
    bind('#e-tags', function (v) { p.tags = splitList(v).map(function (t) { return t.toLowerCase(); }); });
    bind('#e-image', function (v) { p.image = v; paintEdit(); });
    bind('#e-thumb', function (v) { p.thumb = v; paintList(); });
    bind('#e-cut', function (v) { p.cutout = v; });
    $$('[data-av]').forEach(function (c) {
      c.onchange = function () {
        p.availability = $$('[data-av]').filter(function (x) { return x.checked; }).map(function (x) { return x.dataset.av; });
        touch();
      };
    });
    $('#e-addsize').onclick = function () {
      var last = p.sizes[p.sizes.length - 1] || { ml: 50, price: 10000 };
      p.sizes.push({ ml: last.ml * 2, price: Math.round(last.price * 1.5) });
      touch(); paintSizes();
    };
    $('#e-dupe').onclick = function () {
      var copy = JSON.parse(JSON.stringify(p));
      copy.id = p.id + '-copy';
      copy.name = p.name + ' (copy)';
      CAT.products.splice(CAT.products.indexOf(p) + 1, 0, copy);
      sel = copy.id; touch(); paintEdit();
    };
    $('#e-del').onclick = function () {
      if (!confirm('Delete ' + p.brand + ' ' + p.name + ' from the catalogue?')) return;
      var i = CAT.products.indexOf(p);
      CAT.products.splice(i, 1);
      sel = (CAT.products[i] || CAT.products[i - 1] || {}).id || null;
      touch(); paintEdit();
    };
  }

  function splitList(v) { return String(v).split(',').map(function (x) { return x.trim(); }).filter(Boolean); }

  /* ── new ─────────────────────────────────────────────────────── */
  $('#a-new').onclick = function () {
    var name = prompt('Name of the fragrance?');
    if (!name) return;
    var b = CAT.brands[0];
    var id = slug(b.slug + '-' + name);
    if (byId(id)) { alert('There is already a product with the id ' + id + '. Give it a different name, or rename the existing one.'); return; }
    CAT.products.unshift({
      id: id, brand: b.name, brandSlug: b.slug, name: name,
      gender: 'unisex', family: CAT.families[0].slug, familyLabel: CAT.families[0].label,
      concentration: 'Eau de Parfum',
      sizes: [{ ml: 50, price: 10000 }],
      notes: { top: [], heart: [], base: [] },
      description: '', tags: [],
      image: 'assets/img/products/' + id + '-sq.webp',
      thumb: 'assets/img/products/' + id + '-sq-sm.webp',
      cutout: 'assets/img/products/' + id + '-cut.webp',
      availability: ['KE']
    });
    sel = id; touch(); paintEdit();
    scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── download / open ─────────────────────────────────────────── */
  $('#a-save').onclick = function () {
    var out = '/* NISA — catalogue. Edit this file to change the shop.\n' +
      '   Prices are whole numbers in KES. Loaded as a plain script so the site\n' +
      '   also works when opened straight off disk (file://).\n' +
      '   Last edited in admin.html on ' + new Date().toISOString().slice(0, 10) + '. */\n' +
      'window.NISA_CATALOG = ' + JSON.stringify(CAT) + ';\n';
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([out], { type: 'text/javascript' }));
    a.download = 'catalog.js';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    dirty = false; paintList();
  };

  $('#a-import').onclick = function () {
    var i = document.createElement('input');
    i.type = 'file';
    i.accept = '.js,.json,text/javascript,application/json';
    i.onchange = function () {
      var f = i.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        var txt = String(r.result);
        var a = txt.indexOf('{'), z = txt.lastIndexOf('}');
        try {
          var parsed = JSON.parse(txt.slice(a, z + 1));
          if (!parsed.products) throw new Error('no products');
          CAT = parsed; sel = CAT.products[0].id; dirty = false;
          paintList(); paintEdit();
        } catch (e) {
          alert('That file does not look like a Nisa catalogue. Open assets/js/catalog.js or a file this editor produced.');
        }
      };
      r.readAsText(f);
    };
    i.click();
  };

  function paintMark() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    $('#a-mark').src = 'assets/img/brand/nisa-mark-' + (dark ? 'light' : 'dark') + '.png';
  }
  $('#a-theme').onclick = function () {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark');
    localStorage.setItem('nisa:theme', dark ? 'light' : 'dark');
    paintMark();
  };
  paintMark();

  $('#a-q').oninput = paintList;
  addEventListener('beforeunload', function (e) { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

  paintList();
  paintEdit();

  /* Same timeline guard as the site: only trust transitions if the clock moves. */
  (function () {
    function t() { try { return Number(document.timeline && document.timeline.currentTime) || 0; } catch (e) { return 0; } }
    var a = t();
    setTimeout(function () { if (t() > a) document.documentElement.classList.remove('no-anim'); }, 200);
  })();
})();
