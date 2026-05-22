import * as THREE from "three";
import * as SimplexNoise from "simplex-noise";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { AsteroidAnimation } from "./cameraAnimations/asteroidAnimation";
import { IntroAnimation } from "./cameraAnimations/introAnimation";
import { Animatable } from "./animatable";
import Stats from "three/examples/jsm/libs/stats.module.js";

//#region Canvas Logic
export class FrontPageAnimation {
    public frontPageRenderer: FrontPageRenderer;
    public mainCamera: MainCamera;
    public canvas: Canvas;
    public frontPageScene: FrontPageSceneManager;
    public astroidScene: AstroidScene;
    public wavesScene: WavesScene;
    public dotScene: DotsScene;
    private stats: Stats;

    public constructor(canvasElm: React.RefObject<HTMLDivElement | null>) {   
        this.frontPageRenderer = new FrontPageRenderer(this);
        this.mainCamera = new MainCamera(canvasElm, this);
        this.canvas = new Canvas(canvasElm, this);
        this.frontPageScene = new FrontPageSceneManager();
        this.astroidScene = new AstroidScene(this);
        this.wavesScene = new WavesScene(this);
        this.dotScene = new DotsScene(this);
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

        window.addEventListener("click", () => {
            this.wavesScene.isAnimating = false;
            this.astroidScene.isAnimating = true;
            this.mainCamera.asteroidAnimation.startZoomIntoAsteroid();
        });
    }

    public loadAssets(): Promise<void> {
        return this.astroidScene.loadObjects();
    }

    public animatePage(): void {
        requestAnimationFrame(() => this.animatePage());

        this.stats.begin();

        Animatable.animateAll();
        this.frontPageRenderer.render();
        
        this.stats.end();
    }
}

class AstroidScene extends Animatable {
    public asteroidModel?: THREE.Group<THREE.Object3DEventMap>;
    private gltLoader: GLTFLoader;
    private frontPage: FrontPageAnimation;

    constructor(frontPage: FrontPageAnimation) {
        super();
        this.isAnimating = false;
        this.gltLoader = new GLTFLoader();
        this.frontPage = frontPage;
    }

    public loadObjects(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.gltLoader.load(
                "/asteroid.glb",
                (gltf) => {
                    this.asteroidModel = gltf.scene;
                    this.asteroidModel.position.set(0, 0, -180);
                    this.asteroidModel.scale.set(1, 1, 1);
                    this.frontPage.frontPageScene.astroidGroup.add(this.asteroidModel);
                    resolve();
                },
                undefined,
                (error) => {
                    console.error("GLB load error:", error);
                    reject(error);
                }
            );
        });
    }

    override animateScene(): void {
        const time = Date.now() * 0.001;

        // Slow rotation (space drift feel)
        this.asteroidModel!.rotation.y += 0.002;
        this.asteroidModel!.rotation.x += 0.001;

        // Floating motion
        this.asteroidModel!.position.y += Math.sin(time) * 0.002;
        this.asteroidModel!.position.x += Math.cos(time * 0.7) * 0.001;

        // Gentle depth wobble
        this.asteroidModel!.position.z += Math.sin(time * 0.5) * 0.0005;
    }
}

class FrontPageSceneManager {
    public static backgroundColor: number = 0x1a1a1a;
    public scene: THREE.Scene;
    public astroidGroup: THREE.Group;
    public wavesGroup: THREE.Group;
    public dotsGroup: THREE.Group;

    constructor() {
        this.scene = new THREE.Scene();
        this.astroidGroup = new THREE.Group();
        this.wavesGroup = new THREE.Group();
        this.dotsGroup = new THREE.Group();

        this.scene.fog = new THREE.FogExp2(FrontPageSceneManager.backgroundColor, 0.009);
        this.scene.add(this.astroidGroup);
        this.scene.add(this.wavesGroup);
        this.scene.add(this.dotsGroup);
    }
}

class MainCamera {
    public camera: THREE.PerspectiveCamera;
    public asteroidAnimation: AsteroidAnimation;
    public introAnimation: IntroAnimation;
    private readonly renderDistanceMin: number = 0.1;
    private readonly renderDistanceMax: number = 135;

    constructor(canvasElm: React.RefObject<HTMLDivElement | null>, frontPage: FrontPageAnimation) {
        this.camera = new THREE.PerspectiveCamera(75, canvasElm!.current!.clientWidth/canvasElm!.current!.clientHeight, this.renderDistanceMin, this.renderDistanceMax);
        this.asteroidAnimation = new AsteroidAnimation(frontPage);
        this.introAnimation = new IntroAnimation(frontPage);

        // Initial camera position
        this.camera.position.set(0, 30, 58);
    }

    public getVisibleDimensionsAtDepth(z: number) {
        const distance = Math.abs(this.camera.position.z - z);
        const verticalFOV = THREE.MathUtils.degToRad(this.camera.fov);
        const height = 2 * Math.tan(verticalFOV / 2) * distance;
        const width = height * this.camera.aspect;

        return {
            width,
            height,
            halfWidth: width / 2,
            halfHeight: height / 2
        };
    }

    public resetCameraAspectRatio(width: number, height: number) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }
}

class Canvas {
    public canvasElm: React.RefObject<HTMLDivElement | null>;
    public width!: number;
    public height!: number;
    private frontPage: FrontPageAnimation;

    public constructor(canvasElm: React.RefObject<HTMLDivElement | null>, frontPage: FrontPageAnimation) {
        this.frontPage = frontPage;
        this.canvasElm = canvasElm;
        this.canvasElm.current!.appendChild(this.frontPage.frontPageRenderer.renderer.domElement);
        this.updateCanvasSize(frontPage);
        window.addEventListener('resize', () => this.updateCanvasSize(frontPage), false);
    }

    public updateCanvasSize(frontPage: FrontPageAnimation): void {
        this.width = this.canvasElm!.current!.clientWidth; 
        this.height = this.canvasElm!.current!.clientHeight; 

        frontPage.frontPageRenderer.resetRendererWindowSize(this.width, this.height);
        frontPage.mainCamera.resetCameraAspectRatio(this.width, this.height);
    }

    public getViewableRectangle(distanceFromCamera: number): Array<number> {
        const verticalFOV = THREE.MathUtils.degToRad(this.frontPage.mainCamera.camera.fov); //Vertical FOV
        const vHeight = 2 * Math.tan(verticalFOV / 2) * Math.abs(distanceFromCamera); //Visible height, old 75
        const vWidth = vHeight * this.frontPage.mainCamera.camera.aspect; //Visible width
        return [vWidth, vHeight];
    }
}

class FrontPageRenderer {
    public renderer: THREE.WebGLRenderer;
    private frontPage: FrontPageAnimation;

    constructor(frontPage: FrontPageAnimation,) {
        this.frontPage = frontPage;
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false});
        this.renderer.setClearColor(FrontPageSceneManager.backgroundColor, 1);

        //Prevent the canvas from 'rubber banding' on scroll
        this.renderer.domElement.addEventListener("wheel", (e) => {
            e.preventDefault();
        }, { passive: false });

        this.renderer.domElement.addEventListener("touchmove", (e) => {
            e.preventDefault();
        }, { passive: false });
    }

    public resetRendererWindowSize(width: number, height: number) {
        this.frontPage.frontPageRenderer.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    public render() {
        this.renderer.render(this.frontPage.frontPageScene.scene, this.frontPage.mainCamera.camera);
    }
}

class DotsScene extends Animatable {
    private frontPage: FrontPageAnimation;
    private dotCount: number;
    private linePool: THREE.Line[] = [];
    private activeLineCount = 0;  
    private lastConnectionUpdate = 0;
    private readonly connectionUpdateInterval = 20;
    public dots!: Array<Dot>;
    private mouseDot!: MouseDot;

    constructor(frontPage: FrontPageAnimation) {
        super();
        this.frontPage = frontPage;
        this.dotCount = 55;
        this.initDots();
        this.initLinePool(200);
    }

    override animateScene(): void {
        this.dots.forEach(dot => {
            dot.animateDot(this.frontPage);
        });
        this.mouseDot.animateDot(this.frontPage);

        // ONLY update line connections occasionally
        const now = performance.now();

        if (now - this.lastConnectionUpdate >= this.connectionUpdateInterval) {
            this.lastConnectionUpdate = now;
            this.resetLines();

            this.dots.forEach(dot => {
                this.connectDotsWithLines(dot);
            });

            this.connectDotsWithLines(this.mouseDot);
        }
    }

    private initLinePool(maxLines: number): void {
        for (let i = 0; i < maxLines; i++) {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(6);

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, depthTest: false });
            const line = new THREE.Line(geometry, material);

            line.visible = false;
            this.linePool.push(line);
            this.frontPage.frontPageScene.dotsGroup.add(line);
        }
    }

    private initDots(): void {
        const cameraZ = this.frontPage.mainCamera.camera.position.z;
        this.dots = [];

        for (let i = 0; i < this.dotCount; i++) {
            const z = Utils.getRandomBetween(cameraZ - Dot.dotCameraDistanceSettings.minZCameraDistance, cameraZ - Dot.dotCameraDistanceSettings.maxZCameraDistance);
            const dims = this.frontPage.mainCamera.getVisibleDimensionsAtDepth(z);
            const dot = new Dot(
                Utils.getRandomBetween(-dims.halfWidth, dims.halfWidth),
                Utils.getRandomBetween(-dims.halfHeight, dims.halfHeight),
                z);

            this.dots.push(dot);
            this.frontPage.frontPageScene.dotsGroup.add(dot.dotMesh);
        }

        this.mouseDot = new MouseDot(this.frontPage);
        this.frontPage.frontPageScene.dotsGroup.add(this.mouseDot.dotMesh);
    }

    private resetLines(): void {
        this.activeLineCount = 0;

        this.linePool.forEach(line => {
            line.visible = false;
        });

        this.dots.forEach(dot => {
            dot.connectedDots.length = 0;
        });

        this.mouseDot.connectedDots.length = 0;
    }

    public connectDotsWithLines(dot: Dot): void {
        this.dots.forEach(dotToMaybeConnect => {
            if (dot.id == dotToMaybeConnect.id) {
                return;
            }

            if (dot.dotIsConnected(dotToMaybeConnect)) {
                return;
            }

            const distanceSq = dot.dotMesh.position.distanceToSquared(dotToMaybeConnect.dotMesh.position);
            const maxDistanceSq = dot.connectableRadius * dot.connectableRadius;

            if (distanceSq > maxDistanceSq) {
                return;
            }

            const line = this.linePool[this.activeLineCount];

            if (!line) {
                return;
            }

            this.activeLineCount++;
            line.visible = true;

            // UPDATE LINE POSITIONS
            const positions = line.geometry.attributes.position.array as Float32Array;
            positions[0] = dot.dotMesh.position.x;
            positions[1] = dot.dotMesh.position.y;
            positions[2] = dot.dotMesh.position.z;
            positions[3] = dotToMaybeConnect.dotMesh.position.x;
            positions[4] = dotToMaybeConnect.dotMesh.position.y;
            positions[5] = dotToMaybeConnect.dotMesh.position.z;
            line.geometry.attributes.position.needsUpdate = true;
            line.geometry.computeBoundingSphere();

            // UPDATE OPACITY
            const distanceAlpha = 1 - (Math.sqrt(distanceSq) / dot.connectableRadius);
            const dotOpacityAlpha = Math.min(dot.material.opacity, dotToMaybeConnect.material.opacity);

            (line.material as THREE.LineBasicMaterial).opacity = distanceAlpha * dotOpacityAlpha;
            dot.connectedDots.push(dotToMaybeConnect);
            dotToMaybeConnect.connectedDots.push(dot);
        });
    }
}

class Dot {
    public static boundingBoxMode = true;
    public dotRadius: number;
    public connectableRadius: number;
    public connectedDots: Array<Dot>;
    public id: string;
    public dotMesh: THREE.Mesh;
    public velocity: THREE.Vector3;
    public material: THREE.MeshBasicMaterial;
    public spawnOpacityAlpha = 0;
    public static dotCameraDistanceSettings: { maxZCameraDistance: number; minZCameraDistance: number } = {
        maxZCameraDistance : 130,
        minZCameraDistance : 30
    };
    private tempVecs: { collisionVec: THREE.Vector3, collisionVec2: THREE.Vector3, testVec: THREE.Vector3, waveCollisionVec: THREE.Vector3 } = { 
        collisionVec: new THREE.Vector3(),
        collisionVec2: new THREE.Vector3(),
        testVec: new THREE.Vector3(),
        waveCollisionVec: new THREE.Vector3()
    };
    private static dotColorGradient: { near: THREE.Color, far: THREE.Color } = {
        near: new THREE.Color(0xffffff),
        far: new THREE.Color(0x084eff)
    }

    constructor(x: number, y: number, z: number) {
        this.dotRadius = 0.35;
        this.connectableRadius = 25;
        this.connectedDots = [];
        this.id = crypto.randomUUID();

        this.material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, fog: true });
        this.dotMesh = new THREE.Mesh(new THREE.CircleGeometry(this.dotRadius, 5), this.material);
        this.dotMesh.position.set(x, y, z);
        this.velocity = new THREE.Vector3(
            Utils.getRandomBetween(-0.05, 0.05, .007),
            Utils.getRandomBetween(-0.05, 0.05, .007),
            Utils.getRandomBetween(-0.03, 0.03, .004));
    }

    public animateDot(frontPage: FrontPageAnimation): void {
        this.runCollisionOpenSpace(frontPage);
        this.runDotDistanceGradient(frontPage);
        this.updateSpawnFadeIn();
    }

    public dotIsConnected(dot: Dot): boolean {
        for (let i = 0; i < this.connectedDots.length; i++) {
            const connectedDot = this.connectedDots[i]!;
            if (dot.id == connectedDot.id) {
                return true;
            }
        }

        return false;
    }

    private runCollisionOpenSpace(frontPage: FrontPageAnimation): void {
        this.dotMesh.position.add(this.velocity);
        
        const cam = frontPage.mainCamera.camera;
        const local = this.tempVecs.collisionVec // Take dot position into camera space to check bounds and collisions
            .copy(this.dotMesh.position)
            .applyMatrix4(cam.matrixWorldInverse);
        const dims = frontPage.mainCamera.getVisibleDimensionsAtDepth(cam.position.z + local.z);
        const OUTSIDE_BUFFER = 5;
        const outsideX = (local.x > dims.halfWidth + OUTSIDE_BUFFER) || (local.x < -dims.halfWidth - OUTSIDE_BUFFER);
        const outsideY = (local.y > dims.halfHeight + OUTSIDE_BUFFER) || (local.y < -dims.halfHeight - OUTSIDE_BUFFER);

        // Outside screen
        if (outsideX || outsideY) {
            this.recycle(frontPage, local, -Dot.dotCameraDistanceSettings.minZCameraDistance, -Dot.dotCameraDistanceSettings.maxZCameraDistance);
        }

        // Behind camera
        if (local.z > -Dot.dotCameraDistanceSettings.minZCameraDistance) {
            this.recycle(frontPage, local, -Dot.dotCameraDistanceSettings.minZCameraDistance, -Dot.dotCameraDistanceSettings.maxZCameraDistance);
        }

        // Too far away
        if (local.z < -Dot.dotCameraDistanceSettings.maxZCameraDistance) {
            this.recycle(frontPage, local, -Dot.dotCameraDistanceSettings.minZCameraDistance, -Dot.dotCameraDistanceSettings.maxZCameraDistance);
        }

        // Apply collision response in world space
        this.dotMesh.position
            .copy(local)
            .applyMatrix4(cam.matrixWorld);

        frontPage.wavesScene.resolveDotCollision(this);
    }

    private recycle(frontPage: FrontPageAnimation, local: THREE.Vector3, minZ: number, maxZ: number): void {
        local.z = Utils.getRandomBetween(maxZ, minZ);

        const dims = frontPage.mainCamera.getVisibleDimensionsAtDepth(frontPage.mainCamera.camera.position.z + local.z);
        const spawn = this.getValidSpawnPosition(frontPage, new THREE.Vector3(dims.halfWidth, dims.halfHeight, local.z));
        local.copy(spawn);

        // Fresh motion
        this.velocity.set(
            Utils.getRandomBetween(-0.05, 0.05, 0.007),
            Utils.getRandomBetween(-0.05, 0.05, 0.007),
            Utils.getRandomBetween(-0.03, 0.03, 0.004)
        );

        this.material.opacity = 0;
        this.spawnOpacityAlpha = 0;
    }

    private getValidSpawnPosition(frontPage: FrontPageAnimation, local: THREE.Vector3, maxAttempts = 5): THREE.Vector3 {
        const dots = frontPage.dotScene.dots;
        const cam = frontPage.mainCamera.camera;
        const testVec = this.tempVecs.testVec;

        for (let i = 0; i < maxAttempts; i++) {
            testVec.set(
                Utils.getRandomBetween(-local.x, local.x),
                Utils.getRandomBetween(-local.y, local.y),
                local.z);

            let valid = true;

            for (let j = 0; j < dots.length; j++) {
                const other = dots[j];

                if (other.id === this.id) { 
                    continue;
                }

                const otherLocal = this.tempVecs.collisionVec2
                    .copy(other.dotMesh.position)
                    .applyMatrix4(cam.matrixWorldInverse);

                const minDistanceSq = 8 * 8;
                if (testVec.distanceToSquared(otherLocal) < minDistanceSq) {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                return testVec;
            }
        }

        return testVec.set(
            Utils.getRandomBetween(-local.x, local.x),
            Utils.getRandomBetween(-local.y, local.y),
            local.z
        );
    }

    private runDotDistanceGradient(frontPage: FrontPageAnimation): void {
        const cameraZ = frontPage.mainCamera.camera.position.z;
        const distance = Math.abs(cameraZ - this.dotMesh.position.z);
        const t = THREE.MathUtils.clamp(THREE.MathUtils.mapLinear(distance, 30, 110, 0, 1), 0, 1);

        this.material.color.lerpColors(Dot.dotColorGradient.near, Dot.dotColorGradient.far, t);
    }

    private updateSpawnFadeIn(): void {
        const speed = 0.03;
        const spawnTarget = 1;
        this.spawnOpacityAlpha += (spawnTarget - this.spawnOpacityAlpha) * speed;
        this.material.opacity = this.spawnOpacityAlpha;
    }
}

class WavesScene extends Animatable {
    private frontPage: FrontPageAnimation;
    private simplexNoise: SimplexNoise.NoiseFunction4D;
    private planeMesh!: THREE.Mesh;
    private lights: { light1: THREE.PointLight | null; light2: THREE.PointLight | null; light3: THREE.PointLight | null; light4: THREE.PointLight | null; } = {
        light1: null,
        light2: null,
        light3: null,
        light4: null
    };
    private tempVecs: { tempVec1: THREE.Vector3; tempVec2: THREE.Vector3; tempVec3: THREE.Vector3; tempNormalVec4: THREE.Vector3 } = { 
        tempVec1: new THREE.Vector3(),
        tempVec2: new THREE.Vector3(),
        tempVec3: new THREE.Vector3(),
        tempNormalVec4: new THREE.Vector3()
    };

    public constructor(frontPage: FrontPageAnimation) {
        super();
        this.frontPage = frontPage;
        this.simplexNoise = SimplexNoise.createNoise4D();
        this.initLighting();
        this.initPlane();
        window.addEventListener('resize', () => this.updatePlaneOnWindowResize(), false);
    }

    override animateScene(): void {
        this.animatePlane();
        this.animateLights(this.lights.light1!, this.lights.light2!, this.lights.light3!, this.lights.light4!);
    }

    public resolveDotCollision(dot: Dot) {
        const time = Date.now() * 0.00017;
        const nextPos = this.tempVecs.tempVec1
            .copy(dot.dotMesh.position)
            .add(dot.velocity);
        const localPos = this.tempVecs.tempVec2.copy(nextPos);
        this.planeMesh.worldToLocal(localPos);
        const waveZ = this.getWaveHeight(localPos.x, localPos.y, time); // Sample wave height in LOCAL plane coordinates
        const distToSurface = localPos.z - waveZ; // Distance from particle to wave surface
        const radius = dot.dotRadius; // Radius padding

        // If collision occurs (dot is within radius of surface), push dot out and reflect velocity
        if (distToSurface <= radius) {
            const eps = 0.1;
            const hL = this.getWaveHeight(localPos.x - eps, localPos.y, time);
            const hR = this.getWaveHeight(localPos.x + eps, localPos.y, time);
            const hD = this.getWaveHeight(localPos.x, localPos.y - eps, time);
            const hU = this.getWaveHeight(localPos.x, localPos.y + eps, time);
            const dx = (hR - hL) / (2 * eps);
            const dy = (hU - hD) / (2 * eps);
            const normal = this.tempVecs.tempNormalVec4
                .set(-dx, -dy, 1)
                .normalize();            
            normal.transformDirection(this.planeMesh.matrixWorld);

            // Always fully push OUT of surface (not incremental)
            const penetration = (radius - distToSurface);
            this.tempVecs.tempVec3
                .copy(normal)
                .multiplyScalar(penetration + 0.001);
            dot.dotMesh.position.add(this.tempVecs.tempVec3);
            // recompute velocity direction vs surface
            const velDot = dot.velocity.dot(normal);

            // only reflect if moving into the surface
            if (velDot < 0) {
                dot.velocity.addScaledVector(normal, -2 * velDot);
                dot.velocity.multiplyScalar(0.98); // light damping only
            }
        }
    }

    private initLighting(): void {
        const r: number = 30;
        const y: number = 10;
        const lightDistance: number = 500;
        const lightIntensity: number = 50;
        const decay: number = 1; 
        // Blue
        this.lights.light1 = new THREE.PointLight(0x0E09DC, lightIntensity, lightDistance, decay);
        this.lights.light1.position.set(0, y, r);
        this.frontPage.frontPageScene.wavesGroup.add(this.lights.light1);
        // Cyan
        this.lights.light2 = new THREE.PointLight(0x8c2700, lightIntensity, lightDistance, decay);
        this.lights.light2.position.set(0, -y, -r);
        this.frontPage.frontPageScene.wavesGroup.add(this.lights.light2);
        // Red
        this.lights.light3 = new THREE.PointLight(0x00786e, lightIntensity, lightDistance, decay);
        this.lights.light3.position.set(r, y, 0);
        this.frontPage.frontPageScene.wavesGroup.add(this.lights.light3);
        // Purple
        this.lights.light4 = new THREE.PointLight(0xee3bcf, lightIntensity, lightDistance, decay);
        this.lights.light4.position.set(-r, y, 0);
        this.frontPage.frontPageScene.wavesGroup.add(this.lights.light4);
    }

    private initPlane(): void {
        const oversizeMult = 1.8;
        const viewableDims = this.frontPage.canvas.getViewableRectangle(78);
        const vWidth = viewableDims[0]! * oversizeMult, vHeight = viewableDims[1]! * oversizeMult;

        this.planeMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(vWidth, vHeight, vWidth / 2, vHeight / 2),
            new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide, fog: true })
        );
        this.planeMesh.rotation.x = -Math.PI / 2 - 0.2;
        this.planeMesh.position.y = -25;        
        
        this.frontPage.frontPageScene.wavesGroup.add(this.planeMesh);
    }

    private updatePlaneOnWindowResize(): void {
        Utils.disposeObject(this.planeMesh);
        this.frontPage.frontPageScene.wavesGroup.remove(this.planeMesh);
        this.initPlane();
    }

    private animatePlane(): void {
        const gArray: THREE.TypedArray = this.planeMesh.geometry.attributes.position.array;
        const time: number = Date.now() * 0.00017;

        for (let i = 0; i < gArray.length; i += 3) {
          gArray[i + 2] = this.getWaveHeight(gArray[i], gArray[i + 1], time);
        }

        this.planeMesh.geometry.attributes.position.needsUpdate = true;
    }

    private getWaveHeight(x: number, y: number, time: number): number {
        const xyCoef = 50;
        const zCoef = 8;
        return this.simplexNoise(x / xyCoef, y / xyCoef, time, 0) * zCoef;
    }

    private animateLights(... lights: THREE.PointLight[]): void {
        const time = Date.now() * 0.001;
        const d = 50;
        let i = 0;
        for (const light of lights) {
            i += 0.1;
            light.position.x = Math.sin(time * i) * d;
            light.position.z = Math.cos(time * i) * d;
        }
    }
}

class MouseDot extends Dot {
    private frontPage: FrontPageAnimation;
    private cameraVector: THREE.Vector3;
    private mousePos: THREE.Vector3;
    private animateMouseDot: boolean = false;
    private zBuffer: number;

    constructor(frontPage: FrontPageAnimation, zBuffer = -70) {
        super(0, 0, zBuffer);
        this.zBuffer = zBuffer;
        this.connectableRadius = 35;
        (this.dotMesh.material as THREE.Material).opacity = 1;
        (this.dotMesh.material as THREE.Material).transparent = true;
        this.dotMesh.visible = false;

        this.frontPage = frontPage;
        this.cameraVector = new THREE.Vector3(); 
        this.mousePos = new THREE.Vector3();
        frontPage.frontPageRenderer.renderer.domElement.addEventListener('mousemove', (e: MouseEvent) => {
            this.animateMouseDot = true;
            this.calcPointerPosition(e);
        }, false);

        frontPage.frontPageRenderer.renderer.domElement.addEventListener('mouseleave', () => {
            this.animateMouseDot = false;
        }, false);
    }

    public override animateDot(frontPage: FrontPageAnimation): void {
        if (this.animateMouseDot) {
            this.dotMesh.position.x = this.mousePos!.x;
            this.dotMesh.position.y = this.mousePos!.y;
            this.dotMesh.position.z = frontPage.mainCamera.camera.position.z + this.zBuffer;
        }
    }

    private calcPointerPosition(e: MouseEvent) {
        this.cameraVector.set(
            (e.clientX / this.frontPage.frontPageRenderer.renderer.domElement.clientWidth) * 2 - 1,
            -(e.clientY / this.frontPage.frontPageRenderer.renderer.domElement.clientHeight) * 2 + 1,
            0);
        this.cameraVector.unproject(this.frontPage.mainCamera.camera);
        this.cameraVector.sub(this.frontPage.mainCamera.camera.position).normalize();

        const distance = (this.dotMesh.position.z - this.frontPage.mainCamera.camera.position.z) / this.cameraVector.z;
        this.mousePos!.copy(this.frontPage.mainCamera.camera.position).add(this.cameraVector.multiplyScalar(distance));
    }
}

export class Utils {
    public static getRandomBetween(min: number, max: number, buffer = 0): number {
        let val = Math.random() * (max - min) + min;

        if (buffer > 0) {
            while (Math.abs(val) < buffer) {
                val = Math.random() * (max - min) + min;
            }
        }

        return val;
    }

    public static differentialBelow(diff1: number, diff2: number, diffFactor: number): boolean {
        const diff = diff1 - diff2;

        if (Math.abs(diff) <= diffFactor) {
            return true;
        }

        return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static disposeObject(obj: any): void {
        if (!obj) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const disposeMaterial = (mat: any) => {
            if (!mat) {
                return;
            }

            const maps = [
                'map','lightMap','aoMap','emissiveMap','bumpMap','normalMap',
                'displacementMap','roughnessMap','metalnessMap','alphaMap'
            ];
            maps.forEach((k) => {
                if (mat[k] && typeof mat[k].dispose === 'function') {
                    mat[k].dispose();
                }
            });
            for (const key in mat) {
                const v = mat[key];
                if (v && typeof v.dispose === 'function' && !maps.includes(key)) {
                    v.dispose();
                }
            }

            if (typeof mat.dispose === 'function') {
                mat.dispose();
            }
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const disposeSingle = (o: any) => {
            if (!o) {
                return;
            }

            try {
                if (o.parent && typeof o.parent.remove === 'function') {
                    o.parent.remove(o);
                }
            } catch (e) {
                console.warn('Error removing object from parent, possibly already removed:', e);
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const visit = (child: any) => {
                if (!child) {
                    return;
                }

                if (child.geometry && typeof child.geometry.dispose === 'function') {
                    child.geometry.dispose();
                }

                if (child.material) {
                    if (Array.isArray(child.material)) child.material.forEach(disposeMaterial);
                    else disposeMaterial(child.material);
                }

                if (child.texture && typeof child.texture.dispose === 'function') {
                    child.texture.dispose();
                }
            };

            if (typeof o.traverse === 'function') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                o.traverse((c: any) => visit(c));
            } else {
                visit(o);
            }
        };

        if (Array.isArray(obj)) {
            obj.forEach(disposeSingle);
        }
        else {
            disposeSingle(obj);
        }
    }
}
//#endregion