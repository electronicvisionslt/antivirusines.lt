import { Star, ExternalLink, Shield, Search, Users, Smartphone, Monitor, ChevronRight, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import PageLayout from '@/components/site/PageLayout';
import Breadcrumbs from '@/components/site/Breadcrumbs';
import ScrollReveal from '@/components/site/ScrollReveal';
import ComparisonTable from '@/components/content/ComparisonTable';
import FAQAccordion from '@/components/content/FAQAccordion';
import TrustDisclosure from '@/components/content/TrustDisclosure';
import ArticleCard from '@/components/content/ArticleCard';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useComparisonProducts, type PublicProduct } from '@/hooks/usePublicData';
import type { PublicCategory } from '@/types/content';
import { Link } from 'react-router-dom';

interface Props {
  category: PublicCategory;
}

/* ── Helpers ── */

function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-accent font-bold text-sm tabular-nums">
      <Star className="w-4 h-4 fill-accent stroke-accent" />
      {rating.toFixed(1)}
    </span>
  );
}

function ProductCTA({ product, size = 'md' }: { product: PublicProduct; size?: 'sm' | 'md' }) {
  const cls = size === 'sm'
    ? 'px-4 py-2 text-xs'
    : 'px-6 py-3 text-sm';
  if (!product.affiliateUrl) return null;
  return (
    <a
      href={product.affiliateUrl}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      className={`${cls} inline-flex items-center gap-2 bg-accent text-accent-foreground font-heading font-semibold rounded-lg hover:bg-accent/90 transition-all duration-200 active:scale-[0.97] glow-accent`}
    >
      Išbandyti
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
}

/* ── Jump nav ── */
const jumpLinks = [
  { href: '#top-picks', label: 'Geriausi pasirinkimai' },
  { href: '#palyginimas', label: 'Palyginimo lentelė' },
  { href: '#pagal-poreiki', label: 'Pagal poreikį' },
  { href: '#nemokama-vs-mokama', label: 'Nemokama vs mokama' },
  { href: '#duk', label: 'DUK' },
];

/* ── FAQ data ── */
const pillarFaq: { q: string; a: string }[] = [
  { q: 'Ar verta mokėti už antivirusinę programą?', a: 'Taip, jei jums reikia papildomų funkcijų kaip VPN, slaptažodžių tvarkyklė ar šeimos apsauga. Nemokamos versijos užtikrina bazinę apsaugą, tačiau mokamos programos siūlo platesnį saugumo paketą ir geresnę techninę pagalbą.' },
  { q: 'Ar pakanka Windows Defender?', a: 'Windows Defender pastaraisiais metais labai pagerėjo ir užtikrina solidžią bazinę apsaugą. Tačiau trečiųjų šalių antivirusinės programos paprastai geriau aptinka zero-day grėsmes, siūlo daugiau papildomų funkcijų ir turi mažesnį poveikį sistemos našumui.' },
  { q: 'Kokia antivirusinė programa geriausia telefonui?', a: 'Android įrenginiams rekomenduojame Bitdefender Mobile Security arba Norton Mobile Security. iOS sistemoje antivirusinės programos veikia ribočiau dėl Apple apribojimų, tačiau vis tiek naudingos dėl VPN ir apsaugos naršant internete.' },
  { q: 'Ar nemokamos antivirusinės programos yra saugios?', a: 'Žinomos nemokamos antivirusinės kaip Avast Free yra saugios naudoti. Tačiau venkite nežinomų nemokamų programų — kai kurios gali rinkti jūsų duomenis arba rodyti agresyvią reklamą. Visada rinkitės tik patikimų gamintojų nemokamas versijas.' },
  { q: 'Kiek kainuoja gera antivirusinė programa?', a: 'Geros antivirusinės programos kainuoja nuo 20 iki 60 eurų per metus, priklausomai nuo funkcijų paketo ir įrenginių skaičiaus. Dauguma gamintojų siūlo pirmo metų nuolaidą naujems klientams.' },
  { q: 'Ar antivirusinė lėtina kompiuterį?', a: 'Šiuolaikinės antivirusinės programos turi minimalų poveikį kompiuterio našumui. Geriausi sprendimai kaip Bitdefender ir Norton dirba fone beveik nepastebimi. Senesni ar prastesni produktai gali lėtinti sistemą, todėl svarbu rinktis patikrintą sprendimą.' },
];

/* ── Use-case sections ── */
interface UseCaseBlock {
  icon: typeof Shield;
  title: string;
  description: string;
  matchKey: string; // partial match on product.bestFor or product.name
}

const useCases: UseCaseBlock[] = [
  { icon: Shield, title: 'Geriausia visapusiška apsauga', description: 'Pilnas saugumo paketas su VPN, slaptažodžių tvarkykle ir tamsiojo interneto stebėjimu.', matchKey: 'Norton' },
  { icon: Search, title: 'Geriausia nemokama antivirusinė', description: 'Patikima bazinė apsauga be jokių mokesčių — idealu tiems, kurie nenori investuoti.', matchKey: 'Avast' },
  { icon: Users, title: 'Geriausia šeimoms', description: 'Tėvų kontrolė, kelių įrenginių apsauga ir paprasta valdymo sąsaja visai šeimai.', matchKey: 'Norton' },
  { icon: Smartphone, title: 'Geriausia telefonui', description: 'Lengva, baterijos netaušojanti apsauga Android ir iOS įrenginiams.', matchKey: 'Bitdefender' },
  { icon: Monitor, title: 'Geriausia Windows kompiuteriui', description: 'Stipriausias grėsmių aptikimas su mažiausiu poveikiu sistemos veikimui.', matchKey: 'Bitdefender' },
];

/* ── Internal link data ── */
const relatedGuides = [
  { path: '/antivirusines-programos/nemokamos', label: 'Nemokamos antivirusinės programos' },
  { path: '/antivirusines-programos/telefonui', label: 'Antivirusinė programa telefonui' },
  { path: '/antivirusines-programos/kompiuteriui', label: 'Antivirusinė programa kompiuteriui' },
  { path: '/virusai/kas-yra-kompiuterinis-virusas', label: 'Kas yra kompiuterinis virusas?' },
  { path: '/virusai/virusas-telefone', label: 'Kaip pašalinti virusą iš telefono' },
];

/* ═════════════════════════════════════════════ */

const AntivirusLandingPage = ({ category }: Props) => {
  usePageMeta({
    title: category.seoTitle || 'Geriausios antivirusinės programos 2025 — palyginimas ir apžvalgos',
    description: category.metaDescription || 'Nepriklausomos antivirusinių programų apžvalgos ir palyginimas. Raskite geriausią antivirusinę savo kompiuteriui, telefonui ar šeimai.',
    canonicalUrl: category.canonicalUrl || undefined,
  });

  const { data: products = [] } = useComparisonProducts('antivirus');
  const categoryArticles = category.articles || [];

  // Get top 4 for picks
  const topPicks = products.slice(0, 4);

  // Match a product by partial name
  const findProduct = (key: string) => products.find(p => p.name.includes(key) || p.brand.includes(key));

  return (
    <PageLayout>
      <div className="container py-8">
        <Breadcrumbs path={category.path} items={[
          { label: 'Pradžia', path: '/' },
          { label: 'Antivirusinės programos', path: '/antivirusines-programos' },
        ]} />

        {/* ═══ 1. HERO ═══ */}
        <ScrollReveal>
          <section className="relative rounded-2xl overflow-hidden border border-border/40 p-8 md:p-14 mb-14">
            <div className="absolute inset-0 gradient-mesh" />
            <div className="absolute inset-0 bg-card/50" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="relative max-w-3xl">
              <p className="text-[11px] font-heading font-semibold text-primary uppercase tracking-[0.14em] mb-3">Nepriklausomas palyginimas · 2025</p>
              <h1 className="font-heading text-3xl md:text-[2.75rem] font-bold text-foreground leading-[1.12] mb-5">
                Geriausios antivirusinės programos Lietuvai
              </h1>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mb-6">
                Išanalizavome populiariausias antivirusines programas pagal apsaugos lygį, kainą, papildomas funkcijas ir naudojimo paprastumą. Štai mūsų rekomendacijos.
              </p>
              <p className="text-xs text-muted-foreground/60 mb-8">
                * Šiame puslapyje yra affiliate nuorodų. Pirkdami per jas, padedatė palaikyti mūsų projektą be papildomų kaštų jums.
              </p>

              {/* Jump nav */}
              <nav className="flex flex-wrap gap-2" aria-label="Greitoji navigacija">
                {jumpLinks.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-xs font-heading font-medium px-3 py-1.5 rounded-md bg-secondary/60 text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </section>
        </ScrollReveal>

        {/* ═══ 2. TOP PICKS ═══ */}
        {topPicks.length > 0 && (
          <section id="top-picks" className="mb-16 scroll-mt-8">
            <ScrollReveal>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Mūsų geriausi pasirinkimai</h2>
              <p className="text-muted-foreground text-sm mb-8 max-w-xl">Pagal mūsų vertinimą šios programos šiandien siūlo geriausią apsaugos ir kainos santykį.</p>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topPicks.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 70}>
                  <div className="relative rounded-xl border border-border/50 bg-card p-6 glow-border glow-border-hover transition-all duration-300 h-full flex flex-col">
                    {i === 0 && (
                      <span className="absolute -top-3 left-5 text-[10px] font-heading font-bold uppercase tracking-[0.12em] bg-accent text-accent-foreground px-3 py-1 rounded-md">
                        Nr. 1 pasirinkimas
                      </span>
                    )}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-heading font-bold text-foreground text-lg">{product.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{product.bestFor}</p>
                      </div>
                      <RatingStars rating={product.rating} />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{product.verdict || product.shortDescription}</p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-foreground">{product.pricingSummary}</span>
                      <ProductCTA product={product} />
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* ═══ 3. COMPARISON TABLE ═══ */}
        {products.length > 0 && (
          <section id="palyginimas" className="mb-16 scroll-mt-8">
            <ScrollReveal>
              <ComparisonTable products={products} title="Pilnas antivirusinių programų palyginimas" />
            </ScrollReveal>
          </section>
        )}

        {/* ═══ 4. METHODOLOGY ═══ */}
        <section className="mb-16 scroll-mt-8">
          <ScrollReveal>
            <div className="rounded-xl border border-border/40 bg-card/60 p-8 md:p-10">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Kaip vertiname antivirusines programas</h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mb-6">
                Mūsų rekomendacijos grindžiamos praktine naudojimo patirtimi ir nepriklausomų laboratorijų rezultatais. Kiekviena programa vertinama pagal kelis pagrindinius kriterijus.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'Apsaugos lygis', desc: 'Kenkėjiškos programinės įrangos aptikimo tikslumas ir realaus laiko apsaugos veiksmingumas.' },
                  { title: 'Sistemos našumas', desc: 'Poveikis kompiuterio ar telefono greičiui ir baterijos veikimo laikui.' },
                  { title: 'Papildomos funkcijos', desc: 'VPN, slaptažodžių tvarkyklė, tamsaus interneto stebėjimas, tėvų kontrolė.' },
                  { title: 'Kainos ir vertės santykis', desc: 'Ką gaunate už mokamą kainą, ar yra nemokama versija ir bandomasis laikotarpis.' },
                ].map((item, i) => (
                  <div key={i} className="rounded-lg bg-secondary/30 p-4">
                    <h3 className="font-heading font-semibold text-foreground text-sm mb-1.5">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground/60 mt-6">Mūsų redakcija yra nepriklausoma. Affiliate partnerystės neįtakoja vertinimų ar rekomendacijų eiliškumo.</p>
            </div>
          </ScrollReveal>
        </section>

        {/* ═══ 5. BEST BY USE CASE ═══ */}
        <section id="pagal-poreiki" className="mb-16 scroll-mt-8">
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Geriausia antivirusinė pagal poreikį</h2>
            <p className="text-muted-foreground text-sm mb-8 max-w-xl">Ne visiems tinka tas pats sprendimas. Štai mūsų rekomendacijos pagal konkrečius poreikius.</p>
          </ScrollReveal>
          <div className="space-y-4">
            {useCases.map((uc, i) => {
              const matched = findProduct(uc.matchKey);
              const Icon = uc.icon;
              return (
                <ScrollReveal key={i} delay={i * 60}>
                  <div className="rounded-xl border border-border/40 bg-card p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-5 glow-border-hover transition-all duration-300">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-bold text-foreground mb-1">{uc.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{uc.description}</p>
                    </div>
                    {matched && (
                      <div className="shrink-0 flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-heading font-bold text-foreground text-sm">{matched.name}</p>
                          <div className="flex items-center gap-2 justify-end">
                            <RatingStars rating={matched.rating} />
                            <span className="text-xs text-muted-foreground">{matched.pricingSummary}</span>
                          </div>
                        </div>
                        <ProductCTA product={matched} size="sm" />
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* ═══ 6. FREE VS PAID ═══ */}
        <section id="nemokama-vs-mokama" className="mb-16 scroll-mt-8">
          <ScrollReveal>
            <div className="rounded-xl border border-border/40 bg-card/60 p-8 md:p-10">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Nemokama ar mokama antivirusinė?</h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mb-8">
                Tai vienas dažniausiai užduodamų klausimų. Trumpas atsakymas — priklauso nuo jūsų poreikių ir rizikos lygio.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Free column */}
                <div className="rounded-lg border border-border/40 p-6">
                  <h3 className="font-heading font-bold text-foreground mb-3">Nemokama versija</h3>
                  <ul className="space-y-2.5 text-sm mb-5">
                    {[
                      { good: true, text: 'Bazinė apsauga nuo virusų ir kenkėjiškų programų' },
                      { good: true, text: 'Pakankama lengvam naudojimui' },
                      { good: true, text: 'Nereikia mokėti' },
                      { good: false, text: 'Ribota techninė pagalba' },
                      { good: false, text: 'Dažnai be VPN ir papildomų funkcijų' },
                      { good: false, text: 'Gali rodyti reklamas' },
                    ].map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        {item.good
                          ? <CheckCircle2 className="w-4 h-4 text-[hsl(var(--success))] mt-0.5 shrink-0" />
                          : <XCircle className="w-4 h-4 text-muted-foreground/40 mt-0.5 shrink-0" />}
                        <span className="text-muted-foreground">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground">Tinka: lengvam naudojimui, vienam įrenginiui, studentams.</p>
                </div>
                {/* Paid column */}
                <div className="rounded-lg border border-primary/20 p-6 bg-primary/[0.02]">
                  <h3 className="font-heading font-bold text-foreground mb-3">Mokama versija</h3>
                  <ul className="space-y-2.5 text-sm mb-5">
                    {[
                      { good: true, text: 'Pažangus grėsmių aptikimas ir prevencija' },
                      { good: true, text: 'VPN, slaptažodžių tvarkyklė, tamsaus interneto stebėjimas' },
                      { good: true, text: 'Kelių įrenginių apsauga' },
                      { good: true, text: 'Tėvų kontrolė ir šeimos planai' },
                      { good: true, text: 'Prioritetinė techninė pagalba 24/7' },
                      { good: false, text: 'Kainuoja 20–60 €/metus' },
                    ].map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        {item.good
                          ? <CheckCircle2 className="w-4 h-4 text-[hsl(var(--success))] mt-0.5 shrink-0" />
                          : <XCircle className="w-4 h-4 text-muted-foreground/40 mt-0.5 shrink-0" />}
                        <span className="text-muted-foreground">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground">Tinka: šeimoms, nuotoliniam darbui, kelių įrenginių naudotojams.</p>
                </div>
              </div>

              {/* Internal links */}
              <div className="mt-8 pt-6 border-t border-border/40">
                <p className="text-sm font-heading font-semibold text-foreground mb-3">Skaitykite daugiau:</p>
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

        {/* ═══ 7. DECISION GUIDE ═══ */}
        <section className="mb-16 scroll-mt-8">
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Kaip pasirinkti antivirusinę programą</h2>
            <div className="prose-article max-w-2xl">
              <p className="text-muted-foreground leading-relaxed mb-5">
                Renkantis antivirusinę programą, pirmiausia atsakykite sau į kelis klausimus: kiek įrenginių norite apsaugoti, ar naudojate viešus Wi-Fi tinklus, ar turite vaikų, kuriems reikia tėvų kontrolės.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Jei naudojate tik vieną Windows kompiuterį ir naršote atsargiai — nemokama antivirusinė gali pakakti. Bet jei dirbate nuotoliniu būdu, jungiatės prie viešų tinklų ar norite apsaugoti visą šeimą — investicija į mokamą sprendimą atsiperka per pirmas savaites.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Svarbu ne tik pasirinkti programą, bet ir laikytis bazinių saugumo taisyklių: neatidaryti įtartinų nuorodų, reguliariai atnaujinti programinę įrangą ir naudoti skirtingus slaptažodžius kiekvienai paskyrai.
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* ═══ 8. FAQ ═══ */}
        <section id="duk" className="mb-16 scroll-mt-8">
          <ScrollReveal>
            <FAQAccordion items={category.faq.length > 0 ? category.faq : pillarFaq} title="Dažnai užduodami klausimai" />
          </ScrollReveal>
        </section>

        {/* ═══ 9. RELATED ARTICLES ═══ */}
        {categoryArticles.length > 0 && (
          <section className="mb-14">
            <ScrollReveal>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Susiję straipsniai ir gidai</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categoryArticles.map((a, i) => (
                <ScrollReveal key={a.path} delay={i * 80}>
                  <ArticleCard article={a} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* ═══ RELATED GUIDES (internal links) ═══ */}
        <section className="mb-14">
          <ScrollReveal>
            <div className="rounded-xl border border-border/40 bg-card/60 p-6 md:p-8">
              <h2 className="font-heading text-lg font-bold text-foreground mb-4">Kiti naudingų gidai</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedGuides.map(guide => (
                  <Link
                    key={guide.path}
                    to={guide.path}
                    className="flex items-center gap-3 rounded-lg p-3 bg-secondary/20 hover:bg-primary/10 transition-colors duration-200 group"
                  >
                    <ArrowRight className="w-4 h-4 text-primary shrink-0 group-hover:translate-x-0.5 transition-transform duration-200" />
                    <span className="text-sm text-foreground font-medium">{guide.label}</span>
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
