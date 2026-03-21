import React from 'react';
import {
  Bug, Shield, ShieldAlert, AlertTriangle, Lock, Zap, FileWarning,
  HardDrive, Mail, Globe, ChevronRight, CheckCircle2, XCircle,
  Clock, ArrowRight, Skull, Eye, Download, Link as LinkIcon,
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

const virusTypes = [
  { name: 'Ransomware', icon: Lock, desc: 'Užšifruoja failus ir reikalauja išpirkos. 2025–2026 m. AI pagalba sukurti ransomware variantai nulaužia sistemas 3× greičiau.', severity: 'Kritinis', color: 'text-destructive' },
  { name: 'Trojanai', icon: Eye, desc: 'Apsimeta teisėta programa, bet leidžia įsilaužėliams valdyti kompiuterį nuotoliniu būdu. Dažnai platinami per el. laiškų priedus.', severity: 'Aukštas', color: 'text-orange-600' },
  { name: 'Kirminai (Worms)', icon: Bug, desc: 'Plinta automatiškai tinklu be vartotojo veiksmų. Gali užkrėsti tūkstančius kompiuterių per valandas.', severity: 'Aukštas', color: 'text-orange-600' },
  { name: 'Spyware', icon: Eye, desc: 'Slapta stebi veiksmus, renka slaptažodžius, banko duomenis ir ekrano nuotraukas. Dažnai nepastebimai veikia mėnesius.', severity: 'Aukštas', color: 'text-orange-600' },
  { name: 'Adware', icon: FileWarning, desc: 'Rodo nepageidaujamas reklamas, peradresuoja naršyklę ir sulėtina kompiuterį. Mažiau pavojingas, bet labai erzinantis.', severity: 'Vidutinis', color: 'text-amber-600' },
  { name: 'Rootkit', icon: HardDrive, desc: 'Slepiasi giliai sistemoje ir suteikia administratoriaus prieigą įsilaužėliui. Labai sunku aptikti standartinėmis priemonėmis.', severity: 'Kritinis', color: 'text-destructive' },
  { name: 'Keylogger', icon: Zap, desc: 'Įrašo visus klaviatūros paspaudimus — slaptažodžius, žinutes, banko duomenis. Gali būti programinis arba aparatinis.', severity: 'Aukštas', color: 'text-orange-600' },
];

const infectionSigns = [
  'Kompiuteris veikia žymiai lėčiau nei įprastai',
  'Pasirodo neįprastos klaidos ar mėlynas ekranas (BSOD)',
  'Naršyklė nukreipia į nežinomas svetaines',
  'Atsiranda nepažįstamų programų ar įrankių juostų',
  'Antivirusinė programa išjungiama savaime',
  'Failai dingsta, keičiasi arba yra užšifruoti',
  'Ventiliatorius sukasi maksimaliu greičiu be priežasties',
  'Draugai gauna keistus laiškus iš jūsų el. pašto',
  'Internetas veikia neįprastai lėtai',
  'Pop-up reklamos atsiranda net neatidarytoje naršyklėje',
];

const spreadMethods = [
  { method: 'El. laiškų priedai', desc: 'Kenkėjiški .exe, .zip, .docm failai, apsimetantys sąskaitomis ar siuntų pranešimais', icon: Mail },
  { method: 'Nesaugios svetainės', desc: 'Drive-by download atakos — virusas įsidiegia vos aplankius svetainę', icon: Globe },
  { method: 'Piratinė programinė įranga', desc: 'Crack\'ai ir keygen\'ai dažnai turi trojanų ir keyloggerių', icon: Download },
  { method: 'USB laikmenos', desc: 'Užkrėsti USB raktai gali automatiškai paleisti kenkėjišką kodą', icon: HardDrive },
  { method: 'Socialinė inžinerija', desc: 'Apgaulės metodai, verčiantys paspausti nuorodą ar įdiegti programą', icon: LinkIcon },
];

const protectionTips: React.ReactNode[] = [
  <>Naudokite patikimą <Link to="/antivirusines-programos" className="text-primary hover:text-primary/80 font-medium">antivirusinę programą</Link> su realaus laiko apsauga</>,
  'Reguliariai atnaujinkite operacinę sistemą ir visas programas',
  'Neatidarinėkite įtartinų el. laiškų priedų',
  'Atsisiųskite programas tik iš oficialių šaltinių',
  <>Naudokite <Link to="/slaptazodziu-saugumas" className="text-primary hover:text-primary/80 font-medium">stiprius, unikalius slaptažodžius</Link> su 2FA</>,
  'Darykite reguliarias atsargines kopijas (3-2-1 taisyklė)',
  'Būkite atsargūs su viešais WiFi tinklais — naudokite VPN',
  'Neišjunkite ugniasienės (firewall)',
];

const stats = [
  { value: '+45%', label: 'Ransomware atakų augimas 2025 m.', icon: ShieldAlert },
  { value: '560K', label: 'Naujų virusų aptinkama kasdien', icon: Bug },
  { value: '10 sek.', label: 'AI nulaužia 85% silpnų slaptažodžių', icon: Zap },
  { value: '$4,88M', label: 'Vid. duomenų pažeidimo kaina 2025 m.', icon: Skull },
];

const faqItems = [
  { q: 'Ar virusas gali sugadinti kompiuterio aparatinę įrangą?', a: 'Dauguma virusų negali tiesiogiai sugadinti aparatinės įrangos. Tačiau kai kurie virusai gali perkaitinti procesorių (kriptovaliutų kasimas), užšifruoti BIOS arba sugadinti disko duomenis. Ransomware netiesiogiai „sugadina" — užšifruodamas failus padaro juos neprieinamus.' },
  { q: 'Ar „Mac" kompiuteriai gauna virusų?', a: 'Taip. Nors „Mac" istoriškai buvo saugesni, 2024–2025 m. macOS kenkėjiškų programų skaičius išaugo 30%. „Atomic Stealer" ir „AMOS" trojanai aktyviai taikosi į „Mac" vartotojus.' },
  { q: 'Ar „Windows Defender" pakanka apsaugai?', a: 'Windows Defender suteikia bazinę apsaugą ir yra žymiai pagerėjęs. Tačiau nepriklausomos laboratorijos (AV-TEST, AV-Comparatives) rodo, kad specializuoti sprendimai kaip Norton, Bitdefender ar Kaspersky aptinka daugiau grėsmių ir siūlo papildomas funkcijas.' },
  { q: 'Kaip virusai plinta per el. paštą?', a: 'Dažniausiai per priedus (.exe, .zip, .docm su makrokomandomis) arba per nuorodas į sukčiavimo svetaines. Modernesni virusai naudoja zero-click atakas — užtenka atidaryti laišką tam tikrose programose.' },
  { q: 'Ką daryti, jei kompiuteris užkrėstas ransomware?', a: 'Nedelsiant atjunkite kompiuterį nuo tinklo. Nemokėkite išpirkos — tai negarantuoja failų atkūrimo. Naudokite nomoreransom.org nemokamus dešifravimo įrankius. Jei turite atsarginę kopiją — atstatykite sistemą.' },
  { q: 'Ar antivirusinė programa sulėtina kompiuterį?', a: 'Šiuolaikinės antivirusinės programos yra optimizuotos ir minimaliai veikia sistemos greitį. Testai rodo, kad geriausios programos (Bitdefender, ESET, Norton) sulėtina sistemą tik 2–5%.' },
];

const ComputerVirusGuidePage = ({ category }: Props) => {
  usePageMeta({
    title: category.seoTitle || 'Kompiuterinis virusas 2026 — tipai, požymiai ir apsauga',
    description: category.metaDescription || 'Kas yra kompiuterinis virusas? Ransomware, trojanai, kirminai — tipai, požymiai ir kaip apsisaugoti. Išsamus gidas 2026 m.',
  });

  return (
    <PageLayout>
      <div className="container py-8 max-w-4xl">
        <Breadcrumbs path={category.path} items={[
          { label: 'Pradžia', path: '/' },
          { label: 'Virusai', path: '/virusai/kompiuterinis-virusas' },
          { label: 'Kompiuterinis virusas', path: '/virusai/kompiuterinis-virusas' },
        ]} />

        {/* Hero */}
        <ScrollReveal>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="section-label">Informacinis gidas</span>
              <span className="chip-muted text-[10px] flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />12 min skaitymo</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
              Kompiuterinis virusas: kas tai, tipai ir kaip apsisaugoti
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              Kompiuteriniai virusai 2026 m. yra pavojingesni nei bet kada — AI pagalba sukurti ransomware variantai,
              polimorfinis malware ir zero-day atakos. Šis gidas padės suprasti grėsmes ir apsisaugoti.
            </p>
          </div>
        </ScrollReveal>

        {/* Stats */}
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

        {/* Virus types */}
        <ScrollReveal delay={100}>
          <SectionHeading label="Tipai" title="Pagrindiniai kompiuterinių virusų tipai" subtitle="Kenkėjiška programinė įranga skirstoma į kelias kategorijas pagal veikimo principą ir tikslą" className="mb-5" />
          <div className="space-y-3 mb-10">
            {virusTypes.map((v) => (
              <div key={v.name} className="flex gap-4 p-4 bg-card border border-border/50 rounded-xl">
                <div className="rounded-lg bg-destructive/8 p-2.5 shrink-0">
                  <v.icon className="w-5 h-5 text-destructive/70" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading font-semibold text-foreground">{v.name}</h3>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${v.color === 'text-destructive' ? 'bg-destructive/10 text-destructive' : v.color === 'text-orange-600' ? 'bg-orange-50 text-orange-600' : 'bg-amber-50 text-amber-600'}`}>{v.severity}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Infection signs */}
        <ScrollReveal delay={150}>
          <SectionHeading label="Požymiai" title="10 požymių, kad kompiuteris užkrėstas" className="mb-5" />
          <div className="bg-card border border-destructive/20 rounded-xl p-5 mb-10">
            <ul className="space-y-2.5">
              {infectionSigns.map((sign, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="font-heading font-bold text-destructive/70 shrink-0 w-5 text-right">{i + 1}.</span>
                  <span>{sign}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        {/* Spread methods */}
        <ScrollReveal delay={200}>
          <SectionHeading label="Plitimas" title="Kaip virusai patenka į kompiuterį?" className="mb-5" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
            {spreadMethods.map((m) => (
              <div key={m.method} className="bg-card border border-border/50 rounded-xl p-4">
                <m.icon className="w-4 h-4 text-primary mb-2" />
                <h3 className="font-heading font-semibold text-foreground text-sm mb-1">{m.method}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Protection */}
        <ScrollReveal delay={250}>
          <div className="bg-primary/5 border border-primary/15 rounded-xl p-5 mb-10">
            <h2 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-primary" /> Kaip apsisaugoti nuo virusų
            </h2>
            <ul className="space-y-2.5">
              {protectionTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-primary/10">
              <Link to="/antivirusines-programos" className="text-sm font-medium text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors">
                Palygink geriausias antivirusines programas 2026 <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Related guides */}
        <ScrollReveal delay={300}>
          <SectionHeading label="Susiję gidai" title="Skaitykite daugiau" className="mb-4" />
          <div className="grid sm:grid-cols-2 gap-3 mb-10">
            {[
              { path: '/virusai/virusas-telefone', title: 'Virusas telefone: požymiai ir šalinimas', tag: 'Gidas' },
              { path: '/virusai/kaip-patikrinti-ar-kompiuteryje-yra-virusas', title: 'Kaip patikrinti ar kompiuteryje yra virusas', tag: 'Praktinis' },
              { path: '/virusai/reklamos-virusas-telefone', title: 'Reklamos virusas telefone — šalinimas', tag: 'How-to' },
              { path: '/antivirusines-programos/kompiuteriui', title: 'Geriausios antivirusinės kompiuteriui', tag: 'Palyginimas' },
            ].map((g) => (
              <Link key={g.path} to={g.path}
                className="group p-4 bg-card border border-border/50 rounded-xl hover:border-primary/30 transition-colors">
                <span className="chip-muted text-[10px] mb-1 inline-block">{g.tag}</span>
                <h3 className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{g.title} →</h3>
              </Link>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={350}>
          <FAQAccordion items={faqItems} />
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <TrustDisclosure />
        </ScrollReveal>
      </div>
    </PageLayout>
  );
};

export default ComputerVirusGuidePage;
