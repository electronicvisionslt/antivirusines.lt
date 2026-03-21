import {
  Star, ExternalLink, Shield, Smartphone, Monitor, ChevronRight, CheckCircle2, XCircle,
  Clock, BarChart3, Layers, Award, Heart, Zap, Lock, Users, ChevronDown,
  Check, X, Laptop, Globe, Eye, ShieldCheck, HelpCircle, BadgeCheck, ThumbsUp, ThumbsDown,
  Fingerprint, ScanLine, Activity, Cpu,
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
    <span className={`${cls} inline-flex items-center rounded-md cl-tag font-bold tabular-nums font-heading`}>
      <Star className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} fill-[hsl(var(--cl-cyan))] stroke-[hsl(var(--cl-cyan))]`} />
      {rating.toFixed(1)}
    </span>
  );
}

function ProductLogo({ product, size = 40 }: { product: PublicProduct; size?: number }) {
  if (product.logoUrl) {
    return <img src={product.logoUrl} alt={`${product.name} logotipas`} width={size} height={size} className="rounded-lg object-contain" loading="lazy" />;
  }
  return (
    <div className="rounded-lg bg-[hsla(195,100%,42%,0.08)] border border-[hsla(195,100%,42%,0.15)] flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <span className="font-heading font-bold text-[hsl(var(--cl-cyan))]" style={{ fontSize: size * 0.35 }}>
        {product.brand?.slice(0, 2).toUpperCase() || product.name.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

function AffiliateButton({ product, variant = 'primary', className = '', label }: { product: PublicProduct; variant?: 'primary' | 'outline'; className?: string; label?: string }) {
  if (!product.affiliateUrl) return null;
  const base = variant === 'primary' ? 'cl-btn-primary' : 'cl-btn-outline';
  return (
    <a href={product.affiliateUrl} target="_blank" rel="nofollow sponsored noopener noreferrer"
       className={`inline-flex items-center gap-2 font-heading font-semibold rounded-lg active:scale-[0.97] ${base} ${className}`}>
      {label || 'Apsilankyti'}<ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
}

function FeatureIcon({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="w-4 h-4 text-[hsl(var(--cl-green))] mx-auto" />;
  if (value === false) return <X className="w-4 h-4 text-[hsl(var(--cl-text-muted))]/30 mx-auto" />;
  return <span className="text-xs text-[hsl(var(--cl-text-secondary))]">{value}</span>;
}

function PlatformBadges({ platforms }: { platforms: string[] }) {
  const icons: Record<string, typeof Monitor> = { Windows: Monitor, Mac: Laptop, Android: Smartphone, iOS: Smartphone };
  return (
    <div className="flex gap-1 flex-wrap">
      {platforms.slice(0, 4).map(p => {
        const Icon = icons[p] || Globe;
        return <span key={p} className="inline-flex items-center gap-1 text-[10px] text-[hsl(var(--cl-text-secondary))] bg-[hsl(var(--cl-surface-alt))] rounded px-1.5 py-0.5"><Icon className="w-2.5 h-2.5" />{p}</span>;
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

const productEditorials: Record<string, { summary: string; strengths: string; verdict: string }> = {
  'Norton': {
    summary: 'Norton 360 — visapusiškiausias saugumo paketas rinkoje. Pažangus grėsmių aptikimas, paremtas mašininiu mokymusi, kartu su neribotu VPN, slaptažodžių tvarkykle, tamsiojo interneto stebėjimu ir 50 GB debesies saugykla.',
    strengths: 'Išsiskiria integruotu neribotu VPN, tamsiojo interneto stebėjimu ir 60 dienų pinigų grąžinimo garantija. Deluxe planas apima 5 įrenginius už ~50 €/metus.',
    verdict: 'Geriausias pasirinkimas tiems, kam reikia visapusiškos apsaugos su VPN ir šeimos funkcijomis.',
  },
  'Bitdefender': {
    summary: 'Bitdefender Total Security naudoja debesijos skenavimą — grėsmių analizė vyksta serveriuose, ne jūsų kompiuteryje. Rezultatas: mažiau nei 1% procesoriaus naudojimo fone.',
    strengths: 'Unikalios funkcijos: Safepay apsaugotas naršyklės langas bankininkystei, webcam/mikrofono apsauga, pažangus ugniasienės modulis. Total Security — ~55 €/metus iki 5 įrenginių.',
    verdict: 'Geriausias Windows naudotojams ir žaidėjams, kuriems svarbus minimalus poveikis greičiui.',
  },
  'Kaspersky': {
    summary: 'Kaspersky Plus — 25+ metų kibernetinio saugumo patirtis. „Safe Money" funkcija automatiškai atidaro banko puslapius saugioje aplinkoje. Integruotas VPN su neribotais duomenimis.',
    strengths: 'Geriausias kainos-vertės santykis: Plus planas — ~35 €/metus 3 įrenginiams su VPN ir slaptažodžių tvarkykle.',
    verdict: 'Puikus pasirinkimas patyrusiems naudotojams, kurie nori aukščiausio lygio apsaugos už prieinamą kainą.',
  },
  'Avast': {
    summary: 'Avast Free Antivirus — populiariausia nemokama antivirusinė su 400M+ naudotojų. Siūlo realaus laiko apsaugą, Wi-Fi tinklo tikrinimą ir naršyklės apsaugą nuo phishing atakų.',
    strengths: 'Stipri bazinė apsauga visiškai nemokamai. Premium versija prideda pažangią ransomware apsaugą ir ugniasienę — ~50 €/metus.',
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

  const rankLabels = ['#1', '#2', '#3', '#4'];

  return (
    <PageLayout>
      <div className="cyber-light min-h-screen -mt-px">
        {/* Background grid pattern */}
        <div className="cl-grid-bg">
          <div className="container py-8">
            <Breadcrumbs path={category.path} items={[
              { label: 'Pradžia', path: '/' },
              { label: 'Antivirusinės programos', path: '/antivirusines-programos' },
            ]} />

            {/* ═══ 1. HERO ═══ */}
            <ScrollReveal>
              <section className="relative rounded-2xl overflow-hidden cl-card cl-card-featured mb-8">
                <div className="absolute inset-0 cl-hero-gradient" />
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[hsl(var(--cl-cyan))] to-transparent opacity-40" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--cl-cyan))]/20 to-transparent" />

                <div className="relative p-6 md:p-10">
                  <div className="max-w-4xl">
                    {/* Meta strip */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-4">
                      <span className="inline-flex items-center gap-1.5 cl-tag rounded-full px-3 py-1 text-[11px] font-heading font-semibold uppercase tracking-[0.12em]">
                        <Fingerprint className="w-3 h-3" />Nepriklausomas palyginimas
                      </span>
                      <span className="text-[11px] text-[hsl(var(--cl-text-muted))] flex items-center gap-1 cl-mono"><Clock className="w-3 h-3" />{updatedLabel}</span>
                      <span className="text-[11px] text-[hsl(var(--cl-text-muted))] flex items-center gap-1"><Lock className="w-3 h-3" />Affiliate nuorodos</span>
                    </div>

                    <h1 className="font-heading text-3xl md:text-[2.75rem] lg:text-5xl font-extrabold text-[hsl(var(--cl-navy))] leading-[1.06] mb-4 tracking-tight">
                      Geriausios antivirusinės<br className="hidden sm:block" /> programos <span className="cl-glow-text">2025&nbsp;m.</span>
                    </h1>
                    <p className="text-[hsl(var(--cl-text-secondary))] text-base md:text-lg leading-relaxed max-w-2xl mb-5">
                      Išanalizavome populiariausias antivirusines pagal apsaugą, greitį, funkcijas ir kainą — kad galėtumėte pasirinkti per kelias minutes.
                    </p>

                    {/* Quick winner badges */}
                    {products.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {bestOverall && (
                          <a href="#top-picks" className="cl-tag-amber rounded-full px-3 py-1.5 text-xs font-heading font-semibold inline-flex items-center gap-1.5 hover:shadow-md transition-shadow">
                            <Award className="w-3.5 h-3.5" />Geriausia: {bestOverall.name}
                          </a>
                        )}
                        {bestFree && (
                          <a href="#top-picks" className="cl-tag-green rounded-full px-3 py-1.5 text-xs font-heading font-semibold inline-flex items-center gap-1.5 hover:shadow-md transition-shadow">
                            <Zap className="w-3.5 h-3.5" />Nemokama: {bestFree.name}
                          </a>
                        )}
                        {bestFamily && bestFamily !== bestOverall && (
                          <a href="#pagal-poreiki" className="cl-tag rounded-full px-3 py-1.5 text-xs font-heading font-semibold inline-flex items-center gap-1.5 hover:shadow-md transition-shadow">
                            <Users className="w-3.5 h-3.5" />Šeimoms: {bestFamily.name}
                          </a>
                        )}
                      </div>
                    )}

                    {/* Jump nav */}
                    <nav className="flex flex-wrap gap-1.5" aria-label="Turinys">
                      {jumpLinks.map(link => {
                        const Icon = link.icon;
                        return (
                          <a key={link.href} href={link.href}
                             className="text-[11px] font-heading font-medium px-2.5 py-1.5 rounded-lg bg-[hsl(var(--cl-surface-alt))] text-[hsl(var(--cl-text-secondary))] hover:bg-[hsla(195,100%,42%,0.08)] hover:text-[hsl(var(--cl-cyan))] transition-colors inline-flex items-center gap-1 border border-transparent hover:border-[hsla(195,100%,42%,0.15)]">
                            <Icon className="w-3 h-3" />{link.label}
                          </a>
                        );
                      })}
                    </nav>
                  </div>
                </div>
              </section>
            </ScrollReveal>

            {/* ═══ 2. TRUST STRIP ═══ */}
            <ScrollReveal>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
                {[
                  { icon: ScanLine, value: `${products.length}`, label: 'Programos palygintos', accent: true },
                  { icon: Activity, value: `${featureCols.length + 2}`, label: 'Vertinimo kriterijai', accent: false },
                  { icon: Cpu, value: '4', label: 'Platformos', accent: false },
                  { icon: BadgeCheck, value: '✓', label: 'Nepriklausoma redakcija', accent: false },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className={`cl-stat-block rounded-xl p-4 text-center ${s.accent ? 'border-[hsla(195,100%,42%,0.25)] bg-[hsla(195,100%,42%,0.04)]' : ''}`}>
                      <Icon className="w-5 h-5 text-[hsl(var(--cl-cyan))] mx-auto mb-1.5" />
                      <p className="font-heading font-extrabold text-[hsl(var(--cl-navy))] text-xl cl-mono">{s.value}</p>
                      <p className="text-[10px] text-[hsl(var(--cl-text-muted))] font-heading uppercase tracking-wider mt-0.5">{s.label}</p>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>

            {/* ═══ 3. TOP PICKS ═══ */}
            {topPicks.length > 0 && (
              <section id="top-picks" className="mb-12 scroll-mt-8">
                <ScrollReveal>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-[hsla(195,100%,42%,0.1)] flex items-center justify-center">
                      <Award className="w-4 h-4 text-[hsl(var(--cl-cyan))]" />
                    </div>
                    <div>
                      <h2 className="font-heading text-2xl font-extrabold text-[hsl(var(--cl-navy))]">Mūsų pasirinkimai</h2>
                      <p className="text-[hsl(var(--cl-text-muted))] text-sm">Greita santrauka — detalesnės apžvalgos žemiau.</p>
                    </div>
                  </div>
                </ScrollReveal>

                <div className="space-y-3">
                  {topPicks.map((product, i) => (
                    <ScrollReveal key={product.id} delay={i * 50}>
                      <div className={`cl-card rounded-xl p-5 relative ${i === 0 ? 'cl-card-featured cl-scan-line' : ''}`}>
                        {i === 0 && (
                          <div className="absolute top-0 right-0 cl-tag-amber rounded-bl-lg rounded-tr-xl px-3 py-1 text-[10px] font-heading font-bold uppercase tracking-wider">
                            Geriausias pasirinkimas
                          </div>
                        )}
                        <div className="flex items-start gap-4">
                          {/* Rank */}
                          <div className="shrink-0 w-10 h-10 rounded-lg bg-[hsl(var(--cl-surface-alt))] border border-[hsl(var(--cl-border))] flex items-center justify-center">
                            <span className="font-heading font-extrabold text-[hsl(var(--cl-navy))] text-sm cl-mono">{rankLabels[i]}</span>
                          </div>
                          <ProductLogo product={product} size={44} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-heading font-bold text-[hsl(var(--cl-navy))] text-base">{product.name}</h3>
                              <RatingBadge rating={product.rating} size="sm" />
                              <span className="text-xs text-[hsl(var(--cl-text-secondary))] cl-mono">{product.pricingSummary}</span>
                              {product.freeVersion && <span className="cl-tag-green text-[10px] font-medium px-2 py-0.5 rounded-full">Nemokama versija</span>}
                            </div>
                            <p className="text-xs text-[hsl(var(--cl-text-secondary))] mb-2">{product.bestFor}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                              {product.pros.slice(0, 3).map((p, j) => (
                                <span key={j} className="inline-flex items-center gap-1 text-[11px] text-[hsl(var(--cl-text-secondary))]">
                                  <CheckCircle2 className="w-3 h-3 text-[hsl(var(--cl-green))] shrink-0" />{p}
                                </span>
                              ))}
                              {product.cons.slice(0, 2).map((c, j) => (
                                <span key={j} className="inline-flex items-center gap-1 text-[11px] text-[hsl(var(--cl-text-muted))]">
                                  <XCircle className="w-3 h-3 text-[hsl(var(--cl-text-muted))]/40 shrink-0" />{c}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="shrink-0 hidden sm:block">
                            <AffiliateButton product={product} className="px-5 py-2.5 text-sm" />
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

            {/* ═══ 4. COMPARISON TABLE ═══ */}
            {products.length > 0 && (
              <section id="palyginimas" className="mb-12 scroll-mt-8">
                <ScrollReveal>
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[hsla(195,100%,42%,0.1)] flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-[hsl(var(--cl-cyan))]" />
                      </div>
                      <div>
                        <h2 className="font-heading text-2xl font-extrabold text-[hsl(var(--cl-navy))]">Palyginimo lentelė</h2>
                        <p className="text-[hsl(var(--cl-text-muted))] text-sm">Visos funkcijos ir kainos vienoje vietoje.</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      {filterOptions.map(opt => {
                        const Icon = opt.icon;
                        const active = activeFilter === opt.key;
                        return (
                          <button key={opt.key} onClick={() => setActiveFilter(opt.key)}
                                  className={`text-[11px] font-heading font-medium px-3 py-1.5 rounded-lg inline-flex items-center gap-1 transition-all ${active ? 'cl-btn-primary text-white shadow-sm' : 'bg-[hsl(var(--cl-surface-alt))] text-[hsl(var(--cl-text-secondary))] hover:bg-[hsla(195,100%,42%,0.08)] border border-[hsl(var(--cl-border))]'}`}>
                            <Icon className="w-3 h-3" />{opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </ScrollReveal>

                {filteredProducts.length === 0 && (
                  <p className="text-sm text-[hsl(var(--cl-text-muted))] text-center py-6">Nėra produktų pagal pasirinktą filtrą.</p>
                )}

                {filteredProducts.length > 0 && (
                  <ScrollReveal>
                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto rounded-xl cl-card overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="cl-table-header">
                            <th className="text-left p-3.5 font-heading font-semibold text-[hsl(var(--cl-navy))]">Programa</th>
                            <th className="text-center p-3.5 font-heading font-semibold text-[hsl(var(--cl-navy))]">Įvert.</th>
                            <th className="text-center p-3.5 font-heading font-semibold text-[hsl(var(--cl-navy))]">Kaina</th>
                            <th className="text-center p-3.5 font-heading font-semibold text-[hsl(var(--cl-navy))]">Nemokama</th>
                            <th className="text-center p-3.5 font-heading font-semibold text-[hsl(var(--cl-navy))]">Bandomoji</th>
                            {featureCols.map(col => (
                              <th key={col.key} className="text-center p-3.5 font-heading font-semibold text-[hsl(var(--cl-navy))] whitespace-nowrap">{col.label}</th>
                            ))}
                            <th className="text-center p-3.5 font-heading font-semibold text-[hsl(var(--cl-navy))]">Platformos</th>
                            <th className="p-3.5" />
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((product, idx) => (
                            <tr key={product.id} className={`${idx < filteredProducts.length - 1 ? 'border-b border-[hsl(var(--cl-border))]' : ''} cl-table-row transition-colors`}>
                              <td className="p-3.5">
                                <div className="flex items-center gap-2.5">
                                  <ProductLogo product={product} size={28} />
                                  <span className="font-heading font-semibold text-[hsl(var(--cl-navy))] text-sm">{product.name}</span>
                                </div>
                              </td>
                              <td className="p-3.5 text-center"><RatingBadge rating={product.rating} size="sm" /></td>
                              <td className="p-3.5 text-center text-[hsl(var(--cl-text-secondary))] whitespace-nowrap text-xs cl-mono">{product.pricingSummary}</td>
                              <td className="p-3.5 text-center"><FeatureIcon value={product.freeVersion} /></td>
                              <td className="p-3.5 text-center"><FeatureIcon value={product.trialAvailable} /></td>
                              {featureCols.map(col => (
                                <td key={col.key} className="p-3.5 text-center"><FeatureIcon value={product.features[col.key] ?? false} /></td>
                              ))}
                              <td className="p-3.5 text-center"><span className="text-xs text-[hsl(var(--cl-text-secondary))] cl-mono">{product.supportedPlatforms.length}</span></td>
                              <td className="p-3.5"><AffiliateButton product={product} variant="outline" className="px-3 py-1.5 text-xs whitespace-nowrap" /></td>
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
                          <div key={product.id} className="rounded-xl cl-card overflow-hidden">
                            <button onClick={() => setExpandedRow(isExpanded ? null : product.id)} className="w-full p-3.5 flex items-center gap-2.5 text-left">
                              <ProductLogo product={product} size={30} />
                              <div className="flex-1 min-w-0">
                                <p className="font-heading font-semibold text-[hsl(var(--cl-navy))] text-sm">{product.name}</p>
                                <p className="text-[11px] text-[hsl(var(--cl-text-muted))] cl-mono">{product.pricingSummary}</p>
                              </div>
                              <RatingBadge rating={product.rating} size="sm" />
                              <ChevronDown className={`w-4 h-4 text-[hsl(var(--cl-text-muted))] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                            {isExpanded && (
                              <div className="px-3.5 pb-3.5 pt-1 border-t border-[hsl(var(--cl-border))] space-y-2">
                                <div className="grid grid-cols-2 gap-1.5">
                                  <div className="flex items-center gap-1.5 text-xs"><FeatureIcon value={product.freeVersion} /><span className="text-[hsl(var(--cl-text-secondary))]">Nemokama</span></div>
                                  <div className="flex items-center gap-1.5 text-xs"><FeatureIcon value={product.trialAvailable} /><span className="text-[hsl(var(--cl-text-secondary))]">Bandomoji</span></div>
                                  {featureCols.map(col => (
                                    <div key={col.key} className="flex items-center gap-1.5 text-xs">
                                      <FeatureIcon value={product.features[col.key] ?? false} /><span className="text-[hsl(var(--cl-text-secondary))]">{col.label}</span>
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

            {/* ═══ 5. BEST BY USE CASE ═══ */}
            <section id="pagal-poreiki" className="mb-12 scroll-mt-8">
              <ScrollReveal>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-[hsla(195,100%,42%,0.1)] flex items-center justify-center">
                    <Layers className="w-4 h-4 text-[hsl(var(--cl-cyan))]" />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl font-extrabold text-[hsl(var(--cl-navy))]">Geriausia pagal poreikį</h2>
                    <p className="text-[hsl(var(--cl-text-muted))] text-sm">Skirtingiems naudotojams — skirtingi sprendimai.</p>
                  </div>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {useCases.map((uc, idx) => {
                  const matched = findProduct(uc.matchKey);
                  const Icon = uc.icon;
                  return (
                    <ScrollReveal key={idx} delay={idx * 40}>
                      <div className="cl-card rounded-xl p-5 h-full flex flex-col">
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-[hsla(195,100%,42%,0.08)] flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-[hsl(var(--cl-cyan))]" />
                          </div>
                          <h3 className="font-heading font-bold text-[hsl(var(--cl-navy))] text-sm flex-1">{uc.title}</h3>
                          <span className="cl-tag text-[9px] font-heading font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">{uc.tag}</span>
                        </div>
                        <p className="text-xs text-[hsl(var(--cl-text-secondary))] leading-relaxed mb-3 flex-1">{uc.why}</p>
                        {matched && (
                          <div className="flex items-center gap-2.5 pt-3 border-t border-[hsl(var(--cl-border))] mt-auto">
                            <ProductLogo product={matched} size={24} />
                            <span className="font-heading font-semibold text-[hsl(var(--cl-navy))] text-xs flex-1">{matched.name}</span>
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

            {/* ═══ 6. PRODUCT REVIEWS — collapsible ═══ */}
            {products.length > 0 && (
              <section id="apzvalgos" className="mb-12 scroll-mt-8">
                <ScrollReveal>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-[hsla(195,100%,42%,0.1)] flex items-center justify-center">
                      <Shield className="w-4 h-4 text-[hsl(var(--cl-cyan))]" />
                    </div>
                    <div>
                      <h2 className="font-heading text-2xl font-extrabold text-[hsl(var(--cl-navy))]">Individualios apžvalgos</h2>
                      <p className="text-[hsl(var(--cl-text-muted))] text-sm">Spauskite ant programos, kad matytumėte detalesnę apžvalgą.</p>
                    </div>
                  </div>
                </ScrollReveal>

                <div className="space-y-2.5">
                  {products.map((product, i) => {
                    const editorial = getEditorial(product);
                    const isOpen = expandedReview === product.id;
                    const anchorId = product.brand.toLowerCase() || product.slug;

                    return (
                      <ScrollReveal key={product.id} delay={i * 40}>
                        <div id={anchorId} className={`rounded-xl cl-card overflow-hidden scroll-mt-8 ${isOpen ? 'cl-card-featured' : ''}`}>
                          <button
                            onClick={() => setExpandedReview(isOpen ? null : product.id)}
                            className="w-full p-4 flex items-center gap-3 text-left hover:bg-[hsla(195,100%,42%,0.02)] transition-colors"
                          >
                            <div className="shrink-0 w-8 h-8 rounded-lg bg-[hsl(var(--cl-surface-alt))] flex items-center justify-center">
                              <span className="font-heading font-extrabold text-[hsl(var(--cl-navy))] text-xs cl-mono">{rankLabels[i] || `#${i + 1}`}</span>
                            </div>
                            <ProductLogo product={product} size={40} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-heading font-bold text-[hsl(var(--cl-navy))] text-base">{product.name}</h3>
                                <RatingBadge rating={product.rating} size="sm" />
                              </div>
                              <p className="text-xs text-[hsl(var(--cl-text-secondary))] mt-0.5">{product.bestFor}</p>
                            </div>
                            <div className="hidden sm:flex items-center gap-3 shrink-0">
                              <span className="text-sm font-heading font-semibold text-[hsl(var(--cl-navy))] cl-mono">{product.pricingSummary}</span>
                              <AffiliateButton product={product} variant="outline" className="px-3 py-1.5 text-xs" />
                            </div>
                            <ChevronDown className={`w-4 h-4 text-[hsl(var(--cl-text-muted))] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {isOpen && (
                            <div className="px-4 pb-5 pt-2 border-t border-[hsl(var(--cl-border))]">
                              {/* Quick specs */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
                                {[
                                  { label: 'Kaina', value: product.pricingSummary },
                                  { label: 'Platformos', value: String(product.supportedPlatforms.length) },
                                  { label: 'Nemokama', value: product.freeVersion ? 'Taip' : 'Ne' },
                                  { label: 'Bandomoji', value: product.trialAvailable ? 'Taip' : 'Ne' },
                                ].map((spec, si) => (
                                  <div key={si} className="rounded-lg bg-[hsl(var(--cl-surface-alt))] p-3 text-center">
                                    <p className="text-[10px] text-[hsl(var(--cl-text-muted))] font-heading uppercase tracking-wider mb-0.5">{spec.label}</p>
                                    <p className="text-xs font-heading font-bold text-[hsl(var(--cl-navy))] cl-mono">{spec.value}</p>
                                  </div>
                                ))}
                              </div>

                              {/* Pros / Cons */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                {product.pros.length > 0 && (
                                  <div className="rounded-lg bg-[hsla(155,72%,40%,0.04)] border border-[hsla(155,72%,40%,0.12)] p-3.5">
                                    <h4 className="flex items-center gap-1.5 font-heading font-semibold text-[hsl(var(--cl-green))] text-xs mb-2">
                                      <ThumbsUp className="w-3 h-3" />Privalumai
                                    </h4>
                                    <ul className="space-y-1.5">
                                      {product.pros.map((pro, j) => (
                                        <li key={j} className="flex items-start gap-1.5 text-xs text-[hsl(var(--cl-text-secondary))]">
                                          <CheckCircle2 className="w-3 h-3 text-[hsl(var(--cl-green))] mt-0.5 shrink-0" />{pro}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {product.cons.length > 0 && (
                                  <div className="rounded-lg bg-[hsla(0,65%,55%,0.03)] border border-[hsla(0,65%,55%,0.1)] p-3.5">
                                    <h4 className="flex items-center gap-1.5 font-heading font-semibold text-[hsl(var(--cl-red))] text-xs mb-2">
                                      <ThumbsDown className="w-3 h-3" />Trūkumai
                                    </h4>
                                    <ul className="space-y-1.5">
                                      {product.cons.map((con, j) => (
                                        <li key={j} className="flex items-start gap-1.5 text-xs text-[hsl(var(--cl-text-secondary))]">
                                          <XCircle className="w-3 h-3 text-[hsl(var(--cl-red))]/40 mt-0.5 shrink-0" />{con}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>

                              {editorial && (
                                <div className="space-y-2 mb-4">
                                  <p className="text-sm text-[hsl(var(--cl-text-secondary))] leading-relaxed">{editorial.summary}</p>
                                  <p className="text-sm text-[hsl(var(--cl-text-secondary))] leading-relaxed">{editorial.strengths}</p>
                                </div>
                              )}

                              {/* Features row */}
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
                                {featureCols.map(col => {
                                  const val = product.features[col.key];
                                  return (
                                    <span key={col.key} className="inline-flex items-center gap-1.5 text-xs text-[hsl(var(--cl-text-secondary))]">
                                      {val === true ? <Check className="w-3.5 h-3.5 text-[hsl(var(--cl-green))]" /> : <X className="w-3.5 h-3.5 text-[hsl(var(--cl-text-muted))]/30" />}
                                      {col.label}
                                    </span>
                                  );
                                })}
                                {product.supportedPlatforms.length > 0 && (
                                  <span className="text-xs text-[hsl(var(--cl-text-muted))] ml-1">{product.supportedPlatforms.join(', ')}</span>
                                )}
                              </div>

                              {/* Verdict */}
                              <div className="rounded-lg bg-[hsla(195,100%,42%,0.04)] border border-[hsla(195,100%,42%,0.12)] p-3.5 mb-4">
                                <p className="text-xs text-[hsl(var(--cl-text-secondary))] leading-relaxed">
                                  <strong className="text-[hsl(var(--cl-navy))]">Verdiktas: </strong>
                                  {editorial?.verdict || product.verdict || product.shortDescription}
                                </p>
                              </div>

                              <div className="flex items-center gap-3">
                                <AffiliateButton product={product} className="px-5 py-2.5 text-sm" label="Gauti pasiūlymą" />
                                <span className="text-xs text-[hsl(var(--cl-text-muted))] cl-mono">nuo {product.pricingSummary}</span>
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

            {/* ═══ 7. FREE VS PAID ═══ */}
            <section id="nemokama-vs-mokama" className="mb-12 scroll-mt-8">
              <ScrollReveal>
                <div className="cl-card rounded-xl p-6 md:p-8">
                  <h2 className="font-heading text-xl font-extrabold text-[hsl(var(--cl-navy))] mb-5">Nemokama ar mokama?</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    <div className="rounded-xl border border-[hsl(var(--cl-border))] p-5 bg-[hsl(var(--cl-surface))]">
                      <h3 className="font-heading font-bold text-[hsl(var(--cl-navy))] text-sm mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[hsl(var(--cl-text-muted))]" />Nemokama
                        <span className="cl-tag-green text-[9px] font-semibold px-2 py-0.5 rounded-full ml-auto">0 €</span>
                      </h3>
                      <ul className="space-y-2 text-xs text-[hsl(var(--cl-text-secondary))]">
                        {[
                          { good: true, t: 'Bazinė apsauga nuo virusų' },
                          { good: true, t: 'Pakankama vienam įrenginiui' },
                          { good: false, t: 'Nėra VPN, slaptažodžių, tėvų kontrolės' },
                          { good: false, t: 'Ribota pagalba' },
                        ].map((it, j) => (
                          <li key={j} className="flex items-start gap-2">
                            {it.good ? <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--cl-green))] mt-0.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-[hsl(var(--cl-red))]/40 mt-0.5 shrink-0" />}
                            {it.t}
                          </li>
                        ))}
                      </ul>
                      <p className="text-[10px] text-[hsl(var(--cl-text-muted))] mt-3">Tinka: studentams, vienam įrenginiui.</p>
                    </div>
                    <div className="rounded-xl border-2 border-[hsla(195,100%,42%,0.25)] p-5 bg-[hsla(195,100%,42%,0.02)]">
                      <h3 className="font-heading font-bold text-[hsl(var(--cl-navy))] text-sm mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[hsl(var(--cl-cyan))]" />Mokama
                        <span className="cl-tag text-[9px] font-semibold px-2 py-0.5 rounded-full ml-auto">20–60 €/m.</span>
                      </h3>
                      <ul className="space-y-2 text-xs text-[hsl(var(--cl-text-secondary))]">
                        {[
                          { good: true, t: 'VPN, slaptažodžiai, tamsaus interneto stebėjimas' },
                          { good: true, t: 'Kelių įrenginių apsauga (3–15 įr.)' },
                          { good: true, t: 'Tėvų kontrolė ir šeimos funkcijos' },
                          { good: false, t: 'Metinis mokėjimas' },
                        ].map((it, j) => (
                          <li key={j} className="flex items-start gap-2">
                            {it.good ? <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--cl-green))] mt-0.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-[hsl(var(--cl-red))]/40 mt-0.5 shrink-0" />}
                            {it.t}
                          </li>
                        ))}
                      </ul>
                      <p className="text-[10px] text-[hsl(var(--cl-text-muted))] mt-3">Tinka: šeimoms, nuotoliniam darbui, keliems įrenginiams.</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      { path: '/antivirusines-programos/nemokamos', label: 'Nemokamos antivirusinės' },
                      { path: '/antivirusines-programos/telefonui', label: 'Antivirusinė telefonui' },
                      { path: '/antivirusines-programos/kompiuteriui', label: 'Antivirusinė kompiuteriui' },
                    ].map(link => (
                      <Link key={link.path} to={link.path}
                            className="cl-btn-outline text-xs font-heading font-medium px-3.5 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                        {link.label}<ChevronRight className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </section>

            {/* ═══ 8. HOW TO CHOOSE ═══ */}
            <section id="kaip-pasirinkti" className="mb-12 scroll-mt-8">
              <ScrollReveal>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-[hsla(195,100%,42%,0.1)] flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-[hsl(var(--cl-cyan))]" />
                  </div>
                  <h2 className="font-heading text-xl font-extrabold text-[hsl(var(--cl-navy))]">Kaip pasirinkti?</h2>
                </div>
              </ScrollReveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {buyerGuide.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <ScrollReveal key={idx} delay={idx * 40}>
                      <div className="cl-card rounded-xl p-4 h-full">
                        <h3 className="font-heading font-bold text-[hsl(var(--cl-navy))] text-sm mb-1.5 flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-[hsla(195,100%,42%,0.08)] flex items-center justify-center shrink-0">
                            <Icon className="w-3 h-3 text-[hsl(var(--cl-cyan))]" />
                          </div>
                          {item.q}
                        </h3>
                        <p className="text-xs text-[hsl(var(--cl-text-secondary))] leading-relaxed">{item.advice}</p>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
              <ScrollReveal>
                <div className="mt-4 rounded-xl bg-[hsla(195,100%,42%,0.04)] border border-[hsla(195,100%,42%,0.12)] p-4 max-w-2xl">
                  <p className="text-xs text-[hsl(var(--cl-text-secondary))] leading-relaxed">
                    <strong className="text-[hsl(var(--cl-navy))]">Bendra taisyklė:</strong> 1 Windows kompiuteris + atsargus naršymas = Windows Defender gali pakakti. 2+ įrenginiai, telefonas ar šeima = investuokite ~3–5 €/mėn.
                  </p>
                </div>
              </ScrollReveal>
            </section>

            {/* ═══ 9. METHODOLOGY ═══ */}
            <section className="mb-12 scroll-mt-8">
              <ScrollReveal>
                <div className="cl-card rounded-xl p-6 md:p-8">
                  <h2 className="font-heading text-lg font-extrabold text-[hsl(var(--cl-navy))] mb-4 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[hsla(195,100%,42%,0.1)] flex items-center justify-center">
                      <BadgeCheck className="w-4 h-4 text-[hsl(var(--cl-cyan))]" />
                    </div>
                    Kaip vertiname
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
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
                        <div key={idx} className="rounded-lg bg-[hsl(var(--cl-surface-alt))] border border-[hsl(var(--cl-border))] p-3.5 flex gap-2.5">
                          <div className="w-7 h-7 rounded bg-[hsla(195,100%,42%,0.08)] flex items-center justify-center shrink-0 mt-0.5">
                            <Icon className="w-3.5 h-3.5 text-[hsl(var(--cl-cyan))]" />
                          </div>
                          <div>
                            <p className="font-heading font-semibold text-[hsl(var(--cl-navy))] text-xs mb-0.5">{item.title}</p>
                            <p className="text-[10px] text-[hsl(var(--cl-text-muted))] leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="cl-divider mb-3" />
                  <p className="text-[10px] text-[hsl(var(--cl-text-muted))]">Redakcija nepriklausoma. Affiliate partnerystės neįtakoja vertinimų.</p>
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
                  <h2 className="font-heading text-xl font-extrabold text-[hsl(var(--cl-navy))] mb-5">Susiję straipsniai</h2>
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
                <div className="cl-card rounded-xl p-6">
                  <h2 className="font-heading text-lg font-extrabold text-[hsl(var(--cl-navy))] mb-4">Kiti naudingi gidai</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {relatedGuides.map(guide => {
                      const Icon = guide.icon;
                      return (
                        <Link key={guide.path} to={guide.path}
                              className="flex items-center gap-3 rounded-lg p-3 bg-[hsl(var(--cl-surface-alt))] hover:bg-[hsla(195,100%,42%,0.06)] border border-transparent hover:border-[hsla(195,100%,42%,0.15)] transition-all group">
                          <div className="w-8 h-8 rounded-lg bg-[hsla(195,100%,42%,0.08)] flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-[hsl(var(--cl-cyan))]" />
                          </div>
                          <div>
                            <span className="text-sm text-[hsl(var(--cl-navy))] font-medium group-hover:text-[hsl(var(--cl-cyan))] transition-colors">{guide.label}</span>
                            <span className="text-[10px] text-[hsl(var(--cl-text-muted))] block">{guide.desc}</span>
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
        </div>
      </div>
    </PageLayout>
  );
};

export default AntivirusLandingPage;
