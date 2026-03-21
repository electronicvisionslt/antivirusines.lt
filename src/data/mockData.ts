export interface Author {
  slug: string;
  name: string;
  bio: string;
  expertise: string[];
  initials: string;
}

export interface Article {
  slug: string;
  path: string;
  categoryPath: string;
  title: string;
  excerpt: string;
  authorSlug: string;
  updatedAt: string;
  readTime: string;
  heroColor: string;
  sections: { id: string; title: string; content: string }[];
  faq: { q: string; a: string }[];
  pros?: string[];
  cons?: string[];
  verdict?: string;
  relatedPaths?: string[];
}

export interface Category {
  path: string;
  title: string;
  description: string;
  heroColor: string;
  articlePaths: string[];
  faq: { q: string; a: string }[];
}


export const authors: Record<string, Author> = {
  'jonas-kazlauskas': {
    slug: 'jonas-kazlauskas',
    name: 'Jonas Kazlauskas',
    bio: 'Kibernetinio saugumo ekspertas su daugiau nei 8 metų patirtimi IT sektoriuje. Specializuojasi antivirusinės programinės įrangos testavime ir vertinime. Reguliariai dalyvauja kibernetinio saugumo konferencijose.',
    expertise: ['Antivirusinė programinė įranga', 'Tinklo saugumas', 'Kibernetinės grėsmės'],
    initials: 'JK',
  },
  'gabija-petraityte': {
    slug: 'gabija-petraityte',
    name: 'Gabija Petraitytė',
    bio: 'Technologijų žurnalistė ir skaitmeninio raštingumo edukatorė. Rašo apie vaikų saugumą internete, tėvų kontrolės sprendimus ir privatumo apsaugą. Bendradarbiauja su Lietuvos mokyklomis.',
    expertise: ['Tėvų kontrolė', 'Skaitmeninis raštingumas', 'Privatumo apsauga'],
    initials: 'GP',
  },
  'matas-jonaitis': {
    slug: 'matas-jonaitis',
    name: 'Matas Jonaitis',
    bio: 'Programuotojas ir informacijos saugumo specialistas. Tyrinėja slaptažodžių saugumą, duomenų nutekėjimus ir autentifikacijos metodus. Aktyviai prisideda prie atvirojo kodo saugumo projektų.',
    expertise: ['Slaptažodžių saugumas', 'Duomenų apsauga', 'Autentifikacija'],
    initials: 'MJ',
  },
};

export const categories: Record<string, Category> = {
  '/antivirusines-programos': {
    path: '/antivirusines-programos',
    title: 'Antivirusinės programos',
    description: 'Išsamūs antivirusinių programų palyginimai, apžvalgos ir rekomendacijos. Padedame išsirinkti geriausią apsaugą jūsų kompiuteriui ar telefonui.',
    heroColor: 'bg-primary/8',
    articlePaths: [
      '/antivirusines-programos/nemokamos',
      '/antivirusines-programos/telefonui',
      '/antivirusines-programos/kompiuteriui',
    ],
    faq: [
      { q: 'Ar būtina naudoti antivirusinę programą?', a: 'Taip, antivirusinė programa yra vienas svarbiausių įrankių apsaugoti jūsų įrenginį nuo kenkėjiškos programinės įrangos, virusų ir kitų grėsmių.' },
      { q: 'Kuo skiriasi nemokamos ir mokamos antivirusinės?', a: 'Nemokamos antivirusinės suteikia bazinę apsaugą, tačiau mokamos versijos paprastai siūlo pažangesnę apsaugą, VPN, slaptažodžių tvarkyklę ir techninę pagalbą.' },
      { q: 'Kaip dažnai reikia atnaujinti antivirusinę?', a: 'Rekomenduojama įjungti automatinius atnaujinimus, kad antivirusinė visada turėtų naujausias virusų duomenų bazes.' },
    ],
  },
  '/tevu-kontrole': {
    path: '/tevu-kontrole',
    title: 'Tėvų kontrolė',
    description: 'Geriausi tėvų kontrolės sprendimai ir patarimai, kaip apsaugoti vaikus skaitmeniniame pasaulyje. Apžvalgos, palyginimai ir praktiniai gidai.',
    heroColor: 'bg-blue-50',
    articlePaths: ['/tevu-kontrole/vaiko-telefone'],
    faq: [
      { q: 'Nuo kokio amžiaus reikėtų naudoti tėvų kontrolę?', a: 'Rekomenduojama pradėti naudoti tėvų kontrolės priemones nuo to momento, kai vaikas pradeda naudotis internetu – paprastai nuo 6–7 metų.' },
      { q: 'Ar tėvų kontrolė neriboja vaiko privatumo?', a: 'Svarbu rasti balansą tarp saugumo ir privatumo. Su vyresniais vaikais rekomenduojama aptarti stebėjimo priežastis ir laipsniškai suteikti daugiau laisvės.' },
    ],
  },
  '/slaptazodziu-saugumas': {
    path: '/slaptazodziu-saugumas',
    title: 'Slaptažodžių saugumas',
    description: 'Viskas apie slaptažodžių kūrimą, saugojimą ir tvarkymą. Slaptažodžių tvarkyklių palyginimai ir geriausi saugumo patarimai.',
    heroColor: 'bg-amber-50',
    articlePaths: [],
    faq: [
      { q: 'Koks turėtų būti saugus slaptažodis?', a: 'Saugus slaptažodis turėtų būti bent 12 simbolių ilgio, naudoti didžiąsias ir mažąsias raides, skaičius ir specialius simbolius. Venkite asmeninės informacijos.' },
      { q: 'Ar verta naudoti slaptažodžių tvarkyklę?', a: 'Taip, slaptažodžių tvarkyklė leidžia naudoti unikalius, sudėtingus slaptažodžius kiekvienai paskyrai, neįsiminant jų visų.' },
    ],
  },
};

export const articles: Record<string, Article> = {
  '/antivirusines-programos/nemokamos': {
    slug: 'nemokamos',
    path: '/antivirusines-programos/nemokamos',
    categoryPath: '/antivirusines-programos',
    title: 'Geriausios nemokamos antivirusinės programos 2025 m.',
    excerpt: 'Išsami nemokamų antivirusinių programų apžvalga. Palyginkite funkcijas, apsaugos lygį ir pasirinkite geriausią nemokamą antivirusinę.',
    authorSlug: 'jonas-kazlauskas',
    updatedAt: '2025-03-15',
    readTime: '12 min',
    heroColor: 'bg-emerald-50',
    sections: [
      { id: 'ivadas', title: 'Kodėl verta naudoti nemokamą antivirusinę?', content: 'Net nemokama antivirusinė programa gali suteikti svarbią bazinę apsaugą nuo dažniausių kibernetinių grėsmių. Nors mokamos versijos siūlo platesnį funkcijų spektrą, nemokamos alternatyvos yra puikus pasirinkimas tiems, kurie nori pagrindinės apsaugos be papildomų išlaidų. Šiame straipsnyje apžvelgiame geriausias nemokamas antivirusines programas, kurios veikia efektyviai ir nesulėtina kompiuterio darbo.' },
      { id: 'top-5', title: 'Top 5 nemokamos antivirusinės programos', content: 'Po išsamaus testavimo atrinkome penkias geriausias nemokamas antivirusines programas, kurios pasižymi patikimu virusų aptikimu, nedideliu poveikiu sistemos greičiui ir patogia naudotojo sąsaja.' },
      { id: 'palyginimas', title: 'Funkcijų palyginimas', content: 'Kiekviena nemokama antivirusinė turi savų privalumų ir trūkumų. Vienos geriau aptinka naujausius virusus, kitos naudoja mažiau sistemos resursų, o trečios siūlo papildomų funkcijų kaip interneto apsaugą ar el. pašto filtravimą.' },
      { id: 'isvados', title: 'Išvados ir rekomendacijos', content: 'Pasirinkdami nemokamą antivirusinę, atsižvelkite į savo poreikius. Jei naudojate kompiuterį tik naršymui – pakaks lengvesnės programos. Jei dirbate su svarbiais dokumentais ar finansine informacija – rinkitės antivirusinę su pažangesne apsauga.' },
    ],
    pros: ['Visiškai nemokama', 'Gera bazinė apsauga', 'Automatiniai atnaujinimai', 'Lengva įdiegti'],
    cons: ['Ribota techninė pagalba', 'Gali rodyti reklamas', 'Mažiau papildomų funkcijų'],
    verdict: 'Nemokamos antivirusinės programos yra puikus pasirinkimas bazinei apsaugai. Rekomenduojame Avast Free arba Bitdefender Free kaip geriausius nemokamus variantus.',
    faq: [
      { q: 'Ar nemokamos antivirusinės tikrai apsaugo?', a: 'Taip, geriausios nemokamos antivirusinės aptinka 95–99% žinomų grėsmių. Tačiau mokamos versijos paprastai siūlo pažangesnę apsaugą nuo naujausių grėsmių.' },
      { q: 'Ar nemokamos antivirusinės sulėtina kompiuterį?', a: 'Šiuolaikinės nemokamos antivirusinės yra gana optimizuotos ir neturėtų žymiai sulėtinti kompiuterio darbo.' },
    ],
    relatedPaths: ['/antivirusines-programos/kompiuteriui', '/antivirusines-programos/telefonui'],
  },
  '/antivirusines-programos/telefonui': {
    slug: 'telefonui',
    path: '/antivirusines-programos/telefonui',
    categoryPath: '/antivirusines-programos',
    title: 'Geriausios antivirusinės programos telefonui 2025 m.',
    excerpt: 'Apsaugokite savo telefoną nuo virusų ir kenkėjiškų programų. Apžvelgiame geriausias antivirusines programas Android ir iOS įrenginiams.',
    authorSlug: 'jonas-kazlauskas',
    updatedAt: '2025-02-28',
    readTime: '10 min',
    heroColor: 'bg-sky-50',
    sections: [
      { id: 'ivadas', title: 'Ar telefonui reikia antivirusinės?', content: 'Mobilieji įrenginiai tampa vis dažnesniu kibernetinių atakų taikiniu. Android telefonai yra ypač pažeidžiami dėl atviros ekosistemos, tačiau ir iPhone naudotojai turėtų būti budrūs.' },
      { id: 'android', title: 'Geriausios antivirusinės Android telefonams', content: 'Android operacinė sistema yra populiariausias mobilusis taikiniu kenkėjiškoms programoms. Rekomenduojame rinktis antivirusinę su realaus laiko apsauga ir programų skenavimu.' },
      { id: 'ios', title: 'Antivirusinės iOS įrenginiams', content: 'Nors iOS yra saugesnė sistema, antivirusinės programos vis tiek gali padėti apsaugoti nuo sukčiavimo svetainių ir nesaugių Wi-Fi tinklų.' },
    ],
    pros: ['Realaus laiko apsauga', 'Wi-Fi saugumo tikrinimas', 'Apsauga nuo sukčiavimo'],
    cons: ['Gali naudoti daugiau baterijos', 'Kai kurios funkcijos mokamos'],
    verdict: 'Telefonui rekomenduojame Bitdefender Mobile Security arba Norton Mobile Security kaip patikimiausius sprendimus.',
    faq: [
      { q: 'Ar Android telefonui būtina antivirusinė?', a: 'Labai rekomenduojama, ypač jei diegiate programas ne tik iš Google Play parduotuvės.' },
    ],
    relatedPaths: ['/antivirusines-programos/nemokamos', '/antivirusines-programos/kompiuteriui'],
  },
  '/antivirusines-programos/kompiuteriui': {
    slug: 'kompiuteriui',
    path: '/antivirusines-programos/kompiuteriui',
    categoryPath: '/antivirusines-programos',
    title: 'Geriausios antivirusinės programos kompiuteriui 2025 m.',
    excerpt: 'Išsami antivirusinių programų kompiuteriui apžvalga. Windows ir Mac apsaugos sprendimai – nuo nemokamų iki premium variantų.',
    authorSlug: 'jonas-kazlauskas',
    updatedAt: '2025-03-10',
    readTime: '15 min',
    heroColor: 'bg-violet-50',
    sections: [
      { id: 'ivadas', title: 'Kaip išsirinkti antivirusinę kompiuteriui?', content: 'Renkantis antivirusinę programą kompiuteriui, svarbu atsižvelgti į kelis pagrindinius kriterijus: apsaugos lygį, poveikį sistemos greičiui, papildomas funkcijas ir kainą.' },
      { id: 'windows', title: 'Geriausios antivirusinės Windows sistemai', content: 'Windows yra populiariausia operacinė sistema ir dažniausias kibernetinių atakų taikinys. Todėl kokybiška antivirusinė programa yra būtina.' },
      { id: 'mac', title: 'Antivirusinės Mac kompiuteriams', content: 'Nors Mac kompiuteriai tradiciniu laikomi saugesniais, grėsmių skaičius nuolat auga. Rekomenduojame naudoti specializuotą antivirusinę programą.' },
    ],
    pros: ['Visapusiška apsauga', 'Ugniasienė', 'Interneto apsauga', 'Slaptažodžių tvarkyklė'],
    cons: ['Metinė prenumerata', 'Gali sulėtinti senesnius kompiuterius'],
    verdict: 'Kompiuteriui rekomenduojame Norton 360 arba Bitdefender Total Security kaip geriausius visapusiškos apsaugos sprendimus.',
    faq: [
      { q: 'Ar pakanka Windows Defender?', a: 'Windows Defender suteikia bazinę apsaugą, tačiau trečiųjų šalių antivirusinės paprastai siūlo pažangesnę apsaugą ir daugiau funkcijų.' },
    ],
    relatedPaths: ['/antivirusines-programos/nemokamos', '/antivirusines-programos/telefonui'],
  },
  '/tevu-kontrole/vaiko-telefone': {
    slug: 'vaiko-telefone',
    path: '/tevu-kontrole/vaiko-telefone',
    categoryPath: '/tevu-kontrole',
    title: 'Tėvų kontrolė vaiko telefone: viskas, ką reikia žinoti',
    excerpt: 'Kaip nustatyti tėvų kontrolę vaiko telefone? Geriausi sprendimai Android ir iPhone įrenginiams, praktiniai patarimai tėvams.',
    authorSlug: 'gabija-petraityte',
    updatedAt: '2025-03-01',
    readTime: '11 min',
    heroColor: 'bg-blue-50',
    sections: [
      { id: 'ivadas', title: 'Kodėl svarbu naudoti tėvų kontrolę?', content: 'Vaikai vis daugiau laiko praleidžia prie ekranų, todėl tėvų kontrolės priemonės tampa būtinos norint užtikrinti jų saugumą skaitmeniniame pasaulyje.' },
      { id: 'android-nustatymai', title: 'Tėvų kontrolė Android telefone', content: 'Android sistema siūlo kelis integruotus tėvų kontrolės sprendimus, taip pat galite naudoti trečiųjų šalių programas platesniam funkcionalumui.' },
      { id: 'iphone-nustatymai', title: 'Tėvų kontrolė iPhone telefone', content: 'Apple Screen Time funkcija leidžia lengvai nustatyti laiko limitus, turinio filtrus ir privatumo nustatymus vaikų iPhone įrenginiuose.' },
    ],
    pros: ['Apsauga nuo netinkamo turinio', 'Ekrano laiko valdymas', 'Vietos stebėjimas'],
    cons: ['Vaikai gali bandyti apeiti', 'Reikalauja tėvų dėmesio nustatymams'],
    faq: [
      { q: 'Kokia geriausia tėvų kontrolės programa?', a: 'Populiariausios ir geriausiai vertinamos programos yra Qustodio, Bark ir Google Family Link.' },
    ],
    relatedPaths: ['/antivirusines-programos/telefonui'],
  },
  '/virusai/kompiuterinis-virusas': {
    slug: 'kompiuterinis-virusas',
    path: '/virusai/kompiuterinis-virusas',
    categoryPath: '/virusai',
    title: 'Kompiuterinis virusas: kas tai, tipai ir kaip apsisaugoti',
    excerpt: 'Išsamus gidas apie kompiuterinius virusus – kaip jie veikia, kokie yra pagrindiniai tipai ir kaip efektyviai nuo jų apsisaugoti.',
    authorSlug: 'matas-jonaitis',
    updatedAt: '2025-01-20',
    readTime: '14 min',
    heroColor: 'bg-red-50',
    sections: [
      { id: 'kas-yra', title: 'Kas yra kompiuterinis virusas?', content: 'Kompiuterinis virusas yra kenkėjiška programa, kuri gali replikuotis ir plisti iš vieno kompiuterio į kitą. Virusai gali sugadinti failus, pavogti duomenis arba sulėtinti sistemos darbą.' },
      { id: 'tipai', title: 'Pagrindiniai virusų tipai', content: 'Egzistuoja daugybė skirtingų virusų tipų: failų virusai, makro virusai, boot sektoriaus virusai, trojanai, kirminai ir ransomware. Kiekvienas tipas turi savo plitimo būdą ir poveikį.' },
      { id: 'pozymiai', title: 'Kaip atpažinti užkrėstą kompiuterį?', content: 'Pagrindiniai požymiai: kompiuteris veikia lėčiau nei įprastai, pasirodo neįprastos klaidos, naršyklė nukreipia į nežinomas svetaines, atsiranda nepažįstamų programų.' },
      { id: 'apsauga', title: 'Kaip apsisaugoti nuo virusų?', content: 'Naudokite patikimą antivirusinę programą, reguliariai atnaujinkite operacinę sistemą, neatidarinėkite įtartinų el. laiškų priedų ir atsargiai elkitės su nežinomomis nuorodomis.' },
    ],
    faq: [
      { q: 'Ar virusas gali sugadinti kompiuterio aparatinę įrangą?', a: 'Dauguma virusų negali tiesiogiai sugadinti aparatinės įrangos, tačiau kai kurie gali perkaitinti procesorių ar sugadinti BIOS.' },
    ],
    relatedPaths: ['/virusai/virusas-telefone', '/antivirusines-programos/kompiuteriui'],
  },
  '/virusai/virusas-telefone': {
    slug: 'virusas-telefone',
    path: '/virusai/virusas-telefone',
    categoryPath: '/virusai',
    title: 'Virusas telefone: požymiai, šalinimas ir apsauga',
    excerpt: 'Kaip suprasti, ar telefonas užkrėstas virusu? Praktinis gidas apie mobiliųjų virusų požymius, šalinimą ir prevenciją.',
    authorSlug: 'matas-jonaitis',
    updatedAt: '2025-02-10',
    readTime: '9 min',
    heroColor: 'bg-orange-50',
    sections: [
      { id: 'pozymiai', title: 'Telefono viruso požymiai', content: 'Dažniausi požymiai, kad telefonas gali būti užkrėstas: greitai senka baterija, padidėjęs duomenų naudojimas, neįprastos reklamos, lėtas veikimas ir nepažįstamos programos.' },
      { id: 'salinimas', title: 'Kaip pašalinti virusą iš telefono?', content: 'Pirmiausia pabandykite paleisti telefoną saugiuoju režimu ir pašalinti įtartinas programas. Jei tai nepadeda, naudokite patikimą antivirusinę programą arba atstatykite gamyklinius nustatymus.' },
    ],
    faq: [
      { q: 'Ar iPhone gali gauti virusą?', a: 'Tai labai reta, tačiau iPhone gali būti pažeidžiamas per sukčiavimo atakas ir nesaugias svetaines.' },
    ],
    relatedPaths: ['/virusai/kompiuterinis-virusas', '/antivirusines-programos/telefonui'],
  },
  '/saugumo-patarimai/saugus-darbas-kompiuteriu': {
    slug: 'saugus-darbas-kompiuteriu',
    path: '/saugumo-patarimai/saugus-darbas-kompiuteriu',
    categoryPath: '/saugumo-patarimai',
    title: 'Saugus darbas kompiuteriu: 15 esminių patarimų',
    excerpt: 'Praktiniai patarimai saugiam darbui kompiuteriu. Nuo slaptažodžių iki atsarginių kopijų – viskas, ką turite žinoti.',
    authorSlug: 'gabija-petraityte',
    updatedAt: '2025-03-05',
    readTime: '8 min',
    heroColor: 'bg-teal-50',
    sections: [
      { id: 'pagrindai', title: 'Saugumo pagrindai', content: 'Saugus darbas kompiuteriu prasideda nuo kelių esminių principų: stiprūs slaptažodžiai, reguliarūs atnaujinimai, atsargumas su el. laiškais ir patikima antivirusinė programa.' },
      { id: 'slaptazodziai', title: 'Slaptažodžių saugumas', content: 'Naudokite unikalius, sudėtingus slaptažodžius kiekvienai paskyrai. Slaptažodžių tvarkyklė gali padėti valdyti daugybę slaptažodžių be rizikos juos pamiršti.' },
      { id: 'atsargines-kopijos', title: 'Atsarginės kopijos', content: 'Reguliariai darykite svarbių failų atsargines kopijas. Naudokite 3-2-1 taisyklę: 3 kopijos, 2 skirtingos laikmenos, 1 kopija kitoje vietoje.' },
    ],
    faq: [
      { q: 'Kaip dažnai reikia keisti slaptažodžius?', a: 'Šiuolaikinės rekomendacijos siūlo keisti slaptažodžius tik tada, kai įtariate, kad jie galėjo būti pažeisti, o ne reguliariai kas kelis mėnesius.' },
    ],
    relatedPaths: ['/antivirusines-programos/nemokamos'],
  },
};


export const navLinks = [
  { label: 'Antivirusinės', path: '/antivirusines-programos' },
  { label: 'Tėvų kontrolė', path: '/tevu-kontrole' },
  { label: 'Slaptažodžiai', path: '/slaptazodziu-saugumas' },
  { label: 'Virusai', path: '/virusai/kompiuterinis-virusas' },
];

export const staticPages: Record<string, { title: string; content: string }> = {
  '/apie': {
    title: 'Apie mus',
    content: `<p>antivirusines.lt – tai nepriklausomas kibernetinio saugumo informacijos portalas, skirtas lietuviškai kalbančiai auditorijai.</p>
<p>Mūsų misija – padėti žmonėms apsaugoti savo skaitmeninius įrenginius ir asmeninius duomenis nuo kibernetinių grėsmių. Tai darome teikdami objektyvias antivirusinių programų apžvalgas, praktines saugumo gidus ir suprantamus patarimus.</p>
<h2>Mūsų vertybės</h2>
<p>Objektyvumas. Kiekviena mūsų apžvalga remiasi išsamiu testavimu ir nepriklausomu vertinimu. Mes nesame susiję su jokiu antivirusinės programinės įrangos gamintoju.</p>
<p>Prieinamumas. Rašome aiškia, suprantama kalba, kad kibernetinis saugumas būtų prieinamas kiekvienam.</p>
<p>Aktualumas. Nuolat atnaujiname savo turinį, kad informacija atitiktų naujausias grėsmes ir sprendimus.</p>
<h2>Mūsų komanda</h2>
<p>Esame maža, bet patyrusi kibernetinio saugumo entuziastų komanda, jungianti IT specialistus, žurnalistus ir edukatorius.</p>`,
  },
  '/kontaktai': {
    title: 'Kontaktai',
    content: `<p>Turite klausimų, pasiūlymų ar pastebėjimų? Mielai išklausysime!</p>
<h2>Susisiekite su mumis</h2>
<p>El. paštas: <a href="mailto:info@antivirusines.lt">info@antivirusines.lt</a></p>
<p>Atsakome per 1–2 darbo dienas.</p>
<h2>Bendradarbiavimas</h2>
<p>Jei norite bendradarbiauti, siūlyti turinį ar aptarti partnerystės galimybes, rašykite mums el. paštu su tema „Bendradarbiavimas".</p>
<p>Dėmesio: mes nepublikuojame mokamų straipsnių, kurie neatitinka mūsų redakcinių standartų.</p>`,
  },
  '/affiliate-atskleidimas': {
    title: 'Affiliate atskleidimas',
    content: `<p>antivirusines.lt dalyvauja affiliate (partnerinio) rinkodaros programose. Tai reiškia, kad kai kuriuose mūsų straipsniuose rasite nuorodas į produktus, už kurių įsigijimą galime gauti komisinį atlyginimą.</p>
<h2>Ką tai reiškia jums?</h2>
<p>Jums tai nekainuoja papildomai. Produkto kaina lieka tokia pati, nepriklausomai nuo to, ar perkate per mūsų nuorodą, ar tiesiogiai.</p>
<h2>Ar tai veikia mūsų apžvalgas?</h2>
<p>Ne. Mūsų redakcinė komanda vertina produktus nepriklausomai. Affiliate pajamos padeda mums finansuoti svetainę ir kurti kokybišką turinį, tačiau neturi įtakos mūsų vertinimams ar rekomendacijoms.</p>
<p>Visada siekiame pateikti objektyvią ir naudingą informaciją mūsų skaitytojams.</p>`,
  },
  '/privatumo-politika': {
    title: 'Privatumo politika',
    content: `<p>Ši privatumo politika aprašo, kaip antivirusines.lt renka, naudoja ir saugo jūsų asmeninę informaciją.</p>
<h2>Kokią informaciją renkame?</h2>
<p>Automatiškai renkame anoniminius naršymo duomenis (IP adresas, naršyklės tipas, puslapių peržiūros) naudodami analitikos įrankius.</p>
<h2>Kaip naudojame informaciją?</h2>
<p>Renkamą informaciją naudojame svetainės veikimui gerinti, turiniui optimizuoti ir naudotojų patirčiai tobulinti.</p>
<h2>Trečiosios šalys</h2>
<p>Galime dalintis anoniminiais statistiniais duomenimis su analitikos paslaugų teikėjais. Asmeninė informacija nėra parduodama ar perduodama tretiesiems asmenims be jūsų sutikimo.</p>
<h2>Jūsų teisės</h2>
<p>Pagal BDAR turite teisę prašyti prieigos prie savo duomenų, jų ištaisymo ar ištrynimo. Kreipkitės el. paštu info@antivirusines.lt.</p>`,
  },
  '/slapuku-politika': {
    title: 'Slapukų politika',
    content: `<p>antivirusines.lt naudoja slapukus (cookies), kad užtikrintų geriausią naršymo patirtį.</p>
<h2>Kas yra slapukai?</h2>
<p>Slapukai yra maži tekstiniai failai, kurie saugomi jūsų naršyklėje, kai lankotės svetainėje. Jie padeda svetainei atpažinti jūsų įrenginį ir prisiminti nustatymus.</p>
<h2>Kokius slapukus naudojame?</h2>
<p>Būtinieji slapukai – reikalingi svetainės veikimui. Analitiniai slapukai – padeda suprasti, kaip lankytojai naudoja svetainę. Reklaminiai slapukai – naudojami rodyti aktualesnę reklamą.</p>
<h2>Kaip valdyti slapukus?</h2>
<p>Galite valdyti slapukus savo naršyklės nustatymuose. Atkreipkite dėmesį, kad išjungus kai kuriuos slapukus, svetainė gali veikti ne visiškai korektiškai.</p>`,
  },
};

export function getArticlesByAuthor(authorSlug: string): Article[] {
  return Object.values(articles).filter(a => a.authorSlug === authorSlug);
}

export function getBreadcrumbs(path: string): { label: string; path: string }[] {
  const crumbs: { label: string; path: string }[] = [{ label: 'Pradžia', path: '/' }];
  const segments = path.split('/').filter(Boolean);

  const labelMap: Record<string, string> = {
    'antivirusines-programos': 'Antivirusinės programos',
    'tevu-kontrole': 'Tėvų kontrolė',
    'slaptazodziu-saugumas': 'Slaptažodžių saugumas',
    'virusai': 'Virusai',
    'saugumo-patarimai': 'Saugumo patarimai',
    'autoriai': 'Autoriai',
    'apie': 'Apie mus',
    'kontaktai': 'Kontaktai',
    'affiliate-atskleidimas': 'Affiliate atskleidimas',
    'privatumo-politika': 'Privatumo politika',
    'slapuku-politika': 'Slapukų politika',
  };

  let currentPath = '';
  for (const seg of segments) {
    currentPath += '/' + seg;
    const article = articles[currentPath];
    const label = article?.title || labelMap[seg] || seg;
    crumbs.push({ label, path: currentPath });
  }

  return crumbs;
}
