import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/shipping-returns")({
  head: () => ({
    meta: [
      { title: "Shipping & Returns | Morani International" },
      { name: "description", content: "Delivery timelines, Cash on Delivery charges and the returns policy for Morani International orders in Pakistan." },
      { property: "og:title", content: "Shipping & Returns | Morani International" },
      { property: "og:description", content: "How we deliver across Pakistan and how returns are handled." },
    ],
  }),
  component: ShippingPage,
});

function ShippingPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Shipping & Returns" />
      <article className="container-page max-w-3xl space-y-6 py-14 leading-relaxed text-muted-foreground">
        <div>
          <h2 className="text-xl text-foreground">Delivery coverage</h2>
          <p className="mt-2">
            We deliver to all major cities and most towns across Pakistan through trusted courier
            partners. Orders are dispatched from our Karachi facility.
          </p>
        </div>
        <div>
          <h2 className="text-xl text-foreground">Timelines</h2>
          <p className="mt-2">
            Karachi: 1–2 working days. Other cities: 2–4 working days. Remote areas may take longer.
            Dispatch happens after order confirmation.
          </p>
        </div>
        <div>
          <h2 className="text-xl text-foreground">Delivery charges</h2>
          <p className="mt-2">
            A flat delivery charge is applied at checkout and shown on your order summary. Free
            delivery may apply above a configured order value, and bulk or wholesale shipments are
            quoted separately.
          </p>
        </div>
        <div>
          <h2 className="text-xl text-foreground">Returns & replacements</h2>
          <p className="mt-2">
            Because these are food products, we cannot accept returns of opened packs. If you
            receive a damaged, leaking or incorrect item, contact us within 48 hours of delivery
            with photos and we will replace it or refund the amount.
          </p>
        </div>
        <div>
          <h2 className="text-xl text-foreground">Cancellations</h2>
          <p className="mt-2">
            Orders can be cancelled free of charge any time before dispatch. Message us on WhatsApp
            at {SITE.phoneDisplay} with your order number.
          </p>
        </div>
      </article>
    </>
  );
}
