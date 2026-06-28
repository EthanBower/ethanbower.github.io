"use client";

import { createContext, useContext, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type BeforeNavigateCallback = () => Promise<void> | void;
type NavigationContextType = {
    menuOpen: boolean;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    menuFocusRequested: boolean;
    setMenuFocusRequested: React.Dispatch<React.SetStateAction<boolean>>;
    navigate: (href: string) => Promise<void>;
    addBeforeNavigate: (callback: BeforeNavigateCallback | null) => void;
};

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuFocusRequested, setMenuFocusRequested] = useState(false);
    const beforeNavigatingCallbacks = useRef(new Set<BeforeNavigateCallback | null>());

    function addBeforeNavigate(callback: BeforeNavigateCallback | null): () => void {
        beforeNavigatingCallbacks.current.add(callback);

        return () => {
            beforeNavigatingCallbacks.current.delete(callback);
        };
    };

    async function navigate(href: string) {
        if (pathname === href) {
            return;
        }

        const callbacks = [...beforeNavigatingCallbacks.current];
        beforeNavigatingCallbacks.current.clear();

        await Promise.all(
            callbacks.map(callback => callback?.())
        );

        router.push(href);
    }

    return (
        <NavigationContext.Provider
            value={{
                menuOpen,
                setMenuOpen,
                menuFocusRequested,
                setMenuFocusRequested,
                navigate,
                addBeforeNavigate,
            }}
        >
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