import {
  Star, Shield, Smartphone, Monitor, ChevronRight, CheckCircle2, XCircle,
  Clock, BarChart3, Layers, Award, Heart, Zap, Lock, Users, ChevronDown,
  Check, X, Filter, Laptop, Globe, ShieldCheck, HelpCircle, BadgeCheck, ArrowRight,
} from 'lucide-react';
import PageLayout from '@/components/site/PageLayout';
import Breadcrumbs from '@/components/site/Breadcrumbs';
import FAQAccordion from '@/components/content/FAQAccordion';
import TrustDisclosure from '@/components/content/TrustDisclosure';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useComparisonProducts, type PublicProduct } from '@/hooks/usePublicData';
import type { PublicCategory } from '@/types/content';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ProductLogo, RatingStars, AffiliateButton, FeatureCheck, PlatformTags, SectionHeading, useUpdatedLabel } from '@/components/landing/LandingShared';

interface Props { category: PublicCategory }

/* ── Jump links ── */
const jumpLinks = [
  { href: '#top-5', label: 'Top 5', icon: Award },
  { href: '#palyginimas', label: 'Palyginimas', icon: BarChart3 },
  { href: '#pagal-poreiki', label: 'Pagal poreikį', icon: Layers },
  { href: '#nemokama-vs-mokama', label: 'Nemokama vs mokama', icon: Zap },
  { href: '#kaip-pasirinkti', label: 'Kaip pasirinkti', icon: Shield },
  { href: '#duk', label: 'DUK', icon: HelpCircle },
];

/* ── FAQ ── */
const pillarFaq: { q: string; a: string }[] = [
  { q: 'Ar verta mokėti už antivirusinę programą?', a: 'Jei saugote kelis įrenginius, naudojate viešus Wi-Fi tinklus arba jums svarbi tėvų kontrolė ir VPN — taip. Mokamos programos siūlo kelių įrenginių apsaugą, prioritetinę pagalbą ir papildomas funkcijas. Baziniam naršymui vienu įrenginiu nemokama versija gali pakakti.' },
  { q: 'Ar pakanka Windows Defender?', a: 'Windows Defender suteikia solidžią bazinę apsaugą ir daugeliui atsargių naudotojų to užtenka. Tačiau jis neturi VPN, slaptažodžių tvarkyklės, tėvų kontrolės ir kelių įrenginių valdymo. Jei turite šeimą ar kelis įrenginius — verta investuoti į specializuotą programą.' },
  { q: 'Kokia antivirusinė geriausia telefonui?', a: 'Android telefonams rekomenduojame ESET Home Security — viena iš nedaugelio su pilna telefonų apsauga, anti-theft ir minimaliu poveikiu baterijai. Norton ir Bitdefender taip pat turi mobiliąsias versijas, bet be dedikuotos telefono apsaugos funkcijos.' },
  { q: 'Ar nemokamos antivirusinės programos yra saugios?', a: 'Patikimų gamintojų nemokamos versijos — Avast Free, Bitdefender Free — yra saugios ir efektyvios bazinei apsaugai. Venkite nežinomų nemokamų programų: kai kurios renka duomenis ar rodo agresyvią reklamą.' },
  { q: 'Ar antivirusinė sulėtina kompiuterį?', a: 'Šiuolaikinės antivirusinės turi minimalų poveikį našumui. Geriausi sprendimai kaip Bitdefender ir Norton dirba fone beveik nepastebimi — poveikį galite pajusti tik pilno skenavimo metu.' },
  { q: 'Kiek įrenginių paprastai apima viena licencija?', a: 'Daugelis mokamų planų apima 3–10 įrenginių. Norton 360 Deluxe siūlo iki 5 įrenginių, Norton Premium — iki 10. Bitdefender planai apima 5 įrenginius. Šeimoms verta rinktis planus su didesniu skaičiumi.' },
];

/* ── Use cases ── */
interface UseCaseBlock { icon: typeof Shield; title: string; shortWhy: string; matchKey: string; tag: string }
const useCases: UseCaseBlock[] = [
  { icon: Award, title: 'Geriausia visapusiška apsauga', shortWhy: 'Plačiausias funkcijų rinkinys: antivirusas, VPN, slaptažodžių tvarkyklė ir tamsiojo interneto stebėjimas viename pakete.', matchKey: 'Norton', tag: '🥇 Nr. 1' },
  { icon: Zap, title: 'Geriausia nemokama antivirusinė', shortWhy: 'Geriausias grėsmių aptikimas tarp nemokamų alternatyvų, be agresyvios reklamos ir su realaus laiko apsauga.', matchKey: 'Avast', tag: 'Nemokama' },
  { icon: Users, title: 'Geriausia šeimoms', shortWhy: 'Tėvų kontrolė, iki 5 įrenginių viena licencija, debesų saugykla ir centralizuotas šeimos valdymas iš vienos paskyros.', matchKey: 'Norton', tag: 'Šeimoms' },
  { icon: Smartphone, title: 'Geriausia telefonui', shortWhy: 'Dedikuota mobilioji apsauga su anti-theft, anti-phishing ir minimaliu poveikiu baterijai — viena iš nedaugelio su pilna telefono apsauga.', matchKey: 'ESET', tag: 'Mobiliai' },
  { icon: Heart, title: 'Geriausia pradedantiesiems', shortWhy: 'Paprasta sąsaja, automatinis veikimas ir aiškūs pranešimai — instaliuojama per 3 minutes, veikia be nustatymų.', matchKey: 'Norton', tag: 'Lengva' },
];

/* ── Related guides ── */
const relatedGuides = [
  { path: '/antivirusines-programos/nemokamos', label: 'Nemokamos antivirusinės programos', desc: 'Geriausi nemokami sprendimai bazinei apsaugai', icon: Zap },
  { path: '/antivirusines-programos/telefonui', label: 'Antivirusinė telefonui', desc: 'Android ir iOS apsaugos gidas', icon: Smartphone },
  { path: '/antivirusines-programos/kompiuteriui', label: 'Antivirusinė kompiuteriui', desc: 'Windows ir Mac apsaugos palyginimas', icon: Monitor },
  { path: '/virusai/kompiuterinis-virusas', label: 'Kas yra kompiuterinis virusas?', desc: 'Virusų tipai ir kaip jie veikia', icon: ShieldCheck },
  { path: '/virusai/virusas-telefone', label: 'Kaip pašalinti virusą iš telefono', desc: 'Žingsnis po žingsnio gidas', icon: Smartphone },
];

/* ── Feature columns for comparison ── */
const featureCols = [
  { key: 'Realaus laiko apsauga', label: 'Realaus laiko aps.' },
  { key: 'VPN', label: 'VPN' },
  { key: 'Slaptažodžių tvarkyklė', label: 'Slaptažodžiai' },
  { key: 'Ugniasienė', label: 'Ugniasienė' },
  { key: 'Tėvų kontrolė', label: 'Tėvų kontr.' },
  { key: 'Telefonų apsauga', label: 'Tel. apsauga' },
  { key: 'Debesų saugykla', label: 'Debesų saug.' },
  { key: 'Dark web stebėjimas', label: 'Dark web' },
  { key: 'Tapatybės apsauga', label: 'Tapatybės aps.' },
  { key: 'Sukčių apsauga', label: 'Sukčių aps.' },
];

/* ── Filter options ── */
type FilterKey = 'all' | 'free' | 'family' | 'mobile';
const filterOpts: { key: FilterKey; label: string; icon: typeof Filter }[] = [
  { key: 'all', label: 'Visos', icon: BarChart3 },
  { key: 'free', label: 'Nemokamos', icon: Zap },
  { key: 'family', label: 'Šeimoms', icon: Users },
  { key: 'mobile', label: 'Telefonui', icon: Smartphone },
];

/* ── Buyer guide questions ── */
const buyerGuide = [
  { q: 'Kiek įrenginių norite apsaugoti?', a: 'Vienam įrenginiui gali pakakti nemokamos ar Windows Defender. 2+ įrenginiams — mokamas planas su kelių įrenginių licencija kainuos žymiai pigiau vienam įrenginiui.', icon: Layers },
  { q: 'Ar reikia telefono apsaugos?', a: 'Android yra atviresnė grėsmėms nei iOS. Rinkitės programą su dedikuota mobilia versija ir minimaliu poveikiu baterijai.', icon: Smartphone },
  { q: 'Ar turite vaikų internete?', a: 'Prioritetas — tėvų kontrolė ir turinio filtravimas. Norton ir Bitdefender siūlo stipriausias šeimos kontrolės funkcijas su tėvų kontrole.', icon: Users },
  { q: 'Ar jums svarbus VPN?', a: 'Viešuose Wi-Fi tinkluose VPN būtinas. Daugelis mokamų antivirusinių turi integruotą VPN — paprasčiau ir pigiau nei pirkti atskirai.', icon: Lock },
  { q: 'Koks jūsų biudžetas?', a: 'Nemokamos versijos — bazinė apsauga. Mokamos: 20–60 €/metus. Šeimos planai (iki 15 įrenginių) dažnai kainuoja tiek pat kiek 3 įrenginių licencija.', icon: BarChart3 },
  { q: 'Paprastumas ar kontrolė?', a: 'Norton, Avast — beveik automatinis veikimas. ESET, Bitdefender — detalesni nustatymai pažengusiems naudotojams.', icon: Shield },
];

/* ═══════════════════════════════════════════ */

const AntivirusLandingPage = ({ category }: Props) => {
  usePageMeta({
    title: category.seoTitle || 'Geriausios antivirusinės programos 2026 — palyginimas ir apžvalgos',
    description: category.metaDescription || 'Nepriklausomos antivirusinių programų apžvalgos ir palyginimas. Raskite geriausią antivirusinę savo kompiuteriui, telefonui ar šeimai.',
    canonicalUrl: category.canonicalUrl || undefined,
  });

  const { data: products = [] } = useComparisonProducts('antivirus');
  const top5 = products.slice(0, 5);
  const findProduct = (key: string) => products.find(p => p.name.includes(key) || p.brand.includes(key));

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [activeUseCase, setActiveUseCase] = useState(0);

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'all') return products;
    if (activeFilter === 'free') return products.filter(p => p.freeVersion);
    if (activeFilter === 'family') return products.filter(p => !!p.features['Tėvų kontrolė']);
    if (activeFilter === 'mobile') return products.filter(p => !!p.features['Telefonų apsauga'] || p.supportedPlatforms.some(pl => pl === 'Android' || pl === 'iOS'));
    return products;
  }, [products, activeFilter]);

  const updatedLabel = useUpdatedLabel();

  const bestOverall = products[0];
  const bestFree = products.find(p => p.freeVersion);
  const bestFamily = products.find(p => p.features['Tėvų kontrolė'] === true);

  return (
    <PageLayout>
      <div className="container py-8 max-w-5xl mx-auto">
        <Breadcrumbs path={category.path} items={[
          { label: 'Pradžia', path: '/' },
          { label: 'Antivirusinės programos', path: '/antivirusines-programos' },
        ]} />

        {/* ═══ 1. HERO ═══ */}
        <section className="mb-8">
          {/* Meta line */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
            <span className="chip-primary"><ShieldCheck className="w-3 h-3" />Nepriklausomas palyginimas</span>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />Atnaujinta {updatedLabel}</span>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Lock className="w-3 h-3" />Su affiliate nuorodomis</span>
          </div>

          <h1 className="font-heading text-3xl md:text-4xl lg:text-[2.85rem] font-extrabold text-foreground leading-[1.08] mb-3 tracking-tight">
            Geriausios antivirusinės programos 2026&nbsp;m.
          </h1>
          <p className="text-muted-foreground text-[15px] leading-relaxed max-w-2xl mb-6">
            Išanalizavome populiariausias antivirusines programas pagal apsaugos efektyvumą, papildomas funkcijas ir kainą. Žemiau — redakcijos Top&nbsp;5, detalus palyginimas ir patarimai, kaip pasirinkti.
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
              {bestFamily && (
                <a href="#pagal-poreiki" className="card-premium p-3.5 flex items-center gap-3 hover-lift group">
                  <ProductLogo product={bestFamily} size={32} />
                  <div className="min-w-0">
                    <span className="chip-primary mb-1">Geriausia šeimoms</span>
                    <span className="text-sm text-foreground font-semibold block leading-tight">{bestFamily.name}</span>
                    <span className="text-[11px] text-muted-foreground">{bestFamily.pricingSummary}</span>
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

        {/* Divider */}
        <div className="section-divider mb-10" />

        {/* ═══ 3. TOP 5 RECOMMENDATIONS ═══ */}
        {top5.length > 0 && (
          <section id="top-5" className="mb-16 scroll-mt-20">
            <SectionHeading label="Redakcijos pasirinkimas" title="Top 5 antivirusinės programos" subtitle="Programos, kurios šiandien siūlo geriausią apsaugos, funkcijų ir kainos derinį." className="mb-6" />

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
                          {product.freeVersion && i !== 0 && <span className="chip-success">Nemokama</span>}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{product.bestFor}</p>
                      </div>
                      <RatingStars rating={product.rating} />
                      <span className="text-sm font-heading font-bold text-foreground whitespace-nowrap">{product.pricingSummary}</span>
                      <div className="justify-self-end">
                        <AffiliateButton product={product} className="px-5 py-2.5 text-sm whitespace-nowrap" label="Gauti pasiūlymą" />
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
                                  {val === true ? <Check className="w-3 h-3 text-success" /> : <X className="w-3 h-3 text-muted-foreground/25" />}
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
                            {product.freeVersion && i !== 0 && <span className="chip-success">Nemokama</span>}
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
                          <p className="section-label text-[9px] mb-1">Funkcijos</p>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-1">
                            {featureCols.map(col => {
                              const val = product.features[col.key];
                              return (
                                <span key={col.key} className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                  {val === true ? <Check className="w-3 h-3 text-success" /> : <X className="w-3 h-3 text-muted-foreground/25" />}
                                  {col.label}
                                </span>
                              );
                            })}
                          </div>
                          {product.supportedPlatforms.length > 0 && <PlatformTags platforms={product.supportedPlatforms} />}
                        </div>
                      </div>
                      <AffiliateButton product={product} className="px-5 py-2.5 text-sm w-full" label="Gauti pasiūlymą" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Divider */}
        <div className="section-divider mb-12" />

        {/* ═══ 4. COMPARISON TABLE — column layout (products = columns) ═══ */}
        {products.length > 0 && (
          <section id="palyginimas" className="mb-16 scroll-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
              <SectionHeading label="Funkcijų lentelė" title="Detalus palyginimas" subtitle="Visų vertinamų programų funkcijų ir kainų palyginimas vienoje lentelėje." />
              <div className="flex gap-1.5 shrink-0">
                {filterOpts.map(opt => {
                  const Icon = opt.icon;
                  const active = activeFilter === opt.key;
                  return (
                    <button key={opt.key} onClick={() => setActiveFilter(opt.key)}
                            className={`text-[11px] font-heading font-medium px-3 py-2 rounded-lg inline-flex items-center gap-1.5 transition-all duration-200 border ${active ? 'bg-primary text-primary-foreground border-primary elevation-primary' : 'bg-card text-muted-foreground hover:text-foreground border-border/50 elevation-1'}`}>
                      <Icon className="w-3 h-3" />{opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {filteredProducts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">Nėra produktų pagal pasirinktą filtrą.</p>
            )}

            {filteredProducts.length > 0 && (() => {
              const colCount = filteredProducts.length;
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
                { label: 'Geriausia kam', render: (p) => (
                  <span className="text-xs font-semibold text-primary">{p.bestFor}</span>
                )},
                { label: 'Nemokama versija', render: (p) => <FeatureCheck value={p.freeVersion} /> },
                ...featureCols.map(col => ({
                  label: col.label,
                  render: (p: PublicProduct) => <FeatureCheck value={p.features[col.key] ?? false} />,
                })),
                { label: 'Platformos', render: (p) => (
                  <span className="text-[11px] text-muted-foreground">{p.supportedPlatforms.join(', ')}</span>
                )},
              ];

              return (
                <>
                  {/* ── Desktop: column-based grid ── */}
                  <div className="hidden md:block rounded-xl border border-border/60 bg-card elevation-2 overflow-hidden">
                    {/* Product header row */}
                    <div className="grid border-b border-border/50 bg-muted/30" style={{ gridTemplateColumns: gridCols }}>
                      <div className="p-3 border-r border-border/30" />
                      {filteredProducts.map((product, i) => (
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

                    {/* Feature rows */}
                    {comparisonRows.map((row, ri) => (
                      <div key={ri} className={`grid items-center border-b border-border/20 last:border-b-0 ${ri % 2 === 0 ? 'bg-muted/[0.12]' : ''}`}
                           style={{ gridTemplateColumns: gridCols }}>
                        <div className="p-3 border-r border-border/30">
                          <span className="text-xs font-heading font-semibold text-foreground">{row.label}</span>
                        </div>
                        {filteredProducts.map((product, i) => (
                          <div key={product.id} className={`p-3 text-center border-r border-border/20 last:border-r-0 ${i === 0 ? 'bg-primary/[0.02]' : ''}`}>
                            {row.render(product)}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* ── Mobile: expandable cards ── */}
                  <div className="md:hidden space-y-2">
                    {filteredProducts.map((product) => {
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
                                <div className="flex items-center gap-1.5 text-xs"><FeatureCheck value={product.freeVersion} /><span className="text-muted-foreground">Nemokama</span></div>
                                <div className="flex items-center gap-1.5 text-xs"><FeatureCheck value={product.trialAvailable} /><span className="text-muted-foreground">Bandomoji</span></div>
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
                              <AffiliateButton product={product} className="px-4 py-2.5 text-xs w-full justify-center" label="Gauti pasiūlymą" />
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

        {/* Divider */}
        <div className="section-divider mb-12" />

        {/* ═══ 5. BEST BY USE CASE ═══ */}
        <section id="pagal-poreiki" className="mb-16 scroll-mt-20">
          <SectionHeading label="Pagal poreikį" title="Geriausia antivirusinė pagal poreikį" subtitle="Pasirinkite situaciją — parodysime tinkamiausią sprendimą." className="mb-5" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {useCases.map((uc, i) => {
              const Icon = uc.icon;
              const product = findProduct(uc.matchKey);
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
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{uc.shortWhy}</p>
                    </div>
                  </div>
                  {product && (
                    <div className="flex items-center gap-3 pt-3 border-t border-border/30 mt-auto">
                      <ProductLogo product={product} size={28} />
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-foreground text-[13px]">{product.name}</p>
                        <div className="flex items-center gap-2">
                          <RatingStars rating={product.rating} />
                          <span className="text-[11px] text-muted-foreground">{product.pricingSummary}</span>
                        </div>
                      </div>
                      <AffiliateButton product={product} className="px-3 py-1.5 text-[11px] shrink-0" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Divider */}
        <div className="section-divider mb-12" />

        {/* ═══ 6. FREE VS PAID ═══ */}
        <section id="nemokama-vs-mokama" className="mb-16 scroll-mt-20">
          <SectionHeading label="Praktinis gidas" title="Nemokama ar mokama antivirusinė?" subtitle="Atsakymas priklauso nuo jūsų situacijos. Štai praktinis palyginimas." className="mb-5" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            {/* Free */}
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
                  { ok: true, t: 'Bazinė apsauga nuo virusų ir kenkėjiškų programų' },
                  { ok: true, t: 'Pakankama lengvam naršymui vienu įrenginiu' },
                  { ok: true, t: 'Jokių finansinių įsipareigojimų' },
                  { ok: false, t: 'Nėra VPN, slaptažodžių tvarkyklės, tėvų kontrolės' },
                  { ok: false, t: 'Tik vienas įrenginys, jokio centralizuoto valdymo' },
                  { ok: false, t: 'Ribota techninė pagalba' },
                ].map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    {item.ok ? <CheckCircle2 className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/30 mt-0.5 shrink-0" />}
                    <span className="text-[12px] text-muted-foreground leading-snug">{item.t}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-muted-foreground border-t border-border/30 pt-2.5">Tinka: studentams, vienam įrenginiui. Windows Defender irgi gali pakakti šiai auditorijai.</p>
            </div>
            {/* Paid */}
            <div className="card-premium-featured p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground text-sm flex-1">Mokama versija</h3>
                <span className="chip-primary">20–60 €/m.</span>
              </div>
              <ul className="space-y-1.5 text-sm mb-4">
                {[
                  { ok: true, t: 'Pažangus grėsmių aptikimas ir proaktyvi prevencija' },
                  { ok: true, t: 'VPN, slaptažodžių tvarkyklė, tamsaus interneto stebėjimas' },
                  { ok: true, t: 'Kelių įrenginių apsauga viena licencija (3–15 įr.)' },
                  { ok: true, t: 'Tėvų kontrolė ir šeimos funkcijos' },
                  { ok: true, t: 'Prioritetinė 24/7 techninė pagalba' },
                  { ok: false, t: 'Reikalauja metinio mokėjimo' },
                ].map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    {item.ok ? <CheckCircle2 className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/30 mt-0.5 shrink-0" />}
                    <span className="text-[12px] text-muted-foreground leading-snug">{item.t}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-muted-foreground border-t border-border/30 pt-2.5">Tinka: šeimoms, nuotoliniam darbui, keliems įrenginiams.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { path: '/antivirusines-programos/nemokamos', label: 'Nemokamos antivirusinės' },
              { path: '/antivirusines-programos/telefonui', label: 'Antivirusinė telefonui' },
              { path: '/antivirusines-programos/kompiuteriui', label: 'Antivirusinė kompiuteriui' },
            ].map(link => (
              <Link key={link.path} to={link.path}
                    className="text-xs font-heading font-semibold px-3.5 py-2 rounded-lg bg-card text-primary hover:bg-primary/5 border border-border/50 transition-all duration-200 inline-flex items-center gap-1.5 elevation-1">
                {link.label}<ChevronRight className="w-3.5 h-3.5" />
              </Link>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="section-divider mb-12" />

        {/* ═══ 7. HOW TO CHOOSE ═══ */}
        <section id="kaip-pasirinkti" className="mb-16 scroll-mt-20">
          <SectionHeading label="Sprendimo gidas" title="Kaip pasirinkti tinkamą antivirusinę" subtitle="Atsakykite į šiuos klausimus — ir bus aišku, kuri programa jums tinka geriausiai." className="mb-5" />

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
              <strong className="text-foreground font-heading">Bendra taisyklė:</strong> jei apsaugote tik vieną Windows kompiuterį ir naršote atsargiai — Windows Defender arba nemokama antivirusinė gali pakakti. Jei turite 2+ įrenginius, telefoną ar šeimą — investuokite į mokamą programą. Kaina dažnai siekia vos 3–5&nbsp;€ per mėnesį.
            </p>
          </div>
        </section>

        {/* Divider */}
        <div className="section-divider mb-12" />

        {/* ═══ 8. METHODOLOGY / TRUST ═══ */}
        <section className="mb-16">
          <div className="card-premium p-5 md:p-6 bg-muted/40">
            <div className="flex items-start gap-3.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/12 flex items-center justify-center shrink-0">
                <BadgeCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="section-label text-[9px] block mb-0.5">Skaidrumas</span>
                <h2 className="font-heading text-lg font-bold text-foreground">Kaip vertiname antivirusines programas</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Kiekviena programa vertinama pagal {featureCols.length + 2} kriterijus.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {[
                { title: 'Apsaugos efektyvumas', desc: 'Kenkėjiškos programinės įrangos aptikimas ir realaus laiko apsaugos veiksmingumas.', icon: Shield },
                { title: 'Sistemos našumas', desc: 'Poveikis kompiuterio ir telefono greičiui bei baterijos suvartojimas.', icon: Zap },
                { title: 'Papildomos funkcijos', desc: 'VPN, slaptažodžių tvarkyklė, tėvų kontrolė ir jų praktinė nauda.', icon: Layers },
                { title: 'Kainos ir vertės santykis', desc: 'Pirmo metų ir atnaujinimo kaina, įrenginių skaičius, nemokamos versijos.', icon: BarChart3 },
                { title: 'Naudojimo paprastumas', desc: 'Sąsajos aiškumas, diegimo greitis ir pagalbos prieinamumas.', icon: Heart },
                { title: 'Kelių įrenginių palaikymas', desc: 'Platformų suderinamumas ir licencijos lankstumas šeimoms.', icon: Globe },
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
          <FAQAccordion items={category.faq.length > 0 ? category.faq : pillarFaq} title="Dažnai užduodami klausimai" />
        </section>

        {/* ═══ 10. RELATED GUIDES ═══ */}
        <section className="mb-16">
          <SectionHeading label="Susiję gidai" title="Kiti naudingi gidai" className="mb-4" />
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

export default AntivirusLandingPage;
