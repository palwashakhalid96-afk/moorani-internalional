import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, X, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { SITE, whatsappLink } from "@/lib/site";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/reseller", label: "Reseller" },
  { to: "/wholesale", label: "Wholesale" },
  { to: "/distributor", label: "Distributor" },
  { to: "/faqs", label: "FAQs" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { count, ready } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="hidden bg-primary text-primary-foreground md:block">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <p>Free delivery on bulk orders • Cash on Delivery across Pakistan</p>
          <a href={`tel:+${SITE.whatsapp}`} className="inline-flex items-center gap-2 hover:underline">
            <Phone className="h-3.5 w-3.5" /> {SITE.phoneDisplay}
          </a>
        </div>
      </div>

      <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary data-[status=active]:bg-secondary data-[status=active]:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="icon" className="relative" aria-label="Cart">
            <Link to="/cart">
              <ShoppingBag className="h-5 w-5" />
              {ready && count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[0.7rem] font-bold text-gold-foreground">
                  {count}
                </span>
              )}
            </Link>
          </Button>
          <Button asChild className="hidden sm:inline-flex">
            <Link to="/products">Shop Now</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background lg:hidden" aria-label="Mobile">
          <div className="container-page grid gap-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground/85 hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
            <Button asChild variant="whatsapp" className="mt-2">
              <a href={whatsappLink("Assalamu Alaikum, I would like to place an order.")}>
                Order on WhatsApp
              </a>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
