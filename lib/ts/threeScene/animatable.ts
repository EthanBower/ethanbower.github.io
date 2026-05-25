"use client";

import { FrontPageAnimation } from ".";


type TickTask = {
    interval: number;
    lastRun: number;
    onTickExecution: () => void;
}

export abstract class Animatable {
    public isAnimating: boolean = true;
    private tickTasks: TickTask[] = [];
    private static animationsRegistry: Animatable[] = [];

    protected abstract update(): void;

    constructor() {
        Animatable.animationsRegistry.push(this);
    }

    public static updateAll(): void {
        for(const animateable of this.animationsRegistry) {
            if (animateable.isAnimating) {
                animateable.update();
                animateable.runTicks();
            }
        }
    }

    protected registerTick(interval: number, onTickExecution: () => void) {
        this.tickTasks.push({ interval, lastRun: FrontPageAnimation.timeTracker.lastFrameTime, onTickExecution });
    }

    private runTicks(): void {
        const now = FrontPageAnimation.timeTracker.lastFrameTime;

        for (const tick of this.tickTasks) {
            if (now - tick.lastRun >= tick.interval) {
                tick.lastRun = now;
                tick.onTickExecution();
            }
        }
    }
}