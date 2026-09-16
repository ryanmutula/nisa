'use client';

/* The brass ring that trails the pointer and swells over anything
   clickable. Off on touch devices — there is no pointer to trail — and
   off when the visitor has asked for less motion. */

import { useEffect } from 'react';

export default function Cursor() {
  useEffect(() => {
    if (matchMedia('(hover: none)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ring = document.createElement('div');
    ring.className = 'cur';
    const dot = document.createElement('div');
    dot.className = 'cur-dot';
    document.body.append(ring, dot);
    document.body.classList.add('cur-on');

    let tx = innerWidth / 2;
    let ty = innerHeight / 2;
    let rx = tx;
    let ry = ty;
    let frame = 0;

    function onMove(e: MouseEvent) {
      tx = e.clientX;
      ty = e.clientY;
      dot.style.transform = `translate(${tx}px,${ty}px)`;
      const hot = (e.target as Element | null)?.closest?.(
        'a,button,select,input,textarea,[role=button],.card,.fam-tile'
      );
      document.body.classList.toggle('cur-hot', Boolean(hot));
    }
    function onOut(e: MouseEvent) {
      if (!e.relatedTarget) document.body.classList.add('cur-hide');
    }
    function onOver() {
      document.body.classList.remove('cur-hide');
    }

    addEventListener('mousemove', onMove, { passive: true });
    addEventListener('mouseout', onOut);
    addEventListener('mouseover', onOver);

    (function loop() {
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      frame = requestAnimationFrame(loop);
    })();

    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('mousemove', onMove);
      removeEventListener('mouseout', onOut);
      removeEventListener('mouseover', onOver);
      document.body.classList.remove('cur-on', 'cur-hot', 'cur-hide');
      ring.remove();
      dot.remove();
    };
  }, []);

  return null;
}
