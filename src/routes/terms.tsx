import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Morani International" },
      { name: "description", content: "Terms and conditions for ordering Morani International products online with Cash on Delivery in Pakistan." },
      { property: "og:title", content: "Terms & Conditions | Morani International" },
      { property: "og:description", content: "The terms that apply to orders placed on our website." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms & Conditions" />
      <article className="container-page max-w-3xl space-y-6 py-14 leading-relaxed text-muted-foreground">
        <p>
          By placing an order with {SITE.name} you agree to the terms below.
        </p>
        <div>
          <h2 className="text-xl text-foreground">Orders</h2>
          <p className="mt-2">
            All orders are subject to confirmation and stock availability. Our team may call or
            message you to verify your order before dispatch. Unverified or unreachable orders may
            be cancelled.
          </p>
        </div>
        <div>
          <h2 className="text-xl text-foreground">Pricing & payment</h2>
          <p className="mt-2">
            Prices are listed in Pakistani Rupees and may change without notice. Cash on Delivery is
            the accepted payment method for online orders; the full amount including delivery
            charges is payable to the courier at the time of delivery.
          </p>
        </div>
        <div>
          <h2 className="text-xl text-foreground">Product information</h2>
          <p className="mt-2">
            Product descriptions, ingredients and images are provided for guidance. Our products are
            food items intended for general nutrition and are not a substitute for medical advice or
            treatment.
          </p>
        </div>
        <div>
          <h2 className="text-xl text-foreground">Liability</h2>
          <p className="mt-2">
            Our liability for any order is limited to the value of the products purchased. Delivery
            timelines are estimates and may vary due to courier or weather conditions.
          </p>
        </div>
        <div>
          <h2 className="text-xl text-foreground">Contact</h2>
          <p className="mt-2">
            Questions about these terms? Email {SITE.email} or WhatsApp {SITE.phoneDisplay}.
          </p>
        </div>
      </article>
    </>
  );
}
