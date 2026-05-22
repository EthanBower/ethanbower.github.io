export abstract class Animatable {
    public isAnimating: boolean = true;
    private static animationsRegistry: Animatable[] = [];

    constructor() {
        Animatable.animationsRegistry.push(this);
    }

    public static animateAll(): void {
        for(const animateable of this.animationsRegistry) {
            if (animateable.isAnimating) {
                animateable.animateScene();
            }
        }
    }

    abstract animateScene(): void;
}