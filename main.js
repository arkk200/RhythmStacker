import './style.css';

import gsap from 'gsap';
import * as THREE from 'three';
import { createOptionStack, getStack } from './src/utils/utils.js';
import musicList from './dummyData/musicList.json';

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
        this.stackForStart = getStack({ side: 5, height: 40 }, { color: "white", attribute: { name: "Option", step: 1 } }, [0, -24, 0])
        this.scene.add(this.stackForStart);

        this.stackToGoFamousSongs = createOptionStack("red", { name: "FamousSongs", step: 2 }, [-5, -22, 3]);
        this.scene.add(this.stackToGoFamousSongs);

        this.stackToGoFavoriteSongs = createOptionStack("orange", { name: "FavoriteSongs", step: 2 }, [1, -22, 4]);
        this.scene.add(this.stackToGoFavoriteSongs);

        this.stackToGoAllSongs = createOptionStack("yellow", { name: "AllSongs", step: 2 }, [4, -22, 1]);
        this.scene.add(this.stackToGoAllSongs);

        this.stackToGoEditor = createOptionStack("green", { name: "Editor", step: 2 }, [3, -22, -5]);
        this.scene.add(this.stackToGoEditor);

        this.stackForBack = getStack({ side: 1, height: 1 }, { color: "white", attribute: { name: "Back" } }, [9, 17, 11])
        this.scene.add(this.stackForBack);

        this.optionStacks = [
            this.stackToGoFamousSongs,
            this.stackToGoFavoriteSongs,
            this.stackToGoAllSongs,
            this.stackToGoEditor
        ]
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

        if (intersectObject.name === "Back" && this.step > 0) {
            this.step--;
        } else {
            this.step = intersectObject.step;
        }

        let stackPositions;

        switch (this.step) {
            case 0:
                gsap.to(this.stackForStart.position, { x:0, z: 0, y: -24, duration: 1, ease: "power4.out", delay: 0.5 }); gsap.to(this.stackForStart.scale, { x:1, z:1, duration: 1, ease: "power4.out", delay: 0.5 });
                this.optionStacks.forEach((stack, index) => {
                    gsap.to(stack.position, { y: -22, duration: index*0.05 + 1, ease: "power4.out", delay: index*0.05 + (index !== 0 ? 0.15 : 0) });
                    gsap.to(stack.scale, { x: 1, z: 1, duration: index*0.05 + 1, ease: "power4.out", delay: index*0.05 + (index !== 0 ? 0.15 : 0) });
                });
                break;
            case 1:
                gsap.to(this.camera.position, { x: 32, z: 32, duration: 1, ease: "power4.out" });
                gsap.to(this.stackForStart.position, {x: -5, z: -5, y: -20, duration: 1, ease: "power4.out"}); gsap.to(this.stackForStart.scale, {x:0.5, z:0.5, duration: 1, ease: "power4.out"});

                stackPositions = [-5, 1, 4, 3];
                this.optionStacks.forEach((stack, index) => {
                    gsap.to(stack.position, { x: stackPositions[index], y: -10, z: stackPositions.at(-index -1), duration: index*0.05 + 1, ease: "power4.out", delay: index*0.05 + 0.15});
                    gsap.to(stack.scale, { x: 0.6, z: 0.6, duration: index*0.05 + 1, ease: "power4.out", delay: index*0.05 + 0.2});
                });
                break;
            case 2:
                gsap.to(this.camera.position, { x: 38, z: 26, duration: 1, ease: "power4.out" });
                gsap.to(this.stackForStart.position, { y: -35, duration: 1, ease: "power4.out" });

                const clickedObject = this.scene.getObjectByName(intersectObject.name);
                gsap.to(clickedObject.position, { x: 0, y: -6, z: 0, duration: 1, ease: "power4.out" }); gsap.to(clickedObject.scale, {x: 0.8, z: 0.8, duration: 1, ease: "power4.out"});
                
                const filteredStacks = this.optionStacks.filter(stack => stack !== clickedObject);
                
                stackPositions = [0.5, 4, 5];
                filteredStacks.forEach((stack, index) => {
                    gsap.to(stack.position, { x: stackPositions[index], y: -12, z: stackPositions.at(-index -1), duration: index*0.05 + 1, ease: "power4.out", delay: index*0.05 });
                    gsap.to(stack.scale, { x: 0.5, z: 0.5, duration: index*0.05 + 1, ease: "power4.out", delay: index*0.05});
                });
        }
    }

    animate() {
        this.reqAnimate = window.requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}

window.onload = () => {
    new App();
}