"use client";

import PlanetIcon from "@/src/components/icons/planet";
import NavigationMenu from "../../components/ui/navigationMenu";
import HomeIcon from "@/src/components/icons/home";
import Gear from "@/src/components/icons/gear";
import Settings from "../settings/settings";
import { useEffect, useState } from "react";
import { NavItem, useNavigation } from "@/src/providers/navigationProvider";

export default function DynamicNavigationMenu() {
    const { setMenuOpen, navigate, setNavigationItems } = useNavigation();
    const [settingsDisplay, setSettingsDisplayEnabled] = useState(false);

    useEffect(() => {
        const navbarItems: NavItem[] = [
            {
                id: crypto.randomUUID(),
                label: "Settings",
                icon: <Gear />,
                isPersistent: true,
                onClick: () => {
                    setMenuOpen(false);
                    setSettingsDisplayEnabled(true);
                },
            },
            {
                id: crypto.randomUUID(),
                label: "Home",
                icon: <HomeIcon />,
                isPersistent: true,
                onClick: () => {
                    navigate("/home");
                },
            },
            {
                id: crypto.randomUUID(),
                label: "Moon",
                icon: <PlanetIcon />,
                isPersistent: true,
                onClick: () => {
                    navigate("/about");
                },
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
            <NavigationMenu />
            <Settings enable={settingsDisplay} onClose={() => {
                setSettingsDisplayEnabled(false);
                setMenuOpen(true);
            }} />
        </>
    );
}