"use client";

import PlanetIcon from "@/src/components/icons/planet";
import HomeIcon from "@/src/components/icons/home";
import Gear from "@/src/components/icons/gear";
import Settings from "../settings/settings";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useNavigation } from "@/src/providers/navigationProvider";
import { NavItem, useNavigationMenuUI } from "@/src/providers/navigationMenuUIProvider";
import Navbar from "../../components/ui/navbar";

export default function DynamicNavigationMenu() {
    const pathname = usePathname();
    const { navigate } = useNavigation();
    const { setMenuOpen, setNavigationItems } = useNavigationMenuUI();
    const [settingsDisplay, setSettingsDisplayEnabled] = useState(false);

    useEffect(() => {
        const navbarItems: NavItem[] = [
            {
                id: crypto.randomUUID(),
                label: "Settings",
                icon: Gear,
                isPersistent: true,
                addSeparator: false,
                selectQuery: () => false,
                onClick: () => {
                    setMenuOpen(false);
                    setSettingsDisplayEnabled(true);
                },
            },
            {
                id: crypto.randomUUID(),
                label: "Home",
                icon: HomeIcon,
                isPersistent: true,
                addSeparator: false,
                selectQuery: () => pathname === "/home",
                onClick: () => navigate("/home")
            },
            {
                id: crypto.randomUUID(),
                label: "Moon",
                icon: PlanetIcon,
                isPersistent: true,
                addSeparator: false,
                selectQuery: () => pathname === "/about",
                onClick: () => navigate("/about")
            },
        ];

        setNavigationItems(navbarItems);

        return () => {
            const ids = new Set(navbarItems.map(item => item.id));

            setNavigationItems(prev =>
                prev.filter(item => !ids.has(item.id))
            );
        };
    }, [setNavigationItems, navigate, setMenuOpen, setSettingsDisplayEnabled]);

    return (
        <>
            <Navbar />
            <Settings enable={settingsDisplay} onClose={() => {
                setSettingsDisplayEnabled(false);
                setMenuOpen(true);
            }} />
        </>
    );
}