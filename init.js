import * as THREE from 'three';

export class Init {
    constructor() {
        this.setInitialSettings.bind(this)();
        this.setLights.bind(this)();
        this.setEvents.bind(this)();
    }
    
    setInitialSettings() {
        this.scene = new THREE.Scene();
        this.scene.color = new THREE.Color(0, 0, 0);
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
        document.querySelector('#app').appendChild(this.renderer.domElement);
        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    setLights() {
        this.obj = new THREE.Object3D();
        this.obj.position.set(0, 0, 0);
        this.scene.add(this.obj);

        this.light = new THREE.SpotLight(0xffffff, 1.1, 0, Math.PI / 4);
        this.light.position.set(60, 50, 40);
        this.light.target = this.obj;
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
}

export const initInstance = new Init();
console.log(initInstance);