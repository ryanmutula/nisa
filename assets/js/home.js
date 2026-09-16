/* NISA — home page behaviour. Runs via window.NisaPage from site.js. */
window.NisaPage = function () {
  var U = window.NisaUtil, $ = U.$, $$ = U.$$, esc = U.esc, u = U.u;
  var D = window.NisaData, P = D.products, fmt = window.NisaMoney.fmt;
  var CFG = window.NISA, ICON = window.NisaIcons;
  var reduced = !!window.NisaReduced;   // the single flag from site.js

  /* — hero: four bottles, swatch to swap — */
  var picks = ['amouage-interlude-man', 'pdm-layton', 'nishane-hacivat', 'amouage-oud-ulya'].map(D.byId).filter(Boolean);
  while (picks.length < 4) {
    var extra = P.filter(function (p) { return picks.indexOf(p) < 0 && (p.tags || []).indexOf('bestseller') > -1; })[0] || P[picks.length];
    picks.push(extra);
  }
  var shot = $('#hero-shot'), meta = $('#hero-meta'), sw = $('#hero-swatch');
  function setHero(p) {
    shot.classList.add('swap');
    setTimeout(function () {
      shot.src = u(p.image);
      shot.alt = p.brand + ' ' + p.name + ' bottle';
      meta.innerHTML = '<a href="' + u('product.html?id=' + p.id) + '" style="text-decoration:none;color:inherit">' +
        esc(p.brand) + ' · ' + esc(p.name) + ' · <span class="num">' + fmt(p.sizes[0].price) + '</span></a>';
      shot.classList.remove('swap');
    }, reduced ? 0 : 260);
  }
  sw.innerHTML = picks.map(function (p, i) {
    return '<button type="button" aria-pressed="' + (i === 0) + '" aria-label="' + esc(p.brand + ' ' + p.name) + '"><img src="' + u(p.thumb) + '" alt=""></button>';
  }).join('');
  $$('button', sw).forEach(function (b, i) {
    b.onclick = function () { $$('button', sw).forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); }); setHero(picks[i]); };
  });
  setHero(picks[0]);

  /* — brand wall — */
  var houses = D.brands.concat(D.brands);
  $('#marq').innerHTML = houses.map(function (b) {
    return '<a href="' + u('shop.html?brand=' + b.slug) + '">' + esc(b.name) + '</a>';
  }).join('');

  /* — the film: loops, muted, with pause and unmute — */
  var v = $('#film-v'), pb = $('#film-play'), mb = $('#film-mute');
  pb.innerHTML = ICON.play; pb.setAttribute('aria-label', 'Play the film'); mb.innerHTML = ICON.mute;
  function play() { v.play().then(function () { pb.innerHTML = ICON.pause; pb.setAttribute('aria-label', 'Pause the film'); }).catch(function () {}); }
  pb.onclick = function () { if (v.paused) play(); else { v.pause(); pb.innerHTML = ICON.play; pb.setAttribute('aria-label', 'Play the film'); } };
  mb.onclick = function () {
    v.muted = !v.muted;
    mb.innerHTML = v.muted ? ICON.mute : ICON.unmute;
    mb.setAttribute('aria-label', v.muted ? 'Unmute the film' : 'Mute the film');
  };
  /* The loop plays whatever the motion preference — it is the point of the
     band. Start it directly rather than waiting on an observer, which is
     throttled or inert in some embedding contexts; the observer is only an
     optimisation that pauses it while it is off screen. */
  play();
  v.addEventListener('canplay', function () { if (v.paused) play(); });
  /* keep the control honest if the browser pauses it behind our back */
  function syncBtn() {
    pb.innerHTML = v.paused ? ICON.play : ICON.pause;
    pb.setAttribute('aria-label', v.paused ? 'Play the film' : 'Pause the film');
  }
  v.addEventListener('play', syncBtn);
  v.addEventListener('pause', syncBtn);
  if (typeof IntersectionObserver === 'function') {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) play();
        else if (!v.paused) { v.pause(); pb.innerHTML = ICON.play; pb.setAttribute('aria-label', 'Play the film'); }
      });
    }, { threshold: 0.25 }).observe(v);
  }

  /* — families — */
  $('#fams').innerHTML = D.families.map(function (f, i) {
    var n = P.filter(function (p) { return p.family === f.slug; }).length;
    return '<a class="fam-tile" href="' + u('shop.html?family=' + f.slug) + '" data-s="' + ((i % 6) + 1) + '">' +
      '<span class="d3">' + esc(f.label) + '</span><span class="c">' + n + ' fragrance' + (n === 1 ? '' : 's') + '</span></a>';
  }).join('');

  /* — featured shelf — */
  var feat = P.filter(function (p) { return (p.tags || []).indexOf('bestseller') > -1; }).slice(0, 8);
  $('#featured').innerHTML = feat.map(window.NisaCard).join('');
  window.NisaWireCards($('#featured'));

  /* — attar bottle, 3D — */
  var attar = P.filter(function (p) { return (p.tags || []).indexOf('attar') > -1; })[0] || P[0];
  if (attar) {
    $('#attar-shot').src = u(attar.image);
    $('#attar-shot').alt = attar.brand + ' ' + attar.name + ' bottle';
  }

  window.NisaSeen.paint($('#seen'));

  /* — market table — */
  $('#mkt-rows').innerHTML = window.NisaMoney.deliveryMarkets().map(function (m) {
    return '<tr><td>' + m.flag + ' ' + esc(m.country) + '</td><td class="muted">' + esc(m.delivery) + '</td></tr>';
  }).join('');


  /* — the house at work: slow cross-fade with a drift — */
  var SCENES = [
    { img: 'assets/img/editorial/stockroom.webp', t: 'Checked against the list', c: 'Every carton is opened at the Nairobi holding and counted against its packing list before it moves again.' },
    { img: 'assets/img/editorial/boutique.webp', t: 'On the right shelf', c: 'Stockists across five markets, quoted landed and supplied from one place instead of four.' },
    { img: 'assets/img/editorial/counter.webp', t: 'Tried before it is bought', c: 'Blotters first, bottle second. Two samples travel with every order for the same reason.' }
  ];
  var stage = $('#show-stage'), rail = $('#show-rail'), si = 0, timer = null;
  stage.innerHTML = SCENES.map(function (s, i) {
    return '<div class="show-slide' + (i === 0 ? ' on' : '') + '" data-i="' + i + '">' +
      '<img src="' + u(s.img) + '" alt="' + esc(s.t) + '" loading="lazy">' +
      '<div class="show-cap"><p><span class="t">' + esc(s.t) + '</span>' + esc(s.c) + '</p></div></div>';
  }).join('');
  rail.innerHTML = SCENES.map(function (s, i) {
    return '<button type="button" role="tab" aria-current="' + (i === 0) + '" aria-label="' + esc(s.t) + '"><span></span></button>';
  }).join('');
  function goTo(n) {
    si = (n + SCENES.length) % SCENES.length;
    $$('.show-slide', stage).forEach(function (d, i) { d.classList.toggle('on', i === si); });
    $$('button', rail).forEach(function (b, i) {
      b.setAttribute('aria-current', String(i === si));
      if (i === si) { var s = b.firstChild; s.style.animation = 'none'; void s.offsetWidth; s.style.animation = ''; }
    });
  }
  function run() { clearInterval(timer); if (!reduced) timer = setInterval(function () { goTo(si + 1); }, 7000); }
  $$('button', rail).forEach(function (b, i) { b.onclick = function () { goTo(i); run(); }; });
  $('.show').addEventListener('mouseenter', function () { clearInterval(timer); });
  $('.show').addEventListener('mouseleave', run);
  run();

  /* — the campaign pair: a gentler push-in on each frame — */
  var pairs = $$('[data-dolly2]');
  if (pairs.length && !reduced) {
    var pt = false;
    function pushPair() {
      pt = false;
      pairs.forEach(function (n) {
        var r = n.getBoundingClientRect(), span = r.height + innerHeight;
        var p = Math.max(0, Math.min(1, (innerHeight - r.top) / span));
        n.firstElementChild.style.transform = 'scale(' + (1.04 + p * 0.12) + ')';
      });
    }
    addEventListener('scroll', function () { if (!pt) { pt = true; setTimeout(pushPair, 16); } }, { passive: true });
    addEventListener('resize', pushPair);
    pushPair();
    setTimeout(pushPair, 400);
  }

  /* — dolly zoom: the frame pushes in as the band passes — */
  var dolly = $('[data-dolly]');
  if (dolly && !reduced) {
    var tick = false;
    function push() {
      tick = false;
      var band = dolly.parentElement.getBoundingClientRect();
      var span = band.height + innerHeight;
      var p = Math.max(0, Math.min(1, (innerHeight - band.top) / span));
      dolly.style.transform = 'scale(' + (1.02 + p * 0.16) + ') translateY(' + ((p - .5) * -26) + 'px)';
    }
    addEventListener('scroll', function () { if (!tick) { tick = true; setTimeout(push, 16); } }, { passive: true });
    push();
  }

  window.NisaRepaint = function () { setHero(picks.filter(function (p, i) { return $$('button', sw)[i].getAttribute('aria-pressed') === 'true'; })[0] || picks[0]); };
};
