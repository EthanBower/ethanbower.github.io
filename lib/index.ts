import * as THREE from "three";
import * as SimplexNoise from "simplex-noise";
import { Material, MaterialEventMap } from "three";

//#region Canvas Logic
export class FrontPageAnimation {
    public backgroundColor: number = 0x1a1a1a;
    public renderer: THREE.WebGLRenderer;
    public camera: THREE.PerspectiveCamera;
    public canvas: Canvas;
    public pointer: PointerObject;
    public dotScene: DotsScene;
    public wavesScene: WavesScene;

    private isLookingUp: boolean = false;
    private cameraAnimationStartTime: number = 0;

    public constructor(canvasElm: React.RefObject<HTMLDivElement | null>) {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.autoClear = false;
        this.renderer.setClearColor(this.backgroundColor, 1);

        this.camera = new THREE.PerspectiveCamera(75);
        this.camera.position.z = 58;

        this.canvas = new Canvas(canvasElm, this);
        this.wavesScene = new WavesScene(this);
        this.pointer = new PointerObject(this);
        this.dotScene = new DotsScene(this);
        canvasElm.current?.appendChild(this.renderer.domElement);

        this.renderer.domElement.addEventListener("click", () => {
            this.isLookingUp = true;
            this.cameraAnimationStartTime = Date.now();
        });
        this.animatePage();
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

    private lookup(): void {
        if (!this.isLookingUp) {
            return;
        }
        Dot.boundingBoxMode = false;
        const time = Date.now();
        const t = THREE.MathUtils.clamp((time - this.cameraAnimationStartTime) / 2000, 0, 1);
        // ease in/out
        const ease = t * t * (3 - 2 * t);
        // --- forward motion ---
        const startZ = 58;
        const endZ = 25;
        this.camera.position.z = THREE.MathUtils.lerp(startZ, endZ, ease);
        const lookTarget = new THREE.Vector3(0, 0, 0);
        // add upward offset in camera space
        lookTarget.y = THREE.MathUtils.lerp(0, 60, ease);
        // keep target in front of camera in world space
        lookTarget.z = this.camera.position.z - 80;
        this.camera.lookAt(lookTarget);
    }

    private animateCamera(): void {
        const time = Date.now() * 0.00015;
        this.camera.position.x = Math.sin(time) * 2;
        this.camera.position.y = Math.cos(time * 0.8) * 1.5;
        this.camera.lookAt(0, 0, -40);
    } 

    private animatePage(): void {
        requestAnimationFrame(() => this.animatePage());
        this.renderer.clear();
        this.lookup();
        //this.animateCamera();
        this.dotScene.animateScene();
        this.wavesScene.animateScene();
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
        this.updateCanvasSize(frontPage);
        window.addEventListener('resize', () => this.updateCanvasSize(frontPage), false);
    }

    public updateCanvasSize(frontPage: FrontPageAnimation): void {
        this.width = this.canvasElm!.current!.clientWidth; 
        this.height = this.canvasElm!.current!.clientHeight; 

        frontPage.renderer.setSize(this.width, this.height);
        frontPage.camera.aspect = this.width / this.height;
        frontPage.camera.updateProjectionMatrix();
    }

    public getViewableRectangle(distanceFromCamera: number): Array<number> {
        const verticalFOV = THREE.MathUtils.degToRad(this.frontPage.camera.fov); //Vertical FOV
        const vHeight = 2 * Math.tan(verticalFOV / 2) * Math.abs(distanceFromCamera); //Visible height, old 75
        const vWidth = vHeight * this.frontPage.camera.aspect; //Visible width
        return [vWidth, vHeight];
    }
}

class PointerObject {
    public pointerPosition?: THREE.Vector3 | null;
    private frontPage: FrontPageAnimation;
    private zPlane: number;
    private vector: THREE.Vector3;
    private pos: THREE.Vector3;

    constructor(frontPage: FrontPageAnimation, zPlane = -20) {
        this.zPlane = zPlane;
        this.frontPage = frontPage;
        this.vector = new THREE.Vector3(); 
        this.pos = new THREE.Vector3();

        frontPage.renderer.domElement.addEventListener('mousemove', (e: MouseEvent) => {
            this.calcPointerPosition(e);
        }, false);

        frontPage.renderer.domElement.addEventListener('mouseleave', () => {
            this.pointerPosition = null;
        }, false);
    }

    public hasPointerData(): boolean {
        if (this.pointerPosition?.x) {
            return true;
        }

        return false;
    }

    private calcPointerPosition(e: MouseEvent) {
        this.vector.set(
            (e.clientX / this.frontPage.renderer.domElement.clientWidth) * 2 - 1,
            -(e.clientY / this.frontPage.renderer.domElement.clientHeight) * 2 + 1,
            0);
        this.vector.unproject(this.frontPage.camera);
        this.vector.sub(this.frontPage.camera.position).normalize();

        const distance = (this.zPlane - this.frontPage.camera.position.z) / this.vector.z;
        this.pos.copy(this.frontPage.camera.position).add(this.vector.multiplyScalar(distance));
        this.pointerPosition = this.pos;
    }
}

class DotsScene {
    private frontPage: FrontPageAnimation;
    private scene: THREE.Scene;
    private dotCount: number;
    private dotLines!: Array<THREE.Line>;
    private dots!: Array<Dot>;
    private mouseDot!: Dot;

    constructor(frontPage: FrontPageAnimation) {
        this.frontPage = frontPage;
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(this.frontPage.backgroundColor, 0.009);
        this.dotCount = 55;
        this.initDots();
    }

    public animateScene(): void {
        this.clearLinesAndDots();
        for (let i = 0; i < this.dots.length; i++) {
            const dot = this.dots[i]!;
            dot.animateDot(this.frontPage);
            this.connectDotsWithLines(dot);
        }
        
        if (this.frontPage.pointer.hasPointerData()) {
            this.mouseDot.dotMesh.position.x = this.frontPage.pointer.pointerPosition!.x;
            this.mouseDot.dotMesh.position.y = this.frontPage.pointer.pointerPosition!.y;
            this.connectDotsWithLines(this.mouseDot);
        }

        this.frontPage.renderer.render(this.scene, this.frontPage.camera);
    }

    private initDots(): void {
        this.dotLines = [];
        this.dots = [];

        for (let i = 0; i < this.dotCount; i++) {
            const z = Utils.getRandomBetween(-45, 5);
            const dims = this.frontPage.getVisibleDimensionsAtDepth(z);
            const dot = new Dot(
                Utils.getRandomBetween(-dims.halfWidth, dims.halfWidth),
                Utils.getRandomBetween(-dims.halfHeight, dims.halfHeight),
                z);

            this.dots.push(dot);
            this.scene.add(dot.dotMesh);
        }

        this.mouseDot = new Dot(0, 0, -20);
        this.mouseDot.connectableRadius = 35;
        (this.mouseDot.dotMesh.material as THREE.Material).opacity = 0;
        (this.mouseDot.dotMesh.material as THREE.Material).transparent = true;
        this.scene.add(this.mouseDot.dotMesh);
    }

    private clearLinesAndDots(): void {
        for (let i = 0; i < this.dotLines!.length; i++) {
            const dotLine = this.dotLines![i];
            Utils.disposeObject(dotLine);
            this.scene.remove(dotLine);
        }

        this.dotLines!.length = 0;

        for (let i = 0; i < this.dots.length; i++) {
            const dot = this.dots[i]!;
            dot.connectedDots.length = 0;
        }
        this.mouseDot.connectedDots.length = 0;
    }

    private connectDotsWithLines(dot: Dot): void {
        for (let i = 0; i < this.dots.length; i++) {
            const dotToMaybeConnect = this.dots[i]!;

            if (dot.id == dotToMaybeConnect.id) {
                continue;
            }

            if (dot.dotIsConnected(dotToMaybeConnect)) {
                continue;
            }

            const distanceBetweenDots = dot.dotMesh.position.distanceTo(dotToMaybeConnect.dotMesh.position);

            if (distanceBetweenDots > dot.connectableRadius) {
                continue;
            }

            var line = dot.getLineBetweenDots(dotToMaybeConnect, distanceBetweenDots);
            dot.connectedDots.push(dotToMaybeConnect);
            dotToMaybeConnect.connectedDots.push(dot);
            this.dotLines!.push(line);
            this.scene.add(line);
        }
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
    private material: THREE.MeshBasicMaterial;

    constructor(x: number, y: number, z: number) {
        this.dotRadius = 0.35;
        this.connectableRadius = 27;
        this.connectedDots = [];
        this.id = crypto.randomUUID();

        const geometry = new THREE.CircleGeometry(this.dotRadius, 5);
        this.material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, fog: true });
        this.dotMesh = new THREE.Mesh(geometry, this.material);
        this.dotMesh.position.set(x, y, z);
        this.velocity = new THREE.Vector3(
            Utils.getRandomBetween(-0.06, 0.06, .007),
            Utils.getRandomBetween(-0.06, 0.06, .007),
            Utils.getRandomBetween(-0.03, 0.03, .004));
    }

    public animateDot(frontPage: FrontPageAnimation): void {
        this.runCollisionOpenSpace(frontPage);
        this.runDotDistanceGradient(frontPage);
    }

    public getLineBetweenDots(dotToConnect: Dot, distanceBetweenDots: number): any {
        const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 - (distanceBetweenDots / this.connectableRadius) });
        const points = [
            new THREE.Vector3(this.dotMesh.position.x, this.dotMesh.position.y, this.dotMesh.position.z), 
            new THREE.Vector3(dotToConnect.dotMesh.position.x, dotToConnect.dotMesh.position.y, dotToConnect.dotMesh.position.z)
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return new THREE.Line(geometry, material);
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
        const cam = frontPage.camera;
        this.dotMesh.position.add(this.velocity);

        // convert to camera space
        const local = this.dotMesh.position.clone().applyMatrix4(cam.matrixWorldInverse);
        const dims = frontPage.getVisibleDimensionsAtDepth(local.z);
        const halfW = dims.halfWidth;
        const halfH = dims.halfHeight;

        // wrap in CAMERA SPACE logic
        if (local.x > halfW) local.x = -halfW;
        if (local.x < -halfW) local.x = halfW;

        if (local.y > halfH) local.y = -halfH;
        if (local.y < -halfH) local.y = halfH;

        // Z recycling (in camera space)
        const MIN_Z = -20;
        const MAX_Z = -120;

        if (local.z > MIN_Z) local.z = MAX_Z;
        if (local.z < MAX_Z) local.z = MIN_Z;

        // convert back to world space
        this.dotMesh.position.copy(local).applyMatrix4(cam.matrixWorld);    
        frontPage.wavesScene.resolveDotCollision(this);
    }

    private runDotDistanceGradient(frontPage: FrontPageAnimation): void {
        const cameraZ = frontPage.camera.position.z;
        const distance = Math.abs(cameraZ - this.dotMesh.position.z);
        const t = THREE.MathUtils.clamp(THREE.MathUtils.mapLinear(distance, 30, 110, 0, 1), 0, 1);
        const nearColor = new THREE.Color(0xffffff);
        const farColor = new THREE.Color(0x084eff);

        this.material.color.lerpColors(nearColor, farColor, t);
    }
}

class WavesScene {
    private frontPage: FrontPageAnimation;
    private scene: THREE.Scene;
    private simplexNoise: SimplexNoise.NoiseFunction4D;
    private planeMesh!: THREE.Mesh;
    private light1!: THREE.PointLight;
    private light2!: THREE.PointLight;
    private light3!: THREE.PointLight;
    private light4!: THREE.PointLight;

    public constructor(frontPage: FrontPageAnimation) {
        this.frontPage = frontPage;
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(this.frontPage.backgroundColor, 0.009);
        this.simplexNoise = SimplexNoise.createNoise4D();
        this.initLighting();
        this.initPlane();
        window.addEventListener('resize', () => this.updatePlaneOnWindowResize(), false);
    }

    public animateScene(): void {
        this.animatePlane();
        this.animateLights();
        this.frontPage.renderer.render(this.scene, this.frontPage.camera);
    }

    public resolveDotCollision(dot: Dot) {
        const time = Date.now() * 0.00017;
        const pos = dot.dotMesh.position.clone();
        const nextPos = pos.clone().add(dot.velocity);
        // Convert world position into plane local space
        const localPos = this.planeMesh.worldToLocal(nextPos.clone());
        // Sample wave height in LOCAL plane coordinates
        const waveZ = this.getWaveHeight(localPos.x, localPos.y, time);
        // Distance from particle to wave surface
        const distToSurface = localPos.z - waveZ;
        // radius padding
        const radius = dot.dotRadius;

        // collision
        if (distToSurface <= radius) {
            // normal stays the same
            const eps = 0.1;
            const hL = this.getWaveHeight(localPos.x - eps, localPos.y, time);
            const hR = this.getWaveHeight(localPos.x + eps, localPos.y, time);
            const hD = this.getWaveHeight(localPos.x, localPos.y - eps, time);
            const hU = this.getWaveHeight(localPos.x, localPos.y + eps, time);
            const dx = (hR - hL) / (2 * eps);
            const dy = (hU - hD) / (2 * eps);

            const normal = new THREE.Vector3(-dx, -dy, 1).normalize();
            normal.transformDirection(this.planeMesh.matrixWorld);

            // Always fully push OUT of surface (not incremental)
            const penetration = (radius - distToSurface);
            dot.dotMesh.position.add(normal.clone().multiplyScalar(penetration + 0.001));
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
        this.light1 = new THREE.PointLight(0x0E09DC, lightIntensity, lightDistance, decay);
        this.light1.position.set(0, y, r);
        this.scene.add(this.light1);
        // Cyan
        this.light2 = new THREE.PointLight(0x8c2700, lightIntensity, lightDistance, decay);
        this.light2.position.set(0, -y, -r);
        this.scene.add(this.light2);
        // Red
        this.light3 = new THREE.PointLight(0x00786e, lightIntensity, lightDistance, decay);
        this.light3.position.set(r, y, 0);
        this.scene.add(this.light3);
        // Purple
        this.light4 = new THREE.PointLight(0xee3bcf, lightIntensity, lightDistance, decay);
        this.light4.position.set(-r, y, 0);
        this.scene.add(this.light4);
    }

    private initPlane(): void {
        const viewableDims = this.frontPage.canvas.getViewableRectangle(78);
        const vWidth = viewableDims[0]!, vHeight = viewableDims[1]!;

        this.planeMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(vWidth, vHeight, vWidth / 2, vHeight / 2),
            new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide, fog: true })
        );
        this.planeMesh.rotation.x = -Math.PI / 2 - 0.2;
        this.planeMesh.position.y = -25;        
        
        this.scene.add(this.planeMesh);
    }

    private updatePlaneOnWindowResize(): void {
        Utils.disposeObject(this.planeMesh);
        this.scene.remove(this.planeMesh);
        this.initPlane();
    }

    private animatePlane(): void {
        let gArray: THREE.TypedArray = this.planeMesh.geometry.attributes.position.array;
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

    private animateLights(): void {
        const time = Date.now() * 0.001;
        const d = 50;
        this.light1.position.x = Math.sin(time * 0.1) * d;
        this.light1.position.z = Math.cos(time * 0.2) * d;
        this.light2.position.x = Math.cos(time * 0.3) * d;
        this.light2.position.z = Math.sin(time * 0.4) * d;
        this.light3.position.x = Math.sin(time * 0.5) * d;
        this.light3.position.z = Math.sin(time * 0.6) * d;
        this.light4.position.x = Math.sin(time * 0.7) * d;
        this.light4.position.z = Math.cos(time * 0.8) * d;
    }
}

class Utils {
    public static getRandomBetween(min: number, max: number, buffer = 0): number {
        let val = Math.random() * (max - min) + min;

        if (buffer > 0) {
            while (Math.abs(val) < buffer) {
                val = Math.random() * (max - min) + min;
            }
        }

        return val;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static disposeObject(obj: any): void {
        if (!obj) return;

        const disposeMaterial = (mat: any) => {
            if (!mat) return;
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
            if (typeof mat.dispose === 'function') mat.dispose();
        };

        const disposeSingle = (o: any) => {
            if (!o) return;
            try {
                if (o.parent && typeof o.parent.remove === 'function') o.parent.remove(o);
            } catch (e) {}

            const visit = (child: any) => {
                if (!child) return;
                if (child.geometry && typeof child.geometry.dispose === 'function') {
                    child.geometry.dispose();
                }
                if (child.material) {
                    if (Array.isArray(child.material)) child.material.forEach(disposeMaterial);
                    else disposeMaterial(child.material);
                }
                if (child.texture && typeof child.texture.dispose === 'function') child.texture.dispose();
            };

            if (typeof o.traverse === 'function') {
                o.traverse((c: any) => visit(c));
            } else {
                visit(o);
            }
        };

        if (Array.isArray(obj)) obj.forEach(disposeSingle);
        else disposeSingle(obj);
    }
}
//#endregion