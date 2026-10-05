# -*- coding: utf-8 -*-
"""The ten houses the Maven-listed shelf is built from.

Seven came across from the old catalogue with their copy intact. Xerjoff
replaces the Casamorati sub-house entry, because the sheet lists the main
line; Ormonde Jayne, Tiziana Terenzi and Atelier des Ors are new.
"""
HOUSES = {
 'pdm': dict(name='Parfums de Marly', origin='Paris, France', founded=2009,
   tagline='The elegance of 18th-century Versailles',
   blurb='Inspired by the equestrian culture of the court of Louis XV, Parfums de Marly is the '
         'house behind Layton, Delina and Althaïr — some of the most requested fragrances in '
         'East Africa today.',
   hero='pdm-layton'),
 'nishane': dict(name='Nishane', origin='Istanbul, Türkiye', founded=2012,
   tagline='Istanbul’s first niche house',
   blurb='Nishane bottles Istanbul’s dual soul: Ottoman opulence and modern minimalism, always '
         'as extrait de parfum. Hacivat and Ani are cult objects among collectors.',
   hero='nishane-hacivat'),
 'roja': dict(name='Roja Parfums', origin='London, United Kingdom', founded=2011,
   tagline='The finest ingredients on earth',
   blurb='Roja Dove’s London house is unapologetically opulent — hand-finished bottles, '
         'Swarovski-set caps and formulas built on the world’s rarest raw materials.',
   hero='roja-elysium-pour-homme'),
 'mancera': dict(name='Mancera', origin='Paris, France', founded=2008,
   tagline='Parisian intensity, Nairobi longevity',
   blurb='Pierre Montale’s sister house delivers the performance our customers ask for first: '
         'dense, long-lasting compositions that hold up in Mombasa heat and Kigali evenings alike.',
   hero='mancera-cedrat-boise'),
 'montale': dict(name='Montale', origin='Paris, France', founded=2003,
   tagline='Paris meets the Arabian oud tradition',
   blurb='Pierre Montale spent years composing for the royal families of the Gulf before '
         'returning to Paris. His aluminium bottles guard some of the most beloved oud and rose '
         'compositions in the world.',
   hero='montale-black-aoud'),
 'initio': dict(name='Initio Parfums Privés', origin='Paris, France', founded=2015,
   tagline='Scent as a private ritual',
   blurb='Initio designs fragrance around the science of attraction — musks, ouds and absolutes '
         'engineered to leave a trail. Oud for Greatness is one of the most re-ordered bottles '
         'we carry.',
   hero='initio-oud-for-greatness'),
 'xerjoff': dict(name='Xerjoff', origin='Turin, Italy', founded=2003,
   tagline='Italian perfumery without a ceiling',
   blurb='Sergio Momo’s Turin house works at the top of the market and makes no secret of it: '
         'Sicilian citrus, Indian oud and Bulgarian rose in bottles finished like jewellery. '
         'Erba Pura and Naxos are the ones that leave the shelf fastest.',
   hero='xerjoff-erba-pura'),
 'oj': dict(name='Ormonde Jayne', origin='London, United Kingdom', founded=2002,
   tagline='Mayfair, by way of the spice road',
   blurb='Linda Pilkington composes from her Mayfair atelier using materials most houses will '
         'not price — black hemlock, champaca, oudh from Assam. Quiet bottles, long compositions, '
         'and a following that buys nothing else.',
   hero='oj-ormonde-woman'),
 'tiziana': dict(name='Tiziana Terenzi', origin='Fivizzano, Italy', founded=1968,
   tagline='Three generations of Tuscan candlemakers',
   blurb='The Terenzi family made candles in Tuscany for decades before turning to perfume. '
         'Everything is extrait strength, named after a star, and built to last a full day on '
         'skin without being refreshed.',
   hero='tiziana-kirke'),
 'ado': dict(name='Atelier des Ors', origin='Paris, France', founded=2013,
   tagline='Gold leaf in the bottle, and in the formula',
   blurb='Jean-Pierre Bethouart’s Paris house suspends flakes of gold leaf in every flacon and '
         'composes at extrait concentrations. Modern, generous, and the least-known of the '
         'houses we carry — which is exactly why we carry it.',
   hero='ado-rose-omeyyade'),
}

FAMILIES = [
 ('oud','Oud & Incense'), ('amber','Amber & Spice'), ('floral','Floral'), ('woody','Woody'),
 ('citrus','Citrus'), ('fresh','Fresh & Aquatic'), ('gourmand','Gourmand'),
 ('leather','Leather & Suede'), ('musk','Musk & Skin'),
]
