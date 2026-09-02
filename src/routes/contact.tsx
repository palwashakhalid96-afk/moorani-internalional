import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { InquiryForm } from "@/components/site/InquiryForm";
import { Button } from "@/components/ui/button";
import { SITE, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Morani International | Karachi, Pakistan" },
      {
        name: "description",
        content:
          "Contact Morani International — WhatsApp +92 302 0162224, info@moraniinternational.com, Plot A-17, SITE Industrial Area, Karachi.",
      },
      { property: "og:title", content: "Contact Morani International" },
      { property: "og:description", content: "Reach our Karachi team by WhatsApp, phone or email." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    email: SITE.email,
    telephone: `+${SITE.whatsapp}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plot A-17, SITE Industrial Area",
      addressLocality: "Karachi",
      addressCountry: "PK",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow="Contact"
        title="We'd love to hear from you"
        description="Questions about an order, a product or a partnership? Our Karachi team responds quickly."
      />
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[22rem_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <span>{SITE.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <a href={`tel:+${SITE.whatsapp}`} className="hover:text-primary">{SITE.phoneDisplay}</a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <a href={`mailto:${SITE.email}`} className="break-all hover:text-primary">{SITE.email}</a>
              </li>
            </ul>
            <Button asChild variant="whatsapp" className="mt-6 w-full" size="lg">
              <a href={whatsappLink("Assalamu Alaikum Morani International!")}>
                <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
              </a>
            </Button>
          </div>
          <div className="rounded-2xl border border-border bg-secondary/50 p-6 text-sm text-muted-foreground">
            <h2 className="font-display text-lg text-foreground">Business hours</h2>
            <p className="mt-2">Monday – Saturday: 10:00 AM – 7:00 PM (PKT)</p>
            <p>Friday break: 1:00 PM – 2:30 PM</p>
          </div>
        </aside>

        <div>
          <h2 className="text-2xl">Send us a message</h2>
          <p className="mt-2 text-muted-foreground">We usually reply within one working day.</p>
          <div className="mt-6">
            <InquiryForm type="contact" fields={["city"]} submitLabel="Send Message" />
          </div>
        </div>
      </div>
    </>
  );
}
