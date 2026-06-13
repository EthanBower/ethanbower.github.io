"use client";

import WarningWindow from "@/src/components/ui/warningWindow";

type globalErrorProps = {
    error: Error;
    reset: () => void;
}

export default function GlobalError({ error, reset, }: globalErrorProps) {
    return (
        <WarningWindow error={new Error("A critical error has occurred. Close this window to retry...", { cause: error })} enable={true} onClose={reset} />
    );
}