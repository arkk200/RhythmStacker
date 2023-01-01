import './style.css';

import gsap from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
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
        this.light.position.set(60, 50, 40);
        this.light.target = this.obj;
        this.scene.add(this.light);
    }
    
    setObjects() {
        this.stackForStart = getStack({ side: 5, height: 40 }, { color: "white", attribute: { name: "Option", step: 1 } }, [0, -24, 0])
        this.scene.add(this.stackForStart);

        this.stackToGoFamousSongs = createOptionStack("red", { name: "FamousSongs", step: 2 }, [-5, -24, 3]);
        this.scene.add(this.stackToGoFamousSongs);

        this.stackToGoFavoriteSongs = createOptionStack("orange", { name: "FavoriteSongs", step: 2 }, [1, -24, 4]);
        this.scene.add(this.stackToGoFavoriteSongs);

        this.stackToGoAllSongs = createOptionStack("yellow", { name: "AllSongs", step: 2 }, [4, -24, 1]);
        this.scene.add(this.stackToGoAllSongs);

        this.stackToGoEditor = createOptionStack("green", { name: "Editor", step: 2 }, [3, -24, -5]);
        this.scene.add(this.stackToGoEditor);

        this.stackForBack = getStack({ side: 1, height: 1 }, { color: "white", attribute: { name: "Back" } }, [0, 8, 2])
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
        if(this?.tl?.isActive()) return;
        const mousePos = {
            x: (e.clientX / window.innerWidth) * 2 - 1,
            y: -(e.clientY / window.innerHeight) * 2 + 1
        };
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mousePos, this.camera);
        const intersectObject = raycaster.intersectObjects(this.scene.children)[0]?.object;
        if(!intersectObject) return;
        if (intersectObject.name === "Back" && this.step > 0) {
            this.step--;
        } else {
            this.step = intersectObject.step;
        }

        let stackPositions;

        switch (this.step) {
            case 0:
                gsap.to(this.stackForStart.position, { x:0, z: 0, y: -24, duration: 1, ease: "power4.out", delay: 0.5 });
                gsap.to(this.stackForStart.scale, { x:1, z:1, duration: 1, ease: "power4.out", delay: 0.5 });
                
                this.optionStacks.forEach((stack, index) => {
                    gsap.to(stack.position, { y: -24, duration: index*0.05 + 1, ease: "power4.out", delay: index*0.05 });
                    gsap.to(stack.scale, { x: 1, z: 1, duration: index*0.05 + 1, ease: "power4.out", delay: index*0.05 });
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
                if (intersectObject.name === "Editor") {
                    this.tl = gsap.timeline();

                    if (this.prevStep === 2 && this.prevPageName !== "Editor") this.tl.to(this.camera.position, { x: 32, y: 32, z: 32, duration: 0.8, ease: "poewr4.out" });
                    this.tl.to(this.camera.position, { x: 0, y: 0, z: 32, duration: 1, ease: "power3.inOut", onUpdate: () => { this.camera.lookAt(0, 0, 0) } });

                    this.optionStacks.forEach((stack, index) => {
                        gsap.to(stack.position, {x: index*2 - 13, y: 0, z: 0, duration: 1.2, delay: index*0.05, ease: "power1.inOut"});
                        gsap.to(stack.scale, { x: 0.4, z: 0.4, duration: 1.2, delay: index*0.05, ease: "power1.inOut"});
                    })
                } else {
                    this.tl = gsap.timeline();
                    if (this.prevPageName === "Editor") this.tl.to(this.camera.position, { x: 32, y: 32, z: 32, duration: 0.8, ease: "power4.out", onUpdate: () => { this.camera.lookAt(0, 0, 0) } });
                    this.tl.to(this.camera.position, { x: 38, y: 32, z: 26, duration: 1.2, ease: "power3.inOut" });
                    
                    gsap.to(intersectObject.position, { x: 0, y: -6, z: 0, duration: 1, ease: "power4.out" });
                    gsap.to(intersectObject.scale, {x: 0.8, z: 0.8, duration: 1, ease: "power4.out"});
                    
                    const filteredStacks = this.optionStacks.filter(stack => stack !== intersectObject);
                    
                    stackPositions = [0.5, 4, 5];
                    filteredStacks.forEach((stack, index) => {
                        gsap.to(stack.position, { x: stackPositions[index], y: -12, z: stackPositions.at(-index -1), duration: index*0.05 + 1, ease: "power4.out", delay: index*0.05 });
                        gsap.to(stack.scale, { x: 0.5, z: 0.5, duration: index*0.05 + 1, ease: "power4.out", delay: index*0.05});
                    });
                }
                gsap.to(this.stackForStart.position, {y: -35, duration: 1.2, ease: "power4.out"});
                this.showPage(intersectObject.name);
        }
        this.prevStep = intersectObject.step;
        this.prevPageName = intersectObject.name;
        console.log(this.prevStep);
    }
    showPage(optionStackName) {
        switch(optionStackName) {
            case "FamousSongs":
                break;
            case "FavoriteSongs":
                break;
            case "AllSongs":
                break;
            case "Editor":
                break;
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