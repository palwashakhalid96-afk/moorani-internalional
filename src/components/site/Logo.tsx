import { Link } from "@tanstack/react-router";
import logo from "@/assets/morani-logo.asset.json";
import { SITE } from "@/lib/site";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label={`${SITE.name} home`}>
      <img
        src={logo.url}
        alt={`${SITE.name} logo`}
        className="h-11 w-11 rounded-full object-cover ring-1 ring-border"
        width={44}
        height={44}
      />
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-base font-semibold tracking-tight text-primary">
            MORANI INTERNATIONAL
          </span>
          <span className="block text-[0.65rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {SITE.tagline}
          </span>
        </span>
      )}
    </Link>
  );
}
