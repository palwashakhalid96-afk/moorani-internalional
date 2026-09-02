import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Instagram, Facebook, Youtube } from "lucide-react";
import { Logo } from "./Logo";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/50">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Premium Talbeena and dehydrated vegetable products, produced in Karachi with a
            commitment to purity, nutrition and natural goodness.
          </p>
          <div className="flex gap-3">
            <a href={SITE.social.instagram} aria-label="Instagram" className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={SITE.social.facebook} aria-label="Facebook" className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
              <Facebook className="h-4 w-4" />
            </a>
            <a href={SITE.social.youtube} aria-label="YouTube" className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">Shop</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/products" className="hover:text-primary">All Products</Link></li>
            <li><Link to="/cart" className="hover:text-primary">Cart</Link></li>
            <li><Link to="/checkout" className="hover:text-primary">Checkout (COD)</Link></li>
            <li><Link to="/order-status" className="hover:text-primary">Order Status</Link></li>
            <li><Link to="/faqs" className="hover:text-primary">FAQs</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">Business</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link to="/reseller" className="hover:text-primary">Become a Reseller</Link></li>
            <li><Link to="/wholesale" className="hover:text-primary">Wholesale</Link></li>
            <li><Link to="/distributor" className="hover:text-primary">Distributorship</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>{SITE.address}</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={`tel:+${SITE.whatsapp}`} className="hover:text-primary">{SITE.phoneDisplay}</a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={`mailto:${SITE.email}`} className="hover:text-primary">{SITE.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-3 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary">Terms & Conditions</Link>
            <Link to="/shipping-returns" className="hover:text-primary">Shipping & Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
