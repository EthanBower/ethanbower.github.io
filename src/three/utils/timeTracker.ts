"use client";

export class TimeTracker {
  public elapsedTime!: number;
  public deltaTime!: number;
  public lastFrameTime: number;

  constructor() {
    this.lastFrameTime = performance.now();
    this.updateTime();
  }

  public updateTime() {
    const perfNow = performance.now();

    // The 0.001 converts to seconds
    this.elapsedTime = perfNow * 0.001;
    this.deltaTime = (perfNow - this.lastFrameTime) * 0.001;
    this.lastFrameTime = perfNow;
  }
}
