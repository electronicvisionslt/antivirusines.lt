
-- Norton 360 - based on official Norton pricing page
UPDATE products SET
  pricing_summary = 'Nuo €19,99/m.',
  features = '{
    "Realaus laiko apsauga": true,
    "VPN": true,
    "Slaptažodžių tvarkyklė": true,
    "Tėvų kontrolė": true,
    "Debesų saugykla": "Iki 75 GB",
    "Telefonų apsauga": true,
    "Ugniasienė": true,
    "Dark web stebėjimas": true,
    "Tapatybės apsauga": false,
    "Sukčių apsauga": true
  }'::jsonb,
  pros = ARRAY[
    'Puikus virusų aptikimas',
    'Integruotas VPN visose versijose nuo Standard',
    'Debesų saugykla iki 75 GB (Premium)',
    'Tėvų kontrolė (Deluxe+)',
    'Deepfake apsauga',
    '100% virusų apsaugos pažadas'
  ],
  cons = ARRAY[
    'Brangesnis nei kai kurie konkurentai',
    'Bazinis Plus planas be VPN',
    'Atsinaujinimo kaina ženkliai didesnė'
  ],
  short_description = 'Visapusiška apsauga su VPN, slaptažodžių tvarkykle, debesų saugykla ir sukčių apsauga. Planai nuo 1 iki 10 įrenginių.',
  best_for = 'Visapusiška apsauga šeimai'
WHERE slug = 'norton-360';

-- Bitdefender Total Security - based on official Bitdefender pricing page
UPDATE products SET
  pricing_summary = 'Nuo $59,99/m.',
  features = '{
    "Realaus laiko apsauga": true,
    "VPN": "Unlimited (Premium+)",
    "Slaptažodžių tvarkyklė": true,
    "Tėvų kontrolė": true,
    "Debesų saugykla": false,
    "Telefonų apsauga": true,
    "Ugniasienė": true,
    "Dark web stebėjimas": true,
    "Tapatybės apsauga": true,
    "Sukčių apsauga": true
  }'::jsonb,
  pros = ARRAY[
    'Geriausias virusų aptikimas (AV-Test)',
    'AI paremta sukčių apsauga',
    'Neribota VPN (Premium Security+)',
    'Anti-tracker naršyklės plėtinys',
    '30 dienų pinigų grąžinimo garantija'
  ],
  cons = ARRAY[
    'VPN limituotas baziniame plane',
    'Nėra debesų saugyklos',
    'Tapatybės apsauga tik Ultimate planuose'
  ],
  short_description = 'AI paremta antivirusinė su 24/7 realaus laiko apsauga, slaptažodžių tvarkykle ir iki 5 įrenginių. Premium versijoje — neribota VPN ir sukčių apsauga.',
  best_for = 'Pažangiausia AI apsauga'
WHERE slug = 'bitdefender-total-security';

-- Kaspersky Plus - based on official Kaspersky pricing page (4 screenshots)
UPDATE products SET
  pricing_summary = 'Nuo €19,99/m.',
  features = '{
    "Realaus laiko apsauga": true,
    "VPN": "Unlimited (Plus+)",
    "Slaptažodžių tvarkyklė": "Plus+",
    "Tėvų kontrolė": "Premium",
    "Debesų saugykla": false,
    "Telefonų apsauga": true,
    "Ugniasienė": true,
    "Dark web stebėjimas": "Plus+",
    "Tapatybės apsauga": "Premium",
    "Sukčių apsauga": true
  }'::jsonb,
  pros = ARRAY[
    'Žemiausia pradinė kaina (nuo €19,99/m.)',
    'Dvikryptė ugniasienė',
    'Kriptovaliutų grėsmių apsauga',
    'Stalkerware aptikimas',
    'Sistemos optimizavimas ir valymas'
  ],
  cons = ARRAY[
    'VPN ir slaptažodžių tvarkyklė tik Plus+ planuose',
    'Tėvų kontrolė tik Premium plane',
    'Geopolitinės rizikos dėl kilmės šalies'
  ],
  short_description = 'Antivirusinė su dvikrypte ugniasiene, kriptovaliutų apsauga ir stalkerware aptikimu. Plus planas prideda neribotą VPN ir slaptažodžių tvarkyklę.',
  best_for = 'Geriausias kainos/kokybės santykis'
WHERE slug = 'kaspersky-plus';

-- ESET Home Security - based on official ESET pricing page
UPDATE products SET
  pricing_summary = 'Nuo $59,99/m.',
  features = '{
    "Realaus laiko apsauga": true,
    "VPN": "Ultimate",
    "Slaptažodžių tvarkyklė": false,
    "Tėvų kontrolė": false,
    "Debesų saugykla": false,
    "Telefonų apsauga": true,
    "Ugniasienė": true,
    "Dark web stebėjimas": false,
    "Tapatybės apsauga": false,
    "Sukčių apsauga": true
  }'::jsonb,
  pros = ARRAY[
    'Itin mažas poveikis sistemos našumui',
    'AI paremtas grėsmių aptikimas',
    'Saugus bankininkavimas ir apsipirkimas',
    'Išmaniųjų namų ir WiFi apsauga',
    'Duomenų šifravimas (Premium+)'
  ],
  cons = ARRAY[
    'VPN tik Ultimate plane',
    'Nėra slaptažodžių tvarkyklės',
    'Nėra tėvų kontrolės',
    'Nėra dark web stebėjimo'
  ],
  short_description = 'Lengva antivirusinė su AI grėsmių aptikimu, dvikrypte ugniasiene ir saugiu bankininkavimo režimu. Premium planas prideda duomenų šifravimą ir neribotą VPN.',
  best_for = 'Lengva apsauga pažengusiems naudotojams'
WHERE slug = 'eset-home-security';
