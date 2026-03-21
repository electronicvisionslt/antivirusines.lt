import {
  Smartphone, Shield, AlertTriangle, CheckCircle2, XCircle,
  Clock, ArrowRight, Bug, Bell, Trash2, Settings,
  Eye, Download, Chrome, RefreshCw,
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

const adwareSymptoms = [
  'Pop-up reklamos atsiranda užrakinimo ekrane',
  'Reklaminiai langai iššoka naudojant bet kokią programėlę',
  'Naršyklė atidaro nežinomas svetaines savaime',
  'Atsiranda pilno ekrano reklamos, kurių negalite uždaryti',
  'Telefonas veikia lėčiau, baterija greitai senka',
  'Padidėjęs duomenų naudojimas (reklamos siunčia duomenis fone)',
  'Atsiranda neįdiegtų programėlių su reklaminiais pavadinimais',
  'Pranešimų juostoje nuolat rodomos reklaminės notifikacijos',
];

const removalSteps = [
  { step: 1, title: 'Nustatykite kaltininką', detail: 'Prisiminkite, kada reklamos prasidėjo. Eikite į Nustatymai → Programėlės → rūšiuokite pagal „Neseniai įdiegtos". Tikrinkite programėles, įdiegtas prieš pat problemą.' },
  { step: 2, title: 'Patikrinkite programėlių leidimus', detail: 'Nustatymai → Programėlės → pasirinkite įtartiną → Leidimai. Adware dažnai turi „Rodyti virš kitų programų" (Draw over other apps) leidimą. Atšaukite jį.' },
  { step: 3, title: 'Pašalinkite įtartinas programėles Safe Mode', detail: 'Palaikykite maitinimo mygtuką → palaikykite „Išjungti" → „Saugusis režimas". Dabar pašalinkite kaltininkę. Safe Mode neleidžia trečiųjų šalių programoms veikti.' },
  { step: 4, title: 'Išvalykite naršyklės pranešimus', detail: 'Chrome → ⋮ → Nustatymai → Pranešimai. Peržiūrėkite svetainių sąrašą — užblokuokite visas, kurių neatpažįstate. Tai dažniausia „reklamų viruso" priežastis!' },
  { step: 5, title: 'Išvalykite naršyklės duomenis', detail: 'Chrome → ⋮ → Nustatymai → Privatumas → Išvalyti naršymo duomenis → pasirinkite „Visą laiką". Pašalinkite slapukus, talpyklą ir svetainių duomenis.' },
  { step: 6, title: 'Paleiskite antivirusinį skenavimą', detail: 'Įdiekite Malwarebytes arba Bitdefender Mobile. Atlikite pilną skenavimą — šios programos specializuojasi adware aptikime.' },
  { step: 7, title: 'Patikrinkite administratoriaus teises', detail: 'Nustatymai → Sauga → Įrenginio administratoriai. Jei matote nepažįstamą programą su administratoriaus teisėmis — atšaukite ir pašalinkite ją.' },
];

const commonCulprits = [
  { name: 'Naršyklės pranešimai (push notifications)', desc: 'Nr. 1 priežastis! Kenkėjiška svetainė paprašė leisti pranešimus — dabar siunčia reklamas. Sprendimas: naršyklės pranešimų nustatymuose užblokuokite.', isApp: false },
  { name: 'Nemokami žaidimai ir utilitos', desc: 'Žibintuvėliai, QR skaneriai, telefono valymo programos — dažnai turi integruotą adware. Pašalinkite ir naudokite integruotas OS funkcijas.', isApp: true },
  { name: 'Programėlės iš trečiųjų šalių', desc: 'APK failai atsisiųsti ne iš Google Play. Nustatymuose išjunkite „Nežinomi šaltiniai" (Unknown sources).', isApp: true },
  { name: 'Modifikuoti populiarių programų klonai', desc: '„WhatsApp Plus", „YouTube Vanced" ir panašūs klonai gali turėti kenkėjišką kodą.', isApp: true },
];

const faqItems = [
  { q: 'Ar reklamos telefone visada reiškia virusą?', a: 'Ne. Dažniausia priežastis — naršyklės pranešimai (push notifications), kuriuos netyčia leidote. Tai nėra virusas, bet sprendžiama panašiai — išjungiant pranešimus naršyklės nustatymuose.' },
  { q: 'Kaip sustabdyti reklamas Chrome naršyklėje telefone?', a: 'Chrome → ⋮ → Nustatymai → Svetainės nustatymai → Pranešimai. Užblokuokite nepažįstamas svetaines. Taip pat: Nustatymai → Privatumas → Safe Browsing → „Patobulinta apsauga".' },
  { q: 'Ar gamykliniai nustatymai pašalins reklamos virusą?', a: 'Taip, gamyklinių nustatymų atstatymas pašalina visas trečiųjų šalių programas ir jų duomenis, įskaitant adware. Tačiau pirmiausia pabandykite identifikuoti ir pašalinti kaltininką — tai greitesnis sprendimas.' },
  { q: 'Kaip atskirti adware nuo normalių programėlių reklamų?', a: 'Normalios reklamos rodomos TIK pačioje programėlėje. Jei reklamos atsiranda užrakinimo ekrane, kitose programėlėse ar kaip atskiri langai — tai adware.' },
  { q: 'Ar iPhone gali gauti reklamos virusą?', a: 'iPhone retai gauna tikrą adware dėl App Store kontrolės. Tačiau Safari pranešimų „reklamos" veikia taip pat kaip Android. Eikite į Safari → Nustatymai → Svetainės → Pranešimai ir išjunkite nepageidaujamas svetaines.' },
];

const AdwarePhoneGuidePage = ({ category }: Props) => {
  usePageMeta({
    title: category.seoTitle || 'Reklamos virusas telefone 2026 — kaip pašalinti',
    description: category.metaDescription || 'Kaip pašalinti reklamos virusą iš telefono? Pop-up reklamos, adware šalinimas Android telefone žingsnis po žingsnio. Priežastys ir prevencija.',
  });

  return (
    <PageLayout>
      <div className="container py-8 max-w-3xl">
        <Breadcrumbs path={category.path} items={[
          { label: 'Pradžia', path: '/' },
          { label: 'Virusai', path: '/virusai/kompiuterinis-virusas' },
          { label: 'Reklamos virusas telefone', path: '/virusai/reklamos-virusas-telefone' },
        ]} />

        {/* Hero */}
        <ScrollReveal>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="section-label">Šalinimo gidas</span>
              <span className="chip-muted text-[10px] flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />5 min skaitymo</span>
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground leading-tight mb-3">
              Reklamos virusas telefone: kaip pašalinti pop-up reklamas
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Telefone nuolat iššoka reklamos? Pop-up langai neduoda ramybės? Dažniausiai tai ne virusas, 
              o adware arba naršyklės pranešimai. Štai kaip išspręsti per kelias minutes.
            </p>
          </div>
        </ScrollReveal>

        {/* Important note */}
        <ScrollReveal delay={50}>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded-xl p-5 mb-8">
            <h2 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Svarbu žinoti
            </h2>
            <p className="text-sm text-foreground leading-relaxed">
              <strong>80% atvejų „reklamos virusas" telefone yra naršyklės pranešimai</strong>, kuriuos netyčia 
              leidote spustelėję „Leisti" (Allow) kenkėjiškoje svetainėje. Tai sprendžiama per 1 minutę — 
              žr. 4 žingsnį žemiau.
            </p>
          </div>
        </ScrollReveal>

        {/* Symptoms */}
        <ScrollReveal delay={75}>
          <SectionHeading label="Požymiai" title="Kaip atpažinti reklamos virusą (adware)" className="mb-5" />
          <div className="bg-card border border-destructive/20 rounded-xl p-5 mb-10">
            <ul className="space-y-2.5">
              {adwareSymptoms.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <XCircle className="w-3.5 h-3.5 text-destructive/60 shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        {/* Removal steps */}
        <ScrollReveal delay={100}>
          <SectionHeading label="Šalinimas" title="7 žingsniai reklamos virusui pašalinti" className="mb-5" />
          <div className="space-y-3 mb-10">
            {removalSteps.map((s) => (
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

        {/* Common culprits */}
        <ScrollReveal delay={150}>
          <SectionHeading label="Priežastys" title="Dažniausi reklamos šaltiniai" className="mb-5" />
          <div className="space-y-3 mb-10">
            {commonCulprits.map((c) => (
              <div key={c.name} className="bg-card border border-border/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-heading font-semibold text-foreground text-sm">{c.name}</h3>
                  <span className={`chip-muted text-[10px] ${c.isApp ? '' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {c.isApp ? 'Programėlė' : 'Naršyklė'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Prevention */}
        <ScrollReveal delay={200}>
          <div className="bg-primary/5 border border-primary/15 rounded-xl p-5 mb-10">
            <h2 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-primary" /> Kaip išvengti reklamos viruso ateityje
            </h2>
            <ul className="space-y-2.5">
              {[
                'Niekada nespauskite „Leisti" (Allow) pranešimams nežinomose svetainėse',
                'Diekite programėles TIK iš Google Play / App Store',
                'Prieš diegiant patikrinkite atsiliepimus — ieškokite žodžių „ads", „reklamos"',
                'Nenaudokite „telefono valymo" ar „baterijos optimizavimo" programėlių — jos dažnai yra adware',
                'Naudokite naršyklę su reklamos blokavimo funkcija (Brave, Firefox + uBlock Origin)',
                'Įdiekite antivirusinę su adware aptikimu (Malwarebytes, Bitdefender)',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-primary/10">
              <Link to="/antivirusines-programos/nemokamos" className="text-sm font-medium text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors">
                Nemokamos antivirusinės su adware apsauga <ArrowRight className="w-3.5 h-3.5" />
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
            <Link to="/virusai/virusas-telefone"
              className="flex-1 p-4 bg-card border border-border/50 rounded-xl hover:border-primary/30 transition-colors group">
              <span className="text-xs text-muted-foreground">Platesnis gidas</span>
              <h3 className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors">← Virusas telefone: viskas, ką reikia žinoti</h3>
            </Link>
            <Link to="/antivirusines-programos/telefonui"
              className="flex-1 p-4 bg-card border border-border/50 rounded-xl hover:border-primary/30 transition-colors group">
              <span className="text-xs text-muted-foreground">Palyginimas</span>
              <h3 className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors">Geriausios antivirusinės telefonui →</h3>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </PageLayout>
  );
};

export default AdwarePhoneGuidePage;
