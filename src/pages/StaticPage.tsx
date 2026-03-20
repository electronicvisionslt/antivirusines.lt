import { useLocation } from 'react-router-dom';
import PageLayout from '@/components/site/PageLayout';
import Breadcrumbs from '@/components/site/Breadcrumbs';
import ScrollReveal from '@/components/site/ScrollReveal';
import { staticPages } from '@/data/mockData';

const StaticPage = () => {
  const { pathname } = useLocation();
  const cleanPath = pathname.replace(/\/$/, '');
  const page = staticPages[cleanPath];

  if (!page) {
    return (
      <PageLayout>
        <div className="container py-16 text-center">
          <h1 className="font-heading text-2xl font-bold">Puslapis nerastas</h1>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container py-8">
        <Breadcrumbs path={cleanPath} />
        <ScrollReveal>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-8">{page.title}</h1>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <div
            className="prose-article max-w-3xl"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </ScrollReveal>
      </div>
    </PageLayout>
  );
};

export default StaticPage;