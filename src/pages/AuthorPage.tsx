import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import PageLayout from '@/components/site/PageLayout';
import Breadcrumbs from '@/components/site/Breadcrumbs';
import ScrollReveal from '@/components/site/ScrollReveal';
import ArticleCard from '@/components/content/ArticleCard';
import { usePublicAuthor } from '@/hooks/usePublicData';
import { usePageMeta } from '@/hooks/usePageMeta';

const AuthorPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: author, isLoading } = usePublicAuthor(slug || '');

  usePageMeta({
    title: author?.seoTitle || author?.name || 'Autorius',
    description: author?.metaDescription || author?.bio || undefined,
  });

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container py-16 flex justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  if (!author) {
    return (
      <PageLayout>
        <div className="container py-16 text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground">Autorius nerastas</h1>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container py-8">
        <Breadcrumbs path={`/autoriai/${author.slug}`} />

        <ScrollReveal>
          <div className="mb-10 flex flex-col sm:flex-row items-start gap-5">
            <div className="w-16 h-16 rounded-xl bg-primary/8 border border-primary/12 text-primary text-xl font-heading font-bold flex items-center justify-center shrink-0">
              {author.initials}
            </div>
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">{author.name}</h1>
              <p className="text-muted-foreground leading-relaxed mb-3 max-w-xl">{author.bio}</p>
              <div className="flex flex-wrap gap-1.5">
                {author.expertise.map(e => (
                  <span key={e} className="text-xs px-2.5 py-1 rounded-full bg-muted border border-border/50 text-muted-foreground font-medium">{e}</span>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {author.articles && author.articles.length > 0 && (
          <section>
            <ScrollReveal>
              <h2 className="font-heading text-xl font-bold text-foreground mb-5">Straipsniai</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {author.articles.map((a, i) => (
                <ScrollReveal key={a.path} delay={i * 70}>
                  <ArticleCard article={a} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
};

export default AuthorPage;
