import { ReactNode } from "react";


type props = {
    children: ReactNode;
    className?: string;
    variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    id?: string;
}

export default function Heading({ children, className, variant, id }: props) {
    return <h1 id={id} className={`${variant === "h1" ? "text-4xl font-bold" : variant === "h2" ? "text-3xl font-bold" : variant === "h3" ? "text-2xl font-bold" : variant === "h4" ? "text-xl font-bold" : variant === "h5" ? "text-lg font-bold" : variant === "h6" ? "text-base font-bold" : "text-4xl font-bold"} ${className}`}>{children}</h1>;
}