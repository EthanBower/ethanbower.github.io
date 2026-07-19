"use client";

import { useNavigationMenuUI } from "@/src/providers/navigationMenuUIProvider";
import { ReactNode, useEffect, useState } from "react";
import FullWindowMenu from "./fullWindowMenu";
import TabMenu from "./tabMenu";

type BottomTabProps = {
    enable: boolean;
    tabCloseTitle: string;
    onTabOpen?: () => void;
    onTabClose?: () => void;
    onCloseComplete: () => void;
    children: ReactNode;
}

export default function BottomTab2({ enable, tabCloseTitle, onCloseComplete, onTabOpen, onTabClose, children }: BottomTabProps) {
    const [open, setOpen] = useState(false);
    const { setMenuPosition } = useNavigationMenuUI();

    useEffect(() => {
        setMenuPosition("Top");
    }, [setMenuPosition]);

    function openMainMenu() {
        setMenuPosition("Bottom");
        setOpen(true);
        onTabOpen?.();
    }

    function closeMainMenu() {
        setMenuPosition("Top");
        setOpen(false);
        onTabClose?.();
    }

    return (
        <>
            <TabMenu
                enable={!open && enable}
                onCloseComplete={enable ? () => { } : onCloseComplete}
                onTabClickEvent={openMainMenu}
                tabCloseTitle={tabCloseTitle}
            />
            <FullWindowMenu
                enable={open && enable}
                onCloseComplete={enable ? () => { } : onCloseComplete}
                onCloseClickEvent={closeMainMenu}>
                {children}
            </FullWindowMenu>
        </>
    );
}