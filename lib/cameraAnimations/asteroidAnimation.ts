import * as THREE from "three";
import { FrontPageAnimation, Utils } from "..";
import { Animatable } from "../animatable";

export class AsteroidAnimation extends Animatable {
    public cameraTargetZ: number = 0;
    public currentVelocity: number = 0;
    private frontPage: FrontPageAnimation;
    private lootTargetVec: THREE.Vector3 = new THREE.Vector3(); 

    constructor(frontPage: FrontPageAnimation) {
        super();
        this.isAnimating = false;
        this.frontPage = frontPage;
    }

    override update(): void {
        const asteroid = this.frontPage.astroidScene.asteroidModel!;
        const camera = this.frontPage.mainCamera.camera;

        if (Utils.differentialBelow(this.cameraTargetZ, camera.position.z, 0.1)) {
            camera.position.z = this.cameraTargetZ;
            this.isAnimating = false;
            return;
        }

        // Smooth zoom
        camera.position.z += (this.cameraTargetZ - camera.position.z) * 0.04;
        // Look slightly above asteroid center
        this.lootTargetVec.set(
            asteroid.position.x,
            asteroid.position.y + 1.5,
            asteroid.position.z
        );

        camera.lookAt(this.lootTargetVec);
    }

    public startZoomIntoAsteroid(): void {
        this.cameraTargetZ = -150;
        this.currentVelocity = 0;
        this.isAnimating = true;
    }
}