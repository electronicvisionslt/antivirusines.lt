import PageLayout from '@/components/site/PageLayout';
import Breadcrumbs, { type BreadcrumbItem } from '@/components/site/Breadcrumbs';
import ScrollReveal from '@/components/site/ScrollReveal';
import ArticleCard from '@/components/content/ArticleCard';
import ComparisonTable from '@/components/content/ComparisonTable';
import FAQAccordion from '@/components/content/FAQAccordion';
import TrustDisclosure from '@/components/content/TrustDisclosure';
import { usePageMeta } from '@/hooks/usePageMeta';
import { comparisonProducts } from '@/data/mockData';
import type { PublicCategory } from '@/types/content';

interface Props {
  category: PublicCategory;
}

const CategoryPage = ({ category }: Props) => {
  usePageMeta({
    title: category.seoTitle || category.title,
    description: category.metaDescription || category.description,
    canonicalUrl: category.canonicalUrl || undefined,
    noindex: category.noindex,
  });

  const showComparison = category.path === '/antivirusines-programos';
  const categoryArticles = category.articles || [];

  return (
    <PageLayout>
      <div className="container py-8">
        <Breadcrumbs path={category.path} />

        <ScrollReveal>
          <div className="relative rounded-2xl overflow-hidden border border-border/40 p-8 md:p-12 mb-12">
            <div className="absolute inset-0 gradient-mesh" />
            <div className="absolute inset-0 bg-card/40" />
            <div className="relative">
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">{category.title}</h1>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">{category.description}</p>
            </div>
          </div>
        </ScrollReveal>

        {categoryArticles.length > 0 && (
          <section className="mb-14">
            <ScrollReveal>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Straipsniai ir gidai</h2>
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

        {showComparison && (
          <ScrollReveal>
            <ComparisonTable products={comparisonProducts} />
          </ScrollReveal>
        )}

        {category.faq.length > 0 && (
          <ScrollReveal>
            <FAQAccordion items={category.faq} />
          </ScrollReveal>
        )}

        <ScrollReveal>
          <TrustDisclosure />
        </ScrollReveal>
      </div>
    </PageLayout>
  );
};

export default CategoryPage;
