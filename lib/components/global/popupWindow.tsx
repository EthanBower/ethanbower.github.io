"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type PopupWindowProps = Readonly<{
    windowTitle: string;
    onClose: () => Promise<void>;
    children: React.ReactNode;
}>;

// Animation time in MS for snap-back of window. NOTE: Make sure to also update in TSX HTML below manually for consistency; that animation fades in-and-out.
const ANIMATION_TIME_MS = 400;
const TRANSITION_STYLE = `transform ${ANIMATION_TIME_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
const WINDOW_TITLE_TYPE_TIME_MS = 80;

export default function PopupWindow({ windowTitle, onClose, children }: PopupWindowProps) {
    const [visible, setVisible] = useState(false);  
    const [typedTitle, setTypedTitle] = useState("");
    const windowRef = useRef<HTMLDivElement>(null); // This gets us a performance boost by directly updating DOM style. Bypasses React re-renders during drag.
    const offset = useRef({ x: 0, y: 0 });
    const currentPosition = useRef({ x: 0, y: 0 });
    const timeoutId = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        let currentLength = 0;

        const intervalId = setInterval(() => {
            if (currentLength < windowTitle.length) {
                currentLength++;
                setTypedTitle(windowTitle.slice(0, currentLength));
                return;
            }
            
            // Remove timer once the full title is typed
            clearInterval(intervalId);
        }, WINDOW_TITLE_TYPE_TIME_MS); // 60ms delay per letter. Decrease for faster typing, increase for slower.

        return () => clearInterval(intervalId); // Safety cleanup if component unmounts mid-type
    }, [windowTitle]);

    // Clean up all global listeners and timers on unmount to prevent leaks
    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
        
        return () => {
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
            if (timeoutId.current) clearTimeout(timeoutId.current);
        };
    }, []);

    function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
        offset.current = {
            x: e.clientX - currentPosition.current.x,
            y: e.clientY - currentPosition.current.y,
        };

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
    }

    function onPointerMove(e: PointerEvent) {
        if (!windowRef.current) return;

        const targetX = e.clientX - offset.current.x;
        const targetY = e.clientY - offset.current.y;

        currentPosition.current = { x: targetX, y: targetY };
        
        windowRef.current.style.transition = "none";
        windowRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
    }

    function onPointerUp() {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);

        if (!windowRef.current) return;

        const rect = windowRef.current.getBoundingClientRect();
        
        // Calculate safe layout boundaries
        const initialLeft = rect.left - currentPosition.current.x;
        const initialTop = rect.top - currentPosition.current.y;

        const minX = -initialLeft;
        const maxX = window.innerWidth - initialLeft - rect.width;
        const minY = -initialTop;
        const maxY = window.innerHeight - initialTop - rect.height;

        // Determine the clamped coordinates
        const clampedX = Math.max(minX, Math.min(maxX, currentPosition.current.x));
        const clampedY = Math.max(minY, Math.min(maxY, currentPosition.current.y));

        // If out of bounds, apply snap back CSS transition & cache the timeout instance so it can be safely cleared if needed
        if (clampedX !== currentPosition.current.x || clampedY !== currentPosition.current.y) {
            windowRef.current.style.transition = TRANSITION_STYLE;
            windowRef.current.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0)`;

            timeoutId.current = setTimeout(() => {
                currentPosition.current = { x: clampedX, y: clampedY };
                timeoutId.current = null;
            }, ANIMATION_TIME_MS);
        }
    }

    async function handleClose() {
        setVisible(false);
        await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIME_MS));
        await onClose();
    }

    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Window positioning layer for directly managing DOM strings enabling smooth rendering */}
            <div ref={windowRef} className="z-10" style={{ transform: "translate3d(0px, 0px, 0)" }}>
                {/* Animation Layer */}
                <div className={`popup-window ${visible ? "scale-100 opacity-100" : "scale-[0.82] opacity-0 pointer-events-none"}`}>             
                    <div onPointerDown={onPointerDown} className="cursor-grab active:cursor-grabbing select-none flex items-center gap-4 p-4 pb-2">
                        {/* Left Side SVG Icon */}
                        <div className="flex-shrink-0 text-indigo-400">
                            <svg xmlns="http://w3.org" viewBox="0 0 24 20" fill="currentColor" className="w-8 h-8" >
                                <path fillRule="evenodd" d="M14.47 2.47a.75.75 0 011.06 0l6 6a.75.75 0 010 1.06l-6 6a.75.75 0 11-1.06-1.06L19.94 9l-5.47-5.47a.75.75 0 010-1.06zm-4.94 0a.75.75 0 00-1.06 0l-6 6a.75.75 0 000 1.06l6 6a.75.75 0 101.06-1.06L4.06 9l5.47-5.47a.75.75 0 000-1.06z" clipRule="evenodd" />
                            </svg>
                        </div>
                        {/* Right Side: Text Stack Container */}
                        <div className="flex flex-col min-w-0 text-left">
                            <h3 className="text-sm font-semibold text-white tracking-wide font-mono flex items-center gap-0.5">
                                <span>{typedTitle}</span>   
                                <span className="inline-block font-bold animate-[pulse_1s_steps(2,start)_infinite]" >
                                    _
                                </span>                            
                            </h3>
                            <p className="text-xs text-white/50 mt-0.5">
                                For optimal experience, please grant the necessary permissions to access motion features.
                            </p>
                        </div>
                    </div>
                    <div className="bg-black/25 m-1 p-3 rounded-xl align-middle">
                        {children}
                        <button onClick={handleClose} className="popup-button-red flex items-center justify-center gap-2" > 
                            <Image src="/exit.svg" alt="Terminal Icon" width={24} height={24} priority />                       
                            <span>Exit Window</span>
                        </button>
                    </div>
                </div>
            </div>         
        </div>
    );
}