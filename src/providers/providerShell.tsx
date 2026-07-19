"use client";

import { NavigationMenuUIProvider } from "./navigationMenuUIProvider";
import { NavigationProvider } from "./navigationProvider";
import { SettingsProvider } from "./settingsProvider";

export default function ProviderShell({ children }: { children: React.ReactNode }) {
    return (
        <SettingsProvider>
            <NavigationProvider>
                <NavigationMenuUIProvider>
                    {children}
                </NavigationMenuUIProvider>
            </NavigationProvider>
        </SettingsProvider>
    );
}