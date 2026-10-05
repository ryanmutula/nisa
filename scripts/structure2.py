"""241 Maven-listed rows -> distinct perfumes, sizes merged, prices per size.

Two things the sheet does that have to be handled rather than copied:

 1. The "X" rows are Nishane's extrait line (EXDP), so Hacivat X 15ML and
    Hacivat X EXDP 100ML are one perfume in two sizes, not two perfumes.
 2. A size variant usually carries the MAIN bottle's Cierra price verbatim -
    Mancera Cedrat Boise reads 16,700 at both 120ml and 8ml. That price was
    matched by name, so the small size inherited it. Where every size shares
    one price we keep only the main size and list the rest as needing a real
    price; where the sheet genuinely prices sizes apart (PDM Delina: 47,900
    at 75ml, 15,100 at 30ml) we keep both.
"""
import json, re, collections

raw = json.load(open('candidates_raw.json'))

NOT_A_BOTTLE = re.compile(
    r'COFFRET|VIAL|VIALS|\bSET\b|CANDLE|BODY CREAM|DEODORANT|DISCOVERY|'
    r'\d+\s*X\s*\d+|\+', re.I)

# "(NEW)" marks a re-listed row, not a different perfume. Three of them are the
# only row for that bottle, so the marker is stripped and the row kept; where a
# plain row already exists the grouping collapses the two together.
NEW_MARK = re.compile(r'\s*\(NEW\)\s*|\s+NEW\s*$', re.I)

HOUSE = {
    'ADO': ('ado', 'Atelier des Ors'),
    'INITIO': ('initio', 'Initio Parfums Privés'),
    'MANCERA': ('mancera', 'Mancera'),
    'MONTALE': ('montale', 'Montale'),
    'NISHANE': ('nishane', 'Nishane'),
    'OJ': ('oj', 'Ormonde Jayne'),
    'PDM': ('pdm', 'Parfums de Marly'),
    'ROJA': ('roja', 'Roja Parfums'),
    'TIZIANA': ('tiziana', 'Tiziana Terenzi'),
    'XERJOFF': ('xerjoff', 'Xerjoff'),
}
SIZE = re.compile(r'\b(\d+)\s*(?:ML|MI)\b', re.I)
NOISE = re.compile(
    r'\b(EDP|EDT|EDC|EAU DE PARFUM|EAU INTENSE|EXTRAIT DE PARFUM|EXT\.? DE PARFUM|'
    r'PARFUM COLOGNE|PARFUM|EXDP|EXT|NSV|LINEA TT|NATURAL SPRAY|XJV|JTC|JOIN THE CLUB|'
    r'XERJOFF|\d+\s*%|\d+\s*ML|\d+\s*MI|NEW)\b', re.I)

# Rows whose cleaned name needs a hand correction.
RENAME = {
    'De La Nuit': 'Parfum de la Nuit',
    'Lune Feline 30%': 'Lune Feline',
    'Rose Omeyyade 30%': 'Rose Omeyyade',
    '4 Montabaco Intensivo': 'Montabaco Intensivo',
    'Atp Torino 23': 'ATP Torino 23',
    'Atp Torino 24': 'ATP Torino 24',
    'Atp Torino 25': 'ATP Torino 25',
    'Suede Et Safran': 'Suede et Safran',
    'Afrika Olifant': 'Afrika-Olifant',
    'Vanille Des Afriques Intensivo': 'Vanille des Afriques Intensivo',
    'Melody Of The Sun': 'Melody of the Sun',
    'Crazy In Love': 'Crazy in Love',
    'Noir By Night': 'Noir by Night',
    'Oud For Greatness': 'Oud for Greatness',
    'Oud For Greatness Neo': 'Oud for Greatness Neo',
    'Oud For Happiness': 'Oud for Happiness',
    'Absolute Aphrodisiac': 'Absolute Aphrodisiac',
}

def concentration(row, name):
    u = ' ' + row.upper() + ' '
    # Nishane's X line is the extrait, whatever the row says
    if re.search(r'\bX\b', ' ' + name.upper() + ' ') and 'NISHANE' in u:
        return 'Extrait de Parfum'
    if ('EXTRAIT DE PARFUM' in u or 'EXT. DE PARFUM' in u or ' EXDP ' in u
            or re.search(r'\bEXT\b', u)):
        return 'Extrait de Parfum'
    if 'PARFUM COLOGNE' in u: return 'Parfum Cologne'
    if 'EAU INTENSE' in u: return 'Eau Intense'
    if 'EAU DE PARFUM' in u or ' EDP ' in u: return 'Eau de Parfum'
    if ' EDT ' in u: return 'Eau de Toilette'
    if ' PARFUM ' in u: return 'Parfum'
    return 'Eau de Parfum'

def clean(row, key):
    n = row
    for lead in ('TIZIANA TERENZI', key):
        if n.upper().startswith(lead):
            n = n[len(lead):]; break
    n = NOISE.sub(' ', n).replace('-', ' ').replace('.', ' ')
    n = re.sub(r'\s+', ' ', n).strip().title()
    return RENAME.get(n, n)

groups = collections.OrderedDict()
dropped_rows = []
for r in raw:
    row = NEW_MARK.sub(' ', r['name']).strip()
    if NOT_A_BOTTLE.search(row):
        dropped_rows.append(row); continue
    key = row.split()[0].upper()
    slug, brand = HOUSE[key]
    name = clean(row, key)
    conc = concentration(row, name)
    mls = [int(m) for m in SIZE.findall(row)]
    ml = mls[0] if mls else None
    k = (slug, name, conc)
    groups.setdefault(k, {'brandSlug': slug, 'brand': brand, 'name': name,
                          'conc': conc, 'px': {}, 'rows': []})
    if ml: groups[k]['px'][ml] = r['cierra']
    groups[k]['rows'].append(row)

out, needs_price = [], []
for (slug, name, conc), v in groups.items():
    px = v['px']
    if not px:
        continue
    prices = set(px.values())
    if len(px) > 1 and len(prices) == 1:
        # every size inherited one price: keep the main bottle only
        main = max(px)
        for ml in sorted(px):
            if ml != main:
                needs_price.append((slug, name, conc, ml, px[ml], main))
        sizes = [{'ml': main, 'cierra': px[main]}]
    else:
        sizes = [{'ml': ml, 'cierra': px[ml]} for ml in sorted(px, reverse=True)]
    out.append({**{k: v[k] for k in ('brandSlug', 'brand', 'name', 'conc')},
                'sizes': sizes, 'rows': v['rows']})

print(f'{len(raw)} rows | {len(dropped_rows)} not a single bottle | {len(out)} distinct perfumes')
print()
for s, n in collections.Counter(o['brandSlug'] for o in out).most_common():
    print(f'{n:4d}  {s}')
print()
print(f'--- {len(needs_price)} secondary sizes parked (price inherited from the main bottle) ---')
for slug, name, conc, ml, inherited, main in needs_price[:8]:
    print(f'  {slug:8s} {name:26s} {ml:>4d}ml  sheet says {inherited} (same as the {main}ml)')
print(f'  ... and {max(0,len(needs_price)-8)} more')
print()
print('--- rows excluded as not a bottle of perfume ---')
for d in dropped_rows: print('  ', d)
import unicodedata
def slugify(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii','ignore').decode()
    return re.sub(r'-+','-', re.sub(r'[^a-z0-9]+','-', s.lower())).strip('-')
CONC_TAG = {'Extrait de Parfum':'ext','Parfum':'parfum','Parfum Cologne':'cologne','Eau Intense':'intense'}
seen = set()
for o in out:
    base = f"{o['brandSlug']}-{slugify(o['name'])}"
    tag = CONC_TAG.get(o['conc'])
    sid = f"{base}-{tag}" if tag and f"{base}" in seen else base
    while sid in seen:
        sid = f"{sid}-{CONC_TAG.get(o['conc'],'x')}" if not sid.endswith(tuple(CONC_TAG.values())) else sid + '2'
    seen.add(sid); o['id'] = sid
json.dump(out, open('distinct2.json','w'), indent=1, ensure_ascii=False)
print()
print('--- all distinct perfumes, with ids ---')
for o in out:
    sz = ' / '.join(f"{s['ml']}ml {s['cierra']+100}" for s in o['sizes'])
    print(f"{o['id']:46s} {o['brand'][:20]:21s} {o['name'][:32]:33s} {o['conc'][:18]:19s} {sz}")
json.dump(needs_price, open('needs_price.json','w'), indent=1)
