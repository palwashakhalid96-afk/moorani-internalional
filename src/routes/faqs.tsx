import { createFileRoute } from "@tanstack/react-router";
import { getFaqs } from "@/lib/catalog.functions";
import { PageHero } from "@/components/site/PageHero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs | Morani International" },
      {
        name: "description",
        content:
          "Answers about Talbeena preparation, delivery times, Cash on Delivery, wholesale orders and returns at Morani International.",
      },
      { property: "og:title", content: "Frequently Asked Questions — Morani International" },
      { property: "og:description", content: "Delivery, payment, product and wholesale questions answered." },
    ],
  }),
  loader: () => getFaqs(),
  component: FaqsPage,
});

function FaqsPage() {
  const faqs = Route.useLoaderData();
  const groups = Array.from(new Set(faqs.map((f) => f.group_name || "General")));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow="Support"
        title="Frequently Asked Questions"
        description="Everything you need to know about our products, delivery and payment."
      />
      <div className="container-page py-14">
        {faqs.length === 0 ? (
          <p className="text-muted-foreground">FAQs will be published here shortly.</p>
        ) : (
          <div className="mx-auto max-w-3xl space-y-10">
            {groups.map((group) => (
              <section key={group}>
                <h2 className="text-xl text-primary">{group}</h2>
                <Accordion type="single" collapsible className="mt-3">
                  {faqs
                    .filter((f) => (f.group_name || "General") === group)
                    .map((f) => (
                      <AccordionItem key={f.id} value={f.id}>
                        <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {f.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
