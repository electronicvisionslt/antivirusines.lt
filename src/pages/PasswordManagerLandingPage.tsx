import {
  Key, Shield, Lock, Smartphone, Monitor, Globe, CheckCircle2, XCircle,
  Star, ExternalLink, ChevronRight, HelpCircle, Zap, Users, BarChart3,
  Fingerprint, Eye, RefreshCw, ArrowRight, Layers, Award, ShieldCheck,
} from 'lucide-react';
import PageLayout from '@/components/site/PageLayout';
import Breadcrumbs from '@/components/site/Breadcrumbs';
import FAQAccordion from '@/components/content/FAQAccordion';
import TrustDisclosure from '@/components/content/TrustDisclosure';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Link } from 'react-router-dom';
import { SectionHeading, useUpdatedLabel } from '@/components/landing/LandingShared';
import LandingHeroBackground from '@/components/site/LandingHeroBackground';
import type { PublicCategory } from '@/types/content';

interface Props { category: PublicCategory }

/* ── Product data (editorial, not from DB — password managers are a different product category) ── */
interface PMProduct {
  name: string;
  brand: string;
  rating: number;
  bestFor: string;
  pricing: string;
  freeVersion: boolean;
  url: string;
  encryption: string;
  platforms: string[];
  maxPasswords: string;
  devices: string;
  twoFA: boolean;
  passwordSharing: boolean;
  breachMonitor: boolean;
  passkey: boolean;
  pros: string[];
  cons: string[];
  verdict: string;
}

const products: PMProduct[] = [
  {
    name: '1Password',
    brand: '1Password',
    rating: 9.6,
    bestFor: 'Geriausia visapusiškai',
    pricing: 'Nuo 2,99 $/mėn.',
    freeVersion: false,
    url: 'https://1password.com',
    encryption: 'AES-256 + PBKDF2',
    platforms: ['Windows', 'Mac', 'Android', 'iOS', 'Linux'],
    maxPasswords: 'Neribota',
    devices: 'Neribota',
    twoFA: true,
    passwordSharing: true,
    breachMonitor: true,
    passkey: true,
    pros: ['Watchtower — pažangus saugumo auditas', 'Travel Mode kelionėms', 'Passkey palaikymas', 'Šeimos planas iki 5 narių'],
    cons: ['Nėra nemokamo plano', 'Brangesnis nei alternatyvos'],
    verdict: 'Premium pasirinkimas su stipriausiomis saugumo funkcijomis. Watchtower analizuoja silpnus, pakartotinius ir nutekėjusius slaptažodžius realiu laiku.',
  },
  {
    name: 'Bitwarden',
    brand: 'Bitwarden',
    rating: 9.5,
    bestFor: 'Geriausia nemokama',
    pricing: 'Nuo 0 € (Premium 10 $/m.)',
    freeVersion: true,
    url: 'https://bitwarden.com',
    encryption: 'AES-256 + Argon2',
    platforms: ['Windows', 'Mac', 'Android', 'iOS', 'Linux'],
    maxPasswords: 'Neribota',
    devices: 'Neribota',
    twoFA: true,
    passwordSharing: false,
    breachMonitor: true,
    passkey: true,
    pros: ['Pilnai nemokama versija be ribojimų', 'Atviras kodas, nepriklausomai audituotas', 'Self-hosting galimybė', 'Palaikymas visose platformose'],
    cons: ['Sąsaja paprastesnė nei konkurentų', 'Automatinis užpildymas kartais netobulas'],
    verdict: 'Geriausia nemokama slaptažodžių tvarkyklė rinkoje. Atviro kodo, reguliariai audituojama ir siūlo neribotą slaptažodžių saugyklą visuose įrenginiuose nemokamai.',
  },
  {
    name: 'NordPass',
    brand: 'NordPass',
    rating: 9.4,
    bestFor: 'Paprasčiausia naudoti',
    pricing: 'Nuo 1,49 $/mėn.',
    freeVersion: true,
    url: 'https://nordpass.com',
    encryption: 'XChaCha20',
    platforms: ['Windows', 'Mac', 'Android', 'iOS', 'Linux'],
    maxPasswords: 'Neribota',
    devices: 'Neribota (mokama)',
    twoFA: true,
    passwordSharing: true,
    breachMonitor: true,
    passkey: true,
    pros: ['XChaCha20 — pažangesnė nei AES šifravimas', 'Labai paprasta sąsaja', 'Data Breach Scanner', 'Nemokama versija su neribotais slaptažodžiais'],
    cons: ['Nemokamoje versijoje — tik 1 įrenginys', 'Mažiau pažangių funkcijų nei 1Password'],
    verdict: 'Puikus balansas tarp paprastumo ir saugumo. XChaCha20 šifravimas yra vienas pažangiausių rinkoje, o intuityvi sąsaja tinka ir pradedantiesiems.',
  },
  {
    name: 'RoboForm',
    brand: 'RoboForm',
    rating: 9.3,
    bestFor: 'Geriausias formų užpildymas',
    pricing: 'Nuo 0,99 $/mėn.',
    freeVersion: true,
    url: 'https://roboform.com',
    encryption: 'AES-256',
    platforms: ['Windows', 'Mac', 'Android', 'iOS'],
    maxPasswords: 'Neribota',
    devices: 'Neribota (mokama)',
    twoFA: true,
    passwordSharing: true,
    breachMonitor: true,
    passkey: false,
    pros: ['Geriausias automatinis formų užpildymas', 'Labai pigi Premium versija', 'Nemokama versija su neribotais slaptažodžiais', 'Saugi dalinimosi funkcija'],
    cons: ['Sąsaja atrodo seniau nei konkurentų', 'Nėra passkey palaikymo'],
    verdict: 'Viena pigiausių premium tvarkyklių su puikiu formų užpildymu. Nemokamoje versijoje — neriboti slaptažodžiai ir duomenų nutekėjimo stebėjimas.',
  },
  {
    name: 'Proton Pass',
    brand: 'Proton',
    rating: 9.2,
    bestFor: 'Geriausia privatumui',
    pricing: 'Nuo 0 € (Plus 3,99 €/mėn.)',
    freeVersion: true,
    url: 'https://proton.me/pass',
    encryption: 'AES-256 + Argon2',
    platforms: ['Windows', 'Mac', 'Android', 'iOS', 'Linux'],
    maxPasswords: 'Neribota',
    devices: 'Neribota',
    twoFA: true,
    passwordSharing: true,
    breachMonitor: true,
    passkey: true,
    pros: ['Šveicarijoje registruota — griežčiausi privatumo įstatymai', 'Nemokama versija sinchronizuoja visus įrenginius', 'Integruotas el. pašto maskavimas', 'Atviras kodas'],
    cons: ['Mažiau naršyklių plėtinių', 'Jaunesnė nei konkurentai'],
    verdict: 'Privatumui orientuota tvarkyklė iš Proton ekosistemos. Nemokamoje versijoje — neriboti slaptažodžiai ir pilna sinchronizacija tarp visų įrenginių.',
  },
];

/* ── Feature columns ── */
const featureCols = [
  { key: 'encryption', label: 'Šifravimas' },
  { key: 'maxPasswords', label: 'Slaptažodžių limitas' },
  { key: 'devices', label: 'Įrenginiai' },
  { key: 'twoFA', label: '2FA' },
  { key: 'passwordSharing', label: 'Dalinimasis' },
  { key: 'breachMonitor', label: 'Nutekėjimų stebėjimas' },
  { key: 'passkey', label: 'Passkey' },
];

/* ── FAQ ── */
const faqItems = [
  { q: 'Kas yra slaptažodžių tvarkyklė ir kam ji reikalinga?', a: 'Slaptažodžių tvarkyklė — programa, kuri saugiai saugo visus jūsų slaptažodžius vienoje šifruotoje saugykloje. Jums tereikia atsiminti vieną pagrindinį slaptažodį (master password). Tvarkyklė automatiškai sugeneruoja stiprius, unikalius slaptažodžius kiekvienai paskyrai ir juos užpildo prisijungiant.' },
  { q: 'Ar nemokamos slaptažodžių tvarkyklės yra saugios?', a: 'Taip, patikimų gamintojų nemokamos versijos (Bitwarden, NordPass, Proton Pass) naudoja tokį patį šifravimą kaip ir mokamos. Pagrindiniai skirtumai — ribojamas įrenginių skaičius arba papildomos funkcijos kaip slaptažodžių dalinimasis.' },
  { q: 'Kuo slaptažodžių tvarkyklė geresnė už naršyklės saugyklą?', a: 'Naršyklės saugykla veikia tik toje naršyklėje ir dažnai neturi master password apsaugos. Dedikuota tvarkyklė: 1) Veikia visose platformose ir naršyklėse; 2) Turi master password; 3) Siūlo slaptažodžių generatorių; 4) Stebi duomenų nutekėjimus; 5) Apsaugo nuo keyloggerių.' },
  { q: 'Ką daryti, jei pamiršiu master password?', a: 'Dauguma tvarkyklių turi atkūrimo mechanizmus: atsarginiai kodai, biometrinė prieiga, šeimos narių atkūrimas. Tačiau kai kurios (pvz., Bitwarden) negali atkurti master password dėl zero-knowledge architektūros. Svarbu saugiai užsirašyti master password.' },
  { q: 'Ar verta mokėti už slaptažodžių tvarkyklę?', a: 'Jei turite 1–2 įrenginius ir jums nereikia slaptažodžių dalinimosi — nemokama versija gali pakakti (ypač Bitwarden). Mokama versija verta, jei: reikia šeimos plano, pažangaus nutekėjimų stebėjimo, prioritetinio palaikymo ar YubiKey palaikymo.' },
  { q: 'Ar slaptažodžių tvarkyklė apsaugo nuo phishing atakų?', a: 'Taip, iš dalies. Tvarkyklė automatiškai užpildo slaptažodžius tik tikroje svetainėje — jei apsilankote suklastotoje, tvarkyklė nepasiūlys užpildyti slaptažodžio, ir tai yra ženklas, kad svetainė gali būti netikra.' },
];

/* ── Use cases ── */
const useCases = [
  { icon: Award, title: 'Geriausia visapusiškai', desc: 'Stipriausios saugumo funkcijos, Watchtower auditas, passkey ir Travel Mode.', product: '1Password', tag: '🥇 Nr. 1' },
  { icon: Zap, title: 'Geriausia nemokama', desc: 'Pilnai nemokama, atviro kodo, audituota, neriboti slaptažodžiai visuose įrenginiuose.', product: 'Bitwarden', tag: 'Nemokama' },
  { icon: Eye, title: 'Geriausia privatumui', desc: 'Šveicarijos jurisdikcija, atviras kodas, el. pašto maskavimas, nemokama sinchronizacija.', product: 'Proton Pass', tag: 'Privatumas' },
  { icon: Users, title: 'Geriausia šeimoms', desc: 'Šeimos planas iki 5 narių, saugus dalinimasis ir centralizuotas valdymas.', product: '1Password', tag: 'Šeimoms' },
  { icon: Fingerprint, title: 'Paprasčiausia naudoti', desc: 'Intuityvi sąsaja, XChaCha20 šifravimas, Data Breach Scanner.', product: 'NordPass', tag: 'Lengva' },
];

/* ── Jump links ── */
const jumpLinks = [
  { href: '#top-5', label: 'Top 5', icon: Award },
  { href: '#palyginimas', label: 'Palyginimas', icon: BarChart3 },
  { href: '#pagal-poreiki', label: 'Pagal poreikį', icon: Layers },
  { href: '#nemokama-vs-mokama', label: 'Nemokama vs mokama', icon: Zap },
  { href: '#kaip-pasirinkti', label: 'Kaip pasirinkti', icon: Shield },
  { href: '#duk', label: 'DUK', icon: HelpCircle },
];

/* ── Buyer guide ── */
const buyerGuide = [
  { q: 'Kiek įrenginių naudojate?', a: 'Vienam įrenginiui — Bitwarden ar Proton Pass nemokama versija. Keliems — rinkitės tvarkyklę su neribota sinchronizacija (Bitwarden, Proton Pass nemokamai arba bet kuri mokama).', icon: Monitor },
  { q: 'Ar reikia šeimos plano?', a: 'Šeimoms geriausia — 1Password Family (iki 5 narių, privatūs ir bendri seifai). Bitwarden Organizations taip pat tinka, nors sąsaja paprastesnė.', icon: Users },
  { q: 'Ar svarbus privatumas?', a: 'Jei privatumas prioritetas — Proton Pass (Šveicarija, atviras kodas) arba Bitwarden (atviras kodas, self-hosting galimybė).', icon: Shield },
  { q: 'Kokia kaina priimtina?', a: '0 € — Bitwarden, Proton Pass. 1–3 $/mėn. — NordPass, RoboForm. 3–5 $/mėn. — 1Password (premium funkcijos). Šeimos planai paprastai kainuoja dvigubai.', icon: BarChart3 },
  { q: 'Ar reikia passkey palaikymo?', a: 'Passkeys — ateities standartas. 1Password, Bitwarden, NordPass ir Proton Pass jau palaiko. RoboForm dar ne.', icon: Fingerprint },
  { q: 'Ar norite self-hosting?', a: 'Jei norite pilnos kontrolės — Bitwarden vienintelė populiari tvarkyklė, leidžianti saugoti duomenis savo serveryje.', icon: Lock },
];

/* ── Related guides (internal linking) ── */
const relatedGuides = [
  { path: '/slaptazodziu-saugumas', label: 'Slaptažodžių saugumo centras', desc: 'NIST 2026 gairės ir praktiniai patarimai', icon: Key },
  { path: '/slaptazodziu-saugumas/kaip-pakeisti-gmail-slaptazodi', label: 'Kaip pakeisti Gmail slaptažodį', desc: 'Žingsnis po žingsnio instrukcija', icon: RefreshCw },
  { path: '/slaptazodziu-saugumas/ka-daryti-pamirsus-slaptazodi', label: 'Ką daryti pamiršus slaptažodį', desc: 'Atkūrimo gidas populiariausioms paskyroms', icon: HelpCircle },
  { path: '/antivirusines-programos', label: 'Antivirusinės programos 2026', desc: 'Apsauga nuo keyloggerių ir spyware', icon: Shield },
  { path: '/virusai/kompiuterinis-virusas', label: 'Kompiuterinis virusas', desc: 'Kaip virusai vagia slaptažodžius', icon: ShieldCheck },
];

/* ═══════════════════════════════════════════ */

const PasswordManagerLandingPage = ({ category }: Props) => {
  usePageMeta({
    title: category.seoTitle || 'Geriausios slaptažodžių tvarkyklės 2026 — palyginimas ir apžvalgos',
    description: category.metaDescription || 'Nepriklausomos slaptažodžių tvarkyklių apžvalgos. Palyginimas pagal saugumą, funkcijas, nemokamas versijas ir kainą. Raskite geriausią 2026 m.',
    canonicalUrl: category.canonicalUrl || undefined,
  });

  return (
    <PageLayout>
      <div className="container py-8 max-w-5xl mx-auto">
        <Breadcrumbs path={category.path} items={[
          { label: 'Pradžia', path: '/' },
          { label: 'Slaptažodžių saugumas', path: '/slaptazodziu-saugumas' },
          { label: 'Slaptažodžių tvarkyklės', path: '/slaptazodziu-saugumas/slaptazodziu-tvarkykles' },
        ]} />

        {/* ═══ 1. HERO ═══ */}
        <LandingHeroBackground variant="password">
          <h1 className="font-heading text-3xl md:text-4xl lg:text-[2.85rem] font-extrabold text-foreground leading-[1.08] mb-3 tracking-tight">
            Geriausios slaptažodžių tvarkyklės 2026&nbsp;m.
          </h1>
          <p className="text-muted-foreground text-[15px] leading-relaxed max-w-2xl mb-6">
            Išanalizavome populiariausias slaptažodžių tvarkykles pagal saugumą, funkcijas ir kainą. 
            Žemiau — redakcijos Top&nbsp;5, detalus palyginimas ir patarimai, kaip pasirinkti tinkamiausią.
          </p>

          {/* Quick winner badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
            <a href="#top-5" className="card-premium-featured p-3.5 flex items-center gap-3 hover-lift group">
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/12 flex items-center justify-center shrink-0 elevation-1 w-[44px] h-[44px]">
                <span className="font-heading font-bold text-primary text-sm">1P</span>
              </div>
              <div className="min-w-0">
                <span className="chip-primary mb-1">Geriausia 2026</span>
                <span className="text-sm text-foreground font-semibold block leading-tight">1Password</span>
                <span className="text-[11px] text-muted-foreground">Nuo 2,99 $/mėn.</span>
              </div>
            </a>
            <a href="#top-5" className="card-premium p-3.5 flex items-center gap-3 hover-lift group">
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/12 flex items-center justify-center shrink-0 elevation-1 w-[44px] h-[44px]">
                <span className="font-heading font-bold text-primary text-sm">BW</span>
              </div>
              <div className="min-w-0">
                <span className="chip-success mb-1">Geriausia nemokama</span>
                <span className="text-sm text-foreground font-semibold block leading-tight">Bitwarden</span>
                <span className="text-[11px] text-muted-foreground">Nemokama</span>
              </div>
            </a>
            <a href="#pagal-poreiki" className="card-premium p-3.5 flex items-center gap-3 hover-lift group">
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/12 flex items-center justify-center shrink-0 elevation-1 w-[44px] h-[44px]">
                <span className="font-heading font-bold text-primary text-sm">PP</span>
              </div>
              <div className="min-w-0">
                <span className="chip-primary mb-1">Geriausia privatumui</span>
                <span className="text-sm text-foreground font-semibold block leading-tight">Proton Pass</span>
                <span className="text-[11px] text-muted-foreground">Nemokama</span>
              </div>
            </a>
          </div>

          {/* Jump nav */}
          <nav className="flex flex-wrap gap-1.5" aria-label="Greitoji navigacija">
            {jumpLinks.map(link => {
              const Icon = link.icon;
              return (
                <a key={link.href} href={link.href}
                   className="text-[11px] font-heading font-medium px-3 py-2 rounded-lg bg-card text-muted-foreground hover:text-primary hover:border-primary/20 border border-border/50 transition-all duration-200 inline-flex items-center gap-1.5 elevation-1">
                  <Icon className="w-3 h-3" />{link.label}
                </a>
              );
            })}
          </nav>
        </LandingHeroBackground>

        <div className="section-divider mb-10" />

        {/* ═══ 2. TOP 5 ═══ */}
        <section id="top-5" className="mb-16 scroll-mt-20">
          <SectionHeading title="Top 5 slaptažodžių tvarkyklės" subtitle="Programos, kurios šiandien siūlo geriausią saugumo, funkcijų ir kainos derinį." className="mb-6" />

          <div className="space-y-3">
            {products.map((product, i) => (
              <div key={product.name}
                   className={`relative overflow-hidden transition-all duration-200 ${i === 0 ? 'card-premium-featured' : 'card-premium'}`}>
                {i === 0 && <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/40 via-primary to-primary/40" />}

                <div className="p-4 md:p-5">
                  {/* Desktop row */}
                  <div className="hidden md:grid md:grid-cols-[28px_52px_1fr_120px_110px_160px] lg:grid-cols-[30px_52px_1fr_130px_120px_170px] items-center gap-x-3">
                    <span className={`font-heading font-extrabold text-2xl tabular-nums text-center shrink-0 ${i === 0 ? 'text-primary' : 'text-muted-foreground/25'}`}>
                      {i + 1}
                    </span>
                    <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/12 flex items-center justify-center shrink-0 elevation-1 w-[48px] h-[48px]">
                      <span className="font-heading font-bold text-primary text-xs">
                        {product.brand.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-heading font-bold text-foreground text-[15px] leading-tight">{product.name}</h3>
                        {i === 0 && <span className="chip-primary">Nr. 1</span>}
                        {product.freeVersion && i !== 0 && <span className="chip-success">Nemokama</span>}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{product.bestFor}</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(product.rating / 2) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted-foreground/20'}`} />
                      ))}
                      <span className="ml-1.5 text-xs font-bold text-foreground tabular-nums">{product.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-sm font-heading font-bold text-foreground whitespace-nowrap">{product.pricing}</span>
                    <div className="justify-self-end">
                      <a href={product.url} target="_blank" rel="nofollow sponsored noopener noreferrer"
                         className="inline-flex items-center justify-center gap-1.5 font-heading font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.97] elevation-primary px-5 py-2.5 text-sm whitespace-nowrap">
                        Apsilankyti <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Desktop details */}
                  <div className="hidden md:block mt-3 pt-3 border-t border-border/30">
                    <p className="text-[12.5px] text-muted-foreground leading-relaxed mb-3">{product.verdict}</p>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                      <div>
                        <p className="section-label text-[9px] mb-1.5">Privalumai</p>
                        <ul className="space-y-0.5">
                          {product.pros.slice(0, 3).map((pro, j) => (
                            <li key={j} className="flex items-start gap-1.5 text-[12px] text-muted-foreground leading-snug">
                              <CheckCircle2 className="w-3 h-3 text-success mt-0.5 shrink-0" />{pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="section-label text-[9px] mb-1.5">Trūkumai</p>
                        <ul className="space-y-0.5">
                          {product.cons.map((con, j) => (
                            <li key={j} className="flex items-start gap-1.5 text-[12px] text-muted-foreground leading-snug">
                              <XCircle className="w-3 h-3 text-muted-foreground/30 mt-0.5 shrink-0" />{con}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="section-label text-[9px] mb-1.5">Specifikacijos</p>
                        <div className="space-y-0.5 text-[11px] text-muted-foreground">
                          <p>🔐 {product.encryption}</p>
                          <p>📱 {product.platforms.join(', ')}</p>
                          <p>🔑 Slaptažodžiai: {product.maxPasswords}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile layout */}
                  <div className="md:hidden">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`font-heading font-extrabold text-2xl tabular-nums w-7 text-center shrink-0 ${i === 0 ? 'text-primary' : 'text-muted-foreground/25'}`}>
                        {i + 1}
                      </span>
                      <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/12 flex items-center justify-center shrink-0 elevation-1 w-[44px] h-[44px]">
                        <span className="font-heading font-bold text-primary text-xs">{product.brand.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-heading font-bold text-foreground text-[15px] leading-tight">{product.name}</h3>
                          {i === 0 && <span className="chip-primary">Nr. 1</span>}
                          {product.freeVersion && i !== 0 && <span className="chip-success">Nemokama</span>}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{product.bestFor}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-xs font-bold text-foreground">{product.rating.toFixed(1)}/10</span>
                      <span className="text-sm font-heading font-bold text-foreground">{product.pricing}</span>
                    </div>
                    <p className="text-[12px] text-muted-foreground leading-relaxed mb-2">{product.verdict}</p>
                    <div className="mb-2 pt-2 border-t border-border/30">
                      <ul className="space-y-0.5 mb-2">
                        {product.pros.slice(0, 3).map((pro, j) => (
                          <li key={j} className="flex items-start gap-1.5 text-[12px] text-muted-foreground leading-snug">
                            <CheckCircle2 className="w-3 h-3 text-success mt-0.5 shrink-0" />{pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <a href={product.url} target="_blank" rel="nofollow sponsored noopener noreferrer"
                       className="inline-flex items-center justify-center gap-1.5 font-heading font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.97] elevation-primary px-5 py-2.5 text-sm w-full">
                      Apsilankyti <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="section-divider mb-12" />

        {/* ═══ 3. COMPARISON TABLE ═══ */}
        <section id="palyginimas" className="mb-16 scroll-mt-20">
          <SectionHeading title="Detalus palyginimas" subtitle="Visų vertinamų tvarkyklių funkcijų palyginimas vienoje lentelėje." className="mb-5" />

          {/* Desktop */}
          <div className="hidden md:block rounded-xl border border-border/60 bg-card elevation-2 overflow-hidden">
            <div className="grid border-b border-border/50 bg-muted/30" style={{ gridTemplateColumns: `160px repeat(${products.length}, 1fr)` }}>
              <div className="p-3 border-r border-border/30" />
              {products.map((product, i) => (
                <div key={product.name} className={`p-4 text-center border-r border-border/30 last:border-r-0 flex flex-col items-center ${i === 0 ? 'bg-primary/[0.04]' : ''}`}>
                  <p className="font-heading font-bold text-foreground text-[13px] leading-tight mb-1">{product.name}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight mb-3">{product.pricing}</p>
                  <a href={product.url} target="_blank" rel="nofollow sponsored noopener noreferrer"
                     className="inline-flex items-center justify-center gap-1 font-heading font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 px-3.5 py-1.5 text-[11px]">
                    Apsilankyti <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>

            {[
              { label: 'Įvertinimas', render: (p: PMProduct) => <span className="inline-flex items-center gap-1 text-xs font-bold text-foreground"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{p.rating.toFixed(1)}</span> },
              { label: 'Geriausia kam', render: (p: PMProduct) => <span className="text-xs font-semibold text-primary">{p.bestFor}</span> },
              { label: 'Nemokama versija', render: (p: PMProduct) => p.freeVersion ? <CheckCircle2 className="w-4 h-4 text-success mx-auto" /> : <XCircle className="w-4 h-4 text-muted-foreground/25 mx-auto" /> },
              { label: 'Šifravimas', render: (p: PMProduct) => <span className="text-[11px] text-muted-foreground">{p.encryption}</span> },
              { label: 'Slaptažodžiai', render: (p: PMProduct) => <span className="text-[11px] text-muted-foreground">{p.maxPasswords}</span> },
              { label: 'Įrenginiai', render: (p: PMProduct) => <span className="text-[11px] text-muted-foreground">{p.devices}</span> },
              { label: '2FA', render: (p: PMProduct) => p.twoFA ? <CheckCircle2 className="w-4 h-4 text-success mx-auto" /> : <XCircle className="w-4 h-4 text-muted-foreground/25 mx-auto" /> },
              { label: 'Dalinimasis', render: (p: PMProduct) => p.passwordSharing ? <CheckCircle2 className="w-4 h-4 text-success mx-auto" /> : <XCircle className="w-4 h-4 text-muted-foreground/25 mx-auto" /> },
              { label: 'Nutekėjimų stebėjimas', render: (p: PMProduct) => p.breachMonitor ? <CheckCircle2 className="w-4 h-4 text-success mx-auto" /> : <XCircle className="w-4 h-4 text-muted-foreground/25 mx-auto" /> },
              { label: 'Passkey', render: (p: PMProduct) => p.passkey ? <CheckCircle2 className="w-4 h-4 text-success mx-auto" /> : <XCircle className="w-4 h-4 text-muted-foreground/25 mx-auto" /> },
              { label: 'Platformos', render: (p: PMProduct) => <span className="text-[11px] text-muted-foreground">{p.platforms.join(', ')}</span> },
            ].map((row, ri) => (
              <div key={ri} className={`grid items-center border-b border-border/20 last:border-b-0 ${ri % 2 === 0 ? 'bg-muted/[0.12]' : ''}`}
                   style={{ gridTemplateColumns: `160px repeat(${products.length}, 1fr)` }}>
                <div className="p-3 border-r border-border/30">
                  <span className="text-xs font-heading font-semibold text-foreground">{row.label}</span>
                </div>
                {products.map((product, i) => (
                  <div key={product.name} className={`p-3 text-center border-r border-border/20 last:border-r-0 ${i === 0 ? 'bg-primary/[0.02]' : ''}`}>
                    {row.render(product)}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Mobile: cards */}
          <div className="md:hidden space-y-2">
            {products.map((product) => (
              <div key={product.name} className="card-premium p-3.5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/12 flex items-center justify-center shrink-0 w-[36px] h-[36px]">
                    <span className="font-heading font-bold text-primary text-[10px]">{product.brand.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-foreground text-sm">{product.name}</p>
                    <p className="text-[11px] text-muted-foreground">{product.pricing}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-foreground">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{product.rating.toFixed(1)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  <div className="flex items-center gap-1.5 text-xs">{product.freeVersion ? <CheckCircle2 className="w-3 h-3 text-success" /> : <XCircle className="w-3 h-3 text-muted-foreground/25" />}<span className="text-muted-foreground">Nemokama</span></div>
                  <div className="flex items-center gap-1.5 text-xs">{product.twoFA ? <CheckCircle2 className="w-3 h-3 text-success" /> : <XCircle className="w-3 h-3 text-muted-foreground/25" />}<span className="text-muted-foreground">2FA</span></div>
                  <div className="flex items-center gap-1.5 text-xs">{product.passkey ? <CheckCircle2 className="w-3 h-3 text-success" /> : <XCircle className="w-3 h-3 text-muted-foreground/25" />}<span className="text-muted-foreground">Passkey</span></div>
                  <div className="flex items-center gap-1.5 text-xs">{product.breachMonitor ? <CheckCircle2 className="w-3 h-3 text-success" /> : <XCircle className="w-3 h-3 text-muted-foreground/25" />}<span className="text-muted-foreground">Nutekėjimai</span></div>
                </div>
                <a href={product.url} target="_blank" rel="nofollow sponsored noopener noreferrer"
                   className="inline-flex items-center justify-center gap-1.5 font-heading font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 px-4 py-2.5 text-xs w-full">
                  Apsilankyti <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </section>

        <div className="section-divider mb-12" />

        {/* ═══ 4. BEST BY USE CASE ═══ */}
        <section id="pagal-poreiki" className="mb-16 scroll-mt-20">
          <SectionHeading title="Geriausia tvarkyklė pagal poreikį" subtitle="Pasirinkite situaciją — parodysime tinkamiausią sprendimą." className="mb-5" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {useCases.map((uc, i) => {
              const Icon = uc.icon;
              const product = products.find(p => p.name === uc.product);
              return (
                <div key={i} className={`card-premium p-4 flex flex-col ${i === 0 ? 'sm:col-span-2 lg:col-span-1 card-premium-featured' : ''}`}>
                  <div className="flex items-start gap-2.5 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/12 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h3 className="font-heading font-bold text-foreground text-sm leading-snug">{uc.title}</h3>
                        <span className="chip-primary text-[9px]">{uc.tag}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{uc.desc}</p>
                    </div>
                  </div>
                  {product && (
                    <div className="flex items-center gap-3 pt-3 border-t border-border/30 mt-auto">
                      <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/12 flex items-center justify-center shrink-0 w-[40px] h-[40px]">
                        <span className="font-heading font-bold text-primary text-[10px]">{product.brand.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-foreground text-[13px]">{product.name}</p>
                        <span className="text-[11px] text-muted-foreground">{product.pricing}</span>
                      </div>
                      <a href={product.url} target="_blank" rel="nofollow sponsored noopener noreferrer"
                         className="inline-flex items-center justify-center gap-1 font-heading font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 px-3 py-1.5 text-[11px] shrink-0">
                        Apsilankyti <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <div className="section-divider mb-12" />

        {/* ═══ 5. FREE VS PAID ═══ */}
        <section id="nemokama-vs-mokama" className="mb-16 scroll-mt-20">
          <SectionHeading title="Nemokama ar mokama tvarkyklė?" subtitle="Atsakymas priklauso nuo jūsų poreikių. Štai praktinis palyginimas." className="mb-5" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            <div className="card-premium p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="font-heading font-bold text-foreground text-sm flex-1">Nemokama versija</h3>
                <span className="chip-muted">0 €</span>
              </div>
              <ul className="space-y-1.5 text-sm mb-4">
                {[
                  { ok: true, t: 'Neriboti slaptažodžiai (Bitwarden, Proton Pass)' },
                  { ok: true, t: 'Stiprus AES-256 ar XChaCha20 šifravimas' },
                  { ok: true, t: 'Slaptažodžių generatorius ir automatinis užpildymas' },
                  { ok: false, t: 'Dažnai ribojamas iki 1 įrenginio (NordPass, RoboForm)' },
                  { ok: false, t: 'Nėra šeimos dalinimosi ir pažangaus audito' },
                  { ok: false, t: 'Ribota techninė pagalba' },
                ].map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    {item.ok ? <CheckCircle2 className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/30 mt-0.5 shrink-0" />}
                    <span className="text-[12px] text-muted-foreground leading-snug">{item.t}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-muted-foreground border-t border-border/30 pt-2.5">Tinka: individualiems naudotojams, kuriems užtenka bazinių funkcijų. Bitwarden ir Proton Pass nemokamos versijos — stipriausios.</p>
            </div>
            <div className="card-premium-featured p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground text-sm flex-1">Mokama versija</h3>
                <span className="chip-primary">1–5 $/mėn.</span>
              </div>
              <ul className="space-y-1.5 text-sm mb-4">
                {[
                  { ok: true, t: 'Neribota sinchronizacija tarp visų įrenginių' },
                  { ok: true, t: 'Pažangus saugumo auditas (Watchtower, Health Report)' },
                  { ok: true, t: 'Šeimos planai ir saugus dalinimasis' },
                  { ok: true, t: 'Duomenų nutekėjimo stebėjimas dark web' },
                  { ok: true, t: 'YubiKey ir pažangus 2FA palaikymas' },
                  { ok: false, t: 'Reikalauja mėnesinio/metinio mokėjimo' },
                ].map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    {item.ok ? <CheckCircle2 className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/30 mt-0.5 shrink-0" />}
                    <span className="text-[12px] text-muted-foreground leading-snug">{item.t}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-muted-foreground border-t border-border/30 pt-2.5">Tinka: šeimoms, keliems įrenginiams, pažangiems naudotojams, kuriems svarbus saugumo auditas.</p>
            </div>
          </div>

          {/* Cross-link to password security hub */}
          <div className="flex flex-wrap gap-2">
            <Link to="/slaptazodziu-saugumas"
                  className="text-xs font-heading font-semibold px-3.5 py-2 rounded-lg bg-card text-primary hover:bg-primary/5 border border-border/50 transition-all duration-200 inline-flex items-center gap-1.5 elevation-1">
              Slaptažodžių saugumo patarimai <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/slaptazodziu-saugumas/ka-daryti-pamirsus-slaptazodi"
                  className="text-xs font-heading font-semibold px-3.5 py-2 rounded-lg bg-card text-primary hover:bg-primary/5 border border-border/50 transition-all duration-200 inline-flex items-center gap-1.5 elevation-1">
              Ką daryti pamiršus slaptažodį <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        <div className="section-divider mb-12" />

        {/* ═══ 6. HOW TO CHOOSE ═══ */}
        <section id="kaip-pasirinkti" className="mb-16 scroll-mt-20">
          <SectionHeading title="Kaip pasirinkti slaptažodžių tvarkyklę" subtitle="Atsakykite į šiuos klausimus — bus aišku, kuri tvarkyklė jums tinka." className="mb-5" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {buyerGuide.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="card-premium p-4 h-full flex flex-col">
                  <div className="flex items-start gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/8 border border-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-foreground text-sm leading-snug pt-1.5">{item.q}</h3>
                  </div>
                  <p className="text-[12px] text-muted-foreground leading-relaxed flex-1">{item.a}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 card-premium p-4 max-w-2xl bg-muted/40">
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-heading">Bendra taisyklė:</strong> jei jums reikia tik bazinės slaptažodžių saugyklos — <strong>Bitwarden</strong> nemokama versija yra geriausias pasirinkimas. Jei norite premium funkcijų ir šeimos plano — <strong>1Password</strong>. Jei svarbiausias privatumas — <strong>Proton Pass</strong>.
            </p>
          </div>
        </section>

        <div className="section-divider mb-12" />

        {/* ═══ 7. FAQ ═══ */}
        <section id="duk" className="mb-16 scroll-mt-20">
          <FAQAccordion items={category.faq.length > 0 ? category.faq : faqItems} title="Dažnai užduodami klausimai" />
        </section>

        {/* ═══ 8. RELATED GUIDES ═══ */}
        <section className="mb-16">
          <SectionHeading title="Kiti naudingi gidai" className="mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {relatedGuides.map(guide => {
              const Icon = guide.icon;
              return (
                <Link key={guide.path} to={guide.path}
                      className="card-premium flex items-start gap-2.5 p-3.5 transition-all duration-200 group hover-lift">
                  <div className="w-7 h-7 rounded-md bg-primary/8 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm text-foreground font-semibold block group-hover:text-primary transition-colors leading-tight">{guide.label}</span>
                    <span className="text-[11px] text-muted-foreground">{guide.desc}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ═══ TRUST DISCLOSURE ═══ */}
        <TrustDisclosure />
      </div>
    </PageLayout>
  );
};

export default PasswordManagerLandingPage;
