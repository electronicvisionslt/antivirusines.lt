import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Sparkles } from 'lucide-react';
import PageLayout from '@/components/site/PageLayout';
import ScrollReveal from '@/components/site/ScrollReveal';
import CategoryCard from '@/components/content/CategoryCard';
import ArticleCard from '@/components/content/ArticleCard';
import ComparisonTable from '@/components/content/ComparisonTable';
import TrustDisclosure from '@/components/content/TrustDisclosure';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useHomepageArticles, useComparisonProducts } from '@/hooks/usePublicData';

const categoryLinks = [
  { path: '/antivirusines-programos', title: 'Antivirusinės programos', description: 'Apžvalgos, palyginimai ir rekomendacijos geriausiai apsaugai.' },
  { path: '/tevu-kontrole', title: 'Tėvų kontrolė', description: 'Sprendimai ir patarimai vaikų saugumui internete.' },
  { path: '/slaptazodziu-saugumas', title: 'Slaptažodžių saugumas', description: 'Kaip kurti, saugoti ir tvarkyti saugius slaptažodžius.' },
  { path: '/virusai/kompiuterinis-virusas', title: 'Virusai ir grėsmės', description: 'Gidai apie kompiuterinius ir mobiliuosius virusus.' },
];

const HomePage = () => {
  usePageMeta({
    title: 'Antivirusinių programų apžvalgos ir saugumo gidai',
    description: 'Nepriklausomos antivirusinių programų apžvalgos, saugumo gidai ir patarimai lietuvių kalba.',
  });

  const { data: dbArticles } = useHomepageArticles();
  const { data: comparisonProducts } = useComparisonProducts();

  const allArticles = dbArticles || [];
  const featured = allArticles.slice(0, 3);
  const latest = allArticles.slice(3, 7);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="container relative py-16 md:py-24">
          <ScrollReveal>
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-[11px] font-heading font-semibold text-primary uppercase tracking-[0.12em] mb-4 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/12">
                <Shield className="w-3.5 h-3.5" />
                <span>Nepriklausomos apžvalgos nuo 2024</span>
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-foreground leading-[1.08] tracking-tight mb-5">
                Apsaugokite savo
                <br />
                <span className="text-gradient-primary">skaitmeninį pasaulį</span>
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed mb-7 max-w-xl">
                Objektyvios antivirusinių programų apžvalgos, saugumo gidai ir patarimai — viskas lietuvių kalba, be reklaminės šiukšlės.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/antivirusines-programos"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-heading font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200 active:scale-[0.97] text-sm shadow-sm"
                >
                  Antivirusinių apžvalgos
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/virusai/kompiuterinis-virusas"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-card border border-border/60 text-foreground font-heading font-semibold rounded-lg hover:bg-muted/60 transition-all duration-200 active:scale-[0.97] text-sm"
                >
                  Virusai ir grėsmės
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-14">
        <ScrollReveal>
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4.5 h-4.5 text-primary/50" />
            <h2 className="font-heading text-xl font-bold text-foreground">Tyrinėkite pagal temą</h2>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categoryLinks.map((cat, i) => (
            <ScrollReveal key={cat.path} delay={i * 60}>
              <CategoryCard {...cat} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Featured articles */}
      {featured.length > 0 && (
        <section className="container py-14">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold text-foreground">Populiariausi straipsniai</h2>
              <Link to="/antivirusines-programos" className="text-sm text-primary font-heading font-medium hover:underline hidden sm:inline-flex items-center gap-1">
                Visi straipsniai <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((a, i) => (
              <ScrollReveal key={a.path} delay={i * 80}>
                <ArticleCard article={a} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* Comparison */}
      {comparisonProducts && comparisonProducts.length > 0 && (
        <section className="container py-14">
          <ScrollReveal>
            <ComparisonTable products={comparisonProducts} />
          </ScrollReveal>
        </section>
      )}

      {/* Latest guides */}
      {latest.length > 0 && (
        <section className="border-y border-border/40 bg-muted/30">
          <div className="container py-14">
            <ScrollReveal>
              <h2 className="font-heading text-xl font-bold text-foreground mb-6">Naujausi gidai</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {latest.map((a, i) => (
                <ScrollReveal key={a.path} delay={i * 60}>
                  <ArticleCard article={a} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust */}
      <section className="container py-14">
        <ScrollReveal>
          <TrustDisclosure />
        </ScrollReveal>
      </section>
    </PageLayout>
  );
};

export default HomePage;
