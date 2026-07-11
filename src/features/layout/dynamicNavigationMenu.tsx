"use client";

import PlanetIcon from "@/src/components/icons/planet";
import NavigationMenu from "../../components/ui/navigationMenu";
import HomeIcon from "@/src/components/icons/home";
import Gear from "@/src/components/icons/gear";
import Settings from "../settings/settings";
import { useState } from "react";
import { useNavigation } from "@/src/providers/navigationProvider";

export default function DynamicNavigationMenu() {
    const { menuOpen, setMenuOpen, menuPosition, navigate } = useNavigation();
    const [settingsDisplay, setSettingsDisplayEnabled] = useState(false);
    const navbarItems = [
        {
            label: "Settings",
            icon: <Gear />,
            onClick: () => {
                setMenuOpen(false);
                setSettingsDisplayEnabled(true);
            },
        },
        {
            label: "Home",
            icon: <HomeIcon />,
            onClick: () => {
                navigate("/home");
            },
        },
        {
            label: "Moon",
            icon: <PlanetIcon />,
            onClick: () => {
                navigate("/about");
            },
        },
    ];

    return (
        <>
            <NavigationMenu items={navbarItems} position={menuPosition} enable={menuOpen} />
            <Settings enable={settingsDisplay} onClose={() => {
                setSettingsDisplayEnabled(false);
                setMenuOpen(true);
            }} />
        </>
    );
}