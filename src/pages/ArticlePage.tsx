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
import { toWebpPath } from '@/lib/articleImageContent';
import type { PublicArticle } from '@/types/content';

interface Props {
  article: PublicArticle;
}

const ArticlePage = ({ article }: Props) => {
  const { data: articleProducts } = useArticleProducts(article.id);

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

        {article.featuredImage && (
          <ScrollReveal>
            <div className="rounded-xl overflow-hidden border border-border/50 mb-8 max-w-3xl">
              <picture>
                <source srcSet={toWebpPath(article.featuredImage)} type="image/webp" />
                <img
                  src={article.featuredImage}
                  alt={article.featuredImageAlt || article.title}
                  className="w-full h-auto object-cover"
                />
              </picture>
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <div className="mb-10 max-w-3xl">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4" itemProp="headline">
              {article.title}
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-5" itemProp="description">{article.excerpt}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground/70">
              {author && <AuthorBox author={author} compact />}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <time itemProp="dateModified" dateTime={article.updatedAt}>Atnaujinta: {article.updatedAt}</time>
              </span>
              {article.readTime && (
                <>
                  <span className="text-border">·</span>
                  <span>{article.readTime} skaitymo</span>
                </>
              )}
            </div>
          </div>
        </ScrollReveal>

        {article.featuredImage && (
          <ScrollReveal>
            <div className="rounded-xl overflow-hidden border border-border/50 mb-10 max-w-3xl">
              <picture>
                <source srcSet={toWebpPath(article.featuredImage)} type="image/webp" />
                <img
                  src={article.featuredImage}
                  alt={article.featuredImageAlt || article.title}
                  className="w-full h-auto object-cover"
                />
              </picture>
            </div>
          </ScrollReveal>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10">
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

            {articleProducts && articleProducts.length > 0 && (
              <ScrollReveal>
                <AffiliateCTA
                  productName={articleProducts[0].name}
                  description={articleProducts[0].shortDescription}
                  price={articleProducts[0].pricingSummary}
                  affiliateUrl={articleProducts[0].affiliateUrl}
                  ctaText="Išbandyti dabar"
                />
              </ScrollReveal>
            )}

            <div className="prose-article">
              {article.sections.map((section, i) => (
                <ScrollReveal key={section.id} delay={i * 50}>
                  <h2 id={section.id}>{section.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: section.content }} />
                  {/* Insert mid-article CTA after 2nd section */}
                  {i === 1 && articleProducts && articleProducts.length > 0 && (
                    <AffiliateCTA
                      productName={articleProducts[0].name}
                      description={articleProducts[0].shortDescription}
                      price={articleProducts[0].pricingSummary}
                      affiliateUrl={articleProducts[0].affiliateUrl}
                      ctaText="Gauti geriausią kainą"
                    />
                  )}
                </ScrollReveal>
              ))}

              {article.body && article.sections.length === 0 && (
                <ScrollReveal>
                  <div dangerouslySetInnerHTML={{ __html: article.body }} />
                </ScrollReveal>
              )}
            </div>

            {article.pros && article.cons && article.pros.length > 0 && article.cons.length > 0 && (
              <ScrollReveal>
                <ProsConsList pros={article.pros} cons={article.cons} />
              </ScrollReveal>
            )}

            {article.verdict && (
              <ScrollReveal>
                <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-5 my-8">
                  <div className="flex gap-3">
                    <div className="w-1 rounded-full bg-primary/40 shrink-0" />
                    <div>
                      <h3 className="font-heading font-semibold text-foreground mb-2">Mūsų verdiktas</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{article.verdict}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {articleProducts && articleProducts.length > 0 && (
              <ScrollReveal>
                <AffiliateCTA
                  productName={articleProducts[0].name}
                  description={articleProducts[0].shortDescription}
                  price={articleProducts[0].pricingSummary}
                  affiliateUrl={articleProducts[0].affiliateUrl}
                />
              </ScrollReveal>
            )}

            {article.faq.length > 0 && (
              <ScrollReveal>
                <FAQAccordion items={article.faq} />
              </ScrollReveal>
            )}

            {author && (
              <ScrollReveal>
                <section className="my-10">
                  <h2 className="font-heading text-lg font-bold text-foreground mb-4">Apie autorių</h2>
                  <AuthorBox author={author} />
                </section>
              </ScrollReveal>
            )}

            {article.relatedPaths && article.relatedPaths.length > 0 && (
              <ScrollReveal>
                <RelatedArticles paths={article.relatedPaths} />
              </ScrollReveal>
            )}
          </div>

          {showToc && (
            <aside className="hidden lg:block">
              <div className="sticky top-20">
                <TableOfContents items={article.sections.map(s => ({ id: s.id, title: s.title }))} />
                <div className="mt-5">
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
