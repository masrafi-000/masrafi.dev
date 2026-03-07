import { ReactNode } from "react";


type props = {
    children: ReactNode;
    className?: string;
    variant?: "default" | "full";
    padding?: "default" | "none";
    id?: string;
}

export default function Section({ children, className, variant, padding, id }: props) {
    return <section id={id} className={`${variant === "default" ? "container mx-auto" : "w-full"} ${padding === "none" ? "p-0" : "py-10"} ${className}`}>{children}</section>;
}