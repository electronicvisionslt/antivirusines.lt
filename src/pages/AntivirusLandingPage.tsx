import {
  Star, ExternalLink, Shield, Smartphone, Monitor, ChevronRight, CheckCircle2, XCircle,
  Clock, BarChart3, Layers, Award, Heart, Zap, Lock, Users, ChevronDown,
  Check, X, Laptop, Globe, Eye, ShieldCheck, HelpCircle, BadgeCheck, ThumbsUp, ThumbsDown,
  Fingerprint, Activity, Cpu, Radio, Crosshair, Terminal, ScanLine,
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

/* ═══════════ HELPERS ═══════════ */

function RatingBar({ rating }: { rating: number }) {
  const pct = (rating / 10) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-[hsla(210,20%,16%,0.8)] overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--cy-cyan))] to-[hsl(var(--cy-neon))] cy-pulse-bar" style={{ width: `${pct}%` }} />
      </div>
      <span className="cy-mono text-xs font-bold text-[hsl(var(--cy-cyan))]">{rating.toFixed(1)}</span>
    </div>
  );
}

function ProductLogo({ product, size = 40 }: { product: PublicProduct; size?: number }) {
  if (product.logoUrl) {
    return <img src={product.logoUrl} alt={`${product.name} logotipas`} width={size} height={size} className="rounded-lg object-contain" loading="lazy" />;
  }
  return (
    <div className="rounded-lg bg-[hsla(185,100%,50%,0.08)] border border-[hsla(185,100%,50%,0.15)] flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <span className="font-heading font-bold text-[hsl(var(--cy-cyan))] cy-mono" style={{ fontSize: size * 0.35 }}>
        {product.brand?.slice(0, 2).toUpperCase() || product.name.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

function CyberButton({ product, variant = 'solid', className = '', label }: { product: PublicProduct; variant?: 'solid' | 'ghost'; className?: string; label?: string }) {
  if (!product.affiliateUrl) return null;
  const base = variant === 'solid' ? 'cy-btn-solid' : 'cy-btn';
  return (
    <a href={product.affiliateUrl} target="_blank" rel="nofollow sponsored noopener noreferrer"
       className={`inline-flex items-center gap-2 font-heading font-bold rounded-lg active:scale-[0.97] ${base} ${className}`}>
      {label || 'Apsilankyti'}<ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
}

function FeatureIcon({ value }: { value: boolean | string }) {
  if (value === true) return <div className="w-5 h-5 rounded-full bg-[hsla(145,100%,50%,0.1)] border border-[hsla(145,100%,50%,0.2)] flex items-center justify-center mx-auto"><Check className="w-3 h-3 text-[hsl(var(--cy-neon))]" /></div>;
  if (value === false) return <div className="w-5 h-5 rounded-full bg-[hsla(210,10%,35%,0.1)] border border-[hsla(210,10%,35%,0.15)] flex items-center justify-center mx-auto"><X className="w-3 h-3 text-[hsl(var(--cy-text-muted))]" /></div>;
  return <span className="text-xs text-[hsl(var(--cy-text-dim))]">{value}</span>;
}

function PlatformBadges({ platforms }: { platforms: string[] }) {
  const icons: Record<string, typeof Monitor> = { Windows: Monitor, Mac: Laptop, Android: Smartphone, iOS: Smartphone };
  return (
    <div className="flex gap-1 flex-wrap">
      {platforms.slice(0, 4).map(p => {
        const Icon = icons[p] || Globe;
        return (
          <span key={p} className="inline-flex items-center gap-1 text-[10px] text-[hsl(var(--cy-text-dim))] bg-[hsl(var(--cy-panel))] border border-[hsl(var(--cy-border))] rounded px-1.5 py-0.5">
            <Icon className="w-2.5 h-2.5" />{p}
          </span>
        );
      })}
    </div>
  );
}

/* ═══════════ SECTION HEADER ═══════════ */

function SectionHeader({ icon: Icon, title, subtitle, id }: { icon: typeof Shield; title: string; subtitle?: string; id?: string }) {
  return (
    <div id={id} className="flex items-center gap-3 mb-6 scroll-mt-8">
      <div className="w-10 h-10 rounded-lg bg-[hsla(185,100%,50%,0.08)] border border-[hsla(185,100%,50%,0.15)] flex items-center justify-center shrink-0 cy-radar">
        <Icon className="w-5 h-5 text-[hsl(var(--cy-cyan))]" />
      </div>
      <div>
        <h2 className="font-heading text-xl md:text-2xl font-extrabold text-[hsl(var(--cy-text))] tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-[hsl(var(--cy-text-dim))]">{subtitle}</p>}
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-[hsla(185,100%,50%,0.15)] to-transparent ml-3 hidden md:block" />
    </div>
  );
}

/* ═══════════ STATIC DATA ═══════════ */

const jumpLinks = [
  { href: '#top-picks', label: 'Top pasirinkimai', icon: Crosshair },
  { href: '#palyginimas', label: 'Palyginimas', icon: BarChart3 },
  { href: '#pagal-poreiki', label: 'Pagal poreikį', icon: Layers },
  { href: '#apzvalgos', label: 'Apžvalgos', icon: Terminal },
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

interface UseCaseBlock { icon: typeof Shield; title: string; why: string; matchKey: string; tag: string; tagColor: string }
const useCases: UseCaseBlock[] = [
  { icon: Award, title: 'Geriausia visapusiška apsauga', why: 'Plačiausias funkcijų rinkinys su neribotu VPN ir tamsiojo interneto stebėjimu.', matchKey: 'Norton', tag: 'TOP', tagColor: 'cy-badge-amber' },
  { icon: Zap, title: 'Geriausia nemokama', why: 'Stipriausias grėsmių aptikimas tarp nemokamų alternatyvų.', matchKey: 'Avast', tag: 'FREE', tagColor: 'cy-badge-green' },
  { icon: Users, title: 'Geriausia šeimoms', why: 'Iki 5–15 įrenginių viena licencija su pilna tėvų kontrole.', matchKey: 'Norton', tag: 'FAMILY', tagColor: 'cy-badge-magenta' },
  { icon: Smartphone, title: 'Geriausia telefonui', why: 'Mažiausias poveikis baterijai išlaikant stiprią apsaugą.', matchKey: 'Bitdefender', tag: 'MOBILE', tagColor: 'cy-badge' },
  { icon: Monitor, title: 'Geriausia Windows', why: 'Debesijos skenavimas su žaidimų režimu.', matchKey: 'Bitdefender', tag: 'WIN', tagColor: 'cy-badge' },
  { icon: Heart, title: 'Pradedantiesiems', why: 'Instaliuojama per 3 min, veikia automatiškai.', matchKey: 'Norton', tag: 'EASY', tagColor: 'cy-badge-green' },
];

const buyerGuide = [
  { q: 'Kiek įrenginių?', advice: '1 įrenginys — pakanka nemokama. 2+ — rinkitės mokamą su kelių įrenginių licencija.', icon: Layers },
  { q: 'Reikia telefono apsaugos?', advice: 'Android atviresnė grėsmėms. Rinkitės su dedikuota mobilia versija.', icon: Smartphone },
  { q: 'Turite vaikų internete?', advice: 'Prioritetas — tėvų kontrolė. Norton ir Kaspersky siūlo stipriausias funkcijas.', icon: Users },
  { q: 'Svarbus VPN ar slaptažodžiai?', advice: 'Viešuose Wi-Fi — rinkitės paketą su integruotu VPN.', icon: Lock },
  { q: 'Koks biudžetas?', advice: 'Nemokamos — bazinei apsaugai. Mokamos 20–60 €/m.', icon: BarChart3 },
  { q: 'Paprastumas ar kontrolė?', advice: 'Norton — automatinis. Bitdefender/Kaspersky — daugiau nustatymų.', icon: Shield },
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
  { key: 'Slaptažodžių tvarkyklė', label: 'Slaptaž.' },
  { key: 'Tėvų kontrolė', label: 'Tėvų k.' },
  { key: 'Telefonų apsauga', label: 'Tel. aps.' },
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
    description: category.metaDescription || 'Nepriklausomos antivirusinių programų apžvalgos ir palyginimas.',
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
      <div className="cyber-cmd min-h-screen -mt-px">
        <div className="cy-grid cy-hex-bg">
          <div className="container py-8">
            <Breadcrumbs path={category.path} items={[
              { label: 'Pradžia', path: '/' },
              { label: 'Antivirusinės programos', path: '/antivirusines-programos' },
            ]} />

            {/* ═══ HERO ═══ */}
            <ScrollReveal>
              <section className="relative rounded-2xl overflow-hidden cy-panel cy-panel-glow cy-scanline mb-10">
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[hsla(185,100%,50%,0.25)] rounded-tl-2xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[hsla(185,100%,50%,0.25)] rounded-br-2xl pointer-events-none" />
                {/* Top glow line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--cy-cyan))] to-transparent opacity-60" />

                <div className="relative z-10 p-6 md:p-10 lg:p-12">
                  <div className="max-w-4xl">
                    {/* Status bar */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5">
                      <span className="cy-badge rounded-full px-3 py-1 text-[11px] font-heading font-bold uppercase tracking-[0.15em] inline-flex items-center gap-1.5 cy-flicker">
                        <Radio className="w-3 h-3" />LIVE palyginimas
                      </span>
                      <span className="text-[11px] text-[hsl(var(--cy-text-dim))] cy-mono flex items-center gap-1"><Clock className="w-3 h-3" />UPD: {updatedLabel}</span>
                      <span className="text-[11px] text-[hsl(var(--cy-text-muted))] flex items-center gap-1"><Lock className="w-3 h-3" />Affiliate</span>
                    </div>

                    <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.04] mb-5">
                      <span className="text-[hsl(var(--cy-text))]">Geriausios antivirusinės</span>
                      <br />
                      <span className="text-[hsl(var(--cy-text))]">programos </span>
                      <span className="cy-gradient-text">2025&nbsp;m.</span>
                    </h1>

                    <p className="text-[hsl(var(--cy-text-dim))] text-base md:text-lg leading-relaxed max-w-2xl mb-6">
                      Išanalizavome populiariausias antivirusines pagal apsaugą, greitį, funkcijas ir kainą — kad galėtumėte pasirinkti per kelias minutes.
                    </p>

                    {/* Quick picks */}
                    {products.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {bestOverall && (
                          <a href="#top-picks" className="cy-badge-amber rounded-lg px-4 py-2 text-xs font-heading font-bold inline-flex items-center gap-2 hover:brightness-125 transition-all">
                            <Crosshair className="w-3.5 h-3.5" />#1 {bestOverall.name}
                          </a>
                        )}
                        {bestFree && (
                          <a href="#top-picks" className="cy-badge-green rounded-lg px-4 py-2 text-xs font-heading font-bold inline-flex items-center gap-2 hover:brightness-125 transition-all">
                            <Zap className="w-3.5 h-3.5" />FREE {bestFree.name}
                          </a>
                        )}
                        {bestFamily && bestFamily !== bestOverall && (
                          <a href="#pagal-poreiki" className="cy-badge-magenta rounded-lg px-4 py-2 text-xs font-heading font-bold inline-flex items-center gap-2 hover:brightness-125 transition-all">
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
                             className="text-[11px] font-heading font-semibold px-3 py-1.5 rounded-lg bg-[hsl(var(--cy-panel))] text-[hsl(var(--cy-text-dim))] border border-[hsl(var(--cy-border))] hover:border-[hsla(185,100%,50%,0.25)] hover:text-[hsl(var(--cy-cyan))] hover:bg-[hsla(185,100%,50%,0.05)] transition-all inline-flex items-center gap-1.5">
                            <Icon className="w-3 h-3" />{link.label}
                          </a>
                        );
                      })}
                    </nav>
                  </div>
                </div>
              </section>
            </ScrollReveal>

            {/* ═══ STATS ═══ */}
            <ScrollReveal>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
                {[
                  { icon: ScanLine, value: `${products.length}`, label: 'Programos', sub: 'palygintos' },
                  { icon: Activity, value: `${featureCols.length + 2}`, label: 'Kriterijai', sub: 'vertinimo' },
                  { icon: Cpu, value: '4', label: 'Platformos', sub: 'palaikomos' },
                  { icon: BadgeCheck, value: '✓', label: 'Redakcija', sub: 'nepriklausoma' },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="cy-stat rounded-xl p-4 text-center">
                      <Icon className="w-5 h-5 text-[hsl(var(--cy-cyan))] mx-auto mb-2 cy-flicker" />
                      <p className="font-heading font-black text-2xl cy-glow-text cy-mono">{s.value}</p>
                      <p className="text-[10px] text-[hsl(var(--cy-text-dim))] font-heading uppercase tracking-[0.15em] mt-0.5">{s.label}</p>
                      <p className="text-[9px] text-[hsl(var(--cy-text-muted))]">{s.sub}</p>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>

            {/* ═══ TOP PICKS ═══ */}
            {topPicks.length > 0 && (
              <section className="mb-14 scroll-mt-8">
                <ScrollReveal>
                  <SectionHeader icon={Crosshair} title="Mūsų pasirinkimai" subtitle="Greita santrauka — detalesnės apžvalgos žemiau." id="top-picks" />
                </ScrollReveal>

                <div className="space-y-3">
                  {topPicks.map((product, i) => (
                    <ScrollReveal key={product.id} delay={i * 60}>
                      <div className={`cy-panel rounded-xl p-5 md:p-6 relative ${i === 0 ? 'cy-panel-rank1 cy-corners' : ''}`}>
                        {/* Rank indicator */}
                        <div className="absolute -top-px -left-px">
                          <div className={`rounded-br-lg rounded-tl-xl px-3 py-1.5 text-[10px] font-heading font-black uppercase tracking-[0.2em] cy-mono ${i === 0 ? 'bg-[hsla(38,100%,55%,0.15)] text-[hsl(var(--cy-amber))] border-b border-r border-[hsla(38,100%,55%,0.2)]' : 'bg-[hsla(185,100%,50%,0.06)] text-[hsl(var(--cy-text-dim))] border-b border-r border-[hsl(var(--cy-border))]'}`}>
                            #{i + 1}
                          </div>
                        </div>

                        <div className="flex items-start gap-4 pt-2">
                          <ProductLogo product={product} size={48} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap mb-1.5">
                              <h3 className="font-heading font-extrabold text-[hsl(var(--cy-text))] text-lg">{product.name}</h3>
                              <RatingBar rating={product.rating} />
                              <span className="text-xs text-[hsl(var(--cy-text-dim))] cy-mono">{product.pricingSummary}</span>
                              {product.freeVersion && <span className="cy-badge-green text-[10px] font-bold px-2 py-0.5 rounded cy-mono uppercase tracking-wider">Free</span>}
                            </div>
                            <p className="text-xs text-[hsl(var(--cy-text-dim))] mb-3">{product.bestFor}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                              {product.pros.slice(0, 3).map((p, j) => (
                                <span key={j} className="inline-flex items-center gap-1.5 text-[11px] text-[hsl(var(--cy-text-dim))]">
                                  <CheckCircle2 className="w-3 h-3 text-[hsl(var(--cy-neon))] shrink-0" />{p}
                                </span>
                              ))}
                              {product.cons.slice(0, 2).map((c, j) => (
                                <span key={j} className="inline-flex items-center gap-1.5 text-[11px] text-[hsl(var(--cy-text-muted))]">
                                  <XCircle className="w-3 h-3 text-[hsl(var(--cy-red))]/40 shrink-0" />{c}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="shrink-0 hidden sm:block">
                            <CyberButton product={product} variant={i === 0 ? 'solid' : 'ghost'} className="px-5 py-2.5 text-sm" />
                          </div>
                        </div>
                        <div className="sm:hidden mt-4">
                          <CyberButton product={product} variant={i === 0 ? 'solid' : 'ghost'} className="px-4 py-2 text-xs w-full justify-center" />
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </section>
            )}

            {/* ═══ COMPARISON TABLE ═══ */}
            {products.length > 0 && (
              <section className="mb-14 scroll-mt-8">
                <ScrollReveal>
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
                    <SectionHeader icon={BarChart3} title="Palyginimo lentelė" subtitle="Visos funkcijos ir kainos vienoje vietoje." id="palyginimas" />
                    <div className="flex gap-1.5 mb-6">
                      {filterOptions.map(opt => {
                        const Icon = opt.icon;
                        const active = activeFilter === opt.key;
                        return (
                          <button key={opt.key} onClick={() => setActiveFilter(opt.key)}
                                  className={`text-[11px] font-heading font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-all uppercase tracking-wider ${active ? 'cy-btn-solid' : 'bg-[hsl(var(--cy-panel))] text-[hsl(var(--cy-text-dim))] border border-[hsl(var(--cy-border))] hover:border-[hsla(185,100%,50%,0.2)]'}`}>
                            <Icon className="w-3 h-3" />{opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </ScrollReveal>

                {filteredProducts.length === 0 && (
                  <p className="text-sm text-[hsl(var(--cy-text-muted))] text-center py-8 cy-mono">[ Nėra produktų pagal filtrą ]</p>
                )}

                {filteredProducts.length > 0 && (
                  <ScrollReveal>
                    {/* Desktop */}
                    <div className="hidden md:block overflow-x-auto rounded-xl cy-panel overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="cy-table-head">
                            <th className="text-left p-4 font-heading font-bold text-[hsl(var(--cy-text))] uppercase tracking-wider text-[11px]">Programa</th>
                            <th className="text-center p-4 font-heading font-bold text-[hsl(var(--cy-text))] uppercase tracking-wider text-[11px]">Reit.</th>
                            <th className="text-center p-4 font-heading font-bold text-[hsl(var(--cy-text))] uppercase tracking-wider text-[11px]">Kaina</th>
                            <th className="text-center p-4 font-heading font-bold text-[hsl(var(--cy-text))] uppercase tracking-wider text-[11px]">Free</th>
                            <th className="text-center p-4 font-heading font-bold text-[hsl(var(--cy-text))] uppercase tracking-wider text-[11px]">Trial</th>
                            {featureCols.map(col => (
                              <th key={col.key} className="text-center p-4 font-heading font-bold text-[hsl(var(--cy-text))] uppercase tracking-wider text-[11px] whitespace-nowrap">{col.label}</th>
                            ))}
                            <th className="text-center p-4 font-heading font-bold text-[hsl(var(--cy-text))] uppercase tracking-wider text-[11px]">Platf.</th>
                            <th className="p-4" />
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((product, idx) => (
                            <tr key={product.id} className="cy-table-row">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <ProductLogo product={product} size={28} />
                                  <span className="font-heading font-bold text-[hsl(var(--cy-text))] text-sm">{product.name}</span>
                                </div>
                              </td>
                              <td className="p-4 text-center"><RatingBar rating={product.rating} /></td>
                              <td className="p-4 text-center text-[hsl(var(--cy-text-dim))] whitespace-nowrap text-xs cy-mono">{product.pricingSummary}</td>
                              <td className="p-4 text-center"><FeatureIcon value={product.freeVersion} /></td>
                              <td className="p-4 text-center"><FeatureIcon value={product.trialAvailable} /></td>
                              {featureCols.map(col => (
                                <td key={col.key} className="p-4 text-center"><FeatureIcon value={product.features[col.key] ?? false} /></td>
                              ))}
                              <td className="p-4 text-center"><span className="text-xs text-[hsl(var(--cy-text-dim))] cy-mono">{product.supportedPlatforms.length}</span></td>
                              <td className="p-4"><CyberButton product={product} variant="ghost" className="px-3 py-1.5 text-[11px] whitespace-nowrap" /></td>
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
                          <div key={product.id} className="rounded-xl cy-panel overflow-hidden">
                            <button onClick={() => setExpandedRow(isExpanded ? null : product.id)} className="w-full p-4 flex items-center gap-3 text-left">
                              <ProductLogo product={product} size={30} />
                              <div className="flex-1 min-w-0">
                                <p className="font-heading font-bold text-[hsl(var(--cy-text))] text-sm">{product.name}</p>
                                <p className="text-[11px] text-[hsl(var(--cy-text-muted))] cy-mono">{product.pricingSummary}</p>
                              </div>
                              <RatingBar rating={product.rating} />
                              <ChevronDown className={`w-4 h-4 text-[hsl(var(--cy-text-muted))] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                            {isExpanded && (
                              <div className="px-4 pb-4 pt-1 border-t border-[hsl(var(--cy-border))] space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex items-center gap-1.5 text-xs"><FeatureIcon value={product.freeVersion} /><span className="text-[hsl(var(--cy-text-dim))]">Free</span></div>
                                  <div className="flex items-center gap-1.5 text-xs"><FeatureIcon value={product.trialAvailable} /><span className="text-[hsl(var(--cy-text-dim))]">Trial</span></div>
                                  {featureCols.map(col => (
                                    <div key={col.key} className="flex items-center gap-1.5 text-xs">
                                      <FeatureIcon value={product.features[col.key] ?? false} /><span className="text-[hsl(var(--cy-text-dim))]">{col.label}</span>
                                    </div>
                                  ))}
                                </div>
                                {product.supportedPlatforms.length > 0 && <PlatformBadges platforms={product.supportedPlatforms} />}
                                <CyberButton product={product} className="px-4 py-2 text-xs w-full justify-center" label="Gauti pasiūlymą" />
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

            {/* ═══ USE CASES ═══ */}
            <section className="mb-14 scroll-mt-8">
              <ScrollReveal>
                <SectionHeader icon={Layers} title="Geriausia pagal poreikį" subtitle="Skirtingiems naudotojams — skirtingi sprendimai." id="pagal-poreiki" />
              </ScrollReveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {useCases.map((uc, idx) => {
                  const matched = findProduct(uc.matchKey);
                  const Icon = uc.icon;
                  return (
                    <ScrollReveal key={idx} delay={idx * 50}>
                      <div className="cy-panel rounded-xl p-5 h-full flex flex-col cy-holo-border">
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="w-9 h-9 rounded-lg bg-[hsla(185,100%,50%,0.06)] border border-[hsla(185,100%,50%,0.12)] flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-[hsl(var(--cy-cyan))]" />
                          </div>
                          <h3 className="font-heading font-bold text-[hsl(var(--cy-text))] text-sm flex-1">{uc.title}</h3>
                          <span className={`${uc.tagColor} text-[9px] font-heading font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded cy-mono`}>{uc.tag}</span>
                        </div>
                        <p className="text-xs text-[hsl(var(--cy-text-dim))] leading-relaxed mb-3 flex-1">{uc.why}</p>
                        {matched && (
                          <div className="flex items-center gap-2.5 pt-3 border-t border-[hsl(var(--cy-border))] mt-auto">
                            <ProductLogo product={matched} size={24} />
                            <span className="font-heading font-bold text-[hsl(var(--cy-text))] text-xs flex-1">{matched.name}</span>
                            <RatingBar rating={matched.rating} />
                            <CyberButton product={matched} variant="ghost" className="px-2.5 py-1 text-[10px]" />
                          </div>
                        )}
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </section>

            {/* ═══ REVIEWS (collapsible) ═══ */}
            {products.length > 0 && (
              <section className="mb-14 scroll-mt-8">
                <ScrollReveal>
                  <SectionHeader icon={Terminal} title="Individualios apžvalgos" subtitle="Spauskite ant programos — detalesnė apžvalga." id="apzvalgos" />
                </ScrollReveal>

                <div className="space-y-2.5">
                  {products.map((product, i) => {
                    const editorial = getEditorial(product);
                    const isOpen = expandedReview === product.id;
                    const anchorId = product.brand.toLowerCase() || product.slug;

                    return (
                      <ScrollReveal key={product.id} delay={i * 40}>
                        <div id={anchorId} className={`rounded-xl cy-panel overflow-hidden scroll-mt-8 ${isOpen ? 'cy-panel-glow' : ''}`}>
                          <button
                            onClick={() => setExpandedReview(isOpen ? null : product.id)}
                            className="w-full p-4 md:p-5 flex items-center gap-3 text-left hover:bg-[hsla(185,100%,50%,0.02)] transition-colors"
                          >
                            <div className="shrink-0 w-8 h-8 rounded bg-[hsl(var(--cy-panel))] border border-[hsl(var(--cy-border))] flex items-center justify-center">
                              <span className="font-heading font-black text-[hsl(var(--cy-cyan))] text-xs cy-mono">#{i + 1}</span>
                            </div>
                            <ProductLogo product={product} size={40} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-heading font-bold text-[hsl(var(--cy-text))] text-base">{product.name}</h3>
                                <RatingBar rating={product.rating} />
                              </div>
                              <p className="text-xs text-[hsl(var(--cy-text-dim))] mt-0.5">{product.bestFor}</p>
                            </div>
                            <div className="hidden sm:flex items-center gap-3 shrink-0">
                              <span className="text-sm font-heading font-bold text-[hsl(var(--cy-text))] cy-mono">{product.pricingSummary}</span>
                              <CyberButton product={product} variant="ghost" className="px-3 py-1.5 text-xs" />
                            </div>
                            <ChevronDown className={`w-4 h-4 text-[hsl(var(--cy-text-muted))] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {isOpen && (
                            <div className="px-5 pb-6 pt-3 border-t border-[hsl(var(--cy-border))]">
                              {/* Specs grid */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
                                {[
                                  { label: 'Kaina', value: product.pricingSummary },
                                  { label: 'Platformos', value: String(product.supportedPlatforms.length) },
                                  { label: 'Nemokama', value: product.freeVersion ? 'TAIP' : 'NE' },
                                  { label: 'Bandomoji', value: product.trialAvailable ? 'TAIP' : 'NE' },
                                ].map((spec, si) => (
                                  <div key={si} className="cy-stat rounded-lg p-3 text-center">
                                    <p className="text-[9px] text-[hsl(var(--cy-text-muted))] font-heading uppercase tracking-[0.2em] mb-1">{spec.label}</p>
                                    <p className="text-xs font-heading font-black text-[hsl(var(--cy-text))] cy-mono">{spec.value}</p>
                                  </div>
                                ))}
                              </div>

                              {/* Pros / Cons */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                                {product.pros.length > 0 && (
                                  <div className="rounded-lg bg-[hsla(145,100%,50%,0.03)] border border-[hsla(145,100%,50%,0.12)] p-4">
                                    <h4 className="flex items-center gap-1.5 font-heading font-bold text-[hsl(var(--cy-neon))] text-xs mb-2.5 uppercase tracking-wider">
                                      <ThumbsUp className="w-3 h-3" />Privalumai
                                    </h4>
                                    <ul className="space-y-1.5">
                                      {product.pros.map((pro, j) => (
                                        <li key={j} className="flex items-start gap-2 text-xs text-[hsl(var(--cy-text-dim))]">
                                          <CheckCircle2 className="w-3 h-3 text-[hsl(var(--cy-neon))] mt-0.5 shrink-0" />{pro}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {product.cons.length > 0 && (
                                  <div className="rounded-lg bg-[hsla(0,80%,58%,0.03)] border border-[hsla(0,80%,58%,0.12)] p-4">
                                    <h4 className="flex items-center gap-1.5 font-heading font-bold text-[hsl(var(--cy-red))] text-xs mb-2.5 uppercase tracking-wider">
                                      <ThumbsDown className="w-3 h-3" />Trūkumai
                                    </h4>
                                    <ul className="space-y-1.5">
                                      {product.cons.map((con, j) => (
                                        <li key={j} className="flex items-start gap-2 text-xs text-[hsl(var(--cy-text-dim))]">
                                          <XCircle className="w-3 h-3 text-[hsl(var(--cy-red))]/50 mt-0.5 shrink-0" />{con}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>

                              {editorial && (
                                <div className="space-y-2.5 mb-5">
                                  <p className="text-sm text-[hsl(var(--cy-text-dim))] leading-relaxed">{editorial.summary}</p>
                                  <p className="text-sm text-[hsl(var(--cy-text-dim))] leading-relaxed">{editorial.strengths}</p>
                                </div>
                              )}

                              {/* Features */}
                              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-5">
                                {featureCols.map(col => {
                                  const val = product.features[col.key];
                                  return (
                                    <span key={col.key} className="inline-flex items-center gap-1.5 text-xs text-[hsl(var(--cy-text-dim))]">
                                      {val === true ? <Check className="w-3.5 h-3.5 text-[hsl(var(--cy-neon))]" /> : <X className="w-3.5 h-3.5 text-[hsl(var(--cy-text-muted))]" />}
                                      {col.label}
                                    </span>
                                  );
                                })}
                              </div>

                              {/* Verdict */}
                              <div className="rounded-lg bg-[hsla(185,100%,50%,0.03)] border border-[hsla(185,100%,50%,0.12)] p-4 mb-5 cy-corners">
                                <p className="text-xs text-[hsl(var(--cy-text-dim))] leading-relaxed">
                                  <strong className="text-[hsl(var(--cy-cyan))] cy-mono uppercase tracking-wider text-[10px]">Verdiktas: </strong>
                                  {editorial?.verdict || product.verdict || product.shortDescription}
                                </p>
                              </div>

                              <div className="flex items-center gap-3">
                                <CyberButton product={product} variant="solid" className="px-6 py-2.5 text-sm" label="Gauti pasiūlymą" />
                                <span className="text-xs text-[hsl(var(--cy-text-muted))] cy-mono">nuo {product.pricingSummary}</span>
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

            {/* ═══ FREE VS PAID ═══ */}
            <section className="mb-14 scroll-mt-8">
              <ScrollReveal>
                <div className="cy-panel cy-panel-glow rounded-xl p-6 md:p-8">
                  <h2 className="font-heading text-xl font-extrabold text-[hsl(var(--cy-text))] mb-6 flex items-center gap-3">
                    <Zap className="w-5 h-5 text-[hsl(var(--cy-amber))]" />
                    Nemokama ar mokama?
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Free */}
                    <div className="rounded-xl border border-[hsl(var(--cy-border))] bg-[hsl(var(--cy-panel))] p-5">
                      <h3 className="font-heading font-bold text-[hsl(var(--cy-text))] text-sm mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[hsl(var(--cy-text-dim))]" />NEMOKAMA
                        <span className="cy-badge-green text-[9px] font-black px-2 py-0.5 rounded cy-mono ml-auto">0 €</span>
                      </h3>
                      <ul className="space-y-2 text-xs text-[hsl(var(--cy-text-dim))]">
                        {[
                          { good: true, t: 'Bazinė apsauga nuo virusų' },
                          { good: true, t: 'Pakankama vienam įrenginiui' },
                          { good: false, t: 'Nėra VPN, slaptažodžių, tėvų kontrolės' },
                          { good: false, t: 'Ribota pagalba' },
                        ].map((it, j) => (
                          <li key={j} className="flex items-start gap-2">
                            {it.good ? <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--cy-neon))] mt-0.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-[hsl(var(--cy-red))]/40 mt-0.5 shrink-0" />}
                            {it.t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Paid */}
                    <div className="rounded-xl border border-[hsla(185,100%,50%,0.25)] bg-[hsla(185,100%,50%,0.03)] p-5">
                      <h3 className="font-heading font-bold text-[hsl(var(--cy-text))] text-sm mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[hsl(var(--cy-cyan))]" />MOKAMA
                        <span className="cy-badge text-[9px] font-black px-2 py-0.5 rounded cy-mono ml-auto">20–60 €/m.</span>
                      </h3>
                      <ul className="space-y-2 text-xs text-[hsl(var(--cy-text-dim))]">
                        {[
                          { good: true, t: 'VPN, slaptažodžiai, tamsaus interneto stebėjimas' },
                          { good: true, t: 'Kelių įrenginių apsauga (3–15 įr.)' },
                          { good: true, t: 'Tėvų kontrolė ir šeimos funkcijos' },
                          { good: false, t: 'Metinis mokėjimas' },
                        ].map((it, j) => (
                          <li key={j} className="flex items-start gap-2">
                            {it.good ? <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--cy-neon))] mt-0.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-[hsl(var(--cy-red))]/40 mt-0.5 shrink-0" />}
                            {it.t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      { path: '/antivirusines-programos/nemokamos', label: 'Nemokamos antivirusinės' },
                      { path: '/antivirusines-programos/telefonui', label: 'Antivirusinė telefonui' },
                      { path: '/antivirusines-programos/kompiuteriui', label: 'Antivirusinė kompiuteriui' },
                    ].map(link => (
                      <Link key={link.path} to={link.path}
                            className="cy-btn text-xs font-heading font-bold px-4 py-2 rounded-lg inline-flex items-center gap-1.5">
                        {link.label}<ChevronRight className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </section>

            {/* ═══ HOW TO CHOOSE ═══ */}
            <section className="mb-14 scroll-mt-8">
              <ScrollReveal>
                <SectionHeader icon={HelpCircle} title="Kaip pasirinkti?" id="kaip-pasirinkti" />
              </ScrollReveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {buyerGuide.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <ScrollReveal key={idx} delay={idx * 50}>
                      <div className="cy-panel rounded-xl p-4 h-full">
                        <h3 className="font-heading font-bold text-[hsl(var(--cy-text))] text-sm mb-2 flex items-center gap-2">
                          <div className="w-7 h-7 rounded bg-[hsla(185,100%,50%,0.06)] border border-[hsla(185,100%,50%,0.1)] flex items-center justify-center shrink-0">
                            <Icon className="w-3.5 h-3.5 text-[hsl(var(--cy-cyan))]" />
                          </div>
                          {item.q}
                        </h3>
                        <p className="text-xs text-[hsl(var(--cy-text-dim))] leading-relaxed">{item.advice}</p>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
              <ScrollReveal>
                <div className="mt-5 rounded-xl bg-[hsla(185,100%,50%,0.03)] border border-[hsla(185,100%,50%,0.12)] p-4 max-w-2xl cy-corners">
                  <p className="text-xs text-[hsl(var(--cy-text-dim))] leading-relaxed">
                    <strong className="text-[hsl(var(--cy-cyan))] cy-mono uppercase tracking-wider text-[10px]">Taisyklė: </strong>
                    1 Windows kompiuteris + atsargus naršymas = Windows Defender gali pakakti. 2+ įrenginiai, telefonas ar šeima = investuokite ~3–5 €/mėn.
                  </p>
                </div>
              </ScrollReveal>
            </section>

            {/* ═══ METHODOLOGY ═══ */}
            <section className="mb-14">
              <ScrollReveal>
                <div className="cy-panel cy-panel-glow rounded-xl p-6 md:p-8">
                  <h2 className="font-heading text-lg font-extrabold text-[hsl(var(--cy-text))] mb-5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[hsla(185,100%,50%,0.08)] border border-[hsla(185,100%,50%,0.15)] flex items-center justify-center">
                      <BadgeCheck className="w-4 h-4 text-[hsl(var(--cy-cyan))]" />
                    </div>
                    Kaip vertiname
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
                    {[
                      { title: 'Apsaugos efektyvumas', desc: 'Kenkėjiškų programų aptikimas, zero-day grėsmės.', icon: Shield },
                      { title: 'Sistemos našumas', desc: 'Poveikis greičiui, baterijos suvartojimas.', icon: Zap },
                      { title: 'Papildomos funkcijos', desc: 'VPN, slaptažodžiai, tėvų kontrolė.', icon: Layers },
                      { title: 'Kaina ir vertė', desc: 'Pirmo metų kaina, įrenginių skaičius.', icon: BarChart3 },
                      { title: 'Paprastumas', desc: 'Sąsajos aiškumas, diegimo greitis.', icon: Heart },
                      { title: 'Įrenginių palaikymas', desc: 'Platformos, centralizuotas valdymas.', icon: Globe },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={idx} className="rounded-lg bg-[hsl(var(--cy-panel))] border border-[hsl(var(--cy-border))] p-3.5 flex gap-3">
                          <div className="w-7 h-7 rounded bg-[hsla(185,100%,50%,0.06)] border border-[hsla(185,100%,50%,0.1)] flex items-center justify-center shrink-0 mt-0.5">
                            <Icon className="w-3.5 h-3.5 text-[hsl(var(--cy-cyan))]" />
                          </div>
                          <div>
                            <p className="font-heading font-bold text-[hsl(var(--cy-text))] text-xs mb-0.5">{item.title}</p>
                            <p className="text-[10px] text-[hsl(var(--cy-text-muted))] leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="cy-divider mb-3" />
                  <p className="text-[10px] text-[hsl(var(--cy-text-muted))] cy-mono">[ Redakcija nepriklausoma. Affiliate partnerystės neįtakoja vertinimų. ]</p>
                </div>
              </ScrollReveal>
            </section>

            {/* ═══ FAQ ═══ */}
            <section id="duk" className="mb-14 scroll-mt-8">
              <ScrollReveal>
                <FAQAccordion items={category.faq.length > 0 ? category.faq : pillarFaq} title="Dažnai užduodami klausimai" />
              </ScrollReveal>
            </section>

            {/* ═══ ARTICLES ═══ */}
            {categoryArticles.length > 0 && (
              <section className="mb-14">
                <ScrollReveal>
                  <h2 className="font-heading text-xl font-extrabold text-[hsl(var(--cy-text))] mb-5">Susiję straipsniai</h2>
                </ScrollReveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryArticles.map((a, idx) => (
                    <ScrollReveal key={a.path} delay={idx * 50}><ArticleCard article={a} /></ScrollReveal>
                  ))}
                </div>
              </section>
            )}

            {/* ═══ RELATED GUIDES ═══ */}
            <section className="mb-14">
              <ScrollReveal>
                <div className="cy-panel rounded-xl p-6">
                  <h2 className="font-heading text-lg font-extrabold text-[hsl(var(--cy-text))] mb-5">Kiti naudingi gidai</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {relatedGuides.map(guide => {
                      const Icon = guide.icon;
                      return (
                        <Link key={guide.path} to={guide.path}
                              className="flex items-center gap-3 rounded-lg p-3.5 bg-[hsl(var(--cy-panel))] border border-[hsl(var(--cy-border))] hover:border-[hsla(185,100%,50%,0.2)] hover:bg-[hsla(185,100%,50%,0.03)] transition-all group">
                          <div className="w-9 h-9 rounded-lg bg-[hsla(185,100%,50%,0.06)] border border-[hsla(185,100%,50%,0.1)] flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-[hsl(var(--cy-cyan))]" />
                          </div>
                          <div>
                            <span className="text-sm text-[hsl(var(--cy-text))] font-medium group-hover:text-[hsl(var(--cy-cyan))] transition-colors">{guide.label}</span>
                            <span className="text-[10px] text-[hsl(var(--cy-text-muted))] block">{guide.desc}</span>
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
