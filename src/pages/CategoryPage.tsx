import PageLayout from '@/components/site/PageLayout';
import Breadcrumbs from '@/components/site/Breadcrumbs';
import ScrollReveal from '@/components/site/ScrollReveal';
import ArticleCard from '@/components/content/ArticleCard';
import FAQAccordion from '@/components/content/FAQAccordion';
import TrustDisclosure from '@/components/content/TrustDisclosure';
import AntivirusLandingPage from '@/pages/AntivirusLandingPage';
import FreeAntivirusLandingPage from '@/pages/FreeAntivirusLandingPage';
import MobileAntivirusLandingPage from '@/pages/MobileAntivirusLandingPage';
import DesktopAntivirusLandingPage from '@/pages/DesktopAntivirusLandingPage';
import ParentalControlLandingPage from '@/pages/ParentalControlLandingPage';
import { usePageMeta } from '@/hooks/usePageMeta';
import type { PublicCategory } from '@/types/content';

interface Props {
  category: PublicCategory;
}

const CategoryPage = ({ category }: Props) => {
  if (category.path === '/antivirusines-programos') {
    return <AntivirusLandingPage category={category} />;
  }
  if (category.path === '/antivirusines-programos/nemokamos') {
    return <FreeAntivirusLandingPage category={category} />;
  }
  if (category.path === '/antivirusines-programos/telefonui') {
    return <MobileAntivirusLandingPage category={category} />;
  }
  if (category.path === '/antivirusines-programos/kompiuteriui') {
    return <DesktopAntivirusLandingPage category={category} />;
  }
  if (category.path === '/tevu-kontrole') {
    return <ParentalControlLandingPage category={category} />;
  }

  usePageMeta({
    title: category.seoTitle || category.title,
    description: category.metaDescription || category.description,
    canonicalUrl: category.canonicalUrl || undefined,
    noindex: category.noindex,
  });

  const categoryArticles = category.articles || [];

  return (
    <PageLayout>
      <div className="container py-8">
        <Breadcrumbs path={category.path} items={[
          { label: 'Pradžia', path: '/' },
          { label: category.title, path: category.path },
        ]} />

        <ScrollReveal>
          <div className="mb-10 max-w-2xl">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3">{category.title}</h1>
            <p className="text-muted-foreground leading-relaxed">{category.description}</p>
          </div>
        </ScrollReveal>

        {categoryArticles.length > 0 && (
          <section className="mb-12">
            <ScrollReveal>
              <h2 className="font-heading text-xl font-bold text-foreground mb-5">Straipsniai ir gidai</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryArticles.map((a, i) => (
                <ScrollReveal key={a.path} delay={i * 70}>
                  <ArticleCard article={a} />
                </ScrollReveal>
              ))}
            </div>
          </section>
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
