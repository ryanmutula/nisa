/* NISA — shop: filters, sort, URL sync. */
window.NisaPage = function () {
  var U = window.NisaUtil, $ = U.$, $$ = U.$$, esc = U.esc, u = U.u;
  var D = window.NisaData, P = D.products, fmt = window.NisaMoney.fmt;
  var CFG = window.NISA;

  var q = new URLSearchParams(location.search);
  var state = {
    brand: q.getAll('brand').concat((q.get('brands') || '').split(',').filter(Boolean)),
    family: q.getAll('family'),
    gender: q.getAll('gender'),
    tag: q.getAll('tag'),
    market: q.get('market') || '',
    max: q.get('max') ? +q.get('max') : 0,
    sort: q.get('sort') || 'feat'
  };
  $('#sort').value = state.sort;

  /* — family strip — */
  $('#fam-strip').innerHTML = D.families.map(function (f) {
    var on = state.family.indexOf(f.slug) > -1;
    var n = P.filter(function (p) { return p.family === f.slug; }).length;
    return '<a class="fam-tile" href="#" data-fam="' + f.slug + '"' + (on ? ' style="background:var(--ink);color:#efece6"' : '') + '>' +
      '<span class="d3">' + esc(f.label) + '</span><span class="c">' + n + '</span></a>';
  }).join('');
  $$('#fam-strip [data-fam]').forEach(function (a) {
    a.onclick = function (e) { e.preventDefault(); toggle('family', a.dataset.fam); };
  });

  /* — house directory — */
  $('#house-dir').innerHTML = D.brands.map(function (b) {
    return '<button class="house-b" type="button" data-brand="' + b.slug + '" aria-pressed="' + (state.brand.indexOf(b.slug) > -1) + '">' +
      '<span class="n">' + esc(b.name) + '</span><span class="o">' + esc(b.origin) + '</span></button>';
  }).join('');
  $$('#house-dir [data-brand]').forEach(function (b) {
    b.onclick = function () { toggle('brand', b.dataset.brand); };
  });

  function paintHouseNote() {
    var note = $('#house-note');
    if (state.brand.length !== 1) { note.hidden = true; return; }
    var b = D.brandOf(state.brand[0]);
    note.hidden = false;
    note.innerHTML = '<div class="split" style="align-items:start;gap:var(--space-8)">' +
      '<div><h3 class="d3">' + esc(b.name) + '</h3><p class="small muted">' + esc(b.origin) + ' · est. ' + b.founded + ' · <span class="it">' + esc(b.tagline || '') + '</span></p></div>' +
      '<p class="muted" style="margin:0">' + esc(b.blurb || '') + '</p></div>';
  }

  /* — filters — */
  function fgroup(title, key, opts) {
    return '<div class="fgroup"><h4>' + title + '</h4>' + opts.map(function (o) {
      return '<label><input type="checkbox" data-k="' + key + '" value="' + o.v + '"' + (state[key].indexOf(o.v) > -1 ? ' checked' : '') + '>' +
        '<span>' + esc(o.l) + '</span><span class="muted small" style="margin-left:auto">' + o.n + '</span></label>';
    }).join('') + '</div>';
  }
  function count(fn) { return P.filter(fn).length; }

  function paintFilters() {
    $('#filters').innerHTML =
      fgroup('Wear', 'gender', [
        { v: 'women', l: 'Women', n: count(function (p) { return p.gender === 'women'; }) },
        { v: 'men', l: 'Men', n: count(function (p) { return p.gender === 'men'; }) },
        { v: 'unisex', l: 'Unisex', n: count(function (p) { return p.gender === 'unisex'; }) }
      ]) +
      fgroup('Family', 'family', D.families.map(function (f) {
        return { v: f.slug, l: f.label, n: count(function (p) { return p.family === f.slug; }) };
      })) +
      fgroup('Character', 'tag', ['attar', 'bestseller', 'new', 'rare', 'signature', 'value'].map(function (t) {
        return { v: t, l: t.charAt(0).toUpperCase() + t.slice(1), n: count(function (p) { return (p.tags || []).indexOf(t) > -1; }) };
      })) +
      '<div class="fgroup"><h4>Price</h4>' +
        [0, 15000, 25000, 40000].map(function (v) {
          return '<label><input type="radio" name="fmax" value="' + v + '"' + (state.max === v ? ' checked' : '') + '>' +
            '<span>' + (v ? 'Under ' + window.NisaMoney.fmt(v) : 'Any price') + '</span></label>';
        }).join('') +
      '</div>' +
      '<div class="fgroup"><h4>In stock for</h4><select class="in" id="f-market">' +
        '<option value="">Any market</option>' +
        window.NisaMoney.deliveryMarkets().map(function (m) { return '<option value="' + m.code + '"' + (state.market === m.code ? ' selected' : '') + '>' + m.flag + ' ' + m.country + '</option>'; }).join('') +
      '</select></div>';
    $$('#filters input[type=checkbox]').forEach(function (i) {
      i.onchange = function () { toggle(i.dataset.k, i.value); };
    });
    $$('#filters input[name=fmax]').forEach(function (i) {
      i.onchange = function () { state.max = +i.value; apply(); };
    });
    $('#f-market').onchange = function () { state.market = this.value; apply(); };
  }

  function toggle(k, v) {
    var i = state[k].indexOf(v);
    if (i > -1) state[k].splice(i, 1); else state[k].push(v);
    apply();
  }

  /* — apply — */
  function apply() {
    var list = P.filter(function (p) {
      return (!state.brand.length || state.brand.indexOf(p.brandSlug) > -1)
        && (!state.family.length || state.family.indexOf(p.family) > -1)
        && (!state.gender.length || state.gender.indexOf(p.gender) > -1)
        && (!state.tag.length || state.tag.some(function (t) { return (p.tags || []).indexOf(t) > -1; }))
        && (!state.market || (p.availability || []).indexOf(state.market) > -1)
        && (!state.max || p.sizes.some(function (z) { return z.price <= state.max; }));
    });
    var by = {
      low: function (a, b) { return a.sizes[0].price - b.sizes[0].price; },
      high: function (a, b) { return b.sizes[0].price - a.sizes[0].price; },
      az: function (a, b) { return (a.brand + a.name).localeCompare(b.brand + b.name); },
      new: function (a, b) { return ((b.tags || []).indexOf('new') > -1) - ((a.tags || []).indexOf('new') > -1); },
      feat: function (a, b) { return (b.rating || 0) - (a.rating || 0); }
    };
    list = list.slice().sort(by[state.sort] || by.feat);

    $('#shelf').innerHTML = list.map(window.NisaCard).join('');
    window.NisaWireCards($('#shelf'));
    $('#none').hidden = !!list.length;
    $('#count').textContent = list.length + ' of ' + P.length + ' fragrances';

    var qs = new URLSearchParams();
    ['brand', 'family', 'gender', 'tag'].forEach(function (k) { state[k].forEach(function (v) { qs.append(k, v); }); });
    if (state.market) qs.set('market', state.market);
    if (state.max) qs.set('max', state.max);
    if (state.sort !== 'feat') qs.set('sort', state.sort);
    history.replaceState(null, '', location.pathname + (qs.toString() ? '?' + qs : ''));

    paintFilters();
    paintHouseNote();
    $$('#house-dir [data-brand]').forEach(function (b) { b.setAttribute('aria-pressed', String(state.brand.indexOf(b.dataset.brand) > -1)); });
    $$('#fam-strip [data-fam]').forEach(function (a) {
      a.style.cssText = state.family.indexOf(a.dataset.fam) > -1 ? 'background:var(--ink);color:#efece6' : '';
    });
    if (window.NisaReveal) window.NisaReveal($('#shelf'));
  }

  $('#sort').onchange = function () { state.sort = this.value; apply(); };
  $('#clear').onclick = function () {
    state.brand = []; state.family = []; state.gender = []; state.tag = []; state.market = ''; state.max = 0; state.sort = 'feat';
    $('#sort').value = 'feat'; apply();
  };

  paintFilters();
  apply();
  window.NisaRepaint = apply;
};
