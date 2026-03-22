/**
 * convert-to-astro.mjs
 *
 * Transforms the React SPA source into a full Astro SSG project.
 * Fetches all published content from Supabase at build time and
 * generates .astro pages for every route.
 *
 * Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/convert-to-astro.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { cpSync, mkdirSync, writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ROOT = process.cwd();
const BUILD_DIR = join(ROOT, '_astro-build');
const BASE_DIR = join(ROOT, 'scripts', 'astro-base');
const PAGES_DIR = join(BUILD_DIR, 'src', 'pages');

// ─── Helpers ───

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function writePage(relativePath, content) {
  const fullPath = join(PAGES_DIR, relativePath);
  ensureDir(dirname(fullPath));
  writeFileSync(fullPath, content, 'utf-8');
  console.log(`  ✅ ${relativePath}`);
}

function routeToPagePath(routePath) {
  if (routePath === '/') return 'index.astro';
  return routePath.split('/').filter(Boolean).join('/') + '.astro';
}

function shouldPreserveCustomPage(routePath) {
  if (!CUSTOM_ASTRO_PATHS.has(routePath)) return false;
  return existsSync(join(PAGES_DIR, routeToPagePath(routePath)));
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseFaq(faq) {
  if (!Array.isArray(faq)) return [];
  return faq.filter(item => item && typeof item === 'object' && 'q' in item && 'a' in item);
}

function parseSections(sections) {
  if (!Array.isArray(sections)) return [];
  return sections.filter(s => s && typeof s === 'object' && 'id' in s && 'title' in s && 'content' in s);
}

// ─── Data Fetching ───

async function fetchAllData() {
  console.log('📥 Fetching data from Supabase...');

  const [
    { data: articles },
    { data: categories },
    { data: authors },
    { data: products },
  ] = await Promise.all([
    supabase.from('articles').select('*, authors(*)').eq('status', 'published'),
    supabase.from('categories').select('*'),
    supabase.from('authors').select('*'),
    supabase.from('products').select('*').eq('is_active', true).order('rating', { ascending: false }),
  ]);

  console.log(`  📄 ${articles?.length || 0} articles, 📁 ${categories?.length || 0} categories, ✍️ ${authors?.length || 0} authors, 📦 ${products?.length || 0} products`);

  return {
    articles: articles || [],
    categories: categories || [],
    authors: authors || [],
    products: products || [],
  };
}

// ─── Page Generators ───

function generateHomePage(data) {
  const top3 = data.products.filter(p => p.product_category === 'antivirus').slice(0, 3);

  return `---
import Base from '../layouts/Base.astro';
import TrustDisclosure from '../components/TrustDisclosure.astro';
import FAQ from '../components/FAQ.astro';
---

<Base
  title="Antivirusinių programų apžvalgos ir saugumo gidai 2026"
  description="Nepriklausomos antivirusinių programų apžvalgos, palyginimai ir saugumo gidai lietuvių kalba. Raskite geriausią apsaugą savo įrenginiams."
>
  <!-- HERO -->
  <section class="relative overflow-hidden border-b border-border/40">
    <div class="absolute inset-0 gradient-mesh"></div>
    <div class="container relative py-16 md:py-24 lg:py-28">
      <div class="max-w-3xl">
        <div class="inline-flex items-center gap-2 text-[11px] font-heading font-semibold text-primary uppercase tracking-[0.12em] mb-4 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/12">
          <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
          <span>Nepriklausomos apžvalgos · Atnaujinta 2026</span>
        </div>
        <h1 class="font-heading text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-foreground leading-[1.08] tracking-tight mb-5">
          Raskite geriausią<br />
          <span class="text-gradient-primary">kibernetinę apsaugą</span>
        </h1>
        <p class="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
          Objektyvūs antivirusinių programų palyginimai, saugumo gidai ir patarimai — viskas lietuvių kalba, be reklaminės šiukšlės.
        </p>
        <div class="flex flex-wrap gap-3">
          <a href="/antivirusines-programos" class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-heading font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200 text-sm shadow-sm">
            Peržiūrėti Top 5
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
          <a href="/antivirusines-programos/nemokamos" class="inline-flex items-center gap-2 px-5 py-2.5 bg-card border border-border/60 text-foreground font-heading font-semibold rounded-lg hover:bg-muted/60 transition-all duration-200 text-sm">
            Nemokamos alternatyvos
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- CONTENT HUBS -->
  <section class="container py-14 md:py-20">
    <div class="text-center mb-10">
      <h2 class="font-heading text-2xl md:text-3xl font-bold text-foreground">Kibernetinio saugumo centras</h2>
      <p class="text-muted-foreground mt-2 max-w-lg mx-auto text-sm">Pasirinkite sritį, kuri jus domina — kiekviena tema turi detalius gidus ir palyginimus.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${[
        { title: 'Antivirusinės programos', desc: 'Top 5 geriausių antivirusinių 2026 m. su detaliu palyginimu.', path: '/antivirusines-programos', tag: 'Populiariausia' },
        { title: 'Tėvų kontrolė', desc: 'Geriausios programėlės vaikų apsaugai internete.', path: '/tevu-kontrole' },
        { title: 'Slaptažodžių saugumas', desc: 'Kaip kurti stiprius slaptažodžius ir naudoti tvarkykles.', path: '/slaptazodziu-saugumas' },
        { title: 'Virusai ir grėsmės', desc: 'Kas yra kompiuterinis virusas ir kaip apsisaugoti.', path: '/virusai/kompiuterinis-virusas' },
      ].map(hub => `
      <div class="group relative rounded-xl border border-border/50 bg-card p-5 md:p-6 glow-border glow-border-hover transition-all duration-300 hover:shadow-lg h-full flex flex-col">
        ${hub.tag ? `<span class="absolute top-4 right-4 text-[10px] font-heading font-semibold text-primary bg-primary/8 border border-primary/12 px-2 py-0.5 rounded-full">${hub.tag}</span>` : ''}
        <a href="${hub.path}" class="font-heading font-bold text-foreground text-lg group-hover:text-primary transition-colors duration-200 leading-tight mb-2">${hub.title}</a>
        <p class="text-sm text-muted-foreground leading-relaxed mb-4">${hub.desc}</p>
        <a href="${hub.path}" class="inline-flex items-center gap-1.5 text-sm font-heading font-semibold text-primary mt-auto hover:underline">
          Skaityti daugiau
          <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>
      `).join('')}
    </div>
  </section>

  ${top3.length > 0 ? `
  <!-- TOP 3 -->
  <section class="border-y border-border/40 bg-muted/30">
    <div class="container py-14 md:py-20">
      <div class="text-center mb-10">
        <h2 class="font-heading text-2xl md:text-3xl font-bold text-foreground">Top 3 antivirusinės programos</h2>
        <p class="text-muted-foreground mt-2 max-w-lg mx-auto text-sm">Greitas žvilgsnis į geriausius sprendimus.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${top3.map((p, i) => `
        <div class="relative rounded-xl border bg-card p-5 ${i === 0 ? 'border-primary/30 shadow-sm' : 'border-border/50'}">
          ${i === 0 ? '<div class="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-heading font-bold text-primary-foreground bg-primary px-3 py-1 rounded-full shadow-sm">🥇 Nr. 1 pasirinkimas</div>' : ''}
          <div class="flex items-center gap-3 mb-4 mt-1">
            <div class="w-10 h-10 rounded-lg bg-muted/60 border border-border/40 flex items-center justify-center overflow-hidden shrink-0">
              ${p.logo_url ? `<img src="${escapeHtml(p.logo_url)}" alt="${escapeHtml(p.name)}" class="w-7 h-7 object-contain" />` : `<span class="text-xs font-bold text-muted-foreground">${escapeHtml(p.name?.substring(0, 2))}</span>`}
            </div>
            <div>
              <h3 class="font-heading font-bold text-foreground text-sm">${escapeHtml(p.name)}</h3>
              <div class="flex items-center gap-0.5">${'★'.repeat(Math.round(p.rating || 0))}<span class="text-xs text-muted-foreground ml-1">${p.rating}/5</span></div>
            </div>
          </div>
          <p class="text-xs text-muted-foreground mb-3 leading-relaxed">${escapeHtml(p.short_description)}</p>
          <div class="flex items-center justify-between pt-3 border-t border-border/40">
            <span class="text-xs text-muted-foreground">${escapeHtml(p.pricing_summary)}</span>
            ${p.affiliate_url ? `<a href="${escapeHtml(p.affiliate_url)}" target="_blank" rel="noopener sponsored" class="text-xs px-3 py-1.5 bg-primary text-primary-foreground font-heading font-semibold rounded-lg hover:bg-primary/90 transition-all">Išbandyti</a>` : ''}
          </div>
        </div>
        `).join('')}
      </div>
      <div class="text-center mt-8">
        <a href="/antivirusines-programos" class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-heading font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200 text-sm shadow-sm">
          Žiūrėti visą Top 5 sąrašą
        </a>
      </div>
    </div>
  </section>
  ` : ''}

  <!-- TRUST DISCLOSURE -->
  <section class="container py-14">
    <TrustDisclosure />
  </section>
</Base>`;
}

function generateArticlePage(article, categoryMap) {
  const cat = article.category_id ? categoryMap[article.category_id] : null;
  const author = article.authors;
  const sections = parseSections(article.sections);
  const faq = parseFaq(article.faq);

  const breadcrumbs = [{ label: 'Pradžia', path: '/' }];
  if (cat) breadcrumbs.push({ label: cat.name, path: cat.path });
  breadcrumbs.push({ label: article.title, path: article.path });

  return `---
import Base from '${article.path.split('/').length > 2 ? '../../' : '../'}layouts/Base.astro';
import Breadcrumbs from '${article.path.split('/').length > 2 ? '../../' : '../'}components/Breadcrumbs.astro';
import FAQ from '${article.path.split('/').length > 2 ? '../../' : '../'}components/FAQ.astro';
import TrustDisclosure from '${article.path.split('/').length > 2 ? '../../' : '../'}components/TrustDisclosure.astro';
---

<Base
  title="${escapeHtml(article.seo_title || article.title)}"
  description="${escapeHtml(article.meta_description || article.excerpt || '')}"
  ${article.canonical_url ? `canonicalUrl="${escapeHtml(article.canonical_url)}"` : ''}
  ${article.noindex ? 'noindex={true}' : ''}
>
  <article class="container py-8" itemScope itemType="https://schema.org/Article">
    <Breadcrumbs items={${JSON.stringify(breadcrumbs)}} />

    <div class="mb-10 max-w-3xl">
      <h1 class="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4" itemProp="headline">
        ${escapeHtml(article.title)}
      </h1>
      ${article.excerpt ? `<p class="text-muted-foreground leading-relaxed mb-5" itemProp="description">${escapeHtml(article.excerpt)}</p>` : ''}
      <div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground/70">
        ${author ? `<span class="font-medium">${escapeHtml(author.name)}</span>` : ''}
        <time itemProp="dateModified" datetime="${article.updated_at}">Atnaujinta: ${article.updated_at?.split('T')[0]}</time>
        ${article.read_time ? `<span>· ${escapeHtml(article.read_time)} skaitymo</span>` : ''}
      </div>
    </div>

    ${article.featured_image ? `
    <div class="rounded-xl overflow-hidden border border-border/50 mb-10 max-w-3xl">
      <img src="${escapeHtml(article.featured_image)}" alt="${escapeHtml(article.featured_image_alt || article.title)}" class="w-full h-auto object-cover" loading="lazy" />
    </div>
    ` : ''}

    <div class="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10">
      <div>
        <TrustDisclosure compact />

        <div class="prose-article">
          ${sections.map(s => `
          <h2 id="${s.id}">${escapeHtml(s.title)}</h2>
          <p>${escapeHtml(s.content)}</p>
          `).join('')}

          ${!sections.length && article.body ? article.body : ''}
        </div>

        ${article.pros?.length > 0 && article.cons?.length > 0 ? `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
          <div class="rounded-xl border border-success/20 bg-success/5 p-5">
            <h3 class="font-heading font-semibold text-success text-sm mb-3">✅ Privalumai</h3>
            <ul class="space-y-2">${(article.pros || []).map(p => `<li class="text-sm text-muted-foreground flex items-start gap-2"><span class="text-success shrink-0">+</span>${escapeHtml(p)}</li>`).join('')}</ul>
          </div>
          <div class="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
            <h3 class="font-heading font-semibold text-destructive text-sm mb-3">❌ Trūkumai</h3>
            <ul class="space-y-2">${(article.cons || []).map(c => `<li class="text-sm text-muted-foreground flex items-start gap-2"><span class="text-destructive shrink-0">−</span>${escapeHtml(c)}</li>`).join('')}</ul>
          </div>
        </div>
        ` : ''}

        ${article.verdict ? `
        <div class="rounded-xl border border-primary/15 bg-primary/[0.03] p-5 my-8">
          <div class="flex gap-3">
            <div class="w-1 rounded-full bg-primary/40 shrink-0"></div>
            <div>
              <h3 class="font-heading font-semibold text-foreground mb-2">Mūsų verdiktas</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">${escapeHtml(article.verdict)}</p>
            </div>
          </div>
        </div>
        ` : ''}

        <FAQ items={${JSON.stringify(faq)}} />
      </div>

      ${sections.length > 1 ? `
      <aside class="hidden lg:block">
        <div class="sticky top-20">
          <nav class="rounded-xl border border-border/50 bg-card p-4">
            <h3 class="font-heading font-semibold text-foreground text-sm mb-3">Turinys</h3>
            <ul class="space-y-1.5">
              ${sections.map(s => `<li><a href="#${s.id}" class="text-xs text-muted-foreground hover:text-primary transition-colors">${escapeHtml(s.title)}</a></li>`).join('')}
            </ul>
          </nav>
          <div class="mt-5"><TrustDisclosure compact /></div>
        </div>
      </aside>
      ` : ''}
    </div>
  </article>
</Base>`;
}

function generateCategoryPage(category, articles, relatedCategories = [], categoryMap = {}) {
  const faq = parseFaq(category.faq);
  const parentCategory = category.parent_id ? categoryMap[category.parent_id] : null;
  const breadcrumbs = [{ label: 'Pradžia', path: '/' }];

  if (parentCategory) {
    breadcrumbs.push({ label: parentCategory.name, path: parentCategory.path });
  }

  breadcrumbs.push({ label: category.name, path: category.path });

  const relatedHeading = category.parent_id ? 'Susijusios temos' : 'Temos šiame skyriuje';

  return `---
import Base from '${category.path.split('/').filter(Boolean).length > 1 ? '../../' : '../'}layouts/Base.astro';
import Breadcrumbs from '${category.path.split('/').filter(Boolean).length > 1 ? '../../' : '../'}components/Breadcrumbs.astro';
import FAQ from '${category.path.split('/').filter(Boolean).length > 1 ? '../../' : '../'}components/FAQ.astro';
import TrustDisclosure from '${category.path.split('/').filter(Boolean).length > 1 ? '../../' : '../'}components/TrustDisclosure.astro';
---

<Base
  title="${escapeHtml(category.seo_title || category.name)}"
  description="${escapeHtml(category.meta_description || category.description || '')}"
  ${category.canonical_url ? `canonicalUrl="${escapeHtml(category.canonical_url)}"` : ''}
>
  <div class="container py-8">
    <Breadcrumbs items={${JSON.stringify(breadcrumbs)}} />

    <div class="mb-10 max-w-2xl">
      <h1 class="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3">${escapeHtml(category.name)}</h1>
      <p class="text-muted-foreground leading-relaxed">${escapeHtml(category.description || '')}</p>
    </div>

    ${relatedCategories.length > 0 ? `
    <section class="mb-12">
      <h2 class="font-heading text-xl font-bold text-foreground mb-5">${relatedHeading}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${relatedCategories.map(item => `
        <a href="${item.path}" class="group rounded-xl border border-border/50 bg-card p-5 hover:shadow-md hover:border-primary/20 transition-all duration-300">
          <h3 class="font-heading font-bold text-foreground text-sm group-hover:text-primary transition-colors mb-2">${escapeHtml(item.name)}</h3>
          <p class="text-xs text-muted-foreground line-clamp-3 leading-relaxed">${escapeHtml(item.description || '')}</p>
          <span class="inline-flex items-center gap-1.5 mt-3 text-[11px] font-heading font-semibold text-primary">Atverti temą ${SVG.chevronRight}</span>
        </a>
        `).join('')}
      </div>
    </section>
    ` : ''}

    ${articles.length > 0 ? `
    <section class="mb-12">
      <h2 class="font-heading text-xl font-bold text-foreground mb-5">Straipsniai ir gidai</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${articles.map(a => `
        <a href="${a.path}" class="group rounded-xl border border-border/50 bg-card p-5 hover:shadow-md hover:border-primary/20 transition-all duration-300">
          <h3 class="font-heading font-bold text-foreground text-sm group-hover:text-primary transition-colors mb-2">${escapeHtml(a.title)}</h3>
          <p class="text-xs text-muted-foreground line-clamp-2 leading-relaxed">${escapeHtml(a.excerpt || '')}</p>
          <div class="flex items-center gap-2 mt-3 text-[11px] text-muted-foreground/60">
            <time>${a.updated_at?.split('T')[0]}</time>
            ${a.read_time ? `<span>· ${a.read_time}</span>` : ''}
          </div>
        </a>
        `).join('')}
      </div>
    </section>
    ` : ''}

    ${faq.length > 0 ? `<FAQ items={${JSON.stringify(faq)}} />` : ''}
    <TrustDisclosure />
  </div>
</Base>`;
}

function generateAuthorPage(author, articles) {
  const breadcrumbs = [
    { label: 'Pradžia', path: '/' },
    { label: author.name, path: `/autoriai/${author.slug}` },
  ];

  return `---
import Base from '../../layouts/Base.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';
---

<Base
  title="${escapeHtml(author.seo_title || author.name)}"
  description="${escapeHtml(author.meta_description || author.bio || '')}"
>
  <div class="container py-8">
    <Breadcrumbs items={${JSON.stringify(breadcrumbs)}} />

    <div class="mb-10 max-w-2xl">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-xl">
          ${escapeHtml(author.initials || author.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2))}
        </div>
        <div>
          <h1 class="font-heading text-2xl font-bold text-foreground">${escapeHtml(author.name)}</h1>
          ${(author.expertise || []).length > 0 ? `
          <div class="flex flex-wrap gap-1.5 mt-1">
            ${(author.expertise || []).map(e => `<span class="chip-primary">${escapeHtml(e)}</span>`).join('')}
          </div>
          ` : ''}
        </div>
      </div>
      <p class="text-muted-foreground leading-relaxed">${escapeHtml(author.bio || '')}</p>
    </div>

    ${articles.length > 0 ? `
    <section>
      <h2 class="font-heading text-xl font-bold text-foreground mb-5">Straipsniai</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${articles.map(a => `
        <a href="${a.path}" class="group rounded-xl border border-border/50 bg-card p-5 hover:shadow-md hover:border-primary/20 transition-all duration-300">
          <h3 class="font-heading font-bold text-foreground text-sm group-hover:text-primary transition-colors mb-2">${escapeHtml(a.title)}</h3>
          <p class="text-xs text-muted-foreground line-clamp-2 leading-relaxed">${escapeHtml(a.excerpt || '')}</p>
        </a>
        `).join('')}
      </div>
    </section>
    ` : ''}
  </div>
</Base>`;
}

function generate404Page() {
  return `---
import Base from '../layouts/Base.astro';
---

<Base title="Puslapis nerastas" noindex={true}>
  <div class="container py-20 text-center">
    <h1 class="font-heading text-6xl font-extrabold text-foreground mb-4">404</h1>
    <p class="text-muted-foreground text-lg mb-8">Puslapis nerastas</p>
    <a href="/" class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-heading font-semibold rounded-lg hover:bg-primary/90 transition-all text-sm">
      Grįžti į pradžią
    </a>
  </div>
</Base>`;
}

// ─── Static Pages ───

function generateStaticPages() {
  const pages = {
    'apie': { title: 'Apie mus', content: 'Informacija apie antivirusines.lt portalą.' },
    'kontaktai': { title: 'Kontaktai', content: 'Susisiekite su mumis.' },
    'affiliate-atskleidimas': { title: 'Affiliate atskleidimas', content: 'Affiliate partnerystės atskleidimas.' },
    'privatumo-politika': { title: 'Privatumo politika', content: 'Privatumo politika.' },
    'slapuku-politika': { title: 'Slapukų politika', content: 'Slapukų naudojimo politika.' },
  };

  const result = [];
  for (const [slug, page] of Object.entries(pages)) {
    result.push({
      path: `${slug}.astro`,
      content: `---
import Base from '../layouts/Base.astro';
import Breadcrumbs from '../components/Breadcrumbs.astro';
---

<Base title="${escapeHtml(page.title)}">
  <div class="container py-8">
    <Breadcrumbs items={${JSON.stringify([{ label: 'Pradžia', path: '/' }, { label: page.title, path: `/${slug}` }])}} />
    <h1 class="font-heading text-3xl md:text-4xl font-bold text-foreground mb-8">${escapeHtml(page.title)}</h1>
    <div class="prose-article max-w-3xl">
      <p>${escapeHtml(page.content)}</p>
    </div>
  </div>
</Base>`,
    });
  }
  return result;
}

// ─── Flagship Landing Pages ───

/* SVG icon strings for static HTML */
const SVG = {
  shield: '<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',
  star: '<svg class="w-3.5 h-3.5 fill-amber-400 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  starEmpty: '<svg class="w-3.5 h-3.5 fill-muted text-muted-foreground/20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  check: '<svg class="w-3.5 h-3.5 text-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  x: '<svg class="w-3.5 h-3.5 text-muted-foreground/25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  checkCircle: '<svg class="w-3 h-3 text-success mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  xCircle: '<svg class="w-3 h-3 text-muted-foreground/30 mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  ext: '<svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  arrowRight: '<svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  chevronRight: '<svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  award: '<svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
  barChart: '<svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
  layers: '<svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
  zap: '<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  helpCircle: '<svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  smartphone: '<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
  users: '<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  heart: '<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  lock: '<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  globe: '<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  badgeCheck: '<svg class="w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>',
};

function renderRatingStars(rating) {
  const rounded = Math.round(rating);
  return `<div class="flex items-center gap-0.5">
    ${[1,2,3,4,5].map(s => s <= rounded ? SVG.star : SVG.starEmpty).join('')}
    <span class="ml-1.5 text-xs font-bold text-foreground tabular-nums">${rating.toFixed(1)}</span>
  </div>`;
}

function renderProductLogo(product, size = 40) {
  const boxSize = size + 12;
  if (product.logo_url) {
    return `<div class="rounded-xl bg-white border border-border/40 flex items-center justify-center shrink-0 elevation-1 overflow-hidden" style="width:${boxSize}px;height:${boxSize}px">
      <img src="${escapeHtml(product.logo_url)}" alt="${escapeHtml(product.name)} logotipas" width="${size}" height="${size}" class="object-contain" loading="lazy" />
    </div>`;
  }
  return `<div class="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/12 flex items-center justify-center shrink-0 elevation-1" style="width:${boxSize}px;height:${boxSize}px">
    <span class="font-heading font-bold text-primary" style="font-size:${Math.round(size*0.38)}px">${escapeHtml((product.brand || product.name).slice(0,2).toUpperCase())}</span>
  </div>`;
}

function renderFeatureCheck(val) {
  if (val === true) return `<span class="flex justify-center">${SVG.check}</span>`;
  if (val === false || val === undefined || val === null) return `<span class="flex justify-center">${SVG.x}</span>`;
  return `<span class="text-xs text-muted-foreground">${escapeHtml(String(val))}</span>`;
}

function renderAffiliateButton(product, cls = '', label = 'Apsilankyti') {
  if (!product.affiliate_url) return '';
  return `<a href="${escapeHtml(product.affiliate_url)}" target="_blank" rel="nofollow sponsored noopener noreferrer"
    class="inline-flex items-center justify-center gap-1.5 font-heading font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.97] elevation-primary ${cls}">
    ${escapeHtml(label)} ${SVG.ext}
  </a>`;
}

function renderPlatformTags(platforms) {
  if (!platforms?.length) return '';
  return `<div class="flex flex-wrap gap-1">${platforms.map(p => `<span class="chip-muted"><span class="w-2.5 h-2.5 inline-block"></span>${escapeHtml(p)}</span>`).join('')}</div>`;
}

const featureColsDef = [
  { key: 'Realaus laiko apsauga', label: 'Realaus laiko aps.' },
  { key: 'VPN', label: 'VPN' },
  { key: 'Slaptažodžių tvarkyklė', label: 'Slaptažodžiai' },
  { key: 'Ugniasienė', label: 'Ugniasienė' },
  { key: 'Tėvų kontrolė', label: 'Tėvų kontr.' },
  { key: 'Telefonų apsauga', label: 'Tel. apsauga' },
  { key: 'Debesų saugykla', label: 'Debesų saug.' },
  { key: 'Dark web stebėjimas', label: 'Dark web' },
  { key: 'Tapatybės apsauga', label: 'Tapatybės aps.' },
  { key: 'Sukčių apsauga', label: 'Sukčių aps.' },
];

function generateAntivirusLandingPage(category, products, catArticles) {
  const faq = parseFaq(category.faq);
  const top5 = products.filter(p => p.product_category === 'antivirus').slice(0, 5);
  const features = product => (typeof product.features === 'object' && product.features) || {};
  const findProduct = (key) => products.find(p => (p.name || '').includes(key) || (p.brand || '').includes(key));
  const bestOverall = top5[0];
  const bestFree = products.find(p => p.free_version);
  const bestFamily = products.find(p => features(p)['Tėvų kontrolė'] === true);

  const jumpLinks = [
    { href: '#top-5', label: 'Top 5', svg: SVG.award },
    { href: '#palyginimas', label: 'Palyginimas', svg: SVG.barChart },
    { href: '#pagal-poreiki', label: 'Pagal poreikį', svg: SVG.layers },
    { href: '#nemokama-vs-mokama', label: 'Nemokama vs mokama', svg: SVG.zap },
    { href: '#kaip-pasirinkti', label: 'Kaip pasirinkti', svg: SVG.shield },
    { href: '#duk', label: 'DUK', svg: SVG.helpCircle },
  ];

  const useCases = [
    { title: 'Geriausia visapusiška apsauga', shortWhy: 'Plačiausias funkcijų rinkinys: antivirusas, VPN, slaptažodžių tvarkyklė ir tamsiojo interneto stebėjimas viename pakete.', matchKey: 'Norton', tag: '🥇 Nr. 1', svg: SVG.award },
    { title: 'Geriausia nemokama antivirusinė', shortWhy: 'Geriausias grėsmių aptikimas tarp nemokamų alternatyvų, be agresyvios reklamos ir su realaus laiko apsauga.', matchKey: 'Avast', tag: 'Nemokama', svg: SVG.zap },
    { title: 'Geriausia šeimoms', shortWhy: 'Tėvų kontrolė, iki 5 įrenginių viena licencija, debesų saugykla ir centralizuotas šeimos valdymas iš vienos paskyros.', matchKey: 'Norton', tag: 'Šeimoms', svg: SVG.users },
    { title: 'Geriausia telefonui', shortWhy: 'Dedikuota mobilioji apsauga su anti-theft, anti-phishing ir minimaliu poveikiu baterijai.', matchKey: 'ESET', tag: 'Mobiliai', svg: SVG.smartphone },
    { title: 'Geriausia pradedantiesiems', shortWhy: 'Paprasta sąsaja, automatinis veikimas ir aiškūs pranešimai — instaliuojama per 3 minutes, veikia be nustatymų.', matchKey: 'Norton', tag: 'Lengva', svg: SVG.heart },
  ];

  const buyerGuide = [
    { q: 'Kiek įrenginių norite apsaugoti?', a: 'Vienam įrenginiui gali pakakti nemokamos ar Windows Defender. 2+ įrenginiams — mokamas planas su kelių įrenginių licencija kainuos žymiai pigiau vienam įrenginiui.', svg: SVG.layers },
    { q: 'Ar reikia telefono apsaugos?', a: 'Android yra atviresnė grėsmėms nei iOS. Rinkitės programą su dedikuota mobilia versija ir minimaliu poveikiu baterijai.', svg: SVG.smartphone },
    { q: 'Ar turite vaikų internete?', a: 'Prioritetas — tėvų kontrolė ir turinio filtravimas. Norton ir Bitdefender siūlo stipriausias šeimos kontrolės funkcijas.', svg: SVG.users },
    { q: 'Ar jums svarbus VPN?', a: 'Viešuose Wi-Fi tinkluose VPN būtinas. Daugelis mokamų antivirusinių turi integruotą VPN — paprasčiau ir pigiau nei pirkti atskirai.', svg: SVG.lock },
    { q: 'Koks jūsų biudžetas?', a: 'Nemokamos versijos — bazinė apsauga. Mokamos: 20–60 €/metus. Šeimos planai (iki 15 įrenginių) dažnai kainuoja tiek pat kiek 3 įrenginių licencija.', svg: SVG.barChart },
    { q: 'Paprastumas ar kontrolė?', a: 'Norton, Avast — beveik automatinis veikimas. ESET, Bitdefender — detalesni nustatymai pažengusiems naudotojams.', svg: SVG.shield },
  ];

  const pillarFaq = [
    { q: 'Ar verta mokėti už antivirusinę programą?', a: 'Jei saugote kelis įrenginius, naudojate viešus Wi-Fi tinklus arba jums svarbi tėvų kontrolė ir VPN — taip. Mokamos programos siūlo kelių įrenginių apsaugą, prioritetinę pagalbą ir papildomas funkcijas.' },
    { q: 'Ar pakanka Windows Defender?', a: 'Windows Defender suteikia solidžią bazinę apsaugą ir daugeliui atsargių naudotojų to užtenka. Tačiau jis neturi VPN, slaptažodžių tvarkyklės, tėvų kontrolės ir kelių įrenginių valdymo.' },
    { q: 'Kokia antivirusinė geriausia telefonui?', a: 'Android telefonams rekomenduojame ESET Home Security — viena iš nedaugelio su pilna telefonų apsauga, anti-theft ir minimaliu poveikiu baterijai.' },
    { q: 'Ar nemokamos antivirusinės programos yra saugios?', a: 'Patikimų gamintojų nemokamos versijos — Avast Free, Bitdefender Free — yra saugios ir efektyvios bazinei apsaugai.' },
    { q: 'Ar antivirusinė sulėtina kompiuterį?', a: 'Šiuolaikinės antivirusinės turi minimalų poveikį našumui. Geriausi sprendimai kaip Bitdefender ir Norton dirba fone beveik nepastebimi.' },
    { q: 'Kiek įrenginių paprastai apima viena licencija?', a: 'Daugelis mokamų planų apima 3–10 įrenginių. Norton 360 Deluxe siūlo iki 5, Premium — iki 10. Bitdefender planai apima 5 įrenginius.' },
  ];

  const faqItems = faq.length > 0 ? faq : pillarFaq;

  const methodology = [
    { title: 'Apsaugos efektyvumas', desc: 'Kenkėjiškos programinės įrangos aptikimas ir realaus laiko apsaugos veiksmingumas.', svg: SVG.shield },
    { title: 'Sistemos našumas', desc: 'Poveikis kompiuterio ir telefono greičiui bei baterijos suvartojimas.', svg: SVG.zap },
    { title: 'Papildomos funkcijos', desc: 'VPN, slaptažodžių tvarkyklė, tėvų kontrolė ir jų praktinė nauda.', svg: SVG.layers },
    { title: 'Kainos ir vertės santykis', desc: 'Pirmo metų ir atnaujinimo kaina, įrenginių skaičius, nemokamos versijos.', svg: SVG.barChart },
    { title: 'Naudojimo paprastumas', desc: 'Sąsajos aiškumas, diegimo greitis ir pagalbos prieinamumas.', svg: SVG.heart },
    { title: 'Kelių įrenginių palaikymas', desc: 'Platformų suderinamumas ir licencijos lankstumas šeimoms.', svg: SVG.globe },
  ];

  const relatedGuides = [
    { path: '/antivirusines-programos/nemokamos', label: 'Nemokamos antivirusinės programos', desc: 'Geriausi nemokami sprendimai bazinei apsaugai' },
    { path: '/antivirusines-programos/telefonui', label: 'Antivirusinė telefonui', desc: 'Android ir iOS apsaugos gidas' },
    { path: '/antivirusines-programos/kompiuteriui', label: 'Antivirusinė kompiuteriui', desc: 'Windows ir Mac apsaugos palyginimas' },
    { path: '/virusai/kompiuterinis-virusas', label: 'Kas yra kompiuterinis virusas?', desc: 'Virusų tipai ir kaip jie veikia' },
    { path: '/virusai/virusas-telefone', label: 'Kaip pašalinti virusą iš telefono', desc: 'Žingsnis po žingsnio gidas' },
  ];

  return `---
import Base from '../layouts/Base.astro';
import Breadcrumbs from '../components/Breadcrumbs.astro';
import FAQ from '../components/FAQ.astro';
import TrustDisclosure from '../components/TrustDisclosure.astro';
---

<Base
  title="${escapeHtml(category.seo_title || 'Geriausios antivirusinės programos 2026 — palyginimas ir apžvalgos')}"
  description="${escapeHtml(category.meta_description || 'Nepriklausomos antivirusinių programų apžvalgos ir palyginimas. Raskite geriausią antivirusinę savo kompiuteriui, telefonui ar šeimai.')}"
  ${category.canonical_url ? `canonicalUrl="${escapeHtml(category.canonical_url)}"` : ''}
>
  <div class="container py-8 max-w-5xl mx-auto">
    <Breadcrumbs items={${JSON.stringify([{ label: 'Pradžia', path: '/' }, { label: 'Antivirusinės programos', path: '/antivirusines-programos' }])}} />

    <!-- ═══ 1. HERO ═══ -->
    <section class="mb-8">
      <h1 class="font-heading text-3xl md:text-4xl lg:text-[2.85rem] font-extrabold text-foreground leading-[1.08] mb-3 tracking-tight">
        Geriausios antivirusinės programos 2026&nbsp;m.
      </h1>
      <p class="text-muted-foreground text-[15px] leading-relaxed max-w-2xl mb-6">
        Išanalizavome populiariausias antivirusines programas pagal apsaugos efektyvumą, papildomas funkcijas ir kainą. Žemiau — redakcijos Top&nbsp;5, detalus palyginimas ir patarimai, kaip pasirinkti.
      </p>

      ${top5.length > 0 ? `
      <!-- Quick winner badges -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
        ${bestOverall ? `
        <a href="#top-5" class="card-premium-featured p-3.5 flex items-center gap-3 hover-lift group">
          ${renderProductLogo(bestOverall, 32)}
          <div class="min-w-0">
            <span class="chip-primary mb-1">Geriausia 2026</span>
            <span class="text-sm text-foreground font-semibold block leading-tight">${escapeHtml(bestOverall.name)}</span>
            <span class="text-[11px] text-muted-foreground">${escapeHtml(bestOverall.pricing_summary)}</span>
          </div>
        </a>` : ''}
        ${bestFree ? `
        <a href="#top-5" class="card-premium p-3.5 flex items-center gap-3 hover-lift group">
          ${renderProductLogo(bestFree, 32)}
          <div class="min-w-0">
            <span class="chip-success mb-1">Geriausia nemokama</span>
            <span class="text-sm text-foreground font-semibold block leading-tight">${escapeHtml(bestFree.name)}</span>
            <span class="text-[11px] text-muted-foreground">${escapeHtml(bestFree.pricing_summary)}</span>
          </div>
        </a>` : ''}
        ${bestFamily ? `
        <a href="#pagal-poreiki" class="card-premium p-3.5 flex items-center gap-3 hover-lift group">
          ${renderProductLogo(bestFamily, 32)}
          <div class="min-w-0">
            <span class="chip-primary mb-1">Geriausia šeimoms</span>
            <span class="text-sm text-foreground font-semibold block leading-tight">${escapeHtml(bestFamily.name)}</span>
            <span class="text-[11px] text-muted-foreground">${escapeHtml(bestFamily.pricing_summary)}</span>
          </div>
        </a>` : ''}
      </div>
      ` : ''}

      <!-- Jump nav -->
      <nav class="flex flex-wrap gap-1.5" aria-label="Greitoji navigacija">
        ${jumpLinks.map(link => `
        <a href="${link.href}" class="text-[11px] font-heading font-medium px-3 py-2 rounded-lg bg-card text-muted-foreground hover:text-primary hover:border-primary/20 border border-border/50 transition-all duration-200 inline-flex items-center gap-1.5 elevation-1">
          ${link.svg} ${link.label}
        </a>`).join('')}
      </nav>
    </section>

    <div class="section-divider mb-10"></div>

    <!-- ═══ 2. TOP 5 ═══ -->
    ${top5.length > 0 ? `
    <section id="top-5" class="mb-16 scroll-mt-20">
      <div class="mb-6">
        <h2 class="font-heading text-2xl font-bold text-foreground leading-tight">Top 5 antivirusinės programos</h2>
        <p class="text-muted-foreground text-sm mt-1.5 max-w-xl leading-relaxed">Programos, kurios šiandien siūlo geriausią apsaugos, funkcijų ir kainos derinį.</p>
      </div>
      <div class="space-y-3">
        ${top5.map((product, i) => {
          const feats = features(product);
          return `
        <div class="relative overflow-hidden transition-all duration-200 ${i === 0 ? 'card-premium-featured' : 'card-premium'}">
          ${i === 0 ? '<div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/40 via-primary to-primary/40"></div>' : ''}
          <div class="p-4 md:p-5">
            <!-- Desktop -->
            <div class="hidden md:grid md:grid-cols-[28px_52px_1fr_120px_110px_160px] lg:grid-cols-[30px_52px_1fr_130px_120px_170px] items-center gap-x-3">
              <span class="font-heading font-extrabold text-2xl tabular-nums text-center shrink-0 ${i === 0 ? 'text-primary' : 'text-muted-foreground/25'}">${i + 1}</span>
              ${renderProductLogo(product, 36)}
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="font-heading font-bold text-foreground text-[15px] leading-tight">${escapeHtml(product.name)}</h3>
                  ${i === 0 ? '<span class="chip-primary">Nr. 1</span>' : ''}
                  ${product.free_version && i !== 0 ? '<span class="chip-success">Nemokama</span>' : ''}
                </div>
                <p class="text-[11px] text-muted-foreground mt-0.5 leading-snug">${escapeHtml(product.best_for || '')}</p>
              </div>
              ${renderRatingStars(product.rating || 0)}
              <span class="text-sm font-heading font-bold text-foreground whitespace-nowrap">${escapeHtml(product.pricing_summary || '')}</span>
              <div class="justify-self-end">
                ${renderAffiliateButton(product, 'px-5 py-2.5 text-sm whitespace-nowrap', 'Gauti pasiūlymą')}
              </div>
            </div>

            <!-- Desktop: verdict + details -->
            <div class="hidden md:block mt-3 pt-3 border-t border-border/30">
              <p class="text-[12.5px] text-muted-foreground leading-relaxed mb-3">${escapeHtml(product.verdict || product.short_description || '')}</p>
              <div class="grid grid-cols-3 gap-x-4 gap-y-2">
                <div>
                  <p class="section-label text-[9px] mb-1.5">Privalumai</p>
                  <ul class="space-y-0.5">
                    ${(product.pros || []).slice(0, 3).map(p => `<li class="flex items-start gap-1.5 text-[12px] text-muted-foreground leading-snug">${SVG.checkCircle} ${escapeHtml(p)}</li>`).join('')}
                  </ul>
                </div>
                <div>
                  <p class="section-label text-[9px] mb-1.5">Trūkumai</p>
                  <ul class="space-y-0.5">
                    ${(product.cons || []).slice(0, 2).map(c => `<li class="flex items-start gap-1.5 text-[12px] text-muted-foreground leading-snug">${SVG.xCircle} ${escapeHtml(c)}</li>`).join('')}
                  </ul>
                </div>
                <div>
                  <p class="section-label text-[9px] mb-1.5">Funkcijos</p>
                  <div class="flex flex-wrap gap-x-3 gap-y-1 mb-1.5">
                    ${featureColsDef.map(col => {
                      const val = feats[col.key];
                      return `<span class="inline-flex items-center gap-1 text-[11px] text-muted-foreground">${val === true ? SVG.check : SVG.x} ${col.label}</span>`;
                    }).join('')}
                  </div>
                  ${renderPlatformTags(product.supported_platforms)}
                </div>
              </div>
            </div>

            <!-- Mobile -->
            <div class="md:hidden">
              <div class="flex items-center gap-3 mb-2">
                <span class="font-heading font-extrabold text-2xl tabular-nums w-7 text-center shrink-0 ${i === 0 ? 'text-primary' : 'text-muted-foreground/25'}">${i + 1}</span>
                ${renderProductLogo(product, 36)}
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="font-heading font-bold text-foreground text-[15px] leading-tight">${escapeHtml(product.name)}</h3>
                    ${i === 0 ? '<span class="chip-primary">Nr. 1</span>' : ''}
                    ${product.free_version && i !== 0 ? '<span class="chip-success">Nemokama</span>' : ''}
                  </div>
                  <p class="text-[11px] text-muted-foreground mt-0.5 leading-snug">${escapeHtml(product.best_for || '')}</p>
                </div>
              </div>
              <div class="flex items-center gap-4 mb-2">
                ${renderRatingStars(product.rating || 0)}
                <span class="text-sm font-heading font-bold text-foreground">${escapeHtml(product.pricing_summary || '')}</span>
              </div>
              <p class="text-[12px] text-muted-foreground leading-relaxed mb-2">${escapeHtml(product.verdict || product.short_description || '')}</p>
              <div class="mb-2 pt-2 border-t border-border/30 grid grid-cols-1 gap-y-2">
                <div>
                  <p class="section-label text-[9px] mb-1">Privalumai</p>
                  <ul class="space-y-0.5">
                    ${(product.pros || []).slice(0, 3).map(p => `<li class="flex items-start gap-1.5 text-[12px] text-muted-foreground leading-snug">${SVG.checkCircle} ${escapeHtml(p)}</li>`).join('')}
                  </ul>
                </div>
                <div>
                  <p class="section-label text-[9px] mb-1">Trūkumai</p>
                  <ul class="space-y-0.5">
                    ${(product.cons || []).slice(0, 2).map(c => `<li class="flex items-start gap-1.5 text-[12px] text-muted-foreground leading-snug">${SVG.xCircle} ${escapeHtml(c)}</li>`).join('')}
                  </ul>
                </div>
                <div>
                  <p class="section-label text-[9px] mb-1">Funkcijos</p>
                  <div class="flex flex-wrap gap-x-3 gap-y-1 mb-1">
                    ${featureColsDef.map(col => {
                      const val = feats[col.key];
                      return `<span class="inline-flex items-center gap-1 text-[11px] text-muted-foreground">${val === true ? SVG.check : SVG.x} ${col.label}</span>`;
                    }).join('')}
                  </div>
                  ${renderPlatformTags(product.supported_platforms)}
                </div>
              </div>
              ${renderAffiliateButton(product, 'px-5 py-2.5 text-sm w-full', 'Gauti pasiūlymą')}
            </div>
          </div>
        </div>`;
        }).join('')}
      </div>
    </section>
    ` : ''}

    <div class="section-divider mb-12"></div>

    <!-- ═══ 3. COMPARISON TABLE ═══ -->
    ${top5.length > 0 ? `
    <section id="palyginimas" class="mb-16 scroll-mt-20">
      <div class="mb-5">
        <h2 class="font-heading text-2xl font-bold text-foreground leading-tight">Detalus palyginimas</h2>
        <p class="text-muted-foreground text-sm mt-1.5 max-w-xl leading-relaxed">Visų vertinamų programų funkcijų ir kainų palyginimas vienoje lentelėje.</p>
      </div>

      <div class="rounded-xl border border-border/60 bg-card elevation-2 overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border/50 bg-muted/30">
              <th class="p-3 text-left border-r border-border/30 min-w-[140px]"></th>
              ${top5.map((p, i) => `
              <th class="p-4 text-center border-r border-border/30 last:border-r-0 ${i === 0 ? 'bg-primary/[0.04]' : ''}">
                <div class="h-[52px] flex items-center justify-center mb-2">${renderProductLogo(p, 38)}</div>
                <p class="font-heading font-bold text-foreground text-[13px] leading-tight mb-1">${escapeHtml(p.name)}</p>
                <p class="text-[10px] text-muted-foreground mb-3">${escapeHtml(p.pricing_summary || '')}</p>
                ${renderAffiliateButton(p, 'px-3.5 py-1.5 text-[11px]')}
              </th>`).join('')}
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-border/20 bg-muted/[0.12]">
              <td class="p-3 border-r border-border/30"><span class="text-xs font-heading font-semibold text-foreground">Įvertinimas</span></td>
              ${top5.map((p, i) => `<td class="p-3 text-center border-r border-border/20 last:border-r-0 ${i === 0 ? 'bg-primary/[0.02]' : ''}"><span class="inline-flex items-center gap-1 text-xs font-bold text-foreground">${SVG.star} ${(p.rating || 0).toFixed(1)}</span></td>`).join('')}
            </tr>
            <tr class="border-b border-border/20">
              <td class="p-3 border-r border-border/30"><span class="text-xs font-heading font-semibold text-foreground">Kaina</span></td>
              ${top5.map((p, i) => `<td class="p-3 text-center border-r border-border/20 last:border-r-0 ${i === 0 ? 'bg-primary/[0.02]' : ''}"><span class="text-xs font-medium text-muted-foreground">${escapeHtml(p.pricing_summary || '')}</span></td>`).join('')}
            </tr>
            <tr class="border-b border-border/20 bg-muted/[0.12]">
              <td class="p-3 border-r border-border/30"><span class="text-xs font-heading font-semibold text-foreground">Geriausia kam</span></td>
              ${top5.map((p, i) => `<td class="p-3 text-center border-r border-border/20 last:border-r-0 ${i === 0 ? 'bg-primary/[0.02]' : ''}"><span class="text-xs font-semibold text-primary">${escapeHtml(p.best_for || '')}</span></td>`).join('')}
            </tr>
            <tr class="border-b border-border/20">
              <td class="p-3 border-r border-border/30"><span class="text-xs font-heading font-semibold text-foreground">Nemokama versija</span></td>
              ${top5.map((p, i) => `<td class="p-3 text-center border-r border-border/20 last:border-r-0 ${i === 0 ? 'bg-primary/[0.02]' : ''}">${renderFeatureCheck(p.free_version)}</td>`).join('')}
            </tr>
            ${featureColsDef.map((col, ri) => `
            <tr class="border-b border-border/20 ${ri % 2 === 0 ? 'bg-muted/[0.12]' : ''}">
              <td class="p-3 border-r border-border/30"><span class="text-xs font-heading font-semibold text-foreground">${col.label}</span></td>
              ${top5.map((p, i) => `<td class="p-3 text-center border-r border-border/20 last:border-r-0 ${i === 0 ? 'bg-primary/[0.02]' : ''}">${renderFeatureCheck(features(p)[col.key])}</td>`).join('')}
            </tr>`).join('')}
            <tr>
              <td class="p-3 border-r border-border/30"><span class="text-xs font-heading font-semibold text-foreground">Platformos</span></td>
              ${top5.map((p, i) => `<td class="p-3 text-center border-r border-border/20 last:border-r-0 ${i === 0 ? 'bg-primary/[0.02]' : ''}"><span class="text-[11px] text-muted-foreground">${(p.supported_platforms || []).join(', ')}</span></td>`).join('')}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    ` : ''}

    <div class="section-divider mb-12"></div>

    <!-- ═══ 4. BEST BY USE CASE ═══ -->
    <section id="pagal-poreiki" class="mb-16 scroll-mt-20">
      <div class="mb-5">
        <h2 class="font-heading text-2xl font-bold text-foreground leading-tight">Geriausia antivirusinė pagal poreikį</h2>
        <p class="text-muted-foreground text-sm mt-1.5 max-w-xl leading-relaxed">Pasirinkite situaciją — parodysime tinkamiausią sprendimą.</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        ${useCases.map((uc, i) => {
          const product = findProduct(uc.matchKey);
          return `
        <div class="card-premium p-4 flex flex-col ${i === 0 ? 'sm:col-span-2 lg:col-span-1 card-premium-featured' : ''}">
          <div class="flex items-start gap-2.5 mb-3">
            <div class="w-9 h-9 rounded-xl bg-primary/10 border border-primary/12 flex items-center justify-center shrink-0">${uc.svg}</div>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5 mb-0.5">
                <h3 class="font-heading font-bold text-foreground text-sm leading-snug">${escapeHtml(uc.title)}</h3>
                <span class="chip-primary text-[9px]">${uc.tag}</span>
              </div>
              <p class="text-[11px] text-muted-foreground leading-relaxed">${escapeHtml(uc.shortWhy)}</p>
            </div>
          </div>
          ${product ? `
          <div class="flex items-center gap-3 pt-3 border-t border-border/30 mt-auto">
            ${renderProductLogo(product, 28)}
            <div class="flex-1 min-w-0">
              <p class="font-heading font-bold text-foreground text-[13px]">${escapeHtml(product.name)}</p>
              <div class="flex items-center gap-2">
                ${renderRatingStars(product.rating || 0)}
                <span class="text-[11px] text-muted-foreground">${escapeHtml(product.pricing_summary || '')}</span>
              </div>
            </div>
            ${renderAffiliateButton(product, 'px-3 py-1.5 text-[11px] shrink-0')}
          </div>` : ''}
        </div>`;
        }).join('')}
      </div>
    </section>

    <div class="section-divider mb-12"></div>

    <!-- ═══ 5. FREE VS PAID ═══ -->
    <section id="nemokama-vs-mokama" class="mb-16 scroll-mt-20">
      <div class="mb-5">
        <h2 class="font-heading text-2xl font-bold text-foreground leading-tight">Nemokama ar mokama antivirusinė?</h2>
        <p class="text-muted-foreground text-sm mt-1.5 max-w-xl leading-relaxed">Atsakymas priklauso nuo jūsų situacijos. Štai praktinis palyginimas.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        <div class="card-premium p-5">
          <div class="flex items-center gap-2.5 mb-3">
            <div class="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center">${SVG.zap}</div>
            <h3 class="font-heading font-bold text-foreground text-sm flex-1">Nemokama versija</h3>
            <span class="chip-muted">0 €</span>
          </div>
          <ul class="space-y-1.5 text-sm mb-4">
            ${[
              { ok: true, t: 'Bazinė apsauga nuo virusų ir kenkėjiškų programų' },
              { ok: true, t: 'Pakankama lengvam naršymui vienu įrenginiu' },
              { ok: true, t: 'Jokių finansinių įsipareigojimų' },
              { ok: false, t: 'Nėra VPN, slaptažodžių tvarkyklės, tėvų kontrolės' },
              { ok: false, t: 'Tik vienas įrenginys, jokio centralizuoto valdymo' },
              { ok: false, t: 'Ribota techninė pagalba' },
            ].map(item => `<li class="flex items-start gap-2">${item.ok ? SVG.checkCircle : SVG.xCircle}<span class="text-[12px] text-muted-foreground leading-snug">${item.t}</span></li>`).join('')}
          </ul>
          <p class="text-[11px] text-muted-foreground border-t border-border/30 pt-2.5">Tinka: studentams, vienam įrenginiui.</p>
        </div>
        <div class="card-premium-featured p-5">
          <div class="flex items-center gap-2.5 mb-3">
            <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">${SVG.shield}</div>
            <h3 class="font-heading font-bold text-foreground text-sm flex-1">Mokama versija</h3>
            <span class="chip-primary">20–60 €/m.</span>
          </div>
          <ul class="space-y-1.5 text-sm mb-4">
            ${[
              { ok: true, t: 'Pažangus grėsmių aptikimas ir proaktyvi prevencija' },
              { ok: true, t: 'VPN, slaptažodžių tvarkyklė, tamsaus interneto stebėjimas' },
              { ok: true, t: 'Kelių įrenginių apsauga viena licencija (3–15 įr.)' },
              { ok: true, t: 'Tėvų kontrolė ir šeimos funkcijos' },
              { ok: true, t: 'Prioritetinė 24/7 techninė pagalba' },
              { ok: false, t: 'Reikalauja metinio mokėjimo' },
            ].map(item => `<li class="flex items-start gap-2">${item.ok ? SVG.checkCircle : SVG.xCircle}<span class="text-[12px] text-muted-foreground leading-snug">${item.t}</span></li>`).join('')}
          </ul>
          <p class="text-[11px] text-muted-foreground border-t border-border/30 pt-2.5">Tinka: šeimoms, nuotoliniam darbui, keliems įrenginiams.</p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        ${[
          { path: '/antivirusines-programos/nemokamos', label: 'Nemokamos antivirusinės' },
          { path: '/antivirusines-programos/telefonui', label: 'Antivirusinė telefonui' },
          { path: '/antivirusines-programos/kompiuteriui', label: 'Antivirusinė kompiuteriui' },
        ].map(link => `<a href="${link.path}" class="text-xs font-heading font-semibold px-3.5 py-2 rounded-lg bg-card text-primary hover:bg-primary/5 border border-border/50 transition-all duration-200 inline-flex items-center gap-1.5 elevation-1">${escapeHtml(link.label)} ${SVG.chevronRight}</a>`).join('')}
      </div>
    </section>

    <div class="section-divider mb-12"></div>

    <!-- ═══ 6. HOW TO CHOOSE ═══ -->
    <section id="kaip-pasirinkti" class="mb-16 scroll-mt-20">
      <div class="mb-5">
        <h2 class="font-heading text-2xl font-bold text-foreground leading-tight">Kaip pasirinkti tinkamą antivirusinę</h2>
        <p class="text-muted-foreground text-sm mt-1.5 max-w-xl leading-relaxed">Atsakykite į šiuos klausimus — ir bus aišku, kuri programa jums tinka geriausiai.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        ${buyerGuide.map(item => `
        <div class="card-premium p-4 h-full flex flex-col">
          <div class="flex items-start gap-2.5 mb-2">
            <div class="w-8 h-8 rounded-lg bg-primary/8 border border-primary/10 flex items-center justify-center shrink-0">${item.svg}</div>
            <h3 class="font-heading font-bold text-foreground text-sm leading-snug pt-1.5">${escapeHtml(item.q)}</h3>
          </div>
          <p class="text-[12px] text-muted-foreground leading-relaxed flex-1">${escapeHtml(item.a)}</p>
        </div>`).join('')}
      </div>
      <div class="mt-4 card-premium p-4 max-w-2xl bg-muted/40">
        <p class="text-[13px] text-muted-foreground leading-relaxed">
          <strong class="text-foreground font-heading">Bendra taisyklė:</strong> jei apsaugote tik vieną Windows kompiuterį ir naršote atsargiai — Windows Defender arba nemokama antivirusinė gali pakakti. Jei turite 2+ įrenginius, telefoną ar šeimą — investuokite į mokamą programą. Kaina dažnai siekia vos 3–5&nbsp;€ per mėnesį.
        </p>
      </div>
    </section>

    <div class="section-divider mb-12"></div>

    <!-- ═══ 7. METHODOLOGY ═══ -->
    <section class="mb-16">
      <div class="card-premium p-5 md:p-6 bg-muted/40">
        <div class="flex items-start gap-3.5 mb-5">
          <div class="w-10 h-10 rounded-xl bg-primary/10 border border-primary/12 flex items-center justify-center shrink-0">${SVG.badgeCheck}</div>
          <div>
            <h2 class="font-heading text-lg font-bold text-foreground">Kaip vertiname antivirusines programas</h2>
            <p class="text-xs text-muted-foreground mt-0.5">Kiekviena programa vertinama pagal ${featureColsDef.length + 2} kriterijus.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          ${methodology.map(item => `
          <div class="rounded-lg bg-card border border-border/40 p-3.5 flex gap-2.5 elevation-1">
            <div class="w-7 h-7 rounded-md bg-primary/8 flex items-center justify-center shrink-0">${item.svg}</div>
            <div>
              <h3 class="font-heading font-semibold text-foreground text-xs mb-0.5">${escapeHtml(item.title)}</h3>
              <p class="text-[11px] text-muted-foreground leading-relaxed">${escapeHtml(item.desc)}</p>
            </div>
          </div>`).join('')}
        </div>
        <p class="text-[10px] text-muted-foreground/50 mt-4 pt-3 border-t border-border/30">Redakcija yra nepriklausoma. Affiliate partnerystės neturi įtakos vertinimams ar rekomendacijų eiliškumui.</p>
      </div>
    </section>

    <!-- ═══ 8. FAQ ═══ -->
    <section id="duk" class="mb-16 scroll-mt-20">
      <FAQ items={${JSON.stringify(faqItems)}} title="Dažnai užduodami klausimai" />
    </section>

    <!-- ═══ 9. RELATED GUIDES ═══ -->
    <section class="mb-16">
      <div class="mb-4">
        <h2 class="font-heading text-2xl font-bold text-foreground leading-tight">Kiti naudingi gidai</h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        ${relatedGuides.map(guide => `
        <a href="${guide.path}" class="card-premium flex items-start gap-2.5 p-3.5 transition-all duration-200 group hover-lift">
          <div class="w-7 h-7 rounded-md bg-primary/8 flex items-center justify-center shrink-0">${SVG.arrowRight}</div>
          <div>
            <span class="text-sm text-foreground font-semibold block group-hover:text-primary transition-colors leading-tight">${escapeHtml(guide.label)}</span>
            <span class="text-[11px] text-muted-foreground">${escapeHtml(guide.desc)}</span>
          </div>
        </a>`).join('')}
      </div>
    </section>

    <!-- TRUST DISCLOSURE -->
    <TrustDisclosure />
  </div>
</Base>`;
}

const FLAGSHIP_PATHS = new Set([
  '/antivirusines-programos',
  '/antivirusines-programos/nemokamos',
  '/antivirusines-programos/telefonui',
  '/antivirusines-programos/kompiuteriui',
  '/tevu-kontrole',
  '/slaptazodziu-saugumas',
  '/slaptazodziu-saugumas/slaptazodziu-tvarkykles',
  '/slaptazodziu-saugumas/kaip-pakeisti-gmail-slaptazodi',
  '/slaptazodziu-saugumas/kaip-pakeisti-wifi-slaptazodi',
  '/slaptazodziu-saugumas/ka-daryti-pamirsus-slaptazodi',
  '/virusai/kompiuterinis-virusas',
  '/virusai/virusas-telefone',
  '/virusai/kaip-patikrinti-ar-kompiuteryje-yra-virusas',
  '/virusai/reklamos-virusas-telefone',
]);

const CUSTOM_ASTRO_PATHS = new Set(['/', ...FLAGSHIP_PATHS]);

// ─── CSS ───

function generateGlobalCss() {
  // Read from the React project's index.css and adapt for Astro (remove @tailwind directives → use Astro's built-in Tailwind)
  const srcCss = readFileSync(join(ROOT, 'src', 'index.css'), 'utf-8');
  return srcCss;
}

// ─── Tailwind Config ───

function copyTailwindConfig() {
  const srcConfig = readFileSync(join(ROOT, 'tailwind.config.ts'), 'utf-8');
  // Convert from .ts to .mjs for Astro compatibility and update content paths
  const astroConfig = srcConfig
    .replace(/import type.*\n/g, '')
    .replace(/export default \{/, 'export default {')
    .replace(/satisfies Config/, '')
    .replace(/"\.\/src\/\*\*\/\*\.\{ts,tsx\}"/g, '"./src/**/*.{astro,html,js,ts}"')
    .replace(/"\.\/index\.html"/g, '')
    .replace(/content: \[([^\]]*)\]/s, 'content: ["./src/**/*.{astro,html,js,ts}"]');
  return astroConfig;
}

// ─── Main ───

async function main() {
  console.log('🚀 Starting Astro conversion...\n');

  // 1. Copy base skeleton
  console.log('📦 Copying Astro base skeleton...');
  cpSync(BASE_DIR, BUILD_DIR, { recursive: true });

  // 2. Copy global CSS
  console.log('🎨 Copying styles...');
  const stylesDir = join(BUILD_DIR, 'src', 'styles');
  ensureDir(stylesDir);
  writeFileSync(join(stylesDir, 'global.css'), generateGlobalCss(), 'utf-8');

  // 3. Copy tailwind config
  const tailwindSrc = readFileSync(join(ROOT, 'tailwind.config.ts'), 'utf-8');
  // Write a simplified version
  writeFileSync(join(BUILD_DIR, 'tailwind.config.mjs'), `
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,ts}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: "hsl(var(--success))",
        danger: "hsl(var(--danger))",
      },
      fontFamily: {
        heading: ["Outfit", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
`, 'utf-8');

  // Copy postcss config
  writeFileSync(join(BUILD_DIR, 'postcss.config.js'), `
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`, 'utf-8');

  // Update package.json with tailwind deps
  const pkg = JSON.parse(readFileSync(join(BUILD_DIR, 'package.json'), 'utf-8'));
  pkg.dependencies = {
    ...pkg.dependencies,
    '@astrojs/tailwind': '^5.1.0',
  };
  pkg.devDependencies = {
    'tailwindcss': '^3.4.17',
    'autoprefixer': '^10.4.21',
    '@tailwindcss/typography': '^0.5.16',
  };
  writeFileSync(join(BUILD_DIR, 'package.json'), JSON.stringify(pkg, null, 2), 'utf-8');

  // Update astro config to include tailwind
  writeFileSync(join(BUILD_DIR, 'astro.config.mjs'), `
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
  build: {
    assets: '_assets',
    inlineStylesheets: 'auto',
  },
});
`, 'utf-8');

  // 4. Fetch data
  const data = await fetchAllData();

  // Build lookup maps
  const categoryMap = {};
  const categoryByPath = {};
  const articleByPath = {};
  const childCategoriesByParent = {};

  for (const cat of data.categories) {
    categoryMap[cat.id] = cat;
    categoryByPath[cat.path] = cat;

    if (cat.parent_id) {
      if (!childCategoriesByParent[cat.parent_id]) {
        childCategoriesByParent[cat.parent_id] = [];
      }
      childCategoriesByParent[cat.parent_id].push(cat);
    }
  }

  for (const article of data.articles) {
    articleByPath[article.path] = article;
  }

  // Articles grouped by category
  const articlesByCategory = {};
  for (const article of data.articles) {
    if (article.category_id) {
      if (!articlesByCategory[article.category_id]) {
        articlesByCategory[article.category_id] = [];
      }
      articlesByCategory[article.category_id].push(article);
    }
  }

  // Articles grouped by author
  const articlesByAuthor = {};
  for (const article of data.articles) {
    if (article.author_id) {
      if (!articlesByAuthor[article.author_id]) {
        articlesByAuthor[article.author_id] = [];
      }
      articlesByAuthor[article.author_id].push(article);
    }
  }

  // 5. Generate pages
  console.log('\n📄 Generating pages...');

  // Homepage
  if (shouldPreserveCustomPage('/')) {
    console.log('  🛡️ Preserving custom Astro homepage');
  } else {
    writePage('index.astro', generateHomePage(data));
  }

  // 404
  writePage('404.astro', generate404Page());

  // Static pages
  for (const page of generateStaticPages()) {
    writePage(page.path, page.content);
  }

  // Category pages
  for (const category of data.categories) {
    const catArticles = articlesByCategory[category.id] || [];
    const relatedCategories = childCategoriesByParent[category.id] || [];
    const overlappingArticle = articleByPath[category.path];
    const segments = category.path.split('/').filter(Boolean);
    const pagePath = segments.join('/') + '.astro';

    if (shouldPreserveCustomPage(category.path)) {
      console.log(`  🛡️ Preserving custom Astro page: ${category.path}`);
      continue;
    }

    if (category.path === '/antivirusines-programos') {
      console.log(`  ⚡ Flagship: ${category.path}`);
      writePage(pagePath, generateAntivirusLandingPage(category, data.products, catArticles));
    } else if (overlappingArticle) {
      console.log(`  📰 Category path uses article template: ${category.path}`);
      writePage(pagePath, generateArticlePage(overlappingArticle, categoryMap));
    } else {
      writePage(pagePath, generateCategoryPage(category, catArticles, relatedCategories, categoryMap));
    }
  }

  // Article pages
  for (const article of data.articles) {
    // Skip if the path overlaps with a category (category route already generated)
    const isCategory = !!categoryByPath[article.path];
    if (isCategory) continue;

    const segments = article.path.split('/').filter(Boolean);
    const pagePath = segments.join('/') + '.astro';
    writePage(pagePath, generateArticlePage(article, categoryMap));
  }

  // Author pages
  for (const author of data.authors) {
    const authorArticles = articlesByAuthor[author.id] || [];
    writePage(`autoriai/${author.slug}.astro`, generateAuthorPage(author, authorArticles));
  }

  console.log('\n✨ Conversion complete!');
  console.log(`   Output: ${BUILD_DIR}`);
  console.log('   Run: cd _astro-build && npm install && npm run build');
}

main().catch(err => {
  console.error('❌ Conversion failed:', err);
  process.exit(1);
});
