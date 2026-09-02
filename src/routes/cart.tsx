import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";


export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | Morani International" },
      { name: "description", content: "Review your Morani International order before checkout with Cash on Delivery." },
      { property: "og:title", content: "Your Cart | Morani International" },
      { property: "og:description", content: "Review your selected Talbeena and onion products before checkout." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, setQuantity, remove, ready } = useCart();

  return (
    <>
      <PageHero eyebrow="Checkout" title="Your Cart" description="Cash on Delivery available across Pakistan." />
      <div className="container-page py-12">
        {!ready ? (
          <p className="text-muted-foreground">Loading your cart…</p>
        ) : lines.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-soft">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button asChild className="mt-6" size="lg">
              <Link to="/products">Browse products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
            <ul className="space-y-4">
              {lines.map((line) => (
                <li
                  key={line.id}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft"
                >
                  <img
                    src={line.image_url}
                    alt={line.name}
                    className="h-24 w-24 rounded-xl object-cover"
                    loading="lazy"
                  />
                  <div className="flex flex-1 flex-col">
                    <Link
                      to="/products/$slug"
                      params={{ slug: line.slug }}
                      className="font-display text-lg hover:text-primary"
                    >
                      {line.name}
                    </Link>
                    <span className="text-sm text-muted-foreground">Price on request</span>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center gap-1 rounded-lg border border-border">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Decrease quantity"
                          onClick={() => setQuantity(line.id, line.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-sm font-semibold">{line.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Increase quantity"
                          onClick={() => setQuantity(line.id, line.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-3">

                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Remove ${line.name}`}
                          onClick={() => remove(line.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="font-display text-xl">Order Summary</h2>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-muted-foreground">Total items</span>
                <span className="font-semibold">{lines.reduce((n, l) => n + l.quantity, 0)}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Pricing and delivery charges are confirmed by our team when your order is placed.
              </p>
              <Button asChild className="mt-6 w-full" size="lg">
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button asChild variant="outline" className="mt-3 w-full">
                <Link to="/products">Continue shopping</Link>
              </Button>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
