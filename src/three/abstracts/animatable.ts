"use client";

import { globalConfig } from "../globalConfig";
import { Disposable } from "./disposable";

type TickTask = {
  interval: number;
  lastRun: number;
  onTickExecution: () => void;
};

export abstract class Animatable extends Disposable {
  public isAnimating: boolean = true;
  private tickTasks: TickTask[] = [];
  private animationResolver: (() => void) | null = null;
  protected animationProgressCallback: ((p: number) => void) | null = null;
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

  protected resolveAnimationPromise(): void {
    this.animationResolver?.();
    this.animationResolver = null;
    this.animationProgressCallback = null;
  }

  protected getAnimationPromise(
    onProgress?: (progress: number) => void,
  ): Promise<void> {
    this.resolveAnimationPromise();
    this.animationProgressCallback = onProgress ?? null;

    return new Promise<void>((resolve) => {
      this.animationResolver = resolve;
    });
  }

  protected registerTick(interval: number, onTickExecution: () => void) {
    this.tickTasks.push({
      interval,
      lastRun: globalConfig.timeTracker.lastFrameTime,
      onTickExecution,
    });
  }

  protected calculate1DProgress(
    currentPos: number,
    startPos: number,
    distance: number,
  ) {
    const traveled = Math.abs(currentPos - startPos);
    return Math.min(distance === 0 ? 1 : traveled / distance, 1);
  }

  private runTicks(): void {
    const now = globalConfig.timeTracker.lastFrameTime;

    for (const tick of this.tickTasks) {
      if (now - tick.lastRun >= tick.interval) {
        tick.lastRun = now;
        tick.onTickExecution();
      }
    }
  }
}
