import { Star, ExternalLink, Shield, Smartphone, Monitor, ChevronRight, CheckCircle2, XCircle, ArrowRight, Clock, BarChart3, Layers, Award, Heart, Zap, Lock, Users, ChevronDown, Check, X } from 'lucide-react';
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
import { useState } from 'react';

interface Props {
  category: PublicCategory;
}

/* ── Shared helpers ── */

function RatingBadge({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const cls = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1',
    lg: 'text-base px-3 py-1.5 gap-1.5',
  }[size];
  return (
    <span className={`${cls} inline-flex items-center rounded-md bg-accent/10 text-accent font-bold tabular-nums font-heading`}>
      <Star className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4.5 h-4.5' : 'w-3.5 h-3.5'} fill-accent stroke-accent`} />
      {rating.toFixed(1)}
    </span>
  );
}

function ProductLogo({ product, size = 40 }: { product: PublicProduct; size?: number }) {
  if (product.logoUrl) {
    return <img src={product.logoUrl} alt={`${product.name} logotipas`} width={size} height={size} className="rounded-lg object-contain" loading="lazy" />;
  }
  // Fallback: styled initials
  return (
    <div className="rounded-lg bg-primary/10 border border-primary/10 flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <span className="font-heading font-bold text-primary" style={{ fontSize: size * 0.35 }}>
        {product.brand?.slice(0, 2).toUpperCase() || product.name.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

function AffiliateButton({ product, variant = 'primary', className = '' }: { product: PublicProduct; variant?: 'primary' | 'outline'; className?: string }) {
  if (!product.affiliateUrl) return null;
  const base = variant === 'primary'
    ? 'bg-accent text-accent-foreground hover:bg-accent/90 glow-accent'
    : 'border border-accent/30 text-accent hover:bg-accent/10';
  return (
    <a
      href={product.affiliateUrl}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      className={`inline-flex items-center gap-2 font-heading font-semibold rounded-lg transition-all duration-200 active:scale-[0.97] ${base} ${className}`}
    >
      Apsilankyti
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
}

function FeatureIcon({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="w-4 h-4 text-[hsl(var(--success))] mx-auto" />;
  if (value === false) return <X className="w-4 h-4 text-muted-foreground/25 mx-auto" />;
  return <span className="text-xs text-muted-foreground">{value}</span>;
}

/* ── Jump nav config ── */
const jumpLinks = [
  { href: '#top-picks', label: 'Geriausi pasirinkimai', icon: Award },
  { href: '#palyginimas', label: 'Palyginimo lentelė', icon: BarChart3 },
  { href: '#pagal-poreiki', label: 'Pagal poreikį', icon: Layers },
  { href: '#nemokama-vs-mokama', label: 'Nemokama vs mokama', icon: Zap },
  { href: '#kaip-pasirinkti', label: 'Kaip pasirinkti', icon: Shield },
  { href: '#duk', label: 'DUK', icon: ChevronDown },
];

/* ── FAQ ── */
const pillarFaq: { q: string; a: string }[] = [
  { q: 'Ar verta mokėti už antivirusinę programą?', a: 'Jei jums reikia VPN, slaptažodžių tvarkyklės, tėvų kontrolės ar kelių įrenginių apsaugos — taip. Baziniam naršymui vienu įrenginiu nemokama versija gali pakakti, bet mokamos programos suteikia žymiai platesnę apsaugą ir prioritetinę pagalbą.' },
  { q: 'Ar pakanka Windows Defender?', a: 'Windows Defender šiandien siūlo solidžią bazinę apsaugą ir daugeliui atsargių naudotojų to pakanka. Tačiau specializuotos antivirusinės geriau atpažįsta naujas grėsmes, siūlo papildomas funkcijas ir turi mažesnį poveikį sistemos greičiui intensyvaus darbo metu.' },
  { q: 'Kokia antivirusinė geriausia telefonui?', a: 'Android telefonams gerai tinka Bitdefender Mobile Security ir Norton Mobile Security — abu siūlo stiprią apsaugą su minimaliu poveikiu baterijai. iOS sistemoje antivirusinės veikia ribočiau dėl Apple apribojimų, bet vis tiek naudingos dėl VPN ir naršymo apsaugos.' },
  { q: 'Ar nemokamos antivirusinės programos yra saugios?', a: 'Patikimų gamintojų nemokamos versijos (Avast, Bitdefender Free) yra saugios. Venkite nežinomų nemokamų programų — kai kurios gali rinkti jūsų duomenis, rodyti agresyvią reklamą arba netgi platinti kenkėjišką kodą.' },
  { q: 'Kiek įrenginių galima apsaugoti viena licencija?', a: 'Daugelis mokamų planų apima 3–10 įrenginių. Norton 360 Deluxe siūlo 5 įrenginius, Bitdefender Family — iki 15. Šeimoms ar keliems naudotojams verta rinktis planus su didesniu įrenginių skaičiumi.' },
  { q: 'Ar antivirusinė lėtina kompiuterį?', a: 'Šiuolaikinės antivirusinės turi minimalų poveikį našumui. Geriausi sprendimai kaip Bitdefender ir Norton dirba fone beveik nepastebimi. Poveikį galite pajusti tik pilno sistemos skenavimo metu.' },
];

/* ── Use-case data ── */
interface UseCaseBlock {
  icon: typeof Shield;
  title: string;
  description: string;
  matchKey: string;
  tag: string;
}

const useCases: UseCaseBlock[] = [
  { icon: Award, title: 'Geriausia visapusiška apsauga', description: 'Pilnas saugumo paketas su VPN, slaptažodžių tvarkykle, tamsiojo interneto stebėjimu ir automatiniais atnaujinimais.', matchKey: 'Norton', tag: 'Rekomenduojama' },
  { icon: Zap, title: 'Geriausia nemokama antivirusinė', description: 'Patikima bazinė apsauga be jokių mokesčių — tinka studentams ir tiems, kurie naršo atsargiai.', matchKey: 'Avast', tag: 'Nemokama' },
  { icon: Users, title: 'Geriausia šeimoms', description: 'Tėvų kontrolė, kelių įrenginių apsauga viena licencija ir paprastas valdymas visai šeimai.', matchKey: 'Norton', tag: 'Šeimoms' },
  { icon: Smartphone, title: 'Geriausia telefonui', description: 'Lengva, baterijos netaušojanti apsauga Android ir iOS su anti-phishing ir saugiu naršymu.', matchKey: 'Bitdefender', tag: 'Mobiliai' },
  { icon: Monitor, title: 'Geriausia Windows kompiuteriui', description: 'Stipriausias grėsmių aptikimas su mažiausiu poveikiu sistemos veikimui ir žaidimų režimu.', matchKey: 'Bitdefender', tag: 'Windows' },
  { icon: Heart, title: 'Geriausia pradedantiesiems', description: 'Paprasta sąsaja, automatinis veikimas ir aiškūs pranešimai — nereikia techninių žinių.', matchKey: 'Norton', tag: 'Lengva' },
];

/* ── Related guides ── */
const relatedGuides = [
  { path: '/antivirusines-programos/nemokamos', label: 'Nemokamos antivirusinės programos', desc: 'Geriausi nemokami sprendimai bazinei apsaugai' },
  { path: '/antivirusines-programos/telefonui', label: 'Antivirusinė programa telefonui', desc: 'Android ir iOS apsaugos gidas' },
  { path: '/antivirusines-programos/kompiuteriui', label: 'Antivirusinė programa kompiuteriui', desc: 'Windows ir Mac apsaugos palyginimas' },
  { path: '/virusai/kas-yra-kompiuterinis-virusas', label: 'Kas yra kompiuterinis virusas?', desc: 'Virusų tipai ir kaip jie veikia' },
  { path: '/virusai/virusas-telefone', label: 'Kaip pašalinti virusą iš telefono', desc: 'Žingsnis po žingsnio gidas' },
];

/* ── Feature columns for comparison ── */
const featureCols = [
  { key: 'VPN', label: 'VPN' },
  { key: 'Slaptažodžių tvarkyklė', label: 'Slaptažodžiai' },
  { key: 'Tėvų kontrolė', label: 'Tėvų kontrolė' },
  { key: 'Telefonų apsauga', label: 'Tel. apsauga' },
];

/* ═══════════════════════════════════════════════════ */

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

  const now = new Date();
  const updatedLabel = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  return (
    <PageLayout>
      <div className="container py-8">
        <Breadcrumbs path={category.path} items={[
          { label: 'Pradžia', path: '/' },
          { label: 'Antivirusinės programos', path: '/antivirusines-programos' },
        ]} />

        {/* ═══ 1. HERO ═══ */}
        <ScrollReveal>
          <section className="relative rounded-2xl overflow-hidden border border-border/40 mb-10">
            <div className="absolute inset-0 gradient-mesh" />
            <div className="absolute inset-0 bg-card/50" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="relative p-8 md:p-12 lg:p-14">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[11px] font-heading font-semibold text-primary uppercase tracking-[0.14em]">Nepriklausomas palyginimas</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Atnaujinta {updatedLabel}
                  </span>
                </div>
                <h1 className="font-heading text-3xl md:text-[2.75rem] lg:text-5xl font-bold text-foreground leading-[1.08] mb-5">
                  Geriausios antivirusinės programos 2025 m.
                </h1>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mb-6">
                  Palyginome populiariausias antivirusines programas pagal realų naudojimą — apsaugos lygį, greitį, papildomas funkcijas ir kainą. Žemiau rasite mūsų redakcijos pasirinkimus ir detalų palyginimą.
                </p>
                <p className="text-[11px] text-muted-foreground/50 mb-7 flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  Šiame puslapyje yra affiliate nuorodų. Tai neturi įtakos mūsų vertinimams.
                </p>

                {/* Jump nav */}
                <nav className="flex flex-wrap gap-2" aria-label="Greitoji navigacija">
                  {jumpLinks.map(link => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        className="text-xs font-heading font-medium px-3 py-1.5 rounded-md bg-secondary/60 text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-200 inline-flex items-center gap-1.5"
                      >
                        <Icon className="w-3 h-3" />
                        {link.label}
                      </a>
                    );
                  })}
                </nav>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ═══ 2. TRUST STATS STRIP ═══ */}
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            {[
              { value: products.length.toString(), label: 'Programų palyginta', icon: BarChart3 },
              { value: featureCols.length.toString(), label: 'Vertinimo kategorijų', icon: Layers },
              { value: '4', label: 'Palaikomų platformų', icon: Monitor },
              { value: updatedLabel, label: 'Paskutinis atnaujinimas', icon: Clock },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="rounded-xl border border-border/40 bg-card/60 p-4 text-center glow-border">
                  <Icon className="w-4 h-4 text-primary mx-auto mb-2" />
                  <p className="font-heading font-bold text-foreground text-lg tabular-nums">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* ═══ 3. TOP PICKS ═══ */}
        {topPicks.length > 0 && (
          <section id="top-picks" className="mb-16 scroll-mt-8">
            <ScrollReveal>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Redakcijos pasirinkimai</h2>
                  <p className="text-muted-foreground text-sm max-w-lg">Šios programos šiandien siūlo geriausią apsaugos, funkcijų ir kainos derinį.</p>
                </div>
              </div>
            </ScrollReveal>

            <div className="space-y-3">
              {topPicks.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 60}>
                  <div className={`relative rounded-xl border bg-card p-5 md:p-6 glow-border glow-border-hover transition-all duration-300 ${i === 0 ? 'border-accent/30' : 'border-border/50'}`}>
                    {i === 0 && (
                      <div className="absolute -top-px left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
                    )}

                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                      {/* Rank + Logo */}
                      <div className="flex items-center gap-4 md:min-w-[220px]">
                        <span className="font-heading font-bold text-2xl tabular-nums text-muted-foreground/30 w-8 text-center shrink-0">
                          {i + 1}
                        </span>
                        <ProductLogo product={product} size={48} />
                        <div>
                          <h3 className="font-heading font-bold text-foreground text-base leading-tight">{product.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{product.bestFor}</p>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="md:text-center shrink-0">
                        <RatingBadge rating={product.rating} size="md" />
                      </div>

                      {/* Verdict */}
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1 min-w-0">
                        {product.verdict || product.shortDescription}
                      </p>

                      {/* Price + CTA */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-heading font-semibold text-foreground whitespace-nowrap">{product.pricingSummary}</p>
                          {product.freeVersion && (
                            <p className="text-[10px] text-[hsl(var(--success))] font-medium mt-0.5">Yra nemokama versija</p>
                          )}
                        </div>
                        <AffiliateButton product={product} className="px-5 py-2.5 text-sm" />
                      </div>
                    </div>

                    {/* Quick features row */}
                    <div className="mt-4 pt-3 border-t border-border/30 flex flex-wrap gap-x-5 gap-y-1">
                      {featureCols.map(col => {
                        const val = product.features[col.key];
                        return (
                          <span key={col.key} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            {val === true ? <Check className="w-3 h-3 text-[hsl(var(--success))]" /> : val === false ? <X className="w-3 h-3 text-muted-foreground/25" /> : null}
                            {col.label}
                            {typeof val === 'string' && <span className="text-foreground/70">{val}</span>}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* ═══ 4. FULL COMPARISON TABLE ═══ */}
        {products.length > 0 && (
          <section id="palyginimas" className="mb-16 scroll-mt-8">
            <ScrollReveal>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Detalus palyginimas</h2>
              <p className="text-muted-foreground text-sm mb-6 max-w-lg">Visų vertinamų programų funkcijų ir kainų palyginimas vienoje lentelėje.</p>
            </ScrollReveal>

            {/* Desktop table */}
            <ScrollReveal>
              <div className="hidden md:block overflow-x-auto rounded-xl border border-border/60 bg-card glow-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-secondary/30">
                      <th className="text-left p-4 font-heading font-semibold text-foreground">Programa</th>
                      <th className="text-center p-4 font-heading font-semibold text-foreground">Įvertinimas</th>
                      <th className="text-center p-4 font-heading font-semibold text-foreground">Kaina</th>
                      <th className="text-center p-4 font-heading font-semibold text-foreground">Nemokama</th>
                      {featureCols.map(col => (
                        <th key={col.key} className="text-center p-4 font-heading font-semibold text-foreground whitespace-nowrap">{col.label}</th>
                      ))}
                      <th className="p-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, i) => (
                      <tr key={product.id} className={`${i < products.length - 1 ? 'border-b border-border/40' : ''} hover:bg-secondary/20 transition-colors duration-150`}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <ProductLogo product={product} size={32} />
                            <div>
                              <p className="font-heading font-semibold text-foreground">{product.name}</p>
                              <p className="text-[11px] text-muted-foreground">{product.bestFor}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center"><RatingBadge rating={product.rating} size="sm" /></td>
                        <td className="p-4 text-center text-muted-foreground whitespace-nowrap">{product.pricingSummary}</td>
                        <td className="p-4 text-center"><FeatureIcon value={product.freeVersion} /></td>
                        {featureCols.map(col => (
                          <td key={col.key} className="p-4 text-center">
                            <FeatureIcon value={product.features[col.key] ?? false} />
                          </td>
                        ))}
                        <td className="p-4">
                          <AffiliateButton product={product} variant="outline" className="px-3 py-1.5 text-xs" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile: stacked cards */}
              <div className="md:hidden space-y-3">
                {products.map((product) => {
                  const isExpanded = expandedRow === product.id;
                  return (
                    <div key={product.id} className="rounded-xl border border-border/50 bg-card glow-border overflow-hidden">
                      <button
                        onClick={() => setExpandedRow(isExpanded ? null : product.id)}
                        className="w-full p-4 flex items-center gap-3 text-left"
                      >
                        <ProductLogo product={product} size={36} />
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-semibold text-foreground text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.pricingSummary}</p>
                        </div>
                        <RatingBadge rating={product.rating} size="sm" />
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 border-t border-border/30 space-y-3">
                          <p className="text-xs text-muted-foreground">{product.bestFor}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {featureCols.map(col => (
                              <div key={col.key} className="flex items-center gap-2 text-xs">
                                <FeatureIcon value={product.features[col.key] ?? false} />
                                <span className="text-muted-foreground">{col.label}</span>
                              </div>
                            ))}
                            <div className="flex items-center gap-2 text-xs">
                              <FeatureIcon value={product.freeVersion} />
                              <span className="text-muted-foreground">Nemokama versija</span>
                            </div>
                          </div>
                          <AffiliateButton product={product} className="px-4 py-2 text-xs w-full justify-center" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>
          </section>
        )}

        {/* ═══ 5. METHODOLOGY ═══ */}
        <section className="mb-16 scroll-mt-8">
          <ScrollReveal>
            <div className="rounded-xl border border-border/40 bg-card/60 p-7 md:p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground mb-1">Kaip vertiname antivirusines programas</h2>
                  <p className="text-sm text-muted-foreground">Kiekviena programa vertinama pagal keturis pagrindinius kriterijus, remiantis praktine naudojimo patirtimi.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Apsaugos efektyvumas', desc: 'Kenkėjiškos programinės įrangos aptikimo tikslumas, zero-day grėsmių atpažinimas ir realaus laiko apsaugos veiksmingumas kasdienio naudojimo metu.', icon: Shield },
                  { title: 'Poveikis sistemos našumui', desc: 'Kaip programa veikia kompiuterio ar telefono greitį: paleidimo laikas, programų atidarymas, failų kopijavimas ir baterijos suvartojimas.', icon: Zap },
                  { title: 'Papildomos funkcijos', desc: 'VPN, slaptažodžių tvarkyklė, tamsaus interneto stebėjimas, tėvų kontrolė — kiek realu papildomos vertės gauname už kainą.', icon: Layers },
                  { title: 'Kainos ir vertės santykis', desc: 'Pirmo metų ir atnaujinimo kaina, įrenginių skaičius, nemokamos versijos galimybės ir bandomojo laikotarpio trukmė.', icon: BarChart3 },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="rounded-lg bg-secondary/30 p-4 flex gap-3">
                      <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <h3 className="font-heading font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-muted-foreground/50 mt-6">Mūsų redakcija yra nepriklausoma. Affiliate partnerystės neįtakoja vertinimų ar rekomendacijų eiliškumo.</p>
            </div>
          </ScrollReveal>
        </section>

        {/* ═══ 6. BEST BY USE CASE ═══ */}
        <section id="pagal-poreiki" className="mb-16 scroll-mt-8">
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Geriausia antivirusinė pagal poreikį</h2>
            <p className="text-muted-foreground text-sm mb-8 max-w-lg">Ne visiems tinka tas pats sprendimas — štai konkrečios rekomendacijos pagal jūsų situaciją.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {useCases.map((uc, i) => {
              const matched = findProduct(uc.matchKey);
              const Icon = uc.icon;
              return (
                <ScrollReveal key={i} delay={i * 50}>
                  <div className="rounded-xl border border-border/40 bg-card p-5 glow-border-hover transition-all duration-300 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4.5 h-4.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-bold text-foreground text-sm">{uc.title}</h3>
                      </div>
                      <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded shrink-0">
                        {uc.tag}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">{uc.description}</p>

                    {matched && (
                      <div className="flex items-center gap-3 pt-3 border-t border-border/30">
                        <ProductLogo product={matched} size={32} />
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-semibold text-foreground text-sm">{matched.name}</p>
                          <div className="flex items-center gap-2">
                            <RatingBadge rating={matched.rating} size="sm" />
                            <span className="text-xs text-muted-foreground">{matched.pricingSummary}</span>
                          </div>
                        </div>
                        <AffiliateButton product={matched} variant="outline" className="px-3 py-1.5 text-xs" />
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* ═══ 7. FREE VS PAID ═══ */}
        <section id="nemokama-vs-mokama" className="mb-16 scroll-mt-8">
          <ScrollReveal>
            <div className="rounded-xl border border-border/40 bg-card/60 p-7 md:p-10">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Nemokama ar mokama antivirusinė?</h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mb-8">
                Pasirinkimas priklauso nuo jūsų poreikių. Štai aiškus dviejų variantų palyginimas.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Free */}
                <div className="rounded-lg border border-border/40 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-heading font-bold text-foreground">Nemokama versija</h3>
                  </div>
                  <ul className="space-y-2.5 text-sm mb-4">
                    {[
                      { good: true, text: 'Bazinė apsauga nuo virusų ir kenkėjiškų programų' },
                      { good: true, text: 'Pakankama lengvam, atsargiam naršymui' },
                      { good: true, text: 'Jokių finansinių įsipareigojimų' },
                      { good: false, text: 'Ribota arba jokia techninė pagalba' },
                      { good: false, text: 'Be VPN, slaptažodžių tvarkyklės ir tėvų kontrolės' },
                      { good: false, text: 'Kai kurios rodo reklamas ar siūlo atnaujinti' },
                    ].map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        {item.good
                          ? <CheckCircle2 className="w-4 h-4 text-[hsl(var(--success))] mt-0.5 shrink-0" />
                          : <XCircle className="w-4 h-4 text-muted-foreground/35 mt-0.5 shrink-0" />}
                        <span className="text-muted-foreground">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-muted-foreground/60">Tinka: vienam įrenginiui, studentams, atsargiam naudojimui.</p>
                </div>
                {/* Paid */}
                <div className="rounded-lg border border-primary/20 p-5 bg-primary/[0.02]">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-4 h-4 text-primary" />
                    <h3 className="font-heading font-bold text-foreground">Mokama versija</h3>
                  </div>
                  <ul className="space-y-2.5 text-sm mb-4">
                    {[
                      { good: true, text: 'Pažangus grėsmių aptikimas ir proaktyvi prevencija' },
                      { good: true, text: 'VPN, slaptažodžių tvarkyklė, tamsaus interneto stebėjimas' },
                      { good: true, text: 'Kelių įrenginių apsauga viena licencija (3–15 įr.)' },
                      { good: true, text: 'Tėvų kontrolė ir šeimos planai' },
                      { good: true, text: 'Prioritetinė techninė pagalba' },
                      { good: false, text: 'Kainuoja 20–60 €/metus (su pirmo metų nuolaida)' },
                    ].map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        {item.good
                          ? <CheckCircle2 className="w-4 h-4 text-[hsl(var(--success))] mt-0.5 shrink-0" />
                          : <XCircle className="w-4 h-4 text-muted-foreground/35 mt-0.5 shrink-0" />}
                        <span className="text-muted-foreground">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-muted-foreground/60">Tinka: šeimoms, nuotoliniam darbui, kelių įrenginių naudotojams, verslo poreikiams.</p>
                </div>
              </div>

              {/* Internal links */}
              <div className="mt-7 pt-5 border-t border-border/30">
                <p className="text-xs font-heading font-semibold text-foreground mb-3">Gilesnės apžvalgos:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { path: '/antivirusines-programos/nemokamos', label: 'Nemokamos antivirusinės' },
                    { path: '/antivirusines-programos/telefonui', label: 'Antivirusinė telefonui' },
                    { path: '/antivirusines-programos/kompiuteriui', label: 'Antivirusinė kompiuteriui' },
                  ].map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="text-xs font-heading font-medium px-3 py-1.5 rounded-md bg-secondary/60 text-primary hover:bg-primary/10 transition-colors duration-200 inline-flex items-center gap-1"
                    >
                      {link.label}
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ═══ 8. HOW TO CHOOSE ═══ */}
        <section id="kaip-pasirinkti" className="mb-16 scroll-mt-8">
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-5">Kaip pasirinkti tinkamą antivirusinę</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { step: '1', title: 'Įvertinkite savo poreikius', desc: 'Kiek įrenginių norite apsaugoti? Ar naudojate viešus Wi-Fi tinklus? Ar turite vaikų, kuriems reikia tėvų kontrolės? Atsakymai padės susiaurinti pasirinkimą.' },
                { step: '2', title: 'Palyginkite funkcijas ir kainas', desc: 'Naudokite mūsų palyginimo lentelę. Atkreipkite dėmesį ne tik į kainą, bet ir į atnaujinimo kainą po pirmo metų bei įrenginių skaičių licencijoje.' },
                { step: '3', title: 'Išbandykite prieš pirkdami', desc: 'Beveik visos mokamos antivirusinės siūlo 14–30 dienų bandomąjį laikotarpį arba nemokamą versiją. Išbandykite bent 2–3 programas prieš galutinį sprendimą.' },
              ].map((item, i) => (
                <div key={i} className="rounded-xl border border-border/40 bg-card p-5 glow-border">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 font-heading font-bold text-primary text-sm mb-3">{item.step}</span>
                  <h3 className="font-heading font-bold text-foreground text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 prose-article max-w-2xl">
              <p className="text-muted-foreground leading-relaxed text-sm">
                Svarbu ne tik pasirinkti programą, bet ir laikytis bazinių saugumo taisyklių: neatidaryti įtartinų nuorodų, reguliariai atnaujinti operacinę sistemą, naudoti skirtingus slaptažodžius ir aktyvuoti dviejų veiksnių autentifikavimą svarbiausiose paskyrose.
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* ═══ 9. FAQ ═══ */}
        <section id="duk" className="mb-16 scroll-mt-8">
          <ScrollReveal>
            <FAQAccordion items={category.faq.length > 0 ? category.faq : pillarFaq} title="Dažnai užduodami klausimai" />
          </ScrollReveal>
        </section>

        {/* ═══ 10. RELATED ARTICLES ═══ */}
        {categoryArticles.length > 0 && (
          <section className="mb-14">
            <ScrollReveal>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Susiję straipsniai</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categoryArticles.map((a, i) => (
                <ScrollReveal key={a.path} delay={i * 70}>
                  <ArticleCard article={a} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* ═══ 11. RELATED GUIDES ═══ */}
        <section className="mb-14">
          <ScrollReveal>
            <div className="rounded-xl border border-border/40 bg-card/60 p-6 md:p-8">
              <h2 className="font-heading text-lg font-bold text-foreground mb-5">Kiti naudingi gidai</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {relatedGuides.map(guide => (
                  <Link
                    key={guide.path}
                    to={guide.path}
                    className="flex items-start gap-3 rounded-lg p-3 bg-secondary/20 hover:bg-primary/10 transition-colors duration-200 group"
                  >
                    <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                    <div>
                      <span className="text-sm text-foreground font-medium block">{guide.label}</span>
                      <span className="text-[11px] text-muted-foreground">{guide.desc}</span>
                    </div>
                  </Link>
                ))}
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
