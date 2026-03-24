import { Link } from 'react-router-dom';
import {
  ArrowRight, Shield, Sparkles, Smartphone, Monitor, Users, Key, Bug,
  CheckCircle2, Award, Zap, Lock, Eye, TrendingUp, Star, ChevronRight,
  ShieldCheck, Globe, Heart, ExternalLink,
} from 'lucide-react';
import PageLayout from '@/components/site/PageLayout';
import ScrollReveal from '@/components/site/ScrollReveal';
import ParticleGrid from '@/components/site/ParticleGrid';
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
  },
  {
    icon: Users,
    title: 'Tėvų kontrolė',
    desc: 'Geriausios programėlės vaikų apsaugai internete — ekrano laiko valdymas, turinio filtravimas.',
    path: '/tevu-kontrole',
  },
  {
    icon: Key,
    title: 'Slaptažodžių saugumas',
    desc: 'Kaip kurti stiprius slaptažodžius, naudoti tvarkykles ir apsaugoti paskyras.',
    path: '/slaptazodziu-saugumas',
  },
  {
    icon: Bug,
    title: 'Virusai ir grėsmės',
    desc: 'Kas yra kompiuterinis virusas, kaip veikia malware ir kaip nuo jų apsisaugoti.',
    path: '/virusai/kompiuterinis-virusas',
  },
];

/* ── Why trust us ── */
const trustPoints = [
  { icon: Eye, title: 'Aiškūs kriterijai', desc: 'Lyginame apsaugą, funkcijas, kainą ir naudojimo paprastumą.' },
  { icon: ShieldCheck, title: 'Patikimi šaltiniai', desc: 'Remiamės žinomų testavimo laboratorijų ir stiprių rinkos šaltinių duomenimis.' },
  { icon: Globe, title: 'Pritaikyta Lietuvai', desc: 'Informaciją pateikiame aiškiai, lietuviškai ir pagal vietinei auditorijai aktualius poreikius.' },
  { icon: TrendingUp, title: 'Turinį peržiūrime reguliariai', desc: 'Atnaujiname puslapius, kai keičiasi kainos, funkcijos ar svarbūs testų rezultatai.' },
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
      <section className="relative overflow-hidden">
        {/* Animated particle grid + gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 gradient-mesh-animated opacity-60" />
          <ParticleGrid />
        </div>

        {/* Floating shield icons */}
        <div className="absolute inset-0 pointer-events-none hidden md:block" aria-hidden="true">
          <Shield className="absolute top-[18%] right-[12%] w-8 h-8 text-primary/[0.08] float-slow" />
          <Lock className="absolute top-[35%] right-[8%] w-6 h-6 text-primary/[0.06] float-medium" style={{ animationDelay: '1s' }} />
          <ShieldCheck className="absolute top-[22%] right-[28%] w-10 h-10 text-primary/[0.07] float-fast" style={{ animationDelay: '2s' }} />
          <Key className="absolute top-[55%] right-[15%] w-5 h-5 text-primary/[0.05] float-slow" style={{ animationDelay: '0.5s' }} />
          <Eye className="absolute top-[45%] right-[30%] w-7 h-7 text-primary/[0.06] float-medium" style={{ animationDelay: '3s' }} />
          <Globe className="absolute top-[65%] right-[22%] w-6 h-6 text-primary/[0.05] float-fast" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="container relative pt-20 pb-16 md:pt-28 md:pb-24 lg:pt-36 lg:pb-28">
          <ScrollReveal>
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-[11px] font-heading font-semibold text-primary uppercase tracking-[0.14em] mb-6 px-3.5 py-2 rounded-full bg-primary/[0.06] border border-primary/10">
                <Shield className="w-3.5 h-3.5" />
                <span>Nepriklausomos apžvalgos · 2026</span>
              </div>
              <h1 className="font-heading text-[2.5rem] md:text-[3.25rem] lg:text-[3.75rem] font-extrabold text-foreground leading-[1.06] tracking-[-0.025em] mb-6">
                Raskite geriausią{' '}
                <span className="text-gradient-primary">kibernetinę apsaugą</span>
              </h1>
              <p className="text-base md:text-[1.125rem] text-muted-foreground leading-[1.7] mb-10 max-w-lg">
                Objektyvūs antivirusinių programų palyginimai, saugumo gidai ir patarimai — viskas lietuvių kalba.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/antivirusines-programos"
                  className="group inline-flex items-center gap-2.5 px-6 py-3 bg-primary text-primary-foreground font-heading font-semibold rounded-xl hover:bg-primary/90 transition-all duration-200 active:scale-[0.97] text-sm shadow-md shadow-primary/15"
                >
                  Peržiūrėti Top 5
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/antivirusines-programos/nemokamos"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border/60 text-foreground font-heading font-semibold rounded-xl hover:border-primary/25 hover:bg-primary/[0.03] transition-all duration-200 active:scale-[0.97] text-sm elevation-1"
                >
                  Nemokamos alternatyvos
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom divider */}
        <div className="section-divider" />
      </section>

      {/* ═══ THREAT STATS BAR ═══ */}
      <section className="bg-card/80 backdrop-blur-sm">
        <div className="container py-10 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {threatStats.map((stat, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-destructive/[0.07] border border-destructive/10 flex items-center justify-center shrink-0">
                    <stat.icon className="w-[18px] h-[18px] text-destructive/80" />
                  </div>
                  <div>
                    <p className="font-heading text-2xl md:text-[1.75rem] font-extrabold text-foreground leading-none mb-1.5 tracking-tight">{stat.value}</p>
                    <p className="text-xs text-muted-foreground leading-snug">{stat.label}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
        <div className="section-divider" />
      </section>

      {/* ═══ CONTENT HUBS ═══ */}
      <section className="container py-16 md:py-24">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="section-label inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tyrinėkite pagal temą</span>
            </div>
            <h2 className="font-heading text-[1.75rem] md:text-[2.125rem] font-bold text-foreground tracking-tight">Kibernetinio saugumo centras</h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto text-[0.9375rem] leading-relaxed">Pasirinkite sritį, kuri jus domina — kiekviena tema turi detalius gidus ir palyginimus.</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {hubCards.map((hub, i) => (
            <ScrollReveal key={hub.path} delay={i * 70}>
              <Link to={hub.path} className="group block h-full">
                <div className="relative rounded-2xl border border-border/50 bg-card p-6 md:p-7 transition-all duration-300 hover:border-primary/20 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] h-full flex flex-col elevation-1">
                  {hub.tag && (
                    <span className="absolute top-5 right-5 text-[10px] font-heading font-bold text-primary bg-primary/[0.07] border border-primary/12 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {hub.tag}
                    </span>
                  )}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/[0.07] border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shrink-0">
                      <hub.icon className="w-[22px] h-[22px]" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3 className="font-heading font-bold text-foreground text-[1.125rem] group-hover:text-primary transition-colors duration-200 leading-tight mb-1.5">
                        {hub.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{hub.desc}</p>
                    </div>
                  </div>


                  <div className="inline-flex items-center gap-1.5 text-sm font-heading font-semibold text-primary mt-auto pt-5 pl-16 group-hover:gap-2.5 transition-all duration-200">
                    Skaityti daugiau
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══ TOP 3 QUICK PREVIEW ═══ */}
      {top3.length > 0 && (
        <section className="relative">
          <div className="section-divider" />
          <div className="bg-gradient-to-b from-muted/40 via-muted/20 to-transparent">
            <div className="container py-16 md:py-24">
              <ScrollReveal>
                <div className="text-center mb-12">
                  <div className="section-label inline-flex items-center gap-2 mb-4">
                    <Award className="w-3.5 h-3.5" />
                    <span>2026 m. lyderiai</span>
                  </div>
                  <h2 className="font-heading text-[1.75rem] md:text-[2.125rem] font-bold text-foreground tracking-tight">Top 3 antivirusinės programos</h2>
                  <p className="text-muted-foreground mt-3 max-w-md mx-auto text-[0.9375rem] leading-relaxed">Greitas žvilgsnis į geriausius sprendimus — detalus palyginimas laukia antivirusinių puslapyje.</p>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {top3.map((product, i) => (
                  <ScrollReveal key={product.id} delay={i * 100}>
                    <div className={`relative rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] h-full flex flex-col ${
                      i === 0 ? 'border-primary/25 elevation-primary' : 'border-border/50 elevation-1'
                    }`}>
                      {i === 0 && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[10px] font-heading font-bold text-primary-foreground bg-primary px-4 py-1.5 rounded-full shadow-md shadow-primary/20 uppercase tracking-wider">
                          🥇 Nr. 1 pasirinkimas
                        </div>
                      )}

                      <div className="flex items-center gap-3.5 mb-5 mt-1">
                        <div className="w-12 h-12 rounded-xl bg-muted/50 border border-border/40 flex items-center justify-center overflow-hidden shrink-0">
                          <ProductLogo product={product} size={32} />
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-foreground text-[0.9375rem] mb-0.5">{product.name}</h3>
                          <RatingStars rating={product.rating} />
                        </div>
                      </div>

                      <p className="text-[0.8125rem] text-muted-foreground mb-4 leading-relaxed line-clamp-2">{product.shortDescription}</p>

                      <div className="space-y-2 mb-5 flex-1">
                        {product.pros.slice(0, 3).map((pro, j) => (
                          <div key={j} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                            <span className="text-[0.8125rem] text-foreground leading-snug">{pro}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-auto">
                        <span className="text-xs text-muted-foreground font-medium">{product.pricingSummary}</span>
                        <AffiliateButton product={product} className="text-xs px-4 py-2 rounded-lg" />
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal delay={350}>
                <div className="text-center mt-10">
                  <Link
                    to="/antivirusines-programos"
                    className="group inline-flex items-center gap-2.5 px-6 py-3 bg-primary text-primary-foreground font-heading font-semibold rounded-xl hover:bg-primary/90 transition-all duration-200 active:scale-[0.97] text-sm shadow-md shadow-primary/15"
                  >
                    Žiūrėti visą Top 5 sąrašą
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* ═══ WHY TRUST US ═══ */}
      <section className="container py-16 md:py-24">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="section-label inline-flex items-center gap-2 mb-4">
              <Heart className="w-3.5 h-3.5" />
              <span>Mūsų požiūris</span>
            </div>
            <h2 className="font-heading text-[1.75rem] md:text-[2.125rem] font-bold text-foreground tracking-tight">Kaip atrenkame rekomendacijas?</h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trustPoints.map((point, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="rounded-2xl border border-border/50 bg-card p-6 text-center hover:border-primary/15 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] transition-all duration-300 elevation-1 h-full flex flex-col">
                <div className="w-12 h-12 rounded-2xl bg-primary/[0.07] border border-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <point.icon className="w-[22px] h-[22px]" />
                </div>
                <h3 className="font-heading font-bold text-foreground text-[0.9375rem] mb-2">{point.title}</h3>
                <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">{point.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══ QUICK NAVIGATION STRIP ═══ */}
      <section className="relative">
        <div className="section-divider" />
        <div className="bg-gradient-to-b from-muted/30 to-transparent">
          <div className="container py-12 md:py-16">
            <ScrollReveal>
              <h2 className="font-heading text-xl font-bold text-foreground mb-8 text-center tracking-tight">Populiariausi puslapiai</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
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
                    className="group flex items-center gap-3.5 p-4 rounded-xl border border-border/50 bg-card hover:border-primary/20 hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] transition-all duration-200 elevation-0 hover:elevation-1"
                  >
                    <div className="w-9 h-9 rounded-xl bg-primary/[0.07] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shrink-0">
                      <item.icon className="w-[18px] h-[18px]" />
                    </div>
                    <span className="text-[0.875rem] font-heading font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary ml-auto transition-colors" />
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRUST DISCLOSURE ═══ */}
      <section className="container py-16">
        <ScrollReveal>
          <TrustDisclosure />
        </ScrollReveal>
      </section>
    </PageLayout>
  );
};

export default HomePage;
