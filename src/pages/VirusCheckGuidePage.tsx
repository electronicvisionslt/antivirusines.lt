import {
  Search, Shield, AlertTriangle, CheckCircle2, Monitor, Clock, ArrowRight,
  Activity, Cpu, HardDrive, Wifi, Eye, FileWarning, Terminal,
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

const warningSignsGroups = [
  {
    title: 'Sistemos veikimas',
    icon: Cpu,
    signs: [
      'Kompiuteris užsikrauna žymiai lėčiau nei anksčiau',
      'Programos „stringa" arba nereaguoja be priežasties',
      'Ventiliatorius nuolat sukasi maksimaliu greičiu',
      'Neįprastai didelis procesoriaus ar atminties naudojimas',
    ],
  },
  {
    title: 'Naršyklė ir internetas',
    icon: Wifi,
    signs: [
      'Pradinis puslapis ar paieškos variklis pasikeitė savaime',
      'Atsiranda nepažįstamų įrankių juostų ar plėtinių',
      'Nukreipiami į nežinomas svetaines',
      'Pop-up reklamos atsiranda net neatidarytoje naršyklėje',
    ],
  },
  {
    title: 'Failai ir programos',
    icon: HardDrive,
    signs: [
      'Failai dingsta, keičiasi arba yra neįprastai šifruoti',
      'Atsiranda nepažįstamų programų, kurių neįdiegėte',
      'Antivirusinė programa staiga išsijungė',
      'Atsirado neįprasti failai su .encrypted ar kitais plėtiniais',
    ],
  },
];

const checkSteps = [
  {
    step: 1,
    title: 'Patikrinkite Task Manager (Užduočių tvarkyklę)',
    detail: 'Paspauskite Ctrl+Shift+Esc. Stebėkite: ar yra procesų, kurie naudoja neįprastai daug CPU arba atminties? Googlinkite nepažįstamų procesų pavadinimus.',
    os: 'Windows',
  },
  {
    step: 2,
    title: 'Paleiskite Windows Security skenavimą',
    detail: 'Nustatymai → Atnaujinimas ir sauga → Windows Security → Virusų ir grėsmių apsauga → „Scan options" → „Full scan". Tai gali užtrukti 1–2 val.',
    os: 'Windows',
  },
  {
    step: 3,
    title: 'Naudokite Malwarebytes (nemokamą)',
    detail: 'Atsisiųskite iš malwarebytes.com. Nemokama versija leidžia atlikti pilną skenavimą ir pašalinti rastas grėsmes. Puikiai papildo pagrindinę antivirusinę.',
    os: 'Visi',
  },
  {
    step: 4,
    title: 'Patikrinkite naršyklės plėtinius',
    detail: 'Chrome: chrome://extensions. Firefox: about:addons. Pašalinkite visus nepažįstamus ar nenaudojamus plėtinius — jie gali būti kenkėjiški.',
    os: 'Visi',
  },
  {
    step: 5,
    title: 'Tikrinkite paleisties programas',
    detail: 'Windows: Task Manager → Startup skirtukas. Išjunkite nepažįstamas programas. Mac: System Preferences → Users → Login Items.',
    os: 'Visi',
  },
  {
    step: 6,
    title: 'Patikrinkite tinklo aktyvumą',
    detail: 'Resource Monitor → Network skirtukas (Windows). Stebėkite, ar nepažįstami procesai siunčia/priima duomenis. Tai gali reikšti spyware ar botnet veiklą.',
    os: 'Windows',
  },
  {
    step: 7,
    title: 'Naudokite antrinį skenavimą Safe Mode',
    detail: 'Paleiskite kompiuterį Safe Mode (saugiuoju režimu) ir pakartokite antivirusinį skenavimą. Safe Mode išjungia trečiųjų šalių procesus, todėl aptinkama daugiau grėsmių.',
    os: 'Visi',
  },
];

const freeTools = [
  { name: 'Malwarebytes Free', desc: 'Geriausias papildomas skeneris. Aptinka adware, spyware ir PUP, kurių pagrindinė antivirusinė gali nepastebėti.', url: 'https://www.malwarebytes.com' },
  { name: 'Windows Security', desc: 'Integruota Windows 10/11 antivirusinė. Gera bazinė apsauga, automatiškai atnaujinama.', url: 'https://support.microsoft.com/windows/windows-security' },
  { name: 'VirusTotal', desc: 'Įkelkite įtartiną failą — jis bus patikrintas 70+ antivirusinių variklių. Puikus nežinomų failų tikrinimui.', url: 'https://www.virustotal.com' },
  { name: 'AdwCleaner', desc: 'Specializuotas adware ir naršyklės „grobikų" (hijacker) šalinimo įrankis. Nereikia diegti.', url: 'https://www.malwarebytes.com/adwcleaner' },
];

const faqItems = [
  { q: 'Ar „Windows Defender" gali aptikti visus virusus?', a: 'Windows Defender aptinka ~98% žinomų grėsmių pagal AV-TEST testus. Tačiau jis gali praleisti naujausius zero-day virusus ir sudėtingesnes grėsmes. Rekomenduojame papildomą skenavimą su Malwarebytes.' },
  { q: 'Ką daryti, jei antivirusinė rado virusą?', a: 'Leiskite antivirusinei pašalinti arba izoliuoti (quarantine) grėsmę. Po to: 1) Pakeiskite visų paskyrų slaptažodžius; 2) Patikrinkite banko išrašus; 3) Atnaujinkite OS ir visas programas.' },
  { q: 'Ar kompiuteris gali turėti virusą, net jei antivirusinė nieko nerodo?', a: 'Taip. Rootkit\'ai ir polimorfinis malware gali slėptis nuo antivirusinių programų. Jei simptomai tęsiasi, naudokite kelis skirtingus skenavimo įrankius ir bandykite Safe Mode.' },
  { q: 'Kaip atpažinti, ar el. laiškas yra kenkėjiškas?', a: 'Ženklai: neįprastas siuntėjo adresas, gramatikos klaidos, skubinimas veikti, netikėtas priedas (.exe, .zip, .scr). Jei abejojate — neklikinkite nuorodų ir neatidarykite priedų.' },
  { q: 'Ar virusas gali slėptis RAM atmintyje?', a: 'Taip, vadinamieji „fileless" (befailiai) virusai veikia tik operatyviojoje atmintyje ir nepalikdami failų diske. Jie dingsta perkrovus kompiuterį, bet gali būti itin pavojingi veikimo metu.' },
];

const VirusCheckGuidePage = ({ category }: Props) => {
  usePageMeta({
    title: category.seoTitle || 'Kaip patikrinti ar kompiuteryje yra virusas — gidas 2026',
    description: category.metaDescription || 'Kaip patikrinti ar kompiuteryje yra virusas? 10 požymių ir žingsnis po žingsnio patikrinimo instrukcija. Nemokami įrankiai ir patarimai.',
  });

  return (
    <PageLayout>
      <div className="container py-8 max-w-3xl">
        <Breadcrumbs path={category.path} items={[
          { label: 'Pradžia', path: '/' },
          { label: 'Virusai', path: '/virusai/kompiuterinis-virusas' },
          { label: 'Viruso patikrinimas', path: '/virusai/kaip-patikrinti-ar-kompiuteryje-yra-virusas' },
        ]} />

        {/* Hero */}
        <ScrollReveal>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="section-label">Praktinis gidas</span>
              <span className="chip-muted text-[10px] flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />7 min skaitymo</span>
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground leading-tight mb-3">
              Kaip patikrinti ar kompiuteryje yra virusas
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Įtariate, kad kompiuteris užkrėstas? Šiame gide rasite simptomus, kuriuos reikia stebėti, 
              ir žingsnis po žingsnio instrukciją, kaip patikrinti ir išvalyti kompiuterį.
            </p>
          </div>
        </ScrollReveal>

        {/* Warning signs */}
        <ScrollReveal delay={50}>
          <SectionHeading label="Simptomai" title="Kaip atpažinti užkrėstą kompiuterį" className="mb-5" />
          <div className="space-y-4 mb-10">
            {warningSignsGroups.map((group) => (
              <div key={group.title} className="bg-card border border-border/50 rounded-xl p-5">
                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-3">
                  <group.icon className="w-4 h-4 text-primary" /> {group.title}
                </h3>
                <ul className="space-y-2">
                  {group.signs.map((sign, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Step-by-step check */}
        <ScrollReveal delay={100}>
          <SectionHeading label="Patikrinimas" title="7 žingsniai viruso patikrinimui" className="mb-5" />
          <div className="space-y-3 mb-10">
            {checkSteps.map((s) => (
              <div key={s.step} className="flex gap-4 p-4 bg-card border border-border/50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-heading font-bold text-sm text-primary">{s.step}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading font-semibold text-foreground text-sm">{s.title}</h3>
                    <span className="chip-muted text-[10px]">{s.os}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Free tools */}
        <ScrollReveal delay={150}>
          <SectionHeading label="Nemokami įrankiai" title="Rekomenduojami skenavimo įrankiai" className="mb-5" />
          <div className="grid sm:grid-cols-2 gap-3 mb-10">
            {freeTools.map((tool) => (
              <div key={tool.name} className="bg-card border border-border/50 rounded-xl p-5">
                <h3 className="font-heading font-semibold text-foreground mb-1">{tool.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{tool.desc}</p>
                <a href={tool.url} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-medium text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors">
                  Atsisiųsti <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Post-cleanup */}
        <ScrollReveal delay={200}>
          <div className="bg-primary/5 border border-primary/15 rounded-xl p-5 mb-10">
            <h2 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-primary" /> Po valymo: ką daryti toliau
            </h2>
            <ul className="space-y-2">
              {([
                <><Link to="/slaptazodziu-saugumas" className="text-primary hover:text-primary/80 font-medium">Pakeiskite visų paskyrų slaptažodžius</Link> (ypač banko, el. pašto, soc. tinklų)</>,
                'Patikrinkite banko operacijas dėl neleistinų veiksmų',
                'Atnaujinkite operacinę sistemą ir visas programas',
                'Įjunkite automatinį antivirusinės atnaujinimą',
                'Padarykite pilną atsarginę kopiją (tik po valymo!)',
                <>Apsvarstykite perėjimą prie <Link to="/antivirusines-programos" className="text-primary hover:text-primary/80 font-medium">mokamos antivirusinės</Link> su realaus laiko apsauga</>,
              ] as React.ReactNode[]).map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-primary/10">
              <Link to="/antivirusines-programos" className="text-sm font-medium text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors">
                Palygink geriausias antivirusines programas <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={250}>
          <FAQAccordion items={faqItems} />
        </ScrollReveal>

        {/* Related */}
        <ScrollReveal delay={300}>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link to="/virusai/kompiuterinis-virusas"
              className="flex-1 p-4 bg-card border border-border/50 rounded-xl hover:border-primary/30 transition-colors group">
              <span className="text-xs text-muted-foreground">Informacinis gidas</span>
              <h3 className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors">← Kompiuterinis virusas: tipai ir apsauga</h3>
            </Link>
            <Link to="/virusai/virusas-telefone"
              className="flex-1 p-4 bg-card border border-border/50 rounded-xl hover:border-primary/30 transition-colors group">
              <span className="text-xs text-muted-foreground">Susijęs gidas</span>
              <h3 className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors">Virusas telefone →</h3>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </PageLayout>
  );
};

export default VirusCheckGuidePage;
