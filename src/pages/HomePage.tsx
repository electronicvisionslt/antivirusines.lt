import { Link } from 'react-router-dom';
import { ArrowRight, Shield, TrendingUp, Sparkles } from 'lucide-react';
import PageLayout from '@/components/site/PageLayout';
import ScrollReveal from '@/components/site/ScrollReveal';
import CategoryCard from '@/components/content/CategoryCard';
import ArticleCard from '@/components/content/ArticleCard';
import ComparisonTable from '@/components/content/ComparisonTable';
import TrustDisclosure from '@/components/content/TrustDisclosure';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useHomepageArticles } from '@/hooks/usePublicData';
import { articles as mockArticles, authors as mockAuthors, comparisonProducts } from '@/data/mockData';
import type { PublicArticle } from '@/types/content';

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

function mockToPublic(path: string): PublicArticle | null {
  const mock = mockArticles[path];
  if (!mock) return null;
  const author = mockAuthors[mock.authorSlug];
  return {
    slug: mock.slug,
    path: mock.path,
    title: mock.title,
    excerpt: mock.excerpt,
    authorSlug: mock.authorSlug,
    authorName: author?.name || '',
    authorInitials: author?.initials || '',
    categoryPath: mock.categoryPath,
    updatedAt: mock.updatedAt,
    readTime: mock.readTime,
    sections: [],
    faq: [],
  };
}

const HomePage = () => {
  usePageMeta({
    title: 'Antivirusinių programų apžvalgos ir saugumo gidai',
    description: 'Nepriklausomos antivirusinių programų apžvalgos, saugumo gidai ir patarimai lietuvių kalba.',
  });

  const { data: dbArticles } = useHomepageArticles();

  // Use DB articles if available, otherwise mock
  const featured = dbArticles
    ? dbArticles.slice(0, 3)
    : featuredPaths.map(mockToPublic).filter(Boolean) as PublicArticle[];

  const latest = dbArticles
    ? dbArticles.slice(3, 7)
    : latestPaths.map(mockToPublic).filter(Boolean) as PublicArticle[];

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[100px] animate-pulse-glow" />
        <div className="container relative py-20 md:py-28">
          <ScrollReveal>
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-heading font-semibold text-primary uppercase tracking-[0.12em] mb-5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/10">
                <Shield className="w-3.5 h-3.5" />
                <span>Nepriklausomos apžvalgos nuo 2024</span>
              </div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-foreground leading-[1.08] tracking-tight mb-6">
                Apsaugokite savo
                <br />
                <span className="text-gradient-primary">skaitmeninį pasaulį</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
                Objektyvios antivirusinių programų apžvalgos, saugumo gidai ir patarimai — viskas lietuvių kalba, be reklaminės šiukšlės.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/antivirusines-programos"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-heading font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200 active:scale-[0.97] text-sm shadow-lg shadow-primary/20"
                >
                  Antivirusinių apžvalgos
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/saugumo-patarimai/saugus-darbas-kompiuteriu"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-secondary border border-border/60 text-secondary-foreground font-heading font-semibold rounded-lg hover:bg-secondary/80 hover:border-border transition-all duration-200 active:scale-[0.97] text-sm"
                >
                  Saugumo patarimai
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16">
        <ScrollReveal>
          <div className="flex items-center gap-2.5 mb-7">
            <Sparkles className="w-5 h-5 text-primary/60" />
            <h2 className="font-heading text-2xl font-bold text-foreground">Tyrinėkite pagal temą</h2>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryLinks.map((cat, i) => (
            <ScrollReveal key={cat.path} delay={i * 70}>
              <CategoryCard {...cat} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Featured articles */}
      <section className="container py-16">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-7">
            <h2 className="font-heading text-2xl font-bold text-foreground">Populiariausi straipsniai</h2>
            <Link to="/antivirusines-programos" className="text-sm text-primary font-heading font-medium hover:underline hidden sm:inline-flex items-center gap-1 transition-colors duration-200">
              Visi straipsniai <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((a, i) => (
            <ScrollReveal key={a.path} delay={i * 90}>
              <ArticleCard article={a} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="container py-16">
        <ScrollReveal>
          <ComparisonTable products={comparisonProducts} />
        </ScrollReveal>
      </section>

      {/* Latest guides */}
      <section className="relative border-y border-border/30">
        <div className="absolute inset-0 bg-card/30" />
        <div className="container relative py-16">
          <ScrollReveal>
            <div className="flex items-center gap-2.5 mb-7">
              <TrendingUp className="w-5 h-5 text-primary/60" />
              <h2 className="font-heading text-2xl font-bold text-foreground">Naujausi gidai</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {latest.map((a, i) => (
              <ScrollReveal key={a.path} delay={i * 70}>
                <ArticleCard article={a} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="container py-16">
        <ScrollReveal>
          <TrustDisclosure />
        </ScrollReveal>
      </section>
    </PageLayout>
  );
};

export default HomePage;
