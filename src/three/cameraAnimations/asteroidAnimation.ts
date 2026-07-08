"use client";

import { FrontPageAnimation, Utils } from "..";
import { Animatable } from "../abstracts/animatable";
import { globalConfig } from "../globalConfig";

export class AsteroidAnimation extends Animatable {
  public cameraStartZ: number = 0;
  public cameraTargetZ: number = 0;
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
        camera.position.z,
        this.cameraStartZ,
        this.distance,
      ),
    );

    if (Utils.differentialBelow(this.cameraTargetZ, camera.position.z, 0.1)) {
      camera.position.z = this.cameraTargetZ;
      this.isAnimating = false;
      this.animationProgressCallback?.(1);
      this.resolveAnimationPromise();

      return;
    }

    // Smooth zoom
    camera.position.z +=
      (this.cameraTargetZ - camera.position.z) *
      (2.4 * globalConfig.timeTracker.deltaTime);
  }

  protected override onDispose(): void {
    return;
  }

  public startZoomIntoAsteroid(
    onProgress?: (progress: number) => void,
  ): Promise<void> {
    const camera = this.frontPage.mainCamera.camera;
    const animationPromise = this.getAnimationPromise(onProgress);

    this.cameraStartZ = camera.position.z;
    this.cameraTargetZ = -150;
    this.distance = Math.abs(this.cameraTargetZ - this.cameraStartZ);
    this.isAnimating = true;

    return animationPromise;
  }

  public startZoomOutAsteroid(
    onProgress?: (progress: number) => void,
  ): Promise<void> {
    const camera = this.frontPage.mainCamera.camera;
    const animationPromise = this.getAnimationPromise(onProgress);

    this.cameraStartZ = camera.position.z;
    this.cameraTargetZ = 58;
    this.distance = Math.abs(this.cameraTargetZ - this.cameraStartZ);
    this.isAnimating = true;

    return animationPromise;
  }
}
