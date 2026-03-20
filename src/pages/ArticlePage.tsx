import { Calendar } from 'lucide-react';
import PageLayout from '@/components/site/PageLayout';
import Breadcrumbs, { type BreadcrumbItem } from '@/components/site/Breadcrumbs';
import ScrollReveal from '@/components/site/ScrollReveal';
import TableOfContents from '@/components/content/TableOfContents';
import AuthorBox from '@/components/content/AuthorBox';
import ProsConsList from '@/components/content/ProsConsList';
import AffiliateCTA from '@/components/content/AffiliateCTA';
import FAQAccordion from '@/components/content/FAQAccordion';
import RelatedArticles from '@/components/content/RelatedArticles';
import TrustDisclosure from '@/components/content/TrustDisclosure';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useArticleProducts } from '@/hooks/usePublicData';
import type { PublicArticle } from '@/types/content';

interface Props {
  article: PublicArticle;
}

const ArticlePage = ({ article }: Props) => {
  usePageMeta({
    title: article.seoTitle || article.title,
    description: article.metaDescription || article.excerpt,
    canonicalUrl: article.canonicalUrl || undefined,
    ogTitle: article.ogTitle || article.title,
    ogDescription: article.ogDescription || article.excerpt,
    ogImage: article.ogImage || undefined,
    noindex: article.noindex,
  });

  const author = article.authorName
    ? {
        slug: article.authorSlug,
        name: article.authorName,
        initials: article.authorInitials || '',
        bio: article.authorBio || '',
        expertise: article.authorExpertise || [],
      }
    : null;

  const showToc = article.showToc !== false && article.sections.length > 1;

  // Build breadcrumbs with human-readable labels
  const breadcrumbItems: BreadcrumbItem[] = [{ label: 'Pradžia', path: '/' }];
  if (article.categoryPath) {
    breadcrumbItems.push({
      label: article.categoryTitle || article.categoryPath.split('/').filter(Boolean).pop() || '',
      path: article.categoryPath,
    });
  }
  breadcrumbItems.push({ label: article.title, path: article.path });

  return (
    <PageLayout>
      <article className="container py-8" itemScope itemType="https://schema.org/Article">
        <Breadcrumbs path={article.path} items={breadcrumbItems} />

        <ScrollReveal>
          {/* Hero */}
          <div className="relative rounded-2xl overflow-hidden border border-border/40 p-8 md:p-12 mb-10">
            {article.featuredImage ? (
              <img
                src={article.featuredImage}
                alt={article.featuredImageAlt || article.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 gradient-mesh" />
            )}
            <div className="absolute inset-0 bg-card/40" />
            <div className="relative">
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4" itemProp="headline">
                {article.title}
              </h1>
              <p className="text-muted-foreground max-w-2xl leading-relaxed mb-6" itemProp="description">{article.excerpt}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground/70">
                {author && <AuthorBox author={author} compact />}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <time itemProp="dateModified" dateTime={article.updatedAt}>Atnaujinta: {article.updatedAt}</time>
                </span>
                <span className="text-muted-foreground/40">·</span>
                <span>{article.readTime} skaitymo</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
          <div>
            <ScrollReveal>
              <TrustDisclosure compact />
            </ScrollReveal>

            {showToc && (
              <ScrollReveal>
                <div className="lg:hidden">
                  <TableOfContents items={article.sections.map(s => ({ id: s.id, title: s.title }))} />
                </div>
              </ScrollReveal>
            )}

            {/* Article body - sections */}
            <div className="prose-article">
              {article.sections.map((section, i) => (
                <ScrollReveal key={section.id} delay={i * 60}>
                  <h2 id={section.id}>{section.title}</h2>
                  <p>{section.content}</p>
                </ScrollReveal>
              ))}

              {/* If body field exists (from CMS), render it */}
              {article.body && article.sections.length === 0 && (
                <ScrollReveal>
                  <div dangerouslySetInnerHTML={{ __html: article.body }} />
                </ScrollReveal>
              )}
            </div>

            {/* Pros/Cons */}
            {article.pros && article.cons && article.pros.length > 0 && article.cons.length > 0 && (
              <ScrollReveal>
                <ProsConsList pros={article.pros} cons={article.cons} />
              </ScrollReveal>
            )}

            {/* Verdict */}
            {article.verdict && (
              <ScrollReveal>
                <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-6 my-8 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/60 via-primary/30 to-transparent" />
                  <h3 className="font-heading font-semibold text-foreground mb-2 pl-3">Mūsų verdiktas</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-3">{article.verdict}</p>
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
                  <h2 className="font-heading text-xl font-bold text-foreground mb-4">Apie autorių</h2>
                  <AuthorBox author={author} />
                </section>
              </ScrollReveal>
            )}

            {/* Related */}
            {article.relatedPaths && article.relatedPaths.length > 0 && (
              <ScrollReveal>
                <RelatedArticles paths={article.relatedPaths} />
              </ScrollReveal>
            )}
          </div>

          {/* Sidebar TOC (desktop) */}
          {showToc && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <TableOfContents items={article.sections.map(s => ({ id: s.id, title: s.title }))} />
                <div className="mt-6">
                  <TrustDisclosure compact />
                </div>
              </div>
            </aside>
          )}
        </div>
      </article>
    </PageLayout>
  );
};

export default ArticlePage;
