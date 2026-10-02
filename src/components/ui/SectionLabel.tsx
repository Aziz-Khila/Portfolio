import clsx from "clsx";

export function SectionLabel({
  index,
  children,
  className,
}: {
  index: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={clsx("label flex items-center gap-3", className)}>
      <span className="text-accent">({index})</span>
      <span className="h-px w-8 bg-line" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
