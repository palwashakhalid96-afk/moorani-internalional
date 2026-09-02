import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { InquiryForm } from "@/components/site/InquiryForm";

export const Route = createFileRoute("/reseller")({
  head: () => ({
    meta: [
      { title: "Become a Reseller | Morani International" },
      {
        name: "description",
        content:
          "Join the Morani International reseller programme. Attractive margins, marketing support and reliable supply of Talbeena and dehydrated onion products.",
      },
      { property: "og:title", content: "Become a Morani International Reseller" },
      { property: "og:description", content: "Attractive margins and reliable supply for resellers across Pakistan." },
    ],
  }),
  component: ResellerPage,
});

const BENEFITS = [
  "Attractive reseller margins on every carton",
  "Ready-made product photos, captions and reels",
  "Low minimum order quantity to get started",
  "Dedicated WhatsApp support for your orders",
];

function ResellerPage() {
  return (
    <>
      <PageHero
        eyebrow="Reseller Programme"
        title="Sell Morani products, grow your income"
        description="Perfect for online sellers, home businesses and retail shops who want a premium, fast-moving health food brand."
      />
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[20rem_1fr]">
        <aside className="rounded-2xl border border-border bg-secondary/50 p-6">
          <h2 className="font-display text-xl">Why resell with us</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {BENEFITS.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {b}
              </li>
            ))}
          </ul>
        </aside>
        <div>
          <h2 className="text-2xl">Reseller application</h2>
          <p className="mt-2 text-muted-foreground">
            Share a few details and our team will contact you with pricing and terms.
          </p>
          <div className="mt-6">
            <InquiryForm
              type="reseller"
              fields={["business_name", "business_type", "city", "experience", "quantity"]}
              submitLabel="Apply as Reseller"
            />
          </div>
        </div>
      </div>
    </>
  );
}
