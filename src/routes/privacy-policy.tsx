import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Morani International" },
      { name: "description", content: "How Morani International collects, uses and protects your personal information when you shop with us." },
      { property: "og:title", content: "Privacy Policy | Morani International" },
      { property: "og:description", content: "Our commitment to protecting your personal data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <article className="container-page max-w-3xl space-y-6 py-14 leading-relaxed text-muted-foreground">
        <p>
          {SITE.name} respects your privacy. This policy explains what information we collect and
          how we use it.
        </p>
        <div>
          <h2 className="text-xl text-foreground">Information we collect</h2>
          <p className="mt-2">
            When you place an order or submit an inquiry, we collect your name, phone number,
            WhatsApp number, email address, city and delivery address. We also collect the products
            and quantities in your order.
          </p>
        </div>
        <div>
          <h2 className="text-xl text-foreground">How we use it</h2>
          <p className="mt-2">
            Your information is used solely to process and deliver your order, respond to your
            inquiry, and provide customer support. We may contact you by phone or WhatsApp to
            confirm delivery details.
          </p>
        </div>
        <div>
          <h2 className="text-xl text-foreground">Sharing</h2>
          <p className="mt-2">
            We share delivery details with our courier partners only as required to complete your
            delivery. We never sell your data.
          </p>
        </div>
        <div>
          <h2 className="text-xl text-foreground">Data security & retention</h2>
          <p className="mt-2">
            Order and inquiry records are stored in a secured database with restricted staff access
            and retained only as long as needed for business and legal purposes.
          </p>
        </div>
        <div>
          <h2 className="text-xl text-foreground">Contact</h2>
          <p className="mt-2">
            For any privacy request, email <a className="text-primary hover:underline" href={`mailto:${SITE.email}`}>{SITE.email}</a> or
            WhatsApp {SITE.phoneDisplay}.
          </p>
        </div>
      </article>
    </>
  );
}
