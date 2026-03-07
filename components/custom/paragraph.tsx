
import { ReactNode } from "react";


type props = {
    children: ReactNode;
    className?: string;
    id?: string;
}

export default function Paragraph({ children, className, id }: props) {
    return <p id={id} className={`${className}`}>{children}</p>;
}