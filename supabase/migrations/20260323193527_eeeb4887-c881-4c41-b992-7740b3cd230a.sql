UPDATE articles 
SET sections = REPLACE(sections::text, '.avif"', '.png"')::jsonb
WHERE id = '1986e8fe-d53f-4d00-85e9-e449543fdaa7';