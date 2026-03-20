import { useParams } from 'react-router-dom';
import PageLayout from '@/components/site/PageLayout';
import Breadcrumbs from '@/components/site/Breadcrumbs';
import ScrollReveal from '@/components/site/ScrollReveal';
import ArticleCard from '@/components/content/ArticleCard';
import { authors, getArticlesByAuthor } from '@/data/mockData';

const AuthorPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const author = slug ? authors[slug] : undefined;

  if (!author) {
    return (
      <PageLayout>
        <div className="container py-16 text-center">
          <h1 className="font-heading text-2xl font-bold">Autorius nerastas</h1>
        </div>
      </PageLayout>
    );
  }

  const authorArticles = getArticlesByAuthor(author.slug);

  return (
    <PageLayout>
      <div className="container py-8">
        <Breadcrumbs path={`/autoriai/${author.slug}`} />

        <ScrollReveal>
          <div className="relative rounded-2xl overflow-hidden border border-border/40 p-8 md:p-10 mb-12">
            <div className="absolute inset-0 gradient-mesh opacity-60" />
            <div className="absolute inset-0 bg-card/40" />
            <div className="relative flex flex-col sm:flex-row items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/15 text-primary text-2xl font-heading font-bold flex items-center justify-center shrink-0">
                {author.initials}
              </div>
              <div>
                <h1 className="font-heading text-3xl font-bold text-foreground mb-2">{author.name}</h1>
                <p className="text-muted-foreground leading-relaxed mb-4 max-w-xl">{author.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {author.expertise.map(e => (
                    <span key={e} className="text-xs px-3 py-1 rounded-full bg-secondary border border-border/50 text-secondary-foreground font-medium">{e}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {authorArticles.length > 0 && (
          <section>
            <ScrollReveal>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Straipsniai</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {authorArticles.map((a, i) => (
                <ScrollReveal key={a.path} delay={i * 80}>
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