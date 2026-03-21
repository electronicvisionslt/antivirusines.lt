import {
  Star, ExternalLink, Shield, Smartphone, Monitor, ChevronRight, CheckCircle2, XCircle,
  Clock, BarChart3, Layers, Award, Heart, Zap, Lock, Users, ChevronDown,
  Check, X, Laptop, Globe, Eye, ShieldCheck, HelpCircle, BadgeCheck, ThumbsUp, ThumbsDown,
  Fingerprint, Activity, Cpu, Radio, Crosshair, ScanLine, ArrowRight, Gauge,
} from 'lucide-react';
import PageLayout from '@/components/site/PageLayout';
import Breadcrumbs from '@/components/site/Breadcrumbs';
import ScrollReveal from '@/components/site/ScrollReveal';
import FAQAccordion from '@/components/content/FAQAccordion';
import ArticleCard from '@/components/content/ArticleCard';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useComparisonProducts, type PublicProduct } from '@/hooks/usePublicData';
import type { PublicCategory } from '@/types/content';
import { Link } from 'react-router-dom';
import { useState, useMemo, useEffect, useRef } from 'react';

interface Props { category: PublicCategory }

/* ═══════════ HELPERS ═══════════ */

function RatingBar({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const pct = (rating / 10) * 100;
  const h = size === 'md' ? 'h-2' : 'h-1.5';
  const w = size === 'md' ? 'w-20' : 'w-14';
  return (
    <div className="flex items-center gap-2">
      <div className={`${w} ${h} dtl-rating-track`}>
        <div className="dtl-rating-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="dtl-mono text-xs font-bold text-[hsl(var(--dtl-teal))]">{rating.toFixed(1)}</span>
    </div>
  );
}

function ProductLogo({ product, size = 40 }: { product: PublicProduct; size?: number }) {
  if (product.logoUrl) {
    return <img src={product.logoUrl} alt={`${product.name} logotipas`} width={size} height={size} className="rounded-xl object-contain" loading="lazy" />;
  }
  return (
    <div className="rounded-xl bg-[hsl(var(--dtl-teal-light))] flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <span className="font-heading font-bold text-[hsl(var(--dtl-teal))] dtl-mono" style={{ fontSize: size * 0.35 }}>
        {product.brand?.slice(0, 2).toUpperCase() || product.name.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

function CTAButton({ product, variant = 'primary', className = '', label }: { product: PublicProduct; variant?: 'primary' | 'ghost'; className?: string; label?: string }) {
  if (!product.affiliateUrl) return null;
  const cls = variant === 'primary' ? 'dtl-btn-primary' : 'dtl-btn-ghost';
  return (
    <a href={product.affiliateUrl} target="_blank" rel="nofollow sponsored noopener noreferrer"
       className={`inline-flex items-center gap-2 font-heading active:scale-[0.97] ${cls} ${className}`}>
      {label || 'Apsilankyti'}<ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
}

function FeatureIcon({ value }: { value: boolean | string }) {
  if (value === true) return <div className="w-5 h-5 rounded-full bg-[hsl(var(--dtl-emerald-light))] flex items-center justify-center mx-auto"><Check className="w-3 h-3 text-[hsl(var(--dtl-emerald))]" /></div>;
  if (value === false) return <div className="w-5 h-5 rounded-full bg-[hsl(var(--dtl-bg-alt))] flex items-center justify-center mx-auto"><X className="w-3 h-3 text-[hsl(var(--dtl-text-muted))]" /></div>;
  return <span className="text-xs text-[hsl(var(--dtl-text-secondary))]">{value}</span>;
}

function PlatformBadges({ platforms }: { platforms: string[] }) {
  const icons: Record<string, typeof Monitor> = { Windows: Monitor, Mac: Laptop, Android: Smartphone, iOS: Smartphone };
  return (
    <div className="flex gap-1 flex-wrap">
      {platforms.slice(0, 4).map(p => {
        const Icon = icons[p] || Globe;
        return (
          <span key={p} className="inline-flex items-center gap-1 text-[10px] text-[hsl(var(--dtl-text-muted))] bg-[hsl(var(--dtl-bg-alt))] border border-[hsl(var(--dtl-border))] rounded-md px-1.5 py-0.5">
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
    <div id={id} className="flex items-center gap-3 mb-6 scroll-mt-24">
      <div className="w-10 h-10 rounded-xl bg-[hsl(var(--dtl-teal-light))] flex items-center justify-center shrink-0 dtl-pulse">
        <Icon className="w-5 h-5 text-[hsl(var(--dtl-teal))]" />
      </div>
      <div>
        <h2 className="font-heading text-xl md:text-2xl font-extrabold text-[hsl(var(--dtl-text))] tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-[hsl(var(--dtl-text-muted))]">{subtitle}</p>}
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-[hsl(var(--dtl-border))] to-transparent ml-3 hidden md:block" />
    </div>
  );
}

/* ═══════════ STATIC DATA ═══════════ */

const jumpLinks = [
  { href: '#top-picks', label: 'Top pasirinkimai', icon: Crosshair },
  { href: '#palyginimas', label: 'Palyginimas', icon: BarChart3 },
  { href: '#pagal-poreiki', label: 'Pagal poreikį', icon: Layers },
  { href: '#apzvalgos', label: 'Apžvalgos', icon: Eye },
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
  { icon: Award, title: 'Geriausia visapusiška apsauga', why: 'Plačiausias funkcijų rinkinys su neribotu VPN ir tamsiojo interneto stebėjimu.', matchKey: 'Norton', tag: 'TOP' },
  { icon: Zap, title: 'Geriausia nemokama', why: 'Stipriausias grėsmių aptikimas tarp nemokamų alternatyvų.', matchKey: 'Avast', tag: 'FREE' },
  { icon: Users, title: 'Geriausia šeimoms', why: 'Iki 5–15 įrenginių viena licencija su pilna tėvų kontrole.', matchKey: 'Norton', tag: 'FAMILY' },
  { icon: Smartphone, title: 'Geriausia telefonui', why: 'Mažiausias poveikis baterijai išlaikant stiprią apsaugą.', matchKey: 'Bitdefender', tag: 'MOBILE' },
  { icon: Monitor, title: 'Geriausia Windows', why: 'Debesijos skenavimas su žaidimų režimu.', matchKey: 'Bitdefender', tag: 'WIN' },
  { icon: Heart, title: 'Pradedantiesiems', why: 'Instaliuojama per 3 min, veikia automatiškai.', matchKey: 'Norton', tag: 'EASY' },
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

type FilterKey = 'all' | 'free' | 'family' | 'mobile' | 'windows' | 'beginners';
const filterOptions: { key: FilterKey; label: string; icon: typeof BarChart3 }[] = [
  { key: 'all', label: 'Visos', icon: BarChart3 },
  { key: 'free', label: 'Nemokamos', icon: Zap },
  { key: 'family', label: 'Šeimoms', icon: Users },
  { key: 'mobile', label: 'Telefonui', icon: Smartphone },
  { key: 'windows', label: 'Windows', icon: Monitor },
];

const methodologyCriteria = [
  { title: 'Apsaugos efektyvumas', desc: 'Kenkėjiškų programų aptikimas, zero-day grėsmės, real-time apsauga.', icon: Shield, color: 'teal' },
  { title: 'Sistemos našumas', desc: 'Procesoriaus apkrova, paleisties laikas, baterijos suvartojimas.', icon: Gauge, color: 'cyan' },
  { title: 'Papildomos funkcijos', desc: 'VPN, slaptažodžių tvarkyklė, tėvų kontrolė, firewall.', icon: Layers, color: 'emerald' },
  { title: 'Kaina ir vertė', desc: 'Pirmo metų kaina, įrenginių skaičius, akcijos.', icon: BarChart3, color: 'amber' },
  { title: 'Naudojimo paprastumas', desc: 'Diegimas, sąsaja, pranešimų valdymas.', icon: Heart, color: 'teal' },
  { title: 'Įrenginių palaikymas', desc: 'Windows, Mac, Android, iOS, centralizuotas valdymas.', icon: Globe, color: 'cyan' },
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
  const [activeUseCase, setActiveUseCase] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'all') return products;
    if (activeFilter === 'free') return products.filter(p => p.freeVersion);
    if (activeFilter === 'family') return products.filter(p => p.features['Tėvų kontrolė'] === true);
    if (activeFilter === 'mobile') return products.filter(p => p.features['Telefonų apsauga'] === true || p.supportedPlatforms.some(pl => pl === 'Android' || pl === 'iOS'));
    if (activeFilter === 'windows') return products.filter(p => p.supportedPlatforms.some(pl => pl === 'Windows'));
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

  const activeUseCaseData = useCases[activeUseCase];
  const activeUseCaseProduct = activeUseCaseData ? findProduct(activeUseCaseData.matchKey) : null;

  return (
    <PageLayout>
      <div className="dtl min-h-screen -mt-px">

        {/* ═══ STICKY DECISION BAR ═══ */}
        <div className={`fixed top-16 left-0 right-0 z-40 transition-all duration-300 ${showStickyBar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
          <div className="dtl-sticky-bar">
            <div className="container flex items-center gap-2 py-2 overflow-x-auto">
              <Shield className="w-4 h-4 text-[hsl(var(--dtl-teal))] shrink-0" />
              <span className="text-xs font-heading font-bold text-[hsl(var(--dtl-text))] shrink-0 hidden sm:inline">Antivirusinės 2025</span>
              <div className="h-4 w-px bg-[hsl(var(--dtl-border))] shrink-0 hidden sm:block" />
              {jumpLinks.map(link => (
                <a key={link.href} href={link.href}
                   className="text-[11px] font-heading font-semibold px-2.5 py-1.5 rounded-lg text-[hsl(var(--dtl-text-secondary))] hover:text-[hsl(var(--dtl-teal))] hover:bg-[hsl(var(--dtl-teal-light))] transition-all whitespace-nowrap shrink-0">
                  {link.label}
                </a>
              ))}
              {bestOverall && (
                <a href={bestOverall.affiliateUrl || '#top-picks'} target={bestOverall.affiliateUrl ? '_blank' : undefined}
                   rel={bestOverall.affiliateUrl ? 'nofollow sponsored noopener noreferrer' : undefined}
                   className="dtl-btn-primary text-[11px] px-3 py-1.5 rounded-lg ml-auto shrink-0 inline-flex items-center gap-1.5 font-heading">
                  #1 {bestOverall.name}<ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="dtl-grid">
          <div className="container py-8">
            <Breadcrumbs path={category.path} items={[
              { label: 'Pradžia', path: '/' },
              { label: 'Antivirusinės programos', path: '/antivirusines-programos' },
            ]} />

            {/* ═══ HERO ═══ */}
            <ScrollReveal>
              <section ref={heroRef} className="relative rounded-2xl overflow-hidden dtl-card dtl-card-featured dtl-scanline mb-8">
                <div className="relative z-10 p-6 md:p-10">
                  <div className="max-w-3xl">
                    {/* Status */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4">
                      <span className="dtl-badge rounded-full px-3 py-1 text-[11px] font-heading font-bold uppercase tracking-[0.12em] inline-flex items-center gap-1.5">
                        <Activity className="w-3 h-3" />Palyginimas
                      </span>
                      <span className="text-[11px] text-[hsl(var(--dtl-text-muted))] dtl-mono flex items-center gap-1"><Clock className="w-3 h-3" />Atnaujinta: {updatedLabel}</span>
                      <span className="text-[11px] text-[hsl(var(--dtl-text-muted))] flex items-center gap-1"><Lock className="w-3 h-3" />Affiliate</span>
                    </div>

                    <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.08] mb-4">
                      <span className="text-[hsl(var(--dtl-text))]">Geriausios antivirusinės</span>
                      <br />
                      <span className="text-[hsl(var(--dtl-text))]">programos </span>
                      <span className="dtl-gradient-text">2025&nbsp;m.</span>
                    </h1>

                    <p className="text-[hsl(var(--dtl-text-secondary))] text-base md:text-lg leading-relaxed max-w-2xl mb-5">
                      Išanalizavome populiariausias antivirusines pagal apsaugą, greitį, funkcijas ir kainą — kad galėtumėte pasirinkti per kelias minutes.
                    </p>

                    {/* Quick winner badges */}
                    {products.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {bestOverall && (
                          <a href="#top-picks" className="dtl-badge-amber rounded-lg px-3 py-2 text-xs font-heading font-bold inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Award className="w-3.5 h-3.5" />#1 {bestOverall.name}
                          </a>
                        )}
                        {bestFree && (
                          <a href="#top-picks" className="dtl-badge-emerald rounded-lg px-3 py-2 text-xs font-heading font-bold inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Zap className="w-3.5 h-3.5" />Nemokama: {bestFree.name}
                          </a>
                        )}
                        {bestFamily && bestFamily !== bestOverall && (
                          <a href="#pagal-poreiki" className="dtl-badge rounded-lg px-3 py-2 text-xs font-heading font-bold inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
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
                             className="text-[11px] font-heading font-semibold px-3 py-1.5 rounded-lg bg-[hsl(var(--dtl-bg-alt))] text-[hsl(var(--dtl-text-secondary))] border border-[hsl(var(--dtl-border))] hover:border-[hsl(var(--dtl-teal))] hover:text-[hsl(var(--dtl-teal))] transition-all inline-flex items-center gap-1.5">
                            <Icon className="w-3 h-3" />{link.label}
                          </a>
                        );
                      })}
                    </nav>
                  </div>
                </div>
              </section>
            </ScrollReveal>

            {/* ═══ TRUST STRIP ═══ */}
            <ScrollReveal>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
                {[
                  { icon: ScanLine, value: `${products.length}`, label: 'Programos palygintos' },
                  { icon: Fingerprint, value: `${featureCols.length + 2}`, label: 'Vertinimo kriterijai' },
                  { icon: Cpu, value: '4', label: 'Platformos palaikomos' },
                  { icon: BadgeCheck, value: '✓', label: 'Nepriklausoma redakcija' },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="dtl-stat p-4 text-center">
                      <Icon className="w-4 h-4 text-[hsl(var(--dtl-teal))] mx-auto mb-2" />
                      <p className="font-heading font-black text-xl text-[hsl(var(--dtl-text))] dtl-mono">{s.value}</p>
                      <p className="text-[10px] text-[hsl(var(--dtl-text-muted))] font-heading mt-0.5">{s.label}</p>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>

            {/* ═══ TOP PICKS ═══ */}
            {topPicks.length > 0 && (
              <section className="mb-12 scroll-mt-24">
                <ScrollReveal>
                  <SectionHeader icon={Crosshair} title="Mūsų pasirinkimai" subtitle="Greita santrauka — detalesnės apžvalgos žemiau." id="top-picks" />
                </ScrollReveal>

                <div className="space-y-3">
                  {topPicks.map((product, i) => (
                    <ScrollReveal key={product.id} delay={i * 60}>
                      <div className={`dtl-card p-5 md:p-6 relative ${i === 0 ? 'dtl-card-featured dtl-corners' : ''}`}>
                        {/* Rank */}
                        <div className="absolute -top-px -left-px">
                          <div className={`rounded-br-xl rounded-tl-2xl px-3 py-1.5 text-[10px] font-heading font-black uppercase tracking-[0.15em] dtl-mono ${i === 0 ? 'bg-[hsl(var(--dtl-amber-light))] text-[hsl(var(--dtl-amber))]' : 'bg-[hsl(var(--dtl-bg-alt))] text-[hsl(var(--dtl-text-muted))]'}`}>
                            #{i + 1}
                          </div>
                        </div>

                        <div className="flex items-start gap-4 pt-2">
                          <ProductLogo product={product} size={48} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap mb-1.5">
                              <h3 className="font-heading font-extrabold text-[hsl(var(--dtl-text))] text-lg">{product.name}</h3>
                              <RatingBar rating={product.rating} />
                              <span className="text-xs text-[hsl(var(--dtl-text-muted))] dtl-mono">{product.pricingSummary}</span>
                              {product.freeVersion && <span className="dtl-badge-emerald text-[10px] font-bold px-2 py-0.5 rounded-md dtl-mono uppercase tracking-wider">Free</span>}
                            </div>
                            <p className="text-xs text-[hsl(var(--dtl-text-secondary))] mb-3">{product.bestFor}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                              {product.pros.slice(0, 3).map((p, j) => (
                                <span key={j} className="inline-flex items-center gap-1.5 text-[11px] text-[hsl(var(--dtl-text-secondary))]">
                                  <CheckCircle2 className="w-3 h-3 text-[hsl(var(--dtl-emerald))] shrink-0" />{p}
                                </span>
                              ))}
                              {product.cons.slice(0, 2).map((c, j) => (
                                <span key={j} className="inline-flex items-center gap-1.5 text-[11px] text-[hsl(var(--dtl-text-muted))]">
                                  <XCircle className="w-3 h-3 text-[hsl(var(--dtl-red))]/50 shrink-0" />{c}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="shrink-0 hidden sm:block">
                            <CTAButton product={product} variant={i === 0 ? 'primary' : 'ghost'} className="px-5 py-2.5 text-sm rounded-xl" />
                          </div>
                        </div>
                        <div className="sm:hidden mt-4">
                          <CTAButton product={product} variant={i === 0 ? 'primary' : 'ghost'} className="px-4 py-2.5 text-xs w-full justify-center rounded-xl" />
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </section>
            )}

            {/* ═══ COMPARISON TABLE ═══ */}
            {products.length > 0 && (
              <section className="mb-12 scroll-mt-24">
                <ScrollReveal>
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
                    <SectionHeader icon={BarChart3} title="Palyginimo lentelė" subtitle="Visos funkcijos ir kainos vienoje vietoje." id="palyginimas" />
                    <div className="flex gap-1.5 mb-6 flex-wrap">
                      {filterOptions.map(opt => {
                        const Icon = opt.icon;
                        const active = activeFilter === opt.key;
                        return (
                          <button key={opt.key} onClick={() => setActiveFilter(opt.key)}
                                  className={`text-[11px] font-heading font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-all ${active ? 'dtl-btn-primary' : 'bg-[hsl(var(--dtl-surface))] text-[hsl(var(--dtl-text-secondary))] border border-[hsl(var(--dtl-border))] hover:border-[hsl(var(--dtl-teal))]'}`}>
                            <Icon className="w-3 h-3" />{opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </ScrollReveal>

                {filteredProducts.length === 0 && (
                  <p className="text-sm text-[hsl(var(--dtl-text-muted))] text-center py-8 dtl-mono">Nėra produktų pagal filtrą</p>
                )}

                {filteredProducts.length > 0 && (
                  <ScrollReveal>
                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto rounded-2xl dtl-card overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="dtl-table-head">
                            <th className="text-left p-4 font-heading font-bold text-[hsl(var(--dtl-text))] text-[11px] uppercase tracking-wider">Programa</th>
                            <th className="text-center p-4 font-heading font-bold text-[hsl(var(--dtl-text))] text-[11px] uppercase tracking-wider">Reit.</th>
                            <th className="text-center p-4 font-heading font-bold text-[hsl(var(--dtl-text))] text-[11px] uppercase tracking-wider">Kaina</th>
                            <th className="text-center p-4 font-heading font-bold text-[hsl(var(--dtl-text))] text-[11px] uppercase tracking-wider">Free</th>
                            <th className="text-center p-4 font-heading font-bold text-[hsl(var(--dtl-text))] text-[11px] uppercase tracking-wider">Trial</th>
                            {featureCols.map(col => (
                              <th key={col.key} className="text-center p-4 font-heading font-bold text-[hsl(var(--dtl-text))] text-[11px] uppercase tracking-wider whitespace-nowrap">{col.label}</th>
                            ))}
                            <th className="text-center p-4 font-heading font-bold text-[hsl(var(--dtl-text))] text-[11px] uppercase tracking-wider">Platf.</th>
                            <th className="p-4" />
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((product) => (
                            <tr key={product.id} className="dtl-table-row">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <ProductLogo product={product} size={28} />
                                  <span className="font-heading font-bold text-[hsl(var(--dtl-text))] text-sm">{product.name}</span>
                                </div>
                              </td>
                              <td className="p-4 text-center"><RatingBar rating={product.rating} /></td>
                              <td className="p-4 text-center text-[hsl(var(--dtl-text-secondary))] whitespace-nowrap text-xs dtl-mono">{product.pricingSummary}</td>
                              <td className="p-4 text-center"><FeatureIcon value={product.freeVersion} /></td>
                              <td className="p-4 text-center"><FeatureIcon value={product.trialAvailable} /></td>
                              {featureCols.map(col => (
                                <td key={col.key} className="p-4 text-center"><FeatureIcon value={product.features[col.key] ?? false} /></td>
                              ))}
                              <td className="p-4 text-center"><span className="text-xs text-[hsl(var(--dtl-text-secondary))] dtl-mono">{product.supportedPlatforms.length}</span></td>
                              <td className="p-4"><CTAButton product={product} variant="ghost" className="px-3 py-1.5 text-[11px] whitespace-nowrap rounded-lg" /></td>
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
                          <div key={product.id} className="rounded-2xl dtl-card overflow-hidden">
                            <button onClick={() => setExpandedRow(isExpanded ? null : product.id)} className="w-full p-4 flex items-center gap-3 text-left">
                              <ProductLogo product={product} size={32} />
                              <div className="flex-1 min-w-0">
                                <p className="font-heading font-bold text-[hsl(var(--dtl-text))] text-sm">{product.name}</p>
                                <p className="text-[11px] text-[hsl(var(--dtl-text-muted))] dtl-mono">{product.pricingSummary}</p>
                              </div>
                              <RatingBar rating={product.rating} />
                              <ChevronDown className={`w-4 h-4 text-[hsl(var(--dtl-text-muted))] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                            {isExpanded && (
                              <div className="px-4 pb-4 pt-1 border-t border-[hsl(var(--dtl-border))] space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex items-center gap-1.5 text-xs"><FeatureIcon value={product.freeVersion} /><span className="text-[hsl(var(--dtl-text-secondary))]">Free</span></div>
                                  <div className="flex items-center gap-1.5 text-xs"><FeatureIcon value={product.trialAvailable} /><span className="text-[hsl(var(--dtl-text-secondary))]">Trial</span></div>
                                  {featureCols.map(col => (
                                    <div key={col.key} className="flex items-center gap-1.5 text-xs">
                                      <FeatureIcon value={product.features[col.key] ?? false} /><span className="text-[hsl(var(--dtl-text-secondary))]">{col.label}</span>
                                    </div>
                                  ))}
                                </div>
                                {product.supportedPlatforms.length > 0 && <PlatformBadges platforms={product.supportedPlatforms} />}
                                <CTAButton product={product} className="px-4 py-2.5 text-xs w-full justify-center rounded-xl" label="Gauti pasiūlymą" />
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

            {/* ═══ USE CASE SELECTOR ═══ */}
            <section className="mb-12 scroll-mt-24">
              <ScrollReveal>
                <SectionHeader icon={Layers} title="Geriausia pagal poreikį" subtitle="Pasirinkite savo situaciją." id="pagal-poreiki" />
              </ScrollReveal>

              <ScrollReveal>
                <div className="dtl-card p-6 md:p-8">
                  {/* Tabs */}
                  <div className="flex flex-wrap gap-1.5 mb-6 pb-5 border-b border-[hsl(var(--dtl-border))]">
                    {useCases.map((uc, idx) => {
                      const Icon = uc.icon;
                      const isActive = idx === activeUseCase;
                      return (
                        <button key={idx} onClick={() => setActiveUseCase(idx)}
                                className={`text-xs font-heading font-bold px-3 py-2 rounded-lg inline-flex items-center gap-1.5 transition-all ${isActive ? 'dtl-btn-primary' : 'text-[hsl(var(--dtl-text-secondary))] hover:bg-[hsl(var(--dtl-bg-alt))]'}`}>
                          <Icon className="w-3.5 h-3.5" />{uc.title}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active use case content */}
                  {activeUseCaseData && (
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="flex-1">
                        <div className="inline-flex items-center gap-2 mb-3">
                          <span className="dtl-badge text-[10px] font-heading font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-md dtl-mono">{activeUseCaseData.tag}</span>
                          <h3 className="font-heading font-extrabold text-lg text-[hsl(var(--dtl-text))]">{activeUseCaseData.title}</h3>
                        </div>
                        <p className="text-sm text-[hsl(var(--dtl-text-secondary))] leading-relaxed mb-4">{activeUseCaseData.why}</p>

                        {activeUseCaseProduct && (
                          <div className="flex items-center gap-4 p-4 rounded-xl bg-[hsl(var(--dtl-bg-alt))] border border-[hsl(var(--dtl-border))]">
                            <ProductLogo product={activeUseCaseProduct} size={44} />
                            <div className="flex-1 min-w-0">
                              <p className="font-heading font-bold text-[hsl(var(--dtl-text))]">{activeUseCaseProduct.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <RatingBar rating={activeUseCaseProduct.rating} />
                                <span className="text-xs text-[hsl(var(--dtl-text-muted))] dtl-mono">{activeUseCaseProduct.pricingSummary}</span>
                              </div>
                            </div>
                            <CTAButton product={activeUseCaseProduct} className="px-4 py-2 text-xs rounded-lg hidden sm:inline-flex" />
                          </div>
                        )}
                        {activeUseCaseProduct && (
                          <div className="sm:hidden mt-3">
                            <CTAButton product={activeUseCaseProduct} className="px-4 py-2.5 text-xs w-full justify-center rounded-xl" />
                          </div>
                        )}
                      </div>

                      {/* Quick features */}
                      {activeUseCaseProduct && (
                        <div className="w-full md:w-64 shrink-0">
                          <p className="text-[10px] font-heading font-bold text-[hsl(var(--dtl-text-muted))] uppercase tracking-wider mb-2">Privalumai</p>
                          <ul className="space-y-1.5">
                            {activeUseCaseProduct.pros.slice(0, 4).map((p, j) => (
                              <li key={j} className="flex items-start gap-2 text-xs text-[hsl(var(--dtl-text-secondary))]">
                                <CheckCircle2 className="w-3 h-3 text-[hsl(var(--dtl-emerald))] mt-0.5 shrink-0" />{p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </section>

            {/* ═══ METHODOLOGY ═══ */}
            <section className="mb-12">
              <ScrollReveal>
                <SectionHeader icon={Fingerprint} title="Kaip vertiname" subtitle="Mūsų vertinimo sistema" />
              </ScrollReveal>
              <ScrollReveal>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {methodologyCriteria.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="dtl-method-node p-5 text-center group">
                        <div className="w-10 h-10 rounded-xl bg-[hsl(var(--dtl-teal-light))] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                          <Icon className="w-5 h-5 text-[hsl(var(--dtl-teal))]" />
                        </div>
                        <p className="font-heading font-bold text-sm text-[hsl(var(--dtl-text))] mb-1">{item.title}</p>
                        <p className="text-[11px] text-[hsl(var(--dtl-text-muted))] leading-relaxed">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 rounded-xl bg-[hsl(var(--dtl-surface))] border border-[hsl(var(--dtl-border))] p-4 max-w-xl">
                  <p className="text-[11px] text-[hsl(var(--dtl-text-muted))]">
                    <Shield className="w-3 h-3 inline mr-1 text-[hsl(var(--dtl-teal))]" />
                    Redakcija nepriklausoma. Affiliate partnerystės neįtakoja vertinimų ir rekomendacijų.
                  </p>
                </div>
              </ScrollReveal>
            </section>

            {/* ═══ REVIEWS (collapsible) ═══ */}
            {products.length > 0 && (
              <section className="mb-12 scroll-mt-24">
                <ScrollReveal>
                  <SectionHeader icon={Eye} title="Individualios apžvalgos" subtitle="Spauskite ant programos — detalesnė apžvalga." id="apzvalgos" />
                </ScrollReveal>

                <div className="space-y-2.5">
                  {products.map((product, i) => {
                    const editorial = getEditorial(product);
                    const isOpen = expandedReview === product.id;
                    const anchorId = product.brand.toLowerCase() || product.slug;

                    return (
                      <ScrollReveal key={product.id} delay={i * 40}>
                        <div id={anchorId} className={`rounded-2xl dtl-card overflow-hidden scroll-mt-24 ${isOpen ? 'dtl-card-featured' : ''}`}>
                          <button
                            onClick={() => setExpandedReview(isOpen ? null : product.id)}
                            className="w-full p-4 md:p-5 flex items-center gap-3 text-left hover:bg-[hsl(var(--dtl-surface-hover))] transition-colors"
                          >
                            <div className="shrink-0 w-8 h-8 rounded-lg bg-[hsl(var(--dtl-bg-alt))] flex items-center justify-center">
                              <span className="font-heading font-black text-[hsl(var(--dtl-teal))] text-xs dtl-mono">#{i + 1}</span>
                            </div>
                            <ProductLogo product={product} size={40} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-heading font-bold text-[hsl(var(--dtl-text))] text-base">{product.name}</h3>
                                <RatingBar rating={product.rating} />
                              </div>
                              <p className="text-xs text-[hsl(var(--dtl-text-muted))] mt-0.5">{product.bestFor}</p>
                            </div>
                            <div className="hidden sm:flex items-center gap-3 shrink-0">
                              <span className="text-sm font-heading font-bold text-[hsl(var(--dtl-text))] dtl-mono">{product.pricingSummary}</span>
                              <CTAButton product={product} variant="ghost" className="px-3 py-1.5 text-xs rounded-lg" />
                            </div>
                            <ChevronDown className={`w-4 h-4 text-[hsl(var(--dtl-text-muted))] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {isOpen && (
                            <div className="px-5 pb-6 pt-3 border-t border-[hsl(var(--dtl-border))]">
                              {/* Specs */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
                                {[
                                  { label: 'Kaina', value: product.pricingSummary },
                                  { label: 'Platformos', value: String(product.supportedPlatforms.length) },
                                  { label: 'Nemokama', value: product.freeVersion ? 'TAIP' : 'NE' },
                                  { label: 'Bandomoji', value: product.trialAvailable ? 'TAIP' : 'NE' },
                                ].map((spec, si) => (
                                  <div key={si} className="dtl-stat p-3 text-center">
                                    <p className="text-[9px] text-[hsl(var(--dtl-text-muted))] font-heading uppercase tracking-[0.15em] mb-1">{spec.label}</p>
                                    <p className="text-xs font-heading font-black text-[hsl(var(--dtl-text))] dtl-mono">{spec.value}</p>
                                  </div>
                                ))}
                              </div>

                              {/* Pros / Cons */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                                {product.pros.length > 0 && (
                                  <div className="rounded-xl bg-[hsl(var(--dtl-emerald-light))] border border-[hsla(160,55%,42%,0.15)] p-4">
                                    <h4 className="flex items-center gap-1.5 font-heading font-bold text-[hsl(var(--dtl-emerald))] text-xs mb-2.5 uppercase tracking-wider">
                                      <ThumbsUp className="w-3 h-3" />Privalumai
                                    </h4>
                                    <ul className="space-y-1.5">
                                      {product.pros.map((pro, j) => (
                                        <li key={j} className="flex items-start gap-2 text-xs text-[hsl(var(--dtl-text-secondary))]">
                                          <CheckCircle2 className="w-3 h-3 text-[hsl(var(--dtl-emerald))] mt-0.5 shrink-0" />{pro}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {product.cons.length > 0 && (
                                  <div className="rounded-xl bg-[hsl(var(--dtl-red-light))] border border-[hsla(0,65%,52%,0.12)] p-4">
                                    <h4 className="flex items-center gap-1.5 font-heading font-bold text-[hsl(var(--dtl-red))] text-xs mb-2.5 uppercase tracking-wider">
                                      <ThumbsDown className="w-3 h-3" />Trūkumai
                                    </h4>
                                    <ul className="space-y-1.5">
                                      {product.cons.map((con, j) => (
                                        <li key={j} className="flex items-start gap-2 text-xs text-[hsl(var(--dtl-text-secondary))]">
                                          <XCircle className="w-3 h-3 text-[hsl(var(--dtl-red))]/60 mt-0.5 shrink-0" />{con}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>

                              {editorial && (
                                <div className="space-y-2.5 mb-5">
                                  <p className="text-sm text-[hsl(var(--dtl-text-secondary))] leading-relaxed">{editorial.summary}</p>
                                  <p className="text-sm text-[hsl(var(--dtl-text-secondary))] leading-relaxed">{editorial.strengths}</p>
                                </div>
                              )}

                              {/* Features */}
                              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-5">
                                {featureCols.map(col => {
                                  const val = product.features[col.key];
                                  return (
                                    <span key={col.key} className="inline-flex items-center gap-1.5 text-xs text-[hsl(var(--dtl-text-secondary))]">
                                      {val === true ? <Check className="w-3.5 h-3.5 text-[hsl(var(--dtl-emerald))]" /> : <X className="w-3.5 h-3.5 text-[hsl(var(--dtl-text-muted))]" />}
                                      {col.label}
                                    </span>
                                  );
                                })}
                              </div>

                              {/* Verdict */}
                              <div className="rounded-xl bg-[hsl(var(--dtl-teal-light))] border border-[hsla(175,65%,38%,0.15)] p-4 mb-5 dtl-corners">
                                <p className="text-xs text-[hsl(var(--dtl-text-secondary))] leading-relaxed">
                                  <strong className="text-[hsl(var(--dtl-teal))] dtl-mono uppercase tracking-wider text-[10px]">Verdiktas: </strong>
                                  {editorial?.verdict || product.verdict || product.shortDescription}
                                </p>
                              </div>

                              <div className="flex items-center gap-3">
                                <CTAButton product={product} className="px-6 py-2.5 text-sm rounded-xl" label="Gauti pasiūlymą" />
                                <span className="text-xs text-[hsl(var(--dtl-text-muted))] dtl-mono">nuo {product.pricingSummary}</span>
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
            <section className="mb-12">
              <ScrollReveal>
                <div className="dtl-card p-6 md:p-8">
                  <h2 className="font-heading text-xl font-extrabold text-[hsl(var(--dtl-text))] mb-6 flex items-center gap-3">
                    <Zap className="w-5 h-5 text-[hsl(var(--dtl-amber))]" />
                    Nemokama ar mokama?
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="rounded-xl bg-[hsl(var(--dtl-bg-alt))] border border-[hsl(var(--dtl-border))] p-5">
                      <h3 className="font-heading font-bold text-[hsl(var(--dtl-text))] text-sm mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[hsl(var(--dtl-text-muted))]" />NEMOKAMA
                        <span className="dtl-badge-emerald text-[9px] font-black px-2 py-0.5 rounded-md dtl-mono ml-auto">0 €</span>
                      </h3>
                      <ul className="space-y-2 text-xs text-[hsl(var(--dtl-text-secondary))]">
                        {[
                          { good: true, t: 'Bazinė apsauga nuo virusų' },
                          { good: true, t: 'Pakankama vienam įrenginiui' },
                          { good: false, t: 'Nėra VPN, slaptažodžių, tėvų kontrolės' },
                          { good: false, t: 'Ribota pagalba' },
                        ].map((it, j) => (
                          <li key={j} className="flex items-start gap-2">
                            {it.good ? <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--dtl-emerald))] mt-0.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-[hsl(var(--dtl-red))]/50 mt-0.5 shrink-0" />}
                            {it.t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl bg-[hsl(var(--dtl-teal-light))] border border-[hsla(175,65%,38%,0.2)] p-5">
                      <h3 className="font-heading font-bold text-[hsl(var(--dtl-text))] text-sm mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[hsl(var(--dtl-teal))]" />MOKAMA
                        <span className="dtl-badge text-[9px] font-black px-2 py-0.5 rounded-md dtl-mono ml-auto">20–60 €/m.</span>
                      </h3>
                      <ul className="space-y-2 text-xs text-[hsl(var(--dtl-text-secondary))]">
                        {[
                          { good: true, t: 'VPN, slaptažodžiai, tamsaus interneto stebėjimas' },
                          { good: true, t: 'Kelių įrenginių apsauga (3–15 įr.)' },
                          { good: true, t: 'Tėvų kontrolė ir šeimos funkcijos' },
                          { good: false, t: 'Metinis mokėjimas' },
                        ].map((it, j) => (
                          <li key={j} className="flex items-start gap-2">
                            {it.good ? <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--dtl-emerald))] mt-0.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-[hsl(var(--dtl-red))]/50 mt-0.5 shrink-0" />}
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
                            className="dtl-btn-ghost text-xs font-heading font-bold px-4 py-2 rounded-lg inline-flex items-center gap-1.5">
                        {link.label}<ChevronRight className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </section>

            {/* ═══ HOW TO CHOOSE ═══ */}
            <section className="mb-12 scroll-mt-24">
              <ScrollReveal>
                <SectionHeader icon={HelpCircle} title="Kaip pasirinkti?" id="kaip-pasirinkti" />
              </ScrollReveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {buyerGuide.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <ScrollReveal key={idx} delay={idx * 50}>
                      <div className="dtl-card p-5 h-full hover:border-[hsl(var(--dtl-teal))] transition-colors">
                        <h3 className="font-heading font-bold text-[hsl(var(--dtl-text))] text-sm mb-2 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[hsl(var(--dtl-teal-light))] flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-[hsl(var(--dtl-teal))]" />
                          </div>
                          {item.q}
                        </h3>
                        <p className="text-xs text-[hsl(var(--dtl-text-secondary))] leading-relaxed">{item.advice}</p>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
              <ScrollReveal>
                <div className="mt-4 rounded-xl bg-[hsl(var(--dtl-teal-light))] border border-[hsla(175,65%,38%,0.15)] p-4 max-w-2xl dtl-corners">
                  <p className="text-xs text-[hsl(var(--dtl-text-secondary))] leading-relaxed">
                    <strong className="text-[hsl(var(--dtl-teal))] dtl-mono uppercase tracking-wider text-[10px]">Taisyklė: </strong>
                    1 Windows kompiuteris + atsargus naršymas = Windows Defender gali pakakti. 2+ įrenginiai, telefonas ar šeima = investuokite ~3–5 €/mėn.
                  </p>
                </div>
              </ScrollReveal>
            </section>

            {/* ═══ FAQ ═══ */}
            <section id="duk" className="mb-12 scroll-mt-24">
              <ScrollReveal>
                <FAQAccordion items={category.faq.length > 0 ? category.faq : pillarFaq} title="Dažnai užduodami klausimai" />
              </ScrollReveal>
            </section>

            {/* ═══ ARTICLES ═══ */}
            {categoryArticles.length > 0 && (
              <section className="mb-12">
                <ScrollReveal>
                  <h2 className="font-heading text-xl font-extrabold text-[hsl(var(--dtl-text))] mb-5">Susiję straipsniai</h2>
                </ScrollReveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryArticles.map((a, idx) => (
                    <ScrollReveal key={a.path} delay={idx * 50}><ArticleCard article={a} /></ScrollReveal>
                  ))}
                </div>
              </section>
            )}

            {/* ═══ RELATED GUIDES ═══ */}
            <section className="mb-12">
              <ScrollReveal>
                <div className="dtl-card p-6">
                  <h2 className="font-heading text-lg font-extrabold text-[hsl(var(--dtl-text))] mb-5">Kiti naudingi gidai</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {relatedGuides.map(guide => {
                      const Icon = guide.icon;
                      return (
                        <Link key={guide.path} to={guide.path}
                              className="flex items-center gap-3 rounded-xl p-3.5 bg-[hsl(var(--dtl-bg-alt))] border border-[hsl(var(--dtl-border))] hover:border-[hsl(var(--dtl-teal))] transition-all group">
                          <div className="w-9 h-9 rounded-lg bg-[hsl(var(--dtl-teal-light))] flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-[hsl(var(--dtl-teal))]" />
                          </div>
                          <div>
                            <span className="text-sm text-[hsl(var(--dtl-text))] font-medium group-hover:text-[hsl(var(--dtl-teal))] transition-colors">{guide.label}</span>
                            <p className="text-[11px] text-[hsl(var(--dtl-text-muted))]">{guide.desc}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[hsl(var(--dtl-text-muted))] ml-auto shrink-0 group-hover:text-[hsl(var(--dtl-teal))] group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>
            </section>

            {/* Disclosure */}
            <ScrollReveal>
              <div className="mb-8 p-4 rounded-xl bg-[hsl(var(--dtl-surface))] border border-[hsl(var(--dtl-border))] max-w-2xl">
                <p className="text-[11px] text-[hsl(var(--dtl-text-muted))] leading-relaxed">
                  <Lock className="w-3 h-3 inline mr-1" />
                  <strong>Affiliate atskleidimas:</strong> Kai kurios nuorodos šiame puslapyje yra affiliate nuorodos. Jei įsigyjate produktą per mūsų nuorodą, galime gauti komisiją. Tai neturi įtakos mūsų vertinimams ar rekomendacijoms.
                </p>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AntivirusLandingPage;
