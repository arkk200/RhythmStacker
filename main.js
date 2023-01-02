import './style.css';

import gsap from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createOptionStack, getStack } from './src/utils/utils.js';
import musicListJSON from './dummyData/musicList.json';

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
    
    setObjects() {
        this.stackForStart = getStack({ side: 5, height: 40 }, { color: "white", attribute: { name: "Option", step: 1 } }, [0, -24, 0])
        this.scene.add(this.stackForStart);

        this.stackToGoFamousMusics = createOptionStack("red", { name: "FamousMusics", step: 2 }, [-5, -24, 3]);
        this.scene.add(this.stackToGoFamousMusics);

        this.stackToGoFavoriteMusics = createOptionStack("orange", { name: "FavoriteMusics", step: 2 }, [1, -24, 4]);
        this.scene.add(this.stackToGoFavoriteMusics);

        this.stackToGoAllMusics = createOptionStack("yellow", { name: "AllMusics", step: 2 }, [4, -24, 1]);
        this.scene.add(this.stackToGoAllMusics);

        this.stackToGoEditor = createOptionStack("green", { name: "Editor", step: 2 }, [3, -24, -5]);
        this.scene.add(this.stackToGoEditor);

        this.stackForBack = getStack({ side: 1, height: 1 }, { color: "white", attribute: { name: "Back" } }, [0, 8, 2])
        this.scene.add(this.stackForBack);

        this.optionStacks = [
            this.stackToGoFamousMusics,
            this.stackToGoFavoriteMusics,
            this.stackToGoAllMusics,
            this.stackToGoEditor
        ];
    }

    setEvents() {
        window.addEventListener("resize", this.onResize.bind(this));
        window.addEventListener("mousedown", this.onMouseDown.bind(this));
        window.addEventListener("wheel", this.onScroll.bind(this));
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

        switch (this.step) { // Move a Camera and Stacks
            case 0:
                gsap.to(this.stackForStart.position, { x:0, z: 0, y: -24, duration: 1, ease: "power4.out", delay: 0.5 });
                gsap.to(this.stackForStart.scale, { x:1, z:1, duration: 1, ease: "power4.out", delay: 0.5 });
                
                this.optionStacks.forEach((stack, index) => {
                    gsap.to(stack.position, { y: -24, duration: index*0.05 + 1, ease: "power4.out", delay: index*0.05 });
                    gsap.to(stack.scale, { x: 1, z: 1, duration: index*0.05 + 1, ease: "power4.out", delay: index*0.05 });
                });
                break;

            case 1:
                if (this.prevPageName === "Editor") gsap.to(this.camera.position, { x: 32, y: 32, z: 32, duration: 0.8, ease: "power4.out", onUpdate: () => { this.camera.lookAt(0, 0, 0) } });
                else gsap.to(this.camera.position, { x: 32, z: 32, duration: 1, ease: "power4.out" });
                gsap.to(this.stackForStart.position, {x: -5, z: -5, y: -20, duration: 1, ease: "power4.out"}); gsap.to(this.stackForStart.scale, {x:0.5, z:0.5, duration: 1, ease: "power4.out"});

                stackPositions = [-5, 1, 4, 3];
                this.optionStacks.forEach((stack, index) => {
                    gsap.to(stack.position, { x: stackPositions[index], y: -10, z: stackPositions.at(-index -1), duration: index*0.05 + 1, ease: "power4.out", delay: index*0.05});
                    gsap.to(stack.scale, { x: 0.6, z: 0.6, duration: index*0.05 + 1, ease: "power4.out", delay: index*0.05});
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
                    this?.group && this.scene.remove(this.group);
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
                gsap.to(this.stackForStart.position, {y: -40, duration: 1.6, ease: "power4.out"});
                this.showPage.bind(this)(intersectObject.name);
        }
        this.prevStep = intersectObject.step;
        this.prevPageName = intersectObject.name;
    }
    showPage(optionStackName) {
        switch(optionStackName) {
            case "FamousMusics":
                this.createMusicsGroup.bind(this)(musicListJSON);
                break;
            case "FavoriteMusics":
                this.createMusicsGroup.bind(this)(musicListJSON);
                break;
            case "AllMusics":
                this.createMusicsGroup.bind(this)(musicListJSON);
                break;
            case "Editor":
                break;
        }
    }
    createMusicsGroup(json) {
        const musicList = json.musicList;
        this.group = new THREE.Group();
        musicList.forEach((music, index) => {
            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(10, 4, 1),
                new THREE.MeshPhongMaterial({ color: new THREE.Color(`hsl(${index * 10}, 100%, 50%)`) })
            );
            mesh.position.set(27, -index * 5, -12);
            this.group.add(mesh);
        });
        this.group.position.set(0, 0, 0);
        this.scene.add(this.group);
        this.tl.to({}, { onUpdate: () => {
            this.group.children.forEach((mesh, index) => {
                gsap.to(mesh.position, { x: 14, duration: 1.4, delay: index*0.1 + 0.5, ease: "power4.out" });
            });
        }}, ">-1.2");
    }

    onScroll(e) {
        const y = e.deltaY;
        this.group.position.y += y * 0.025;
    }

    animate() {
        this.reqAnimate = window.requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}

window.onload = () => {
    new App();
}