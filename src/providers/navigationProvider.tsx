"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type BeforeNavigateCallback = () => Promise<void> | void;
type NavigationContextType = {
    navigate: (href: string) => Promise<void>;
    addBeforeNavigate: (callback: BeforeNavigateCallback | null) => () => void;
};

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const beforeNavigatingCallbacks = useRef(new Set<BeforeNavigateCallback | null>());

    const addBeforeNavigate = useCallback((callback: BeforeNavigateCallback | null) => {
        beforeNavigatingCallbacks.current.add(callback);
        return () => { beforeNavigatingCallbacks.current.delete(callback); };
    }, []);

    const navigate = useCallback(async (href: string) => {
        console.log(`${pathname} ---> ${href}`);
        if (pathname === href) return;

        console.log("Waiting on callbacks...");
        const callbacks = [...beforeNavigatingCallbacks.current];
        await Promise.all(callbacks.map(callback => callback?.()));
        console.log("Callback done...");

        beforeNavigatingCallbacks.current.clear();
        router.push(href);
    }, [pathname, router]);

    const navValue = useMemo(() => ({
        navigate,
        addBeforeNavigate,
    }), [navigate, addBeforeNavigate]);

    return (
        <NavigationContext.Provider value={navValue}>
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigation() {
    const context = useContext(NavigationContext);
    if (!context) throw new Error("useNavigation must be used within NavigationProvider.");
    return context;
}