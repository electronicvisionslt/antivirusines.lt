import { Link } from 'react-router-dom';
import { ArrowRight, Shield, TrendingUp } from 'lucide-react';
import PageLayout from '@/components/site/PageLayout';
import ScrollReveal from '@/components/site/ScrollReveal';
import CategoryCard from '@/components/content/CategoryCard';
import ArticleCard from '@/components/content/ArticleCard';
import ComparisonTable from '@/components/content/ComparisonTable';
import TrustDisclosure from '@/components/content/TrustDisclosure';
import { articles, comparisonProducts } from '@/data/mockData';

const featuredPaths = [
  '/antivirusines-programos/nemokamos',
  '/antivirusines-programos/kompiuteriui',
  '/tevu-kontrole/vaiko-telefone',
];

const latestPaths = [
  '/virusai/kompiuterinis-virusas',
  '/virusai/virusas-telefone',
  '/saugumo-patarimai/saugus-darbas-kompiuteriu',
  '/antivirusines-programos/telefonui',
];

const categoryLinks = [
  { path: '/antivirusines-programos', title: 'Antivirusinės programos', description: 'Apžvalgos, palyginimai ir rekomendacijos geriausiai apsaugai.' },
  { path: '/tevu-kontrole', title: 'Tėvų kontrolė', description: 'Sprendimai ir patarimai vaikų saugumui internete.' },
  { path: '/slaptazodziu-saugumas', title: 'Slaptažodžių saugumas', description: 'Kaip kurti, saugoti ir tvarkyti saugius slaptažodžius.' },
  { path: '/virusai/kompiuterinis-virusas', title: 'Virusai ir grėsmės', description: 'Gidai apie kompiuterinius ir mobiliuosius virusus.' },
  { path: '/saugumo-patarimai/saugus-darbas-kompiuteriu', title: 'Saugumo patarimai', description: 'Praktiniai kibernetinio saugumo patarimai kiekvienam.' },
];

const HomePage = () => (
  <PageLayout>
    {/* Hero */}
    <section className="bg-card border-b">
      <div className="container py-16 md:py-24">
        <ScrollReveal>
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-sm text-primary font-medium mb-4">
              <Shield className="w-4 h-4" />
              <span>Nepriklausomos apžvalgos nuo 2024</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-[1.1] tracking-tight mb-5">
              Apsaugokite savo skaitmeninį pasaulį
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
              Objektyvios antivirusinių programų apžvalgos, saugumo gidai ir patarimai — viskas lietuvių kalba, be reklaminės šiukšlės.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/antivirusines-programos"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors active:scale-[0.97] text-sm"
              >
                Antivirusinių apžvalgos
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/saugumo-patarimai/saugus-darbas-kompiuteriu"
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 transition-colors active:scale-[0.97] text-sm"
              >
                Saugumo patarimai
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Categories */}
    <section className="container py-14">
      <ScrollReveal>
        <h2 className="text-2xl font-bold text-foreground mb-6">Tyrinėkite pagal temą</h2>
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoryLinks.map((cat, i) => (
          <ScrollReveal key={cat.path} delay={i * 80}>
            <CategoryCard {...cat} />
          </ScrollReveal>
        ))}
      </div>
    </section>

    {/* Featured articles */}
    <section className="container py-14">
      <ScrollReveal>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Populiariausi straipsniai</h2>
          <Link to="/antivirusines-programos" className="text-sm text-primary font-medium hover:underline hidden sm:inline-flex items-center gap-1">
            Visi straipsniai <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </ScrollReveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {featuredPaths.map((p, i) => {
          const a = articles[p];
          return a ? (
            <ScrollReveal key={p} delay={i * 100}>
              <ArticleCard article={a} />
            </ScrollReveal>
          ) : null;
        })}
      </div>
    </section>

    {/* Comparison */}
    <section className="container py-14">
      <ScrollReveal>
        <ComparisonTable products={comparisonProducts} />
      </ScrollReveal>
    </section>

    {/* Latest guides */}
    <section className="bg-card border-y">
      <div className="container py-14">
        <ScrollReveal>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Naujausi gidai</h2>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {latestPaths.map((p, i) => {
            const a = articles[p];
            return a ? (
              <ScrollReveal key={p} delay={i * 80}>
                <ArticleCard article={a} />
              </ScrollReveal>
            ) : null;
          })}
        </div>
      </div>
    </section>

    {/* Trust */}
    <section className="container py-14">
      <ScrollReveal>
        <TrustDisclosure />
      </ScrollReveal>
    </section>
  </PageLayout>
);

export default HomePage;
