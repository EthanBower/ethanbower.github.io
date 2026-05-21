export abstract class Animatable {
    private static animationsRegistry: Animatable[] = [];

    constructor() {
        Animatable.animationsRegistry.push(this);
    }

    public static animateAll() {
        this.animationsRegistry.forEach(animateable => {
            animateable.animateScene();
        });
    }

    abstract animateScene(): void;
}