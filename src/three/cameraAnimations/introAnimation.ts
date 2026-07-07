"use client;";

import { FrontPageAnimation, Utils } from "..";
import { Animatable } from "../abstracts/animatable";
import { globalConfig } from "../globalConfig";

export class IntroAnimation extends Animatable {
  public cameraYStartPosition: number = 0;
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

    this.animationProgressCallback?.(
      this.calculate1DProgress(
        camera.position.y,
        this.cameraYStartPosition,
        this.distance,
      ),
    );

    if (Utils.differentialBelow(this.cameraTargetY, camera.position.y, 0.1)) {
      camera.position.y = this.cameraTargetY;
      this.isAnimating = false;
      this.animationProgressCallback?.(1);
      this.resolveAnimationPromise();
      return;
    }

    camera.position.y +=
      (this.cameraTargetY - camera.position.y) *
      (2.4 * globalConfig.timeTracker.deltaTime);
  }

  public startCameraIntro(
    onProgress?: (progress: number) => void,
  ): Promise<void> {
    const camera = this.frontPage.mainCamera.camera;
    const animationPromise = this.getAnimationPromise(onProgress);

    this.cameraYStartPosition = camera.position.y;
    this.cameraTargetY = 0;
    this.distance = Math.abs(this.cameraTargetY - this.cameraYStartPosition);
    this.isAnimating = true;

    return animationPromise;
  }

  protected override onDispose(): void {
    return;
  }
}
