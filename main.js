import './style.css';

import * as THREE from 'three';
import { createOptionStack, getStack } from './src/utils/utils.js';

class App {
    constructor() {
        this.step = 0;

        this.setInitialSettings.bind(this)();
        this.setLights.bind(this)();
        this.setObjects.bind(this)();
        this.setEvents.bind(this)();

        this.animate.bind(this)();
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
    }

    setLights() {
        this.obj = new THREE.Object3D();
        this.obj.position.set(0, 0, 0);
        this.scene.add(this.obj);

        this.light = new THREE.SpotLight(0xffffff, 1.1, 0, Math.PI / 4);
        // this.helper = new THREE.SpotLightHelper(this.light, 0xffffff);
        // this.scene.add(this.helper);
        this.light.position.set(60, 50, 40);
        this.light.target = this.obj;
        this.scene.add(this.light);
    }
    
    setObjects() {
        this.stackForStart = getStack({ side: 5, height: 40 }, { color: "white", name: { name: "Option", step: 1 } }, [0, -24, 0])
        this.scene.add(this.stackForStart);

        this.stackToGoFamousSongs = createOptionStack("red", { name: "FamousSongs", step: 2 }, [-4, -22, 3]);
        this.scene.add(this.stackToGoFamousSongs);

        this.stackToGoFavoriteSongs = createOptionStack("orange", { name: "FavoriteSongs", step: 2 }, [1, -22, 4]);
        this.scene.add(this.stackToGoFavoriteSongs);

        this.stackToGoAllSongs = createOptionStack("yellow", { name: "AllSongs", step: 2 }, [4, -22, 1]);
        this.scene.add(this.stackToGoAllSongs);

        this.stackToGoEditor = createOptionStack("green", { name: "Editor", step: 2 }, [3, -22, -4]);
        this.scene.add(this.stackToGoEditor);
    }

    setEvents() {
        window.addEventListener("resize", this.onResize.bind(this));
        window.addEventListener("mousedown", this.onMouseDown.bind(this));
    }
    onResize() {
        this.camera.left = window.innerWidth / -128;
        this.camera.right = window.innerWidth / 128;
        this.camera.top = window.innerHeight / 128;
        this.camera.bottom = window.innerHeight / -128;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    onMouseDown(e) {
        const mousePos = {
            x: (e.clientX / window.innerWidth) * 2 - 1,
            y: -(e.clientY / window.innerHeight) * 2 + 1
        };
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mousePos, this.camera);
        const intersectObject = raycaster.intersectObjects(this.scene.children)[0].object;
    }

    animate() {
        this.reqAnimate = window.requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}

window.onload = () => {
    new App();
}