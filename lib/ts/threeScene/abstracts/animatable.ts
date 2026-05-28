"use client";

import { globals } from "..";
import { Disposable } from "./disposable";

type TickTask = {
    interval: number;
    lastRun: number;
    onTickExecution: () => void;
}

export abstract class Animatable extends Disposable {
    public isAnimating: boolean = true;
    private tickTasks: TickTask[] = [];
    private static animationsRegistry = new Set<Animatable>();

    protected abstract update(): void;

    constructor() {
        super();
        Animatable.animationsRegistry.add(this);
    }

    public static updateAll(): void {
        for (const animatable of this.animationsRegistry) {
            if (animatable.isAnimating) {
                animatable.update();
                animatable.runTicks();
            }
        }
    }

    public override dispose(): void {
        this.tickTasks.length = 0;
        Animatable.animationsRegistry.delete(this);
        super.dispose();
    }

    protected registerTick(interval: number, onTickExecution: () => void) {
        this.tickTasks.push({
            interval,
            lastRun: globals.timeTracker.lastFrameTime,
            onTickExecution
        });
    }

    private runTicks(): void {
        const now = globals.timeTracker.lastFrameTime;

        for (const tick of this.tickTasks) {
            if (now - tick.lastRun >= tick.interval) {
                tick.lastRun = now;
                tick.onTickExecution();
            }
        }
    }
}