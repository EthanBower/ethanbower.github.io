"use client;";

import { FrontPageAnimation, globals, Utils } from "..";
import { Animatable } from "../abstracts/animatable";

export class IntroAnimation extends Animatable {
  public cameraStartPosition: number = 0;
  public cameraTargetY: number = 0;
  public distance: number = 0;
  private frontPage: FrontPageAnimation;

  constructor(frontPage: FrontPageAnimation) {
    super();
    this.isAnimating = false;
    this.frontPage = frontPage;
  }

  override update(): void {
    const camera = this.frontPage.mainCamera.camera;
    const traveled = Math.abs(camera.position.y - this.cameraStartPosition);
    const progress = this.distance === 0 ? 1 : traveled / this.distance;

    this.animationProgressCallback?.(Math.min(progress, 1));

    if (Utils.differentialBelow(this.cameraTargetY, camera.position.y, 0.1)) {
      camera.position.y = this.cameraTargetY;
      this.isAnimating = false;
      this.animationProgressCallback?.(1);
      this.resolveAnimationPromise();
      return;
    }

    camera.position.y +=
      (this.cameraTargetY - camera.position.y) *
      (2.4 * globals.timeTracker.deltaTime);
  }

  public startCameraIntro(
    onProgress?: (progress: number) => void,
  ): Promise<void> {
    const camera = this.frontPage.mainCamera.camera;
    const animationPromise = this.getAnimationPromise(onProgress);

    this.cameraStartPosition = camera.position.y;
    this.cameraTargetY = 0;
    this.distance = Math.abs(this.cameraTargetY - this.cameraStartPosition);
    this.isAnimating = true;

    return animationPromise;
  }

  protected override onDispose(): void {
    return;
  }
}
