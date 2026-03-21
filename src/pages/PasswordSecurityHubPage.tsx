import {
  Lock, Key, KeyRound, Shield, ShieldCheck, AlertTriangle, Eye, EyeOff,
  Wifi, Mail, HelpCircle, ChevronRight, ArrowRight, Fingerprint, Smartphone,
  CheckCircle2, XCircle, Clock, RefreshCw,
} from 'lucide-react';
import PageLayout from '@/components/site/PageLayout';
import Breadcrumbs from '@/components/site/Breadcrumbs';
import FAQAccordion from '@/components/content/FAQAccordion';
import TrustDisclosure from '@/components/content/TrustDisclosure';
import ScrollReveal from '@/components/site/ScrollReveal';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Link } from 'react-router-dom';
import { SectionHeading } from '@/components/landing/LandingShared';
import type { PublicCategory } from '@/types/content';

interface Props { category: PublicCategory }

/* ── Guide cards ── */
const guides = [
  {
    icon: Mail,
    title: 'Kaip pakeisti Gmail slaptažodį',
    description: 'Žingsnis po žingsnio instrukcija kompiuteryje ir telefone. Taip pat — kaip įjungti dviejų veiksnių autentifikaciją.',
    path: '/slaptazodziu-saugumas/kaip-pakeisti-gmail-slaptazodi',
    tag: 'How-to',
    readTime: '4 min',
  },
  {
    icon: Wifi,
    title: 'Kaip pakeisti WiFi slaptažodį',
    description: 'Instrukcija populiariausiems routeriams: TP-Link, Huawei, Asus, Telia ir kitiems. Su nuotraukomis.',
    path: '/slaptazodziu-saugumas/kaip-pakeisti-wifi-slaptazodi',
    tag: 'How-to',
    readTime: '5 min',
  },
  {
    icon: KeyRound,
    title: 'Ką daryti pamiršus slaptažodį',
    description: 'Kaip atkurti prieigą prie Gmail, Facebook, Instagram ir kitų paskyrų. Prevencijos patarimai ateičiai.',
    path: '/slaptazodziu-saugumas/ka-daryti-pamirsus-slaptazodi',
    tag: 'Gidas',
    readTime: '6 min',
  },
];

/* ── Password strength data ── */
const strengthExamples = [
  { password: 'slaptazodis123', strength: 'Labai silpnas', time: '< 1 sekundė', color: 'text-destructive', bg: 'bg-destructive/10' },
  { password: 'Katinas2024!', strength: 'Silpnas', time: '~3 valandos', color: 'text-orange-600', bg: 'bg-orange-50' },
  { password: 'K!m9#xLp2$vR', strength: 'Vidutinis', time: '~400 metų', color: 'text-amber-600', bg: 'bg-amber-50' },
  { password: 'zuvis-kelias-menas-7!Rx', strength: 'Stiprus', time: '> 1 mlrd. metų', color: 'text-success', bg: 'bg-success/10' },
];

/* ── Quick tips ── */
const dosDonts: { do: string; dont: string }[] = [
  { do: 'Naudokite bent 15 simbolių (NIST 2026 rekomendacija)', dont: 'Nenaudokite vardo, gimimo datos ar „123456"' },
  { do: 'Naudokite slaptažodžių tvarkyklę', dont: 'Nesaugokite slaptažodžių naršyklėje be master password' },
  { do: 'Įjunkite dviejų veiksnių autentifikaciją (2FA)', dont: 'Nenaudokite to paties slaptažodžio keliose paskyrose' },
  { do: 'Naudokite passphrase — 3–5 atsitiktinių žodžių', dont: 'Nekeiskite slaptažodžio reguliariai be priežasties' },
  { do: 'Tikrinkite ar slaptažodis nebuvo nutekėjęs (haveibeenpwned.com)', dont: 'Nesiųskite slaptažodžių el. paštu ar žinutėmis' },
];

/* ── Stats ── */
const stats = [
  { value: '85,6%', label: 'Įprastų slaptažodžių AI nulaužia per <10 sek.', icon: AlertTriangle },
  { value: '15+', label: 'Simbolių — NIST 2026 rekomenduojamas minimumas', icon: Key },
  { value: '70%', label: 'Žmonių naudoja tuos pačius slaptažodžius', icon: RefreshCw },
  { value: '2FA', label: 'Sumažina paskyros perėmimo riziką 99%', icon: ShieldCheck },
];

const faqItems = [
  { q: 'Koks turėtų būti saugus slaptažodis 2026 metais?', a: 'Pagal naujausias NIST gaires, saugus slaptažodis turėtų būti bent 15 simbolių ilgio. Geriausia naudoti passphrase — 3–5 atsitiktinių žodžių kombinaciją su skaičiumi ar simboliu. Pvz.: „zuvis-kelias-menas-7!Rx". Sudėtingumo taisyklės (didžiosios + skaičiai + simboliai) nebėra privalomos, bet ilgis yra svarbiausias.' },
  { q: 'Ar verta naudoti slaptažodžių tvarkyklę?', a: 'Taip, tai vienas svarbiausių saugumo įrankių. Slaptažodžių tvarkyklė sukuria unikalius, sudėtingus slaptažodžius kiekvienai paskyrai ir saugiai juos saugo. Rekomenduojamos: Bitwarden (nemokama), 1Password ir NordPass.' },
  { q: 'Kaip dažnai reikia keisti slaptažodžius?', a: 'Pagal NIST 2026 gaires, reguliarus slaptažodžio keitimas neberekomendojamas. Keiskite tik tada, kai: 1) Įtariate, kad slaptažodis galėjo būti pažeistas; 2) Gavote pranešimą apie duomenų nutekėjimą; 3) Pastebėjote įtartiną veiklą paskyroje.' },
  { q: 'Kas yra dviejų veiksnių autentifikacija (2FA)?', a: '2FA prideda papildomą saugumo sluoksnį — be slaptažodžio reikia patvirtinimo iš kito įrenginio (SMS kodas, autentifikacijos programa ar fizinis raktas). Net jei kas nors sužinos jūsų slaptažodį, be 2FA kodo prisijungti negalės.' },
  { q: 'Ką daryti, jei mano slaptažodis buvo nutekėjęs?', a: 'Nedelsiant pakeiskite slaptažodį toje paskyroje ir visose kitose, kur naudojote tą patį. Įjunkite 2FA. Patikrinkite haveibeenpwned.com — ten galite sužinoti, ar jūsų el. paštas buvo duomenų nutekėjimuose.' },
  { q: 'Ar naršyklės slaptažodžių saugojimas yra saugus?', a: 'Naršyklės siūlo bazinį slaptažodžių saugojimą, tačiau jis nėra toks saugus kaip dedikuota slaptažodžių tvarkyklė. Naršyklės saugykla dažnai neturi master password ir gali būti pažeidžiama per kenkėjiškas programas.' },
];

const PasswordSecurityHubPage = ({ category }: Props) => {
  usePageMeta({
    title: category.seoTitle || 'Slaptažodžių saugumas 2026 — patarimai ir gidai',
    description: category.metaDescription || 'Viskas apie slaptažodžių saugumą: kaip sukurti stiprų slaptažodį, kur jį saugoti, kaip pakeisti ir ką daryti pamiršus. Praktiniai gidai ir patarimai.',
  });

  return (
    <PageLayout>
      <div className="container py-8 max-w-4xl">
        <Breadcrumbs path={category.path} items={[
          { label: 'Pradžia', path: '/' },
          { label: 'Slaptažodžių saugumas', path: '/slaptazodziu-saugumas' },
        ]} />

        {/* ── Hero ── */}
        <ScrollReveal>
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="section-label">Slaptažodžių saugumas</span>
              <span className="chip-muted text-[10px]">Atnaujinta 2026</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
              Slaptažodžių saugumas: kaip apsaugoti savo paskyras
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              Stiprus slaptažodis — pirmoji gynybos linija nuo kibernetinių grėsmių. 
              Šiame hub'e rasite praktinius gidus, kaip kurti, keisti ir saugoti slaptažodžius pagal 
              naujausias 2026 m. NIST rekomendacijas.
            </p>
          </div>
        </ScrollReveal>

        {/* ── Stats bar ── */}
        <ScrollReveal delay={50}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {stats.map((s, i) => (
              <div key={i} className="bg-card border border-border/50 rounded-xl p-4 text-center">
                <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="font-heading text-xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground leading-snug mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* ── Guides grid ── */}
        <ScrollReveal delay={100}>
          <SectionHeading label="Praktiniai gidai" title="Žingsnis po žingsnio instrukcijos" subtitle="Dažniausiai ieškomi slaptažodžių klausimai su aiškiomis instrukcijomis" className="mb-5" />
          <div className="grid gap-3 mb-12">
            {guides.map((g) => (
              <Link key={g.path} to={g.path}
                className="group flex items-start gap-4 p-5 bg-card border border-border/50 rounded-xl hover:border-primary/30 hover:shadow-sm transition-all duration-200">
                <div className="rounded-lg bg-primary/8 p-2.5 shrink-0 group-hover:bg-primary/15 transition-colors">
                  <g.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="chip-muted text-[10px]">{g.tag}</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{g.readTime}</span>
                  </div>
                  <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">{g.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{g.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary shrink-0 mt-3 transition-colors" />
              </Link>
            ))}
          </div>
        </ScrollReveal>

        {/* ── Password strength section ── */}
        <ScrollReveal delay={150}>
          <SectionHeading label="Ar jūsų slaptažodis saugus?" title="Slaptažodžio stiprumo pavyzdžiai" className="mb-5" />
          <div className="bg-card border border-border/50 rounded-xl overflow-hidden mb-12">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left font-medium text-muted-foreground p-3">Slaptažodis</th>
                    <th className="text-left font-medium text-muted-foreground p-3">Stiprumas</th>
                    <th className="text-left font-medium text-muted-foreground p-3">Nulaužimo laikas</th>
                  </tr>
                </thead>
                <tbody>
                  {strengthExamples.map((ex, i) => (
                    <tr key={i} className="border-b border-border/30 last:border-0">
                      <td className="p-3 font-mono text-xs">{ex.password}</td>
                      <td className="p-3"><span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${ex.bg} ${ex.color}`}>{ex.strength}</span></td>
                      <td className="p-3 text-muted-foreground">{ex.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-muted/20 border-t border-border/30">
              <p className="text-xs text-muted-foreground">* Nulaužimo laikai paremti 2025–2026 m. GPU benchmarkais. Stiprūs passphrase tipo slaptažodžiai yra itin sunkiai nulaužiami.</p>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Do's & Don'ts ── */}
        <ScrollReveal delay={200}>
          <SectionHeading label="NIST 2026 gairės" title="Ką daryti ir ko nedaryti" className="mb-5" />
          <div className="grid md:grid-cols-2 gap-3 mb-12">
            <div className="bg-card border border-success/20 rounded-xl p-5">
              <h3 className="font-heading font-semibold text-success flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4" /> Taip — darykite
              </h3>
              <ul className="space-y-2.5">
                {dosDonts.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                    <span>{d.do}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card border border-destructive/20 rounded-xl p-5">
              <h3 className="font-heading font-semibold text-destructive flex items-center gap-2 mb-3">
                <XCircle className="w-4 h-4" /> Ne — venkite
              </h3>
              <ul className="space-y-2.5">
                {dosDonts.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <XCircle className="w-3.5 h-3.5 text-destructive/70 shrink-0 mt-0.5" />
                    <span>{d.dont}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Recommended tools ── */}
        <ScrollReveal delay={250}>
          <SectionHeading label="Rekomenduojami įrankiai" title="Slaptažodžių tvarkyklės" className="mb-5" />
          <div className="grid sm:grid-cols-3 gap-3 mb-12">
            {[
              { name: 'Bitwarden', desc: 'Geriausia nemokama tvarkyklė. Atviro kodo, audituota, veikia visose platformose.', tag: 'Nemokama', url: 'https://bitwarden.com' },
              { name: '1Password', desc: 'Premium pasirinkimas šeimoms ir komandoms. Passkey palaikymas, Travel Mode.', tag: 'Nuo 2,99 $/mėn.', url: 'https://1password.com' },
              { name: 'NordPass', desc: 'Paprasta naudoti, XChaCha20 šifravimas. Data Breach Scanner funkcija.', tag: 'Nuo 1,49 $/mėn.', url: 'https://nordpass.com' },
            ].map((tool) => (
              <div key={tool.name} className="bg-card border border-border/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading font-semibold text-foreground">{tool.name}</h3>
                  <span className="chip-muted text-[10px]">{tool.tag}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{tool.desc}</p>
                <a href={tool.url} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-medium text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors">
                  Sužinoti daugiau <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* ── FAQ ── */}
        <ScrollReveal delay={300}>
          <FAQAccordion items={faqItems} />
        </ScrollReveal>

        {/* ── Cross-cluster links ── */}
        <ScrollReveal delay={350}>
          <div className="mt-10 mb-6">
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">Susiję saugumo gidai</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link to="/antivirusines-programos"
                className="group flex items-start gap-3 p-4 bg-card border border-border/50 rounded-xl hover:border-primary/30 transition-colors">
                <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors">Geriausios antivirusinės programos 2026</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Antivirusinės apsaugo nuo keyloggerių ir spyware — pagrindinių slaptažodžių vagysčių priežasčių</p>
                </div>
              </Link>
              <Link to="/virusai/kompiuterinis-virusas"
                className="group flex items-start gap-3 p-4 bg-card border border-border/50 rounded-xl hover:border-primary/30 transition-colors">
                <AlertTriangle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors">Kompiuterinis virusas: tipai ir apsauga</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Sužinokite, kaip virusai vagia slaptažodžius ir kaip nuo to apsisaugoti</p>
                </div>
              </Link>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <TrustDisclosure />
        </ScrollReveal>
      </div>
    </PageLayout>
  );
};

export default PasswordSecurityHubPage;
