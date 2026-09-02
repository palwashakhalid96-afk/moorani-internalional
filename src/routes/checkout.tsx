import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/cart";
import { placeOrder } from "@/lib/orders.functions";
import { CITIES } from "@/lib/site";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | Morani International" },
      { name: "description", content: "Place your Morani International order with Cash on Delivery — no account required." },
      { property: "og:title", content: "Checkout | Morani International" },
      { property: "og:description", content: "Guest checkout with Cash on Delivery across Pakistan." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { lines, clear, ready } = useCart();
  const submit = useServerFn(placeOrder);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lines.length === 0) return;
    const data = new FormData(event.currentTarget);
    setLoading(true);
    try {
      const result = await submit({
        data: {
          customer_name: String(data.get("customer_name") ?? ""),
          phone: String(data.get("phone") ?? ""),
          whatsapp: String(data.get("whatsapp") ?? ""),
          email: String(data.get("email") ?? ""),
          address: String(data.get("address") ?? ""),
          city: String(data.get("city") ?? ""),
          notes: String(data.get("notes") ?? ""),
          items: lines.map((l) => ({ product_id: l.id, quantity: l.quantity })),
        },
      });
      clear();
      toast.success("Order placed successfully!");
      navigate({ to: "/order-status", search: { order: result.order_number } });
    } catch {
      toast.error("We couldn't place your order. Please try again or order on WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Guest Checkout"
        title="Cash on Delivery"
        description="No account needed. Fill in your delivery details and pay when your parcel arrives."
      />
      <div className="container-page py-12">
        {ready && lines.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-soft">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button asChild className="mt-6">
              <Link to="/products">Browse products</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1fr_22rem]">
            <div className="grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="customer_name">Full name *</Label>
                <Input id="customer_name" name="customer_name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" name="phone" required placeholder="03xx xxxxxxx" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="whatsapp">WhatsApp number</Label>
                <Input id="whatsapp" name="whatsapp" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City *</Label>
                <select
                  id="city"
                  name="city"
                  required
                  defaultValue=""
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="" disabled>Select city</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="address">Complete delivery address *</Label>
                <Textarea id="address" name="address" required rows={3} />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="notes">Order notes</Label>
                <Textarea id="notes" name="notes" rows={2} />
              </div>
            </div>

            <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="font-display text-xl">Your Order</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {lines.map((l) => (
                  <li key={l.id} className="flex justify-between gap-3">
                    <span className="text-muted-foreground">
                      {l.name} × {l.quantity}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
                Prices are not shown online. Our team will confirm the total, including delivery
                charges, on WhatsApp or by phone before dispatch.
              </p>
              <Button type="submit" className="mt-6 w-full" size="lg" disabled={loading}>
                {loading ? "Placing order…" : "Place Order (COD)"}
              </Button>
            </aside>
          </form>
        )}
      </div>
    </>
  );
}
