export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="surface-leaf border-b border-border">
      <div className="container-page py-14 md:py-20">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-foreground/80">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 max-w-3xl text-balance-tight text-4xl md:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
