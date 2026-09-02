import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { SITE, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/order-status")({
  validateSearch: z.object({ order: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Order Status | Morani International" },
      { name: "description", content: "Check the status of your Morani International order or contact our team on WhatsApp." },
      { property: "og:title", content: "Order Status | Morani International" },
      { property: "og:description", content: "Track your Morani International Cash on Delivery order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderStatusPage,
});

function OrderStatusPage() {
  const { order } = Route.useSearch();

  return (
    <>
      <PageHero
        eyebrow="Orders"
        title={order ? "Order Confirmed" : "Order Status"}
        description={
          order
            ? "Thank you for shopping with Morani International. Our team will call you to confirm delivery."
            : "Share your order number with our team on WhatsApp and we'll update you right away."
        }
      />
      <div className="container-page py-14">
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
          {order && <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />}
          {order && (
            <>
              <p className="mt-4 text-sm text-muted-foreground">Your order number</p>
              <p className="font-display text-3xl text-primary">{order}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                Please keep this number safe. Payment is collected in cash at the time of delivery.
              </p>
            </>
          )}
          {!order && (
            <p className="text-muted-foreground">
              Enter your order number in a WhatsApp message to {SITE.phoneDisplay} and our support
              team will share the latest status.
            </p>
          )}
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild variant="whatsapp" size="lg">
              <a
                href={whatsappLink(
                  order
                    ? `Assalamu Alaikum, I'd like an update on my order ${order}.`
                    : "Assalamu Alaikum, I'd like an update on my order.",
                )}
              >
                Ask on WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/products">Continue shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
