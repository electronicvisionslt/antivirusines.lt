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
import PasswordSecurityHubPage from '@/pages/PasswordSecurityHubPage';
import PasswordManagerLandingPage from '@/pages/PasswordManagerLandingPage';
import GmailPasswordGuidePage from '@/pages/GmailPasswordGuidePage';
import WifiPasswordGuidePage from '@/pages/WifiPasswordGuidePage';
import ForgotPasswordGuidePage from '@/pages/ForgotPasswordGuidePage';
import ComputerVirusGuidePage from '@/pages/ComputerVirusGuidePage';
import PhoneVirusGuidePage from '@/pages/PhoneVirusGuidePage';
import VirusCheckGuidePage from '@/pages/VirusCheckGuidePage';
import AdwarePhoneGuidePage from '@/pages/AdwarePhoneGuidePage';
import { usePageMeta } from '@/hooks/usePageMeta';
import type { PublicCategory } from '@/types/content';

interface Props {
  category: PublicCategory;
}

/* Map of category paths to their flagship components */
const flagshipPages: Record<string, React.ComponentType<{ category: PublicCategory }>> = {
  '/antivirusines-programos': AntivirusLandingPage,
  '/antivirusines-programos/nemokamos': FreeAntivirusLandingPage,
  '/antivirusines-programos/telefonui': MobileAntivirusLandingPage,
  '/antivirusines-programos/kompiuteriui': DesktopAntivirusLandingPage,
  '/tevu-kontrole': ParentalControlLandingPage,
  '/slaptazodziu-saugumas': PasswordSecurityHubPage,
  '/slaptazodziu-saugumas/slaptazodziu-tvarkykles': PasswordManagerLandingPage,
  '/slaptazodziu-saugumas/kaip-pakeisti-gmail-slaptazodi': GmailPasswordGuidePage,
  '/slaptazodziu-saugumas/kaip-pakeisti-wifi-slaptazodi': WifiPasswordGuidePage,
  '/slaptazodziu-saugumas/ka-daryti-pamirsus-slaptazodi': ForgotPasswordGuidePage,
  '/virusai/kompiuterinis-virusas': ComputerVirusGuidePage,
  '/virusai/virusas-telefone': PhoneVirusGuidePage,
  '/virusai/kaip-patikrinti-ar-kompiuteryje-yra-virusas': VirusCheckGuidePage,
  '/virusai/reklamos-virusas-telefone': AdwarePhoneGuidePage,
};

const GenericCategoryPage = ({ category }: Props) => {
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

const CategoryPage = ({ category }: Props) => {
  const FlagshipComponent = flagshipPages[category.path];

  if (FlagshipComponent) {
    return <FlagshipComponent category={category} />;
  }

  return <GenericCategoryPage category={category} />;
};

export default CategoryPage;
