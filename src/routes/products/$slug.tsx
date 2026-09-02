import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, ShoppingBag, Truck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { getProduct } from "@/lib/catalog.functions";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { useCart } from "@/lib/cart";
import { whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params }) => {
    const result = await getProduct({ data: { slug: params.slug } });
    if (!result.product) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return {};
    const title = `${p.name} | Morani International`;
    const description = p.tagline || p.description.slice(0, 150);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product, related, category } = Route.useLoaderData();
  const { add } = useCart();
  if (!product) return null;

  const price = Number(product.sale_price ?? product.price);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image_url,
    brand: { "@type": "Brand", name: "Morani International" },
    offers: {
      "@type": "Offer",
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container-page py-10">
        <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="px-2">/</span>
          <Link to="/products" className="hover:text-primary">Products</Link>
          {category && (
            <>
              <span className="px-2">/</span>
              <Link to="/products" search={{ category: category.slug }} className="hover:text-primary">
                {category.name}
              </Link>
            </>
          )}
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
            <img
              src={product.image_url}
              alt={product.name}
              className="aspect-square w-full object-cover"
              width={720}
              height={720}
            />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl">{product.name}</h1>
            <p className="mt-3 text-lg text-muted-foreground">{product.tagline}</p>

            <div className="mt-6">
              <span className="font-display text-2xl font-semibold text-primary">
                Price on request
              </span>
              <p className="text-sm text-muted-foreground">
                Our team will share the price when you place your order.
              </p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {[product.net_weight, product.pack_size].filter(Boolean).join(" • ")}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                size="xl"
                disabled={!product.in_stock}
                onClick={() => {
                  add({
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    price,
                    image_url: product.image_url,
                  });
                  toast.success("Added to cart");
                }}
              >
                <ShoppingBag className="h-5 w-5" />
                {product.in_stock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button asChild size="xl" variant="whatsapp">
                <a href={whatsappLink(`Assalamu Alaikum, I'd like to order: ${product.name}`)}>
                  Order on WhatsApp
                </a>
              </Button>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-gold" /> Cash on Delivery across Pakistan
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gold" /> Hygienically produced & sealed
              </p>
            </div>

            {product.features?.length > 0 && (
              <ul className="mt-8 grid gap-2.5">
                {product.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <h2 className="text-2xl">Description</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
              {product.description}
            </p>
            {product.preparation && (
              <>
                <h2 className="mt-8 text-2xl">How to Prepare</h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
                  {product.preparation}
                </p>
              </>
            )}
          </section>

          <aside className="space-y-6">
            {product.ingredients && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <h3 className="font-display text-lg">Ingredients</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {product.ingredients}
                </p>
              </div>
            )}
            {product.nutrition && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <h3 className="font-display text-lg">Nutrition</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {product.nutrition}
                </p>
              </div>
            )}
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl md:text-3xl">You may also like</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
