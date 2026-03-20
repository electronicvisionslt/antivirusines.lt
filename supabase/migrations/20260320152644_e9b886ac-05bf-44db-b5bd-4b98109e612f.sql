
-- ENUMS
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');
CREATE TYPE public.article_status AS ENUM ('draft', 'published', 'archived');

-- TIMESTAMP TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- USER ROLES TABLE
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can view roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- AUTHORS TABLE
CREATE TABLE public.authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  bio TEXT DEFAULT '',
  avatar_url TEXT,
  expertise TEXT[] DEFAULT '{}',
  initials TEXT DEFAULT '',
  seo_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authors are publicly readable" ON public.authors FOR SELECT USING (true);
CREATE POLICY "Admins can insert authors" ON public.authors FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update authors" ON public.authors FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete authors" ON public.authors FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON public.authors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CATEGORIES TABLE
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  path TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  parent_id UUID REFERENCES public.categories(id),
  faq JSONB DEFAULT '[]',
  seo_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ARTICLES TABLE
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  path TEXT NOT NULL UNIQUE,
  excerpt TEXT DEFAULT '',
  body TEXT DEFAULT '',
  featured_image TEXT,
  featured_image_alt TEXT,
  article_type TEXT DEFAULT 'guide',
  category_id UUID REFERENCES public.categories(id),
  author_id UUID REFERENCES public.authors(id),
  status article_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  last_reviewed_at TIMESTAMPTZ,
  read_time TEXT DEFAULT '',
  sections JSONB DEFAULT '[]',
  faq JSONB DEFAULT '[]',
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  verdict TEXT,
  show_toc BOOLEAN DEFAULT true,
  related_article_ids UUID[] DEFAULT '{}',
  seo_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  noindex BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published articles are publicly readable" ON public.articles FOR SELECT USING (status = 'published' OR (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin')));
CREATE POLICY "Admins can insert articles" ON public.articles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update articles" ON public.articles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete articles" ON public.articles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_articles_status ON public.articles(status);
CREATE INDEX idx_articles_category ON public.articles(category_id);
CREATE INDEX idx_articles_author ON public.articles(author_id);

-- ARTICLE SECONDARY CATEGORIES
CREATE TABLE public.article_categories (
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, category_id)
);
ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Article categories are publicly readable" ON public.article_categories FOR SELECT USING (true);
CREATE POLICY "Admins can insert article categories" ON public.article_categories FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete article categories" ON public.article_categories FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- PRODUCTS TABLE
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  brand TEXT DEFAULT '',
  short_description TEXT DEFAULT '',
  long_description TEXT DEFAULT '',
  logo_url TEXT,
  hero_image_url TEXT,
  pricing_summary TEXT DEFAULT '',
  supported_platforms TEXT[] DEFAULT '{}',
  free_version BOOLEAN DEFAULT false,
  trial_available BOOLEAN DEFAULT false,
  best_for TEXT DEFAULT '',
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  verdict TEXT,
  rating NUMERIC(2,1) DEFAULT 0,
  affiliate_url TEXT,
  affiliate_disclosure TEXT,
  features JSONB DEFAULT '{}',
  seo_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are publicly readable" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ARTICLE-PRODUCT RELATION
CREATE TABLE public.article_products (
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, product_id)
);
ALTER TABLE public.article_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Article products are publicly readable" ON public.article_products FOR SELECT USING (true);
CREATE POLICY "Admins can insert article products" ON public.article_products FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete article products" ON public.article_products FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- MEDIA TABLE
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  alt_text TEXT DEFAULT '',
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Media is publicly readable" ON public.media FOR SELECT USING (true);
CREATE POLICY "Admins can insert media" ON public.media FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update media" ON public.media FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete media" ON public.media FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);
CREATE POLICY "Media files are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admins can upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update media files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete media files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
