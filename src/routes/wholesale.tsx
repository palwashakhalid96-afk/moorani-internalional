import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { InquiryForm } from "@/components/site/InquiryForm";

export const Route = createFileRoute("/wholesale")({
  head: () => ({
    meta: [
      { title: "Wholesale Pricing | Morani International" },
      {
        name: "description",
        content:
          "Request wholesale pricing for Morani International Talbeena and dehydrated red onion. Bulk supply for shops, kitchens and food brands in Pakistan.",
      },
      { property: "og:title", content: "Wholesale — Morani International" },
      { property: "og:description", content: "Bulk pricing and reliable supply for retailers, kitchens and food manufacturers." },
    ],
  }),
  component: WholesalePage,
});

const POINTS = [
  "Carton and pallet quantities available",
  "Consistent quality with batch traceability",
  "Custom pack sizes on approved volumes",
  "Nationwide dispatch from Karachi",
];

function WholesalePage() {
  return (
    <>
      <PageHero
        eyebrow="Wholesale"
        title="Bulk supply for your business"
        description="Retailers, restaurants, caterers, food manufacturers and exporters — get Morani products at wholesale rates."
      />
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[20rem_1fr]">
        <aside className="rounded-2xl border border-border bg-secondary/50 p-6">
          <h2 className="font-display text-xl">Wholesale advantages</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {POINTS.map((p) => (
              <li key={p} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {p}
              </li>
            ))}
          </ul>
        </aside>
        <div>
          <h2 className="text-2xl">Request a wholesale quote</h2>
          <p className="mt-2 text-muted-foreground">
            Tell us what you need and we'll respond with a price list and lead times.
          </p>
          <div className="mt-6">
            <InquiryForm
              type="wholesale"
              fields={["business_name", "business_type", "city", "quantity"]}
              submitLabel="Request Quote"
            />
          </div>
        </div>
      </div>
    </>
  );
}
