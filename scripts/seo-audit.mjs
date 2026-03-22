/**
 * seo-audit.mjs
 *
 * Post-build SEO audit for the Astro static output.
 * Checks every generated HTML file for:
 *   1. <link rel="canonical"> exists and has trailing slash
 *   2. <meta property="og:url"> exists and has trailing slash
 *   3. All internal href attributes have trailing slashes
 *   4. hreflang tags present
 *   5. JSON-LD structured data present
 *
 * Usage: node scripts/seo-audit.mjs [dist-dir]
 *   Default dist-dir: _astro-build/dist
 */

import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative } from 'path';

const DIST = process.argv[2] || join(process.cwd(), '_astro-build', 'dist');
const SITE = 'https://antivirusines.lt';

const errors = [];
const warnings = [];
let fileCount = 0;

function collectHtmlFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...collectHtmlFiles(full));
    } else if (entry.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function auditFile(filePath) {
  const rel = relative(DIST, filePath);
  const html = readFileSync(filePath, 'utf-8');
  fileCount++;

  // 1. Canonical
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (!canonicalMatch) {
    errors.push(`${rel}: Missing <link rel="canonical">`);
  } else {
    const href = canonicalMatch[1];
    if (!href.endsWith('/')) {
      errors.push(`${rel}: Canonical missing trailing slash: ${href}`);
    }
    if (!href.startsWith('https://')) {
      errors.push(`${rel}: Canonical not absolute URL: ${href}`);
    }
  }

  // 2. og:url
  const ogUrlMatch = html.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:url["']/i);
  if (!ogUrlMatch) {
    errors.push(`${rel}: Missing <meta property="og:url">`);
  } else {
    const url = ogUrlMatch[1];
    if (!url.endsWith('/')) {
      errors.push(`${rel}: og:url missing trailing slash: ${url}`);
    }
  }

  // 3. Hreflang
  const hreflangLt = html.match(/<link[^>]*hreflang=["']lt["']/i);
  if (!hreflangLt) {
    warnings.push(`${rel}: Missing hreflang="lt"`);
  }

  // 4. JSON-LD
  const jsonLd = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>/i);
  if (!jsonLd) {
    warnings.push(`${rel}: Missing JSON-LD structured data`);
  }

  // 5. Internal links trailing slash
  const internalLinks = [...html.matchAll(/href=["'](\/[^"'#?]*?)["']/g)];
  for (const m of internalLinks) {
    const href = m[1];
    // Skip asset files
    if (/\.\w{2,5}$/.test(href)) continue;
    if (href === '/') continue;
    if (!href.endsWith('/')) {
      warnings.push(`${rel}: Internal link missing trailing slash: ${href}`);
    }
  }
}

// ── Run ──
console.log(`\n🔍 SEO Audit: scanning ${DIST}\n`);

try {
  const files = collectHtmlFiles(DIST);
  for (const f of files) auditFile(f);
} catch (err) {
  console.error(`❌ Cannot read dist directory: ${DIST}`);
  console.error(`   Run the Astro build first, or pass the correct path.`);
  process.exit(1);
}

// ── Report ──
console.log(`📄 Scanned ${fileCount} HTML files\n`);

if (errors.length > 0) {
  console.error(`❌ ${errors.length} ERROR(S):`);
  for (const e of errors) console.error(`   ${e}`);
  console.log();
}

if (warnings.length > 0) {
  console.warn(`⚠️  ${warnings.length} WARNING(S):`);
  for (const w of warnings) console.warn(`   ${w}`);
  console.log();
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All SEO checks passed!\n');
}

if (errors.length > 0) {
  process.exit(1);
}