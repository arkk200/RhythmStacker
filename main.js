import './init.css';
import './css/style.css';

import gsap from 'gsap';
import * as THREE from 'three';
import { createOptionStack, getStack } from './src/utils/utils.js';
import musicListJSON from './dummyData/musicList.json';
import { MusicList } from './src/musicList';
import { Editor } from './src/editor';
import { Init } from './init';

export class Main extends Init {
    constructor() {
        super();
        this.step = 0;

        this.setMainObjects.bind(this)();
        this.setPages.bind(this)();
        this.setMainEvents.bind(this)();
    }
    setMainObjects() {
        this.stackForStart = getStack({ side: 5, height: 40 }, { color: "white", name: "Option", step: 1 }, [0, -24, 0])
        this.scene.add(this.stackForStart);

        this.stackToGoFamousMusics = createOptionStack({ color: "red", name: "FamousMusics", step: 2 }, [-5, -24, 3]);
        this.scene.add(this.stackToGoFamousMusics);

        this.stackToGoFavoriteMusics = createOptionStack({ color: "orange", name: "FavoriteMusics", step: 2 }, [1, -24, 4]);
        this.scene.add(this.stackToGoFavoriteMusics);

        this.stackToGoAllMusics = createOptionStack({ color: "yellow", name: "AllMusics", step: 2 }, [4, -24, 1]);
        this.scene.add(this.stackToGoAllMusics);

        this.stackToGoEditor = createOptionStack({ color: "green", name: "Editor", step: 2 }, [3, -24, -5]);
        this.scene.add(this.stackToGoEditor);

        this.stackForBack = getStack({ side: 1, height: 1 }, { color: "white", name: "Back" }, [-2, 7, 4])
        this.scene.add(this.stackForBack);

        this.optionStacks = [
            this.stackToGoFamousMusics,
            this.stackToGoFavoriteMusics,
            this.stackToGoAllMusics,
            this.stackToGoEditor
        ];
    }

    setPages() {
        this.editor = new Editor();
        this.musicList = new MusicList();
    }

    setMainEvents() {
        window.addEventListener("mousedown", this.onMouseDown.bind(this));
    }
    getIntersetObj(e) {
        const mousePos = {
            x: (e.clientX / window.innerWidth) * 2 - 1,
            y: -(e.clientY / window.innerHeight) * 2 + 1
        };
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mousePos, this.camera);
        return raycaster.intersectObjects(this.scene.children)[0]?.object;
    }
    onMouseDown(e) {
        if(this?.tl?.isActive()) return;
        const intersectObject = this.getIntersetObj.bind(this)(e);

        if(!intersectObject) return;
        if (intersectObject.name === "Back" && this.step > 0) {
            this.step--;
        } else {
            this.step = intersectObject.step;
        }

        let stackPositions;
        switch (this.step) { // Move a Camera and Stacks
            case 0:
                this.tl = gsap.timeline();
                this.tl.to(this.stackForStart.position, { x:0, z: 0, y: -24, duration: 1, ease: "power4.out", delay: 0.5 });
                this.tl.to(this.stackForStart.scale, { x:1, z:1, duration: 1, ease: "power4.out", delay: 0.5 }, "<-0.5");
                
                this.optionStacks.forEach((stack, index) => {
                    gsap.to(stack.position, { y: -24, duration: index*0.05 + 1, ease: "power4.out", delay: index*0.05 });
                    gsap.to(stack.scale, { x: 1, z: 1, duration: index*0.05 + 1, ease: "power4.out", delay: index*0.05 });
                });
                this.prevStep = intersectObject.step;
                this.prevPageName = intersectObject.name;
                break;

            case 1:
                if (this?.musicObjectsGroup) {
                    this.tl = gsap.timeline();
                    this.tl.to(this.musicObjectsGroup.position, { x: 1, duration: 1.2, ease: "power4.out" });
                    this.tl.to({}, { onUpdate: () => { this.scene.remove(this.musicObjectsGroup) } });
                    this.musicObjectsGroup = null;
                }
                if (this.prevPageName === "Editor") gsap.to(this.camera.position, { x: 32, y: 32, z: 32, duration: 1, ease: "sine.inOut", onUpdate: () => { this.camera.lookAt(0, 0, 0) } });
                else gsap.to(this.camera.position, { x: 32, z: 32, duration: 1, ease: "power4.out" });
                gsap.to(this.stackForStart.position, {x: -5, z: -5, y: -20, duration: 1, ease: "power4.out"}); gsap.to(this.stackForStart.scale, {x:0.5, z:0.5, duration: 1, ease: "power4.out"});

                stackPositions = [-5, 1, 4, 3];
                this.optionStacks.forEach((stack, index) => {
                    gsap.to(stack.position, { x: stackPositions[index], y: -10, z: stackPositions.at(-index -1), duration: index*0.05 + 1, ease: "power4.out", delay: index*0.05});
                    gsap.to(stack.scale, { x: 0.6, y: 1, z: 0.6, duration: index*0.05 + 1, ease: "power4.out", delay: index*0.05});
                });
                this.prevStep = intersectObject.step;
                this.prevPageName = intersectObject.name;
                break;

            case 2:
                if (intersectObject.name === "Editor") {
                    if (this?.musicObjectsGroup) {
                        this.tl = gsap.timeline();
                        this.tl.to(this.musicObjectsGroup.position, { x: 1, duration: 1, ease: "power4.out" });
                        this.tl.to({}, { onUpdate: () => { this.scene.remove(this.musicObjectsGroup) } });
                    }
                    this.tl = gsap.timeline();

                    if (this.prevStep === 2 && this.prevPageName !== "Editor") this.tl.to(this.camera.position, { x: 32, y: 32, z: 32, duration: 0.8, ease: "poewr4.out" });
                    this.tl.to(this.camera.position, { x: 0, y: 0, z: 32, duration: 1, ease: "power3.inOut", onUpdate: () => { this.camera.lookAt(0, 0, 0) } });

                    this.optionStacks.forEach((stack, index) => {
                        gsap.to(stack.position, {x: index*2 - 14, y: 8, z: 0, duration: 1.2, delay: index*0.05, ease: "power2.inOut"});
                        gsap.to(stack.scale, { x: 0.4, y: 0.3, z: 0.4, duration: 1.2, delay: index*0.05, ease: "power3.inOut"});
                    })
                } else {
                    if(this?.musicObjectsGroup) {
                        this.scene.remove(this.musicObjectsGroup);
                        this.musicObjectsGroup = null;
                    }
                    this.tl = gsap.timeline();
                    if (this.prevPageName === "Editor") this.tl.to(this.camera.position, { x: 32, y: 32, z: 32, duration: 0.8, ease: "power4.out", onUpdate: () => { this.camera.lookAt(0, 0, 0) } });
                    this.tl.to(this.camera.position, { x: 38, y: 32, z: 26, duration: 1.2, ease: "power3.inOut" });
                    
                    gsap.to(intersectObject.position, { x: 0, y: -6, z: 0, duration: 1, ease: "power4.out" });
                    gsap.to(intersectObject.scale, {x: 0.8, y: 1, z: 0.8, duration: 1, ease: "power4.out"});
                    
                    const filteredStacks = this.optionStacks.filter(stack => stack !== intersectObject);
                    
                    stackPositions = [0.5, 4, 5];
                    filteredStacks.forEach((stack, index) => {
                        gsap.to(stack.position, { x: stackPositions[index], y: -12, z: stackPositions.at(-index -1), duration: index*0.05 + 1.2, ease: "power3.out", delay: index*0.05 });
                        gsap.to(stack.scale, { x: 0.5, y: 1, z: 0.5, duration: index*0.05 + 1.2, ease: "power3.out", delay: index*0.05});
                    });
                }
                gsap.to(this.stackForStart.position, {y: -40, duration: 1.6, ease: "power4.out"});
                this.prevStep = intersectObject.step;
                this.prevPageName = intersectObject.name;
        }
        this.intersectTrigger.bind(this)(intersectObject.name);
    }
    intersectTrigger(optionStackName) {
        if(this.prevPageName !== "Editor") this.editor.removeObjects.bind(this)();
        switch(optionStackName) {
            case "FamousMusics":
            case "FavoriteMusics":
            case "AllMusics":
                this.musicList.setObjects.bind(this)(musicListJSON);
                break;
            case "Editor":
                this.editor.setObjects.bind(this)();
                break;
        }
    }
}

window.onload = () => {
    new Main();
}