import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/catalog.functions";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const price = Number(product.sale_price ?? product.price);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-lift">
      <Link to="/products/$slug" params={{ slug: product.slug }} className="relative block aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {!product.in_stock && (
          <span className="absolute inset-0 flex items-center justify-center bg-background/70 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-lg leading-snug">
          <Link to="/products/$slug" params={{ slug: product.slug }} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.tagline}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <div>
            <span className="font-display text-sm font-semibold text-primary">Price on request</span>
            {product.net_weight && (
              <span className="block text-xs text-muted-foreground">{product.net_weight}</span>
            )}
          </div>
          <Button
            size="sm"
            disabled={!product.in_stock}
            onClick={() => {
              add({
                id: product.id,
                slug: product.slug,
                name: product.name,
                price,
                image_url: product.image_url,
              });
              toast.success(`${product.name} added to cart`);
            }}
          >
            <ShoppingBag className="h-4 w-4" /> Add
          </Button>
        </div>
      </div>
    </article>
  );
}
