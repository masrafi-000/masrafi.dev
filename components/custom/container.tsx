import { ReactNode } from "react";


type props = {
    children: ReactNode;
    className?: string;
    variant?: "default" | "full";
    id?: string;
}

export default function Container({ children, className, variant, id }: props) {
    return <div id={id} className={`${variant === "default" ? "container mx-auto" : "w-full"} ${className}`}>{children}</div>;
}