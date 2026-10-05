# Catalogue data quality — what still needs a human

Generated when the 150-perfume shelf was built from the Maven price matrix.
Everything below is a known gap, not a bug.

## 1. Artwork missing (116 of 150)

These sit on the placeholder plate until their packshot is collected.
`cierraperfumes.com` and `feelnzuri.com` were both blocked by the
environment's network policy when this was built, so nothing could be
scraped. Once those hosts are reachable:

```
node scripts/scrape.mjs harvest && node scripts/scrape.mjs match && node scripts/scrape.mjs images
python3 scripts/build_catalog.py
```

- `pdm-layton-exclusif` — Parfums de Marly Layton Exclusif
- `pdm-delina-exclusif` — Parfums de Marly Delina Exclusif
- `pdm-valaya-exclusif` — Parfums de Marly Valaya Exclusif
- `pdm-cassili` — Parfums de Marly Cassili
- `pdm-godolphin` — Parfums de Marly Godolphin
- `pdm-habdan` — Parfums de Marly Habdan
- `pdm-sedley` — Parfums de Marly Sedley
- `pdm-oajan` — Parfums de Marly Oajan
- `pdm-oriana` — Parfums de Marly Oriana
- `pdm-safanad` — Parfums de Marly Safanad
- `pdm-meliora` — Parfums de Marly Meliora
- `pdm-palatine` — Parfums de Marly Palatine
- `pdm-perseus` — Parfums de Marly Perseus
- `pdm-kalan` — Parfums de Marly Kalan
- `pdm-haltane` — Parfums de Marly Haltane
- `oj-babylonia` — Ormonde Jayne Babylonia
- `oj-byzance` — Ormonde Jayne Byzance
- `oj-kashmir` — Ormonde Jayne Kashmir
- `oj-vetiveria` — Ormonde Jayne Vetiveria
- `oj-bukhara` — Ormonde Jayne Bukhara
- `oj-damask` — Ormonde Jayne Damask
- `oj-muscat` — Ormonde Jayne Muscat
- `oj-sakura` — Ormonde Jayne Sakura
- `oj-verano` — Ormonde Jayne Verano
- `oj-ambre-royal` — Ormonde Jayne Ambre Royal
- `oj-ormonde-man` — Ormonde Jayne Ormonde Man
- `oj-ormonde-woman` — Ormonde Jayne Ormonde Woman
- `oj-osmanthus` — Ormonde Jayne Osmanthus
- `oj-montabaco-intensivo-parfum` — Ormonde Jayne Montabaco Intensivo
- `oj-champaca` — Ormonde Jayne Champaca
- `oj-frangipani` — Ormonde Jayne Frangipani
- `oj-isfarkand` — Ormonde Jayne Isfarkand
- `oj-qi-intensivo` — Ormonde Jayne Qi Intensivo
- `oj-vanille-des-afriques-intensivo` — Ormonde Jayne Vanille des Afriques Intensivo
- `nishane-afrika-olifant` — Nishane Afrika-Olifant
- `nishane-ambra-calabria` — Nishane Ambra Calabria
- `nishane-deziro` — Nishane Deziro
- `nishane-hacivat-oud` — Nishane Hacivat Oud
- `nishane-karagoz` — Nishane Karagoz
- `nishane-kredo` — Nishane Kredo
- `nishane-nefs` — Nishane Nefs
- `nishane-papilefiko` — Nishane Papilefiko
- `nishane-shem` — Nishane Shem
- `nishane-tempfluo` — Nishane Tempfluo
- `nishane-tero` — Nishane Tero
- `nishane-tuberoza` — Nishane Tuberóza
- `nishane-wulong-cha-x` — Nishane Wulong Cha X
- `roja-amber-aoud` — Roja Parfums Amber Aoud
- `roja-aoud` — Roja Parfums Aoud
- `roja-apex` — Roja Parfums Apex
- `roja-diaghilev` — Roja Parfums Diaghilev
- `roja-elixir-pour-femme` — Roja Parfums Elixir Pour Femme
- `roja-elysium` — Roja Parfums Elysium
- `roja-elysium-pour-homme-parfum` — Roja Parfums Elysium Pour Homme
- `roja-enigma` — Roja Parfums Enigma
- `roja-enigma-aoud-pour-femme` — Roja Parfums Enigma Aoud Pour Femme
- `roja-isola-blu` — Roja Parfums Isola Blu
- `roja-isola-verde` — Roja Parfums Isola Verde
- `roja-manhattan` — Roja Parfums Manhattan
- `roja-parfum-de-la-nuit` — Roja Parfums Parfum de la Nuit
- `roja-reckless` — Roja Parfums Reckless
- `roja-scandal` — Roja Parfums Scandal
- `initio-absolute-aphrodisiac` — Initio Parfums Privés Absolute Aphrodisiac
- `initio-high-frequency` — Initio Parfums Privés High Frequency
- `initio-mystic-experience` — Initio Parfums Privés Mystic Experience
- `initio-narcotic-delight` — Initio Parfums Privés Narcotic Delight
- `initio-oud-for-greatness-neo` — Initio Parfums Privés Oud for Greatness Neo
- `initio-power-self` — Initio Parfums Privés Power Self
- `initio-psychedelic-love` — Initio Parfums Privés Psychedelic Love
- `mancera-amore-caffe` — Mancera Amore Caffe
- `mancera-aoud-orchid` — Mancera Aoud Orchid
- `mancera-cosmic-pepper` — Mancera Cosmic Pepper
- `mancera-french-riviera` — Mancera French Riviera
- `mancera-intense-french-riviera` — Mancera Intense French Riviera
- `mancera-melody-of-the-sun` — Mancera Melody of the Sun
- `mancera-roses-greedy` — Mancera Roses Greedy
- `mancera-sicily` — Mancera Sicily
- `mancera-tonka-cola` — Mancera Tonka Cola
- `mancera-xplicit-vanilla` — Mancera Xplicit Vanilla
- `xerjoff-17-17-damarose` — Xerjoff 17/17 Damarose
- `xerjoff-1861-naxos` — Xerjoff 1861 Naxos
- `xerjoff-atp-torino-24` — Xerjoff ATP Torino 24
- `xerjoff-atp-torino-25` — Xerjoff ATP Torino 25
- `xerjoff-comandante` — Xerjoff Comandante
- `xerjoff-don` — Xerjoff Don
- `xerjoff-ouverture` — Xerjoff Ouverture
- `xerjoff-v-accento` — Xerjoff V Accento
- `xerjoff-erba-gold` — Xerjoff Erba Gold
- `xerjoff-erba-pura` — Xerjoff Erba Pura
- `xerjoff-purple-accento` — Xerjoff Purple Accento
- `xerjoff-zefiro` — Xerjoff Zefiro
- `montale-intense-starry-nights` — Montale Intense Starry Nights
- `montale-arabians` — Montale Arabians
- `montale-crazy-in-love` — Montale Crazy in Love
- `montale-intense-cafe-ristretto` — Montale Intense Cafe Ristretto
- `montale-sensual-instinct` — Montale Sensual Instinct
- `montale-oudyssee` — Montale Oudyssee
- `montale-wood-spices` — Montale Wood & Spices
- `tiziana-andromeda` — Tiziana Terenzi Andromeda
- `tiziana-draco` — Tiziana Terenzi Draco
- `tiziana-gold-rose-oudh` — Tiziana Terenzi Gold Rose Oudh
- `tiziana-halley` — Tiziana Terenzi Halley
- `tiziana-kirke` — Tiziana Terenzi Kirke
- `tiziana-laudano-nero` — Tiziana Terenzi Laudano Nero
- `tiziana-rosso-pompei` — Tiziana Terenzi Rosso Pompei
- `tiziana-spirito-fiorentino` — Tiziana Terenzi Spirito Fiorentino
- `tiziana-tabit` — Tiziana Terenzi Tabit
- `tiziana-ursa` — Tiziana Terenzi Ursa
- `ado-bois-sikar` — Atelier des Ors Bois Sikar
- `ado-cuir-sacre` — Atelier des Ors Cuir Sacre
- `ado-iris-fauve` — Atelier des Ors Iris Fauve
- `ado-lune-feline` — Atelier des Ors Lune Feline
- `ado-noir-by-night` — Atelier des Ors Noir by Night
- `ado-novae-vanilla` — Atelier des Ors Novae Vanilla
- `ado-rose-omeyyade` — Atelier des Ors Rose Omeyyade
- `ado-rouge-saray` — Atelier des Ors Rouge Saray

## 2. Note pyramid is a family-level placeholder (101)

These carry a generic pyramid for their family and a one-line description.
They read correctly but they are not the real notes — replace them from the
house's own copy, or let the scrape fill them.

- `oj-babylonia` — Ormonde Jayne Babylonia
- `oj-byzance` — Ormonde Jayne Byzance
- `oj-kashmir` — Ormonde Jayne Kashmir
- `oj-vetiveria` — Ormonde Jayne Vetiveria
- `oj-bukhara` — Ormonde Jayne Bukhara
- `oj-damask` — Ormonde Jayne Damask
- `oj-muscat` — Ormonde Jayne Muscat
- `oj-sakura` — Ormonde Jayne Sakura
- `oj-verano` — Ormonde Jayne Verano
- `oj-ambre-royal` — Ormonde Jayne Ambre Royal
- `oj-ormonde-man` — Ormonde Jayne Ormonde Man
- `oj-ormonde-woman` — Ormonde Jayne Ormonde Woman
- `oj-osmanthus` — Ormonde Jayne Osmanthus
- `oj-montabaco-intensivo-parfum` — Ormonde Jayne Montabaco Intensivo
- `oj-champaca` — Ormonde Jayne Champaca
- `oj-frangipani` — Ormonde Jayne Frangipani
- `oj-isfarkand` — Ormonde Jayne Isfarkand
- `oj-qi-intensivo` — Ormonde Jayne Qi Intensivo
- `oj-vanille-des-afriques-intensivo` — Ormonde Jayne Vanille des Afriques Intensivo
- `nishane-afrika-olifant` — Nishane Afrika-Olifant
- `nishane-ambra-calabria` — Nishane Ambra Calabria
- `nishane-ani` — Nishane Ani
- `nishane-deziro` — Nishane Deziro
- `nishane-fan-your-flames` — Nishane Fan Your Flames
- `nishane-hacivat` — Nishane Hacivat
- `nishane-hacivat-x` — Nishane Hacivat X
- `nishane-hacivat-oud` — Nishane Hacivat Oud
- `nishane-hundred-silent-ways` — Nishane Hundred Silent Ways
- `nishane-karagoz` — Nishane Karagoz
- `nishane-kredo` — Nishane Kredo
- `nishane-nefs` — Nishane Nefs
- `nishane-papilefiko` — Nishane Papilefiko
- `nishane-shem` — Nishane Shem
- `nishane-suede-et-safran` — Nishane Suede et Safran
- `nishane-tempfluo` — Nishane Tempfluo
- `nishane-tero` — Nishane Tero
- `nishane-tuberoza` — Nishane Tuberóza
- `nishane-wulong-cha` — Nishane Wulong Cha
- `nishane-wulong-cha-x` — Nishane Wulong Cha X
- `roja-amber-aoud` — Roja Parfums Amber Aoud
- `roja-aoud` — Roja Parfums Aoud
- `roja-apex` — Roja Parfums Apex
- `roja-diaghilev` — Roja Parfums Diaghilev
- `roja-elixir-pour-femme` — Roja Parfums Elixir Pour Femme
- `roja-elysium` — Roja Parfums Elysium
- `roja-elysium-pour-femme` — Roja Parfums Elysium Pour Femme
- `roja-elysium-pour-homme` — Roja Parfums Elysium Pour Homme
- `roja-elysium-pour-homme-parfum` — Roja Parfums Elysium Pour Homme
- `roja-enigma` — Roja Parfums Enigma
- `roja-enigma-aoud-pour-femme` — Roja Parfums Enigma Aoud Pour Femme
- `roja-enigma-pour-homme` — Roja Parfums Enigma Pour Homme
- `roja-isola-blu` — Roja Parfums Isola Blu
- `roja-isola-verde` — Roja Parfums Isola Verde
- `roja-manhattan` — Roja Parfums Manhattan
- `roja-parfum-de-la-nuit` — Roja Parfums Parfum de la Nuit
- `roja-reckless` — Roja Parfums Reckless
- `roja-scandal` — Roja Parfums Scandal
- `initio-absolute-aphrodisiac` — Initio Parfums Privés Absolute Aphrodisiac
- `initio-atomic-rose` — Initio Parfums Privés Atomic Rose
- `initio-blessed-baraka` — Initio Parfums Privés Blessed Baraka
- `initio-high-frequency` — Initio Parfums Privés High Frequency
- `initio-musk-therapy` — Initio Parfums Privés Musk Therapy
- `initio-mystic-experience` — Initio Parfums Privés Mystic Experience
- `initio-narcotic-delight` — Initio Parfums Privés Narcotic Delight
- `initio-oud-for-greatness` — Initio Parfums Privés Oud for Greatness
- `initio-oud-for-greatness-neo` — Initio Parfums Privés Oud for Greatness Neo
- `initio-oud-for-happiness` — Initio Parfums Privés Oud for Happiness
- `initio-paragon` — Initio Parfums Privés Paragon
- `initio-power-self` — Initio Parfums Privés Power Self
- `initio-psychedelic-love` — Initio Parfums Privés Psychedelic Love
- `initio-rehab` — Initio Parfums Privés Rehab
- `xerjoff-17-17-damarose` — Xerjoff 17/17 Damarose
- `xerjoff-1861-naxos` — Xerjoff 1861 Naxos
- `xerjoff-atp-torino-24` — Xerjoff ATP Torino 24
- `xerjoff-atp-torino-25` — Xerjoff ATP Torino 25
- `xerjoff-comandante` — Xerjoff Comandante
- `xerjoff-don` — Xerjoff Don
- `xerjoff-ouverture` — Xerjoff Ouverture
- `xerjoff-v-accento` — Xerjoff V Accento
- `xerjoff-erba-gold` — Xerjoff Erba Gold
- `xerjoff-erba-pura` — Xerjoff Erba Pura
- `xerjoff-purple-accento` — Xerjoff Purple Accento
- `xerjoff-zefiro` — Xerjoff Zefiro
- `tiziana-andromeda` — Tiziana Terenzi Andromeda
- `tiziana-draco` — Tiziana Terenzi Draco
- `tiziana-gold-rose-oudh` — Tiziana Terenzi Gold Rose Oudh
- `tiziana-halley` — Tiziana Terenzi Halley
- `tiziana-kirke` — Tiziana Terenzi Kirke
- `tiziana-laudano-nero` — Tiziana Terenzi Laudano Nero
- `tiziana-rosso-pompei` — Tiziana Terenzi Rosso Pompei
- `tiziana-spirito-fiorentino` — Tiziana Terenzi Spirito Fiorentino
- `tiziana-tabit` — Tiziana Terenzi Tabit
- `tiziana-ursa` — Tiziana Terenzi Ursa
- `ado-bois-sikar` — Atelier des Ors Bois Sikar
- `ado-cuir-sacre` — Atelier des Ors Cuir Sacre
- `ado-iris-fauve` — Atelier des Ors Iris Fauve
- `ado-lune-feline` — Atelier des Ors Lune Feline
- `ado-noir-by-night` — Atelier des Ors Noir by Night
- `ado-novae-vanilla` — Atelier des Ors Novae Vanilla
- `ado-rose-omeyyade` — Atelier des Ors Rose Omeyyade
- `ado-rouge-saray` — Atelier des Ors Rouge Saray

## 3. Notes written from knowledge, worth checking (30)

Written by hand and plausible, but not verified against the house.

- `pdm-layton-exclusif` — Parfums de Marly Layton Exclusif
- `pdm-delina-exclusif` — Parfums de Marly Delina Exclusif
- `pdm-valaya-exclusif` — Parfums de Marly Valaya Exclusif
- `pdm-oajan` — Parfums de Marly Oajan
- `pdm-oriana` — Parfums de Marly Oriana
- `pdm-safanad` — Parfums de Marly Safanad
- `pdm-meliora` — Parfums de Marly Meliora
- `pdm-palatine` — Parfums de Marly Palatine
- `pdm-perseus` — Parfums de Marly Perseus
- `pdm-kalan` — Parfums de Marly Kalan
- `pdm-percival` — Parfums de Marly Percival
- `pdm-haltane` — Parfums de Marly Haltane
- `mancera-amore-caffe` — Mancera Amore Caffe
- `mancera-aoud-orchid` — Mancera Aoud Orchid
- `mancera-cosmic-pepper` — Mancera Cosmic Pepper
- `mancera-french-riviera` — Mancera French Riviera
- `mancera-instant-crush` — Mancera Instant Crush
- `mancera-intense-french-riviera` — Mancera Intense French Riviera
- `mancera-melody-of-the-sun` — Mancera Melody of the Sun
- `mancera-roses-greedy` — Mancera Roses Greedy
- `mancera-sicily` — Mancera Sicily
- `mancera-tonka-cola` — Mancera Tonka Cola
- `mancera-xplicit-vanilla` — Mancera Xplicit Vanilla
- `montale-intense-starry-nights` — Montale Intense Starry Nights
- `montale-arabians` — Montale Arabians
- `montale-crazy-in-love` — Montale Crazy in Love
- `montale-intense-cafe-ristretto` — Montale Intense Cafe Ristretto
- `montale-sensual-instinct` — Montale Sensual Instinct
- `montale-oudyssee` — Montale Oudyssee
- `montale-wood-spices` — Montale Wood & Spices

## 4. Family is a judgement call (55)

- `oj-babylonia` — Ormonde Jayne Babylonia → filed under **Woody**
- `oj-byzance` — Ormonde Jayne Byzance → filed under **Amber & Spice**
- `oj-kashmir` — Ormonde Jayne Kashmir → filed under **Amber & Spice**
- `oj-bukhara` — Ormonde Jayne Bukhara → filed under **Floral**
- `oj-muscat` — Ormonde Jayne Muscat → filed under **Citrus**
- `oj-verano` — Ormonde Jayne Verano → filed under **Citrus**
- `oj-qi-intensivo` — Ormonde Jayne Qi Intensivo → filed under **Citrus**
- `nishane-afrika-olifant` — Nishane Afrika-Olifant → filed under **Oud & Incense**
- `nishane-deziro` — Nishane Deziro → filed under **Floral**
- `nishane-hundred-silent-ways` — Nishane Hundred Silent Ways → filed under **Musk & Skin**
- `nishane-karagoz` — Nishane Karagoz → filed under **Leather & Suede**
- `nishane-kredo` — Nishane Kredo → filed under **Woody**
- `nishane-nefs` — Nishane Nefs → filed under **Oud & Incense**
- `nishane-papilefiko` — Nishane Papilefiko → filed under **Gourmand**
- `nishane-shem` — Nishane Shem → filed under **Amber & Spice**
- `nishane-tempfluo` — Nishane Tempfluo → filed under **Citrus**
- `nishane-tero` — Nishane Tero → filed under **Woody**
- `roja-apex` — Roja Parfums Apex → filed under **Woody**
- `roja-diaghilev` — Roja Parfums Diaghilev → filed under **Floral**
- `roja-elixir-pour-femme` — Roja Parfums Elixir Pour Femme → filed under **Floral**
- `roja-enigma` — Roja Parfums Enigma → filed under **Amber & Spice**
- `roja-enigma-pour-homme` — Roja Parfums Enigma Pour Homme → filed under **Amber & Spice**
- `roja-isola-blu` — Roja Parfums Isola Blu → filed under **Citrus**
- `roja-isola-verde` — Roja Parfums Isola Verde → filed under **Fresh & Aquatic**
- `roja-manhattan` — Roja Parfums Manhattan → filed under **Woody**
- `roja-parfum-de-la-nuit` — Roja Parfums Parfum de la Nuit → filed under **Oud & Incense**
- `roja-reckless` — Roja Parfums Reckless → filed under **Floral**
- `roja-scandal` — Roja Parfums Scandal → filed under **Floral**
- `initio-blessed-baraka` — Initio Parfums Privés Blessed Baraka → filed under **Gourmand**
- `initio-high-frequency` — Initio Parfums Privés High Frequency → filed under **Floral**
- `initio-mystic-experience` — Initio Parfums Privés Mystic Experience → filed under **Amber & Spice**
- `initio-narcotic-delight` — Initio Parfums Privés Narcotic Delight → filed under **Gourmand**
- `initio-paragon` — Initio Parfums Privés Paragon → filed under **Woody**
- `initio-power-self` — Initio Parfums Privés Power Self → filed under **Amber & Spice**
- `initio-psychedelic-love` — Initio Parfums Privés Psychedelic Love → filed under **Floral**
- `xerjoff-atp-torino-24` — Xerjoff ATP Torino 24 → filed under **Woody**
- `xerjoff-atp-torino-25` — Xerjoff ATP Torino 25 → filed under **Woody**
- `xerjoff-comandante` — Xerjoff Comandante → filed under **Woody**
- `xerjoff-don` — Xerjoff Don → filed under **Leather & Suede**
- `xerjoff-ouverture` — Xerjoff Ouverture → filed under **Amber & Spice**
- `xerjoff-v-accento` — Xerjoff V Accento → filed under **Floral**
- `xerjoff-purple-accento` — Xerjoff Purple Accento → filed under **Floral**
- `xerjoff-zefiro` — Xerjoff Zefiro → filed under **Fresh & Aquatic**
- `tiziana-andromeda` — Tiziana Terenzi Andromeda → filed under **Fresh & Aquatic**
- `tiziana-draco` — Tiziana Terenzi Draco → filed under **Gourmand**
- `tiziana-halley` — Tiziana Terenzi Halley → filed under **Gourmand**
- `tiziana-laudano-nero` — Tiziana Terenzi Laudano Nero → filed under **Amber & Spice**
- `tiziana-rosso-pompei` — Tiziana Terenzi Rosso Pompei → filed under **Floral**
- `tiziana-spirito-fiorentino` — Tiziana Terenzi Spirito Fiorentino → filed under **Woody**
- `tiziana-tabit` — Tiziana Terenzi Tabit → filed under **Amber & Spice**
- `tiziana-ursa` — Tiziana Terenzi Ursa → filed under **Gourmand**
- `ado-bois-sikar` — Atelier des Ors Bois Sikar → filed under **Woody**
- `ado-lune-feline` — Atelier des Ors Lune Feline → filed under **Amber & Spice**
- `ado-noir-by-night` — Atelier des Ors Noir by Night → filed under **Oud & Incense**
- `ado-rouge-saray` — Atelier des Ors Rouge Saray → filed under **Amber & Spice**

## 5. Secondary sizes with no price of their own (43)

The sheet gives one Cierra price per perfume. A travel size usually carries
the main bottle's price verbatim — Mancera Cedrat Boise reads 16,700 at both
120ml and 8ml — so the smaller size was left off rather than listed at a price
that cannot be right. Add a real price and the size goes back on the bottle.

| Perfume | Size left off | Sheet price | Same as |
|---|---|---|---|
| initio Musk Therapy (Eau de Parfum) | 50ml | 41,200 | the 90ml |
| mancera Cedrat Boise (Eau de Parfum) | 8ml | 16,700 | the 120ml |
| mancera Cosmic Pepper (Eau de Parfum) | 8ml | 16,500 | the 120ml |
| mancera French Riviera (Eau de Parfum) | 8ml | 20,500 | the 120ml |
| mancera Hindu Kush (Eau de Parfum) | 8ml | 16,300 | the 120ml |
| mancera Instant Crush (Eau de Parfum) | 8ml | 16,900 | the 120ml |
| mancera Intense Cedrat Boise (Eau de Parfum) | 8ml | 16,700 | the 120ml |
| mancera Melody of the Sun (Eau de Parfum) | 8ml | 17,200 | the 120ml |
| mancera Roses Greedy (Eau de Parfum) | 8ml | 15,700 | the 120ml |
| mancera Roses Vanille (Eau de Parfum) | 8ml | 16,200 | the 120ml |
| mancera Sicily (Eau de Parfum) | 8ml | 16,500 | the 120ml |
| mancera Tonka Cola (Eau de Parfum) | 8ml | 16,400 | the 120ml |
| montale Arabians Tonka (Eau de Parfum) | 20ml | 19,500 | the 100ml |
| montale Arabians Tonka (Eau de Parfum) | 50ml | 19,500 | the 100ml |
| montale Black Aoud (Eau de Parfum) | 20ml | 15,200 | the 100ml |
| montale Chocolate Greedy (Eau de Parfum) | 20ml | 13,200 | the 100ml |
| montale Crazy in Love (Eau de Parfum) | 20ml | 12,900 | the 100ml |
| montale Intense Starry Nights (Eau de Parfum) | 50ml | 12,400 | the 100ml |
| montale Roses Musk (Eau de Parfum) | 20ml | 12,500 | the 100ml |
| montale Sensual Instinct (Eau de Parfum) | 20ml | 13,200 | the 100ml |
| montale Starry Nights (Eau de Parfum) | 20ml | 12,400 | the 100ml |
| nishane Fan Your Flames (Eau de Parfum) | 15ml | 17,500 | the 100ml |
| nishane Fan Your Flames X (Extrait de Parfum) | 15ml | 17,500 | the 100ml |
| nishane Hacivat X (Extrait de Parfum) | 15ml | 22,500 | the 100ml |
| nishane Hacivat X (Extrait de Parfum) | 50ml | 22,500 | the 100ml |
| nishane Hacivat (Eau de Parfum) | 15ml | 22,500 | the 100ml |
| nishane Hacivat (Eau de Parfum) | 50ml | 22,500 | the 100ml |
| nishane Hundred Silent Ways (Eau de Parfum) | 15ml | 19,500 | the 100ml |
| nishane Hundred Silent Ways X (Extrait de Parfum) | 15ml | 19,500 | the 100ml |
| nishane Wulong Cha X (Extrait de Parfum) | 15ml | 41,000 | the 100ml |
| oj Ambre Royal (Eau de Parfum) | 50ml | 33,500 | the 120ml |
| oj Ormonde Man (Eau de Parfum) | 50ml | 41,500 | the 120ml |
| oj Osmanthus (Eau de Parfum) | 50ml | 29,900 | the 120ml |
| oj Montabaco Intensivo (Parfum) | 88ml | 51,500 | the 120ml |
| pdm Delina Exclusif (Eau de Parfum) | 30ml | 51,700 | the 75ml |
| pdm Herod (Eau de Parfum) | 75ml | 41,900 | the 125ml |
| pdm Layton (Eau de Parfum) | 125ml | 43,400 | the 200ml |
| pdm Palatine (Eau de Parfum) | 30ml | 50,900 | the 75ml |
| pdm Pegasus (Eau de Parfum) | 125ml | 39,600 | the 200ml |
| pdm Percival (Eau de Parfum) | 125ml | 47,900 | the 200ml |
| pdm Valaya (Eau de Parfum) | 30ml | 49,500 | the 75ml |
| pdm Valaya Exclusif (Eau de Parfum) | 30ml | 53,900 | the 75ml |
| xerjoff Erba Pura (Eau de Parfum) | 50ml | 27,500 | the 100ml |

## 6. Prices worth a second look

Taken straight from the sheet (Cierra + KSh 100) but they look out of line
with their neighbours:

- `oj-ambre-royal-parfum` — the Parfum 88ml came to 15,900 while the EDP 120ml is 33,600 — a parfum under half the EDP is unusual
- `pdm-delina` — the 30ml is 15,200 against 48,000 for the 75ml
- `tiziana-gold-rose-oudh` — 15,200 against 20,600–36,300 for the rest of the house
- `roja-elixir-pour-femme` — EDP 75ml is 78,000 while the Parfum 50ml is 41,200
- `initio-magnetic-blend-7` — 19,900 against 33,000–50,600 for the rest of the house (not in the 150, but the same oddity)
