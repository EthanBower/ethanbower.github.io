"use client;"

import { FrontPageAnimation, Utils } from "..";
import { Animatable } from "../animatable";

export class IntroAnimation extends Animatable {
    public cameraTargetY: number = 0;
    private frontPage: FrontPageAnimation;

    constructor(frontPage: FrontPageAnimation) {
        super();
        this.isAnimating = false;
        this.frontPage = frontPage;
    }

    override update(): void {
        const camera = this.frontPage.mainCamera.camera;

        if (Utils.differentialBelow(this.cameraTargetY, camera.position.y, 0.1)) {
            camera.position.y = this.cameraTargetY;
            this.isAnimating = false;
            return;
        }

        camera.position.y += (this.cameraTargetY - camera.position.y) * 0.04;
    }
}