import {
  Star, ExternalLink, Shield, Smartphone, Monitor, ChevronRight, CheckCircle2, XCircle,
  Clock, BarChart3, Layers, Award, Heart, Zap, Lock, Users, ChevronDown,
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

/* ══════════════ HELPERS ══════════════ */

function RatingBadge({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' }) {
  const cls = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-sm px-2.5 py-1 gap-1';
  return (
    <span className={`${cls} inline-flex items-center rounded-md bg-accent/10 text-accent font-bold tabular-nums font-heading`}>
      <Star className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} fill-accent stroke-accent`} />
      {rating.toFixed(1)}
    </span>
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

/* ══════════════ STATIC DATA ══════════════ */

const jumpLinks = [
  { href: '#top-picks', label: 'Top pasirinkimai', icon: Award },
  { href: '#palyginimas', label: 'Palyginimas', icon: BarChart3 },
  { href: '#pagal-poreiki', label: 'Pagal poreikį', icon: Layers },
  { href: '#apzvalgos', label: 'Apžvalgos', icon: Shield },
  { href: '#kaip-pasirinkti', label: 'Kaip pasirinkti', icon: HelpCircle },
  { href: '#duk', label: 'DUK', icon: HelpCircle },
];

const pillarFaq: { q: string; a: string }[] = [
  { q: 'Ar verta mokėti už antivirusinę programą?', a: 'Jei saugote kelis įrenginius, naudojate viešus Wi-Fi tinklus arba jums svarbi tėvų kontrolė ir VPN — taip. Baziniam naršymui vienu įrenginiu nemokama versija gali pakakti.' },
  { q: 'Ar pakanka Windows Defender?', a: 'Solidžiai bazinei apsaugai — taip. Tačiau jis neturi VPN, slaptažodžių tvarkyklės, tėvų kontrolės ir kelių įrenginių valdymo. Šeimoms ir nuotoliniam darbui verta investuoti.' },
  { q: 'Kokia antivirusinė geriausia telefonui?', a: 'Android — Bitdefender Mobile Security ir Norton Mobile Security. iOS sistemoje antivirusinės ribotesnės, bet naudingos dėl VPN ir anti-phishing.' },
  { q: 'Ar nemokamos antivirusinės yra saugios?', a: 'Patikimų gamintojų (Avast Free, Bitdefender Free) — taip. Venkite nežinomų nemokamų programų, kurios gali rinkti duomenis.' },
  { q: 'Ar antivirusinė sulėtina kompiuterį?', a: 'Šiuolaikinės programos turi minimalų poveikį. Bitdefender ir Norton dirba fone beveik nepastebimi.' },
  { q: 'Kiek įrenginių apima viena licencija?', a: 'Daugelis planų apima 3–10 įrenginių. Norton 360 Deluxe — 5, Bitdefender Family Pack — iki 15.' },
  { q: 'Ar man reikia VPN kartu su antivirusine?', a: 'VPN naudingas viešuose Wi-Fi tinkluose ir privatumui. Daugelis mokamų antivirusinių jau turi integruotą VPN.' },
];

// Compressed editorial — shorter, punchier
const productEditorials: Record<string, { summary: string; strengths: string; verdict: string }> = {
  'Norton': {
    summary: 'Norton 360 — visapusiškiausias saugumo paketas rinkoje. Pažangus grėsmių aptikimas, paremtas mašininiu mokymusi, kartu su neribotu VPN, slaptažodžių tvarkykle, tamsiojo interneto stebėjimu ir 50 GB debesies saugykla. Specialiai šeimoms — Norton Family tėvų kontrolė leidžia stebėti vaikų veiklą ir nustatyti ekrano laiko limitus.',
    strengths: 'Išsiskiria integruotu neribotu VPN (retas privalumas tarp antivirusinių), tamsiojo interneto stebėjimu ir 60 dienų pinigų grąžinimo garantija. Deluxe planas apima 5 įrenginius už ~50 €/metus.',
    verdict: 'Geriausias pasirinkimas tiems, kam reikia visapusiškos apsaugos su VPN ir šeimos funkcijomis.',
  },
  'Bitdefender': {
    summary: 'Bitdefender Total Security naudoja debesijos skenavimą — grėsmių analizė vyksta serveriuose, ne jūsų kompiuteryje. Rezultatas: mažiau nei 1% procesoriaus naudojimo fone. Turi specialius žaidimų, darbo ir filmų režimus, kurie automatiškai optimizuoja resursus.',
    strengths: 'Unikalios funkcijos: Safepay apsaugotas naršyklės langas bankininkystei, webcam/mikrofono apsauga, pažangus ugniasienės modulis. Total Security — ~55 €/metus iki 5 įrenginių.',
    verdict: 'Geriausias Windows naudotojams ir žaidėjams, kuriems svarbus minimalus poveikis greičiui.',
  },
  'Kaspersky': {
    summary: 'Kaspersky Plus — 25+ metų kibernetinio saugumo patirtis. Nuolat užima aukščiausias vietas AV-TEST ir AV-Comparatives testuose. „Safe Money" funkcija automatiškai atidaro banko puslapius saugioje aplinkoje. Integruotas VPN su neribotais duomenimis veikia per 70+ šalių.',
    strengths: 'Geriausias kainos-vertės santykis: Plus planas — ~35 €/metus 3 įrenginiams su VPN ir slaptažodžių tvarkykle. 30 dienų pinigų grąžinimo garantija.',
    verdict: 'Puikus pasirinkimas patyrusiems naudotojams, kurie nori aukščiausio lygio apsaugos už prieinamą kainą.',
  },
  'Avast': {
    summary: 'Avast Free Antivirus — populiariausia nemokama antivirusinė su 400M+ naudotojų. Siūlo realaus laiko apsaugą, Wi-Fi tinklo tikrinimą ir naršyklės apsaugą nuo phishing atakų. Nemokama versija neturi laiko apribojimo.',
    strengths: 'Stipri bazinė apsauga visiškai nemokamai. Premium versija prideda pažangią ransomware apsaugą ir ugniasienę — ~50 €/metus arba 65 €/metus iki 10 įrenginių.',
    verdict: 'Geriausias nemokamas pasirinkimas studentams ir atsargiam naršymui be finansinių įsipareigojimų.',
  },
};

interface UseCaseBlock { icon: typeof Shield; title: string; why: string; matchKey: string; tag: string }
const useCases: UseCaseBlock[] = [
  { icon: Award, title: 'Geriausia visapusiška apsauga', why: 'Plačiausias funkcijų rinkinys su neribotu VPN ir tamsiojo interneto stebėjimu.', matchKey: 'Norton', tag: 'Rekomenduojama' },
  { icon: Zap, title: 'Geriausia nemokama', why: 'Stipriausias grėsmių aptikimas tarp nemokamų alternatyvų, be agresyvios reklamos.', matchKey: 'Avast', tag: 'Nemokama' },
  { icon: Users, title: 'Geriausia šeimoms', why: 'Iki 5–15 įrenginių viena licencija su pilna tėvų kontrole ir ekrano laiko valdymu.', matchKey: 'Norton', tag: 'Šeimoms' },
  { icon: Smartphone, title: 'Geriausia telefonui', why: 'Mažiausias poveikis baterijai išlaikant stiprią Android/iOS apsaugą.', matchKey: 'Bitdefender', tag: 'Mobiliai' },
  { icon: Monitor, title: 'Geriausia Windows kompiuteriui', why: 'Debesijos skenavimas su žaidimų režimu — optimizuota būtent Windows aplinkai.', matchKey: 'Bitdefender', tag: 'Windows' },
  { icon: Heart, title: 'Geriausia pradedantiesiems', why: 'Instaliuojama per 3 min, veikia automatiškai, aiškūs pranešimai.', matchKey: 'Norton', tag: 'Lengva' },
];

const buyerGuide = [
  { q: 'Kiek įrenginių?', advice: '1 įrenginys — pakanka nemokama. 2+ — rinkitės mokamą su kelių įrenginių licencija.', icon: Layers },
  { q: 'Reikia telefono apsaugos?', advice: 'Android atviresnė grėsmėms. Rinkitės su dedikuota mobilia versija ir mažu baterijos poveikiu.', icon: Smartphone },
  { q: 'Turite vaikų internete?', advice: 'Prioritetas — tėvų kontrolė. Norton ir Kaspersky siūlo stipriausias šeimos funkcijas.', icon: Users },
  { q: 'Svarbus VPN ar slaptažodžiai?', advice: 'Viešuose Wi-Fi — rinkitės paketą su integruotu VPN. Pigiau nei pirkti atskirai.', icon: Lock },
  { q: 'Koks biudžetas?', advice: 'Nemokamos — bazinei apsaugai. Mokamos 20–60 €/m. Šeimos planai dažnai tos pačios kainos.', icon: BarChart3 },
  { q: 'Paprastumas ar kontrolė?', advice: 'Norton — automatinis. Bitdefender/Kaspersky — daugiau nustatymų pažengusiems.', icon: Shield },
];

const relatedGuides = [
  { path: '/antivirusines-programos/nemokamos', label: 'Nemokamos antivirusinės', desc: 'Geriausi nemokami sprendimai', icon: Zap },
  { path: '/antivirusines-programos/telefonui', label: 'Antivirusinė telefonui', desc: 'Android ir iOS gidas', icon: Smartphone },
  { path: '/antivirusines-programos/kompiuteriui', label: 'Antivirusinė kompiuteriui', desc: 'Windows ir Mac palyginimas', icon: Monitor },
  { path: '/virusai/kas-yra-kompiuterinis-virusas', label: 'Kas yra kompiuterinis virusas?', desc: 'Virusų tipai ir veikimas', icon: Eye },
  { path: '/virusai/virusas-telefone', label: 'Virusas telefone', desc: 'Kaip pašalinti', icon: ShieldCheck },
];

const featureCols = [
  { key: 'VPN', label: 'VPN' },
  { key: 'Slaptažodžių tvarkyklė', label: 'Slaptažodžiai' },
  { key: 'Tėvų kontrolė', label: 'Tėvų kontr.' },
  { key: 'Telefonų apsauga', label: 'Tel. apsauga' },
];

type FilterKey = 'all' | 'free' | 'family' | 'mobile';
const filterOptions: { key: FilterKey; label: string; icon: typeof BarChart3 }[] = [
  { key: 'all', label: 'Visos', icon: BarChart3 },
  { key: 'free', label: 'Nemokamos', icon: Zap },
  { key: 'family', label: 'Šeimoms', icon: Users },
  { key: 'mobile', label: 'Telefonui', icon: Smartphone },
];

const medalLabels = ['🥇', '🥈', '🥉'];

/* ══════════════════════════════════════════ */

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
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
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

        {/* ═══ 1. HERO — compact ═══ */}
        <ScrollReveal>
          <section className="relative rounded-2xl overflow-hidden border border-border/40 mb-6">
            <div className="absolute inset-0 gradient-mesh" />
            <div className="absolute inset-0 bg-card/50" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="relative p-5 md:p-8">
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
                  <span className="text-[11px] font-heading font-semibold text-primary uppercase tracking-[0.14em]">Nepriklausomas palyginimas</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{updatedLabel}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30 hidden sm:block" />
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Lock className="w-3 h-3" />Affiliate nuorodos</span>
                </div>

                <h1 className="font-heading text-3xl md:text-[2.75rem] lg:text-5xl font-bold text-foreground leading-[1.08] mb-3">
                  Geriausios antivirusinės programos 2025&nbsp;m.
                </h1>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mb-4">
                  Išanalizavome populiariausias antivirusines pagal apsaugą, greitį, funkcijas ir kainą — kad galėtumėte pasirinkti per kelias minutes.
                </p>

                {/* Quick winners + jump nav in one row */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                  {products.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {bestOverall && (
                        <a href="#top-picks" className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 border border-accent/20 px-2.5 py-1.5 hover:bg-accent/15 transition-colors text-xs">
                          <span className="text-accent font-heading font-semibold">🥇 {bestOverall.name}</span>
                        </a>
                      )}
                      {bestFree && (
                        <a href="#top-picks" className="inline-flex items-center gap-1.5 rounded-md bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/20 px-2.5 py-1.5 hover:bg-[hsl(var(--success))]/15 transition-colors text-xs">
                          <span className="text-[hsl(var(--success))] font-heading font-semibold">Nemokama: {bestFree.name}</span>
                        </a>
                      )}
                      {bestFamily && bestFamily !== bestOverall && (
                        <a href="#pagal-poreiki" className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 border border-primary/20 px-2.5 py-1.5 hover:bg-primary/15 transition-colors text-xs">
                          <span className="text-primary font-heading font-semibold">Šeimoms: {bestFamily.name}</span>
                        </a>
                      )}
                    </div>
                  )}
                  <nav className="flex flex-wrap gap-1" aria-label="Turinys">
                    {jumpLinks.map(link => {
                      const Icon = link.icon;
                      return (
                        <a key={link.href} href={link.href}
                           className="text-[11px] font-heading font-medium px-2 py-1 rounded-md bg-secondary/40 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors inline-flex items-center gap-1">
                          <Icon className="w-3 h-3" />{link.label}
                        </a>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ═══ 2. TRUST STRIP — inline compact ═══ */}
        <ScrollReveal>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-lg border border-border/30 bg-card/40 px-4 py-3 mb-8 text-center">
            {[
              { icon: BarChart3, text: `${products.length} programos palygintos` },
              { icon: Layers, text: `${featureCols.length + 2} vertinimo kriterijai` },
              { icon: Monitor, text: '4 platformos' },
              { icon: BadgeCheck, text: 'Nepriklausoma redakcija' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <span key={i} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon className="w-3.5 h-3.5 text-primary" />{s.text}
                </span>
              );
            })}
          </div>
        </ScrollReveal>

        {/* ═══ 3. TOP PICKS — compressed cards ═══ */}
        {topPicks.length > 0 && (
          <section id="top-picks" className="mb-10 scroll-mt-8">
            <ScrollReveal>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Mūsų pasirinkimai</h2>
              <p className="text-muted-foreground text-sm mb-5">Greita santrauka — detalesnės apžvalgos žemiau.</p>
            </ScrollReveal>

            <div className="space-y-2.5">
              {topPicks.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 40}>
                  <div className={`rounded-xl border bg-card p-4 transition-all duration-200 hover:border-primary/25 ${i === 0 ? 'border-accent/30' : 'border-border/40'}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-lg shrink-0 pt-0.5">{medalLabels[i] || `${i + 1}.`}</span>
                      <ProductLogo product={product} size={40} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-heading font-bold text-foreground text-sm">{product.name}</h3>
                          <RatingBadge rating={product.rating} size="sm" />
                          <span className="text-xs text-muted-foreground">{product.pricingSummary}</span>
                          {product.freeVersion && <span className="text-[10px] text-[hsl(var(--success))] font-medium bg-[hsl(var(--success))]/10 px-1.5 py-0.5 rounded">Nemokama versija</span>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{product.bestFor}</p>
                        {/* Compact pros/cons inline */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                          {product.pros.slice(0, 3).map((p, j) => (
                            <span key={j} className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                              <CheckCircle2 className="w-3 h-3 text-[hsl(var(--success))] shrink-0" />{p}
                            </span>
                          ))}
                          {product.cons.slice(0, 2).map((c, j) => (
                            <span key={j} className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                              <XCircle className="w-3 h-3 text-muted-foreground/30 shrink-0" />{c}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="shrink-0 hidden sm:block">
                        <AffiliateButton product={product} className="px-4 py-2 text-xs" />
                      </div>
                    </div>
                    <div className="sm:hidden mt-3">
                      <AffiliateButton product={product} className="px-4 py-2 text-xs w-full justify-center" />
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* ═══ 4. COMPARISON TABLE — main decision tool ═══ */}
        {products.length > 0 && (
          <section id="palyginimas" className="mb-12 scroll-mt-8">
            <ScrollReveal>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-0.5">Palyginimo lentelė</h2>
                  <p className="text-muted-foreground text-sm">Visos funkcijos ir kainos vienoje vietoje.</p>
                </div>
                <div className="flex gap-1.5">
                  {filterOptions.map(opt => {
                    const Icon = opt.icon;
                    const active = activeFilter === opt.key;
                    return (
                      <button key={opt.key} onClick={() => setActiveFilter(opt.key)}
                              className={`text-[11px] font-heading font-medium px-2.5 py-1.5 rounded-md inline-flex items-center gap-1 transition-colors ${active ? 'bg-primary/15 text-primary border border-primary/20' : 'bg-secondary/40 text-muted-foreground hover:bg-secondary/70 border border-transparent'}`}>
                        <Icon className="w-3 h-3" />{opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>

            {filteredProducts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">Nėra produktų pagal pasirinktą filtrą.</p>
            )}

            {filteredProducts.length > 0 && (
              <ScrollReveal>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto rounded-xl border border-border/50 bg-card">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/40 bg-secondary/20">
                        <th className="text-left p-3 font-heading font-semibold text-foreground">Programa</th>
                        <th className="text-center p-3 font-heading font-semibold text-foreground">Įvert.</th>
                        <th className="text-center p-3 font-heading font-semibold text-foreground">Kaina</th>
                        <th className="text-center p-3 font-heading font-semibold text-foreground">Nemokama</th>
                        <th className="text-center p-3 font-heading font-semibold text-foreground">Bandomoji</th>
                        {featureCols.map(col => (
                          <th key={col.key} className="text-center p-3 font-heading font-semibold text-foreground whitespace-nowrap">{col.label}</th>
                        ))}
                        <th className="text-center p-3 font-heading font-semibold text-foreground">Platformos</th>
                        <th className="p-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product, idx) => (
                        <tr key={product.id} className={`${idx < filteredProducts.length - 1 ? 'border-b border-border/30' : ''} hover:bg-secondary/10 transition-colors`}>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <ProductLogo product={product} size={26} />
                              <span className="font-heading font-semibold text-foreground text-sm">{product.name}</span>
                            </div>
                          </td>
                          <td className="p-3 text-center"><RatingBadge rating={product.rating} size="sm" /></td>
                          <td className="p-3 text-center text-muted-foreground whitespace-nowrap text-xs">{product.pricingSummary}</td>
                          <td className="p-3 text-center"><FeatureIcon value={product.freeVersion} /></td>
                          <td className="p-3 text-center"><FeatureIcon value={product.trialAvailable} /></td>
                          {featureCols.map(col => (
                            <td key={col.key} className="p-3 text-center"><FeatureIcon value={product.features[col.key] ?? false} /></td>
                          ))}
                          <td className="p-3 text-center"><span className="text-xs text-muted-foreground">{product.supportedPlatforms.length}</span></td>
                          <td className="p-3"><AffiliateButton product={product} variant="outline" className="px-3 py-1.5 text-xs whitespace-nowrap" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden space-y-2">
                  {filteredProducts.map(product => {
                    const isExpanded = expandedRow === product.id;
                    return (
                      <div key={product.id} className="rounded-xl border border-border/40 bg-card overflow-hidden">
                        <button onClick={() => setExpandedRow(isExpanded ? null : product.id)} className="w-full p-3 flex items-center gap-2.5 text-left">
                          <ProductLogo product={product} size={30} />
                          <div className="flex-1 min-w-0">
                            <p className="font-heading font-semibold text-foreground text-sm">{product.name}</p>
                            <p className="text-[11px] text-muted-foreground">{product.pricingSummary}</p>
                          </div>
                          <RatingBadge rating={product.rating} size="sm" />
                          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        {isExpanded && (
                          <div className="px-3 pb-3 pt-1 border-t border-border/20 space-y-2">
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

        {/* ═══ 5. BEST BY USE CASE — tighter ═══ */}
        <section id="pagal-poreiki" className="mb-12 scroll-mt-8">
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Geriausia pagal poreikį</h2>
            <p className="text-muted-foreground text-sm mb-5">Skirtingiems naudotojams — skirtingi sprendimai.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {useCases.map((uc, idx) => {
              const matched = findProduct(uc.matchKey);
              const Icon = uc.icon;
              return (
                <ScrollReveal key={idx} delay={idx * 30}>
                  <div className="rounded-xl border border-border/40 bg-card p-4 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-primary shrink-0" />
                      <h3 className="font-heading font-bold text-foreground text-sm flex-1">{uc.title}</h3>
                      <span className="text-[9px] font-heading font-semibold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">{uc.tag}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mb-3 flex-1">{uc.why}</p>
                    {matched && (
                      <div className="flex items-center gap-2 pt-2.5 border-t border-border/20 mt-auto">
                        <ProductLogo product={matched} size={24} />
                        <span className="font-heading font-semibold text-foreground text-xs flex-1">{matched.name}</span>
                        <RatingBadge rating={matched.rating} size="sm" />
                        <AffiliateButton product={matched} variant="outline" className="px-2.5 py-1 text-[10px]" />
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* ═══ 6. PRODUCT REVIEWS — collapsible, after comparison ═══ */}
        {products.length > 0 && (
          <section id="apzvalgos" className="mb-12 scroll-mt-8">
            <ScrollReveal>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Individualios apžvalgos</h2>
              <p className="text-muted-foreground text-sm mb-5">Spauskite ant programos, kad matytumėte detalesnę apžvalgą.</p>
            </ScrollReveal>

            <div className="space-y-2.5">
              {products.map((product, i) => {
                const editorial = getEditorial(product);
                const isOpen = expandedReview === product.id;
                const anchorId = product.brand.toLowerCase() || product.slug;

                return (
                  <ScrollReveal key={product.id} delay={i * 30}>
                    <div id={anchorId} className={`rounded-xl border bg-card overflow-hidden scroll-mt-8 transition-colors ${isOpen ? 'border-primary/25' : 'border-border/40'}`}>
                      {/* Collapsed header — always visible */}
                      <button
                        onClick={() => setExpandedReview(isOpen ? null : product.id)}
                        className="w-full p-4 flex items-center gap-3 text-left hover:bg-secondary/5 transition-colors"
                      >
                        <span className="text-lg shrink-0">{medalLabels[i] || `${i + 1}.`}</span>
                        <ProductLogo product={product} size={40} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-heading font-bold text-foreground text-base">{product.name}</h3>
                            <RatingBadge rating={product.rating} size="sm" />
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{product.bestFor}</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-3 shrink-0">
                          <span className="text-sm font-heading font-semibold text-foreground">{product.pricingSummary}</span>
                          <AffiliateButton product={product} variant="outline" className="px-3 py-1.5 text-xs" />
                        </div>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Expanded content */}
                      {isOpen && (
                        <div className="px-4 pb-5 pt-2 border-t border-border/20">
                          {/* Quick specs */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                            <div className="rounded-lg bg-secondary/20 p-2.5 text-center">
                              <p className="text-[10px] text-muted-foreground font-heading uppercase tracking-wider mb-0.5">Kaina</p>
                              <p className="text-xs font-heading font-bold text-foreground">{product.pricingSummary}</p>
                            </div>
                            <div className="rounded-lg bg-secondary/20 p-2.5 text-center">
                              <p className="text-[10px] text-muted-foreground font-heading uppercase tracking-wider mb-0.5">Platformos</p>
                              <p className="text-xs font-heading font-bold text-foreground">{product.supportedPlatforms.length}</p>
                            </div>
                            <div className="rounded-lg bg-secondary/20 p-2.5 text-center">
                              <p className="text-[10px] text-muted-foreground font-heading uppercase tracking-wider mb-0.5">Nemokama</p>
                              <p className="text-xs font-heading font-bold text-foreground">{product.freeVersion ? 'Taip' : 'Ne'}</p>
                            </div>
                            <div className="rounded-lg bg-secondary/20 p-2.5 text-center">
                              <p className="text-[10px] text-muted-foreground font-heading uppercase tracking-wider mb-0.5">Bandomoji</p>
                              <p className="text-xs font-heading font-bold text-foreground">{product.trialAvailable ? 'Taip' : 'Ne'}</p>
                            </div>
                          </div>

                          {/* Pros / Cons side by side */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            {product.pros.length > 0 && (
                              <div>
                                <h4 className="flex items-center gap-1.5 font-heading font-semibold text-[hsl(var(--success))] text-xs mb-1.5">
                                  <ThumbsUp className="w-3 h-3" />Privalumai
                                </h4>
                                <ul className="space-y-1">
                                  {product.pros.map((pro, j) => (
                                    <li key={j} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                      <CheckCircle2 className="w-3 h-3 text-[hsl(var(--success))] mt-0.5 shrink-0" />{pro}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {product.cons.length > 0 && (
                              <div>
                                <h4 className="flex items-center gap-1.5 font-heading font-semibold text-muted-foreground text-xs mb-1.5">
                                  <ThumbsDown className="w-3 h-3" />Trūkumai
                                </h4>
                                <ul className="space-y-1">
                                  {product.cons.map((con, j) => (
                                    <li key={j} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                      <XCircle className="w-3 h-3 text-muted-foreground/30 mt-0.5 shrink-0" />{con}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Editorial text — compressed */}
                          {editorial && (
                            <div className="prose-article max-w-none space-y-2.5 mb-4">
                              <p className="text-sm text-muted-foreground leading-relaxed">{editorial.summary}</p>
                              <p className="text-sm text-muted-foreground leading-relaxed">{editorial.strengths}</p>
                            </div>
                          )}

                          {/* Features row */}
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
                            {featureCols.map(col => {
                              const val = product.features[col.key];
                              return (
                                <span key={col.key} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                  {val === true ? <Check className="w-3.5 h-3.5 text-[hsl(var(--success))]" /> : <X className="w-3.5 h-3.5 text-muted-foreground/25" />}
                                  {col.label}
                                </span>
                              );
                            })}
                            {product.supportedPlatforms.length > 0 && (
                              <span className="text-xs text-muted-foreground/60 ml-1">
                                {product.supportedPlatforms.join(', ')}
                              </span>
                            )}
                          </div>

                          {/* Verdict + CTA */}
                          <div className="rounded-lg bg-secondary/20 border border-border/20 p-3 mb-4">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              <strong className="text-foreground">Verdiktas: </strong>
                              {editorial?.verdict || product.verdict || product.shortDescription}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <AffiliateButton product={product} className="px-5 py-2 text-sm" label="Gauti pasiūlymą" />
                            <span className="text-xs text-muted-foreground">nuo {product.pricingSummary}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </section>
        )}

        {/* ═══ 7. FREE VS PAID — compact ═══ */}
        <section id="nemokama-vs-mokama" className="mb-12 scroll-mt-8">
          <ScrollReveal>
            <div className="rounded-xl border border-border/40 bg-card/60 p-5 md:p-7">
              <h2 className="font-heading text-xl font-bold text-foreground mb-4">Nemokama ar mokama?</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg border border-border/40 p-4">
                  <h3 className="font-heading font-bold text-foreground text-sm mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-muted-foreground" />Nemokama <span className="text-[9px] text-muted-foreground bg-secondary/60 px-1.5 py-0.5 rounded ml-auto">0 €</span>
                  </h3>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {[
                      { good: true, t: 'Bazinė apsauga nuo virusų' },
                      { good: true, t: 'Pakankama vienam įrenginiui' },
                      { good: false, t: 'Nėra VPN, slaptažodžių, tėvų kontrolės' },
                      { good: false, t: 'Ribota pagalba' },
                    ].map((it, j) => (
                      <li key={j} className="flex items-start gap-1.5">
                        {it.good ? <CheckCircle2 className="w-3 h-3 text-[hsl(var(--success))] mt-0.5 shrink-0" /> : <XCircle className="w-3 h-3 text-muted-foreground/30 mt-0.5 shrink-0" />}
                        {it.t}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-muted-foreground/50 mt-2">Tinka: studentams, vienam įrenginiui.</p>
                </div>
                <div className="rounded-lg border border-primary/20 p-4 bg-primary/[0.02]">
                  <h3 className="font-heading font-bold text-foreground text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />Mokama <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded ml-auto">20–60 €/m.</span>
                  </h3>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {[
                      { good: true, t: 'VPN, slaptažodžiai, tamsaus interneto stebėjimas' },
                      { good: true, t: 'Kelių įrenginių apsauga (3–15 įr.)' },
                      { good: true, t: 'Tėvų kontrolė ir šeimos funkcijos' },
                      { good: false, t: 'Metinis mokėjimas' },
                    ].map((it, j) => (
                      <li key={j} className="flex items-start gap-1.5">
                        {it.good ? <CheckCircle2 className="w-3 h-3 text-[hsl(var(--success))] mt-0.5 shrink-0" /> : <XCircle className="w-3 h-3 text-muted-foreground/30 mt-0.5 shrink-0" />}
                        {it.t}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-muted-foreground/50 mt-2">Tinka: šeimoms, nuotoliniam darbui, keliems įrenginiams.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { path: '/antivirusines-programos/nemokamos', label: 'Nemokamos antivirusinės' },
                  { path: '/antivirusines-programos/telefonui', label: 'Antivirusinė telefonui' },
                  { path: '/antivirusines-programos/kompiuteriui', label: 'Antivirusinė kompiuteriui' },
                ].map(link => (
                  <Link key={link.path} to={link.path}
                        className="text-xs font-heading font-medium px-3 py-1.5 rounded-md bg-secondary/50 text-primary hover:bg-primary/10 transition-colors inline-flex items-center gap-1">
                    {link.label}<ChevronRight className="w-3 h-3" />
                  </Link>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ═══ 8. HOW TO CHOOSE — compact grid ═══ */}
        <section id="kaip-pasirinkti" className="mb-12 scroll-mt-8">
          <ScrollReveal>
            <h2 className="font-heading text-xl font-bold text-foreground mb-4">Kaip pasirinkti?</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {buyerGuide.map((item, idx) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={idx} delay={idx * 30}>
                  <div className="rounded-lg border border-border/40 bg-card p-3.5 h-full">
                    <h3 className="font-heading font-bold text-foreground text-sm mb-1 flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-primary shrink-0" />{item.q}
                    </h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{item.advice}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
          <ScrollReveal>
            <div className="mt-4 rounded-lg bg-secondary/20 border border-border/30 p-3.5 max-w-2xl">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Bendra taisyklė:</strong> 1 Windows kompiuteris + atsargus naršymas = Windows Defender gali pakakti. 2+ įrenginiai, telefonas ar šeima = investuokite ~3–5 €/mėn.
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* ═══ 9. METHODOLOGY — compact ═══ */}
        <section className="mb-12 scroll-mt-8">
          <ScrollReveal>
            <div className="rounded-xl border border-border/40 bg-card/60 p-5 md:p-6">
              <h2 className="font-heading text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-primary" />Kaip vertiname
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 mb-3">
                {[
                  { title: 'Apsaugos efektyvumas', desc: 'Kenkėjiškų programų aptikimas, zero-day grėsmės, realaus laiko apsauga.', icon: Shield },
                  { title: 'Sistemos našumas', desc: 'Poveikis greičiui, paleidimo laikui, baterijos suvartojimas.', icon: Zap },
                  { title: 'Papildomos funkcijos', desc: 'VPN, slaptažodžiai, tėvų kontrolė, tamsaus interneto stebėjimas.', icon: Layers },
                  { title: 'Kaina ir vertė', desc: 'Pirmo metų kaina, atnaujinimas, įrenginių skaičius.', icon: BarChart3 },
                  { title: 'Paprastumas', desc: 'Sąsajos aiškumas, diegimo greitis, pranešimų kokybė.', icon: Heart },
                  { title: 'Kelių įrenginių palaikymas', desc: 'Platformos, centralizuotas valdymas, šeimos licencijos.', icon: Globe },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="rounded-lg bg-secondary/20 p-3 flex gap-2">
                      <Icon className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="font-heading font-semibold text-foreground text-xs mb-0.5">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground/40">Redakcija nepriklausoma. Affiliate partnerystės neįtakoja vertinimų.</p>
            </div>
          </ScrollReveal>
        </section>

        {/* ═══ 10. FAQ ═══ */}
        <section id="duk" className="mb-12 scroll-mt-8">
          <ScrollReveal>
            <FAQAccordion items={category.faq.length > 0 ? category.faq : pillarFaq} title="Dažnai užduodami klausimai" />
          </ScrollReveal>
        </section>

        {/* ═══ 11. RELATED ARTICLES ═══ */}
        {categoryArticles.length > 0 && (
          <section className="mb-12">
            <ScrollReveal>
              <h2 className="font-heading text-xl font-bold text-foreground mb-4">Susiję straipsniai</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoryArticles.map((a, idx) => (
                <ScrollReveal key={a.path} delay={idx * 50}><ArticleCard article={a} /></ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* ═══ 12. RELATED GUIDES ═══ */}
        <section className="mb-12">
          <ScrollReveal>
            <div className="rounded-xl border border-border/40 bg-card/60 p-5">
              <h2 className="font-heading text-lg font-bold text-foreground mb-3">Kiti naudingi gidai</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {relatedGuides.map(guide => {
                  const Icon = guide.icon;
                  return (
                    <Link key={guide.path} to={guide.path}
                          className="flex items-center gap-2.5 rounded-lg p-2.5 bg-secondary/15 hover:bg-primary/10 transition-colors group">
                      <Icon className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <span className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">{guide.label}</span>
                        <span className="text-[10px] text-muted-foreground block">{guide.desc}</span>
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
