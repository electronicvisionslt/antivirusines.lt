UPDATE articles 
SET sections = REPLACE(sections::text, '.avif"', '.png"')::jsonb
WHERE path = '/antivirusines-programos/norton-360-apzvalga'
AND sections::text LIKE '%.avif%';