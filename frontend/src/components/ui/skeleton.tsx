import { cn } from "pec/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-2xl bg-primary/10", className)}
      {...props}
    />
  );
}

export { Skeleton };
