'use client';

/* One note a month. */

import EnquiryForm from '../EnquiryForm';

export default function Newsletter() {
  return (
    <EnquiryForm kind="newsletter" submitLabel="Join the list" data-r>
      <div className="field">
        <label htmlFor="nl-name">Name</label>
        <input className="in" id="nl-name" name="name" required autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="nl-mail">Email</label>
        <input
          className="in"
          id="nl-mail"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </div>
      <p className="small muted" style={{ marginTop: 12 }}>
        No resale of your details, ever. Unsubscribe in one click.
      </p>
    </EnquiryForm>
  );
}
