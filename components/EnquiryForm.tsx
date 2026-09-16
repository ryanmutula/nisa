'use client';

/* Contact, wholesale and newsletter all post to one place.

   Put a Web3Forms (or Formspree) access key in NEXT_PUBLIC_FORM_KEY and
   they go there. Until you do, nothing breaks: every form falls back to a
   prefilled WhatsApp message, which is a legitimate way to trade here —
   many customers prefer it. */

import { useState, type ReactNode } from 'react';

import { config } from '@/lib/config';
import { whatsAppUrl } from '@/lib/routes';

type State =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'fallback'; href: string };

export default function EnquiryForm({
  kind,
  children,
  submitLabel,
  footnote,
  ...rest
}: {
  /** Names the enquiry in the subject line: contact, wholesale, newsletter. */
  kind: string;
  children: ReactNode;
  submitLabel: string;
  footnote?: ReactNode;
} & React.FormHTMLAttributes<HTMLFormElement>) {
  const [state, setState] = useState<State>({ kind: 'idle' });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    /* The honeypot: a field no person can see, so anything in it is a bot. */
    const data: Record<string, string> = {};
    new FormData(form).forEach((v, k) => {
      data[k] = String(v);
    });
    if (data.botcheck) return;
    delete data.botcheck;

    function whatsAppFallback() {
      const lines = Object.entries(data)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`);
      const text = `${kind === 'wholesale' ? 'Trade enquiry' : 'Enquiry'} via nisaparfums.com\n\n${lines.join('\n')}`;
      setState({ kind: 'fallback', href: whatsAppUrl(config.phoneRaw, text) });
    }

    if (!config.formKey) {
      whatsAppFallback();
      return;
    }

    setState({ kind: 'sending' });
    try {
      const res = await fetch(config.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...data,
          access_key: config.formKey,
          subject: `Nisa — ${kind}`
        })
      });
      const body = (await res.json()) as { success?: boolean };
      if (body.success) {
        form.reset();
        setState({ kind: 'sent' });
      } else {
        whatsAppFallback();
      }
    } catch {
      whatsAppFallback();
    }
  }

  return (
    <form {...rest} onSubmit={onSubmit} noValidate={false}>
      {children}

      <div className="hp">
        <label htmlFor={`bot-${kind}`}>Leave this empty</label>
        <input id={`bot-${kind}`} name="botcheck" tabIndex={-1} aria-hidden="true" />
      </div>

      <button className="b gold" type="submit" disabled={state.kind === 'sending'}>
        <span>{state.kind === 'sending' ? 'Sending…' : submitLabel}</span>
      </button>

      {footnote}

      <div style={{ marginTop: 14 }} aria-live="polite">
        {state.kind === 'sent' && (
          <p className="note" style={{ margin: 0 }}>
            Thank you — we have it. Expect a reply within one working day.
          </p>
        )}
        {state.kind === 'fallback' && (
          <p className="note" style={{ margin: 0 }}>
            Our form service is not connected yet —{' '}
            <a href={state.href} target="_blank" rel="noopener">
              send this to us on WhatsApp instead
            </a>
            , or email <a href={`mailto:${config.email}`}>{config.email}</a>.
          </p>
        )}
      </div>
    </form>
  );
}
