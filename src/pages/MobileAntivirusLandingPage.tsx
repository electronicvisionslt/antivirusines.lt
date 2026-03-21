import {
  Star, Shield, Smartphone, Monitor, ChevronRight, CheckCircle2, XCircle,
  Clock, BarChart3, Layers, Award, Heart, Zap, Lock, ChevronDown,
  Check, X, Laptop, Globe, ShieldCheck, HelpCircle, BadgeCheck, ArrowRight,
  Fingerprint, Wifi, ScanSearch, TabletSmartphone,
} from 'lucide-react';
import PageLayout from '@/components/site/PageLayout';
import Breadcrumbs from '@/components/site/Breadcrumbs';
import FAQAccordion from '@/components/content/FAQAccordion';
import TrustDisclosure from '@/components/content/TrustDisclosure';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useComparisonProducts, type PublicProduct } from '@/hooks/usePublicData';
import type { PublicCategory } from '@/types/content';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ProductLogo, RatingStars, AffiliateButton, FeatureCheck, PlatformTags, SectionHeading, useUpdatedLabel } from '@/components/landing/LandingShared';

interface Props { category: PublicCategory }

/* ── Jump links ── */
const jumpLinks = [
  { href: '#top-5', label: 'Top 5', icon: Award },
  { href: '#palyginimas', label: 'Palyginimas', icon: BarChart3 },
  { href: '#android-vs-ios', label: 'Android vs iOS', icon: TabletSmartphone },
  { href: '#kam-tinka', label: 'Kam tinka', icon: Layers },
  { href: '#kaip-pasirinkti', label: 'Kaip pasirinkti', icon: Shield },
  { href: '#duk', label: 'DUK', icon: HelpCircle },
];

/* ── Feature columns ── */
const featureCols = [
  { key: 'Realaus laiko apsauga', label: 'Realaus laiko aps.' },
  { key: 'Anti-phishing', label: 'Anti-phishing' },
  { key: 'VPN', label: 'VPN' },
  { key: 'Wi-Fi apsauga', label: 'Wi-Fi apsauga' },
  { key: 'Programų skenavimas', label: 'Progr. skenavimas' },
  { key: 'Anti-theft', label: 'Anti-theft' },
  { key: 'Dark web stebėjimas', label: 'Dark web' },
  { key: 'Tėvų kontrolė', label: 'Tėvų kontrolė' },
  { key: 'Slaptažodžių tvarkyklė', label: 'Slaptažodžiai' },
  { key: 'Skambučių blokavimas', label: 'Skamb. blokavimas' },
];

/* ── Use cases ── */
interface UseCaseBlock { icon: typeof Shield; title: string; shortWhy: string; matchKey: string; tag: string }
const useCases: UseCaseBlock[] = [
  { icon: Award, title: 'Geriausia bendra apsauga', shortWhy: 'Pilnas saugumo paketas abiem platformoms: 100% kenkėjiškų programų aptikimas, AI sukčiavimo apsauga, VPN ir dark web stebėjimas.', matchKey: 'Norton', tag: '🥇 Nr. 1' },
  { icon: Zap, title: 'Lengviausia telefonui', shortWhy: 'Minimalus poveikis baterijai ir našumui. Autopilot režimas — nustatyk ir pamiršk. Aukščiausi laboratorijų balai.', matchKey: 'Bitdefender', tag: 'Lengva' },
  { icon: Lock, title: 'Stipriausia anti-theft', shortWhy: 'Pažangiausia vagystės apsauga: nuotolinis užrakinimas, duomenų ištrynimas, mugshot ir GPS sekimas.', matchKey: 'Kaspersky', tag: 'Saugumas' },
  { icon: Heart, title: 'Geriausia nemokama', shortWhy: 'Daugiausiai funkcijų nemokamoje versijoje: VPN, privatumo auditas, tapatybės apsauga ir anti-theft nemokamai.', matchKey: 'Avira', tag: 'Nemokamai' },
  { icon: Wifi, title: 'Geriausias Wi-Fi saugumas', shortWhy: 'Išsamus Wi-Fi tinklų skenavimas, programų auditas ir nuotraukų saugykla. Populiariausia nemokama antivirusinė.', matchKey: 'Avast', tag: 'Wi-Fi' },
];

/* ── Buyer guide ── */
const buyerGuide = [
  { q: 'Ar naudojate Android ar iOS?', a: 'Android telefonams antivirusinė svarbesnė, nes sistema leidžia diegti programas iš trečiųjų šaltinių. iOS vartotojams svarbiau VPN, phishing apsauga ir dark web stebėjimas.', icon: TabletSmartphone },
  { q: 'Ar diegiate programas ne iš oficialios parduotuvės?', a: 'Jei taip — būtinai rinkitės antivirusinę su realaus laiko apsauga (Norton, Bitdefender, Kaspersky). Sideloading yra pagrindinė Android grėsmių priežastis.', icon: ScanSearch },
  { q: 'Ar naudojate viešus Wi-Fi tinklus?', a: 'Viešas Wi-Fi — didelė grėsmė. Rinkitės antivirusinę su integruotu VPN (Norton — neribotas, Avira — 100 MB/d. nemokamai).', icon: Wifi },
  { q: 'Ar norite apsaugos nuo vagystės?', a: 'Kaspersky turi pažangiausią anti-theft su mugshot, nuotoliniu užrakinimu ir GPS sekimu. Norton ir Avast taip pat siūlo bazines anti-theft funkcijas.', icon: Fingerprint },
  { q: 'Kiek esate pasiruošę mokėti?', a: 'Avira ir Avast siūlo gerą nemokamą apsaugą. Jei norite pilno paketo — Norton (nuo 19.99 €/m.) arba Bitdefender (nuo 14.99 €/m.) yra geriausias kainos ir kokybės santykis.', icon: Zap },
  { q: 'Ar turite vaikų su telefonais?', a: 'Norton ir Kaspersky siūlo tėvų kontrolės funkcijas, leidžiančias stebėti vaikų veiklą, riboti programas ir nustatyti ekrano laiką.', icon: Heart },
];

/* ── Related guides ── */
const relatedGuides = [
  { path: '/antivirusines-programos', label: 'Geriausios antivirusinės programos', desc: 'Visų antivirusinių palyginimas — kompiuteriams ir telefonams', icon: Shield },
  { path: '/antivirusines-programos/nemokamos', label: 'Nemokamos antivirusinės', desc: 'Top 5 nemokamų sprendimų palyginimas', icon: Zap },
  { path: '/antivirusines-programos/kompiuteriui', label: 'Antivirusinė kompiuteriui', desc: 'Windows ir Mac apsaugos palyginimas', icon: Monitor },
  { path: '/virusai/virusas-telefone', label: 'Kaip pašalinti virusą iš telefono', desc: 'Žingsnis po žingsnio gidas Android ir iOS', icon: Smartphone },
  { path: '/virusai/kompiuterinis-virusas', label: 'Kas yra kompiuterinis virusas?', desc: 'Virusų tipai ir kaip jie veikia', icon: ShieldCheck },
];

/* ═══════════════════════════════════════════ */

const MobileAntivirusLandingPage = ({ category }: Props) => {
  usePageMeta({
    title: category.seoTitle || 'Geriausia antivirusinė telefonui 2026 — Top 5 Android ir iOS',
    description: category.metaDescription || 'Nepriklausomas antivirusinių programų telefonams palyginimas. Norton, Bitdefender, Kaspersky, Avira ir Avast — kurią pasirinkti Android ar iPhone?',
    canonicalUrl: category.canonicalUrl || undefined,
  });

  const { data: products = [] } = useComparisonProducts('mobile-antivirus');
  const top5 = products.slice(0, 5);
  const findProduct = (key: string) => products.find(p => p.name.includes(key) || p.brand.includes(key));

  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const updatedLabel = useUpdatedLabel();

  const bestOverall = products[0];
  const bestFree = products.find(p => p.brand === 'Avira');
  const bestSecurity = products.find(p => p.brand === 'Kaspersky');

  return (
    <PageLayout>
      <div className="container py-8 max-w-5xl mx-auto">
        <Breadcrumbs path={category.path} items={[
          { label: 'Pradžia', path: '/' },
          { label: 'Antivirusinės programos', path: '/antivirusines-programos' },
          { label: 'Telefonui', path: '/antivirusines-programos/telefonui' },
        ]} />

        {/* ═══ 1. HERO ═══ */}
        <section className="mb-8">

          <h1 className="font-heading text-3xl md:text-4xl lg:text-[2.85rem] font-extrabold text-foreground leading-[1.08] mb-3 tracking-tight">
            Geriausios antivirusinės programos telefonui 2026&nbsp;m.
          </h1>
          <p className="text-muted-foreground text-[15px] leading-relaxed max-w-2xl mb-6">
            Telefonai tapo pagrindiniu kibernetinių atakų taikiniu. Palyginome geriausias antivirusines programas Android ir iOS platformoms pagal apsaugos efektyvumą, funkcijas ir poveikį baterijai. Žemiau&nbsp;— redakcijos Top&nbsp;5.
          </p>

          {/* Quick winner badges */}
          {products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
              {bestOverall && (
                <a href="#top-5" className="card-premium-featured p-3.5 flex items-center gap-3 hover-lift group">
                  <ProductLogo product={bestOverall} size={32} />
                  <div className="min-w-0">
                    <span className="chip-primary mb-1">Geriausia 2026</span>
                    <span className="text-sm text-foreground font-semibold block leading-tight">{bestOverall.name}</span>
                    <span className="text-[11px] text-muted-foreground">{bestOverall.pricingSummary}</span>
                  </div>
                </a>
              )}
              {bestSecurity && (
                <a href="#top-5" className="card-premium p-3.5 flex items-center gap-3 hover-lift group">
                  <ProductLogo product={bestSecurity} size={32} />
                  <div className="min-w-0">
                    <span className="chip-muted mb-1">Anti-theft lyderis</span>
                    <span className="text-sm text-foreground font-semibold block leading-tight">{bestSecurity.name}</span>
                    <span className="text-[11px] text-muted-foreground">{bestSecurity.pricingSummary}</span>
                  </div>
                </a>
              )}
              {bestFree && (
                <a href="#top-5" className="card-premium p-3.5 flex items-center gap-3 hover-lift group">
                  <ProductLogo product={bestFree} size={32} />
                  <div className="min-w-0">
                    <span className="chip-success mb-1">Geriausia nemokama</span>
                    <span className="text-sm text-foreground font-semibold block leading-tight">{bestFree.name}</span>
                    <span className="text-[11px] text-muted-foreground">{bestFree.pricingSummary}</span>
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
        </section>

        <div className="section-divider mb-10" />

        {/* ═══ 3. TOP 5 RECOMMENDATIONS ═══ */}
        {top5.length > 0 && (
          <section id="top-5" className="mb-16 scroll-mt-20">
            <SectionHeading title="Top 5 antivirusinės telefonui" subtitle="Geriausios mobiliojo saugumo programos Android ir iOS — testuotos ir palygintos." className="mb-6" />

            <div className="space-y-3">
              {top5.map((product, i) => (
                <div key={product.id}
                     className={`relative overflow-hidden transition-all duration-200 ${i === 0 ? 'card-premium-featured' : 'card-premium'}`}>
                  {i === 0 && <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/40 via-primary to-primary/40" />}

                  <div className="p-4 md:p-5">
                    {/* ── Desktop ── */}
                    <div className="hidden md:grid md:grid-cols-[28px_52px_1fr_120px_110px_160px] lg:grid-cols-[30px_52px_1fr_130px_120px_170px] items-center gap-x-3">
                      <span className={`font-heading font-extrabold text-2xl tabular-nums text-center shrink-0 ${i === 0 ? 'text-primary' : 'text-muted-foreground/25'}`}>
                        {i + 1}
                      </span>
                      <ProductLogo product={product} size={36} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-heading font-bold text-foreground text-[15px] leading-tight">{product.name}</h3>
                          {i === 0 && <span className="chip-primary">Nr. 1</span>}
                          {product.freeVersion && <span className="chip-success">Yra nemokama</span>}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{product.bestFor}</p>
                      </div>
                      <RatingStars rating={product.rating} />
                      <span className="text-sm font-heading font-bold text-foreground whitespace-nowrap">{product.pricingSummary}</span>
                      <div className="justify-self-end">
                        <AffiliateButton product={product} className="px-5 py-2.5 text-sm whitespace-nowrap" label="Apsilankyti" />
                      </div>
                    </div>

                    {/* ── Desktop details ── */}
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
                          <p className="section-label text-[9px] mb-1.5">Platformos ir funkcijos</p>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-1.5">
                            {featureCols.slice(0, 6).map(col => {
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

                    {/* ── Mobile ── */}
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
                            {product.freeVersion && <span className="chip-success">Nemokama</span>}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{product.bestFor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mb-2">
                        <RatingStars rating={product.rating} />
                        <span className="text-sm font-heading font-bold text-foreground">{product.pricingSummary}</span>
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
                          <p className="section-label text-[9px] mb-1">Platformos</p>
                          {product.supportedPlatforms.length > 0 && <PlatformTags platforms={product.supportedPlatforms} />}
                        </div>
                      </div>
                      <AffiliateButton product={product} className="px-5 py-2.5 text-sm w-full" label="Apsilankyti" />
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
              <span className="text-xs font-medium text-foreground">{p.pricingSummary}</span>
            )},
            { label: 'Nemokama versija', render: (p) => (
              p.freeVersion ? <Check className="w-4 h-4 text-success mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/25 mx-auto" />
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
              <SectionHeading title="Antivirusinių telefonui palyginimas" subtitle="Visų vertinamų programų funkcijų palyginimas vienoje lentelėje." className="mb-5" />

              {/* ── Desktop ── */}
              <div className="hidden md:block rounded-xl border border-border/60 bg-card elevation-2 overflow-hidden">
                <div className="grid border-b border-border/50" style={{ gridTemplateColumns: gridCols, background: 'hsl(210 18% 97%)' }}>
                  <div className="p-3 border-r border-border/30" />
                  {products.map((product, i) => (
                    <div key={product.id} className={`p-4 text-center border-r border-border/30 last:border-r-0 flex flex-col items-center ${i === 0 ? 'bg-primary/[0.04]' : ''}`}>
                      <div className="h-[52px] flex items-center justify-center mb-2">
                        <ProductLogo product={product} size={38} />
                      </div>
                      <p className="font-heading font-bold text-foreground text-[13px] leading-tight min-h-[2.5em] flex items-center justify-center mb-1">{product.name}</p>
                      <p className="text-[10px] text-muted-foreground leading-tight h-[1.2em] mb-3">{product.pricingSummary}</p>
                      <AffiliateButton product={product} className="px-3.5 py-1.5 text-[11px]" label="Apsilankyti" />
                    </div>
                  ))}
                </div>

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

              {/* ── Mobile ── */}
              <div className="md:hidden space-y-2">
                {products.map((product) => {
                  const isExpanded = expandedRow === product.id;
                  return (
                    <div key={product.id} className="card-premium overflow-hidden">
                      <button onClick={() => setExpandedRow(isExpanded ? null : product.id)} className="w-full p-3.5 flex items-center gap-3 text-left">
                        <ProductLogo product={product} size={28} />
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-semibold text-foreground text-sm">{product.name}</p>
                          <p className="text-[11px] text-muted-foreground">{product.pricingSummary}</p>
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
                          <AffiliateButton product={product} className="px-4 py-2.5 text-xs w-full justify-center" label="Apsilankyti" />
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

        {/* ═══ 5. ANDROID VS iOS ═══ */}
        <section id="android-vs-ios" className="mb-16 scroll-mt-20">
          <SectionHeading title="Android vs iOS: kuo skiriasi grėsmės?" subtitle="Abi platformos turi skirtingų pažeidžiamumų — štai ką reikia žinoti." className="mb-5" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="card-premium-featured p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-success" />
                </div>
                <h3 className="font-heading font-bold text-foreground text-sm flex-1">Android</h3>
                <span className="chip-primary">Didesnė rizika</span>
              </div>
              <ul className="space-y-1.5 text-sm">
                {[
                  'Atvira sistema — galima diegti APK iš bet kur',
                  'Google Play Protect aptinka tik ~70% grėsmių',
                  'Dažniausiai taikoma kenkėjiškų programų taikinys',
                  'Didesnė sideloading rizika',
                  'Antivirusinė su realaus laiko apsauga — būtina',
                ].map((t, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <Shield className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    <span className="text-[12px] text-muted-foreground leading-snug">{t}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-muted-foreground font-semibold">Rekomenduojama: Norton, Bitdefender, Kaspersky</p>
            </div>
            <div className="card-premium p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="font-heading font-bold text-foreground text-sm flex-1">iOS (iPhone)</h3>
                <span className="chip-muted">Mažesnė rizika</span>
              </div>
              <ul className="space-y-1.5 text-sm">
                {[
                  'Sandbox architektūra — programos izoliuotos',
                  'Nėra tradicinio virusų skenavimo',
                  'Pagrindinis pavojus: phishing ir sukčiavimas',
                  'Spyware (pvz., GoldPickaxe) vis dar grėsmė',
                  'Svarbiau VPN, phishing apsauga ir dark web stebėjimas',
                ].map((t, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <Lock className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-[12px] text-muted-foreground leading-snug">{t}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-muted-foreground font-semibold">Rekomenduojama: Norton, Bitdefender, Avira</p>
            </div>
          </div>
        </section>

        <div className="section-divider mb-12" />

        {/* ═══ 6. USE CASES ═══ */}
        <section id="kam-tinka" className="mb-16 scroll-mt-20">
          <SectionHeading label="Pagal poreikį" title="Geriausia antivirusinė telefonui pagal poreikį" subtitle="Pasirinkite situaciją — parodysime tinkamiausią sprendimą." className="mb-5" />

          {(() => {
            const useCaseProducts = useCases.map(uc => {
              const matched = findProduct(uc.matchKey);
              return { ...uc, product: matched };
            });
            const colCount = useCaseProducts.length;
            const gridCols = `180px repeat(${colCount}, 1fr)`;

            return (
              <>
                {/* Desktop */}
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

                  {[
                    { label: 'Aprašymas', render: (uc: typeof useCaseProducts[0]) => <p className="text-[11px] text-muted-foreground leading-relaxed">{uc.shortWhy}</p> },
                    { label: 'Rekomenduojama', render: (uc: typeof useCaseProducts[0]) => uc.product ? (
                      <div className="flex flex-col items-center gap-1.5">
                        <ProductLogo product={uc.product} size={32} />
                        <p className="font-heading font-bold text-foreground text-[12px]">{uc.product.name}</p>
                      </div>
                    ) : null },
                    { label: 'Įvertinimas', render: (uc: typeof useCaseProducts[0]) => uc.product ? <RatingStars rating={uc.product.rating} /> : null },
                    { label: 'Kaina', render: (uc: typeof useCaseProducts[0]) => uc.product ? <span className="text-xs font-medium text-foreground">{uc.product.pricingSummary}</span> : null },
                    { label: 'Nuoroda', render: (uc: typeof useCaseProducts[0]) => uc.product ? <AffiliateButton product={uc.product} className="px-3.5 py-1.5 text-[11px] mx-auto" label="Apsilankyti" /> : null },
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

                {/* Mobile */}
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
                            <AffiliateButton product={uc.product} className="px-3.5 py-1.5 text-[11px]" label="Apsilankyti" />
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

        {/* ═══ 7. HOW TO CHOOSE ═══ */}
        <section id="kaip-pasirinkti" className="mb-16 scroll-mt-20">
          <SectionHeading label="Sprendimo gidas" title="Kaip pasirinkti antivirusinę telefonui" subtitle="Atsakykite į šiuos klausimus — ir bus aišku, kuri programa jums tinka geriausiai." className="mb-5" />

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
              <strong className="text-foreground font-heading">Bendra taisyklė:</strong> Android vartotojams antivirusinė su realaus laiko apsauga yra būtina. iOS vartotojams svarbiau VPN ir phishing apsauga. Abiejų platformų vartotojams — rinkitės Norton ar Bitdefender, kurie palaiko abi sistemas.
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
                <span className="section-label text-[9px] block mb-0.5">Skaidrumas</span>
                <h2 className="font-heading text-lg font-bold text-foreground">Kaip vertiname antivirusines telefonui</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Kiekviena programa testuojama realiuose Android ir iOS įrenginiuose pagal {featureCols.length} kriterijus.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {[
                { title: 'Kenkėjiškų programų aptikimas', desc: 'Android programos testuojamos su realiomis kenkėjiškomis programomis. Naudojami AV-Test ir AV-Comparatives laboratorijų rezultatai.', icon: Shield },
                { title: 'Phishing apsauga', desc: 'Testuojama su šimtais naujausių phishing URL — tiek naršyklėje, tiek SMS žinutėse ir socialiniuose tinkluose.', icon: ScanSearch },
                { title: 'Poveikis baterijai', desc: 'Matuojamas baterijos naudojimas per 24 val. su aktyvia realaus laiko apsauga ir foniniame režime.', icon: Zap },
                { title: 'Papildomos funkcijos', desc: 'VPN, anti-theft, tėvų kontrolė, slaptažodžių tvarkyklė — vertinamas kiekvienos funkcijos kokybė ir naudingumas.', icon: Layers },
                { title: 'Naudojimo paprastumas', desc: 'Sąsajos aiškumas, diegimo greitis ir konfigūravimo reikalavimai tiek Android, tiek iOS platformose.', icon: Heart },
                { title: 'Kaina ir vertė', desc: 'Nemokamų ir mokamų versijų funkcijų palyginimas. Ar mokama versija verta papildomo mokesčio?', icon: BarChart3 },
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
            <SectionHeading label="Susiję gidai" title="Kiti naudingi gidai" className="mb-4" />
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

export default MobileAntivirusLandingPage;
