import {
  KeyRound, Shield, ChevronRight, CheckCircle2, AlertTriangle,
  Mail, Smartphone, Lock, ArrowRight, Clock, HelpCircle,
  Facebook, Instagram,
} from 'lucide-react';
import PageLayout from '@/components/site/PageLayout';
import Breadcrumbs from '@/components/site/Breadcrumbs';
import FAQAccordion from '@/components/content/FAQAccordion';
import ScrollReveal from '@/components/site/ScrollReveal';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Link } from 'react-router-dom';
import { SectionHeading } from '@/components/landing/LandingShared';
import type { PublicCategory } from '@/types/content';

interface Props { category: PublicCategory }

/* ── Platform recovery guides ── */
const platforms = [
  {
    name: 'Google / Gmail',
    icon: Mail,
    color: 'text-red-500',
    steps: [
      'Eikite į accounts.google.com ir spustelėkite „Prisijungti"',
      'Įveskite savo el. pašto adresą ir spustelėkite „Pamiršote slaptažodį?"',
      'Pasirinkite atkūrimo būdą: SMS kodas, atsarginė el. pašto dėžutė arba Google Authenticator',
      'Įveskite gautą kodą ir sukurkite naują slaptažodį',
    ],
    tip: 'Patarimas: pridėkite atsarginį tel. numerį ir el. paštą Google paskyros nustatymuose iš anksto.',
    url: 'https://accounts.google.com/signin/recovery',
  },
  {
    name: 'Facebook',
    icon: HelpCircle,
    color: 'text-blue-600',
    steps: [
      'Eikite į facebook.com ir spustelėkite „Pamiršote slaptažodį?"',
      'Įveskite el. paštą arba telefono numerį, susietą su paskyra',
      'Pasirinkite, kaip norite gauti atkūrimo kodą (SMS arba el. paštu)',
      'Įveskite kodą ir nustatykite naują slaptažodį',
    ],
    tip: 'Patarimas: jei nebeturite prieigos prie el. pašto ar telefono, naudokite „Identify your account" funkciją su draugų pagalba.',
    url: 'https://www.facebook.com/login/identify',
  },
  {
    name: 'Instagram',
    icon: HelpCircle,
    color: 'text-pink-500',
    steps: [
      'Prisijungimo ekrane spustelėkite „Pamiršote slaptažodį?"',
      'Įveskite vartotojo vardą, el. paštą arba telefono numerį',
      'Pasirinkite atkūrimo būdą — SMS arba el. paštas',
      'Sekite nuorodą el. laiške arba įveskite SMS kodą ir sukurkite naują slaptažodį',
    ],
    tip: 'Patarimas: jei Instagram susietas su Facebook, galite prisijungti per Facebook ir pakeisti slaptažodį Instagram nustatymuose.',
    url: 'https://www.instagram.com/accounts/password/reset/',
  },
  {
    name: 'Apple ID (iCloud)',
    icon: Smartphone,
    color: 'text-gray-700',
    steps: [
      'Eikite į iforgot.apple.com',
      'Įveskite savo Apple ID (el. pašto adresą)',
      'Pasirinkite atkūrimo būdą: SMS, el. paštas arba saugos klausimai',
      'Patvirtinkite tapatybę per dviejų veiksnių autentifikaciją (jei įjungta) ir sukurkite naują slaptažodį',
    ],
    tip: 'Patarimas: jei turite kitą Apple įrenginį, galite atstatyti slaptažodį per Settings → [Jūsų vardas] → Password & Security.',
    url: 'https://iforgot.apple.com',
  },
  {
    name: 'Microsoft (Outlook, Hotmail)',
    icon: Mail,
    color: 'text-blue-500',
    steps: [
      'Eikite į account.live.com ir spustelėkite „Negaliu pasiekti savo paskyros"',
      'Pasirinkite „Pamiršau slaptažodį" ir įveskite el. pašto adresą',
      'Pasirinkite patvirtinimo būdą: SMS, alternatyvus el. paštas arba Microsoft Authenticator',
      'Įveskite saugos kodą ir nustatykite naują slaptažodį',
    ],
    tip: 'Patarimas: jei neturite prieigos prie jokio atkūrimo metodo, užpildykite Microsoft paskyros atkūrimo formą.',
    url: 'https://account.live.com/password/reset',
  },
];

const preventionTips = [
  'Naudokite slaptažodžių tvarkyklę (Bitwarden, 1Password, NordPass) — ji prisimins visus slaptažodžius už jus',
  'Pridėkite atsarginį telefono numerį ir el. paštą prie visų svarbių paskyrų',
  'Įjunkite dviejų veiksnių autentifikaciją (2FA) ir išsaugokite atsarginius kodus',
  'Reguliariai tikrinkite atkūrimo kontaktus — ar telefono numeris ir el. paštas dar veikia',
  'Nesaugokite slaptažodžių tik atmintyje — naudokite įrankius',
];

const faqItems = [
  { q: 'Ką daryti, jei nebeturiu prieigos prie atkūrimo el. pašto ir telefono?', a: 'Dauguma platformų siūlo alternatyvius atkūrimo būdus: tapatybės patvirtinimą dokumentu (Facebook), paskyros atkūrimo formą (Microsoft, Google), arba kreipimąsi į klientų aptarnavimą. Procesas gali užtrukti kelias dienas.' },
  { q: 'Ar galima atkurti slaptažodį be interneto?', a: 'Ne, slaptažodžio atkūrimui visada reikia interneto prieigos, nes patvirtinimo kodai siunčiami el. paštu arba SMS.' },
  { q: 'Kaip apsisaugoti nuo slaptažodžio pamiršimo ateityje?', a: 'Geriausias būdas — naudoti slaptažodžių tvarkyklę. Ji saugiai saugo visus slaptažodžius ir jums tereikia prisiminti vieną pagrindinį (master) slaptažodį.' },
  { q: 'Ar saugumo klausimų atsakymai turi būti teisingi?', a: 'Ne! Saugumo ekspertai rekomenduoja naudoti neteisingus, bet įsimenamus atsakymus. Pvz., į klausimą „Kokiame mieste gimėte?" atsakykite kažką unikalaus, ką tik jūs žinote. Dar geriau — saugokite šiuos atsakymus slaptažodžių tvarkyklėje.' },
  { q: 'Kiek laiko trunka paskyros atkūrimas?', a: 'Priklauso nuo platformos. Su SMS kodu ar el. paštu — kelios minutės. Su tapatybės patvirtinimu — 1–7 darbo dienos. Su kreipimusi į pagalbos tarnybą — iki 2 savaičių.' },
];

const ForgotPasswordGuidePage = ({ category }: Props) => {
  usePageMeta({
    title: category.seoTitle || 'Ką daryti pamiršus slaptažodį 2026 — atkūrimo gidas',
    description: category.metaDescription || 'Pamiršote slaptažodį? Kaip atkurti Gmail, Facebook, Instagram ir kitų paskyrų slaptažodžius. Žingsnis po žingsnio instrukcijos.',
  });

  return (
    <PageLayout>
      <div className="container py-8 max-w-3xl">
        <Breadcrumbs path={category.path} items={[
          { label: 'Pradžia', path: '/' },
          { label: 'Slaptažodžių saugumas', path: '/slaptazodziu-saugumas' },
          { label: 'Pamirštas slaptažodis', path: '/slaptazodziu-saugumas/ka-daryti-pamirsus-slaptazodi' },
        ]} />

        {/* ── Hero ── */}
        <ScrollReveal>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="section-label">Praktinis gidas</span>
              <span className="chip-muted text-[10px] flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />6 min skaitymo</span>
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground leading-tight mb-3">
              Ką daryti pamiršus slaptažodį: atkūrimo gidas 2026 m.
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Pamiršote slaptažodį? Nesijaudinkite — tai viena dažniausių problemų internete. 
              Žemiau rasite žingsnis po žingsnio instrukcijas, kaip atkurti prieigą prie populiariausių platformų.
            </p>
          </div>
        </ScrollReveal>

        {/* ── Quick advice ── */}
        <ScrollReveal delay={50}>
          <div className="bg-primary/5 border border-primary/15 rounded-xl p-5 mb-8">
            <h2 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-primary" /> Pirmieji žingsniai
            </h2>
            <ol className="space-y-1.5 text-sm text-foreground list-decimal list-inside">
              <li>Nepanikuokite — beveik visos platformos turi slaptažodžio atkūrimo funkciją</li>
              <li>Patikrinkite, ar turite prieigą prie atkūrimo el. pašto arba telefono</li>
              <li>Jei naudojate slaptažodžių tvarkyklę — tikrinkite ten pirmiausiai</li>
              <li>Patikrinkite naršyklės išsaugotus slaptažodžius (Chrome: chrome://settings/passwords)</li>
            </ol>
          </div>
        </ScrollReveal>

        {/* ── Platform-specific guides ── */}
        {platforms.map((platform, idx) => (
          <ScrollReveal key={platform.name} delay={100 + idx * 50}>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-lg bg-card border border-border/50 flex items-center justify-center`}>
                  <platform.icon className={`w-4 h-4 ${platform.color}`} />
                </div>
                <h2 className="font-heading text-lg font-bold text-foreground">{platform.name}</h2>
              </div>
              <div className="space-y-2 ml-11 mb-3">
                {platform.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="font-heading font-bold text-primary shrink-0 w-5 text-right">{i + 1}.</span>
                    <span className="text-foreground">{step}</span>
                  </div>
                ))}
              </div>
              <div className="ml-11 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <p className="text-xs text-muted-foreground italic flex-1">{platform.tip}</p>
                <a href={platform.url} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-medium text-primary hover:text-primary/80 inline-flex items-center gap-1 shrink-0 transition-colors">
                  Atkūrimo puslapis <ArrowRight className="w-3 h-3" />
                </a>
              </div>
              {idx < platforms.length - 1 && <hr className="border-border/30 mt-6" />}
            </div>
          </ScrollReveal>
        ))}

        {/* ── Prevention ── */}
        <ScrollReveal delay={400}>
          <div className="bg-card border border-success/20 rounded-xl p-5 my-10">
            <h2 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-success" /> Kaip išvengti slaptažodžio pamiršimo ateityje
            </h2>
            <ul className="space-y-2.5">
              {preventionTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        {/* ── FAQ ── */}
        <ScrollReveal delay={450}>
          <FAQAccordion items={faqItems} />
        </ScrollReveal>

        {/* ── Related ── */}
        <ScrollReveal delay={500}>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link to="/slaptazodziu-saugumas"
              className="flex-1 p-4 bg-card border border-border/50 rounded-xl hover:border-primary/30 transition-colors group">
              <span className="text-xs text-muted-foreground">Hub puslapis</span>
              <h3 className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors">← Slaptažodžių saugumas</h3>
            </Link>
            <Link to="/slaptazodziu-saugumas/kaip-pakeisti-gmail-slaptazodi"
              className="flex-1 p-4 bg-card border border-border/50 rounded-xl hover:border-primary/30 transition-colors group">
              <span className="text-xs text-muted-foreground">Susijęs gidas</span>
              <h3 className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors">Kaip pakeisti Gmail slaptažodį →</h3>
            </Link>
            <Link to="/slaptazodziu-saugumas/kaip-pakeisti-wifi-slaptazodi"
              className="flex-1 p-4 bg-card border border-border/50 rounded-xl hover:border-primary/30 transition-colors group">
              <span className="text-xs text-muted-foreground">Susijęs gidas</span>
              <h3 className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors">Kaip pakeisti WiFi slaptažodį →</h3>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </PageLayout>
  );
};

export default ForgotPasswordGuidePage;
