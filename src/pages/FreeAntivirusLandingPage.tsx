import {
  Star, Shield, Smartphone, Monitor, ChevronRight, CheckCircle2, XCircle,
  Clock, BarChart3, Layers, Award, Heart, Zap, Lock, ChevronDown,
  Check, X, Laptop, Globe, ShieldCheck, HelpCircle, BadgeCheck, ArrowRight,
} from 'lucide-react';
import PageLayout from '@/components/site/PageLayout';
import Breadcrumbs from '@/components/site/Breadcrumbs';
import FAQAccordion from '@/components/content/FAQAccordion';
import TrustDisclosure from '@/components/content/TrustDisclosure';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useComparisonProducts, usePublicArticle, type PublicProduct } from '@/hooks/usePublicData';
import type { PublicCategory } from '@/types/content';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ProductLogo, RatingStars, AffiliateButton, FeatureCheck, PlatformTags, SectionHeading, LandingFeatureImage, useUpdatedLabel } from '@/components/landing/LandingShared';
import LandingHeroBackground from '@/components/site/LandingHeroBackground';

interface Props { category: PublicCategory }

/* ── Jump links ── */
const jumpLinks = [
  { href: '#top-5', label: 'Top 5', icon: Award },
  { href: '#palyginimas', label: 'Palyginimas', icon: BarChart3 },
  { href: '#kam-tinka', label: 'Kam tinka', icon: Layers },
  { href: '#mokama-vs-nemokama', label: 'Mokama vs nemokama', icon: Zap },
  { href: '#kaip-pasirinkti', label: 'Kaip pasirinkti', icon: Shield },
  { href: '#duk', label: 'DUK', icon: HelpCircle },
];

/* ── Feature columns for comparison ── */
const featureCols = [
  { key: 'Realaus laiko apsauga', label: 'Realaus laiko aps.' },
  { key: 'Išpirkos apsauga', label: 'Išpirkos aps.' },
  { key: 'El. pašto apsauga', label: 'El. pašto aps.' },
  { key: 'Ugniasienė', label: 'Ugniasienė' },
  { key: 'VPN', label: 'VPN' },
  { key: 'Slaptažodžių tvarkyklė', label: 'Slaptažodžiai' },
  { key: 'Wi-Fi inspektorius', label: 'Wi-Fi insp.' },
  { key: 'Sandbox', label: 'Sandbox' },
  { key: 'Naršyklės apsauga', label: 'Naršyklės aps.' },
  { key: 'Dark web stebėjimas', label: 'Dark web' },
];

/* ── Use cases ── */
interface UseCaseBlock { icon: typeof Shield; title: string; shortWhy: string; matchKey: string; tag: string }
const useCases: UseCaseBlock[] = [
  { icon: Award, title: 'Geriausias bendras nemokamas', shortWhy: 'Plačiausias funkcijų rinkinys tarp nemokamų sprendimų: Wi-Fi inspektorius, Sandbox, realaus laiko apsauga ir puikūs laboratorijų rezultatai.', matchKey: 'Avast', tag: '🥇 Nr. 1' },
  { icon: Zap, title: 'Lengviausias ir tyliausias', shortWhy: 'Minimalus sistemos poveikis, tylus darbas fone ir aukščiausi laboratorijų apsaugos balai. „Nustatyk ir pamiršk" filosofija.', matchKey: 'Bitdefender', tag: 'Lengvas' },
  { icon: Layers, title: 'Daugiausiai papildomų įrankių', shortWhy: 'Nemokamas VPN, slaptažodžių tvarkyklė ir sistemos optimizavimas — daugiau nei bet kuris kitas nemokamas sprendimas.', matchKey: 'Avira', tag: 'Funkcijos' },
  { icon: Heart, title: 'Geriausias pradedantiesiems', shortWhy: 'Patogi sąsaja, įvairūs skenavimo režimai ir nemokama el. pašto apsauga — reta funkcija tarp nemokamų programų.', matchKey: 'AVG', tag: 'Lengva' },
  { icon: Shield, title: 'Jau integruotas Windows', shortWhy: 'Jokio diegimo nereikia — automatiškai veikia su Windows 10/11. Ugniasienė, SmartScreen ir bazinė apsauga iš karto.', matchKey: 'Microsoft', tag: 'Bazinis' },
];

/* ── Buyer guide ── */
const buyerGuide = [
  { q: 'Ar jums reikia apsaugos keliems įrenginiams?', a: 'Daugelis nemokamų antivirusinių leidžia diegti neribotam skaičiui įrenginių (Avast, AVG, Avira). Bitdefender Free veikia tik viename Windows įrenginyje.', icon: Layers },
  { q: 'Ar naudojate tik Windows?', a: 'Jei taip — Bitdefender Free ar Windows Defender yra puikus pasirinkimas. Jei turite Mac ar telefoną — rinkitės Avast ar Avira su daugelio platformų palaikymu.', icon: Monitor },
  { q: 'Ar norite VPN ar slaptažodžių tvarkyklės?', a: 'Avira Free yra vienintelė nemokama antivirusinė su VPN (500 MB/mėn.) ir slaptažodžių tvarkykle. Kitur šias funkcijas gausite tik mokamose versijose.', icon: Lock },
  { q: 'Ar jums svarbi minimali sistemos apkrova?', a: 'Bitdefender Free ir Windows Defender yra lengviausi sprendimai. Avast ir AVG gali šiek tiek labiau paveikti našumą skenavimo metu.', icon: Zap },
  { q: 'Ar reikia el. pašto apsaugos?', a: 'AVG Free siūlo nemokamą el. pašto apsaugą nuo kenkėjiškų priedų — tai reta funkcija tarp nemokamų antivirusinių. Avira taip pat turi bazinę el. pašto apsaugą.', icon: ShieldCheck },
  { q: 'Ar svarstote apie mokamą versiją ateityje?', a: 'Jei planuojate atnaujinti — geriau rinktis nemokamą versiją nuo gamintojo, kurio mokama versija jums tinka. Avast ir Bitdefender turi stipriausias mokamas versijas.', icon: BarChart3 },
];

/* ── Related guides ── */
const relatedGuides = [
  { path: '/antivirusines-programos', label: 'Geriausios antivirusinės programos', desc: 'Visų antivirusinių palyginimas — nemokamų ir mokamų', icon: Shield },
  { path: '/antivirusines-programos/telefonui', label: 'Antivirusinė telefonui', desc: 'Android ir iOS apsaugos gidas', icon: Smartphone },
  { path: '/antivirusines-programos/kompiuteriui', label: 'Antivirusinė kompiuteriui', desc: 'Windows ir Mac apsaugos palyginimas', icon: Monitor },
  { path: '/virusai/kompiuterinis-virusas', label: 'Kas yra kompiuterinis virusas?', desc: 'Virusų tipai ir kaip jie veikia', icon: ShieldCheck },
  { path: '/virusai/virusas-telefone', label: 'Kaip pašalinti virusą iš telefono', desc: 'Žingsnis po žingsnio gidas', icon: Smartphone },
];

/* ═══════════════════════════════════════════ */

const FreeAntivirusLandingPage = ({ category }: Props) => {
  usePageMeta({
    title: category.seoTitle || 'Geriausios nemokamos antivirusinės programos 2026 — Top 5 palyginimas',
    description: category.metaDescription || 'Nepriklausomas nemokamų antivirusinių programų palyginimas. Avast, Bitdefender Free, AVG, Avira ir Windows Defender — kurią pasirinkti?',
    canonicalUrl: category.canonicalUrl || undefined,
  });

  const { data: products = [] } = useComparisonProducts('antivirus');
  const top5 = products.slice(0, 5);
  const findProduct = (key: string) => products.find(p => p.name.includes(key) || p.brand.includes(key));

  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const updatedLabel = useUpdatedLabel();

  const bestOverall = products[0];
  const bestLightweight = products.find(p => p.brand === 'Bitdefender');
  const bestFeatures = products.find(p => p.brand === 'Avira');

  return (
    <PageLayout>
      <div className="container py-8 max-w-5xl mx-auto">
        <Breadcrumbs path={category.path} items={[
          { label: 'Pradžia', path: '/' },
          { label: 'Antivirusinės programos', path: '/antivirusines-programos' },
          { label: 'Nemokamos', path: '/antivirusines-programos/nemokamos' },
        ]} />

        {/* ═══ 1. HERO ═══ */}
        <LandingHeroBackground variant="security">

          <h1 className="font-heading text-3xl md:text-4xl lg:text-[2.85rem] font-extrabold text-foreground leading-[1.08] mb-3 tracking-tight">
            Geriausios nemokamos antivirusinės programos 2026&nbsp;m.
          </h1>
          <p className="text-muted-foreground text-[15px] leading-relaxed max-w-2xl mb-6">
            Nemokama nebūtinai reiškia prasta. Palyginome populiariausias nemokamas antivirusines programas pagal apsaugos efektyvumą, papildomas funkcijas ir sistemos poveikį. Žemiau&nbsp;— redakcijos Top&nbsp;5 ir detalus palyginimas.
          </p>

          {/* Quick winner badges */}
          {products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
              {bestOverall && (
                <a href="#top-5" className="card-premium-featured p-3.5 flex items-center gap-3 hover-lift group">
                  <ProductLogo product={bestOverall} size={32} />
                  <div className="min-w-0">
                    <span className="chip-primary mb-1">Geriausia nemokama 2026</span>
                    <span className="text-sm text-foreground font-semibold block leading-tight">{bestOverall.name}</span>
                    <span className="text-[11px] text-muted-foreground">{bestOverall.pricingSummary}</span>
                  </div>
                </a>
              )}
              {bestLightweight && (
                <a href="#top-5" className="card-premium p-3.5 flex items-center gap-3 hover-lift group">
                  <ProductLogo product={bestLightweight} size={32} />
                  <div className="min-w-0">
                    <span className="chip-muted mb-1">Lengviausia</span>
                    <span className="text-sm text-foreground font-semibold block leading-tight">{bestLightweight.name}</span>
                    <span className="text-[11px] text-muted-foreground">{bestLightweight.pricingSummary}</span>
                  </div>
                </a>
              )}
              {bestFeatures && (
                <a href="#top-5" className="card-premium p-3.5 flex items-center gap-3 hover-lift group">
                  <ProductLogo product={bestFeatures} size={32} />
                  <div className="min-w-0">
                    <span className="chip-success mb-1">Daugiausiai funkcijų</span>
                    <span className="text-sm text-foreground font-semibold block leading-tight">{bestFeatures.name}</span>
                    <span className="text-[11px] text-muted-foreground">{bestFeatures.pricingSummary}</span>
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
                   className="text-[11px] font-heading font-medium px-3 py-2 rounded-lg bg-card text-muted-foreground hover:text-primary hover:border-primary/20 border border-border/50 transition-all duration-200 inline-flex items-center gap-1.5 elevation-1">
                  <Icon className="w-3 h-3" />{link.label}
                </a>
              );
            })}
          </nav>
        </LandingHeroBackground>

        <div className="section-divider mb-10" />

        {/* ═══ 3. TOP 5 RECOMMENDATIONS ═══ */}
        {top5.length > 0 && (
          <section id="top-5" className="mb-16 scroll-mt-20">
            <SectionHeading title="Top 5 nemokamos antivirusinės programos" subtitle="Geriausios nemokamos antivirusinės, kurios tikrai apsaugo — be jokių mokėjimų." className="mb-6" />

            <div className="space-y-3">
              {top5.map((product, i) => (
                <div key={product.id}
                     className={`relative overflow-hidden transition-all duration-200 ${i === 0 ? 'card-premium-featured' : 'card-premium'}`}>
                  {i === 0 && <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/40 via-primary to-primary/40" />}

                  <div className="p-4 md:p-5">
                    {/* ── Desktop: compact header row ── */}
                    <div className="hidden md:grid md:grid-cols-[28px_52px_1fr_120px_110px_160px] lg:grid-cols-[30px_52px_1fr_130px_120px_170px] items-center gap-x-3">
                      <span className={`font-heading font-extrabold text-2xl tabular-nums text-center shrink-0 ${i === 0 ? 'text-primary' : 'text-muted-foreground/25'}`}>
                        {i + 1}
                      </span>
                      <ProductLogo product={product} size={36} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-heading font-bold text-foreground text-[15px] leading-tight">{product.name}</h3>
                          {i === 0 && <span className="chip-primary">Nr. 1</span>}
                          <span className="chip-success">Nemokamai</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{product.bestFor}</p>
                      </div>
                      <RatingStars rating={product.rating} />
                      <span className="text-sm font-heading font-bold text-success whitespace-nowrap">{product.pricingSummary}</span>
                      <div className="justify-self-end">
                        <AffiliateButton product={product} className="px-5 py-2.5 text-sm whitespace-nowrap" label="Atsisiųsti" />
                      </div>
                    </div>

                    {/* ── Desktop: verdict + details below ── */}
                    <div className="hidden md:block mt-3 pt-3 border-t border-border/30">
                      <p className="text-[12.5px] text-muted-foreground leading-relaxed mb-3">
                        {product.verdict || product.shortDescription}
                      </p>
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
                            {product.cons.slice(0, 2).map((con, j) => (
                              <li key={j} className="flex items-start gap-1.5 text-[12px] text-muted-foreground leading-snug">
                                <XCircle className="w-3 h-3 text-muted-foreground/30 mt-0.5 shrink-0" />{con}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="section-label text-[9px] mb-1.5">Funkcijos</p>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-1.5">
                            {featureCols.map(col => {
                              const val = product.features[col.key];
                              return (
                                <span key={col.key} className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                  {val === true ? <Check className="w-3 h-3 text-success" /> : val === false ? <X className="w-3 h-3 text-muted-foreground/25" /> : <span className="text-[10px] text-muted-foreground">{val}</span>}
                                  {col.label}
                                </span>
                              );
                            })}
                          </div>
                          {product.supportedPlatforms.length > 0 && <PlatformTags platforms={product.supportedPlatforms} />}
                        </div>
                      </div>
                    </div>

                    {/* ── Mobile layout ── */}
                    <div className="md:hidden">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`font-heading font-extrabold text-2xl tabular-nums w-7 text-center shrink-0 ${i === 0 ? 'text-primary' : 'text-muted-foreground/25'}`}>
                          {i + 1}
                        </span>
                        <ProductLogo product={product} size={36} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-heading font-bold text-foreground text-[15px] leading-tight">{product.name}</h3>
                            {i === 0 && <span className="chip-primary">Nr. 1</span>}
                            <span className="chip-success">Nemokamai</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{product.bestFor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mb-2">
                        <RatingStars rating={product.rating} />
                        <span className="text-sm font-heading font-bold text-success">{product.pricingSummary}</span>
                      </div>
                      <p className="text-[12px] text-muted-foreground leading-relaxed mb-2">{product.verdict || product.shortDescription}</p>
                      <div className="mb-2 pt-2 border-t border-border/30 grid grid-cols-1 gap-y-2">
                        <div>
                          <p className="section-label text-[9px] mb-1">Privalumai</p>
                          <ul className="space-y-0.5">
                            {product.pros.slice(0, 3).map((pro, j) => (
                              <li key={j} className="flex items-start gap-1.5 text-[12px] text-muted-foreground leading-snug">
                                <CheckCircle2 className="w-3 h-3 text-success mt-0.5 shrink-0" />{pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="section-label text-[9px] mb-1">Trūkumai</p>
                          <ul className="space-y-0.5">
                            {product.cons.slice(0, 2).map((con, j) => (
                              <li key={j} className="flex items-start gap-1.5 text-[12px] text-muted-foreground leading-snug">
                                <XCircle className="w-3 h-3 text-muted-foreground/30 mt-0.5 shrink-0" />{con}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="section-label text-[9px] mb-1">Funkcijos</p>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-1">
                            {featureCols.map(col => {
                              const val = product.features[col.key];
                              return (
                                <span key={col.key} className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                  {val === true ? <Check className="w-3 h-3 text-success" /> : val === false ? <X className="w-3 h-3 text-muted-foreground/25" /> : <span className="text-[10px] text-muted-foreground">{val}</span>}
                                  {col.label}
                                </span>
                              );
                            })}
                          </div>
                          {product.supportedPlatforms.length > 0 && <PlatformTags platforms={product.supportedPlatforms} />}
                        </div>
                      </div>
                      <AffiliateButton product={product} className="px-5 py-2.5 text-sm w-full" label="Atsisiųsti nemokamai" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="section-divider mb-12" />

        {/* ═══ 4. COMPARISON TABLE ═══ */}
        {products.length > 0 && (() => {
          const colCount = products.length;
          const gridCols = `160px repeat(${colCount}, 1fr)`;
          const comparisonRows: { label: string; render: (p: PublicProduct) => React.ReactNode }[] = [
            { label: 'Įvertinimas', render: (p) => (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-foreground">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{p.rating.toFixed(1)}
              </span>
            )},
            { label: 'Kaina', render: (p) => (
              <span className="text-xs font-medium text-success">{p.pricingSummary}</span>
            )},
            { label: 'Geriausia kam', render: (p) => (
              <span className="text-xs font-semibold text-primary">{p.bestFor}</span>
            )},
            ...featureCols.map(col => ({
              label: col.label,
              render: (p: PublicProduct) => <FeatureCheck value={p.features[col.key] ?? false} />,
            })),
            { label: 'Platformos', render: (p) => (
              <span className="text-[11px] text-muted-foreground">{p.supportedPlatforms.join(', ')}</span>
            )},
          ];

          return (
            <section id="palyginimas" className="mb-16 scroll-mt-20">
              <SectionHeading title="Nemokamų antivirusinių palyginimas" subtitle="Visų vertinamų nemokamų programų funkcijų palyginimas vienoje lentelėje." className="mb-5" />

              {/* ── Desktop: column-based grid ── */}
              <div className="hidden md:block rounded-xl border border-border/60 bg-card elevation-2 overflow-hidden">
                {/* Product header row */}
                <div className="grid border-b border-border/50" style={{ gridTemplateColumns: gridCols, background: 'hsl(210 18% 97%)' }}>
                  <div className="p-3 border-r border-border/30" />
                  {products.map((product, i) => (
                    <div key={product.id} className={`p-4 text-center border-r border-border/30 last:border-r-0 flex flex-col items-center ${i === 0 ? 'bg-primary/[0.04]' : ''}`}>
                      <div className="h-[52px] flex items-center justify-center mb-2">
                        <ProductLogo product={product} size={38} />
                      </div>
                      <p className="font-heading font-bold text-foreground text-[13px] leading-tight min-h-[2.5em] flex items-center justify-center mb-1">{product.name}</p>
                      <p className="text-[10px] text-success leading-tight h-[1.2em] mb-3">{product.pricingSummary}</p>
                      <AffiliateButton product={product} className="px-3.5 py-1.5 text-[11px]" label="Atsisiųsti" />
                    </div>
                  ))}
                </div>

                {/* Feature rows */}
                {comparisonRows.map((row, ri) => (
                  <div key={ri} className={`grid items-center border-b border-border/20 last:border-b-0 ${ri % 2 === 0 ? 'bg-muted/[0.12]' : ''}`}
                       style={{ gridTemplateColumns: gridCols }}>
                    <div className="p-3 border-r border-border/30">
                      <span className="text-xs font-heading font-semibold text-foreground">{row.label}</span>
                    </div>
                    {products.map((product, i) => (
                      <div key={product.id} className={`p-3 text-center border-r border-border/20 last:border-r-0 ${i === 0 ? 'bg-primary/[0.02]' : ''}`}>
                        {row.render(product)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* ── Mobile: expandable cards ── */}
              <div className="md:hidden space-y-2">
                {products.map((product) => {
                  const isExpanded = expandedRow === product.id;
                  return (
                    <div key={product.id} className="card-premium overflow-hidden">
                      <button onClick={() => setExpandedRow(isExpanded ? null : product.id)} className="w-full p-3.5 flex items-center gap-3 text-left">
                        <ProductLogo product={product} size={28} />
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-semibold text-foreground text-sm">{product.name}</p>
                          <p className="text-[11px] text-success">{product.pricingSummary}</p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-foreground">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{product.rating.toFixed(1)}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      {isExpanded && (
                        <div className="px-3.5 pb-3.5 pt-1 border-t border-border/30 space-y-2.5">
                          <p className="text-xs text-muted-foreground">{product.bestFor}</p>
                          <div className="grid grid-cols-2 gap-1.5">
                            {featureCols.map(col => (
                              <div key={col.key} className="flex items-center gap-1.5 text-xs">
                                <FeatureCheck value={product.features[col.key] ?? false} /><span className="text-muted-foreground">{col.label}</span>
                              </div>
                            ))}
                          </div>
                          {product.supportedPlatforms.length > 0 && <PlatformTags platforms={product.supportedPlatforms} />}
                          {product.pros.length > 0 && (
                            <ul className="space-y-1">
                              {product.pros.slice(0, 3).map((pro, j) => (
                                <li key={j} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                                  <CheckCircle2 className="w-3 h-3 text-success mt-0.5 shrink-0" />{pro}
                                </li>
                              ))}
                            </ul>
                          )}
                          <AffiliateButton product={product} className="px-4 py-2.5 text-xs w-full justify-center" label="Atsisiųsti nemokamai" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })()}

        <div className="section-divider mb-12" />

        {/* ═══ 5. USE CASES (column grid) ═══ */}
        <section id="kam-tinka" className="mb-16 scroll-mt-20">
          <SectionHeading title="Geriausia nemokama antivirusinė pagal poreikį" subtitle="Pasirinkite situaciją — parodysime tinkamiausią nemokamą sprendimą." className="mb-5" />

          {(() => {
            const useCaseProducts = useCases.map(uc => {
              const matched = findProduct(uc.matchKey);
              return { ...uc, product: matched };
            });
            const colCount = useCaseProducts.length;
            const gridCols = `180px repeat(${colCount}, 1fr)`;

            return (
              <>
                {/* ── Desktop ── */}
                <div className="hidden md:block rounded-xl border border-border/60 bg-card elevation-2 overflow-hidden">
                  <div className="grid border-b border-border/50" style={{ gridTemplateColumns: gridCols, background: 'hsl(210 18% 97%)' }}>
                    <div className="p-3 border-r border-border/30" />
                    {useCaseProducts.map((uc, i) => {
                      const Icon = uc.icon;
                      return (
                        <div key={i} className={`p-4 text-center border-r border-border/30 last:border-r-0 ${i === 0 ? 'bg-primary/[0.04]' : ''}`}>
                          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/12 flex items-center justify-center mx-auto mb-2">
                            <Icon className="w-4.5 h-4.5 text-primary" />
                          </div>
                          <p className="font-heading font-bold text-foreground text-[13px] leading-tight mb-0.5">{uc.tag}</p>
                          <p className="text-[10px] text-muted-foreground leading-tight">{uc.title}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Rows */}
                  {[
                    { label: 'Aprašymas', render: (uc: typeof useCaseProducts[0]) => <p className="text-[11px] text-muted-foreground leading-relaxed">{uc.shortWhy}</p> },
                    { label: 'Rekomenduojama', render: (uc: typeof useCaseProducts[0]) => uc.product ? (
                      <div className="flex flex-col items-center gap-1.5">
                        <ProductLogo product={uc.product} size={32} />
                        <p className="font-heading font-bold text-foreground text-[12px]">{uc.product.name}</p>
                      </div>
                    ) : null },
                    { label: 'Įvertinimas', render: (uc: typeof useCaseProducts[0]) => uc.product ? <RatingStars rating={uc.product.rating} /> : null },
                    { label: 'Kaina', render: (uc: typeof useCaseProducts[0]) => uc.product ? <span className="text-xs font-medium text-success">{uc.product.pricingSummary}</span> : null },
                    { label: 'Nuoroda', render: (uc: typeof useCaseProducts[0]) => uc.product ? <AffiliateButton product={uc.product} className="px-3.5 py-1.5 text-[11px] mx-auto" label="Atsisiųsti" /> : null },
                  ].map((row, ri) => (
                    <div key={ri} className={`grid items-center border-b border-border/20 last:border-b-0 ${ri % 2 === 0 ? 'bg-muted/[0.12]' : ''}`}
                         style={{ gridTemplateColumns: gridCols }}>
                      <div className="p-3 border-r border-border/30">
                        <span className="text-xs font-heading font-semibold text-foreground">{row.label}</span>
                      </div>
                      {useCaseProducts.map((uc, i) => (
                        <div key={i} className={`p-3 text-center border-r border-border/20 last:border-r-0 ${i === 0 ? 'bg-primary/[0.02]' : ''}`}>
                          {row.render(uc)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* ── Mobile ── */}
                <div className="md:hidden space-y-2.5">
                  {useCaseProducts.map((uc, i) => {
                    const Icon = uc.icon;
                    return (
                      <div key={i} className="card-premium p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/12 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-heading font-bold text-foreground text-sm">{uc.title}</p>
                            <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{uc.shortWhy}</p>
                          </div>
                        </div>
                        {uc.product && (
                          <div className="flex items-center gap-3 pt-3 border-t border-border/30">
                            <ProductLogo product={uc.product} size={28} />
                            <div className="flex-1">
                              <p className="font-heading font-bold text-foreground text-[13px]">{uc.product.name}</p>
                              <RatingStars rating={uc.product.rating} />
                            </div>
                            <AffiliateButton product={uc.product} className="px-3.5 py-1.5 text-[11px]" label="Atsisiųsti" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </section>

        <div className="section-divider mb-12" />

        {/* ═══ 6. FREE VS PAID ═══ */}
        <section id="mokama-vs-nemokama" className="mb-16 scroll-mt-20">
          <SectionHeading title="Ar tikrai pakanka nemokamos antivirusinės?" subtitle="Trumpas atsakymas — priklauso nuo jūsų situacijos." className="mb-5" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            <div className="card-premium-featured p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground text-sm flex-1">Nemokama pakanka, jei…</h3>
                <span className="chip-success">0 €</span>
              </div>
              <ul className="space-y-1.5 text-sm">
                {[
                  'Naudojate tik vieną Windows kompiuterį',
                  'Naršote atsargiai ir vengiate įtartinų nuorodų',
                  'Jums nereikia VPN ar slaptažodžių tvarkyklės',
                  'Nėra vaikų, kuriems reiktų interneto kontrolės',
                  'Nedirbate su jautria finansine informacija',
                ].map((t, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
                    <span className="text-[12px] text-muted-foreground leading-snug">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-premium p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="font-heading font-bold text-foreground text-sm flex-1">Verta mokėti, jei…</h3>
                <span className="chip-primary">20–60 €/m.</span>
              </div>
              <ul className="space-y-1.5 text-sm">
                {[
                  'Turite kelis įrenginius (kompiuteris + telefonas)',
                  'Naudojate viešus Wi-Fi tinklus',
                  'Turite vaikų, kuriems reikia tėvų kontrolės',
                  'Dirbate su bankine ar asmenine informacija',
                  'Norite VPN, slaptažodžių tvarkyklės ir pagalbos 24/7',
                ].map((t, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    <span className="text-[12px] text-muted-foreground leading-snug">{t}</span>
                  </li>
                ))}
              </ul>
              <Link to="/antivirusines-programos"
                    className="mt-3 text-xs font-heading font-semibold px-3.5 py-2 rounded-lg bg-card text-primary hover:bg-primary/5 border border-border/50 transition-all duration-200 inline-flex items-center gap-1.5 elevation-1">
                Mokamų antivirusinių palyginimas<ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        <div className="section-divider mb-12" />

        {/* ═══ 7. HOW TO CHOOSE ═══ */}
        <section id="kaip-pasirinkti" className="mb-16 scroll-mt-20">
          <SectionHeading title="Kaip pasirinkti nemokamą antivirusinę" subtitle="Atsakykite į šiuos klausimus — ir bus aišku, kuri nemokama programa jums tinka geriausiai." className="mb-5" />

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

          <div className="mt-4 card-premium p-4 max-w-2xl" style={{ background: 'hsl(210 18% 96%)' }}>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-heading">Bendra taisyklė:</strong> pradėkite nuo nemokamos antivirusinės. Jei po mėnesio pastebite, kad trūksta funkcijų — atnaujinkite iki mokamos versijos to paties gamintojo. Tai paprasčiausias ir pigiausias kelias prie stipresnės apsaugos.
            </p>
          </div>
        </section>

        <div className="section-divider mb-12" />

        {/* ═══ 8. METHODOLOGY ═══ */}
        <section className="mb-16">
          <div className="card-premium p-5 md:p-6" style={{ background: 'hsl(210 18% 96%)' }}>
            <div className="flex items-start gap-3.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/12 flex items-center justify-center shrink-0">
                <BadgeCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                
                <h2 className="font-heading text-lg font-bold text-foreground">Kaip vertiname nemokamas antivirusines</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Kiekviena programa vertinama pagal {featureCols.length} kriterijus, pritaikytus nemokamoms versijoms.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {[
                { title: 'Apsaugos efektyvumas', desc: 'AV-Test ir AV-Comparatives laboratorijų balai virusų, šnipinėjimo ir išpirkos programų aptikimui.', icon: Shield },
                { title: 'Sistemos našumas', desc: 'Poveikis kompiuterio greičiui kasdienio naudojimo ir pilno skenavimo metu.', icon: Zap },
                { title: 'Nemokamų funkcijų apimtis', desc: 'Kokias funkcijas gaunate nemokamai vs kas paslėpta už mokamos versijos sienos.', icon: Layers },
                { title: 'Platformų palaikymas', desc: 'Ar nemokama versija veikia Windows, Mac, Android, iOS — ar tik vienoje platformoje.', icon: Globe },
                { title: 'Naudojimo paprastumas', desc: 'Sąsajos aiškumas, diegimo greitis ir konfigūravimo reikalavimai.', icon: Heart },
                { title: 'Privatumo politika', desc: 'Kokius duomenis renka nemokama versija ir ar nėra agresyvios reklamos.', icon: Lock },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="rounded-lg bg-card border border-border/40 p-3.5 flex gap-2.5 elevation-1">
                    <div className="w-7 h-7 rounded-md bg-primary/8 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-foreground text-xs mb-0.5">{item.title}</h3>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-muted-foreground/50 mt-4 pt-3 border-t border-border/30">Redakcija yra nepriklausoma. Affiliate partnerystės neturi įtakos vertinimams ar rekomendacijų eiliškumui.</p>
          </div>
        </section>

        {/* ═══ 9. FAQ ═══ */}
        <section id="duk" className="mb-16 scroll-mt-20">
          <FAQAccordion items={category.faq.length > 0 ? category.faq : []} title="Dažnai užduodami klausimai" />
        </section>

        {/* ═══ 10. RELATED GUIDES ═══ */}
        <section className="mb-16">
          <div className="card-premium p-5 md:p-6">
            <SectionHeading title="Kiti naudingi gidai" className="mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {relatedGuides.map(guide => {
                const Icon = guide.icon;
                return (
                  <Link key={guide.path} to={guide.path}
                        className="flex items-start gap-2.5 rounded-lg p-3.5 bg-background hover:bg-primary/[0.03] border border-border/40 transition-all duration-200 group elevation-1 hover-lift">
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
          </div>
        </section>

        <TrustDisclosure />
      </div>
    </PageLayout>
  );
};

export default FreeAntivirusLandingPage;
