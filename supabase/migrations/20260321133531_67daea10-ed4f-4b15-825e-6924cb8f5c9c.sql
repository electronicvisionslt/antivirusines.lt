-- Avast Free Antivirus - reuse existing Avast logo
UPDATE products SET logo_url = 'https://dkwffdnrailtqvrxiulw.supabase.co/storage/v1/object/public/media/logos/avast-logo.png'
WHERE slug = 'avast-free-antivirus';

-- Bitdefender Free - reuse existing Bitdefender logo
UPDATE products SET logo_url = 'https://dkwffdnrailtqvrxiulw.supabase.co/storage/v1/object/public/media/logos/bitdefender-logo.png'
WHERE slug = 'bitdefender-free';

-- AVG AntiVirus Free
UPDATE products SET logo_url = 'https://dkwffdnrailtqvrxiulw.supabase.co/storage/v1/object/public/media/logos/avg-logo.png'
WHERE slug = 'avg-antivirus-free';

-- Avira Free Security
UPDATE products SET logo_url = 'https://dkwffdnrailtqvrxiulw.supabase.co/storage/v1/object/public/media/logos/avira-logo.png'
WHERE slug = 'avira-free-security';

-- Microsoft Defender
UPDATE products SET logo_url = 'https://dkwffdnrailtqvrxiulw.supabase.co/storage/v1/object/public/media/logos/microsoft-defender-logo.png'
WHERE slug = 'microsoft-defender';