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
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
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

function generateCategoryPage(category, articles) {
  const faq = parseFaq(category.faq);
  const breadcrumbs = [
    { label: 'Pradžia', path: '/' },
    { label: category.name, path: category.path },
  ];

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

    <FAQ items={${JSON.stringify(faq)}} />
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
// These are the complex landing pages with custom layouts.
// They are generated with full static HTML matching the React components.
// The conversion script reads the React source and generates equivalent Astro.
// For now, flagship pages that have DB-driven data get a category fallback page.
// TODO: Add full flagship page templates (antivirus comparison, etc.)

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
  for (const cat of data.categories) {
    categoryMap[cat.id] = cat;
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
  writePage('index.astro', generateHomePage(data));

  // 404
  writePage('404.astro', generate404Page());

  // Static pages
  for (const page of generateStaticPages()) {
    writePage(page.path, page.content);
  }

  // Category pages (non-flagship get generic template)
  for (const category of data.categories) {
    if (FLAGSHIP_PATHS.has(category.path)) {
      // Flagship pages — for now generate the category fallback
      // TODO: Add dedicated flagship templates for each landing page
      console.log(`  ⚡ Flagship: ${category.path} (using category template for now)`);
    }

    const catArticles = articlesByCategory[category.id] || [];
    const segments = category.path.split('/').filter(Boolean);
    const pagePath = segments.join('/') + '.astro';
    writePage(pagePath, generateCategoryPage(category, catArticles));
  }

  // Article pages
  for (const article of data.articles) {
    // Skip if the path overlaps with a category (flagship pages handle this)
    const isCategory = data.categories.some(c => c.path === article.path);
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
