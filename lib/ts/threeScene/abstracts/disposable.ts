export abstract class Disposable {
    public isAnimating: boolean = true;
    private static disposableRegistry: Disposable[] = [];

    protected abstract onDispose(): void;

    constructor() {
        Disposable.disposableRegistry.push(this);
    }

    public dispose(): void {
        console.log(
            `%c SYSTEM %c [${this.constructor.name}] Cleaning up asset memory structures...`,
            "background: #dc2626; color: white; padding: 1px 4px; border-radius: 3px; font-weight: bold;",
            "color: #ef4444;"
        );

        // Run the custom child cleanup routine
        this.onDispose();
    }

    public static disposeAllInRegistry(): void {
        // Use a while loop to pull items out until the array is totally empty
        while (Disposable.disposableRegistry.length > 0) {
            const disposable = Disposable.disposableRegistry.pop();

            // Safety guard to ensure the item popped exists
            if (disposable) {
                disposable.dispose(); 
            }
        }
    }
}