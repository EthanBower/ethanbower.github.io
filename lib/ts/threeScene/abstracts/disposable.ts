"use client";

export abstract class Disposable {
    private static disposableRegistry = new Set<Disposable>();
    private disposed = false;

    protected abstract onDispose(): void;

    constructor() {
        Disposable.disposableRegistry.add(this);
    }

    public dispose(): void {
        if (this.disposed) {
            return;
        }

        this.disposed = true;

        Disposable.disposableRegistry.delete(this);

        console.log(
            `%c SYSTEM %c [${this.constructor.name}] Cleaning up asset memory structures...`,
            "background: #dc2626; color: white; padding: 1px 4px; border-radius: 3px; font-weight: bold;",
            "color: #ef4444;"
        );

        this.onDispose();
    }

    public static disposeAllInRegistry(): void {
        const disposables = Array.from(Disposable.disposableRegistry).reverse();

        for (const disposable of disposables) {
            disposable.dispose();
        }

        Disposable.disposableRegistry.clear();
    }
}