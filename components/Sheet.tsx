'use client';

/* The mechanics every drawer and dialog shares: mount, let one frame pass
   so the entry transition has somewhere to travel from, and on close play
   the exit before unmounting. The old site did this by appending a node
   and adding `.on`; this is the same two steps, held in a hook.

   It also does what a modal owes a keyboard: focus moves inside on open,
   Tab cycles within, and focus returns to whatever opened it. */

import { useEffect, useRef, useState, type ReactNode } from 'react';

import { CloseIcon } from './icons';

export function useSheet(open: boolean, exitMs = 560) {
  const [mounted, setMounted] = useState(open);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => setOn(true));
      return () => cancelAnimationFrame(frame);
    }
    setOn(false);
    const timer = setTimeout(() => setMounted(false), exitMs);
    return () => clearTimeout(timer);
  }, [open, exitMs]);

  return { mounted, on };
}

const FOCUSABLE =
  'a[href],button:not([disabled]),select,textarea,input:not([type=hidden]),[tabindex]:not([tabindex="-1"])';

/** Keeps Tab inside `ref`, and gives focus back when it unmounts. */
export function useFocusTrap(ref: React.RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;

    const opener = document.activeElement as HTMLElement | null;
    const first = node.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? node).focus({ preventScroll: true });

    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      const items = Array.from(node!.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null
      );
      if (!items.length) return;
      const edge = e.shiftKey ? items[0] : items[items.length - 1];
      if (document.activeElement === edge) {
        e.preventDefault();
        (e.shiftKey ? items[items.length - 1] : items[0]).focus();
      }
    }

    node.addEventListener('keydown', onKey);
    return () => {
      node.removeEventListener('keydown', onKey);
      opener?.focus?.({ preventScroll: true });
    };
  }, [ref, active]);
}

export function Scrim({ on, onClose }: { on: boolean; onClose: () => void }) {
  return (
    <div
      className={`scrim${on ? ' on' : ''}`}
      style={{ display: 'block' }}
      onClick={onClose}
      aria-hidden="true"
    />
  );
}

export function CloseButton({ onClose, label = 'Close' }: { onClose: () => void; label?: string }) {
  return (
    <button className="ib x" type="button" aria-label={label} onClick={onClose}>
      <CloseIcon />
    </button>
  );
}

/** A right-hand drawer: the bag and the saved list. */
export function Drawer({
  open,
  onClose,
  label,
  children
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}) {
  const { mounted, on } = useSheet(open);
  const ref = useRef<HTMLElement>(null);
  useFocusTrap(ref, mounted && on);

  if (!mounted) return null;

  return (
    <>
      <Scrim on={on} onClose={onClose} />
      <aside
        ref={ref}
        className={`sheet drawer${on ? ' on' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
      >
        {children}
      </aside>
    </>
  );
}

/** A centred dialog: quick view, search, the comparison table. */
export function Dialog({
  open,
  onClose,
  label,
  width,
  children
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  width?: string;
  children: ReactNode;
}) {
  const { mounted, on } = useSheet(open);
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, mounted && on);

  if (!mounted) return null;

  return (
    <>
      <Scrim on={on} onClose={onClose} />
      <div
        ref={ref}
        className={`sheet qv${on ? ' on' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        style={width ? { width } : undefined}
        tabIndex={-1}
      >
        {children}
      </div>
    </>
  );
}
