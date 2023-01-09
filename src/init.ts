import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { loopArray } from './type';

export class Init {
    scene!: THREE.Scene;
    camera!: THREE.OrthographicCamera;
    renderer!: THREE.WebGLRenderer;
    controls!: OrbitControls;
    lightTarget!: THREE.Object3D<THREE.Event>;
    light!: THREE.SpotLight;
    loopArray: loopArray;
    clock: THREE.Clock;
    delta: number;
    
    constructor() {
        this.setInitialSettings.bind(this)();
        this.setLights.bind(this)();
        this.setEvents.bind(this)();

        this.clock = new THREE.Clock();
        this.delta = 0;
        this.loopArray = [];

        this.animate.bind(this)();
    }

    setInitialSettings() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0, 0, 0);
        this.camera = new THREE.OrthographicCamera(
            window.innerWidth / -128,
            window.innerWidth / 128,
            window.innerHeight / 128,
            window.innerHeight / -128,
            0.1,
            1000
        );
        this.camera.position.set(32, 32, 32);
        this.camera.lookAt(0, 0, 0);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.querySelector('#app')!.appendChild(this.renderer.domElement);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    setLights() {
        this.lightTarget = new THREE.Object3D();
        this.lightTarget.position.set(0, 0, 0);

        this.light = new THREE.SpotLight(0xffffff, 1.1, 0, Math.PI / 4);
        this.light.position.set(60, 50, 40);
        this.light.target = this.lightTarget;
        this.scene.add(this.light);
    }

    setEvents() {
        window.addEventListener("resize", this.onResize.bind(this));
    }
    onResize() {
        this.camera.left = window.innerWidth / -128;
        this.camera.right = window.innerWidth / 128;
        this.camera.top = window.innerHeight / 128;
        this.camera.bottom = window.innerHeight / -128;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
        this.delta = this.clock.getDelta();
        this.loopArray.forEach(loop => loop(this.delta));
    }
}

export const initInstance = new Init();
console.log(initInstance);