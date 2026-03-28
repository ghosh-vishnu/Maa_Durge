type SectionTitleProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
};

export default function SectionTitle({ eyebrow, title, subtitle }: SectionTitleProps) {
  return (
    <div className="section-title-shell mx-auto max-w-3xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--color-saffron)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight text-[var(--color-charcoal)] sm:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[var(--color-muted)] sm:text-lg">{subtitle}</p>
    </div>
  );
}