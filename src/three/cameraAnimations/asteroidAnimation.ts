"use client";

import { FrontPageAnimation, globals, Utils } from "..";
import { Animatable } from "../abstracts/animatable";

export class AsteroidAnimation extends Animatable {
  public cameraTargetZ: number = 0;
  private frontPage: FrontPageAnimation;

  constructor(frontPage: FrontPageAnimation) {
    super();
    this.isAnimating = false;
    this.frontPage = frontPage;
  }

  override update(): void {
    const camera = this.frontPage.mainCamera.camera;

    if (Utils.differentialBelow(this.cameraTargetZ, camera.position.z, 0.1)) {
      camera.position.z = this.cameraTargetZ;
      this.isAnimating = false;
      this.resolveAnimationPromise();

      return;
    }

    // Smooth zoom
    camera.position.z +=
      (this.cameraTargetZ - camera.position.z) *
      (2.4 * globals.timeTracker.deltaTime);
  }

  protected override onDispose(): void {
    return;
  }

  public startZoomIntoAsteroid(): Promise<void> {
    const animationPromise = this.getAnimationPromise();

    this.cameraTargetZ = -150;
    this.isAnimating = true;

    return animationPromise;
  }

  public startZoomOutAsteroid(): Promise<void> {
    const animationPromise = this.getAnimationPromise();

    this.cameraTargetZ = 58;
    this.isAnimating = true;

    return animationPromise;
  }
}
