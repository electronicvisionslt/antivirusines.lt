import {
  Star, ExternalLink, Shield, Smartphone, Monitor, ChevronRight, CheckCircle2, XCircle,
  ArrowRight, Clock, BarChart3, Layers, Award, Heart, Zap, Lock, Users, ChevronDown,
  Check, X, Laptop, Globe, Eye, ShieldCheck, HelpCircle, BadgeCheck, ThumbsUp, ThumbsDown,
} from 'lucide-react';
import PageLayout from '@/components/site/PageLayout';
import Breadcrumbs from '@/components/site/Breadcrumbs';
import ScrollReveal from '@/components/site/ScrollReveal';
import FAQAccordion from '@/components/content/FAQAccordion';
import TrustDisclosure from '@/components/content/TrustDisclosure';
import ArticleCard from '@/components/content/ArticleCard';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useComparisonProducts, type PublicProduct } from '@/hooks/usePublicData';
import type { PublicCategory } from '@/types/content';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';

interface Props { category: PublicCategory }

/* ══════════════════ SHARED HELPERS ══════════════════ */

function RatingBadge({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const cls = { sm: 'text-xs px-2 py-0.5 gap-1', md: 'text-sm px-2.5 py-1 gap-1', lg: 'text-base px-3 py-1.5 gap-1.5' }[size];
  return (
    <span className={`${cls} inline-flex items-center rounded-md bg-accent/10 text-accent font-bold tabular-nums font-heading`}>
      <Star className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4.5 h-4.5' : 'w-3.5 h-3.5'} fill-accent stroke-accent`} />
      {rating.toFixed(1)}
    </span>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'fill-accent text-accent' : 'fill-muted text-muted-foreground/20'}`} />
      ))}
    </div>
  );
}

function ProductLogo({ product, size = 40 }: { product: PublicProduct; size?: number }) {
  if (product.logoUrl) {
    return <img src={product.logoUrl} alt={`${product.name} logotipas`} width={size} height={size} className="rounded-lg object-contain" loading="lazy" />;
  }
  return (
    <div className="rounded-lg bg-primary/10 border border-primary/10 flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <span className="font-heading font-bold text-primary" style={{ fontSize: size * 0.35 }}>
        {product.brand?.slice(0, 2).toUpperCase() || product.name.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

function AffiliateButton({ product, variant = 'primary', className = '', label }: { product: PublicProduct; variant?: 'primary' | 'outline'; className?: string; label?: string }) {
  if (!product.affiliateUrl) return null;
  const base = variant === 'primary'
    ? 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20'
    : 'border border-accent/30 text-accent hover:bg-accent/10';
  return (
    <a href={product.affiliateUrl} target="_blank" rel="nofollow sponsored noopener noreferrer"
       className={`inline-flex items-center gap-2 font-heading font-semibold rounded-lg transition-all duration-200 active:scale-[0.97] ${base} ${className}`}>
      {label || 'Apsilankyti'}<ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
}

function FeatureIcon({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="w-4 h-4 text-[hsl(var(--success))] mx-auto" />;
  if (value === false) return <X className="w-4 h-4 text-muted-foreground/25 mx-auto" />;
  return <span className="text-xs text-muted-foreground">{value}</span>;
}

function PlatformBadges({ platforms }: { platforms: string[] }) {
  const icons: Record<string, typeof Monitor> = { Windows: Monitor, Mac: Laptop, Android: Smartphone, iOS: Smartphone };
  return (
    <div className="flex gap-1 flex-wrap">
      {platforms.slice(0, 4).map(p => {
        const Icon = icons[p] || Globe;
        return <span key={p} className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-secondary/50 rounded px-1.5 py-0.5"><Icon className="w-2.5 h-2.5" />{p}</span>;
      })}
    </div>
  );
}

/* ══════════════════ STATIC EDITORIAL CONTENT ══════════════════ */

// Per-product editorial deep-dives (Lithuanian)
// These are editorial descriptions for when longDescription is empty in DB
const productEditorials: Record<string, { intro: string; body: string; bottomLine: string }> = {
  'Norton': {
    intro: 'Norton 360 yra viena iš labiausiai žinomų ir ilgiausiai rinkoje esančių antivirusinių programų. Šiandien Norton siūlo ne tik antivirusinę apsaugą, bet ir pilną kibernetinio saugumo paketą su VPN, slaptažodžių tvarkykle, tamsiojo interneto stebėjimu ir debesies atsargine kopija.',
    body: `Norton naudoja pažangų grėsmių aptikimo variklį, paremtą mašininiu mokymusi ir euristine analize. Programa efektyviai aptinka ir blokuoja virusus, trojanus, ransomware ir kitas kenkėjiškas programas realiu laiku.

Viena iš stipriausių Norton pusių — integruotas VPN su neribotu duomenų kiekiu. Tai retas privalumas tarp antivirusinių programų, nes dauguma konkurentų riboja VPN duomenis arba siūlo jį tik brangiausiuose planuose. Norton VPN veikia per 29 šalių serverius ir siūlo 256 bitų AES šifravimą.

Norton taip pat siūlo tamsiojo interneto stebėjimą — programa nuolat tikrina, ar jūsų asmeniniai duomenys (el. paštas, slaptažodžiai, socialinio draudimo numeriai) nebuvo nutekinti į tamsiąją interneto dalį. Tai ypač svarbu po didelių duomenų nutekėjimų.

Tėvų kontrolės funkcijos leidžia stebėti vaikų veiklą internete, nustatyti ekrano laiko limitus ir blokuoti nepageidaujamą turinį. Norton Family yra viena geriausių tėvų kontrolės programų rinkoje.

Norton 360 Deluxe planas apima 5 įrenginius ir kainuoja apie 50 €/metus su pirmo metų nuolaida. Tai apima antivirusą, VPN, slaptažodžių tvarkyklę, tamsiojo interneto stebėjimą ir 50 GB debesies saugyklą. Visi planai turi 60 dienų pinigų grąžinimo garantiją.`,
    bottomLine: 'Norton 360 — geriausias pasirinkimas tiems, kam reikia visapusiškos apsaugos su VPN, slaptažodžių tvarkykle ir tamsiojo interneto stebėjimu. Ypač tinka šeimoms ir naudotojams su keliais įrenginiais.',
  },
  'Bitdefender': {
    intro: 'Bitdefender Total Security yra viena techniškai pažangiausių antivirusinių programų, naudojanti debesijos technologiją skenavimui. Tai reiškia, kad didžioji dalis grėsmių analizės vyksta Bitdefender serveriuose, o ne jūsų kompiuteryje — todėl programa beveik neturi poveikio sistemos našumui.',
    body: `Bitdefender išsiskiria itin žemu resursu naudojimu. Programa vidutiniškai naudoja mažiau nei 1% procesoriaus galios dirbdama fone, o pilno skenavimo metu — apie 30%. Tai reiškia, kad galite dirbti, žaisti ar žiūrėti filmus be pastebimo sulėtėjimo.

Antivirusinė turi specialų „Žaidimų režimą" (Game Mode), kuris automatiškai optimizuoja resursų paskirstymą, kai žaidžiate kompiuterinius žaidimus. Taip pat yra „Darbo režimas" ir „Filmo režimas", kurie prisitaiko prie jūsų veiklos.

Bitdefender Safepay yra apsaugotas naršyklės langas, skirtas internetinei bankininkystei ir apsipirkimui. Jis šifruoja visą ryšį ir blokuoja bandymus perimti jūsų finansinius duomenis. Tai unikali funkcija, kurios neturi dauguma konkurentų.

Webcam ir mikrofono apsauga praneša, kai bet kuri programa bando pasiekti jūsų kamerą ar mikrofoną. Tai ypač svarbu nuotolinio darbo eroje, kai kompiuteriai dažnai turi aktyvuotas kameras.

Bitdefender VPN yra greitas ir saugus, bet daugumoje planų ribojamas iki 200 MB per dieną. Neribotą VPN gausite tik su Premium Security planu. Total Security planas kainuoja apie 55 €/metus ir apima iki 5 įrenginių su tėvų kontrole, sistemos optimizavimu ir ugniasiene.`,
    bottomLine: 'Bitdefender — geriausias pasirinkimas tiems, kuriems svarbiausia minimali įtaka sistemos greičiui ir pažangus grėsmių aptikimas. Ypač tinka Windows naudotojams ir žaidėjams.',
  },
  'Kaspersky': {
    intro: 'Kaspersky Plus yra viena seniausių ir labiausiai patikrintų antivirusinių programų pasaulyje, turinti daugiau nei 25 metų patirtį kibernetinio saugumo srityje. Programa nuolat užima aukščiausias vietas nepriklausomų laboratorijų testuose.',
    body: `Kaspersky grėsmių aptikimo variklis yra vienas geriausių rinkoje. Nepriklausomos testavimo laboratorijos kaip AV-TEST ir AV-Comparatives nuolat suteikia Kaspersky aukščiausius įvertinimus už apsaugos efektyvumą ir mažą klaidingų teigiamų rezultatų skaičių.

Programa siūlo „Safe Money" funkciją — apsaugotą naršyklės aplinką, skirtą internetinei bankininkystei ir mokėjimams. Kai atidarote banko puslapį, Kaspersky automatiškai siūlo atidaryti jį saugioje aplinkoje.

Kaspersky VPN yra integruotas į Plus ir Premium planus su neribotu duomenų kiekiu. VPN veikia per daugiau nei 70 šalių serverius ir siūlo spartų ryšį, tinkamą ir kasdieniam naršymui, ir streaming paslaugoms.

Privatumo apsaugos funkcijos apima webcam apsaugą, privataus naršymo stebėjimą ir duomenų nutekėjimo tikrinimą. Kaspersky Password Manager leidžia saugiai saugoti slaptažodžius, banko korteles ir asmeninius dokumentus.

Kaspersky Plus kainuoja apie 35 €/metus 3 įrenginiams ir apima antivirusą, VPN, slaptažodžių tvarkyklę ir sistemos optimizavimą. Premium planas prideda tėvų kontrolę ir techninę pagalbą nuotoliniu būdu. Visi planai turi 30 dienų pinigų grąžinimo garantiją.`,
    bottomLine: 'Kaspersky Plus — puikus pasirinkimas tiems, kam svarbus aukščiausio lygio grėsmių aptikimas ir geras kainos-vertės santykis. Tinka patyrusiems naudotojams, kurie nori daugiau kontrolės.',
  },
  'Avast': {
    intro: 'Avast Free Antivirus yra populiariausia nemokama antivirusinė programa pasaulyje su daugiau nei 400 milijonų aktyvių naudotojų. Nemokama versija siūlo solidžią bazinę apsaugą be jokių mokesčių.',
    body: `Avast nemokama versija apima realaus laiko apsaugą nuo virusų, kenkėjiškų programų ir ransomware. Programa taip pat turi Wi-Fi tinklo tikrinimo funkciją, kuri aptinka pažeidžiamus tinklo įrenginius ir nesaugias jungtis.

Nemokamos versijos ribotumas — nėra VPN, slaptažodžių tvarkyklės ar tėvų kontrolės. Taip pat nemokama versija retkarčiais rodo siūlymus pereiti prie mokamos versijos, bet tai nėra agresyvu ir nesikišama į kasdienį naudojimą.

Avast naršyklės apsauga blokuoja kenkėjiškus puslapius, phishing atakas ir pavojingus atsisiuntimus. Ši funkcija veikia su visomis populiariomis naršyklėmis — Chrome, Firefox ir Edge.

Mokama Avast Premium Security versija prideda pažangesnę apsaugą nuo ransomware, nuotolinio prisijungimo apsaugą, sandėlio ir DNS apsaugą. Premium versija taip pat apima webcam apsaugą ir pažangų ugniasienės modulį.

Avast Premium Security kainuoja apie 50 €/metus vienam įrenginiui arba 65 €/metus iki 10 įrenginių. Nemokama versija neturi laiko apribojimo — galite ją naudoti neribotą laiką su visomis bazinėmis funkcijomis.`,
    bottomLine: 'Avast Free — geriausias nemokamas pasirinkimas bazinei apsaugai. Tinka studentams, atsargiam naršymui ir tiems, kas nori patikimos apsaugos be finansinių įsipareigojimų.',
  },
};

/* ── jump nav ── */
const jumpLinks = [
  { href: '#top-picks', label: 'Top pasirinkimai', icon: Award },
  { href: '#norton', label: 'Norton', icon: Shield },
  { href: '#bitdefender', label: 'Bitdefender', icon: Shield },
  { href: '#kaspersky', label: 'Kaspersky', icon: Shield },
  { href: '#avast', label: 'Avast', icon: Shield },
  { href: '#palyginimas', label: 'Palyginimas', icon: BarChart3 },
  { href: '#pagal-poreiki', label: 'Pagal poreikį', icon: Layers },
  { href: '#kaip-pasirinkti', label: 'Kaip pasirinkti', icon: HelpCircle },
  { href: '#duk', label: 'DUK', icon: HelpCircle },
];

/* ── FAQ ── */
const pillarFaq: { q: string; a: string }[] = [
  { q: 'Ar verta mokėti už antivirusinę programą?', a: 'Jei saugote kelis įrenginius, naudojate viešus Wi-Fi tinklus arba jums svarbi tėvų kontrolė ir VPN — taip. Mokamos programos siūlo kelių įrenginių apsaugą, prioritetinę pagalbą ir papildomas funkcijas kaip tamsiojo interneto stebėjimas. Baziniam naršymui vienu įrenginiu nemokama versija gali pakakti, bet ji neapsaugo nuo visų grėsmių.' },
  { q: 'Ar pakanka Windows Defender?', a: 'Windows Defender suteikia solidžią bazinę apsaugą ir daugeliui atsargių naudotojų to užtenka. Tačiau jis neturi VPN, slaptažodžių tvarkyklės, tėvų kontrolės ir kelių įrenginių valdymo. Jei naudojate tik vieną Windows kompiuterį ir naršote atsargiai — gali pakakti. Jei turite šeimą, telefoną ar dirbate nuotoliniu būdu — verta investuoti į specializuotą programą.' },
  { q: 'Kokia antivirusinė geriausia telefonui?', a: 'Android telefonams rekomenduojame Bitdefender Mobile Security ir Norton Mobile Security — abu siūlo stiprią apsaugą su minimaliu poveikiu baterijai ir greičiui. iOS sistemoje antivirusinės veikia ribočiau dėl Apple architektūros, bet vis tiek naudingos dėl VPN, naršymo apsaugos ir phishing blokavimo.' },
  { q: 'Ar nemokamos antivirusinės programos yra saugios?', a: 'Patikimų gamintojų nemokamos versijos — Avast Free, Bitdefender Free — yra saugios ir efektyvios bazinei apsaugai. Venkite nežinomų nemokamų programų: kai kurios renka jūsų duomenis, rodo agresyvią reklamą arba netgi platina kenkėjišką kodą.' },
  { q: 'Ar antivirusinė sulėtina kompiuterį?', a: 'Šiuolaikinės antivirusinės turi minimalų poveikį našumui. Geriausi sprendimai kaip Bitdefender ir Norton dirba fone beveik nepastebimi — poveikį galite pajusti tik pilno sistemos skenavimo metu.' },
  { q: 'Kiek įrenginių paprastai apima viena licencija?', a: 'Daugelis mokamų planų apima 3–10 įrenginių. Norton 360 Deluxe siūlo 5 įrenginius, Bitdefender Family Pack — iki 15. Šeimoms ar keliems naudotojams verta rinktis planus su didesniu skaičiumi.' },
  { q: 'Ar man reikia VPN kartu su antivirusine?', a: 'VPN ypač naudingas jei naudojate viešus Wi-Fi tinklus, norite apsaugoti privatumą naršant ar pasiekti turinį iš kitų šalių. Daugelis mokamų antivirusinių jau turi integruotą VPN.' },
];

/* ── use cases ── */
interface UseCaseBlock { icon: typeof Shield; title: string; description: string; why: string; matchKey: string; tag: string }
const useCases: UseCaseBlock[] = [
  { icon: Award, title: 'Geriausia visapusiška apsauga', description: 'Pilnas saugumo paketas: antivirusas, VPN, slaptažodžių tvarkyklė, tamsiojo interneto stebėjimas ir automatiniai atnaujinimai.', why: 'Plačiausias funkcijų rinkinys su neribotu VPN ir stipriausiu grėsmių aptikimu.', matchKey: 'Norton', tag: 'Rekomenduojama' },
  { icon: Zap, title: 'Geriausia nemokama antivirusinė', description: 'Patikima bazinė apsauga be jokių mokesčių — tinka studentams, atsargiam naršymui ir tiems, kam nereikia papildomų funkcijų.', why: 'Geriausias grėsmių aptikimo rodiklis tarp nemokamų alternatyvų, be agresyvios reklamos.', matchKey: 'Avast', tag: 'Nemokama' },
  { icon: Users, title: 'Geriausia šeimoms', description: 'Tėvų kontrolė, kelių įrenginių apsauga viena licencija ir centralizuotas valdymas visai šeimai.', why: 'Iki 5–15 įrenginių viena licencija su pilna tėvų kontrole.', matchKey: 'Norton', tag: 'Šeimoms' },
  { icon: Smartphone, title: 'Geriausia telefonui', description: 'Lengva, baterijos netaušojanti apsauga Android ir iOS su anti-phishing ir saugiu naršymu.', why: 'Mažiausias poveikis baterijos veikimui išlaikant stiprią apsaugą.', matchKey: 'Bitdefender', tag: 'Mobiliai' },
  { icon: Monitor, title: 'Geriausia Windows kompiuteriui', description: 'Stipriausias grėsmių aptikimas su mažiausiu poveikiu sistemos veikimui ir žaidimų režimu.', why: 'Debesijos skenavimas ir optimizuotas būtent Windows aplinkai.', matchKey: 'Bitdefender', tag: 'Windows' },
  { icon: Heart, title: 'Geriausia pradedantiesiems', description: 'Paprasta sąsaja, automatinis veikimas ir aiškūs pranešimai — nereikia techninių žinių.', why: 'Instaliuojama per 3 minutes, veikia automatiškai.', matchKey: 'Norton', tag: 'Lengva' },
];

/* ── related guides ── */
const relatedGuides = [
  { path: '/antivirusines-programos/nemokamos', label: 'Nemokamos antivirusinės programos', desc: 'Geriausi nemokami sprendimai bazinei apsaugai', icon: Zap },
  { path: '/antivirusines-programos/telefonui', label: 'Antivirusinė telefonui', desc: 'Android ir iOS apsaugos gidas', icon: Smartphone },
  { path: '/antivirusines-programos/kompiuteriui', label: 'Antivirusinė kompiuteriui', desc: 'Windows ir Mac apsaugos palyginimas', icon: Monitor },
  { path: '/virusai/kas-yra-kompiuterinis-virusas', label: 'Kas yra kompiuterinis virusas?', desc: 'Virusų tipai ir kaip jie veikia', icon: Eye },
  { path: '/virusai/virusas-telefone', label: 'Kaip pašalinti virusą iš telefono', desc: 'Žingsnis po žingsnio gidas', icon: ShieldCheck },
];

/* ── feature columns ── */
const featureCols = [
  { key: 'VPN', label: 'VPN' },
  { key: 'Slaptažodžių tvarkyklė', label: 'Slaptažodžiai' },
  { key: 'Tėvų kontrolė', label: 'Tėvų kontr.' },
  { key: 'Telefonų apsauga', label: 'Tel. apsauga' },
];

/* ── comparison filter ── */
type FilterKey = 'all' | 'free' | 'family' | 'mobile';
const filterOptions: { key: FilterKey; label: string; icon: typeof BarChart3 }[] = [
  { key: 'all', label: 'Visos', icon: BarChart3 },
  { key: 'free', label: 'Nemokamos', icon: Zap },
  { key: 'family', label: 'Šeimoms', icon: Users },
  { key: 'mobile', label: 'Telefonui', icon: Smartphone },
];

/* ── buyer guide ── */
const buyerGuide = [
  { q: 'Kiek įrenginių norite apsaugoti?', advice: 'Jei tik vieną kompiuterį — nemokama arba Windows Defender gali pakakti. 2+ įrenginiams rinkitės mokamą planą su kelių įrenginių licencija.', icon: Layers },
  { q: 'Ar reikia telefono apsaugos?', advice: 'Android sistema yra atviresnė grėsmėms nei iOS. Rinkitės programą su dedikuota mobilia versija ir minimaliu poveikiu baterijai.', icon: Smartphone },
  { q: 'Ar turite vaikų internete?', advice: 'Prioritetas turėtų būti tėvų kontrolė ir turinio filtravimas. Norton ir Kaspersky siūlo stipriausias šeimos kontrolės funkcijas.', icon: Users },
  { q: 'Ar jums svarbus privatumas ir VPN?', advice: 'Jei naudojate viešus Wi-Fi tinklus — rinkitės paketą su integruotu VPN. Tai paprasčiau ir pigiau nei pirkti atskirai.', icon: Lock },
  { q: 'Koks jūsų biudžetas?', advice: 'Nemokamos versijos suteikia bazinę apsaugą. Mokamos kainuoja 20–60 €/metus. Šeimos planai dažnai kainuoja tiek pat, kiek 3 įrenginių licencija.', icon: BarChart3 },
  { q: 'Ar norite paprastumo ar kontrolės?', advice: 'Norton veikia beveik automatiškai. Bitdefender ir Kaspersky siūlo detalesnius nustatymus pažengusiems naudotojams.', icon: Shield },
];

/* ── Medal labels ── */
const medalLabels = ['🥇', '🥈', '🥉'];

/* ══════════════════════════════════════════════════════════════ */

const AntivirusLandingPage = ({ category }: Props) => {
  usePageMeta({
    title: category.seoTitle || 'Geriausios antivirusinės programos 2025 — palyginimas ir apžvalgos',
    description: category.metaDescription || 'Nepriklausomos antivirusinių programų apžvalgos ir palyginimas. Raskite geriausią antivirusinę savo kompiuteriui, telefonui ar šeimai.',
    canonicalUrl: category.canonicalUrl || undefined,
  });

  const { data: products = [] } = useComparisonProducts('antivirus');
  const categoryArticles = category.articles || [];
  const topPicks = products.slice(0, 4);
  const findProduct = (key: string) => products.find(p => p.name.includes(key) || p.brand.includes(key));

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'all') return products;
    if (activeFilter === 'free') return products.filter(p => p.freeVersion);
    if (activeFilter === 'family') return products.filter(p => p.features['Tėvų kontrolė'] === true);
    if (activeFilter === 'mobile') return products.filter(p => p.features['Telefonų apsauga'] === true || p.supportedPlatforms.some(pl => pl === 'Android' || pl === 'iOS'));
    return products;
  }, [products, activeFilter]);

  const now = new Date();
  const updatedLabel = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const bestOverall = products[0];
  const bestFree = products.find(p => p.freeVersion);
  const bestFamily = products.find(p => p.features['Tėvų kontrolė'] === true);

  // Get editorial content for a product
  const getEditorial = (product: PublicProduct) => {
    const brandKey = Object.keys(productEditorials).find(k => product.name.includes(k) || product.brand.includes(k));
    return brandKey ? productEditorials[brandKey] : null;
  };

  return (
    <PageLayout>
      <div className="container py-8">
        <Breadcrumbs path={category.path} items={[
          { label: 'Pradžia', path: '/' },
          { label: 'Antivirusinės programos', path: '/antivirusines-programos' },
        ]} />

        {/* ═══ 1. HERO ═══ */}
        <ScrollReveal>
          <section className="relative rounded-2xl overflow-hidden border border-border/40 mb-8">
            <div className="absolute inset-0 gradient-mesh" />
            <div className="absolute inset-0 bg-card/50" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="relative p-6 md:p-10 lg:p-12">
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
                  <span className="text-[11px] font-heading font-semibold text-primary uppercase tracking-[0.14em]">Nepriklausomas palyginimas</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />Atnaujinta {updatedLabel}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30 hidden sm:block" />
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Lock className="w-3 h-3" />Su affiliate nuorodomis</span>
                </div>

                <h1 className="font-heading text-3xl md:text-[2.75rem] lg:text-5xl font-bold text-foreground leading-[1.08] mb-4">
                  Geriausios antivirusinės programos 2025&nbsp;m.
                </h1>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mb-3">
                  Išanalizavome populiariausias antivirusines programas pagal apsaugos efektyvumą, poveikį greičiui, papildomas funkcijas ir kainą. Žemiau rasite detalias apžvalgas kiekvienos programos, palyginimo lentelę ir praktinių patarimų, kaip pasirinkti tinkamiausią sprendimą.
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mb-5">
                  Šiuolaikinės antivirusinės programos siūlo daug daugiau nei bazinį virusų skenavimą — daugelis apima VPN, slaptažodžių tvarkyklę, tėvų kontrolę, tamsiojo interneto stebėjimą ir kelių įrenginių apsaugą viena licencija. Tačiau ne visos programos veikia taip, kaip žada. Mes kiekvieną vertiname pagal praktinę naudą ir tikrą kainos-vertės santykį.
                </p>

                {/* Quick winner badges */}
                {products.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {bestOverall && (
                      <a href="#top-picks" className="inline-flex items-center gap-2 rounded-lg bg-accent/10 border border-accent/20 px-3 py-2 hover:bg-accent/15 transition-colors">
                        <Award className="w-4 h-4 text-accent" />
                        <div>
                          <span className="text-[10px] text-accent font-heading font-semibold uppercase tracking-wider block leading-tight">🥇 Geriausia 2025</span>
                          <span className="text-xs text-foreground font-medium">{bestOverall.name}</span>
                        </div>
                      </a>
                    )}
                    {bestFree && (
                      <a href={`#${bestFree.brand.toLowerCase() || 'top-picks'}`} className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/20 px-3 py-2 hover:bg-[hsl(var(--success))]/15 transition-colors">
                        <Zap className="w-4 h-4 text-[hsl(var(--success))]" />
                        <div>
                          <span className="text-[10px] text-[hsl(var(--success))] font-heading font-semibold uppercase tracking-wider block leading-tight">Geriausia nemokama</span>
                          <span className="text-xs text-foreground font-medium">{bestFree.name}</span>
                        </div>
                      </a>
                    )}
                    {bestFamily && (
                      <a href="#pagal-poreiki" className="inline-flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-3 py-2 hover:bg-primary/15 transition-colors">
                        <Users className="w-4 h-4 text-primary" />
                        <div>
                          <span className="text-[10px] text-primary font-heading font-semibold uppercase tracking-wider block leading-tight">Geriausia šeimoms</span>
                          <span className="text-xs text-foreground font-medium">{bestFamily.name}</span>
                        </div>
                      </a>
                    )}
                  </div>
                )}

                {/* TOC / Jump nav */}
                <nav className="flex flex-wrap gap-1.5" aria-label="Turinys">
                  {jumpLinks.map(link => {
                    const Icon = link.icon;
                    return (
                      <a key={link.href} href={link.href}
                         className="text-[11px] font-heading font-medium px-2.5 py-1.5 rounded-md bg-secondary/60 text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-200 inline-flex items-center gap-1.5">
                        <Icon className="w-3 h-3" />{link.label}
                      </a>
                    );
                  })}
                </nav>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ═══ 2. TRUST STATS ═══ */}
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-10">
            {[
              { value: products.length.toString(), label: 'Programų palyginta', icon: BarChart3 },
              { value: (featureCols.length + 2).toString(), label: 'Vertinimo kriterijų', icon: Layers },
              { value: '4', label: 'Platformos', icon: Monitor },
              { value: updatedLabel, label: 'Atnaujinta', icon: Clock },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="rounded-lg border border-border/30 bg-card/40 p-3 text-center">
                  <Icon className="w-3.5 h-3.5 text-primary mx-auto mb-1.5" />
                  <p className="font-heading font-bold text-foreground text-sm tabular-nums">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* ═══ 3. QUICK SUMMARY (top picks) ═══ */}
        {topPicks.length > 0 && (
          <section id="top-picks" className="mb-14 scroll-mt-8">
            <ScrollReveal>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Trumpa santrauka: geriausios antivirusinės 2025 m.</h2>
              <p className="text-muted-foreground text-sm mb-6 max-w-2xl">Neturite laiko skaityti visą puslapį? Štai mūsų redakcijos pasirinkimai — žemiau rasite detalias apžvalgas kiekvienos programos.</p>
            </ScrollReveal>

            <div className="space-y-3">
              {topPicks.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 50}>
                  <a href={`#${product.brand.toLowerCase() || product.slug}`}
                     className={`block relative rounded-xl border bg-card p-4 md:p-5 transition-all duration-300 hover:border-primary/30 ${i === 0 ? 'border-accent/30 shadow-lg shadow-accent/5' : 'border-border/50'}`}>
                    {i === 0 && <div className="absolute -top-px left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/60 to-transparent" />}
                    <div className="flex items-center gap-4">
                      <span className="text-xl shrink-0">{medalLabels[i] || `${i + 1}.`}</span>
                      <ProductLogo product={product} size={44} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-bold text-foreground text-base">{product.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{product.bestFor}</p>
                      </div>
                      <RatingBadge rating={product.rating} size="md" />
                      <div className="hidden sm:block text-right shrink-0">
                        <p className="text-sm font-heading font-semibold text-foreground">{product.pricingSummary}</p>
                        {product.freeVersion && <p className="text-[10px] text-[hsl(var(--success))] font-medium">Yra nemokama versija</p>}
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                    </div>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* ═══ 4. INDIVIDUAL PRODUCT DEEP-DIVES ═══ */}
        {products.map((product, i) => {
          const editorial = getEditorial(product);
          const intro = product.longDescription || editorial?.intro || product.shortDescription;
          const body = editorial?.body || '';
          const bottomLine = editorial?.bottomLine || product.verdict;
          const anchorId = product.brand.toLowerCase() || product.slug;

          return (
            <section key={product.id} id={anchorId} className="mb-14 scroll-mt-8">
              <ScrollReveal>
                <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
                  {/* Product header */}
                  <div className={`p-5 md:p-7 ${i === 0 ? 'border-b-2 border-accent/20' : 'border-b border-border/30'}`}>
                    <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                      <div className="flex items-start gap-3 md:min-w-[220px]">
                        <span className="text-2xl shrink-0">{medalLabels[i] || `${i + 1}.`}</span>
                        <ProductLogo product={product} size={56} />
                        <div>
                          <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground leading-tight">
                            {product.name}
                          </h2>
                          <p className="text-sm text-muted-foreground mt-1">{product.bestFor}</p>
                          <div className="mt-2 flex items-center gap-3">
                            <RatingStars rating={product.rating} />
                            <RatingBadge rating={product.rating} size="md" />
                          </div>
                        </div>
                      </div>

                      {/* Quick specs */}
                      <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                        <div className="rounded-lg bg-secondary/20 p-2.5">
                          <p className="text-[10px] text-muted-foreground font-heading uppercase tracking-wider mb-0.5">Kaina</p>
                          <p className="text-xs font-heading font-bold text-foreground">{product.pricingSummary}</p>
                        </div>
                        <div className="rounded-lg bg-secondary/20 p-2.5">
                          <p className="text-[10px] text-muted-foreground font-heading uppercase tracking-wider mb-0.5">Platformos</p>
                          <p className="text-xs font-heading font-bold text-foreground">{product.supportedPlatforms.length}</p>
                        </div>
                        <div className="rounded-lg bg-secondary/20 p-2.5">
                          <p className="text-[10px] text-muted-foreground font-heading uppercase tracking-wider mb-0.5">Nemokama</p>
                          <p className="text-xs font-heading font-bold text-foreground">{product.freeVersion ? 'Taip' : 'Ne'}</p>
                        </div>
                        <div className="rounded-lg bg-secondary/20 p-2.5">
                          <p className="text-[10px] text-muted-foreground font-heading uppercase tracking-wider mb-0.5">Bandomoji</p>
                          <p className="text-xs font-heading font-bold text-foreground">{product.trialAvailable ? 'Taip' : 'Ne'}</p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <AffiliateButton product={product} className="px-5 py-2.5 text-sm" label="Apsilankyti svetainėje" />
                      </div>
                    </div>
                  </div>

                  {/* Editorial content */}
                  <div className="p-5 md:p-7">
                    {/* Pros / Cons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {product.pros.length > 0 && (
                        <div>
                          <h4 className="flex items-center gap-1.5 font-heading font-semibold text-[hsl(var(--success))] text-sm mb-2">
                            <ThumbsUp className="w-3.5 h-3.5" />Privalumai
                          </h4>
                          <ul className="space-y-1.5">
                            {product.pros.map((pro, j) => (
                              <li key={j} className="flex items-start gap-1.5 text-sm text-muted-foreground">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--success))] mt-0.5 shrink-0" />{pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {product.cons.length > 0 && (
                        <div>
                          <h4 className="flex items-center gap-1.5 font-heading font-semibold text-muted-foreground text-sm mb-2">
                            <ThumbsDown className="w-3.5 h-3.5" />Trūkumai
                          </h4>
                          <ul className="space-y-1.5">
                            {product.cons.map((con, j) => (
                              <li key={j} className="flex items-start gap-1.5 text-sm text-muted-foreground">
                                <XCircle className="w-3.5 h-3.5 text-muted-foreground/40 mt-0.5 shrink-0" />{con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Editorial text */}
                    <div className="prose-article max-w-none">
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{intro}</p>
                      {body && body.split('\n\n').map((paragraph, pi) => (
                        <p key={pi} className="text-sm text-muted-foreground leading-relaxed mb-3">{paragraph}</p>
                      ))}
                    </div>

                    {/* Features row */}
                    <div className="mt-5 pt-4 border-t border-border/20">
                      <h4 className="text-[10px] font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-2">Pagrindinės funkcijos</h4>
                      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-3">
                        {featureCols.map(col => {
                          const val = product.features[col.key];
                          return (
                            <span key={col.key} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                              {val === true ? <Check className="w-3.5 h-3.5 text-[hsl(var(--success))]" /> : <X className="w-3.5 h-3.5 text-muted-foreground/25" />}
                              {col.label}
                            </span>
                          );
                        })}
                      </div>
                      {product.supportedPlatforms.length > 0 && <PlatformBadges platforms={product.supportedPlatforms} />}
                    </div>

                    {/* Bottom line */}
                    {bottomLine && (
                      <div className="mt-5 rounded-lg bg-secondary/20 border border-border/20 p-4">
                        <p className="text-xs font-heading font-semibold text-foreground mb-1">Apibendrinimas:</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{bottomLine}</p>
                      </div>
                    )}

                    {/* CTA */}
                    <div className="mt-5 flex items-center gap-4">
                      <AffiliateButton product={product} className="px-6 py-2.5 text-sm" label="Gauti pasiūlymą" />
                      {product.pricingSummary && (
                        <span className="text-sm text-muted-foreground">nuo {product.pricingSummary}</span>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </section>
          );
        })}

        {/* ═══ 5. COMPARISON TABLE ═══ */}
        {products.length > 0 && (
          <section id="palyginimas" className="mb-14 scroll-mt-8">
            <ScrollReveal>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Palyginimo lentelė</h2>
                  <p className="text-muted-foreground text-sm max-w-lg">Visų antivirusinių funkcijų ir kainų palyginimas vienoje vietoje.</p>
                </div>
                <div className="flex gap-1.5">
                  {filterOptions.map(opt => {
                    const Icon = opt.icon;
                    const active = activeFilter === opt.key;
                    return (
                      <button key={opt.key} onClick={() => setActiveFilter(opt.key)}
                              className={`text-[11px] font-heading font-medium px-2.5 py-1.5 rounded-md inline-flex items-center gap-1 transition-colors duration-200 ${active ? 'bg-primary/15 text-primary border border-primary/20' : 'bg-secondary/40 text-muted-foreground hover:bg-secondary/70 border border-transparent'}`}>
                        <Icon className="w-3 h-3" />{opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>

            {filteredProducts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">Nėra produktų pagal pasirinktą filtrą.</p>
            )}

            {filteredProducts.length > 0 && (
              <ScrollReveal>
                {/* Desktop */}
                <div className="hidden md:block overflow-x-auto rounded-xl border border-border/50 bg-card">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/40 bg-secondary/20">
                        <th className="text-left p-3.5 font-heading font-semibold text-foreground">Programa</th>
                        <th className="text-center p-3.5 font-heading font-semibold text-foreground">Įvert.</th>
                        <th className="text-center p-3.5 font-heading font-semibold text-foreground">Kaina</th>
                        <th className="text-center p-3.5 font-heading font-semibold text-foreground">Nemokama</th>
                        <th className="text-center p-3.5 font-heading font-semibold text-foreground">Bandomoji</th>
                        {featureCols.map(col => (
                          <th key={col.key} className="text-center p-3.5 font-heading font-semibold text-foreground whitespace-nowrap">{col.label}</th>
                        ))}
                        <th className="text-center p-3.5 font-heading font-semibold text-foreground">Platformos</th>
                        <th className="p-3.5" />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product, idx) => (
                        <tr key={product.id} className={`${idx < filteredProducts.length - 1 ? 'border-b border-border/30' : ''} hover:bg-secondary/10 transition-colors`}>
                          <td className="p-3.5">
                            <div className="flex items-center gap-2.5">
                              <ProductLogo product={product} size={28} />
                              <div>
                                <a href={`#${product.brand.toLowerCase() || product.slug}`} className="font-heading font-semibold text-foreground text-sm hover:text-primary transition-colors">{product.name}</a>
                                <p className="text-[10px] text-muted-foreground leading-tight max-w-[140px] truncate">{product.bestFor}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5 text-center"><RatingBadge rating={product.rating} size="sm" /></td>
                          <td className="p-3.5 text-center text-muted-foreground whitespace-nowrap text-xs">{product.pricingSummary}</td>
                          <td className="p-3.5 text-center"><FeatureIcon value={product.freeVersion} /></td>
                          <td className="p-3.5 text-center"><FeatureIcon value={product.trialAvailable} /></td>
                          {featureCols.map(col => (
                            <td key={col.key} className="p-3.5 text-center"><FeatureIcon value={product.features[col.key] ?? false} /></td>
                          ))}
                          <td className="p-3.5 text-center"><span className="text-xs text-muted-foreground">{product.supportedPlatforms.length}</span></td>
                          <td className="p-3.5"><AffiliateButton product={product} variant="outline" className="px-3 py-1.5 text-xs whitespace-nowrap" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile */}
                <div className="md:hidden space-y-2">
                  {filteredProducts.map(product => {
                    const isExpanded = expandedRow === product.id;
                    return (
                      <div key={product.id} className="rounded-xl border border-border/40 bg-card overflow-hidden">
                        <button onClick={() => setExpandedRow(isExpanded ? null : product.id)} className="w-full p-3.5 flex items-center gap-2.5 text-left">
                          <ProductLogo product={product} size={34} />
                          <div className="flex-1 min-w-0">
                            <p className="font-heading font-semibold text-foreground text-sm">{product.name}</p>
                            <p className="text-[11px] text-muted-foreground">{product.pricingSummary}</p>
                          </div>
                          <RatingBadge rating={product.rating} size="sm" />
                          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        {isExpanded && (
                          <div className="px-3.5 pb-3.5 pt-1 border-t border-border/20 space-y-3">
                            <p className="text-xs text-muted-foreground">{product.bestFor}</p>
                            <div className="grid grid-cols-2 gap-1.5">
                              <div className="flex items-center gap-1.5 text-xs"><FeatureIcon value={product.freeVersion} /><span className="text-muted-foreground">Nemokama</span></div>
                              <div className="flex items-center gap-1.5 text-xs"><FeatureIcon value={product.trialAvailable} /><span className="text-muted-foreground">Bandomoji</span></div>
                              {featureCols.map(col => (
                                <div key={col.key} className="flex items-center gap-1.5 text-xs">
                                  <FeatureIcon value={product.features[col.key] ?? false} /><span className="text-muted-foreground">{col.label}</span>
                                </div>
                              ))}
                            </div>
                            {product.supportedPlatforms.length > 0 && <PlatformBadges platforms={product.supportedPlatforms} />}
                            <AffiliateButton product={product} className="px-4 py-2 text-xs w-full justify-center" label="Gauti pasiūlymą" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollReveal>
            )}
          </section>
        )}

        {/* ═══ 6. METHODOLOGY ═══ */}
        <section className="mb-14 scroll-mt-8">
          <ScrollReveal>
            <div className="rounded-xl border border-border/40 bg-card/60 p-6 md:p-8">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <BadgeCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-foreground mb-0.5">Kaip vertiname antivirusines programas</h2>
                  <p className="text-xs text-muted-foreground">Kiekviena programa vertinama pagal {featureCols.length + 2} kriterijus, remiantis praktine naudojimo patirtimi.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
                {[
                  { title: 'Apsaugos efektyvumas', desc: 'Kenkėjiškos programinės įrangos aptikimas, zero-day grėsmių atpažinimas ir realaus laiko apsaugos veiksmingumas.', icon: Shield },
                  { title: 'Sistemos našumas', desc: 'Poveikis kompiuterio ir telefono greičiui: paleidimo laikas, programų atidarymas, baterijos suvartojimas.', icon: Zap },
                  { title: 'Papildomos funkcijos', desc: 'VPN, slaptažodžių tvarkyklė, tamsaus interneto stebėjimas, tėvų kontrolė ir jų praktinė nauda.', icon: Layers },
                  { title: 'Kainos ir vertės santykis', desc: 'Pirmo metų ir atnaujinimo kaina, įrenginių skaičius, nemokamos versijos galimybės.', icon: BarChart3 },
                  { title: 'Naudojimo paprastumas', desc: 'Sąsajos aiškumas, diegimo greitis, pranešimų kokybė ir pagalbos prieinamumas.', icon: Heart },
                  { title: 'Kelių įrenginių palaikymas', desc: 'Platformų suderinamumas, centralizuotas valdymas ir licencijos lankstumas šeimoms.', icon: Globe },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="rounded-lg bg-secondary/20 p-3.5 flex gap-2.5">
                      <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <h3 className="font-heading font-semibold text-foreground text-xs mb-0.5">{item.title}</h3>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground/40">Redakcija yra nepriklausoma. Affiliate partnerystės neįtakoja vertinimų ar rekomendacijų eiliškumo.</p>
            </div>
          </ScrollReveal>
        </section>

        {/* ═══ 7. BEST BY USE CASE ═══ */}
        <section id="pagal-poreiki" className="mb-14 scroll-mt-8">
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Geriausia antivirusinė pagal poreikį</h2>
            <p className="text-muted-foreground text-sm mb-7 max-w-lg">Ne visiems tinka tas pats sprendimas — štai rekomendacijos pagal situaciją.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {useCases.map((uc, idx) => {
              const matched = findProduct(uc.matchKey);
              const Icon = uc.icon;
              return (
                <ScrollReveal key={idx} delay={idx * 40}>
                  <div className="rounded-xl border border-border/40 bg-card p-5 transition-all duration-300 hover:border-border/60 h-full flex flex-col">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="font-heading font-bold text-foreground text-sm flex-1">{uc.title}</h3>
                      <span className="text-[9px] font-heading font-semibold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0">{uc.tag}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">{uc.description}</p>
                    <p className="text-[11px] text-foreground/70 leading-relaxed mb-3 italic">Kodėl: {uc.why}</p>
                    {matched && (
                      <div className="flex items-center gap-2.5 pt-3 border-t border-border/20 mt-auto">
                        <ProductLogo product={matched} size={30} />
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-semibold text-foreground text-sm">{matched.name}</p>
                          <div className="flex items-center gap-2">
                            <RatingBadge rating={matched.rating} size="sm" />
                            <span className="text-[11px] text-muted-foreground">{matched.pricingSummary}</span>
                          </div>
                        </div>
                        <AffiliateButton product={matched} variant="outline" className="px-3 py-1.5 text-[11px]" />
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* ═══ 8. FREE VS PAID ═══ */}
        <section id="nemokama-vs-mokama" className="mb-14 scroll-mt-8">
          <ScrollReveal>
            <div className="rounded-xl border border-border/40 bg-card/60 p-6 md:p-8">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Nemokama ar mokama antivirusinė?</h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mb-6">Atsakymas priklauso nuo jūsų situacijos. Štai praktinis palyginimas.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div className="rounded-lg border border-border/40 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-heading font-bold text-foreground text-sm">Nemokama versija</h3>
                    <span className="text-[9px] font-heading font-semibold uppercase tracking-wider text-muted-foreground bg-secondary/60 px-1.5 py-0.5 rounded ml-auto">0 €</span>
                  </div>
                  <ul className="space-y-2 text-sm mb-3">
                    {[
                      { good: true, text: 'Bazinė apsauga nuo virusų ir kenkėjiškų programų' },
                      { good: true, text: 'Pakankama lengvam naršymui vienu įrenginiu' },
                      { good: true, text: 'Jokių finansinių įsipareigojimų' },
                      { good: false, text: 'Nėra VPN, slaptažodžių tvarkyklės, tėvų kontrolės' },
                      { good: false, text: 'Ribota techninė pagalba' },
                      { good: false, text: 'Tik vienas įrenginys' },
                    ].map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        {item.good ? <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--success))] mt-0.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/30 mt-0.5 shrink-0" />}
                        <span className="text-xs text-muted-foreground">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-muted-foreground/60 border-t border-border/20 pt-2">Tinka: studentams, vienam įrenginiui, atsargiam naudojimui.</p>
                </div>
                <div className="rounded-lg border border-primary/20 p-5 bg-primary/[0.02]">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-primary" />
                    <h3 className="font-heading font-bold text-foreground text-sm">Mokama versija</h3>
                    <span className="text-[9px] font-heading font-semibold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded ml-auto">20–60 €/m.</span>
                  </div>
                  <ul className="space-y-2 text-sm mb-3">
                    {[
                      { good: true, text: 'Pažangus grėsmių aptikimas ir prevencija' },
                      { good: true, text: 'VPN, slaptažodžių tvarkyklė, tamsaus interneto stebėjimas' },
                      { good: true, text: 'Kelių įrenginių apsauga viena licencija (3–15 įr.)' },
                      { good: true, text: 'Tėvų kontrolė ir šeimos funkcijos' },
                      { good: true, text: 'Prioritetinė 24/7 techninė pagalba' },
                      { good: false, text: 'Metinis mokėjimas (kaina po pirmo metų didesnė)' },
                    ].map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        {item.good ? <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--success))] mt-0.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/30 mt-0.5 shrink-0" />}
                        <span className="text-xs text-muted-foreground">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-muted-foreground/60 border-t border-border/20 pt-2">Tinka: šeimoms, nuotoliniam darbui, keliems įrenginiams.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border/20">
                <p className="text-xs font-heading font-semibold text-foreground mb-2.5">Gilesnės apžvalgos:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { path: '/antivirusines-programos/nemokamos', label: 'Nemokamos antivirusinės' },
                    { path: '/antivirusines-programos/telefonui', label: 'Antivirusinė telefonui' },
                    { path: '/antivirusines-programos/kompiuteriui', label: 'Antivirusinė kompiuteriui' },
                  ].map(link => (
                    <Link key={link.path} to={link.path}
                          className="text-xs font-heading font-medium px-3 py-1.5 rounded-md bg-secondary/50 text-primary hover:bg-primary/10 transition-colors duration-200 inline-flex items-center gap-1">
                      {link.label}<ChevronRight className="w-3 h-3" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ═══ 9. HOW TO CHOOSE ═══ */}
        <section id="kaip-pasirinkti" className="mb-14 scroll-mt-8">
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Kaip pasirinkti tinkamą antivirusinę</h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-lg">Atsakykite į šiuos klausimus — ir bus aišku, kuri programa tinka geriausiai.</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {buyerGuide.map((item, idx) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={idx} delay={idx * 40}>
                  <div className="rounded-xl border border-border/40 bg-card p-4 h-full flex flex-col">
                    <div className="flex items-start gap-2.5 mb-2">
                      <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <h3 className="font-heading font-bold text-foreground text-sm leading-tight pt-1">{item.q}</h3>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed flex-1">{item.advice}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
          <ScrollReveal>
            <div className="mt-5 rounded-lg bg-secondary/20 border border-border/30 p-4 max-w-2xl">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Bendra taisyklė:</strong> jei apsaugote tik vieną Windows kompiuterį ir naršote atsargiai — Windows Defender arba nemokama antivirusinė gali pakakti. Jei turite 2+ įrenginius, telefoną, šeimą arba dirbate nuotoliniu būdu — investuokite į mokamą programą. Kaina dažnai siekia vos 3–5 € per mėnesį.
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* ═══ 10. FAQ ═══ */}
        <section id="duk" className="mb-14 scroll-mt-8">
          <ScrollReveal>
            <FAQAccordion items={category.faq.length > 0 ? category.faq : pillarFaq} title="Dažnai užduodami klausimai" />
          </ScrollReveal>
        </section>

        {/* ═══ 11. RELATED ARTICLES ═══ */}
        {categoryArticles.length > 0 && (
          <section className="mb-14">
            <ScrollReveal>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-5">Susiję straipsniai</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryArticles.map((a, idx) => (
                <ScrollReveal key={a.path} delay={idx * 60}><ArticleCard article={a} /></ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* ═══ 12. RELATED GUIDES ═══ */}
        <section className="mb-14">
          <ScrollReveal>
            <div className="rounded-xl border border-border/40 bg-card/60 p-5 md:p-7">
              <h2 className="font-heading text-lg font-bold text-foreground mb-4">Kiti naudingi gidai</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {relatedGuides.map(guide => {
                  const Icon = guide.icon;
                  return (
                    <Link key={guide.path} to={guide.path}
                          className="flex items-start gap-2.5 rounded-lg p-3 bg-secondary/15 hover:bg-primary/10 transition-colors duration-200 group">
                      <Icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="text-sm text-foreground font-medium block group-hover:text-primary transition-colors">{guide.label}</span>
                        <span className="text-[10px] text-muted-foreground">{guide.desc}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </section>

        <ScrollReveal><TrustDisclosure /></ScrollReveal>
      </div>
    </PageLayout>
  );
};

export default AntivirusLandingPage;
