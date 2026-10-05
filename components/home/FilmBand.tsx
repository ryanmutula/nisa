'use client';

/* The film band: portrait footage shown whole, beside its copy.

   It loops muted with visible pause and unmute controls, and pauses
   itself when scrolled out of view so it costs nothing while you read
   the rest of the page. */

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { shopUrl } from '@/lib/routes';

import { MuteIcon, PauseIcon, PlayIcon, UnmuteIcon } from '../icons';

export default function FilmBand() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    function play() {
      v!.play().catch(() => undefined);
    }
    /* Start it directly rather than waiting on an observer, which is
       throttled or inert in some embedding contexts; the observer below
       is only the optimisation that pauses it off screen. */
    play();

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('canplay', () => {
      if (v.paused) play();
    });

    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver === 'function') {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) play();
            else if (!v.paused) v.pause();
          });
        },
        { threshold: 0.25 }
      );
      io.observe(v);
    }

    return () => {
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      io?.disconnect();
    };
  }, []);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => undefined);
    else v.pause();
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  return (
    <section className="filmrow dark" id="film">
      <div className="wrap filmrow-in">
        <div className="filmframe" data-r="scale">
          <video
            ref={videoRef}
            src="/assets/video/nisa-feature.mp4"
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="A Nishane fragrance, held"
          />
          <div className="vctl">
            <button
              type="button"
              aria-label={playing ? 'Pause the film' : 'Play the film'}
              onClick={togglePlay}
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button
              type="button"
              aria-label={muted ? 'Unmute the film' : 'Mute the film'}
              onClick={toggleMute}
            >
              {muted ? <MuteIcon /> : <UnmuteIcon />}
            </button>
          </div>
        </div>

        <div data-r>
          <p className="kicker" data-s="1">
            Worn, not displayed
          </p>
          <h2 className="d2" data-s="2">
            A bottle is only half of it.
            <br />
            The rest is the person wearing it.
          </h2>
          <p
            className="lead"
            data-s="3"
            style={{ marginTop: 'var(--space-4)', color: 'rgba(239,236,230,.82)' }}
          >
            Ten houses, from Istanbul to London to Turin — chosen for what they do on skin in
            this climate, not for what they do on a shelf.
          </p>
          <div style={{ marginTop: 'var(--space-6)' }} data-s="4">
            <Link className="b light" href={shopUrl({ brand: 'nishane' })}>
              <span>Shop Nishane</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
