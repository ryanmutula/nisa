'use client';

/* ═══════════════════════════════════════════════════════════════════
   The scent advisor.

   A short conversation instead of a filter panel: who it is for, what
   they already reach for, how loud they want it, what they can spend,
   and anything they already love. It scores the catalogue and explains
   why each bottle came back. No server, no tracking — the answers never
   leave the browser.
   ═══════════════════════════════════════════════════════════════════ */

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { allNotes, asset, families, products } from '@/lib/catalog';
import { productUrl, shopUrl } from '@/lib/routes';
import type { Product } from '@/lib/types';

import { useIsPhone } from './hooks';
import { CloseIcon, SparkIcon } from './icons';
import { useSheet } from './Sheet';
import { useStore } from './store';

type Loud = 'quiet' | 'mid' | 'loud' | '';

interface Answers {
  forWho: string;
  fams: string[];
  loud: Loud;
  budget: number;
  loves: string;
}

const BLANK: Answers = { forWho: '', fams: [], loud: '', budget: 0, loves: '' };

const LOUD_RANK: Record<string, string[]> = {
  quiet: ['eau de toilette', 'eau de parfum'],
  mid: ['eau de parfum'],
  loud: ['extrait', 'parfum']
};

interface Hit {
  p: Product;
  why: string[];
}

export default function Advisor() {
  const { advisorOpen, setAdvisorOpen, money, addToBag } = useStore();
  const isPhone = useIsPhone();
  const { mounted, on } = useSheet(advisorOpen, 460);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(BLANK);
  const [results, setResults] = useState<Hit[] | null>(null);

  const steps = useMemo(
    () => [
      {
        q: 'Who are we buying for?',
        key: 'forWho' as const,
        type: 'one' as const,
        opts: [
          ['me', 'Myself'],
          ['gift', 'A gift for someone']
        ] as [string, string][]
      },
      {
        q: 'What do you already reach for?',
        key: 'fams' as const,
        type: 'many' as const,
        hint: 'Pick as many as feel right.',
        opts: families.map((f) => [f.slug, f.label]) as [string, string][]
      },
      {
        q: 'How loud should it be?',
        key: 'loud' as const,
        type: 'one' as const,
        opts: [
          ['quiet', 'Close to the skin'],
          ['mid', 'Noticed in a room'],
          ['loud', 'A statement']
        ] as [string, string][]
      },
      {
        q: 'What are you comfortable spending?',
        key: 'budget' as const,
        type: 'one' as const,
        /* The figures are converted, so they follow the header switcher. */
        /* The shelf runs from about KSh 12,000 to 135,000, so the brackets
           have to reach further up than they used to. */
        opts: [
          ['20000', `Up to ${money(20000)}`],
          ['40000', `Up to ${money(40000)}`],
          ['80000', `Up to ${money(80000)}`],
          ['0', 'No limit']
        ] as [string, string][]
      },
      {
        q: 'Anything you already love?',
        key: 'loves' as const,
        type: 'text' as const,
        hint: 'A name or a note — Layton, oud, vanilla. Skip if nothing comes to mind.'
      }
    ],
    [money]
  );

  function close() {
    setAdvisorOpen(false);
  }

  function restart() {
    setAnswers(BLANK);
    setResults(null);
    setStep(0);
  }

  function score(a: Answers): Hit[] {
    const loves = a.loves.toLowerCase().trim();
    let lovedNotes: string[] = [];
    if (loves) {
      const named = products.find(
        (p) => loves.includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(loves)
      );
      lovedNotes = named
        ? allNotes(named).map((n) => n.toLowerCase())
        : loves.split(/[ ,]+/).filter(Boolean);
    }

    const scored = products
      .map((p) => {
        let sc = 0;
        const why: string[] = [];

        if (a.fams.includes(p.family)) {
          sc += 4;
          why.push(`it is ${p.familyLabel.toLowerCase()}`);
        }

        const conc = p.concentration.toLowerCase();
        if ((LOUD_RANK[a.loud] ?? []).some((c) => conc.includes(c))) {
          sc += 2;
          why.push(a.loud === 'loud' ? 'it is a high concentration' : 'it wears close');
        }

        if (a.budget) {
          if (p.sizes[0].price <= a.budget) sc += 2;
          else sc -= 6;
        }

        const notes = allNotes(p).map((n) => n.toLowerCase());
        const shared = lovedNotes.filter(
          (n) => n.length > 2 && notes.some((x) => x.includes(n))
        );
        if (shared.length) {
          sc += shared.length * 2;
          why.push(`it shares ${shared.slice(0, 3).join(', ')} with what you named`);
        }

        if ((p.tags ?? []).includes('bestseller')) sc += 1;
        if (a.forWho === 'gift' && (p.tags ?? []).includes('signature')) {
          sc += 1;
          why.push('it gives well');
        }

        return { p, sc, why };
      })
      .filter((r) => r.sc > 0)
      .sort((x, y) => y.sc - x.sc)
      .slice(0, 3);

    if (scored.length) return scored.map(({ p, why }) => ({ p, why }));

    /* Nothing scored: fall back to what the region is buying rather than
       telling someone their taste does not exist. */
    return products
      .filter((p) => (p.tags ?? []).includes('bestseller'))
      .slice(0, 3)
      .map((p) => ({ p, why: ['it is what the region is wearing'] }));
  }

  function next() {
    if (step === steps.length - 1) {
      setResults(score(answers));
      return;
    }
    setStep((s) => s + 1);
  }

  function choose(key: keyof Answers, raw: string, type: 'one' | 'many') {
    setAnswers((prev) => {
      if (type === 'many') {
        const list = prev.fams.includes(raw)
          ? prev.fams.filter((x) => x !== raw)
          : [...prev.fams, raw];
        return { ...prev, fams: list };
      }
      if (key === 'budget') return { ...prev, budget: Number(raw) };
      if (key === 'loud') return { ...prev, loud: raw as Loud };
      return { ...prev, [key]: raw } as Answers;
    });
    if (type === 'one') setTimeout(next, 220);
  }

  const launcher = !isPhone && (
    <button className="bot-fab" type="button" aria-label="Ask the scent advisor" onClick={() => setAdvisorOpen(true)}>
      <SparkIcon />
      <span>Find my scent</span>
    </button>
  );

  if (!mounted) return <>{launcher}</>;

  const s = steps[step];

  return (
    <>
      {launcher}
      <div className={`bot${on ? ' on' : ''}`} role="dialog" aria-label="Scent advisor">
        <div className="bot-head">
          <div>
            <strong>The scent advisor</strong>
            <span className="muted small" style={{ display: 'block' }}>
              {results ? 'Three to start with' : `Question ${step + 1} of ${steps.length}`}
            </span>
          </div>
          <button className="ib" type="button" aria-label="Close" onClick={close}>
            <CloseIcon />
          </button>
        </div>

        {results ? (
          <>
            <div className="bot-body bot-res">
              {results.map(({ p, why }) => (
                <div className="bot-hit" key={p.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(p.thumb)} alt="" />
                  <div>
                    <span className="small muted">{p.brand}</span>
                    <strong
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-heading)',
                        fontSize: 20,
                        fontWeight: 400
                      }}
                    >
                      {p.name}
                    </strong>
                    <span className="small muted num">from {money(p.sizes[0].price)}</span>
                    <p className="small" style={{ margin: '6px 0 8px' }}>
                      Because {why.slice(0, 2).join(', and ')}.
                    </p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button
                        className="b sm"
                        type="button"
                        onClick={(e) => addToBag(p.id, null, 1, e.currentTarget)}
                      >
                        <span>Add to bag</span>
                      </button>
                      <Link className="lnk" href={productUrl(p.id)} onClick={close}>
                        Detail
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bot-foot">
              <button
                className="lnk"
                type="button"
                style={{ background: 'none', border: 0, cursor: 'pointer' }}
                onClick={restart}
              >
                Start again
              </button>
              <Link
                className="b fill sm"
                href={shopUrl(answers.fams.length ? { family: answers.fams } : {})}
                onClick={close}
              >
                <span>See the whole shelf</span>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="bot-body">
              <p className="bot-q">{s.q}</p>
              {'hint' in s && s.hint && (
                <p className="muted small" style={{ margin: '-6px 0 12px' }}>
                  {s.hint}
                </p>
              )}

              {s.type === 'text' ? (
                <input
                  className="in"
                  placeholder="e.g. Layton, or oud and vanilla"
                  autoComplete="off"
                  aria-label={s.q}
                  value={answers.loves}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, loves: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') next();
                  }}
                />
              ) : (
                <div className="bot-opts">
                  {s.opts.map(([value, label]) => {
                    const pressed =
                      s.type === 'many'
                        ? answers.fams.includes(value)
                        : s.key === 'budget'
                          ? answers.budget === Number(value)
                          : answers[s.key] === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={pressed}
                        onClick={() => choose(s.key, value, s.type)}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bot-foot">
              {step ? (
                <button
                  className="lnk"
                  type="button"
                  style={{ background: 'none', border: 0, cursor: 'pointer' }}
                  onClick={() => setStep((v) => v - 1)}
                >
                  Back
                </button>
              ) : (
                <span />
              )}
              <button className="b fill sm" type="button" onClick={next}>
                <span>{step === steps.length - 1 ? 'Show me' : 'Next'}</span>
              </button>
            </div>

            <div className="bot-rail">
              <span style={{ transform: `scaleX(${(step + 1) / steps.length})` }} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
