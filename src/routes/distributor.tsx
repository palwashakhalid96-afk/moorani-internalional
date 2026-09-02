import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { InquiryForm } from "@/components/site/InquiryForm";

export const Route = createFileRoute("/distributor")({
  head: () => ({
    meta: [
      { title: "Distributorship | Morani International" },
      {
        name: "description",
        content:
          "Apply for a Morani International distributorship. Exclusive territories, trade pricing and marketing support for distributors across Pakistan.",
      },
      { property: "og:title", content: "Become a Distributor — Morani International" },
      { property: "og:description", content: "Territory-based distributorships with trade pricing and brand support." },
    ],
  }),
  component: DistributorPage,
});

const POINTS = [
  "Territory-based appointment with clear terms",
  "Best-in-class trade pricing and credit discussion",
  "Branding, POS material and campaign support",
  "Priority production slots for planned volumes",
];

function DistributorPage() {
  return (
    <>
      <PageHero
        eyebrow="Distributorship"
        title="Represent Morani in your region"
        description="We are appointing distributors city by city. If you have the network and warehousing, let's talk."
      />
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[20rem_1fr]">
        <aside className="rounded-2xl border border-border bg-secondary/50 p-6">
          <h2 className="font-display text-xl">What you get</h2>
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
          <h2 className="text-2xl">Distributor application</h2>
          <p className="mt-2 text-muted-foreground">
            Provide your business details and territory of interest.
          </p>
          <div className="mt-6">
            <InquiryForm
              type="distributor"
              fields={["business_name", "business_type", "city", "area", "experience", "quantity"]}
              submitLabel="Apply for Distributorship"
            />
          </div>
        </div>
      </div>
    </>
  );
}
