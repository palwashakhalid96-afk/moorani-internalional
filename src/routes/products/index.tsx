import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { z } from "zod";
import { getCatalog } from "@/lib/catalog.functions";
import { ProductCard } from "@/components/site/ProductCard";
import { PageHero } from "@/components/site/PageHero";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const searchSchema = z.object({ category: z.string().optional() });

export const Route = createFileRoute("/products/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Products | Talbeena & Dehydrated Onion — Morani International" },
      {
        name: "description",
        content:
          "Browse Morani International's full range: Instant Talbeena blends and dehydrated red onion products. Order online with Cash on Delivery in Pakistan.",
      },
      { property: "og:title", content: "Morani International Products" },
      {
        property: "og:description",
        content: "Premium Talbeena blends and dehydrated red onion products, delivered across Pakistan.",
      },
    ],
  }),
  loader: () => getCatalog(),
  component: ProductsPage,
});

function ProductsPage() {
  const { products, categories } = Route.useLoaderData();
  const { category } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState("");

  const activeCategory = categories.find((c) => c.slug === category);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const inCategory = !activeCategory || p.category_id === activeCategory.id;
      const matches =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return inCategory && matches;
    });
  }, [products, activeCategory, query]);

  return (
    <>
      <PageHero
        eyebrow="Our Range"
        title={activeCategory ? activeCategory.name : "All Products"}
        description={
          activeCategory?.description ||
          "Natural, nourishing products made in Karachi — from Sunnah-inspired Talbeena blends to dehydrated vegetables for kitchens and food businesses."
        }
      />

      <div className="container-page py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeCategory ? "outline" : "default"}
              size="sm"
              onClick={() => navigate({ search: {} })}
            >
              All
            </Button>
            {categories.map((c) => (
              <Button
                key={c.id}
                size="sm"
                variant={activeCategory?.id === c.id ? "default" : "outline"}
                onClick={() => navigate({ search: { category: c.slug } })}
              >
                {c.name}
              </Button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="pl-9"
              aria-label="Search products"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            No products match your search. Try a different keyword or category.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
