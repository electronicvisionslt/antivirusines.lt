import {
  Smartphone, Shield, AlertTriangle, CheckCircle2, XCircle,
  Clock, ArrowRight, Bug, Battery, Wifi, Download, Eye,
  Lock, Bell, Trash2, RefreshCw,
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

const symptoms = [
  { icon: Battery, text: 'Baterija greitai senka — net kai telefono nenaudojate' },
  { icon: Bug, text: 'Atsiranda nepažįstamų programėlių, kurių neįdiegėte' },
  { icon: AlertTriangle, text: 'Pop-up reklamos atsiranda užrakinimo ekrane ar kitose programėlėse' },
  { icon: Wifi, text: 'Padidėjęs mobiliųjų duomenų naudojimas be priežasties' },
  { icon: RefreshCw, text: 'Telefonas veikia lėtai, „kabinasi" arba perkrauna save' },
  { icon: Lock, text: 'Matote SMS žinutes ar skambučius, kurių nedarėte' },
  { icon: Eye, text: 'Programėlės prašo neįprastų leidimų (kamera, mikrofonas, kontaktai)' },
  { icon: Bell, text: 'Gaunate keistus pranešimus iš nežinomų programų' },
];

const androidRemoval = [
  { step: 1, title: 'Įjunkite saugųjį režimą', detail: 'Palaikykite maitinimo mygtuką → palaikykite „Išjungti" → pasirinkite „Saugusis režimas". Tai išjungia visas trečiųjų šalių programas.' },
  { step: 2, title: 'Pašalinkite įtartinas programėles', detail: 'Eikite į Nustatymai → Programėlės. Ieškokite neseniai įdiegtų ar nepažįstamų programų. Pašalinkite jas.' },
  { step: 3, title: 'Patikrinkite administratoriaus teises', detail: 'Nustatymai → Sauga → Įrenginio administratoriai. Atšaukite leidimus įtartinoms programoms, tada pašalinkite jas.' },
  { step: 4, title: 'Paleiskite antivirusinį skenavimą', detail: 'Įdiekite patikimą antivirusinę (Bitdefender, Norton, ESET) ir atlikite pilną skenavimą.' },
  { step: 5, title: 'Išvalykite naršyklės duomenis', detail: 'Chrome → Nustatymai → Privatumas → Išvalyti naršymo duomenis. Pašalinkite talpyklą, slapukus ir svetainių duomenis.' },
  { step: 6, title: 'Paskutinė priemonė: gamykliniai nustatymai', detail: 'Jei nieko nepadeda: Nustatymai → Sistema → Atstatyti → Gamykliniai nustatymai. SVARBU: pirma padarykite atsarginę kopiją!' },
];

const iosProtection = [
  'iOS virusai yra itin reti dėl Apple „sandbox" sistemos',
  'Didžiausia grėsmė — sukčiavimo (phishing) svetainės ir netikros programėlės',
  'Jailbreak\'intas iPhone yra pažeidžiamas — venkite jailbreak',
  'Visada atnaujinkite iOS iki naujausios versijos',
  'Nenaudokite neoficialių programėlių parduotuvių',
  'Įjunkite „Find My iPhone" ir dviejų veiksnių autentifikaciją',
];

const preventionTips = [
  'Diekite programėles TIK iš Google Play / App Store',
  'Prieš diegiant patikrinkite atsiliepimus ir leidimų sąrašą',
  'Neleiskite diegti iš „nežinomų šaltinių" (Android)',
  'Naudokite antivirusinę programą su realaus laiko apsauga',
  'Neklikinkite nuorodų SMS žinutėse iš nežinomų siuntėjų',
  'Reguliariai atnaujinkite OS ir programėles',
  'Naudokite VPN viešuose WiFi tinkluose',
  'Nesijunkite prie nežinomų Bluetooth įrenginių',
];

const faqItems = [
  { q: 'Ar iPhone gali gauti virusą?', a: 'Tikrų virusų iPhone gauna itin retai dėl iOS saugumo architektūros. Tačiau iPhone yra pažeidžiamas sukčiavimo atakoms, kenkėjiškiems profilims ir spyware (pvz., Pegasus). Jailbreak\'intas iPhone yra žymiai pažeidžiamesnis.' },
  { q: 'Ar „Google Play Protect" pakanka Android apsaugai?', a: 'Google Play Protect suteikia bazinę apsaugą, bet nepriklausomos laboratorijos rodo, kad jis praleidžia ~20% kenkėjiškų programų. Rekomenduojame papildomą antivirusinę apsaugą.' },
  { q: 'Ką daryti, jei telefonas siunčia SMS žinutes be mano žinios?', a: 'Tai dažnas virusu požymis. Nedelsiant: 1) Įjunkite lėktuvo režimą; 2) Paleiskite saugųjį režimą; 3) Pašalinkite įtartinas programas; 4) Pakeiskite visų paskyrų slaptažodžius iš kito įrenginio.' },
  { q: 'Ar virusas gali pasklisti per Bluetooth?', a: 'Tai įmanoma, bet reta. Bluetooth virusai (pvz., „BlueBorne") gali plisti tarp įrenginių, jei Bluetooth yra įjungtas ir aptinkamas. Rekomenduojame išjungti Bluetooth, kai nenaudojate.' },
  { q: 'Kaip apsaugoti vaikų telefoną nuo virusų?', a: 'Naudokite tėvų kontrolės programą (Qustodio, Google Family Link), uždrausdami diegti programas be patvirtinimo. Įdiekite antivirusinę ir reguliariai tikrinkite, kokias programas vaikas naudoja.' },
];

const PhoneVirusGuidePage = ({ category }: Props) => {
  usePageMeta({
    title: category.seoTitle || 'Virusas telefone 2026 — požymiai, šalinimas ir apsauga',
    description: category.metaDescription || 'Kaip atpažinti virusą telefone? Šalinimo instrukcija Android ir iPhone. Požymiai, prevencija ir geriausi apsaugos patarimai 2026 m.',
  });

  return (
    <PageLayout>
      <div className="container py-8 max-w-3xl">
        <Breadcrumbs path={category.path} items={[
          { label: 'Pradžia', path: '/' },
          { label: 'Virusai', path: '/virusai/kompiuterinis-virusas' },
          { label: 'Virusas telefone', path: '/virusai/virusas-telefone' },
        ]} />

        {/* Hero */}
        <ScrollReveal>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="section-label">Informacinis gidas</span>
              <span className="chip-muted text-[10px] flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />8 min skaitymo</span>
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground leading-tight mb-3">
              Virusas telefone: požymiai, šalinimas ir apsauga
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Telefonai tapo pagrindiniu kibernetinių atakų taikiniu — 2025 m. mobilių kenkėjiškų programų skaičius 
              išaugo 50%. Štai kaip atpažinti užkrėstą telefoną ir ką daryti.
            </p>
          </div>
        </ScrollReveal>

        {/* Symptoms */}
        <ScrollReveal delay={50}>
          <SectionHeading label="Ar telefonas užkrėstas?" title="8 požymiai, kad telefone yra virusas" className="mb-5" />
          <div className="bg-card border border-destructive/20 rounded-xl p-5 mb-10">
            <ul className="space-y-3">
              {symptoms.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                  <s.icon className="w-4 h-4 text-destructive/60 shrink-0 mt-0.5" />
                  <span>{s.text}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border/30">
              Jei pastebėjote 2 ar daugiau šių požymių — didelė tikimybė, kad telefonas užkrėstas.
            </p>
          </div>
        </ScrollReveal>

        {/* Android removal */}
        <ScrollReveal delay={100}>
          <SectionHeading label="Android" title="Kaip pašalinti virusą iš Android telefono" className="mb-5" />
          <div className="space-y-3 mb-10">
            {androidRemoval.map((s) => (
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

        {/* iOS */}
        <ScrollReveal delay={150}>
          <div className="bg-muted/30 border border-border/50 rounded-xl p-5 mb-10">
            <h2 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-3">
              <Smartphone className="w-4 h-4 text-muted-foreground" /> iPhone ir iOS apsauga
            </h2>
            <ul className="space-y-2">
              {iosProtection.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        {/* Prevention */}
        <ScrollReveal delay={200}>
          <div className="bg-primary/5 border border-primary/15 rounded-xl p-5 mb-10">
            <h2 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-primary" /> Kaip apsisaugoti ateityje
            </h2>
            <ul className="space-y-2.5">
              {preventionTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-primary/10">
              <Link to="/antivirusines-programos/telefonui" className="text-sm font-medium text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors">
                Geriausios antivirusinės telefonui 2026 <ArrowRight className="w-3.5 h-3.5" />
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
            <Link to="/virusai/reklamos-virusas-telefone"
              className="flex-1 p-4 bg-card border border-border/50 rounded-xl hover:border-primary/30 transition-colors group">
              <span className="text-xs text-muted-foreground">Susijęs gidas</span>
              <h3 className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors">Reklamos virusas telefone →</h3>
            </Link>
            <Link to="/virusai/kompiuterinis-virusas"
              className="flex-1 p-4 bg-card border border-border/50 rounded-xl hover:border-primary/30 transition-colors group">
              <span className="text-xs text-muted-foreground">Informacinis gidas</span>
              <h3 className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors">← Kompiuterinis virusas</h3>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </PageLayout>
  );
};

export default PhoneVirusGuidePage;
