import { ReactNode } from "react";

type props = {
  children: ReactNode;
  ref?: React.Ref<HTMLElement>;
  className?: string;
  variant?: "default" | "full";
  padding?: "default" | "none";
  id?: string;
};

export default function Section({
  children,
  className,
  variant,
  padding,
  id,
  ref,
}: props) {
  return (
    <section
      id={id}
      ref={ref}
      className={`${variant === "default" ? "container mx-auto" : "w-full"} ${padding === "none" ? "p-0" : "py-10"} ${className}`}
    >
      {children}
    </section>
  );
}
