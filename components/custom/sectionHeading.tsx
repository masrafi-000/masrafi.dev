import { ReactNode } from "react";


type props = {
    children: ReactNode;
    className?: string;
    id?: string;
    align?: "left" | "center" | "right";
}

export default function SectionHeading({ children, className, id, align }: props) {
    return <div id={id} className={`${align === "left" ? "text-left" : align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left"} ${className}`}>{children}</div>;
}   