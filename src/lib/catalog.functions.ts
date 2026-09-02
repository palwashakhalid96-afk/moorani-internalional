import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createPublicClient } from "./supabase-public.server";

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  sort_order: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  tagline: string;
  description: string;
  features: string[];
  ingredients: string;
  nutrition: string;
  net_weight: string;
  pack_size: string;
  preparation: string;
  price: number;
  sale_price: number | null;
  in_stock: boolean;
  image_url: string;
  gallery: string[];
  is_featured: boolean;
  sort_order: number;
};

export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createPublicClient();
  const [categories, products, reviews, settings] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("products").select("*").order("sort_order"),
    supabase
      .from("reviews")
      .select("*")
      .eq("is_approved", true)
      .order("sort_order")
      .limit(12),
    supabase.from("site_settings").select("*"),
  ]);

  const settingsMap: Record<string, string> = {};
  for (const row of settings.data ?? []) settingsMap[row.key] = row.value;

  return {
    categories: (categories.data ?? []) as Category[],
    products: (products.data ?? []) as unknown as Product[],
    reviews: reviews.data ?? [],
    settings: settingsMap,
  };
});

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const supabase = createPublicClient();
    const { data: product } = await supabase
      .from("products")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();

    if (!product) return { product: null, related: [] as Product[], category: null };

    const { data: category } = product.category_id
      ? await supabase.from("categories").select("*").eq("id", product.category_id).maybeSingle()
      : { data: null };

    const { data: related } = await supabase
      .from("products")
      .select("*")
      .neq("id", product.id)
      .eq("category_id", product.category_id ?? "")
      .order("sort_order")
      .limit(4);

    return {
      product: product as unknown as Product,
      related: (related ?? []) as unknown as Product[],
      category: (category ?? null) as Category | null,
    };
  });

export const getFaqs = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  return data ?? [];
});
