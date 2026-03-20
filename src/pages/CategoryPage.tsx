import { useLocation } from 'react-router-dom';
import PageLayout from '@/components/site/PageLayout';
import Breadcrumbs from '@/components/site/Breadcrumbs';
import ScrollReveal from '@/components/site/ScrollReveal';
import ArticleCard from '@/components/content/ArticleCard';
import ComparisonTable from '@/components/content/ComparisonTable';
import FAQAccordion from '@/components/content/FAQAccordion';
import TrustDisclosure from '@/components/content/TrustDisclosure';
import { categories, articles, comparisonProducts } from '@/data/mockData';

const CategoryPage = () => {
  const { pathname } = useLocation();
  const cleanPath = pathname.replace(/\/$/, '');
  const category = categories[cleanPath];

  if (!category) {
    return (
      <PageLayout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold">Puslapis nerastas</h1>
        </div>
      </PageLayout>
    );
  }

  const categoryArticles = category.articlePaths.map(p => articles[p]).filter(Boolean);
  const showComparison = cleanPath === '/antivirusines-programos';

  return (
    <PageLayout>
      <div className="container py-8">
        <Breadcrumbs path={cleanPath} />

        <ScrollReveal>
          <div className={`rounded-xl ${category.heroColor} p-8 md:p-12 mb-10`}>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">{category.title}</h1>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">{category.description}</p>
          </div>
        </ScrollReveal>

        {categoryArticles.length > 0 && (
          <section className="mb-12">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-foreground mb-6">Straipsniai ir gidai</h2>
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
