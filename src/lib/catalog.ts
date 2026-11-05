import { supabase } from '@/lib/supabase';

export type ProductCategory = 'Whole Spices' | 'Ground Spices' | 'Seeds' | 'Blends';

export const CATEGORIES: ProductCategory[] = ['Whole Spices', 'Ground Spices', 'Seeds', 'Blends'];

export const LOW_STOCK_THRESHOLD = 10;

export interface ProductVariant {
  id: string;
  packLabel: string;
  packGrams: number;
  retailPrice: number;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  tagline: string;
  description: string;
  origin: string;
  imageUrl: string;
  isFeatured: boolean;
  variants: ProductVariant[];
}

interface VariantRow {
  id: string;
  pack_label: string;
  pack_grams: number;
  retail_price: number | string;
  stock: number;
  sort_order: number;
  is_active: boolean;
}

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  tagline: string;
  description: string;
  origin: string;
  image_url: string;
  is_featured: boolean;
  product_variants: VariantRow[];
}

const CATALOG_SELECT =
  'id, slug, name, category, tagline, description, origin, image_url, is_featured, product_variants(id, pack_label, pack_grams, retail_price, stock, sort_order, is_active)';

function toProduct(row: ProductRow): Product {
  const variants = row.product_variants
    .filter((variant) => variant.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((variant) => ({
      id: variant.id,
      packLabel: variant.pack_label,
      packGrams: variant.pack_grams,
      retailPrice: Number(variant.retail_price),
      stock: variant.stock,
    }));

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    tagline: row.tagline,
    description: row.description,
    origin: row.origin,
    imageUrl: row.image_url,
    isFeatured: row.is_featured,
    variants,
  };
}

export async function fetchCatalog(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(CATALOG_SELECT)
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  if (!Array.isArray(data)) throw new Error('Unexpected catalog response');

  return (data as unknown as ProductRow[])
    .map(toProduct)
    .filter((product) => product.variants.length > 0);
}
