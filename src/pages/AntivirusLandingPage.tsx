import {
  Star, ExternalLink, Shield, Smartphone, Monitor, ChevronRight, CheckCircle2, XCircle,
  ArrowRight, Clock, BarChart3, Layers, Award, Heart, Zap, Lock, Users, ChevronDown,
  Check, X, Filter, Laptop, Globe, Eye, ShieldCheck, HelpCircle, BadgeCheck,
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

/* ── helpers ── */

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
    <div className="flex gap-1">
      {platforms.slice(0, 4).map(p => {
        const Icon = icons[p] || Globe;
        return (
          <span key={p} className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-secondary/50 rounded px-1.5 py-0.5">
            <Icon className="w-2.5 h-2.5" />{p}
          </span>
        );
      })}
    </div>
  );
}

/* ── jump nav ── */
const jumpLinks = [
  { href: '#top-picks', label: 'Top pasirinkimai', icon: Award },
  { href: '#palyginimas', label: 'Palyginimas', icon: BarChart3 },
  { href: '#pagal-poreiki', label: 'Pagal poreikį', icon: Layers },
  { href: '#nemokama-vs-mokama', label: 'Nemokama vs mokama', icon: Zap },
  { href: '#kaip-pasirinkti', label: 'Kaip pasirinkti', icon: Shield },
  { href: '#duk', label: 'DUK', icon: HelpCircle },
];

/* ── FAQ ── */
const pillarFaq: { q: string; a: string }[] = [
  { q: 'Ar verta mokėti už antivirusinę programą?', a: 'Jei saugote kelis įrenginius, naudojate viešus Wi-Fi tinklus arba jums svarbi tėvų kontrolė ir VPN — taip. Mokamos programos siūlo kelių įrenginių apsaugą, prioritetinę pagalbą ir papildomas funkcijas kaip tamsiojo interneto stebėjimas. Baziniam naršymui vienu įrenginiu nemokama versija gali pakakti, bet ji neapsaugo nuo visų grėsmių.' },
  { q: 'Ar pakanka Windows Defender?', a: 'Windows Defender suteikia solidžią bazinę apsaugą ir daugeliui atsargių naudotojų to užtenka. Tačiau jis neturi VPN, slaptažodžių tvarkyklės, tėvų kontrolės ir kelių įrenginių valdymo. Jei naudojate tik vieną Windows kompiuterį ir naršote atsargiai — gali pakakti. Jei turite šeimą, telefoną ar dirbate nuotoliniu būdu — verta investuoti į specializuotą programą.' },
  { q: 'Kokia antivirusinė geriausia telefonui?', a: 'Android telefonams rekomenduojame Bitdefender Mobile Security ir Norton Mobile Security — abu siūlo stiprią apsaugą su minimaliu poveikiu baterijai ir greičiui. iOS sistemoje antivirusinės veikia ribočiau dėl Apple architektūros, bet vis tiek naudingos dėl VPN, naršymo apsaugos ir phishing blokavimo.' },
  { q: 'Ar nemokamos antivirusinės programos yra saugios?', a: 'Patikimų gamintojų nemokamos versijos — Avast Free, Bitdefender Free — yra saugios ir efektyvios bazinei apsaugai. Venkite nežinomų nemokamų programų: kai kurios renka jūsų duomenis, rodo agresyvią reklamą arba netgi platina kenkėjišką kodą. Visada rinkitės tik žinomus gamintojus.' },
  { q: 'Ar antivirusinė sulėtina kompiuterį?', a: 'Šiuolaikinės antivirusinės turi minimalų poveikį našumui. Geriausi sprendimai kaip Bitdefender ir Norton dirba fone beveik nepastebimi — poveikį galite pajusti tik pilno sistemos skenavimo metu. Senesni ar prasčiau optimizuoti produktai gali labiau apsunkinti sistemą.' },
  { q: 'Kiek įrenginių paprastai apima viena licencija?', a: 'Daugelis mokamų planų apima 3–10 įrenginių. Norton 360 Deluxe siūlo 5 įrenginius, Bitdefender Family Pack — iki 15. Šeimoms ar keliems naudotojams verta rinktis planus su didesniu skaičiumi, nes kaina vienam įrenginiui mažėja.' },
  { q: 'Ar man reikia VPN kartu su antivirusine?', a: 'VPN ypač naudingas jei naudojate viešus Wi-Fi tinklus (kavinėse, oro uostuose), norite apsaugoti privatumą naršant ar pasiekti turinį iš kitų šalių. Daugelis mokamų antivirusinių jau turi integruotą VPN — tai paprasčiausias būdas gauti abu viename.' },
];

/* ── use cases ── */
interface UseCaseBlock { icon: typeof Shield; title: string; description: string; why: string; matchKey: string; tag: string }
const useCases: UseCaseBlock[] = [
  { icon: Award, title: 'Geriausia visapusiška apsauga', description: 'Pilnas saugumo paketas: antivirusas, VPN, slaptažodžių tvarkyklė, tamsiojo interneto stebėjimas ir automatiniai atnaujinimai.', why: 'Plačiausias funkcijų rinkinys ir stipriausias grėsmių aptikimas testų metu.', matchKey: 'Norton', tag: 'Rekomenduojama' },
  { icon: Zap, title: 'Geriausia nemokama antivirusinė', description: 'Patikima bazinė apsauga be jokių mokesčių — tinka studentams, atsargiam naršymui ir tiems, kam nereikia papildomų funkcijų.', why: 'Geriausias grėsmių aptikimo rodiklis tarp nemokamų alternatyvų, be agresyvios reklamos.', matchKey: 'Avast', tag: 'Nemokama' },
  { icon: Users, title: 'Geriausia šeimoms', description: 'Tėvų kontrolė, kelių įrenginių apsauga viena licencija ir centralizuotas valdymas visai šeimai iš vienos paskyros.', why: 'Iki 5–15 įrenginių viena licencija su pilna tėvų kontrole ir šeimos saugumo funkcijomis.', matchKey: 'Norton', tag: 'Šeimoms' },
  { icon: Smartphone, title: 'Geriausia telefonui', description: 'Lengva, baterijos netaušojanti apsauga Android ir iOS su anti-phishing, saugiu naršymu ir programų tikrinimo funkcijomis.', why: 'Mažiausias poveikis baterijos veikimui ir greičiui išlaikant stiprią apsaugą.', matchKey: 'Bitdefender', tag: 'Mobiliai' },
  { icon: Monitor, title: 'Geriausia Windows kompiuteriui', description: 'Stipriausias grėsmių aptikimas su mažiausiu poveikiu sistemos veikimui, žaidimų režimu ir ransoware apsauga.', why: 'Optimizuotas būtent Windows aplinkai su giliu sistemos integravimu ir žemu resursų naudojimu.', matchKey: 'Bitdefender', tag: 'Windows' },
  { icon: Heart, title: 'Geriausia pradedantiesiems', description: 'Paprasta sąsaja, automatinis veikimas ir aiškūs pranešimai — nereikia techninių žinių ar sudėtingų nustatymų.', why: 'Instaliuojama per 3 minutes, veikia automatiškai ir nesiblaško dėl sudėtingų pranešimų.', matchKey: 'Norton', tag: 'Lengva' },
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

/* ── comparison filter options ── */
type FilterKey = 'all' | 'free' | 'family' | 'mobile';
const filterOptions: { key: FilterKey; label: string; icon: typeof Filter }[] = [
  { key: 'all', label: 'Visos', icon: BarChart3 },
  { key: 'free', label: 'Nemokamos', icon: Zap },
  { key: 'family', label: 'Šeimoms', icon: Users },
  { key: 'mobile', label: 'Telefonui', icon: Smartphone },
];

/* ── decision guide questions ── */
const buyerGuide = [
  { q: 'Kiek įrenginių norite apsaugoti?', advice: 'Jei tik vieną kompiuterį — nemokama arba Windows Defender gali pakakti. 2+ įrenginiams rinkitės mokamą planą su kelių įrenginių licencija — kaina vienam įrenginiui bus žymiai mažesnė.', icon: Layers },
  { q: 'Ar reikia telefono apsaugos?', advice: 'Jei naudojate Android — taip, tai svarbu. Android sistema yra atviresnė grėsmėms nei iOS. Rinkitės programą su dedikuota mobilia versija ir minimaliu poveikiu baterijai.', icon: Smartphone },
  { q: 'Ar turite vaikų internete?', advice: 'Jei taip — prioritetas turėtų būti tėvų kontrolė ir turinio filtravimas. Norton ir Kaspersky siūlo stipriausias šeimos kontrolės funkcijas.', icon: Users },
  { q: 'Ar jums svarbus privatumas ir VPN?', advice: 'Jei naudojate viešus Wi-Fi tinklus ar norite privatumo — rinkitės paketą su integruotu VPN. Tai paprasčiau ir pigiau nei pirkti atskirai.', icon: Lock },
  { q: 'Koks jūsų biudžetas?', advice: 'Nemokamos versijos suteikia bazinę apsaugą. Mokamos kainuoja 20–60 €/metus su pirmo metų nuolaida. Šeimos planai (iki 15 įrenginių) dažnai kainuoja tiek pat, kiek 3 įrenginių licencija.', icon: BarChart3 },
  { q: 'Ar norite paprastumo ar kontrolės?', advice: 'Jei nemėgstate sudėtingų nustatymų — Norton ar Avast veikia beveik automatiškai. Jei norite daugiau kontrolės — Bitdefender ir Kaspersky siūlo detalesnius nustatymus pažengusiems.', icon: Shield },
];

/* ═══════════════════════════════════════════════════════════════ */

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

  // Quick winner badges for hero
  const bestOverall = products[0];
  const bestFree = products.find(p => p.freeVersion);
  const bestFamily = products.find(p => p.features['Tėvų kontrolė'] === true);

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
                {/* Meta line */}
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
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mb-6">
                  Išanalizavome populiariausias antivirusines programas pagal apsaugos efektyvumą, poveikį greičiui, papildomas funkcijas ir kainą. Žemiau — mūsų redakcijos rekomendacijos, detalus palyginimas ir praktiniai patarimai, kaip pasirinkti.
                </p>

                {/* Quick winner badges */}
                {products.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {bestOverall && (
                      <a href="#top-picks" className="inline-flex items-center gap-2 rounded-lg bg-accent/10 border border-accent/20 px-3 py-2 hover:bg-accent/15 transition-colors group">
                        <Award className="w-4 h-4 text-accent" />
                        <div>
                          <span className="text-[10px] text-accent font-heading font-semibold uppercase tracking-wider block leading-tight">Geriausia 2025</span>
                          <span className="text-xs text-foreground font-medium">{bestOverall.name}</span>
                        </div>
                      </a>
                    )}
                    {bestFree && (
                      <a href="#top-picks" className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/20 px-3 py-2 hover:bg-[hsl(var(--success))]/15 transition-colors group">
                        <Zap className="w-4 h-4 text-[hsl(var(--success))]" />
                        <div>
                          <span className="text-[10px] text-[hsl(var(--success))] font-heading font-semibold uppercase tracking-wider block leading-tight">Geriausia nemokama</span>
                          <span className="text-xs text-foreground font-medium">{bestFree.name}</span>
                        </div>
                      </a>
                    )}
                    {bestFamily && (
                      <a href="#pagal-poreiki" className="inline-flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-3 py-2 hover:bg-primary/15 transition-colors group">
                        <Users className="w-4 h-4 text-primary" />
                        <div>
                          <span className="text-[10px] text-primary font-heading font-semibold uppercase tracking-wider block leading-tight">Geriausia šeimoms</span>
                          <span className="text-xs text-foreground font-medium">{bestFamily.name}</span>
                        </div>
                      </a>
                    )}
                  </div>
                )}

                {/* Jump nav */}
                <nav className="flex flex-wrap gap-1.5" aria-label="Greitoji navigacija">
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-10">
            {[
              { value: products.length.toString(), label: 'Programų palyginta', icon: BarChart3 },
              { value: (featureCols.length + 2).toString(), label: 'Vertinimo kriterijų', icon: Layers },
              { value: '4', label: 'Platformos (Win, Mac, Android, iOS)', icon: Monitor },
              { value: buyerGuide.length.toString(), label: 'Pasirinkimo klausimai', icon: HelpCircle },
              { value: updatedLabel, label: 'Paskutinis atnaujinimas', icon: Clock },
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

        {/* ═══ 3. TOP PICKS (richer cards) ═══ */}
        {topPicks.length > 0 && (
          <section id="top-picks" className="mb-14 scroll-mt-8">
            <ScrollReveal>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Redakcijos pasirinkimai</h2>
                  <p className="text-muted-foreground text-sm max-w-lg">Programos, kurios šiandien siūlo geriausią apsaugos, funkcijų ir kainos derinį.</p>
                </div>
              </div>
            </ScrollReveal>

            <div className="space-y-4">
              {topPicks.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 60}>
                  <div className={`relative rounded-xl border bg-card overflow-hidden transition-all duration-300 ${i === 0 ? 'border-accent/30 shadow-lg shadow-accent/5' : 'border-border/50'}`}>
                    {i === 0 && <div className="absolute -top-px left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/60 to-transparent" />}

                    <div className="p-5 md:p-6">
                      {/* Header row */}
                      <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                        {/* Rank + Logo + Name */}
                        <div className="flex items-start gap-3 md:min-w-[200px]">
                          <span className="font-heading font-bold text-2xl tabular-nums text-muted-foreground/25 w-7 text-center shrink-0 mt-1">{i + 1}</span>
                          <ProductLogo product={product} size={52} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-heading font-bold text-foreground text-lg leading-tight">{product.name}</h3>
                              {i === 0 && <span className="text-[9px] font-heading font-bold uppercase tracking-wider bg-accent/15 text-accent px-1.5 py-0.5 rounded">Nr. 1</span>}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{product.bestFor}</p>
                            <div className="mt-1.5"><RatingStars rating={product.rating} /></div>
                          </div>
                        </div>

                        {/* Verdict */}
                        <div className="flex-1 min-w-0 md:pt-1">
                          <p className="text-sm text-muted-foreground leading-relaxed">{product.verdict || product.shortDescription}</p>
                        </div>

                        {/* Price + CTA */}
                        <div className="flex items-center gap-4 shrink-0 md:flex-col md:items-end md:gap-2">
                          <div className="md:text-right">
                            <p className="text-sm font-heading font-bold text-foreground whitespace-nowrap">{product.pricingSummary}</p>
                            {product.freeVersion && <p className="text-[10px] text-[hsl(var(--success))] font-medium mt-0.5">Yra nemokama versija</p>}
                            {product.trialAvailable && !product.freeVersion && <p className="text-[10px] text-primary font-medium mt-0.5">Bandomasis laikotarpis</p>}
                          </div>
                          <AffiliateButton product={product} className="px-5 py-2.5 text-sm" label="Gauti pasiūlymą" />
                        </div>
                      </div>

                      {/* Strengths + Features row */}
                      <div className="mt-4 pt-4 border-t border-border/20 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Key strengths */}
                        <div>
                          <p className="text-[10px] font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-2">Stipriosios pusės</p>
                          <ul className="space-y-1">
                            {product.pros.slice(0, 4).map((pro, j) => (
                              <li key={j} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                <CheckCircle2 className="w-3 h-3 text-[hsl(var(--success))] mt-0.5 shrink-0" />{pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* Features + platforms */}
                        <div>
                          <p className="text-[10px] font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-2">Funkcijos ir platformos</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                            {featureCols.map(col => {
                              const val = product.features[col.key];
                              return (
                                <span key={col.key} className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                  {val === true ? <Check className="w-3 h-3 text-[hsl(var(--success))]" /> : <X className="w-3 h-3 text-muted-foreground/25" />}
                                  {col.label}
                                </span>
                              );
                            })}
                          </div>
                          {product.supportedPlatforms.length > 0 && <PlatformBadges platforms={product.supportedPlatforms} />}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* ═══ 4. METHODOLOGY ═══ */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { title: 'Apsaugos efektyvumas', desc: 'Kenkėjiškos programinės įrangos aptikimas, zero-day grėsmių atpažinimas ir realaus laiko apsaugos veiksmingumas.', icon: Shield },
                  { title: 'Sistemos našumas', desc: 'Poveikis kompiuterio ir telefono greičiui: paleidimo laikas, programų atidarymas, baterijos suvartojimas.', icon: Zap },
                  { title: 'Papildomos funkcijos', desc: 'VPN, slaptažodžių tvarkyklė, tamsaus interneto stebėjimas, tėvų kontrolė ir jų praktinė nauda.', icon: Layers },
                  { title: 'Kainos ir vertės santykis', desc: 'Pirmo metų ir atnaujinimo kaina, įrenginių skaičius, nemokamos versijos galimybės.', icon: BarChart3 },
                  { title: 'Naudojimo paprastumas', desc: 'Sąsajos aiškumas, diegimo greitis, pranešimų kokybė ir pagalbos prieinamumas.', icon: Heart },
                  { title: 'Kelių įrenginių palaikymas', desc: 'Platformų suderinamumas, centralizuotas valdymas ir licencijos lankstumas šeimoms.', icon: Globe },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="rounded-lg bg-secondary/20 p-3.5 flex gap-2.5">
                      <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <h3 className="font-heading font-semibold text-foreground text-xs mb-0.5">{item.title}</h3>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground/40 mt-5">Redakcija yra nepriklausoma. Affiliate partnerystės neįtakoja vertinimų ar rekomendacijų eiliškumo.</p>
            </div>
          </ScrollReveal>
        </section>

        {/* ═══ 5. COMPARISON TABLE with filters ═══ */}
        {products.length > 0 && (
          <section id="palyginimas" className="mb-14 scroll-mt-8">
            <ScrollReveal>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Detalus palyginimas</h2>
                  <p className="text-muted-foreground text-sm max-w-lg">Visų vertinamų programų funkcijų ir kainų palyginimas.</p>
                </div>
                {/* Filter toggles */}
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

            {/* Desktop table */}
            {filteredProducts.length > 0 && (
              <ScrollReveal>
                <div className="hidden md:block overflow-x-auto rounded-xl border border-border/50 bg-card">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/40 bg-secondary/20">
                        <th className="text-left p-3.5 font-heading font-semibold text-foreground">Programa</th>
                        <th className="text-center p-3.5 font-heading font-semibold text-foreground">Įvertinimas</th>
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
                      {filteredProducts.map((product, i) => (
                        <tr key={product.id} className={`${i < filteredProducts.length - 1 ? 'border-b border-border/30' : ''} hover:bg-secondary/10 transition-colors duration-150`}>
                          <td className="p-3.5">
                            <div className="flex items-center gap-2.5">
                              <ProductLogo product={product} size={30} />
                              <div>
                                <p className="font-heading font-semibold text-foreground text-sm">{product.name}</p>
                                <p className="text-[10px] text-muted-foreground leading-tight max-w-[160px] truncate">{product.bestFor}</p>
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
                          <td className="p-3.5 text-center">
                            <span className="text-xs text-muted-foreground">{product.supportedPlatforms.length}</span>
                          </td>
                          <td className="p-3.5"><AffiliateButton product={product} variant="outline" className="px-3 py-1.5 text-xs whitespace-nowrap" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile: expandable cards */}
                <div className="md:hidden space-y-2">
                  {filteredProducts.map((product) => {
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
                            {product.pros.length > 0 && (
                              <ul className="space-y-1">
                                {product.pros.slice(0, 3).map((pro, j) => (
                                  <li key={j} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                                    <CheckCircle2 className="w-3 h-3 text-[hsl(var(--success))] mt-0.5 shrink-0" />{pro}
                                  </li>
                                ))}
                              </ul>
                            )}
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

        {/* ═══ 6. BEST BY USE CASE ═══ */}
        <section id="pagal-poreiki" className="mb-14 scroll-mt-8">
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Geriausia antivirusinė pagal poreikį</h2>
            <p className="text-muted-foreground text-sm mb-7 max-w-lg">Ne visiems tinka tas pats sprendimas — štai konkrečios rekomendacijos pagal situaciją.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {useCases.map((uc, i) => {
              const matched = findProduct(uc.matchKey);
              const Icon = uc.icon;
              return (
                <ScrollReveal key={i} delay={i * 40}>
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

        {/* ═══ 7. FREE VS PAID ═══ */}
        <section id="nemokama-vs-mokama" className="mb-14 scroll-mt-8">
          <ScrollReveal>
            <div className="rounded-xl border border-border/40 bg-card/60 p-6 md:p-8">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Nemokama ar mokama antivirusinė?</h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mb-6">
                Atsakymas priklauso nuo jūsų situacijos. Štai praktinis palyginimas, kuris padės apsispręsti.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Free */}
                <div className="rounded-lg border border-border/40 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-heading font-bold text-foreground text-sm">Nemokama versija</h3>
                    <span className="text-[9px] font-heading font-semibold uppercase tracking-wider text-muted-foreground bg-secondary/60 px-1.5 py-0.5 rounded ml-auto">0 €</span>
                  </div>
                  <ul className="space-y-2 text-sm mb-4">
                    {[
                      { good: true, text: 'Bazinė apsauga nuo virusų ir kenkėjiškų programų' },
                      { good: true, text: 'Pakankama lengvam, atsargiam naršymui vienu įrenginiu' },
                      { good: true, text: 'Jokių finansinių įsipareigojimų' },
                      { good: false, text: 'Ribota arba jokia techninė pagalba' },
                      { good: false, text: 'Nėra VPN, slaptažodžių tvarkyklės, tėvų kontrolės' },
                      { good: false, text: 'Dažnai rodo siūlymus pereiti prie mokamos versijos' },
                      { good: false, text: 'Tik vienas įrenginys, jokio centralizuoto valdymo' },
                    ].map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        {item.good ? <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--success))] mt-0.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/30 mt-0.5 shrink-0" />}
                        <span className="text-xs text-muted-foreground">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-muted-foreground/60 border-t border-border/20 pt-2">Tinka: studentams, vienam įrenginiui, atsargiam naudojimui. Windows Defender irgi gali pakakti šiai auditorijai.</p>
                </div>
                {/* Paid */}
                <div className="rounded-lg border border-primary/20 p-5 bg-primary/[0.02]">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-primary" />
                    <h3 className="font-heading font-bold text-foreground text-sm">Mokama versija</h3>
                    <span className="text-[9px] font-heading font-semibold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded ml-auto">20–60 €/m.</span>
                  </div>
                  <ul className="space-y-2 text-sm mb-4">
                    {[
                      { good: true, text: 'Pažangus grėsmių aptikimas ir proaktyvi prevencija' },
                      { good: true, text: 'VPN, slaptažodžių tvarkyklė, tamsaus interneto stebėjimas' },
                      { good: true, text: 'Kelių įrenginių apsauga viena licencija (3–15 įr.)' },
                      { good: true, text: 'Tėvų kontrolė ir šeimos apsaugos funkcijos' },
                      { good: true, text: 'Prioritetinė 24/7 techninė pagalba' },
                      { good: true, text: 'Centralizuotas visų įrenginių valdymas' },
                      { good: false, text: 'Reikalauja metinio mokėjimo (kaina po pirmo metų didesnė)' },
                    ].map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        {item.good ? <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--success))] mt-0.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/30 mt-0.5 shrink-0" />}
                        <span className="text-xs text-muted-foreground">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-muted-foreground/60 border-t border-border/20 pt-2">Tinka: šeimoms, nuotoliniam darbui, keliems įrenginiams, visiems, kam svarbu daugiau nei bazinė apsauga.</p>
                </div>
              </div>

              {/* Internal links */}
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

        {/* ═══ 8. HOW TO CHOOSE — buyer's guide ═══ */}
        <section id="kaip-pasirinkti" className="mb-14 scroll-mt-8">
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Kaip pasirinkti tinkamą antivirusinę</h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-lg">Atsakykite į šiuos klausimus — ir bus aišku, kuri programa jums tinka geriausiai.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {buyerGuide.map((item, i) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={i} delay={i * 40}>
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
                <strong className="text-foreground">Bendra taisyklė:</strong> jei apsaugote tik vieną Windows kompiuterį ir naršote atsargiai — Windows Defender arba nemokama antivirusinė gali pakakti. Jei turite 2+ įrenginius, telefoną, šeimą arba dirbate nuotoliniu būdu — investuokite į mokamą programą su kelių įrenginių licencija. Kaina dažnai siekia vos 3–5 € per mėnesį.
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* ═══ 9. FAQ ═══ */}
        <section id="duk" className="mb-14 scroll-mt-8">
          <ScrollReveal>
            <FAQAccordion items={category.faq.length > 0 ? category.faq : pillarFaq} title="Dažnai užduodami klausimai" />
          </ScrollReveal>
        </section>

        {/* ═══ 10. RELATED ARTICLES ═══ */}
        {categoryArticles.length > 0 && (
          <section className="mb-14">
            <ScrollReveal>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-5">Susiję straipsniai</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryArticles.map((a, i) => (
                <ScrollReveal key={a.path} delay={i * 60}>
                  <ArticleCard article={a} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* ═══ 11. RELATED GUIDES ═══ */}
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

        {/* ═══ TRUST DISCLOSURE ═══ */}
        <ScrollReveal>
          <TrustDisclosure />
        </ScrollReveal>
      </div>
    </PageLayout>
  );
};

export default AntivirusLandingPage;
