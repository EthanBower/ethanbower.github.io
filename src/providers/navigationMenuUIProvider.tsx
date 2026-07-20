"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type MenuPosition = "Top" | "Bottom";
export type NavItem = {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    isPersistent: boolean;
    addSeparator: boolean;
    selectQuery: () => boolean;
    onClick: () => void;
}

type NavigationMenuUIContextType = {
    navigationItems: NavItem[];
    setNavigationItems: React.Dispatch<React.SetStateAction<NavItem[]>>;
    menuOpen: boolean;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    menuPosition: MenuPosition;
    setMenuPosition: React.Dispatch<React.SetStateAction<MenuPosition>>;
    menuFocusRequested: boolean;
    setMenuFocusRequested: React.Dispatch<React.SetStateAction<boolean>>;
};

const NavigationMenuUIContext = createContext<NavigationMenuUIContextType | null>(null);

export function NavigationMenuUIProvider({ children }: { children: React.ReactNode }) {
    const [navigationItems, setNavigationItems] = useState<NavItem[]>([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState<MenuPosition>("Bottom");
    const [menuFocusRequested, setMenuFocusRequested] = useState(false);

    const uiValue = useMemo(() => ({
        navigationItems,
        setNavigationItems,
        menuOpen,
        setMenuOpen,
        menuPosition,
        setMenuPosition,
        menuFocusRequested,
        setMenuFocusRequested,
    }), [navigationItems, menuOpen, menuPosition, menuFocusRequested]);

    return (
        <NavigationMenuUIContext.Provider value={uiValue}>
            {children}
        </NavigationMenuUIContext.Provider>
    );
}

export function useNavigationMenuUI() {
    const context = useContext(NavigationMenuUIContext);
    if (!context) throw new Error("useNavigationMenuUI must be used within NavigationMenuUIProvider.");
    return context;
}