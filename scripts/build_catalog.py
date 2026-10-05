# -*- coding: utf-8 -*-
"""picks.json (+ whatever the scrape has filled in) -> lib/catalog.json

Image paths point at real files where the file exists and at the shared
placeholder plate otherwise, so the shelf looks deliberate rather than
broken while imagery is still being collected. Re-run after a scrape and
the paths move to the real art on their own.
"""
import json, os, re, importlib.util, collections, html, sys

REPO = '/home/user/nisa'
IMGDIR = os.path.join(REPO, 'public/assets/img/products')
PLACEHOLDER = 'assets/img/products/_placeholder'

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('h', os.path.join(HERE, 'houses.py'))
H = importlib.util.module_from_spec(spec); spec.loader.exec_module(H)

picks = json.load(open(os.path.join(HERE, 'picks.json')))

# Notes and descriptions scraped from the storefront, if that has run.
scraped = {}
if os.path.exists(os.path.join(HERE, 'scraped_copy.json')):
    scraped = json.load(open(os.path.join(HERE, 'scraped_copy.json')))

def img_paths(pid):
    """Real art if it is on disk, otherwise the placeholder plate."""
    sq = f'{pid}-sq.webp'
    if os.path.exists(os.path.join(IMGDIR, sq)):
        small = f'{pid}-sq-sm.webp'
        cut = f'{pid}-cut.webp'
        return {
            'image': f'assets/img/products/{sq}',
            'thumb': f'assets/img/products/{small}'
                     if os.path.exists(os.path.join(IMGDIR, small))
                     else f'assets/img/products/{sq}',
            'cutout': f'assets/img/products/{cut}'
                      if os.path.exists(os.path.join(IMGDIR, cut)) else None,
            'hasArt': True,
        }
    return {'image': f'{PLACEHOLDER}-sq.webp', 'thumb': f'{PLACEHOLDER}-sq-sm.webp',
            'cutout': None, 'hasArt': False}

# Stand-in copy for a perfume whose real notes have not been collected. It
# says what the family smells of and admits the rest is coming, rather than
# inventing a pyramid that would read as fact.
GENERIC = {
 'oud': ('Oud, resin and smoke, in the Arabian manner.',
         [['Saffron','Bergamot'],['Rose','Oud'],['Amber','Sandalwood','Musk']]),
 'amber': ('Warm resins and spice, built for an evening.',
           [['Bergamot','Pink Pepper'],['Labdanum','Cinnamon'],['Amber','Benzoin','Musk']]),
 'floral': ('A floral heart carried on a soft, lasting base.',
            [['Bergamot','Pear'],['Rose','Jasmine'],['Musk','Sandalwood']]),
 'woody': ('Dry woods, kept clean at the top.',
           [['Bergamot','Pink Pepper'],['Cedar','Vetiver'],['Sandalwood','Amber','Musk']]),
 'citrus': ('Citrus with enough base underneath it to last the day.',
            [['Lemon','Bergamot','Mandarin'],['Neroli','Jasmine'],['White Musk','Amber','Cedar']]),
 'fresh': ('Air and salt over a quiet musk.',
           [['Bergamot','Grapefruit'],['Marine Accord','Geranium'],['White Musk','Amber','Cedar']]),
 'gourmand': ('Sweet, but composed rather than edible.',
              [['Bergamot','Pink Pepper'],['Vanilla','Tonka Bean'],['Benzoin','Musk','Sandalwood']]),
 'leather': ('Leather and suede, with spice above it.',
             [['Saffron','Bergamot'],['Suede','Orris'],['Leather','Amber','Musk']]),
 'musk': ('Skin-close musk, with little else in the way.',
          [['Bergamot','Pink Pepper'],['Orange Blossom','Orris'],['White Musk','Amber','Sandalwood']]),
}

STANDIN_TAIL = ('The full note breakdown for this bottle is still being written up — '
                'call or WhatsApp us and we will talk you through it.')

products, flags = [], []
for p in picks:
    pid = p['id']
    s = scraped.get(pid, {})
    notes = s.get('notes') or p['notes']
    desc = s.get('description') or p['description']
    note_source = 'storefront' if s.get('notes') else ('authored' if p['notes'] else 'generic')
    desc_source = 'storefront' if s.get('description') else ('authored' if p['description'] else 'generic')

    if not notes:
        g = GENERIC[p['family']][1]
        notes = {'top': g[0], 'heart': g[1], 'base': g[2]}
    if not desc:
        desc = f"{GENERIC[p['family']][0]} {STANDIN_TAIL}"

    # Descriptive tags for anything that came through untagged. Only the ones
    # that restate what the bottle IS - never "bestseller" or "new", which are
    # commercial claims nobody has made yet.
    tags = list(p['tags'])
    if not tags:
        by_family = {'oud': 'oud', 'gourmand': 'gourmand', 'leather': 'leather',
                     'fresh': 'fresh', 'citrus': 'fresh'}
        fam_tag = by_family.get(p['family'])
        if fam_tag: tags.append(fam_tag)
        if p['gender'] == 'women' and 'women' not in tags: tags.append('women')
        cheapest = min(sz['price'] for sz in p['sizes'])
        if cheapest < 20000: tags.append('value')
        elif cheapest >= 90000: tags.append('rare')

    paths = img_paths(pid)
    products.append({
        'id': pid, 'brand': p['brand'], 'brandSlug': p['brandSlug'], 'name': p['name'],
        'gender': p['gender'], 'family': p['family'], 'familyLabel': p['familyLabel'],
        'concentration': p['concentration'],
        'sizes': p['sizes'],
        'notes': notes, 'description': desc,
        'tags': tags,
        'image': paths['image'], 'thumb': paths['thumb'],
        **({'cutout': paths['cutout']} if paths['cutout'] else {}),
        'availability': p['availability'],
    })
    flags.append({'id': pid, 'brand': p['brand'], 'name': p['name'],
                  'notes': note_source, 'description': desc_source,
                  'familySure': p['familySure'], 'art': paths['hasArt']})

counts = collections.Counter(pr['brandSlug'] for pr in products)
brands = []
for slug, meta in H.HOUSES.items():
    brands.append({'slug': slug, **meta, 'count': counts[slug]})
brands.sort(key=lambda b: -b['count'])

catalog = {
    'currency': 'KES',
    'brands': brands,
    'families': [{'slug': s, 'label': l} for s, l in H.FAMILIES],
    'products': products,
}
json.dump(catalog, open(os.path.join(REPO, 'lib/catalog.json'), 'w'), indent=1, ensure_ascii=False)
json.dump(flags, open(os.path.join(HERE, 'data_quality.json'), 'w'), indent=1, ensure_ascii=False)

print(f"{len(products)} products, {len(brands)} houses -> lib/catalog.json")
print(' notes from the storefront :', sum(1 for f in flags if f['notes']=='storefront'))
print(' notes authored by hand    :', sum(1 for f in flags if f['notes']=='authored'))
print(' notes still generic       :', sum(1 for f in flags if f['notes']=='generic'))
print(' with real artwork         :', sum(1 for f in flags if f['art']), f'of {len(flags)}')
