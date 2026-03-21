import {
  Mail, Shield, ChevronRight, CheckCircle2, AlertTriangle,
  Smartphone, Monitor, Lock, Eye, EyeOff, ArrowRight, Clock,
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

/* ── Steps data ── */
const desktopSteps = [
  { step: 1, title: 'Atidarykite Google paskyros nustatymus', detail: 'Eikite į myaccount.google.com arba Gmail viršuje dešinėje spustelėkite savo profilio nuotrauką → „Tvarkyti Google paskyrą".' },
  { step: 2, title: 'Pasirinkite „Sauga"', detail: 'Kairėje šoninėje juostoje spustelėkite „Sauga" (Security). Čia rasite visus su saugumu susijusius nustatymus.' },
  { step: 3, title: 'Raskite „Slaptažodis"', detail: 'Skyriuje „Kaip prisijungiate prie Google" spustelėkite „Slaptažodis". Google paprašys patvirtinti dabartinį slaptažodį.' },
  { step: 4, title: 'Įveskite naują slaptažodį', detail: 'Sukurkite naują slaptažodį (bent 15 simbolių, passphrase tipo). Įveskite jį du kartus ir spustelėkite „Keisti slaptažodį".' },
];

const mobileSteps = [
  { step: 1, title: 'Atidarykite Gmail programėlę', detail: 'Paleiskite Gmail programėlę ir spustelėkite savo profilio nuotrauką viršuje dešinėje.' },
  { step: 2, title: 'Eikite į „Google paskyra"', detail: 'Pasirinkite „Tvarkyti Google paskyrą" → pereikite į skirtuką „Sauga".' },
  { step: 3, title: 'Spustelėkite „Slaptažodis"', detail: 'Skyriuje „Kaip prisijungiate prie Google" spustelėkite „Slaptažodis" ir patvirtinkite tapatybę.' },
  { step: 4, title: 'Nustatykite naują slaptažodį', detail: 'Įveskite naują slaptažodį, patvirtinkite ir spustelėkite „Keisti slaptažodį".' },
];

const enable2faSteps = [
  { step: 1, detail: 'Eikite į myaccount.google.com → Sauga → Patvirtinimas dviem veiksmais.' },
  { step: 2, detail: 'Spustelėkite „Pradėti" ir patvirtinkite slaptažodį.' },
  { step: 3, detail: 'Pasirinkite patvirtinimo būdą: Google Authenticator programėlė (rekomenduojama), SMS žinutė arba fizinis saugos raktas.' },
  { step: 4, detail: 'Sekite instrukcijas ir išsaugokite atsarginius kodus saugioje vietoje.' },
];

const whenToChange = [
  'Gavote pranešimą apie neautorizuotą prisijungimą',
  'Jūsų el. paštas atsirado duomenų nutekėjime (tikrinkite haveibeenpwned.com)',
  'Naudojote tą patį slaptažodį kitoje svetainėje, kuri buvo pažeista',
  'Pasidalijote slaptažodžiu su kitu asmeniu',
  'Prisijungėte prie Gmail viešame kompiuteryje',
];

const faqItems = [
  { q: 'Ar pakeitus Gmail slaptažodį atsijungs visi įrenginiai?', a: 'Taip, pakeitus slaptažodį būsite automatiškai atjungti nuo visų įrenginių (išskyrus tą, kuriame keitėte). Turėsite prisijungti iš naujo su nauju slaptažodžiu.' },
  { q: 'Ką daryti, jei pamiršau dabartinį Gmail slaptažodį?', a: 'Spustelėkite „Pamiršote slaptažodį?" prisijungimo lange. Google pasiūlys atkūrimo būdus: SMS kodą, atsarginį el. paštą arba saugos klausimus. Plačiau skaitykite mūsų gide „Ką daryti pamiršus slaptažodį".' },
  { q: 'Koks turėtų būti stiprus Gmail slaptažodis?', a: 'Rekomenduojame bent 15 simbolių passphrase — pvz.: „mėlynas-tiltas-rytas-42!K". Venkite asmeninės informacijos, populiarių žodžių ir skaičių sekų.' },
  { q: 'Ar Gmail slaptažodis ir Google paskyros slaptažodis yra tas pats?', a: 'Taip. Gmail naudoja bendrą Google paskyros slaptažodį. Pakeitus jį, pasikeis prieiga prie visų Google paslaugų: Drive, YouTube, Photos ir kt.' },
  { q: 'Kaip dažnai reikia keisti Gmail slaptažodį?', a: 'Pagal NIST 2026 rekomendacijas, reguliarus keitimas neberekomendojamas. Keiskite tik esant priežasčiai — nutekėjimas, įtartina veikla, bendras naudojimas.' },
];

const GmailPasswordGuidePage = ({ category }: Props) => {
  usePageMeta({
    title: category.seoTitle || 'Kaip pakeisti Gmail slaptažodį 2026 — instrukcija',
    description: category.metaDescription || 'Žingsnis po žingsnio instrukcija, kaip pakeisti Gmail slaptažodį kompiuteryje ir telefone. Patarimai saugiam slaptažodžiui ir 2FA įjungimas.',
  });

  return (
    <PageLayout>
      <div className="container py-8 max-w-3xl">
        <Breadcrumbs path={category.path} items={[
          { label: 'Pradžia', path: '/' },
          { label: 'Slaptažodžių saugumas', path: '/slaptazodziu-saugumas' },
          { label: 'Gmail slaptažodis', path: '/slaptazodziu-saugumas/kaip-pakeisti-gmail-slaptazodi' },
        ]} />

        {/* ── Hero ── */}
        <ScrollReveal>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="section-label">How-to gidas</span>
              <span className="chip-muted text-[10px] flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />4 min skaitymo</span>
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground leading-tight mb-3">
              Kaip pakeisti Gmail slaptažodį: instrukcija 2026 m.
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Gmail slaptažodis yra raktas į visą jūsų Google ekosistemą — Gmail, Drive, YouTube, Photos. 
              Štai kaip jį pakeisti per kelias minutes kompiuteryje ir telefone.
            </p>
          </div>
        </ScrollReveal>

        {/* ── When to change ── */}
        <ScrollReveal delay={50}>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded-xl p-5 mb-8">
            <h2 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Kada reikia keisti Gmail slaptažodį?
            </h2>
            <ul className="space-y-2">
              {whenToChange.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <ChevronRight className="w-3 h-3 text-amber-600 shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        {/* ── Desktop steps ── */}
        <ScrollReveal delay={100}>
          <SectionHeading label="Kompiuteryje" title="Gmail slaptažodžio keitimas kompiuteryje" className="mb-5" />
          <div className="space-y-3 mb-10">
            {desktopSteps.map((s) => (
              <div key={s.step} className="flex gap-4 p-4 bg-card border border-border/50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-heading font-bold text-sm text-primary">{s.step}</span>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground text-sm">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* ── Mobile steps ── */}
        <ScrollReveal delay={150}>
          <SectionHeading label="Telefone" title="Gmail slaptažodžio keitimas telefone" className="mb-5" />
          <div className="space-y-3 mb-10">
            {mobileSteps.map((s) => (
              <div key={s.step} className="flex gap-4 p-4 bg-card border border-border/50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-heading font-bold text-sm text-primary">{s.step}</span>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground text-sm">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* ── 2FA section ── */}
        <ScrollReveal delay={200}>
          <div className="bg-primary/5 border border-primary/15 rounded-xl p-6 mb-10">
            <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-primary" /> Bonus: Įjunkite dviejų veiksnių autentifikaciją (2FA)
            </h2>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Slaptažodžio pakeitimas — tik pirmas žingsnis. 2FA apsaugo jūsų paskyrą net jei kas nors sužinos slaptažodį.
            </p>
            <div className="space-y-2">
              {enable2faSteps.map((s) => (
                <div key={s.step} className="flex items-start gap-3 text-sm">
                  <span className="font-heading font-bold text-primary shrink-0">{s.step}.</span>
                  <span className="text-foreground">{s.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ── Password tips ── */}
        <ScrollReveal delay={250}>
          <div className="bg-card border border-border/50 rounded-xl p-5 mb-10">
            <h2 className="font-heading font-semibold text-foreground mb-3">Patarimai saugiam Gmail slaptažodžiui</h2>
            <ul className="space-y-2">
              {[
                'Naudokite bent 15 simbolių — pvz. passphrase: „mėlynas-tiltas-rytas-42!K"',
                'Nenaudokite asmeninės informacijos (vardo, gimimo datos, miesto)',
                'Nesikartokite — Gmail slaptažodis turi būti unikalus',
                'Saugokite slaptažodžių tvarkyklėje (Bitwarden, 1Password, NordPass)',
                'Patikrinkite ar slaptažodis nebuvo nutekėjęs: haveibeenpwned.com',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                  <span className="text-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        {/* ── FAQ ── */}
        <ScrollReveal delay={300}>
          <FAQAccordion items={faqItems} />
        </ScrollReveal>

        {/* ── Related ── */}
        <ScrollReveal delay={350}>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link to="/slaptazodziu-saugumas/ka-daryti-pamirsus-slaptazodi"
              className="flex-1 p-4 bg-card border border-border/50 rounded-xl hover:border-primary/30 transition-colors group">
              <span className="text-xs text-muted-foreground">Susijęs gidas</span>
              <h3 className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors">Ką daryti pamiršus slaptažodį →</h3>
            </Link>
            <Link to="/slaptazodziu-saugumas"
              className="flex-1 p-4 bg-card border border-border/50 rounded-xl hover:border-primary/30 transition-colors group">
              <span className="text-xs text-muted-foreground">Hub puslapis</span>
              <h3 className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors">← Slaptažodžių saugumas</h3>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </PageLayout>
  );
};

export default GmailPasswordGuidePage;
