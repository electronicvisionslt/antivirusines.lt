import {
  Wifi, Shield, ChevronRight, CheckCircle2, AlertTriangle,
  Monitor, Lock, ArrowRight, Clock, Settings, Globe, Router,
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

const mainSteps = [
  { step: 1, title: 'Prisijunkite prie maršrutizatoriaus', detail: 'Naršyklėje įveskite maršrutizatoriaus IP adresą. Dažniausi adresai: 192.168.1.1, 192.168.0.1 arba 10.0.0.1. Jį rasite ant maršrutizatoriaus lipduko arba instrukcijoje.' },
  { step: 2, title: 'Prisijunkite su admin duomenimis', detail: 'Įveskite administratoriaus vartotojo vardą ir slaptažodį. Numatytieji dažniausiai yra admin/admin arba admin/password. Jei keitėte — naudokite savo duomenis.' },
  { step: 3, title: 'Raskite WiFi nustatymus', detail: 'Ieškokite „Wireless", „WiFi Settings", „WLAN" arba „Bevielis tinklas" skyriaus. Pavadinimas priklauso nuo gamintojo.' },
  { step: 4, title: 'Pakeiskite slaptažodį', detail: 'Laukelyje „Password", „Pre-shared Key" arba „Passphrase" įveskite naują slaptažodį. Rekomenduojame bent 15 simbolių.' },
  { step: 5, title: 'Išsaugokite ir prisijunkite iš naujo', detail: 'Spustelėkite „Save" / „Apply". Visi įrenginiai bus atjungti — turėsite prisijungti iš naujo su nauju slaptažodžiu.' },
];

const routerBrands = [
  {
    name: 'TP-Link',
    ip: '192.168.0.1 arba tplinkwifi.net',
    path: 'Wireless → Wireless Security → Password',
    login: 'admin / admin',
  },
  {
    name: 'Huawei (Telia)',
    ip: '192.168.1.1',
    path: 'Home → WiFi Basic Settings → WiFi Password',
    login: 'admin / (ant lipduko)',
  },
  {
    name: 'Asus',
    ip: '192.168.1.1 arba router.asus.com',
    path: 'Wireless → General → WPA Pre-Shared Key',
    login: 'admin / admin',
  },
  {
    name: 'D-Link',
    ip: '192.168.0.1',
    path: 'Setup → Wireless Settings → Pre-Shared Key',
    login: 'admin / (tuščia)',
  },
  {
    name: 'Mikrotik (Bitė, Cgates)',
    ip: '192.168.88.1',
    path: 'Wireless → Security Profiles → WPA2 Pre-Shared Key',
    login: 'admin / (tuščia)',
  },
];

const securityTips = [
  'Naudokite WPA3 arba WPA2 šifravimą — niekada WEP',
  'WiFi slaptažodis turėtų būti bent 15 simbolių',
  'Pakeiskite numatytąjį maršrutizatoriaus admin slaptažodį',
  'Išjunkite WPS (WiFi Protected Setup) — tai saugumo spraga',
  'Reguliariai tikrinkite, kokie įrenginiai prisijungę prie tinklo',
  'Paslėpkite SSID (tinklo pavadinimą), jei norite papildomos apsaugos',
];

const faqItems = [
  { q: 'Kaip sužinoti maršrutizatoriaus IP adresą?', a: 'Windows: atidarykite Command Prompt ir įveskite „ipconfig" — ieškokite „Default Gateway". Mac: System Preferences → Network → Advanced → TCP/IP. Telefonas: WiFi nustatymuose paspauskite ant tinklo pavadinimo — rodomas „Router" arba „Gateway" adresas.' },
  { q: 'Ką daryti, jei pamiršau maršrutizatoriaus admin slaptažodį?', a: 'Jei keitėte admin slaptažodį ir jį pamiršote, vienintelis būdas — atstatyti gamyklinius nustatymus paspaudžiant RESET mygtuką (smeigtuku palaikykite ~10 sek.). Po atstatymo naudokite numatytuosius duomenis nuo lipduko.' },
  { q: 'Ar pakeitus WiFi slaptažodį atjungs visus įrenginius?', a: 'Taip, visi įrenginiai, prisijungę prie WiFi, bus atjungti. Turėsite kiekviename įrenginyje įvesti naują slaptažodį.' },
  { q: 'Koks skirtumas tarp WiFi slaptažodžio ir routerio admin slaptažodžio?', a: 'WiFi slaptažodis naudojamas prisijungti prie bevielio tinklo. Routerio admin slaptažodis naudojamas prisijungti prie maršrutizatoriaus nustatymų per naršyklę. Tai du atskiri slaptažodžiai ir abu turėtų būti stiprūs.' },
  { q: 'Koks yra saugiausias WiFi šifravimas?', a: 'WPA3 yra naujausias ir saugiausias standartas. Jei jūsų maršrutizatorius nepalaiko WPA3, naudokite WPA2-AES. Venkite WEP ir WPA-TKIP — jie yra pažeidžiami.' },
];

const WifiPasswordGuidePage = ({ category }: Props) => {
  usePageMeta({
    title: category.seoTitle || 'Kaip pakeisti WiFi slaptažodį 2026 — instrukcija',
    description: category.metaDescription || 'Kaip pakeisti WiFi slaptažodį per maršrutizatoriaus nustatymus. Instrukcija TP-Link, Huawei, Asus ir kitiems routeriams.',
  });

  return (
    <PageLayout>
      <div className="container py-8 max-w-3xl">
        <Breadcrumbs path={category.path} items={[
          { label: 'Pradžia', path: '/' },
          { label: 'Slaptažodžių saugumas', path: '/slaptazodziu-saugumas' },
          { label: 'WiFi slaptažodis', path: '/slaptazodziu-saugumas/kaip-pakeisti-wifi-slaptazodi' },
        ]} />

        {/* ── Hero ── */}
        <ScrollReveal>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="section-label">How-to gidas</span>
              <span className="chip-muted text-[10px] flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />5 min skaitymo</span>
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground leading-tight mb-3">
              Kaip pakeisti WiFi slaptažodį: instrukcija 2026 m.
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              WiFi slaptažodžio keitimas — paprastas procesas, kuris padidina jūsų namų tinklo saugumą. 
              Štai žingsnis po žingsnio instrukcija visiems populiariausiems maršrutizatoriams.
            </p>
          </div>
        </ScrollReveal>

        {/* ── When to change ── */}
        <ScrollReveal delay={50}>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded-xl p-5 mb-8">
            <h2 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Kada verta keisti WiFi slaptažodį?
            </h2>
            <ul className="space-y-1.5 text-sm text-foreground">
              {[
                'Įtariate, kad kaimynas ar pašalinis asmuo naudojasi jūsų internetu',
                'Davėte slaptažodį svečiams ir norite jį atnaujinti',
                'Naudojate numatytąjį slaptažodį nuo routerio lipduko',
                'Internetas veikia neįprastai lėtai',
                'Norite pakeisti seną, silpną slaptažodį į stipresnį',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ChevronRight className="w-3 h-3 text-amber-600 shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        {/* ── Main steps ── */}
        <ScrollReveal delay={100}>
          <SectionHeading label="Universali instrukcija" title="5 žingsniai WiFi slaptažodžiui pakeisti" className="mb-5" />
          <div className="space-y-3 mb-10">
            {mainSteps.map((s) => (
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

        {/* ── Router-specific table ── */}
        <ScrollReveal delay={150}>
          <SectionHeading label="Pagal gamintoją" title="Nustatymai populiariausiems routeriams" className="mb-5" />
          <div className="bg-card border border-border/50 rounded-xl overflow-hidden mb-10">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left font-medium text-muted-foreground p-3">Gamintojas</th>
                    <th className="text-left font-medium text-muted-foreground p-3">IP adresas</th>
                    <th className="text-left font-medium text-muted-foreground p-3">Kelias iki WiFi slaptažodžio</th>
                    <th className="text-left font-medium text-muted-foreground p-3">Numatyt. prisijungimas</th>
                  </tr>
                </thead>
                <tbody>
                  {routerBrands.map((r, i) => (
                    <tr key={i} className="border-b border-border/30 last:border-0">
                      <td className="p-3 font-medium text-foreground">{r.name}</td>
                      <td className="p-3 font-mono text-xs text-muted-foreground">{r.ip}</td>
                      <td className="p-3 text-xs text-muted-foreground">{r.path}</td>
                      <td className="p-3 font-mono text-xs text-muted-foreground">{r.login}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Security tips ── */}
        <ScrollReveal delay={200}>
          <div className="bg-primary/5 border border-primary/15 rounded-xl p-5 mb-10">
            <h2 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-primary" /> WiFi saugumo patarimai
            </h2>
            <ul className="space-y-2">
              {securityTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        {/* ── FAQ ── */}
        <ScrollReveal delay={250}>
          <FAQAccordion items={faqItems} />
        </ScrollReveal>

        {/* ── Related ── */}
        <ScrollReveal delay={300}>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link to="/slaptazodziu-saugumas/kaip-pakeisti-gmail-slaptazodi"
              className="flex-1 p-4 bg-card border border-border/50 rounded-xl hover:border-primary/30 transition-colors group">
              <span className="text-xs text-muted-foreground">Susijęs gidas</span>
              <h3 className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors">Kaip pakeisti Gmail slaptažodį →</h3>
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

export default WifiPasswordGuidePage;
