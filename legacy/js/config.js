/* NISA — site configuration. Change these values, nothing else. */
window.NISA = {
  phone: '+254 757 107862',
  phoneRaw: '254757107862',            // used for tel: and WhatsApp links
  email: 'info@nisaparfums.com',
  hours: 'Mon–Fri 8am–6pm · Sat–Sun 9am–4pm',
  instagram: 'https://instagram.com/nisaparfums',

  /* Form delivery. Create a free endpoint at https://web3forms.com (or
     Formspree) and paste the key below. While it is empty every form falls
     back to WhatsApp, so nothing is ever lost. */
  formEndpoint: 'https://api.web3forms.com/submit',
  formKey: '',                          // ← paste your access key here

  /* The currency a first-time visitor sees. Prices are still stored in KES
     (see catalog.js) — this only picks which market the header switcher
     starts on. Use any code from the list below. */
  defaultMarket: 'US',

  /* Markets. Prices live once, in KES; these rates convert on the fly. */
  markets: [
    { code: 'KE', country: 'Kenya',    currency: 'KES',  symbol: 'KSh', rate: 1,      flag: '🇰🇪', delivery: 'Nairobi next day · countrywide 2–3 days' },
    { code: 'UG', country: 'Uganda',   currency: 'UGX',  symbol: 'USh', rate: 28.4,   flag: '🇺🇬', delivery: 'Kampala 3–4 days' },
    { code: 'TZ', country: 'Tanzania', currency: 'TZS',  symbol: 'TSh', rate: 19.6,   flag: '🇹🇿', delivery: 'Dar es Salaam 3–5 days' },
    { code: 'RW', country: 'Rwanda',   currency: 'RWF',  symbol: 'FRw', rate: 10.2,   flag: '🇷🇼', delivery: 'Kigali 3–4 days' },
    { code: 'ZM', country: 'Zambia',   currency: 'ZMW',  symbol: 'K',   rate: 0.19,   flag: '🇿🇲', delivery: 'Lusaka 5–7 days' },

    /* Currency-only entries: they appear in the header switcher so an
       international visitor can read the price in a familiar unit, but they
       are not delivery markets, so they stay out of the availability filter,
       the checkout country list and the delivery tables. Update the rates
       whenever you refresh the African ones. */
    { code: 'US', country: 'United States', currency: 'USD', symbol: '$',  rate: 0.0078, flag: '🇺🇸', currencyOnly: true },
    { code: 'EU', country: 'Eurozone',      currency: 'EUR', symbol: '€',  rate: 0.0071, flag: '🇪🇺', currencyOnly: true },
    { code: 'IN', country: 'India',         currency: 'INR', symbol: '₹',  rate: 0.64,   flag: '🇮🇳', currencyOnly: true }
  ],

  freeDeliveryOver: 15000,               // KES

  /* Discount codes. Add, change or remove freely; the checkout reads this
     list. Codes are visible in the page source, so use them for public
     promotions, not for anything that must stay secret. */
  coupons: {
    WELCOME10:  { pct: 10, label: '10% off your first order' },
    ATTAR15:    { pct: 15, label: '15% off the attar library', family: 'oud' },
    FREEDROP:   { pct: 0,  label: 'Free delivery, any order', freeDelivery: true }
  }
};
