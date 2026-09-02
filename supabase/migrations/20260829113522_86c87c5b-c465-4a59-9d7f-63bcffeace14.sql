-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'staff');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read their own roles" ON public.user_roles
FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- CATEGORIES
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER categories_updated BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PRODUCTS
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  ingredients text NOT NULL DEFAULT '',
  nutrition text NOT NULL DEFAULT '',
  net_weight text NOT NULL DEFAULT '',
  pack_size text NOT NULL DEFAULT '',
  preparation text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  sale_price numeric(10,2),
  in_stock boolean NOT NULL DEFAULT true,
  image_url text NOT NULL DEFAULT '',
  gallery text[] NOT NULL DEFAULT '{}',
  is_featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are publicly readable" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX products_category_idx ON public.products(category_id);

-- ORDERS
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  phone text NOT NULL,
  whatsapp text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  address text NOT NULL,
  city text NOT NULL,
  notes text NOT NULL DEFAULT '',
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  delivery_fee numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'cod',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage orders" ON public.orders FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  unit_price numeric(10,2) NOT NULL DEFAULT 0,
  quantity int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage order items" ON public.order_items FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX order_items_order_idx ON public.order_items(order_id);

-- INQUIRIES
CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  name text NOT NULL,
  city text NOT NULL DEFAULT '',
  area text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  business_name text NOT NULL DEFAULT '',
  business_type text NOT NULL DEFAULT '',
  experience text NOT NULL DEFAULT '',
  quantity text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.inquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inquiries TO authenticated;
GRANT ALL ON public.inquiries TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an inquiry" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage inquiries" ON public.inquiries FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- REVIEWS
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  city text NOT NULL DEFAULT '',
  rating int NOT NULL DEFAULT 5,
  body text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  is_approved boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved reviews are public" ON public.reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Admins manage reviews" ON public.reviews FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- FAQS
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name text NOT NULL DEFAULT 'General',
  question text NOT NULL,
  answer text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active FAQs are public" ON public.faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage faqs" ON public.faqs FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- SETTINGS
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings are public" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_settings (key, value) VALUES
  ('delivery_fee', '250'),
  ('free_delivery_over', '5000'),
  ('whatsapp_number', '923020162224'),
  ('contact_email', 'info@moraniinternational.com'),
  ('contact_address', 'Plot A-17, SITE Industrial Area, Karachi, Pakistan');

-- CATEGORIES SEED
INSERT INTO public.categories (slug, name, description, sort_order) VALUES
  ('pre-cooked-food-products', 'Pre-cooked Food Products', 'Ready-in-minutes nutritious food solutions including our Instant Talbeena range.', 1),
  ('dehydrated-fruits-vegetables', 'Dehydrated Fruits & Vegetables', 'Carefully dehydrated fruits and vegetables that keep flavour, colour and shelf life.', 2),
  ('superfood-extracts', 'Superfood Extracts', 'Concentrated superfood based products.', 3),
  ('herbs-botanicals', 'Herbs & Botanicals', 'Herbs and botanical products from natural sources.', 4),
  ('plant-based-products', 'Plant-Based Products', 'Our growing plant-based product range.', 5);

-- PRODUCTS SEED
INSERT INTO public.products (slug, name, category_id, tagline, description, features, ingredients, nutrition, net_weight, pack_size, preparation, price, in_stock, image_url, is_featured, sort_order)
VALUES
('instant-talbeena-original',
 'Instant Talbeena – Original',
 (SELECT id FROM public.categories WHERE slug = 'pre-cooked-food-products'),
 'A Sunnah superfood for health & nourishment',
 'Morani International Instant Talbeena Original is made with barley and is ready in minutes. A wholesome, comforting meal for the whole family, with no preservatives, no artificial flavours and no added colours.',
 ARRAY['High fibre','No cholesterol','No added sugar','Instant mix, nutritious meal in minutes','Perfect diet for all ages'],
 'Barley, milk solids, natural flavour. Full ingredient declaration as printed on pack.',
 'Nutrition information as printed on the pack.',
 '200gm jar / 50gm sachet / 500gm pack',
 '5 sachet pack, 200gm jar, 50gm sachet',
 'Add one sachet to hot milk or water, stir well for 1-2 minutes and serve. Add honey or dates to taste.',
 950, true, '/__l5e/assets-v1/b608f370-df76-45e5-a127-10863769a089/talbeena-original.jpeg', true, 1),

('instant-talbeena-nuts',
 'Instant Talbeena – Nuts',
 (SELECT id FROM public.categories WHERE slug = 'pre-cooked-food-products'),
 'Barley goodness with a generous nut blend',
 'Instant Talbeena Nuts combines barley with a rich blend of nuts for a naturally energising bowl. Ready in minutes, ideal for breakfast or an evening meal.',
 ARRAY['High fibre','Natural energy','Easy to digest','No preservatives','No artificial flavours'],
 'Barley, mixed nuts, milk solids. Full ingredient declaration as printed on pack.',
 'Nutrition information as printed on the pack.',
 '500gm (100gm x 5 sachets) / 200gm jar / 50gm sachet',
 '500gm box, 200gm jar, 50gm sachet',
 'Mix with hot milk or water, stir for 1-2 minutes and serve warm.',
 1150, true, '/__l5e/assets-v1/5e80a890-8aaf-423d-87cc-09b66033d7ef/talbeena-nuts.jpeg', true, 2),

('instant-talbeena-chocolate',
 'Instant Talbeena – Chocolate',
 (SELECT id FROM public.categories WHERE slug = 'pre-cooked-food-products'),
 'The Sunnah superfood kids ask for again',
 'Instant Talbeena Chocolate brings the nourishment of barley together with a rich chocolate taste. A family favourite that is ready in minutes.',
 ARRAY['High fibre','Natural energy','Easy to digest','No added colours'],
 'Barley, cocoa, milk solids. Full ingredient declaration as printed on pack.',
 'Nutrition information as printed on the pack.',
 '500gm (100gm x 5 sachets) / 200gm jar / 50gm sachet',
 '500gm box, 200gm jar, 50gm sachet',
 'Mix with hot milk or water, stir for 1-2 minutes and serve warm.',
 1150, true, '/__l5e/assets-v1/c8efa2cf-8433-4492-8ce9-4d2b0d146334/talbeena-chocolate.jpeg', true, 3),

('instant-talbeena-strawberry',
 'Instant Talbeena – Strawberry',
 (SELECT id FROM public.categories WHERE slug = 'pre-cooked-food-products'),
 'Barley nourishment with a fresh strawberry taste',
 'Instant Talbeena Strawberry is a light, fruity way to enjoy the Sunnah superfood. Ready in minutes with no preservatives or added colours.',
 ARRAY['High fibre','Natural energy','Easy to digest','No preservatives'],
 'Barley, strawberry flavour, milk solids. Full ingredient declaration as printed on pack.',
 'Nutrition information as printed on the pack.',
 '500gm (100gm x 5 sachets) / 200gm jar / 50gm sachet',
 '500gm box, 200gm jar, 50gm sachet',
 'Mix with hot milk or water, stir for 1-2 minutes and serve.',
 1150, true, '/__l5e/assets-v1/01af5687-33a8-4ad6-b616-eb659cb5fd4f/talbeena-strawberry.jpeg', true, 4),

('instant-talbeena-fruit-nuts',
 'Instant Talbeena – Fruit & Nuts',
 (SELECT id FROM public.categories WHERE slug = 'pre-cooked-food-products'),
 'Barley, dried fruit and nuts in one bowl',
 'Instant Talbeena Fruit & Nuts blends barley with dried fruit and nuts for a filling, naturally sweet meal that is ready in minutes.',
 ARRAY['High fibre','Natural energy','Easy to digest','No added colours'],
 'Barley, dried fruits, mixed nuts, milk solids. Full ingredient declaration as printed on pack.',
 'Nutrition information as printed on the pack.',
 '500gm (100gm x 5 sachets) / 200gm jar / 50gm sachet',
 '500gm box, 200gm jar, 50gm sachet',
 'Mix with hot milk or water, stir for 1-2 minutes and serve warm.',
 1250, true, '/__l5e/assets-v1/831b2876-cbc3-400e-816f-1a5af5126a57/talbeena-fruit-nuts.jpeg', true, 5),

('kids-instant-talbeena',
 'Kids Instant Talbeena',
 (SELECT id FROM public.categories WHERE slug = 'pre-cooked-food-products'),
 'A Sunnah superfood for growing kids',
 'Kids Instant Talbeena is made for growing children: barley based, easy to digest and quick to prepare, with no preservatives, artificial flavours or added colours.',
 ARRAY['High fibre','Natural energy','Easy to digest','Made for growing kids'],
 'Barley, milk solids, natural flavour. Full ingredient declaration as printed on pack.',
 'Nutrition information as printed on the pack.',
 '500gm (50g x 10 sachets) / 200g jar / 50g sachet',
 '10 sachet box, 200g jar, 50g sachet',
 'Add one sachet to warm milk, stir for 1-2 minutes and serve.',
 1200, true, '/__l5e/assets-v1/0e037430-ab5b-4fb8-a119-993872470ed6/talbeena-kids.jpeg', true, 6),

('dehydrated-red-onion',
 'Dehydrated Red Onion',
 (SELECT id FROM public.categories WHERE slug = 'dehydrated-fruits-vegetables'),
 'Real red onion, dried and ready to cook',
 'Morani International Dehydrated Red Onion is prepared hygienically from quality red onions. Long shelf life, no chopping, no waste — simply add to your cooking.',
 ARRAY['Hygienically processed','Long shelf life','No chopping or peeling','Available in multiple pack sizes'],
 '100% dehydrated red onion.',
 'Nutrition information as printed on the pack.',
 '100g / 250g / 500g',
 '100g, 250g, 500g packs',
 'Add directly to curries, soups and stocks, or soak in warm water for 10 minutes before use.',
 550, true, '/__l5e/assets-v1/d72b8c6b-ba9c-4f38-9e40-62d81127df6b/dehydrated-red-onion.jpg', false, 7),

('dehydrated-red-onion-flakes',
 'Dehydrated Red Onion Flakes',
 (SELECT id FROM public.categories WHERE slug = 'dehydrated-fruits-vegetables'),
 'Convenient red onion flakes for everyday cooking',
 'Dehydrated Red Onion Flakes give you consistent onion flavour in seconds. Ideal for home kitchens, restaurants and food manufacturers.',
 ARRAY['Consistent flake size','Hygienically processed','Long shelf life','Bulk quantities available'],
 '100% dehydrated red onion flakes.',
 'Nutrition information as printed on the pack.',
 '100g / 250g / 500g',
 '100g, 250g, 500g packs',
 'Sprinkle directly into your dish or rehydrate in warm water for 10 minutes.',
 550, true, '/__l5e/assets-v1/6094dabe-5750-40ce-abf4-84d8957f3f3c/red-onion-flakes.jpg', false, 8);

-- FAQ SEED
INSERT INTO public.faqs (group_name, question, answer, sort_order) VALUES
('General','Morani International kya hai?','Morani International ek Pakistani health, food and nature company hai jo premium quality natural food products taiyar karti hai, jaise Instant Talbeena aur dehydrated fruits & vegetables.',1),
('General','Aapke products kya hain?','Filhal hamari range mein Instant Talbeena (Original, Nuts, Chocolate, Strawberry, Fruit & Nuts aur Kids) aur Dehydrated Red Onion / Red Onion Flakes shamil hain. Nayi products regularly add ki jaati hain.',2),
('General','Products kahan available hain?','Aap products is website se online order kar sakte hain, ya WhatsApp par humein message kar ke order place kar sakte hain.',3),
('Products','Talbeena kya hai?','Talbeena barley (jau) se banaya jaane wala ek Sunnah superfood hai. Morani International ka Instant Talbeena minutes mein tayyar ho jata hai.',4),
('Products','Talbeena kaise prepare hoti hai?','Ek sachet garam doodh ya paani mein daalein, 1-2 minute achhi tarah mix karein aur serve karein. Zaiqe ke liye honey ya dates add ki ja sakti hain.',5),
('Products','Pack size kya hai?','Talbeena 50gm sachet, 200gm jar aur 5 ya 10 sachet ke boxes mein available hai. Dehydrated Red Onion 100g, 250g aur 500g mein available hai.',6),
('Orders','Online order kaise place karein?','Product page par Add to Cart ya Buy Now dabaein, cart se checkout karein aur apni delivery details bharein. Aap WhatsApp par bhi order kar sakte hain.',7),
('Orders','COD available hai?','Ji haan, poore Pakistan mein Cash on Delivery available hai.',8),
('Orders','Delivery charges kya hain?','Standard delivery charges checkout par show hote hain aur admin panel se update kiye ja sakte hain.',9),
('Orders','Delivery kitne time mein hoti hai?','Order confirm hone ke baad aam tor par 2-5 working days lagte hain, city ke hisaab se.',10),
('Business','Reseller kaise ban sakte hain?','Reseller page par form fill karein ya WhatsApp par humein message karein. Hamari team aap se rabta karegi.',11),
('Business','Wholesale kaise milega?','Wholesale page par inquiry submit karein, hum aap ko wholesale rates aur MOQ share karenge.',12),
('Business','Distributor kaise ban sakte hain?','Distributor page par apni city aur area ke saath inquiry bhejein. Availability check kar ke team aap se rabta karegi.',13),
('Business','MOQ kya hai?','MOQ product aur pack size par depend karta hai. Exact MOQ ke liye wholesale inquiry submit karein.',14);