"use client";

import { useEffect, useRef, useState } from "react";

export default function DraggableWindow({ windowTitle, onClose, children }: Readonly<{ windowTitle: string, onClose: () => Promise<void>, children: React.ReactNode; }>) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);
    const offset = useRef({ x: 0, y: 0 });

    function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
        offset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
    }

    function onPointerMove(e: PointerEvent) {
        setPosition({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
    }

    function onPointerUp() {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
    }

    async function handleClose() {
        // fade out
        setVisible(false);

        // wait for animation
        await new Promise((resolve) => setTimeout(resolve, 400));

        // then remove component / continue app
        await onClose();
    }

    useEffect(() => {
        requestAnimationFrame(() => {
            setVisible(true);
        });
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Outer div window to control window positioning */}
            <div className="items-center z-10" style={{ translate: `${position.x}px ${position.y}px` }}>
                {/* Inner div window to control window animations */}
                <div className={`
                    pointer-events-auto backdrop-blur-md border border-white/10 rounded-xl text-white bg-black/15
                    transform-gpu transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                    ${visible ? "scale-100 opacity-100" : "scale-[0.82] opacity-0 pointer-events-none"}`}
                    >
                    <div onPointerDown={onPointerDown} className="cursor-grab active:cursor-grabbing select-none" >
                        <div className="p-3 pb-0">
                            <div className="text-xs text-white/60 text-center">
                                {windowTitle}
                            </div>
                        </div>
                    </div>
                    <div className="bg-black/25 m-1 p-3 rounded-xl">
                        {children}
                        <button onClick={handleClose} className="w-full bg-red-800/40 text-red-200 border border-red-500/40 py-1 rounded-md hover:bg-red-700/50 hover:border-red-400/60 transition-all shadow-[0_0_20px_rgba(255,0,0,0.25)]">
                            Exit Window
                        </button>
                    </div>
                </div>
            </div>         
        </div>
    );
}