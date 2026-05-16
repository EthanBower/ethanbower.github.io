import * as THREE from "three";

export class StarPage {
    private divRef: React.RefObject<HTMLDivElement | null>;
    private starScene: StarScene;
    private stars: Star[] = [];
    private background: Background;

    constructor(divRef: React.RefObject<HTMLDivElement | null>) {
        this.divRef = divRef;
        this.starScene = new StarScene(this.divRef);
        this.stars.push(new Star(this.starScene));
        this.background = new Background(this.starScene);
    }

    public init() {
        this.animate();
    }

    public dispose() {
        this.starScene.dispose();
    }

    private animate = () => {
        requestAnimationFrame(this.animate);
        this.starScene.render();
        this.background.render();
    }
}

export class Background {
    private geometry = new THREE.PlaneGeometry(2, 2);
    private uniforms = {
        u_time: { value: 0.1 },
        u_colorA: { value: new THREE.Color(0x000582) }, 
        u_colorB: { value: new THREE.Color(0x121212) }
    };
    private material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        // Pass positions directly through to create a static full-screen canvas backdrop
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                // Set Z to 1.0 to push it to the absolute back of the depth buffer
                gl_Position = vec4(position.xy, 1.0, 1.0);
            }
        `,
        // The Fragment Shader handles colors, blending, and animation math
        fragmentShader: `
            uniform float u_time;
            uniform vec3 u_colorA;
            uniform vec3 u_colorB;
            varying vec2 vUv;

            void main() {
                // Create moving sin/cos waves using screen space coordinates (UVs)
                float wave1 = sin(vUv.x * 3.0 + u_time * 0.8) * 0.5 + 0.5;
                float wave2 = cos(vUv.y * 2.5 - u_time * 0.6) * 0.5 + 0.5;
                
                // Mix the wave intensities together
                float mixFactor = (wave1 + wave2) / 2.0;
                
                // Smoothly blend the two base colors based on the moving waves
                vec3 finalColor = mix(u_colorA, u_colorB, mixFactor);
                
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `
    });
    private backgroundMesh = new THREE.Mesh(this.geometry, this.material);
    private clock = new THREE.Clock();
    private starScene: StarScene;

    constructor(scene: StarScene) {
        this.starScene = scene;
        this.starScene.addObject(this.backgroundMesh);
    }

    public render() {
        this.uniforms.u_time.value = this.clock.getElapsedTime() * 0.5; // Slow down time for a more subtle effect
    }
}

export class StarScene {
    private divRef: React.RefObject<HTMLDivElement | null>;
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;

    constructor(divRef: React.RefObject<HTMLDivElement | null>) {
        this.divRef = divRef;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);        
        this.camera.position.z = 20;

        this.divRef.current?.appendChild(this.renderer.domElement);
    }

    public render() {
        this.renderer.render(this.scene, this.camera);
    }

    public addObject(object: THREE.Mesh) {
        this.scene.add(object);
    }

    public dispose() {
        window.removeEventListener("resize", this.handleWindowResize);
        this.renderer.dispose();
        if (this.divRef.current) {
            this.divRef.current.removeChild(this.renderer.domElement);
        }
    }

    handleWindowResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

export class Star {
    private geometry: THREE.BufferGeometry;
    private material: THREE.MeshBasicMaterial
    private circle: THREE.Mesh;
    private velocity: THREE.Vector3;

    constructor(starScene: StarScene) {
        this.geometry = new THREE.CircleGeometry(1, 32); 
        this.material = new THREE.MeshBasicMaterial({ color: 0xffffff }); 
        this.circle = new THREE.Mesh(this.geometry, this.material);
        this.velocity = new THREE.Vector3(0.1, .4, 0);
        starScene.addObject(this.circle);
    }

    public move() {
        this.circle.position.x += 0.01; // Move right
    }

    public dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}