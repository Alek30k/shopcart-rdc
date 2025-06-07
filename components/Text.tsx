import { cn } from "@/lib/utils";

const Title = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2
      className={cn(
        "text-2xl md:text-3xl font-bold text-shop_dark_green capitalize tracking-wide mb-5",
        className
      )}
    >
      {children}
    </h2>
  );
};

export { Title };
