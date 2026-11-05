/*
# Create spice catalog and contact message tables

1. New Tables
- `products`: one row per spice or blend (name, slug, category, description, origin, image, featured and active flags).
- `product_variants`: pack sizes for each product, with retail price, wholesale price, wholesale minimum order quantity (MOQ) and stock count.
- `contact_messages`: messages sent through the public contact form.

2. Security
- RLS enabled on all three tables.
- Visitors (anon and signed-in) can read active products and their pack sizes.
- Wholesale prices and MOQ are NOT readable by the public: column-level privileges expose only retail data on `product_variants`.
- Visitors can submit contact messages but cannot read them.
- No write access to products or variants is granted yet; admin write access will be added with admin sign-in.

3. Important Notes
- Foreign keys cascade so deleting a product removes its pack sizes.
- Unique pack label per product prevents duplicate pack sizes.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('Whole Spices', 'Ground Spices', 'Seeds', 'Blends')),
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  origin text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);

CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  pack_label text NOT NULL,
  pack_grams integer NOT NULL CHECK (pack_grams > 0),
  retail_price numeric(10,2) NOT NULL CHECK (retail_price >= 0),
  wholesale_price numeric(10,2) NOT NULL CHECK (wholesale_price >= 0),
  wholesale_moq integer NOT NULL DEFAULT 10 CHECK (wholesale_moq > 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  UNIQUE (product_id, pack_label)
);

CREATE INDEX IF NOT EXISTS product_variants_product_idx ON product_variants (product_id);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  phone text NOT NULL DEFAULT '' CHECK (char_length(phone) <= 40),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON products TO anon, authenticated;
GRANT SELECT (id, product_id, pack_label, pack_grams, retail_price, stock, sort_order, is_active)
  ON product_variants TO anon, authenticated;
GRANT INSERT ON contact_messages TO anon, authenticated;

DROP POLICY IF EXISTS "public_select_active_products" ON products;
CREATE POLICY "public_select_active_products" ON products FOR SELECT
  TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "public_select_active_variants" ON product_variants;
CREATE POLICY "public_select_active_variants" ON product_variants FOR SELECT
  TO anon, authenticated USING (
    is_active = true AND EXISTS (
      SELECT 1 FROM products p WHERE p.id = product_variants.product_id AND p.is_active = true
    )
  );

DROP POLICY IF EXISTS "public_insert_contact_message" ON contact_messages;
CREATE POLICY "public_insert_contact_message" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);
