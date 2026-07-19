"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export type MenuPosition = "Top" | "Bottom";
export type NavItem = {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    isPersistent: boolean;
    selectQuery: () => boolean;
    onClick: () => void;
}
type BeforeNavigateCallback = () => Promise<void> | void;
type NavigationContextType = {
    navigationItems: NavItem[];
    setNavigationItems: React.Dispatch<React.SetStateAction<NavItem[]>>;
    menuOpen: boolean;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    menuPosition: MenuPosition;
    setMenuPosition: React.Dispatch<React.SetStateAction<MenuPosition>>;
    menuFocusRequested: boolean;
    setMenuFocusRequested: React.Dispatch<React.SetStateAction<boolean>>;
    navigate: (href: string) => Promise<void>;
    addBeforeNavigate: (callback: BeforeNavigateCallback | null) => () => void;
};

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [navigationItems, setNavigationItems] = useState<NavItem[]>([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState<MenuPosition>("Bottom");
    const [menuFocusRequested, setMenuFocusRequested] = useState(false);
    const beforeNavigatingCallbacks = useRef(new Set<BeforeNavigateCallback | null>());

    const addBeforeNavigate = useCallback((callback: BeforeNavigateCallback | null) => {
        beforeNavigatingCallbacks.current.add(callback);

        return () => {
            beforeNavigatingCallbacks.current.delete(callback);
        };
    }, []);

    const navigate = useCallback(async (href: string) => {
        if (pathname === href) {
            return;
        }

        const callbacks = [...beforeNavigatingCallbacks.current];
        beforeNavigatingCallbacks.current.clear();

        await Promise.all(
            callbacks.map(callback => callback?.())
        );

        router.push(href);
    }, [pathname, router]);

    const value = useMemo(() => ({
        navigationItems,
        setNavigationItems,
        menuOpen,
        setMenuOpen,
        menuPosition,
        setMenuPosition,
        menuFocusRequested,
        setMenuFocusRequested,
        navigate,
        addBeforeNavigate,
    }), [
        navigationItems,
        menuOpen,
        menuPosition,
        menuFocusRequested,
        navigate,
        addBeforeNavigate,
    ]);

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigation() {
    const context = useContext(NavigationContext);

    if (!context) {
        throw new Error("useNavigation must be used within NavigationProvider.");
    }

    return context;
}