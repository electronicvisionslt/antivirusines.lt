import {
  Star, Shield, Smartphone, Monitor, ChevronRight, CheckCircle2, XCircle,
  Clock, BarChart3, Layers, Award, Heart, Zap, Lock, ChevronDown,
  Check, X, Laptop, Globe, ShieldCheck, HelpCircle, BadgeCheck, ArrowRight,
  Apple, AlertTriangle,
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
  { href: '#windows-vs-mac', label: 'Windows vs Mac', icon: Monitor },
  { href: '#kam-tinka', label: 'Kam tinka', icon: Layers },
  { href: '#kaip-pasirinkti', label: 'Kaip pasirinkti', icon: Shield },
  { href: '#duk', label: 'DUK', icon: HelpCircle },
];

/* ── Feature columns ── */
const featureCols = [
  { key: 'Realaus laiko apsauga', label: 'Realaus laiko aps.' },
  { key: 'Išpirkos apsauga', label: 'Išpirkos aps.' },
  { key: 'Ugniasienė', label: 'Ugniasienė' },
  { key: 'VPN', label: 'VPN' },
  { key: 'Slaptažodžių tvarkyklė', label: 'Slaptažodžiai' },
  { key: 'Debesų saugykla', label: 'Debesų saug.' },
  { key: 'Dark web stebėjimas', label: 'Dark web' },
  { key: 'Tėvų kontrolė', label: 'Tėvų kontr.' },
  { key: 'Mac optimizavimas', label: 'Mac optim.' },
  { key: 'El. pašto apsauga', label: 'El. pašto aps.' },
];

/* ── Use cases ── */
interface UseCaseBlock { icon: typeof Shield; title: string; shortWhy: string; matchKey: string; tag: string }
const useCases: UseCaseBlock[] = [
  { icon: Award, title: 'Geriausia visapusiška apsauga', shortWhy: 'Aukščiausi laboratorijų balai, neribotas VPN, slaptažodžių tvarkyklė, dark web stebėjimas ir 50 GB debesų saugykla viename pakete.', matchKey: 'Norton', tag: '🥇 Nr. 1' },
  { icon: Zap, title: 'Lengviausia kompiuteriui', shortWhy: 'Minimalus poveikis sistemos našumui, Autopilot režimas ir daugiasluoksnė ransomware apsauga. „Nustatyk ir pamiršk" filosofija.', matchKey: 'Bitdefender', tag: 'Lengva' },
  { icon: Monitor, title: 'Geriausia tik Mac', shortWhy: 'Vienintelė antivirusinė sukurta nuo nulio macOS — NetBarrier ugniasienė, optimizavimo įrankiai ir pigiausias mokamas variantas.', matchKey: 'Intego', tag: 'Mac' },
  { icon: Lock, title: 'Geriausia pažengusiems', shortWhy: 'Detalūs nustatymai, minimali sistemos apkrova ir Europos kompanijos GDPR atitiktis. Idealus IT specialistams.', matchKey: 'ESET', tag: 'Pro' },
  { icon: Heart, title: 'Geriausias kainos/kokybės santykis', shortWhy: 'Neribotas VPN, stipri phishing apsauga ir Safe Kids tėvų kontrolė — visa tai už konkurencingą kainą.', matchKey: 'Kaspersky', tag: 'Vertė' },
];

/* ── Buyer guide ── */
const buyerGuide = [
  { q: 'Windows ar Mac?', a: 'Windows sulaukia 7× daugiau kenkėjiškų programų, todėl antivirusinė čia kritiškai svarbi. Mac kenkėjiškų programų skaičius auga 60% kasmet — „Mac neužsikrečia" mitas nebegalioja.', icon: Monitor },
  { q: 'Kiek įrenginių norite apsaugoti?', a: 'Vienam kompiuteriui gali pakakti Intego (Mac) ar Windows Defender. 2+ įrenginiams — Norton ar Bitdefender su kelių platformų licencija.', icon: Layers },
  { q: 'Ar reikia VPN?', a: 'Norton siūlo neribotą VPN su visais planais. Bitdefender — 200 MB/d. baziniame, neribotą Premium pakete. Kaspersky Plus taip pat turi neribotą VPN.', icon: Lock },
  { q: 'Ar turite Mac ir Windows?', a: 'Norton 360 ir Bitdefender veikia abiejose platformose su viena licencija. Intego — tik Mac. ESET palaiko abi platformas, bet Mac funkcijos ribotesnės.', icon: Laptop },
  { q: 'Ar svarbus našumas?', a: 'Bitdefender ir ESET nuolat užima aukščiausias pozicijas AV-Test našumo testuose. Intego sukurta specialiai macOS — optimizuota Apple chip procesoriams.', icon: Zap },
  { q: 'Koks biudžetas?', a: 'Intego — pigiausias nuo 24.99 €/m. Norton ir Kaspersky — nuo 29.99 €/m. Bitdefender — nuo 34.99 €/m. ESET Premium — nuo 49.99 €/m. Visi siūlo 30 dienų pinigų grąžinimo garantiją.', icon: BarChart3 },
];

/* ── Windows vs Mac comparison data ── */
const platformComparison = [
  { aspect: 'Grėsmių mastas', windows: 'Didžiulis — 87% visų kenkėjiškų programų taikoma Windows', mac: 'Augantis — 60% augimas per 3 metus, bet vis dar 7× mažiau nei Windows', winLevel: 'high' as const, macLevel: 'medium' as const },
  { aspect: 'Integruota apsauga', windows: 'Windows Defender — solidus, bet trūksta VPN, slaptažodžių tvarkyklės', mac: 'XProtect + Gatekeeper — bazinė, bet atnaujinimai rečiau nei trečiųjų šalių', winLevel: 'medium' as const, macLevel: 'medium' as const },
  { aspect: 'Ugniasienė', windows: 'Windows Firewall — įjungta pagal nutylėjimą, konfigūruojama', mac: 'macOS ugniasienė — išjungta pagal nutylėjimą, bazinės funkcijos', winLevel: 'medium' as const, macLevel: 'low' as const },
  { aspect: 'Phishing atakos', windows: 'Vienodai pažeidžiamos abi platformos — phishing nepriklauso nuo OS', mac: 'Vienodai pažeidžiamos — antivirusinė su naršyklės apsauga būtina abiem', winLevel: 'high' as const, macLevel: 'high' as const },
  { aspect: 'Ransomware', windows: 'Pagrindinis taikinys — dauguma ransomware kuria Windows', mac: 'Retesnė, bet auganti grėsmė — LockBit ir kiti jau taikosi į Mac', winLevel: 'high' as const, macLevel: 'medium' as const },
  { aspect: 'Adware / PUP', windows: 'Dažna problema dėl trečiųjų šalių programų', mac: 'Labai dažna — adware yra Nr. 1 Mac grėsmė', winLevel: 'medium' as const, macLevel: 'high' as const },
];

/* ── Related guides ── */
const relatedGuides = [
  { path: '/antivirusines-programos', label: 'Geriausios antivirusinės programos', desc: 'Visų antivirusinių palyginimas — kompiuteriams ir telefonams', icon: Shield },
  { path: '/antivirusines-programos/nemokamos', label: 'Nemokamos antivirusinės', desc: 'Top 5 nemokamų sprendimų palyginimas', icon: Zap },
  { path: '/antivirusines-programos/telefonui', label: 'Antivirusinė telefonui', desc: 'Android ir iOS apsaugos gidas', icon: Smartphone },
  { path: '/tevu-kontrole', label: 'Tėvų kontrolės programėlės', desc: 'Geriausios programos vaiko saugumui', icon: Heart },
  { path: '/virusai/kompiuterinis-virusas', label: 'Kas yra kompiuterinis virusas?', desc: 'Virusų tipai ir kaip jie veikia', icon: ShieldCheck },
];

/* ═══════════════════════════════════════════ */

const DesktopAntivirusLandingPage = ({ category }: Props) => {
  usePageMeta({
    title: category.seoTitle || 'Geriausia antivirusinė kompiuteriui 2026 — Windows ir Mac palyginimas',
    description: category.metaDescription || 'Nepriklausomas antivirusinių programų palyginimas Windows ir Mac kompiuteriams. Norton, Bitdefender, ESET, Kaspersky ir Intego — kurią pasirinkti?',
    canonicalUrl: category.canonicalUrl || undefined,
  });

  const { data: products = [] } = useComparisonProducts('desktop-antivirus');
  const top5 = products.slice(0, 5);
  const findProduct = (key: string) => products.find(p => p.name.includes(key) || p.brand.includes(key));

  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const updatedLabel = useUpdatedLabel();

  const bestOverall = products[0];
  const bestMac = products.find(p => p.brand === 'Intego');
  const bestLightweight = products.find(p => p.brand === 'Bitdefender');

  return (
    <PageLayout>
      <div className="container py-8 max-w-5xl mx-auto">
        <Breadcrumbs path={category.path} items={[
          { label: 'Pradžia', path: '/' },
          { label: 'Antivirusinės programos', path: '/antivirusines-programos' },
          { label: 'Kompiuteriui', path: '/antivirusines-programos/kompiuteriui' },
        ]} />

        {/* ═══ 1. HERO ═══ */}
        <section className="mb-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
            <span className="chip-success"><Monitor className="w-3 h-3" />Windows + Mac</span>
            <span className="chip-primary"><ShieldCheck className="w-3 h-3" />Nepriklausomas palyginimas</span>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />Atnaujinta {updatedLabel}</span>
          </div>

          <h1 className="font-heading text-3xl md:text-4xl lg:text-[2.85rem] font-extrabold text-foreground leading-[1.08] mb-3 tracking-tight">
            Geriausios antivirusinės programos kompiuteriui 2026&nbsp;m.
          </h1>
          <p className="text-muted-foreground text-[15px] leading-relaxed max-w-2xl mb-6">
            Windows sulaukia 7× daugiau kenkėjiškų programų nei Mac, tačiau macOS grėsmės auga&nbsp;60% kasmet. Palyginome geriausias antivirusines programas abiem platformoms pagal apsaugos efektyvumą, sistemos poveikį ir papildomas funkcijas.
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
              {bestMac && (
                <a href="#top-5" className="card-premium p-3.5 flex items-center gap-3 hover-lift group">
                  <ProductLogo product={bestMac} size={32} />
                  <div className="min-w-0">
                    <span className="chip-success mb-1">Geriausia Mac</span>
                    <span className="text-sm text-foreground font-semibold block leading-tight">{bestMac.name}</span>
                    <span className="text-[11px] text-muted-foreground">{bestMac.pricingSummary}</span>
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
            <SectionHeading label="Redakcijos pasirinkimas" title="Top 5 antivirusinės kompiuteriui" subtitle="Geriausios antivirusinės Windows ir Mac kompiuteriams — testuotos ir palygintos." className="mb-6" />

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
                          {product.supportedPlatforms.length === 1 && product.supportedPlatforms[0] === 'Mac' && (
                            <span className="chip-muted">Tik Mac</span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{product.bestFor}</p>
                      </div>
                      <RatingStars rating={product.rating} />
                      <span className="text-sm font-heading font-bold text-foreground whitespace-nowrap">{product.pricingSummary}</span>
                      <div className="justify-self-end">
                        <AffiliateButton product={product} className="px-5 py-2.5 text-sm whitespace-nowrap" />
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
                          <p className="section-label text-[9px] mb-1.5">Platformos</p>
                          {product.supportedPlatforms.length > 0 && <PlatformTags platforms={product.supportedPlatforms} />}
                        </div>
                      </div>
                    </div>

                    {/* ── Mobile ── */}
                    <div className="md:hidden">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`font-heading font-extrabold text-2xl tabular-nums shrink-0 ${i === 0 ? 'text-primary' : 'text-muted-foreground/25'}`}>
                          {i + 1}
                        </span>
                        <ProductLogo product={product} size={36} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-heading font-bold text-foreground text-[15px] leading-tight">{product.name}</h3>
                            {i === 0 && <span className="chip-primary">Nr. 1</span>}
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
                          <p className="section-label text-[9px] mb-1">Platformos</p>
                          {product.supportedPlatforms.length > 0 && <PlatformTags platforms={product.supportedPlatforms} />}
                        </div>
                      </div>
                      <AffiliateButton product={product} className="px-5 py-2.5 text-sm w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="section-divider mb-12" />

        {/* ═══ 4. COMPARISON TABLE ═══ */}
        {products.length > 0 && (
          <section id="palyginimas" className="mb-16 scroll-mt-20">
            <SectionHeading label="Funkcijų lentelė" title="Detalus palyginimas" subtitle="Visų vertinamų programų funkcijų ir kainų palyginimas vienoje lentelėje." className="mb-5" />

            {(() => {
              const colCount = products.length;
              const gridCols = `160px repeat(${colCount}, 1fr)`;
              const comparisonRows: { label: string; render: (p: PublicProduct) => React.ReactNode }[] = [
                { label: 'Įvertinimas', render: (p) => (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-foreground">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{p.rating.toFixed(1)}
                  </span>
                )},
                { label: 'Kaina', render: (p) => (
                  <span className="text-xs font-medium text-muted-foreground">{p.pricingSummary}</span>
                )},
                { label: 'Platformos', render: (p) => (
                  <span className="text-[11px] text-muted-foreground">{p.supportedPlatforms.join(', ')}</span>
                )},
                ...featureCols.map(col => ({
                  label: col.label,
                  render: (p: PublicProduct) => <FeatureCheck value={p.features[col.key] ?? false} />,
                })),
              ];

              return (
                <>
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
                          <AffiliateButton product={product} className="px-3.5 py-1.5 text-[11px]" />
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
                              <AffiliateButton product={product} className="px-4 py-2.5 text-xs w-full justify-center" />
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
        )}

        <div className="section-divider mb-12" />

        {/* ═══ 5. WINDOWS VS MAC — unique section ═══ */}
        <section id="windows-vs-mac" className="mb-16 scroll-mt-20">
          <SectionHeading label="Platformų palyginimas" title="Windows vs Mac: kur didesnė grėsmė?" subtitle="Objektyvus dviejų platformų saugumo palyginimas pagal 2025–2026 m. duomenis." className="mb-5" />

          {/* Key stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
            <div className="card-premium p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
              </div>
              <p className="font-heading font-bold text-foreground text-lg tabular-nums">7×</p>
              <p className="text-[11px] text-muted-foreground">daugiau kenkėjiškų programų Windows nei Mac</p>
            </div>
            <div className="card-premium p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="w-4 h-4 text-amber-500" />
              </div>
              <p className="font-heading font-bold text-foreground text-lg tabular-nums">+60%</p>
              <p className="text-[11px] text-muted-foreground">Mac kenkėjiškų programų augimas per 3 metus</p>
            </div>
            <div className="card-premium p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <p className="font-heading font-bold text-foreground text-lg tabular-nums">87%</p>
              <p className="text-[11px] text-muted-foreground">visų kenkėjiškų programų taikoma Windows</p>
            </div>
          </div>

          {/* Comparison table */}
          <div className="rounded-xl border border-border/60 bg-card elevation-2 overflow-hidden mb-5">
            <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-border/50" style={{ background: 'hsl(210 18% 97%)' }}>
              <div className="p-3 border-r border-border/30">
                <span className="text-xs font-heading font-semibold text-foreground">Aspektas</span>
              </div>
              <div className="p-3 border-r border-border/30 text-center">
                <span className="text-xs font-heading font-semibold text-foreground inline-flex items-center gap-1.5"><Monitor className="w-3.5 h-3.5" />Windows</span>
              </div>
              <div className="p-3 text-center">
                <span className="text-xs font-heading font-semibold text-foreground inline-flex items-center gap-1.5"><Laptop className="w-3.5 h-3.5" />Mac</span>
              </div>
            </div>
            {platformComparison.map((row, i) => {
              const levelColors = { high: 'text-destructive', medium: 'text-amber-600', low: 'text-success' };
              return (
                <div key={i} className={`grid grid-cols-[1fr_1fr_1fr] items-start border-b border-border/20 last:border-b-0 ${i % 2 === 0 ? 'bg-muted/[0.12]' : ''}`}>
                  <div className="p-3 border-r border-border/30">
                    <span className="text-xs font-heading font-semibold text-foreground">{row.aspect}</span>
                  </div>
                  <div className="p-3 border-r border-border/20">
                    <p className={`text-[11px] leading-relaxed ${levelColors[row.winLevel]}`}>{row.windows}</p>
                  </div>
                  <div className="p-3">
                    <p className={`text-[11px] leading-relaxed ${levelColors[row.macLevel]}`}>{row.mac}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Verdict */}
          <div className="card-premium p-4 max-w-2xl" style={{ background: 'hsl(210 18% 96%)' }}>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-heading">Verdiktas:</strong> „Mac neužsikrečia" mitas nebegalioja. XProtect ir Gatekeeper suteikia bazinę apsaugą, bet trečiųjų šalių antivirusinės atnaujina virusų duomenų bazes kelis kartus per dieną — dažniau nei Apple. Windows naudotojams antivirusinė yra būtinybė, Mac naudotojams — stipriai rekomenduojama.
            </p>
          </div>
        </section>

        <div className="section-divider mb-12" />

        {/* ═══ 6. BEST BY USE CASE ═══ */}
        <section id="kam-tinka" className="mb-16 scroll-mt-20">
          <SectionHeading label="Pagal poreikį" title="Geriausia antivirusinė pagal poreikį" subtitle="Pasirinkite situaciją — parodysime tinkamiausią sprendimą." className="mb-5" />

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
                  <div className="grid items-start border-b border-border/20 bg-muted/[0.12]" style={{ gridTemplateColumns: gridCols }}>
                    <div className="p-3 border-r border-border/30">
                      <span className="text-xs font-heading font-semibold text-foreground">Aprašymas</span>
                    </div>
                    {useCaseProducts.map((uc, i) => (
                      <div key={i} className={`p-3 border-r border-border/20 last:border-r-0 ${i === 0 ? 'bg-primary/[0.02]' : ''}`}>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{uc.shortWhy}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid items-center border-b border-border/20" style={{ gridTemplateColumns: gridCols }}>
                    <div className="p-3 border-r border-border/30">
                      <span className="text-xs font-heading font-semibold text-foreground">Rekomenduojama</span>
                    </div>
                    {useCaseProducts.map((uc, i) => (
                      <div key={i} className={`p-3 text-center border-r border-border/20 last:border-r-0 ${i === 0 ? 'bg-primary/[0.02]' : ''}`}>
                        {uc.product && (
                          <div className="flex flex-col items-center gap-1.5">
                            <ProductLogo product={uc.product} size={32} />
                            <p className="font-heading font-bold text-foreground text-[12px]">{uc.product.name}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="grid items-center border-b border-border/20 bg-muted/[0.12]" style={{ gridTemplateColumns: gridCols }}>
                    <div className="p-3 border-r border-border/30">
                      <span className="text-xs font-heading font-semibold text-foreground">Įvertinimas</span>
                    </div>
                    {useCaseProducts.map((uc, i) => (
                      <div key={i} className={`p-3 text-center border-r border-border/20 last:border-r-0 ${i === 0 ? 'bg-primary/[0.02]' : ''}`}>
                        {uc.product && <RatingStars rating={uc.product.rating} />}
                      </div>
                    ))}
                  </div>
                  <div className="grid items-center" style={{ gridTemplateColumns: gridCols }}>
                    <div className="p-3 border-r border-border/30">
                      <span className="text-xs font-heading font-semibold text-foreground">Nuoroda</span>
                    </div>
                    {useCaseProducts.map((uc, i) => (
                      <div key={i} className={`p-3 text-center border-r border-border/20 last:border-r-0 ${i === 0 ? 'bg-primary/[0.02]' : ''}`}>
                        {uc.product && <AffiliateButton product={uc.product} className="px-3.5 py-1.5 text-[11px] mx-auto" />}
                      </div>
                    ))}
                  </div>
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
                            <AffiliateButton product={uc.product} className="px-3.5 py-1.5 text-[11px]" />
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
          <SectionHeading label="Sprendimo gidas" title="Kaip pasirinkti antivirusinę kompiuteriui" subtitle="Atsakykite į šiuos klausimus — ir bus aišku, kuri programa jums tinka geriausiai." className="mb-5" />

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
              <strong className="text-foreground font-heading">Bendra taisyklė:</strong> jei turite tik Mac — Intego yra pigiausias ir optimizuotas pasirinkimas. Jei turite Windows ir Mac — Norton arba Bitdefender su kelių platformų licencija. Jei esate pažengęs — ESET su detaliais nustatymais.
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
                <h2 className="font-heading text-lg font-bold text-foreground">Kaip vertiname antivirusines programas</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Kiekviena programa vertinama pagal {featureCols.length + 3} kriterijus.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {[
                { title: 'Apsaugos efektyvumas', desc: 'AV-Test ir AV-Comparatives laboratorijų balai, kenkėjiškos programinės įrangos aptikimas.', icon: Shield },
                { title: 'Sistemos našumas', desc: 'Poveikis kompiuterio paleidimui, failų kopijavimui ir programų atidarymui.', icon: Zap },
                { title: 'Papildomos funkcijos', desc: 'VPN, slaptažodžių tvarkyklė, tėvų kontrolė, dark web stebėjimas ir debesų saugykla.', icon: Layers },
                { title: 'Platformų palaikymas', desc: 'Windows ir Mac funkcijų pilnumas, kelių platformų licencijos lankstumas.', icon: Monitor },
                { title: 'Kainos ir vertės santykis', desc: 'Pirmo metų ir atnaujinimo kaina, įrenginių skaičius, pinigų grąžinimo garantija.', icon: BarChart3 },
                { title: 'Naudojimo paprastumas', desc: 'Sąsajos aiškumas, diegimo greitis ir pagalbos prieinamumas.', icon: Heart },
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
          <FAQAccordion items={category.faq} title="Dažnai užduodami klausimai" />
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

        {/* ═══ TRUST DISCLOSURE ═══ */}
        <TrustDisclosure />
      </div>
    </PageLayout>
  );
};

export default DesktopAntivirusLandingPage;
