import { FrontPageAnimation, Utils } from "..";
import { Animatable } from "../animatable";

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
            return;
        }

        // Smooth zoom
        camera.position.z += (this.cameraTargetZ - camera.position.z) * 0.04;
    }

    public startZoomIntoAsteroid(): void {
        this.cameraTargetZ = -150;
        this.isAnimating = true;
    }

    public startZoomOutAsteroid() : void {
        this.cameraTargetZ = 58;
        this.isAnimating = true;
    }
}