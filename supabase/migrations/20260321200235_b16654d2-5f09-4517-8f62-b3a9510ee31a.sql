
INSERT INTO public.categories (name, slug, path, parent_id, description, seo_title, meta_description)
VALUES (
  'Slaptažodžių tvarkyklės',
  'slaptazodziu-tvarkykles',
  '/slaptazodziu-saugumas/slaptazodziu-tvarkykles',
  (SELECT id FROM public.categories WHERE path = '/slaptazodziu-saugumas' LIMIT 1),
  'Geriausios slaptažodžių tvarkyklės 2026 m. — nemokamos ir mokamos. Nepriklausomas palyginimas pagal saugumą, funkcijas ir kainą.',
  'Geriausios slaptažodžių tvarkyklės 2026 — palyginimas ir apžvalgos',
  'Nepriklausomos slaptažodžių tvarkyklių apžvalgos. Palyginimas pagal saugumą, funkcijas, nemokamas versijas ir kainą. Raskite geriausią 2026 m.'
);
