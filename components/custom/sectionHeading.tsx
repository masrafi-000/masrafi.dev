import { ReactNode } from "react";

type props = {
  children: ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  className?: string;
  id?: string;
  align?: "left" | "center" | "right";
};

export default function SectionHeading({
  children,
  ref,
  className,
  id,
  align,
}: props) {
  return (
    <div
      ref={ref}
      id={id}
      className={`${align === "left" ? "text-left" : align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left"} ${className}`}
    >
      {children}
    </div>
  );
}
