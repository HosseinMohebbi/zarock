"use client";
import { usePathname } from "next/navigation";
import HamburgerMenu from "../ui/HamburgerMenu";

export default function HeaderController() {
    const pathname = usePathname();

    const hiddenRoutes = ["/", "/login", "/signup"];  

    if (hiddenRoutes.includes(pathname)) {
        return null;
    }

    return <HamburgerMenu />;
}
