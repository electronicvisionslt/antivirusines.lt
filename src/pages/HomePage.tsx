import { Link } from 'react-router-dom';
import {
  ArrowRight, Shield, Sparkles, Smartphone, Monitor, Users, Key, Bug,
  CheckCircle2, Award, Zap, Lock, Eye, TrendingUp, Star, ChevronRight,
  ShieldCheck, Globe, Heart,
} from 'lucide-react';
import PageLayout from '@/components/site/PageLayout';
import ScrollReveal from '@/components/site/ScrollReveal';
import TrustDisclosure from '@/components/content/TrustDisclosure';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useComparisonProducts, type PublicProduct } from '@/hooks/usePublicData';
import { ProductLogo, RatingStars, AffiliateButton } from '@/components/landing/LandingShared';


/* ── Hub cards — main content clusters ── */
const hubCards = [
  {
    icon: Shield,
    title: 'Antivirusinės programos',
    desc: 'Top 5 geriausių antivirusinių 2026 m. su detaliu palyginimu, kainomis ir funkcijomis.',
    path: '/antivirusines-programos',
    tag: 'Populiariausia',
    links: [
      { label: 'Nemokamos antivirusinės', path: '/antivirusines-programos/nemokamos' },
      { label: 'Antivirusinė telefonui', path: '/antivirusines-programos/telefonui' },
      { label: 'Antivirusinė kompiuteriui', path: '/antivirusines-programos/kompiuteriui' },
    ],
  },
  {
    icon: Users,
    title: 'Tėvų kontrolė',
    desc: 'Geriausios programėlės vaikų apsaugai internete — ekrano laiko valdymas, turinio filtravimas.',
    path: '/tevu-kontrole',
    links: [],
  },
  {
    icon: Key,
    title: 'Slaptažodžių saugumas',
    desc: 'Kaip kurti stiprius slaptažodžius, naudoti tvarkykles ir apsaugoti paskyras.',
    path: '/slaptazodziu-saugumas',
    links: [],
  },
  {
    icon: Bug,
    title: 'Virusai ir grėsmės',
    desc: 'Kas yra kompiuterinis virusas, kaip veikia malware ir kaip nuo jų apsisaugoti.',
    path: '/virusai/kompiuterinis-virusas',
    links: [],
  },
];

/* ── Why trust us ── */
const trustPoints = [
  { icon: Eye, title: 'Testuojame realiai', desc: 'Kiekviena programa instaliuojama, tikrinama ir vertinama mūsų komandos.' },
  { icon: ShieldCheck, title: 'Nepriklausomi', desc: 'Jokio gamintojo nerekomenduojame vien už pinigus — tik pagal kokybę.' },
  { icon: Globe, title: 'Lietuvių kalba', desc: 'Visa informacija pritaikyta lietuviškai kalbančiai auditorijai.' },
  { icon: TrendingUp, title: 'Nuolat atnaujiname', desc: 'Duomenys atnaujinami kas ketvirtį pagal naujausius testus.' },
];

/* ── Threat stats ── */
const threatStats = [
  { value: '560M+', label: 'Naujų kenkėjiškų programų 2025 m.', icon: Bug },
  { value: '72%', label: 'Lietuvių patyrė kibernetinę grėsmę', icon: Shield },
  { value: '€4,200', label: 'Vid. nuostoliai nuo sukčiavimo', icon: Lock },
  { value: '43%', label: 'Atakų taikosi į mobiliuosius', icon: Smartphone },
];

const HomePage = () => {
  usePageMeta({
    title: 'Antivirusinių programų apžvalgos ir saugumo gidai 2026',
    description: 'Nepriklausomos antivirusinių programų apžvalgos, palyginimai ir saugumo gidai lietuvių kalba. Raskite geriausią apsaugą savo įrenginiams.',
  });

  const { data: topProducts } = useComparisonProducts('antivirus');
  const top3 = (topProducts || []).slice(0, 3);

  return (
    <PageLayout>
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="container relative py-16 md:py-24 lg:py-28">
          <ScrollReveal>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-[11px] font-heading font-semibold text-primary uppercase tracking-[0.12em] mb-4 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/12">
                <Shield className="w-3.5 h-3.5" />
                <span>Nepriklausomos apžvalgos · Atnaujinta 2026</span>
              </div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-foreground leading-[1.08] tracking-tight mb-5">
                Raskite geriausią
                <br />
                <span className="text-gradient-primary">kibernetinę apsaugą</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
                Objektyvūs antivirusinių programų palyginimai, saugumo gidai ir patarimai — viskas lietuvių kalba, be reklaminės šiukšlės.
              </p>

              {/* Quick winner badges */}
              <div className="flex flex-wrap gap-2 mb-8">
                {quickPicks.map(pick => (
                  <Link
                    key={pick.path}
                    to={pick.path}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-card border border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group"
                  >
                    <span className="text-xs">{pick.label}</span>
                    <span className="text-xs font-heading font-semibold text-foreground">{pick.brand}</span>
                    <ChevronRight className="w-3 h-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/antivirusines-programos"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-heading font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200 active:scale-[0.97] text-sm shadow-sm"
                >
                  Peržiūrėti Top 5
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/antivirusines-programos/nemokamos"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-card border border-border/60 text-foreground font-heading font-semibold rounded-lg hover:bg-muted/60 transition-all duration-200 active:scale-[0.97] text-sm"
                >
                  Nemokamos alternatyvos
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ THREAT STATS BAR ═══ */}
      <section className="border-b border-border/40 bg-card">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {threatStats.map((stat, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-destructive/8 border border-destructive/10 flex items-center justify-center shrink-0">
                    <stat.icon className="w-4 h-4 text-destructive" />
                  </div>
                  <div>
                    <p className="font-heading text-xl md:text-2xl font-extrabold text-foreground leading-none mb-1">{stat.value}</p>
                    <p className="text-[11px] text-muted-foreground leading-snug">{stat.label}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTENT HUBS ═══ */}
      <section className="container py-14 md:py-20">
        <ScrollReveal>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-[11px] font-heading font-semibold text-primary uppercase tracking-[0.12em] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tyrinėkite pagal temą</span>
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Kibernetinio saugumo centras</h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto text-sm">Pasirinkite sritį, kuri jus domina — kiekviena tema turi detalius gidus ir palyginimus.</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hubCards.map((hub, i) => (
            <ScrollReveal key={hub.path} delay={i * 70}>
              <div className="group relative rounded-xl border border-border/50 bg-card p-5 md:p-6 glow-border glow-border-hover transition-all duration-300 hover:shadow-lg">
                {hub.tag && (
                  <span className="absolute top-4 right-4 text-[10px] font-heading font-semibold text-primary bg-primary/8 border border-primary/12 px-2 py-0.5 rounded-full">
                    {hub.tag}
                  </span>
                )}
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shrink-0">
                    <hub.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={hub.path} className="font-heading font-bold text-foreground text-lg group-hover:text-primary transition-colors duration-200 leading-tight">
                      {hub.title}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{hub.desc}</p>
                  </div>
                </div>

                {hub.links.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 pl-[3.75rem]">
                    {hub.links.map(link => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="text-[11px] font-heading font-medium text-muted-foreground hover:text-primary px-2.5 py-1 rounded-md bg-muted/50 hover:bg-primary/8 transition-all duration-200"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}

                <Link
                  to={hub.path}
                  className="inline-flex items-center gap-1.5 text-sm font-heading font-semibold text-primary mt-4 pl-[3.75rem] hover:underline"
                >
                  Skaityti daugiau
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══ TOP 3 QUICK PREVIEW ═══ */}
      {top3.length > 0 && (
        <section className="border-y border-border/40 bg-muted/30">
          <div className="container py-14 md:py-20">
            <ScrollReveal>
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 text-[11px] font-heading font-semibold text-primary uppercase tracking-[0.12em] mb-3">
                  <Award className="w-3.5 h-3.5" />
                  <span>2026 m. lyderiai</span>
                </div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Top 3 antivirusinės programos</h2>
                <p className="text-muted-foreground mt-2 max-w-lg mx-auto text-sm">Greitas žvilgsnis į geriausius sprendimus — detalus palyginimas laukia antivirusinių puslapyje.</p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {top3.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 100}>
                  <div className={`relative rounded-xl border bg-card p-5 transition-all duration-300 hover:shadow-lg ${
                    i === 0 ? 'border-primary/30 shadow-sm' : 'border-border/50'
                  }`}>
                    {i === 0 && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-heading font-bold text-primary-foreground bg-primary px-3 py-1 rounded-full shadow-sm">
                        🥇 Nr. 1 pasirinkimas
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-4 mt-1">
                      <div className="w-10 h-10 rounded-lg bg-muted/60 border border-border/40 flex items-center justify-center overflow-hidden shrink-0">
                        <ProductLogo product={product} size={28} />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-foreground text-sm">{product.name}</h3>
                        <RatingStars rating={product.rating} />
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">{product.shortDescription}</p>

                    <div className="space-y-1.5 mb-4">
                      {product.pros.slice(0, 3).map((pro, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                          <span className="text-xs text-foreground">{pro}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border/40">
                      <span className="text-xs text-muted-foreground">{product.pricingSummary}</span>
                      <AffiliateButton product={product} className="text-xs px-3 py-1.5" />
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={350}>
              <div className="text-center mt-8">
                <Link
                  to="/antivirusines-programos"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-heading font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200 active:scale-[0.97] text-sm shadow-sm"
                >
                  Žiūrėti visą Top 5 sąrašą
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ═══ WHY TRUST US ═══ */}
      <section className="container py-14 md:py-20">
        <ScrollReveal>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-[11px] font-heading font-semibold text-primary uppercase tracking-[0.12em] mb-3">
              <Heart className="w-3.5 h-3.5" />
              <span>Mūsų metodika</span>
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Kodėl mumis pasitikėti?</h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trustPoints.map((point, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="rounded-xl border border-border/50 bg-card p-5 text-center hover:shadow-md transition-all duration-300 glow-border">
                <div className="w-11 h-11 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                  <point.icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-foreground text-sm mb-1">{point.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{point.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══ QUICK NAVIGATION STRIP ═══ */}
      <section className="border-y border-border/40 bg-muted/30">
        <div className="container py-10 md:py-14">
          <ScrollReveal>
            <h2 className="font-heading text-lg font-bold text-foreground mb-6 text-center">Populiariausi puslapiai</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: 'Geriausios antivirusinės 2026', path: '/antivirusines-programos', icon: Award },
              { label: 'Nemokamos antivirusinės', path: '/antivirusines-programos/nemokamos', icon: Zap },
              { label: 'Antivirusinė telefonui', path: '/antivirusines-programos/telefonui', icon: Smartphone },
              { label: 'Antivirusinė kompiuteriui', path: '/antivirusines-programos/kompiuteriui', icon: Monitor },
              { label: 'Tėvų kontrolės programėlės', path: '/tevu-kontrole', icon: Users },
              { label: 'Slaptažodžių saugumas', path: '/slaptazodziu-saugumas', icon: Key },
            ].map((item, i) => (
              <ScrollReveal key={item.path} delay={i * 50}>
                <Link
                  to={item.path}
                  className="group flex items-center gap-3 p-3.5 rounded-lg border border-border/50 bg-card hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shrink-0">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-heading font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary ml-auto transition-colors" />
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST DISCLOSURE ═══ */}
      <section className="container py-14">
        <ScrollReveal>
          <TrustDisclosure />
        </ScrollReveal>
      </section>
    </PageLayout>
  );
};

export default HomePage;
