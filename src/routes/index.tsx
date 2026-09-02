import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, ShieldCheck, Truck, Sparkles, Star, ArrowRight } from "lucide-react";
import { getCatalog } from "@/lib/catalog.functions";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { SITE, whatsappLink } from "@/lib/site";
import logo from "@/assets/morani-logo.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Morani International | Premium Talbeena & Dehydrated Onion" },
      {
        name: "description",
        content:
          "Shop premium Instant Talbeena and dehydrated red onion from Morani International, Karachi. Natural ingredients, Cash on Delivery all over Pakistan.",
      },
      { property: "og:title", content: "Morani International — Health • Food • Nature" },
      {
        property: "og:description",
        content:
          "Premium Talbeena and dehydrated vegetable products. Order online or on WhatsApp with Cash on Delivery across Pakistan.",
      },
    ],
  }),
  loader: () => getCatalog(),
  component: Home,
});

const USPS = [
  { icon: Leaf, title: "100% Natural", body: "Clean ingredients, no artificial colours or preservatives." },
  { icon: ShieldCheck, title: "Quality Assured", body: "Produced under strict hygiene at our Karachi facility." },
  { icon: Truck, title: "Nationwide COD", body: "Cash on Delivery to every major city in Pakistan." },
  { icon: Sparkles, title: "Sunnah Inspired", body: "Talbeena, a nourishing barley tradition, made instant." },
];

function Home() {
  const { products, categories, reviews } = Route.useLoaderData();
  const featured = products.filter((p) => p.is_featured).slice(0, 4);
  const shelf = (featured.length ? featured : products).slice(0, 8);

  return (
    <>
      <section className="surface-leaf border-b border-border">
        <div className="container-page grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {SITE.tagline}
            </p>
            <h1 className="mt-5 text-balance-tight text-4xl leading-[1.05] md:text-6xl">
              {SITE.strapline}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Morani International brings you premium Instant Talbeena and dehydrated red onion
              products — wholesome, natural and crafted for modern Pakistani kitchens.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="xl">
                <Link to="/products">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="whatsapp">
                <a href={whatsappLink("Assalamu Alaikum, I'd like to order Talbeena.")}>
                  Order on WhatsApp
                </a>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="font-display text-2xl text-primary">100%</dt>
                <dd className="text-muted-foreground">Natural</dd>
              </div>
              <div>
                <dt className="font-display text-2xl text-primary">COD</dt>
                <dd className="text-muted-foreground">Pakistan-wide</dd>
              </div>
              <div>
                <dt className="font-display text-2xl text-primary">B2B</dt>
                <dd className="text-muted-foreground">Bulk supply</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-accent/60 blur-2xl" aria-hidden />
            <div className="relative grid grid-cols-2 gap-4">
              {products.slice(0, 4).map((p, i) => (
                <Link
                  key={p.id}
                  to="/products/$slug"
                  params={{ slug: p.slug }}
                  className={`overflow-hidden rounded-2xl border border-border bg-card shadow-lift ${
                    i % 2 === 1 ? "translate-y-6" : ""
                  }`}
                >
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="aspect-square w-full object-cover"
                    width={320}
                    height={320}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {USPS.map((usp) => (
            <div key={usp.title} className="flex gap-3">
              <usp.icon className="mt-0.5 h-6 w-6 shrink-0 text-gold" />
              <div>
                <h3 className="text-base font-semibold">{usp.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{usp.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl">Our Products</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Hand-crafted blends and dehydrated vegetables, packed fresh for your family and your
              business.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/products">View all products</Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {shelf.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {categories.length > 0 && (
        <section className="border-y border-border bg-secondary/40 py-16">
          <div className="container-page">
            <h2 className="text-3xl md:text-4xl">Shop by Category</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to="/products"
                  search={{ category: c.slug }}
                  className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-lift"
                >
                  <h3 className="font-display text-xl text-primary">{c.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Browse <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-page grid items-center gap-12 py-16 md:py-20 lg:grid-cols-2">
        <img
          src={logo.url}
          alt="Morani International brand mark"
          className="mx-auto w-full max-w-sm rounded-3xl border border-border object-cover shadow-lift"
          loading="lazy"
        />
        <div>
          <h2 className="text-3xl md:text-4xl">Rooted in nature, made for today</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            From our facility at SITE Industrial Area, Karachi, we produce nourishing food products
            that respect tradition and meet modern quality standards. Talbeena — the barley
            porridge of the Sunnah — is our flagship, reimagined as an instant, delicious blend for
            busy households.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Alongside it, our dehydrated red onion and onion flakes serve kitchens, food brands and
            exporters who need consistent, hygienic, long-shelf-life ingredients.
          </p>
          <Button asChild className="mt-6" variant="outline" size="lg">
            <Link to="/about">More about us</Link>
          </Button>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="border-t border-border bg-secondary/40 py-16">
          <div className="container-page">
            <h2 className="text-3xl md:text-4xl">What our customers say</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {reviews.slice(0, 3).map((r) => (
                <figure key={r.id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <div className="flex gap-0.5 text-gold">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {r.body}
                  </blockquote>
                  <figcaption className="mt-4 text-sm font-semibold">
                    {r.customer_name}
                    {r.city && <span className="font-normal text-muted-foreground"> — {r.city}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-page py-16">
        <div className="rounded-3xl border border-border bg-primary p-10 text-primary-foreground shadow-lift md:p-14">
          <h2 className="max-w-2xl text-3xl text-primary-foreground md:text-4xl">
            Partner with Morani International
          </h2>
          <p className="mt-3 max-w-2xl text-primary-foreground/80">
            Reseller, wholesale and distributorship opportunities are open across Pakistan. Get
            competitive pricing, marketing support and reliable supply.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg">
              <Link to="/reseller">Become a Reseller</Link>
            </Button>
            <Button asChild variant="hero" size="lg">
              <Link to="/wholesale">Wholesale Pricing</Link>
            </Button>
            <Button asChild variant="hero" size="lg">
              <Link to="/distributor">Distributorship</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
