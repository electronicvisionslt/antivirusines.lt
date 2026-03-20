
-- Add product_category and is_active to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS product_category text NOT NULL DEFAULT 'antivirus';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

-- Add sort_order to article_products for CTA priority
ALTER TABLE public.article_products ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

-- Update existing products to have correct category
UPDATE public.products SET product_category = 'antivirus' WHERE product_category = 'antivirus';
