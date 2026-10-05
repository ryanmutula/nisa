# -*- coding: utf-8 -*-
"""The 150 chosen out of the 182 Maven-listed candidates.

GF maps every id to (gender, family). Families use the nine the site
already has. `False` in the third slot means the family read is a
judgement call rather than something I know, and the Cierra scrape
should overwrite it where it can.
"""
import json, importlib.util, collections, sys

import os
HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('a', os.path.join(HERE, 'authored_a.py'))
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
AUTHORED = {r[0]: r for r in mod.A}

PICK = {
 'pdm': "layton layton-exclusif pegasus althair herod delina delina-exclusif valaya "
        "valaya-exclusif carlisle cassili godolphin habdan sedley oajan oriana safanad "
        "meliora palatine perseus kalan percival haltane",
 'oj': "babylonia byzance kashmir vetiveria bukhara damask muscat sakura verano "
       "ambre-royal ormonde-man ormonde-woman osmanthus montabaco-intensivo-parfum "
       "champaca frangipani isfarkand qi-intensivo vanille-des-afriques-intensivo",
 'nishane': "afrika-olifant ambra-calabria ani deziro fan-your-flames hacivat hacivat-x "
            "hacivat-oud hundred-silent-ways karagoz kredo nefs papilefiko shem "
            "suede-et-safran tempfluo tero tuberoza wulong-cha wulong-cha-x",
 'roja': "amber-aoud aoud apex diaghilev elixir-pour-femme elysium elysium-pour-femme "
         "elysium-pour-homme elysium-pour-homme-parfum enigma enigma-aoud-pour-femme "
         "enigma-pour-homme isola-blu isola-verde manhattan parfum-de-la-nuit reckless scandal",
 'initio': "absolute-aphrodisiac atomic-rose blessed-baraka high-frequency musk-therapy "
           "mystic-experience narcotic-delight oud-for-greatness oud-for-greatness-neo "
           "oud-for-happiness paragon power-self psychedelic-love rehab",
 'mancera': "amore-caffe aoud-orchid cedrat-boise cosmic-pepper french-riviera hindu-kush "
            "instant-crush intense-french-riviera melody-of-the-sun roses-greedy "
            "roses-vanille sicily tonka-cola xplicit-vanilla",
 'xerjoff': "17-17-damarose 1861-naxos atp-torino-24 atp-torino-25 comandante don ouverture "
            "v-accento erba-gold erba-pura purple-accento zefiro",
 'montale': "black-aoud starry-nights intense-starry-nights arabians-tonka arabians "
            "chocolate-greedy roses-musk crazy-in-love intense-cafe-ristretto "
            "sensual-instinct oudyssee wood-spices",
 'tiziana': "andromeda draco gold-rose-oudh halley kirke laudano-nero rosso-pompei "
            "spirito-fiorentino tabit ursa",
 'ado': "bois-sikar cuir-sacre iris-fauve lune-feline noir-by-night novae-vanilla "
        "rose-omeyyade rouge-saray",
}
CHOSEN = [f'{h}-{s}' for h, ids in PICK.items() for s in ids.split()]

# (gender, family, confident in the family?)
GF = {
 # Nishane
 'nishane-afrika-olifant':('unisex','oud',False),'nishane-ambra-calabria':('unisex','amber',True),
 'nishane-ani':('unisex','gourmand',True),'nishane-deziro':('unisex','floral',False),
 'nishane-fan-your-flames':('unisex','gourmand',True),'nishane-hacivat':('unisex','woody',True),
 'nishane-hacivat-x':('unisex','woody',True),'nishane-hacivat-oud':('unisex','oud',True),
 'nishane-hundred-silent-ways':('unisex','musk',False),'nishane-karagoz':('unisex','leather',False),
 'nishane-kredo':('unisex','woody',False),'nishane-nefs':('unisex','oud',False),
 'nishane-papilefiko':('unisex','gourmand',False),'nishane-shem':('unisex','amber',False),
 'nishane-suede-et-safran':('unisex','leather',True),'nishane-tempfluo':('unisex','citrus',False),
 'nishane-tero':('unisex','woody',False),'nishane-tuberoza':('women','floral',True),
 'nishane-wulong-cha':('unisex','woody',True),'nishane-wulong-cha-x':('unisex','woody',True),
 # Ormonde Jayne
 'oj-babylonia':('unisex','woody',False),'oj-byzance':('unisex','amber',False),
 'oj-kashmir':('unisex','amber',False),'oj-vetiveria':('unisex','woody',True),
 'oj-bukhara':('unisex','floral',False),'oj-damask':('women','floral',True),
 'oj-muscat':('unisex','citrus',False),'oj-sakura':('women','floral',True),
 'oj-verano':('unisex','citrus',False),'oj-ambre-royal':('unisex','amber',True),
 'oj-ormonde-man':('men','woody',True),'oj-ormonde-woman':('women','woody',True),
 'oj-osmanthus':('women','floral',True),'oj-montabaco-intensivo-parfum':('unisex','leather',True),
 'oj-champaca':('women','floral',True),'oj-frangipani':('women','floral',True),
 'oj-isfarkand':('unisex','citrus',True),'oj-qi-intensivo':('unisex','citrus',False),
 'oj-vanille-des-afriques-intensivo':('unisex','gourmand',True),
 # Roja
 'roja-amber-aoud':('unisex','oud',True),'roja-aoud':('unisex','oud',True),
 'roja-apex':('men','woody',False),'roja-diaghilev':('unisex','floral',False),
 'roja-elixir-pour-femme':('women','floral',False),'roja-elysium':('men','citrus',True),
 'roja-elysium-pour-femme':('women','floral',True),'roja-elysium-pour-homme':('men','citrus',True),
 'roja-elysium-pour-homme-parfum':('men','citrus',True),'roja-enigma':('unisex','amber',False),
 'roja-enigma-aoud-pour-femme':('women','oud',True),'roja-enigma-pour-homme':('men','amber',False),
 'roja-isola-blu':('unisex','citrus',False),'roja-isola-verde':('unisex','fresh',False),
 'roja-manhattan':('men','woody',False),'roja-parfum-de-la-nuit':('unisex','oud',False),
 'roja-reckless':('women','floral',False),'roja-scandal':('women','floral',False),
 # Initio
 'initio-absolute-aphrodisiac':('unisex','musk',True),'initio-atomic-rose':('women','floral',True),
 'initio-blessed-baraka':('unisex','gourmand',False),'initio-high-frequency':('unisex','floral',False),
 'initio-musk-therapy':('unisex','musk',True),'initio-mystic-experience':('unisex','amber',False),
 'initio-narcotic-delight':('unisex','gourmand',False),'initio-oud-for-greatness':('unisex','oud',True),
 'initio-oud-for-greatness-neo':('unisex','oud',True),'initio-oud-for-happiness':('unisex','oud',True),
 'initio-paragon':('men','woody',False),'initio-power-self':('unisex','amber',False),
 'initio-psychedelic-love':('women','floral',False),'initio-rehab':('unisex','gourmand',True),
 # Xerjoff
 'xerjoff-17-17-damarose':('women','floral',True),'xerjoff-1861-naxos':('men','gourmand',True),
 'xerjoff-atp-torino-24':('unisex','woody',False),'xerjoff-atp-torino-25':('unisex','woody',False),
 'xerjoff-comandante':('men','woody',False),'xerjoff-don':('men','leather',False),
 'xerjoff-ouverture':('unisex','amber',False),'xerjoff-v-accento':('women','floral',False),
 'xerjoff-erba-gold':('unisex','citrus',True),'xerjoff-erba-pura':('unisex','citrus',True),
 'xerjoff-purple-accento':('women','floral',False),'xerjoff-zefiro':('unisex','fresh',False),
 # Tiziana Terenzi
 'tiziana-andromeda':('unisex','fresh',False),'tiziana-draco':('unisex','gourmand',False),
 'tiziana-gold-rose-oudh':('unisex','oud',True),'tiziana-halley':('unisex','gourmand',False),
 'tiziana-kirke':('women','gourmand',True),'tiziana-laudano-nero':('unisex','amber',False),
 'tiziana-rosso-pompei':('women','floral',False),'tiziana-spirito-fiorentino':('unisex','woody',False),
 'tiziana-tabit':('unisex','amber',False),'tiziana-ursa':('unisex','gourmand',False),
 # Atelier des Ors
 'ado-bois-sikar':('unisex','woody',False),'ado-cuir-sacre':('unisex','leather',True),
 'ado-iris-fauve':('unisex','floral',True),'ado-lune-feline':('unisex','amber',False),
 'ado-noir-by-night':('unisex','oud',False),'ado-novae-vanilla':('unisex','gourmand',True),
 'ado-rose-omeyyade':('unisex','floral',True),'ado-rouge-saray':('unisex','amber',False),
}
# batch A already carries gender and family
for r in mod.A:
    GF.setdefault(r[0], (r[1], r[2], True))

# Two Roja rows are the same scent at two concentrations, and the card shows
# the name but not the concentration - so on the shelf they would read as a
# duplicate listing. The parfum carries it in its name, the way a retailer
# would list it.
NAME_OVERRIDE = {
 'roja-elysium-pour-homme-parfum': 'Elysium Pour Homme Parfum',
}

# ── editorial tags ──────────────────────────────────────────────────────
# "bestseller" and "signature" are claims about what moves, so they are set
# deliberately rather than derived. These are each house's best-known
# bottles - the ones the house blurbs in houses.py already single out, and
# the ones a customer walks in asking for by name. Replace them from real
# sell-through once there is some; nothing else depends on them.
EXTRA_TAGS = {
 'nishane-hacivat': ['bestseller','signature'],
 'nishane-ani': ['bestseller','signature'],
 'nishane-hundred-silent-ways': ['bestseller'],
 'nishane-fan-your-flames': ['signature'],
 'roja-elysium-pour-homme': ['bestseller','signature'],
 'roja-scandal': ['bestseller'],
 'roja-enigma-pour-homme': ['bestseller'],
 'roja-amber-aoud': ['signature','rare'],
 'initio-oud-for-greatness': ['bestseller','signature'],
 'initio-rehab': ['bestseller'],
 'initio-psychedelic-love': ['bestseller'],
 'initio-paragon': ['signature'],
 'xerjoff-erba-pura': ['bestseller','signature'],
 'xerjoff-1861-naxos': ['bestseller'],
 'xerjoff-17-17-damarose': ['rare'],
 'oj-ormonde-woman': ['signature'],
 'oj-montabaco-intensivo-parfum': ['bestseller'],
 'oj-frangipani': ['signature'],
 'tiziana-kirke': ['bestseller','signature'],
 'tiziana-halley': ['bestseller'],
 'ado-rose-omeyyade': ['signature'],
 'ado-novae-vanilla': ['bestseller'],
 'mancera-hindu-kush': ['rare'],
 'pdm-layton-exclusif': ['rare'],
}

FAMILY_LABEL = {'oud':'Oud & Incense','amber':'Amber & Spice','floral':'Floral','woody':'Woody',
 'citrus':'Citrus','fresh':'Fresh & Aquatic','gourmand':'Gourmand','leather':'Leather & Suede',
 'musk':'Musk & Skin'}

MARKETS = ['KE','UG','TZ','RW','ZM']

def main():
    distinct = {d['id']: d for d in json.load(open(os.path.join(HERE, 'distinct2.json')))}
    missing = [i for i in CHOSEN if i not in distinct]
    if missing:
        print('!! ids not in the candidate list:', missing); sys.exit(1)
    nogf = [i for i in CHOSEN if i not in GF]
    if nogf:
        print('!! no gender/family for:', nogf); sys.exit(1)

    picks = []
    for pid in CHOSEN:
        d = distinct[pid]
        g, fam, fam_sure = GF[pid]
        a = AUTHORED.get(pid)
        picks.append({
            'id': pid, 'brand': d['brand'], 'brandSlug': d['brandSlug'],
            'name': NAME_OVERRIDE.get(pid, d['name']),
            'gender': g, 'family': fam, 'familyLabel': FAMILY_LABEL[fam],
            'familySure': fam_sure, 'concentration': d['conc'],
            # Cierra's price plus the KSh 100 uplift, per size
            'sizes': [{'ml': s['ml'], 'price': s['cierra'] + 100} for s in d['sizes']],
            'notes': {'top': a[3], 'heart': a[4], 'base': a[5]} if a else None,
            'description': a[6] if a else None,
            'tags': sorted(set((a[7] if a else []) + EXTRA_TAGS.get(pid, []))),
            'notesSure': bool(a and a[8]),
            'sourceRows': d['rows'],
            'availability': MARKETS,
        })

    json.dump(picks, open(os.path.join(HERE, 'picks.json'),'w'), indent=1, ensure_ascii=False)
    print(f'{len(picks)} picks')
    print(' by house:', dict(collections.Counter(p['brandSlug'] for p in picks)))
    print(' by family:', dict(collections.Counter(p['family'] for p in picks)))
    print(' by wear:', dict(collections.Counter(p['gender'] for p in picks)))
    print(f" notes authored: {sum(1 for p in picks if p['notes'])}, of which confident: {sum(1 for p in picks if p['notesSure'])}")
    print(f" awaiting notes entirely: {sum(1 for p in picks if not p['notes'])}")
    px = [s['price'] for p in picks for s in p['sizes']]
    print(f' price range: KSh {min(px):,} - {max(px):,}')

main()
