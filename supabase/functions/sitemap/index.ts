import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE = "https://antivirusines.lt";

const corsHeaders = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=3600",
  "Access-Control-Allow-Origin": "*",
};

// Static pages that always exist
const staticPaths = [
  "/",
  "/apie",
  "/kontaktai",
  "/affiliate-atskleidimas",
  "/privatumo-politika",
  "/slapuku-politika",
];

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const sb = createClient(supabaseUrl, supabaseKey);

  // Fetch categories
  const { data: categories } = await sb
    .from("categories")
    .select("path, updated_at")
    .order("path");

  // Fetch published articles
  const { data: articles } = await sb
    .from("articles")
    .select("path, updated_at")
    .eq("status", "published")
    .order("path");

  // Fetch authors
  const { data: authors } = await sb
    .from("authors")
    .select("slug, updated_at")
    .order("slug");

  const urls: { loc: string; lastmod?: string; priority: string; changefreq: string }[] = [];

  // Static pages
  for (const p of staticPaths) {
    urls.push({
      loc: `${SITE}${p}`,
      priority: p === "/" ? "1.0" : "0.3",
      changefreq: p === "/" ? "daily" : "monthly",
    });
  }

  // Categories
  for (const cat of categories || []) {
    urls.push({
      loc: `${SITE}${cat.path}`,
      lastmod: cat.updated_at?.split("T")[0],
      priority: cat.path.split("/").filter(Boolean).length === 1 ? "0.9" : "0.8",
      changefreq: "weekly",
    });
  }

  // Articles
  for (const art of articles || []) {
    urls.push({
      loc: `${SITE}${art.path}`,
      lastmod: art.updated_at?.split("T")[0],
      priority: "0.7",
      changefreq: "weekly",
    });
  }

  // Authors
  for (const author of authors || []) {
    urls.push({
      loc: `${SITE}/autoriai/${author.slug}`,
      lastmod: author.updated_at?.split("T")[0],
      priority: "0.4",
      changefreq: "monthly",
    });
  }

  // Deduplicate by loc (categories and articles may overlap for flagship pages)
  const seen = new Set<string>();
  const unique = urls.filter((u) => {
    if (seen.has(u.loc)) return false;
    seen.add(u.loc);
    return true;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, { headers: corsHeaders });
});
