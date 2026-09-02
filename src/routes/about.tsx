import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, Factory, HeartHandshake, Globe2 } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Morani International | Health, Food & Nature" },
      {
        name: "description",
        content:
          "Morani International produces premium Talbeena and dehydrated vegetable products from SITE Industrial Area, Karachi, with a focus on purity and nutrition.",
      },
      { property: "og:title", content: "About Morani International" },
      {
        property: "og:description",
        content: "Our story, our values and our commitment to natural, nourishing food products from Karachi.",
      },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: Leaf, title: "Purity first", body: "Natural ingredients, honest labelling and no unnecessary additives." },
  { icon: Factory, title: "Modern production", body: "Hygienic processing and sealed packaging at our Karachi facility." },
  { icon: HeartHandshake, title: "Customer trust", body: "Responsive support on WhatsApp and reliable Cash on Delivery." },
  { icon: Globe2, title: "Ready for export", body: "Consistent quality suited to bulk, institutional and export buyers." },
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Nourishment rooted in nature"
        description="Morani International is a Karachi-based food company creating wholesome products that bring traditional nutrition into everyday modern life."
      />

      <section className="container-page grid gap-10 py-14 lg:grid-cols-2">
        <div className="space-y-4 leading-relaxed text-muted-foreground">
          <p>
            We started with a simple belief: good food should be natural, nourishing and accessible.
            Talbeena — the barley-based porridge described in the Sunnah — has comforted and
            strengthened people for centuries. We reimagined it as an instant blend so families can
            enjoy that tradition without spending an hour in the kitchen.
          </p>
          <p>
            Our second pillar is dehydrated vegetables. Red onion and onion flakes produced under
            controlled conditions give chefs, food manufacturers and exporters a consistent,
            long-shelf-life ingredient with no compromise on aroma or colour.
          </p>
          <p>
            Everything we make is produced at {SITE.address}, packed with care and dispatched across
            Pakistan with Cash on Delivery.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <v.icon className="h-6 w-6 text-gold" />
              <h2 className="mt-3 font-display text-lg">{v.title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="rounded-3xl border border-border bg-secondary/50 p-10 text-center">
          <h2 className="text-2xl md:text-3xl">Work with us</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Whether you want a single pack for your home or pallets for your business, we're ready
            to serve you.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg"><Link to="/products">Shop products</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/wholesale">Wholesale enquiry</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
