
UPDATE products SET
  features = '{
    "Realaus laiko apsauga": true,
    "VPN": false,
    "Slaptažodžių tvarkyklė": false,
    "Ugniasienė": true,
    "Tėvų kontrolė": false,
    "Debesų saugykla": false,
    "Telefonų apsauga": true,
    "Dark web stebėjimas": false,
    "Tapatybės apsauga": false,
    "Sukčių apsauga": true
  }'::jsonb,
  pros = ARRAY[
    'Visiškai nemokama su pilnu funkcionalumu',
    'AI paremta sukčių apsauga (Avast Assistant)',
    'Ugniasienė ir tinklo inspektorius',
    'Ransomware apsauga',
    'Duomenų nutekėjimo įspėjimai',
    'Prieinama PC, Mac, Android ir iOS'
  ],
  cons = ARRAY[
    'Nėra VPN',
    'Nėra slaptažodžių tvarkyklės',
    'Nėra tėvų kontrolės',
    'Siūlo atnaujinimus į mokamą versiją'
  ],
  short_description = 'Nemokama antivirusinė su AI sukčių apsauga, ugniasiene, tinklo inspektoriumi ir ransomware apsauga. Prieinama visoms platformoms.',
  best_for = 'Bazinė nemokama apsauga'
WHERE slug = 'avast-free';
