'use client';

/* ═══════════════════════════════════════════════════════════════════
   The opening film.

   Drop a clip in at public/video/logo.mp4 and it plays on arrival:
   full-screen, with a progress hairline, an unmute button and a Skip.
   When it ends a gilt bloom opens from where the header mark will land,
   the frame flies into the header at the header's own size, and the page
   rises up through it.

   · Where it goes:   public/video/logo.mp4 (or logo.webm).
   · If it is absent: the intro is skipped silently and the page loads
     normally. The curtain only goes up once a film is decodable, so a
     missing or broken clip never blanks the page.
   · How often:       once per visit (a sessionStorage flag). Swap that
     for localStorage below to make it once per visitor.
   · Replay:          add ?intro=1 to the address.
   · Skip:            the button, a click anywhere, Escape or space.
   ═══════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useRef, useState } from 'react';

import { MuteIcon, UnmuteIcon } from './icons';

/* The clip's picture ends before the file does — stop here rather than
   sitting on its trailing black frames. Set to null to play to the end. */
const END_AT: number | null = 4.82;

/* First that loads wins. Drop your own film in at video/logo.mp4 and it
   takes over; the bundled clip is only the stand-in until you do. */
const SOURCES = ['/video/logo.mp4', '/video/logo.webm', '/assets/video/nisa-intro.mp4'];

function isPhone() {
  return (
    matchMedia('(max-width: 720px)').matches ||
    (matchMedia('(pointer: coarse)').matches && matchMedia('(max-width: 1024px)').matches)
  );
}

export default function Intro() {
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [muted, setMuted] = useState(true);
  const [skipLabel, setSkipLabel] = useState('Skip');
  const [progress, setProgress] = useState(0);

  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sourceIndex = useRef(-1);
  const done = useRef(false);

  /* ── should it run at all? ─────────────────────────────────────── */
  useEffect(() => {
    const replay = /[?&]intro=1/.test(location.search);
    if (!replay) {
      if (isPhone()) return;
      /* Once per VISIT: on a fresh arrival, not on every reload. Swap
         sessionStorage for localStorage to make it once per visitor; drop
         both lines to make it every load. */
      try {
        if (sessionStorage.getItem('nisa:intro')) return;
        sessionStorage.setItem('nisa:intro', '1');
      } catch {
        /* no storage: play it, once, this load */
      }
    }
    setArmed(true);
  }, []);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;

    const v = videoRef.current;
    v?.pause();

    const head = document.getElementById('head-mark');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (head && v && !reduced && typeof head.animate === 'function') {
      /* A gilt bloom opens from where the mark will land, the frame flies
         into the header at the header's own size, and the page rises up
         through it. */
      const r = head.getBoundingClientRect();
      const vb = v.getBoundingClientRect();
      const bloom = boxRef.current?.querySelector<HTMLElement>('.bloom');
      if (bloom) {
        bloom.style.left = `${r.left + r.width / 2}px`;
        bloom.style.top = `${r.top + r.height / 2}px`;
      }
      if (vb.width && vb.height) {
        const s = Math.max(r.width / vb.width, r.height / vb.height);
        const tx = r.left + r.width / 2 - (vb.left + vb.width / 2);
        const ty = r.top + r.height / 2 - (vb.top + vb.height / 2);
        v.style.transform = `translate(${tx}px,${ty}px) scale(${s})`;
      }
      head.animate(
        [
          { transform: 'scale(.72)', opacity: 0.35, filter: 'brightness(1.8)' },
          { transform: 'scale(1.1)', opacity: 1, filter: 'brightness(1.25)', offset: 0.62 },
          { transform: 'scale(1)', opacity: 1, filter: 'none' }
        ],
        { duration: 1250, easing: 'cubic-bezier(.22,1,.36,1)', delay: 520 }
      );
    }

    setLeaving(true);
    document.documentElement.classList.remove('intro-on');
    setTimeout(() => setArmed(false), 1300);
  }, []);

  /* ── play it ───────────────────────────────────────────────────── */
  useEffect(() => {
    if (!armed) return;
    const v = videoRef.current;
    if (!v) return;

    /* Try it as it was made — with audio. Every browser blocks that until
       the visitor has interacted with the page, so on refusal we fall back
       to muted and offer a one-tap unmute. */
    function withSound() {
      v!.muted = false;
      setMuted(false);
      v!.play()
        .catch(() => {
          v!.muted = true;
          setMuted(true);
          return v!.play();
        })
        .catch(waitForTap);
    }

    function waitForTap() {
      if (done.current) return;
      setSkipLabel('Tap to play');
      (['pointerdown', 'keydown'] as const).forEach((ev) => {
        addEventListener(
          ev,
          () => {
            v?.play().catch(() => undefined);
          },
          { once: true }
        );
      });
    }

    function nextSource() {
      sourceIndex.current += 1;
      if (sourceIndex.current >= SOURCES.length) {
        finish();
        return;
      }
      v!.src = SOURCES[sourceIndex.current];
      v!.load();
      withSound();
    }

    function onError() {
      if (!done.current) nextSource();
    }

    function onLoaded() {
      /* The curtain only goes up once a film is actually decodable, so a
         missing or broken file never blanks the page. */
      if (done.current) return;
      document.documentElement.classList.add('intro-on');
      setVisible(true);
    }

    function onTime() {
      const end = END_AT ?? v!.duration ?? 0;
      if (end) setProgress(Math.min(100, (v!.currentTime / end) * 100));
      if (END_AT && v!.currentTime >= END_AT) finish();
    }

    v.addEventListener('error', onError);
    v.addEventListener('loadeddata', onLoaded);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('ended', finish);
    nextSource();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' || e.key === ' ') finish();
    }
    addEventListener('keydown', onKey);

    /* Nothing decodable within twelve seconds — get out of the way. */
    const bail = setTimeout(() => {
      if (!done.current && v.readyState < 2) finish();
    }, 12000);

    return () => {
      v.removeEventListener('error', onError);
      v.removeEventListener('loadeddata', onLoaded);
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('ended', finish);
      removeEventListener('keydown', onKey);
      clearTimeout(bail);
      document.documentElement.classList.remove('intro-on');
    };
  }, [armed, finish]);

  if (!armed) return null;

  return (
    <div
      id="intro"
      ref={boxRef}
      className={leaving ? 'out' : undefined}
      style={{ opacity: visible ? 1 : 0, transition: 'opacity .3s' }}
      onClick={finish}
    >
      <video ref={videoRef} muted playsInline autoPlay preload="auto" />
      <div className="vig" />
      <div className="bloom" />
      <div className="bar" style={{ width: `${progress}%` }} />
      <button
        className={`sound${muted ? ' nudge' : ''}`}
        type="button"
        aria-label={muted ? 'Turn the sound on' : 'Turn the sound off'}
        onClick={(e) => {
          e.stopPropagation();
          const v = videoRef.current;
          if (!v) return;
          v.muted = !v.muted;
          setMuted(v.muted);
          if (!v.muted) v.play().catch(() => undefined);
        }}
      >
        {muted ? <MuteIcon /> : <UnmuteIcon />}
      </button>
      <button className="skip" type="button" onClick={finish}>
        {skipLabel}
      </button>
    </div>
  );
}
