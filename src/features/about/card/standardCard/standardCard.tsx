"use client";

import { ReactNode } from "react";
import CardLayout from "../cardLayout";

type StandardCardLayout = {
    icon: string;
    title: string;
    children: ReactNode;
}

export default function StandardCard({ icon, title, children }: StandardCardLayout) {
    return (
        <CardLayout>
            <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100/10 text-2xl">
                    {icon}
                </div>
                <h3 className="text-xl font-semibold text-white">
                    {title}
                </h3>
                <div>
                    {children}
                </div>
            </div>
        </CardLayout>
    );
}