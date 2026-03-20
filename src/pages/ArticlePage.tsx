import { useLocation } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import PageLayout from '@/components/site/PageLayout';
import Breadcrumbs from '@/components/site/Breadcrumbs';
import ScrollReveal from '@/components/site/ScrollReveal';
import TableOfContents from '@/components/content/TableOfContents';
import AuthorBox from '@/components/content/AuthorBox';
import ProsConsList from '@/components/content/ProsConsList';
import AffiliateCTA from '@/components/content/AffiliateCTA';
import FAQAccordion from '@/components/content/FAQAccordion';
import RelatedArticles from '@/components/content/RelatedArticles';
import TrustDisclosure from '@/components/content/TrustDisclosure';
import { articles, authors } from '@/data/mockData';

const ArticlePage = () => {
  const { pathname } = useLocation();
  const cleanPath = pathname.replace(/\/$/, '');
  const article = articles[cleanPath];

  if (!article) {
    return (
      <PageLayout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold">Straipsnis nerastas</h1>
        </div>
      </PageLayout>
    );
  }

  const author = authors[article.authorSlug];

  return (
    <PageLayout>
      <article className="container py-8" itemScope itemType="https://schema.org/Article">
        <Breadcrumbs path={cleanPath} />

        <ScrollReveal>
          {/* Hero */}
          <div className={`rounded-xl ${article.heroColor} p-8 md:p-12 mb-8`}>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4" itemProp="headline">
              {article.title}
            </h1>
            <p className="text-muted-foreground max-w-2xl leading-relaxed mb-6" itemProp="description">{article.excerpt}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {author && <AuthorBox author={author} compact />}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <time itemProp="dateModified" dateTime={article.updatedAt}>Atnaujinta: {article.updatedAt}</time>
              </span>
              <span>· {article.readTime} skaitymo</span>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
          <div>
            <ScrollReveal>
              <TrustDisclosure compact />
            </ScrollReveal>

            <ScrollReveal>
              <div className="lg:hidden">
                <TableOfContents items={article.sections.map(s => ({ id: s.id, title: s.title }))} />
              </div>
            </ScrollReveal>

            {/* Article body */}
            <div className="prose-article">
              {article.sections.map((section, i) => (
                <ScrollReveal key={section.id} delay={i * 60}>
                  <h2 id={section.id}>{section.title}</h2>
                  <p>{section.content}</p>
                </ScrollReveal>
              ))}
            </div>

            {/* Pros/Cons */}
            {article.pros && article.cons && (
              <ScrollReveal>
                <ProsConsList pros={article.pros} cons={article.cons} />
              </ScrollReveal>
            )}

            {/* Verdict */}
            {article.verdict && (
              <ScrollReveal>
                <div className="rounded-lg border-l-4 border-primary bg-primary/5 p-5 my-8">
                  <h3 className="font-semibold text-foreground mb-2">Mūsų verdiktas</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{article.verdict}</p>
                </div>
              </ScrollReveal>
            )}

            {/* CTA */}
            <ScrollReveal>
              <AffiliateCTA
                productName="Norton 360"
                description="Visapusiška apsauga kompiuteriui, telefonui ir planšetei. Apima antivirusinę, VPN ir slaptažodžių tvarkyklę."
                price="Nuo €29,99/m."
              />
            </ScrollReveal>

            {/* FAQ */}
            {article.faq.length > 0 && (
              <ScrollReveal>
                <FAQAccordion items={article.faq} />
              </ScrollReveal>
            )}

            {/* Author */}
            {author && (
              <ScrollReveal>
                <section className="my-10">
                  <h2 className="text-xl font-bold text-foreground mb-4">Apie autorių</h2>
                  <AuthorBox author={author} />
                </section>
              </ScrollReveal>
            )}

            {/* Related */}
            {article.relatedPaths && (
              <ScrollReveal>
                <RelatedArticles paths={article.relatedPaths} />
              </ScrollReveal>
            )}
          </div>

          {/* Sidebar TOC (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents items={article.sections.map(s => ({ id: s.id, title: s.title }))} />
              <div className="mt-6">
                <TrustDisclosure compact />
              </div>
            </div>
          </aside>
        </div>
      </article>
    </PageLayout>
  );
};

export default ArticlePage;
