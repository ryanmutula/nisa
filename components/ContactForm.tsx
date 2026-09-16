'use client';

import EnquiryForm from './EnquiryForm';

const TOPICS = [
  'A recommendation',
  'An existing order',
  'Something you do not list',
  'Wholesale or stockist',
  'Something else'
];

export default function ContactForm() {
  return (
    <EnquiryForm kind="contact" submitLabel="Send" data-r>
      <h2 className="d3">Send us a note</h2>

      <div className="grid cols-2" style={{ gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
        <div className="field">
          <label htmlFor="c-name">Name</label>
          <input className="in" id="c-name" name="name" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="c-mail">Email</label>
          <input
            className="in"
            id="c-mail"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
          />
        </div>
      </div>

      <div className="grid cols-2" style={{ gap: 'var(--space-4)' }}>
        <div className="field">
          <label htmlFor="c-tel">Phone or WhatsApp</label>
          <input className="in" id="c-tel" name="phone" type="tel" autoComplete="tel" inputMode="tel" />
        </div>
        <div className="field">
          <label htmlFor="c-about">What it is about</label>
          <select className="in" id="c-about" name="topic">
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="c-msg">Your message</label>
        <textarea className="in" id="c-msg" name="message" required />
      </div>
    </EnquiryForm>
  );
}
