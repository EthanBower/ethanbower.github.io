import * as THREE from "three";
import * as SimplexNoise from "simplex-noise";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { AsteroidAnimation } from "./cameraAnimations/asteroidAnimation";
import { IntroAnimation } from "./cameraAnimations/introAnimation";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { Animatable } from "./abstracts/animatable";
import { Disposable } from "./abstracts/disposable";

export class SceneController {
    private static instance?: SceneController | null;
    public frontPage?: FrontPageAnimation;
    public ready: boolean = false;

    static getInstance(): SceneController {
        if (!SceneController.instance) {
            console.log("Creating instance");
            SceneController.instance = new SceneController();
        }
        return SceneController.instance;
    }

    public async init(canvasElm: HTMLDivElement): Promise<void> {
        this.frontPage = new FrontPageAnimation(canvasElm);
        await this.frontPage.loadAssets();
        this.ready = true;
    }

    public runAnimationLoop(): void {
        this.frontPage!.animatePage();
    }

    public initGyro(): void {
        this.frontPage!.eventListeners.enableGyroEventListener();
    }

    public moveCameraDownToHomePage(): void {
        this.frontPage!.mainCamera.introAnimation.isAnimating = true;
    }

    public async dispose(): Promise<void> {
        await this.frontPage!.dispose();
        SceneController.instance = null;
    }
}

class AnimationEventListeners extends Disposable {
    private frontPage: FrontPageAnimation;
    private rendererDom: HTMLCanvasElement;
    
    constructor(frontPage: FrontPageAnimation) {
        super();
        this.frontPage = frontPage;
        this.rendererDom = frontPage.frontPageRenderer.renderer.domElement;

        // Adds subtle camera tilt on scene
        this.rendererDom.addEventListener("mousemove", this.frontPage.mainCamera.setTargetRotation);
        this.rendererDom.addEventListener("mouseleave", this.frontPage.mainCamera.resetTargetRotation);

        // Resets the entire canvas rendering size on screen change
        window.addEventListener('resize', frontPage.canvas.updateCanvasSize);

        //Prevent the canvas from 'rubber banding' on scroll
        this.rendererDom.addEventListener("wheel", frontPage.frontPageRenderer.preventWheel, { passive: false });
        this.rendererDom.addEventListener("touchmove", frontPage.frontPageRenderer.preventTouch, { passive: false });
    
        // Get waves plane to resize on screen change
        window.addEventListener('resize', frontPage.wavesScene.updatePlaneOnWindowResize);

        // Get mouse to connect to dots
        this.rendererDom.addEventListener('mousemove', frontPage.dotScene.mouseDot.mouseMoveEvent);
        this.rendererDom.addEventListener('mouseleave', frontPage.dotScene.mouseDot.mouseLeaveEvent);
    }

    public enableGyroEventListener() {
        window.addEventListener("deviceorientation", this.frontPage.mainCamera.handleDeviceOrientation);
    }

    protected override onDispose(): void {
        this.rendererDom.removeEventListener("mousemove", this.frontPage.mainCamera.setTargetRotation);
        this.rendererDom.removeEventListener("mouseleave", this.frontPage.mainCamera.resetTargetRotation);
        window.removeEventListener("deviceorientation", this.frontPage.mainCamera.handleDeviceOrientation);

        window.removeEventListener('resize', this.frontPage.canvas.updateCanvasSize);

        this.rendererDom.removeEventListener("wheel", this.frontPage.frontPageRenderer.preventWheel);
        this.rendererDom.removeEventListener("touchmove", this.frontPage.frontPageRenderer.preventTouch);
        
        window.removeEventListener('resize', this.frontPage.wavesScene.updatePlaneOnWindowResize);

        this.rendererDom.removeEventListener('mousemove', this.frontPage.dotScene.mouseDot.mouseMoveEvent);
        this.rendererDom.removeEventListener('mouseleave', this.frontPage.dotScene.mouseDot.mouseLeaveEvent);
    }
}

class TimeTracker {
    public time!: number;
    public elapsedTime! :number;
    public deltaTime!: number;
    public lastFrameTime: number;

    constructor () {
        this.lastFrameTime = performance.now();
        this.updateTime();
    }

    public updateTime() {
        const perfNow = performance.now();

        // The 0.001 converts to seconds
        this.time = Date.now() * 0.001;
        this.elapsedTime = perfNow * 0.001;
        this.deltaTime = (perfNow - this.lastFrameTime) * 0.001;
        this.lastFrameTime = perfNow;
    }
}

export class FrontPageAnimation {
    public frontPageRenderer: FrontPageRenderer;
    public mainCamera: MainCamera;
    public canvas: Canvas;
    public frontPageScene: FrontPageSceneManager;
    public astroidScene: AstroidScene;
    public wavesScene: WavesScene;
    public dotScene: DotsScene;
    public eventListeners: AnimationEventListeners;
    private stats: Stats;
    private animationId?: number;

    public constructor(canvasElm: HTMLDivElement) {   
        this.frontPageScene = new FrontPageSceneManager();
        this.frontPageRenderer = new FrontPageRenderer(this);
        this.mainCamera = new MainCamera(canvasElm, this);
        this.canvas = new Canvas(canvasElm, this);
        this.astroidScene = new AstroidScene(this);
        this.wavesScene = new WavesScene(this);
        this.dotScene = new DotsScene(this);
        this.eventListeners = new AnimationEventListeners(this);
        this.stats = new Stats();

        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

        // todo - remove this and replace with button press
        this.frontPageRenderer.renderer.domElement.addEventListener("click", this.manageClick);
    }

    public loadAssets(): Promise<void> {
        return this.astroidScene.loadObjects();
    }

    public animatePage(): void {
        this.animationId = requestAnimationFrame(() => this.animatePage());

        globals.timeTracker!.updateTime();

        this.stats.begin();
        Animatable.updateAll();
        this.frontPageRenderer.render();
        this.stats.end();
    }

    public async dispose(): Promise<void> {
        cancelAnimationFrame(this.animationId!);

        this.frontPageRenderer.renderer.domElement.removeEventListener("click", this.manageClick);
        this.stats.dom.remove();

        Disposable.disposeAllInRegistry();
        Animatable.disposeAllInRegistry();
        this.frontPageRenderer.dispose();
    }

    private manageClick = () => {
        if (this.mainCamera.asteroidAnimation.cameraTargetZ == -150) {
            this.wavesScene.isAnimating = true;
            this.astroidScene.isAnimating = false;
            this.mainCamera.asteroidAnimation.startZoomOutAsteroid();
        } else {
            this.wavesScene.isAnimating = false;
            this.astroidScene.isAnimating = true;
            this.mainCamera.asteroidAnimation.startZoomIntoAsteroid();
        }
    }
}

class AstroidScene extends Animatable {
    public asteroidModel?: THREE.Group<THREE.Object3DEventMap>;
    private gltLoader: GLTFLoader;
    private frontPage: FrontPageAnimation;
    private lights: { rimLight: THREE.PointLight | null; fillLight: THREE.PointLight | null; } = {
        rimLight: null,
        fillLight: null
    };

    // todo - figure out how to dispose of this safely...
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
                    this.initLighting();
                    resolve();
                },
                undefined,
                (error) => {
                    reject(error);
                }
            );
        });
    }

    override update(): void {
        const time = globals.timeTracker!.time; 

        // Slow rotation (space drift feel)
        this.asteroidModel!.rotation.y += 0.002;
        this.asteroidModel!.rotation.x += 0.001;

        // Floating motion with gentle depth wobble
        this.asteroidModel!.position.y += Math.sin(time) * 0.003;
        this.asteroidModel!.position.x += Math.cos(time * 0.7) * 0.001;
        this.asteroidModel!.position.z += Math.sin(time * 0.5) * 0.0005;

        this.lights.rimLight!.intensity = Utils.calcFadeInFadeOut(100, 450, time);
        this.lights.fillLight!.intensity = Utils.calcFadeInFadeOut(150, 500, time);
    }

    override onDispose(): void {
        Object.values(this.lights).forEach((light) => {
            if (!light) return;
            Utils.disposeLight(light, this.frontPage.frontPageScene.scene);
        });

        if (this.asteroidModel) {
            Utils.disposeGLB2(this.asteroidModel, this.frontPage.frontPageScene.scene);
        }
    }

    private initLighting(): void {
        // Blue rim light
        this.lights.rimLight = new THREE.PointLight(0x66aaff, 450, 45, 1);
        this.lights.rimLight.position.set(11, 13, -180);

        // Warm fill light
        this.lights.fillLight = new THREE.PointLight(0xff8844, 5, 45, 2);
        this.lights.fillLight.position.set(0, 0, -150);

        this.frontPage.frontPageScene.astroidGroup.add(this.lights.rimLight);
        this.frontPage.frontPageScene.astroidGroup.add(this.lights.fillLight);
    }
}

class FrontPageSceneManager {
    public scene: THREE.Scene;
    public astroidGroup: THREE.Group;
    public wavesGroup: THREE.Group;
    public dotsGroup: THREE.Group;

    constructor() {
        this.scene = new THREE.Scene();
        this.astroidGroup = new THREE.Group();
        this.wavesGroup = new THREE.Group();
        this.dotsGroup = new THREE.Group();

        this.scene.fog = new THREE.FogExp2(globals.threeJsBackgroundColor, 0.009);
        this.scene.add(this.astroidGroup);
        this.scene.add(this.wavesGroup);
        this.scene.add(this.dotsGroup);
    }
}

class MainCamera extends Animatable {
    public camera: THREE.PerspectiveCamera;
    public asteroidAnimation: AsteroidAnimation;
    public introAnimation: IntroAnimation;
    public cameraRotation = {
        targetRotation: new THREE.Vector2(),
        currentRotation: new THREE.Vector2()
    };
    private renderSettings: { renderDistanceMin: number, renderDistanceMax: number } = {
        renderDistanceMin: 0.1,
        renderDistanceMax: 135
    };
    private mouse: THREE.Vector2 = new THREE.Vector2();
    private frontPage: FrontPageAnimation;
    private rendererDom: HTMLCanvasElement;

    constructor(canvasElm: HTMLDivElement, frontPage: FrontPageAnimation) {
        super();
        this.camera = new THREE.PerspectiveCamera(75, canvasElm.clientWidth/canvasElm!.clientHeight, this.renderSettings.renderDistanceMin, this.renderSettings.renderDistanceMax);
        this.asteroidAnimation = new AsteroidAnimation(frontPage);
        this.introAnimation = new IntroAnimation(frontPage);
        this.frontPage = frontPage;
        this.rendererDom = frontPage.frontPageRenderer.renderer.domElement;

        // Initial camera position
        this.camera.position.set(0, 80, 58);
    }

    override update(): void {
        this.cameraRotation.currentRotation.x += (this.cameraRotation.targetRotation.x - this.cameraRotation.currentRotation.x) * 0.05;
        this.cameraRotation.currentRotation.y += (this.cameraRotation.targetRotation.y - this.cameraRotation.currentRotation.y) * 0.05;

        this.camera.rotation.x = this.cameraRotation.currentRotation.x;
        this.camera.rotation.y = this.cameraRotation.currentRotation.y;
    }

    override onDispose(): void { }

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

    public handleDeviceOrientation = (event: DeviceOrientationEvent) => {
        const gamma = event.gamma ?? 0; // left/right tilt
        const beta = event.beta ?? 0;   // front/back tilt

        // Normalize values
        const normalizedGamma = THREE.MathUtils.clamp(gamma / 45, -1, 1);
        const normalizedBeta = THREE.MathUtils.clamp(beta / 45, -1, 1);

        // Apply subtle rotation
        this.cameraRotation.targetRotation.y = normalizedGamma * 0.12;
        this.cameraRotation.targetRotation.x = normalizedBeta * 0.12;
    };

    public setTargetRotation = (e: MouseEvent) => {
        const rect = this.frontPage.frontPageRenderer.renderer.domElement.getBoundingClientRect();

        // Normalized mouse coords (-1 to 1)
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

        // Subtle target rotation
        this.cameraRotation.targetRotation.y = -this.mouse.x * 0.09;
        this.cameraRotation.targetRotation.x = this.mouse.y * 0.05;
    }

    public resetTargetRotation = () => {
        this.mouse.x = 0;
        this.mouse.y = 0;

        this.cameraRotation.targetRotation.y = 0;
        this.cameraRotation.targetRotation.x = 0;
    }
}

class Canvas {
    public canvasElm: HTMLDivElement;
    public width!: number;
    public height!: number;
    private frontPage: FrontPageAnimation;

    public constructor(canvasElm: HTMLDivElement, frontPage: FrontPageAnimation) {
        this.frontPage = frontPage;
        this.canvasElm = canvasElm;
        this.canvasElm.appendChild(this.frontPage.frontPageRenderer.renderer.domElement);
        this.updateCanvasSize();
    }

    public updateCanvasSize = () => {
        this.width = this.canvasElm!.clientWidth; 
        this.height = this.canvasElm!.clientHeight; 

        this.frontPage.frontPageRenderer.resetRendererWindowSize(this.width, this.height);
        this.frontPage.mainCamera.resetCameraAspectRatio(this.width, this.height);
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
    public preventWheel = (e: WheelEvent) => e.preventDefault();
    public preventTouch = (e: TouchEvent) => e.preventDefault();
    private frontPage: FrontPageAnimation;
    
    constructor(frontPage: FrontPageAnimation,) {
        this.frontPage = frontPage;
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false});
        this.renderer.setClearColor(globals.threeJsBackgroundColor, 1);
    }

    public resetRendererWindowSize(width: number, height: number) {
        this.frontPage.frontPageRenderer.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    public render() {
        this.renderer.render(this.frontPage.frontPageScene.scene, this.frontPage.mainCamera.camera);
    }

    public dispose() {
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        this.renderer.domElement.remove();
        const gl = this.renderer.getContext();

            // 4. HARD context kill (this is what you're missing)
        if (gl) {
            const ext = gl.getExtension("WEBGL_lose_context");
            if (ext) {
                ext.loseContext();
            }
        }
    }
}

class DotsScene extends Animatable {
    private frontPage: FrontPageAnimation;
    private dotCount: number;
    private maxLineCount: number;
    private activeLineCount = 0;  
    private linePool: THREE.Line[] = [];
    public dots!: Array<Dot>;
    public mouseDot!: MouseDot;

    constructor(frontPage: FrontPageAnimation) {
        super();
        this.frontPage = frontPage;
        this.maxLineCount = 200;
        this.dotCount = 55;
        this.initDots();
        this.initLinePool();
        this.registerTick(20, () => { 
            this.resetLines();
            for(const dot of this.dots) {
                this.connectDotsWithLines(dot);
            }
            this.connectDotsWithLines(this.mouseDot);
        });
    }

    override update(): void {
        for(const dot of this.dots) {
            dot.updateDot(this.frontPage);
        }
        //Animate mouse dot if coords are provided
        this.mouseDot.updateDot(this.frontPage);
    }

    override onDispose(): void {
        for (const line of this.linePool) {
            Utils.disposeLine(line, this.frontPage.frontPageScene.scene);
        }
    }

    public connectDotsWithLines(dot: Dot): void {
        for(const dotToMaybeConnect of this.dots) {
            if (dot.id == dotToMaybeConnect.id) {
                continue;
            }

            const distanceSq = dot.dotMesh.position.distanceToSquared(dotToMaybeConnect.dotMesh.position);
            const maxDistanceSq = dot.connectableRadius * dot.connectableRadius;

            if (distanceSq > maxDistanceSq) {
                continue;
            }

            const line = this.linePool[this.activeLineCount];

            //If there is no line available in pool.
            if (!line) {
                continue;
            }

            this.activeLineCount++;
            line.visible = true;

            // Update line positions
            const positions = line.geometry.attributes.position.array as Float32Array;
            positions[0] = dot.dotMesh.position.x;
            positions[1] = dot.dotMesh.position.y;
            positions[2] = dot.dotMesh.position.z;
            positions[3] = dotToMaybeConnect.dotMesh.position.x;
            positions[4] = dotToMaybeConnect.dotMesh.position.y;
            positions[5] = dotToMaybeConnect.dotMesh.position.z;
            line.geometry.attributes.position.needsUpdate = true;

            // Update opacity
            const distanceAlpha = 1 - (Math.sqrt(distanceSq) / dot.connectableRadius);
            const dotOpacityAlpha = Math.min(dot.material.opacity, dotToMaybeConnect.material.opacity);

            (line.material as THREE.LineBasicMaterial).opacity = distanceAlpha * dotOpacityAlpha;
        };
    }

    private initLinePool(): void {
        for (let i = 0; i < this.maxLineCount; i++) {
            const positions = new Float32Array(6);
            const geometry = new THREE.BufferGeometry();
            const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, depthTest: true });
            const line = new THREE.Line(geometry, material);

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            line.frustumCulled = false;
            line.visible = false;
            this.linePool.push(line);
            this.frontPage.frontPageScene.dotsGroup.add(line);
        }
    }

    private initDots(): void {
        const cameraZ = this.frontPage.mainCamera.camera.position.z;
        this.dots = [];

        for (let i = 0; i < this.dotCount; i++) {
            const z = Utils.getRandomBetween(cameraZ - globals.dotSettings.dotCameraDistanceSettings.minZCameraDistance, cameraZ - globals.dotSettings.dotCameraDistanceSettings.maxZCameraDistance);
            const dims = this.frontPage.mainCamera.getVisibleDimensionsAtDepth(z);
            const dotPosition = new THREE.Vector3(
                Utils.getRandomBetween(-dims.halfWidth, dims.halfWidth),
                Utils.getRandomBetween(-dims.halfHeight, dims.halfHeight),
                z);
            const dot = new Dot(dotPosition, this.frontPage);

            this.dots.push(dot);
            this.frontPage.frontPageScene.dotsGroup.add(dot.dotMesh);
        }

        this.mouseDot = new MouseDot(this.frontPage);
        this.frontPage.frontPageScene.dotsGroup.add(this.mouseDot.dotMesh);
    }

    private resetLines(): void {
        this.activeLineCount = 0;
        for(const line of this.linePool) {
            line.visible = false;
        }
    }
}

class Dot extends Disposable {
    public dotRadius: number;
    public connectableRadius: number;
    public id: string;
    public dotMesh: THREE.Mesh;
    public velocity: THREE.Vector3;
    public material: THREE.MeshBasicMaterial;
    public spawnOpacityAlpha: number = 0;
    private tempVecs: { collisionVec: THREE.Vector3, collisionVec2: THREE.Vector3, testVec: THREE.Vector3, waveCollisionVec: THREE.Vector3 } = { 
        collisionVec: new THREE.Vector3(),
        collisionVec2: new THREE.Vector3(),
        testVec: new THREE.Vector3(),
        waveCollisionVec: new THREE.Vector3()
    };
    protected frontPage: FrontPageAnimation;

    constructor(dotPos: THREE.Vector3, frontPage: FrontPageAnimation) {
        super();
        this.dotRadius = 0.35;
        this.connectableRadius = 25;
        this.id = crypto.randomUUID();

        this.material = new THREE.MeshBasicMaterial({ color: globals.dotSettings.dotColorGradient.near, transparent: true, opacity: 0, fog: true });
        this.dotMesh = new THREE.Mesh(new THREE.CircleGeometry(this.dotRadius, 5), this.material);
        this.dotMesh.position.copy(dotPos);
        this.velocity = new THREE.Vector3(
            Utils.getRandomBetween(-0.05, 0.05, .007),
            Utils.getRandomBetween(-0.05, 0.05, .007),
            Utils.getRandomBetween(-0.03, 0.03, .004));
        this.frontPage = frontPage;
    }

    public updateDot(frontPage: FrontPageAnimation): void {
        this.runCollisionOpenSpace(frontPage);
        this.runDotDistanceGradient(frontPage);
        this.updateSpawnFadeIn();
    }

    public override onDispose(): void {
        Utils.disposeMesh(this.dotMesh, this.frontPage.frontPageScene.scene);
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
            this.recycle(frontPage, local, -globals.dotSettings.dotCameraDistanceSettings.minZCameraDistance, -globals.dotSettings.dotCameraDistanceSettings.maxZCameraDistance);
        }

        // Behind camera
        if (local.z > -globals.dotSettings.dotCameraDistanceSettings.minZCameraDistance) {
            this.recycle(frontPage, local, -globals.dotSettings.dotCameraDistanceSettings.minZCameraDistance, -globals.dotSettings.dotCameraDistanceSettings.maxZCameraDistance);
        }

        // Too far away
        if (local.z < -globals.dotSettings.dotCameraDistanceSettings.maxZCameraDistance) {
            this.recycle(frontPage, local, -globals.dotSettings.dotCameraDistanceSettings.minZCameraDistance, -globals.dotSettings.dotCameraDistanceSettings.maxZCameraDistance);
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

        this.material.color.lerpColors(globals.dotSettings.dotColorGradient.near, globals.dotSettings.dotColorGradient.far, t);
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
    }

    override update(): void {
        this.updatePlane();
        this.updateLights(this.lights.light1!, this.lights.light2!, this.lights.light3!, this.lights.light4!);
    }

    override onDispose(): void {
        Utils.disposeMesh(this.planeMesh, this.frontPage.frontPageScene.scene);
        Object.values(this.lights).forEach((light) => {
            if(!light) return;

            Utils.disposeLight(light, this.frontPage.frontPageScene.scene);
        });
    }

    public resolveDotCollision(dot: Dot) {
        const time = globals.timeTracker.time * 0.17;
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
            // Recompute velocity direction vs surface
            const velDot = dot.velocity.dot(normal);

            // Only reflect if moving into the surface
            if (velDot < 0) {
                dot.velocity.addScaledVector(normal, -2 * velDot);
                dot.velocity.multiplyScalar(0.98); // light damping only
            }
        }
    }

    public updatePlaneOnWindowResize = () => {
        Utils.disposeMesh(this.planeMesh, this.frontPage.frontPageScene.scene);
        this.initPlane();
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
        const segX = Math.min(Math.floor(vWidth / 2), 128);
        const segY = Math.min(Math.floor(vHeight / 2), 128);

        this.planeMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(vWidth, vHeight, segX, segY),
            new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide, fog: true })
        );
        this.planeMesh.rotation.x = -Math.PI / 2 - 0.2;
        this.planeMesh.position.y = -25;        
        
        this.frontPage.frontPageScene.wavesGroup.add(this.planeMesh);
    }

    private updatePlane(): void {
        const gArray: THREE.TypedArray = this.planeMesh.geometry.attributes.position.array;
        const time: number = globals.timeTracker.time * 0.17;

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

    private updateLights(... lights: THREE.PointLight[]): void {
        const time = globals.timeTracker.time;
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
    private cameraVector: THREE.Vector3;
    private mousePos: THREE.Vector3;
    private animateMouseDot: boolean = false;
    private zBuffer: number;
    private rendererDom: HTMLCanvasElement;

    constructor(frontPage: FrontPageAnimation, zBuffer = -70) {
        super(new THREE.Vector3(0 ,0, zBuffer), frontPage);
        this.zBuffer = zBuffer;
        this.connectableRadius = 35;
        (this.dotMesh.material as THREE.Material).opacity = 1;
        (this.dotMesh.material as THREE.Material).transparent = true;
        this.dotMesh.visible = false;
        this.cameraVector = new THREE.Vector3(); 
        this.mousePos = new THREE.Vector3();
        this.rendererDom = frontPage.frontPageRenderer.renderer.domElement;
    }

    public override updateDot(frontPage: FrontPageAnimation): void {
        if (this.animateMouseDot) {
            this.dotMesh.position.x = this.mousePos!.x;
            this.dotMesh.position.y = this.mousePos!.y;
            this.dotMesh.position.z = frontPage.mainCamera.camera.position.z + this.zBuffer;
        }
    }

    public mouseMoveEvent = (e: MouseEvent) => {
        this.animateMouseDot = true;
        this.cameraVector.set(
            (e.clientX / this.rendererDom.clientWidth) * 2 - 1,
            -(e.clientY / this.rendererDom.clientHeight) * 2 + 1,
            0);
        this.cameraVector.unproject(this.frontPage.mainCamera.camera);
        this.cameraVector.sub(this.frontPage.mainCamera.camera.position).normalize();

        const distance = (this.dotMesh.position.z - this.frontPage.mainCamera.camera.position.z) / this.cameraVector.z;
        this.mousePos!.copy(this.frontPage.mainCamera.camera.position).add(this.cameraVector.multiplyScalar(distance));
    }

    public mouseLeaveEvent = () => {
        this.animateMouseDot = false;
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

    public static calcFadeInFadeOut(min: number, max: number, time: number) {
        return min + (Math.sin(time * 0.5) * 0.5 + 0.5) * (max - min);
    }

    public static disposeLine(line: THREE.Line, scene: THREE.Scene) {
        scene.remove(line);
                    
        if (line.geometry) {
            line.geometry.dispose();
        }

        if (line.material) {
            if (Array.isArray(line.material)) {
                line.material.forEach(mat => mat.dispose());
            } else {
                line.material.dispose();
            }
        }
    }

    public static disposeLight(light: THREE.PointLight, scene: THREE.Scene) {
        scene.remove(light);
        light.dispose();
    }

    public static disposeGLB2(model: THREE.Group<THREE.Object3DEventMap>, scene: THREE.Scene) {
        model.traverse((node: any) => {
            if (node.isMesh) {
                node.geometry.dispose();

                if (node.material.isMaterial) {
                    this.disposeMaterial(node.material);
                } else if (Array.isArray(node.material)) {
                    node.material.forEach(this.disposeMaterial);
                }
            }
        });

        scene.remove(model);
    }

    public static disposeMesh(mesh: THREE.Mesh, scene: THREE.Scene) {
        scene.remove(mesh);

        if (mesh.geometry) {
            mesh.geometry.dispose();
        }

        if (mesh.material) {
            if (Array.isArray(mesh.material)) {
                mesh.material.forEach((mat) => Utils.disposeMaterial(mat));
                return;
            }

            Utils.disposeMaterial(mesh.material);
        }
    }

    public static disposeMaterial(material: THREE.Material) {
        material.dispose();

        const matAsRecord = material as unknown as Record<string, any>;

        for (const key in matAsRecord) {
            const property = matAsRecord[key];
            if (property && typeof property.dispose === 'function') {
                property.dispose();
            }
        }
    }
}

export const globals = {
    timeTracker: new TimeTracker(),
    threeJsBackgroundColor: 0x1a1a1a,
    dotSettings: {
        dotCameraDistanceSettings: {
            maxZCameraDistance : 130,
            minZCameraDistance : 30
        },
        dotColorGradient: {
            near: new THREE.Color(0xbdbdbd),
            far: new THREE.Color(0x084eff)
        }
    }
};