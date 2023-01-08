import './init.css';
import './css/style.css';

import gsap from 'gsap';
import * as THREE from 'three';

import { Init } from './init';
import { Editor } from './ts/editor';
import { MusicList } from './ts/musicList';
import { createOptionPartStack, getIntersectObject, getPartStack } from './ts/utils';
import { PartObject, VectorArray } from './type';
import musicListJSON from '../dummyData/musicList.json';

// export class Main extends
export class Main extends Init {
    step: number;
    stackForStart: THREE.Mesh;
    stackToGoFamousMusics: THREE.Mesh;
    stackToGoFavoriteMusics: THREE.Mesh;
    stackToGoAllMusics: THREE.Mesh;
    stackToGoEditor: THREE.Mesh;
    stackForBack: THREE.Mesh;
    editor: Editor;
    musicList: MusicList;
    current: { step?: number, part: string }
    prev: { step?: number, part: string }
    musicObjectsGroup!: THREE.Group;
    optionStacks: THREE.Mesh[];
    tl: GSAPTimeline;
    editorTl: GSAPTimeline;

    constructor() {
        super();
        this.step = 0;

        this.setMainObjects.bind(this)();
        this.setPages.bind(this)();
        this.setMainEvents.bind(this)();
    }

    setMainObjects() {
        this.stackForStart = getPartStack({ side: 5, height: 40 }, { color: "white", part: "Option", step: 1 }, [0, -24, 0])
        this.scene.add(this.stackForStart);
        this.stackToGoFamousMusics = createOptionPartStack({ color: "red", part: "FamousMusics", step: 2 }, [-5, -24, 3]);
        this.scene.add(this.stackToGoFamousMusics);

        this.stackToGoFavoriteMusics = createOptionPartStack({ color: "orange", part: "FavoriteMusics", step: 2 }, [1, -24, 4]);
        this.scene.add(this.stackToGoFavoriteMusics);

        this.stackToGoAllMusics = createOptionPartStack({ color: "yellow", part: "AllMusics", step: 2 }, [4, -24, 1]);
        this.scene.add(this.stackToGoAllMusics);

        this.stackToGoEditor = createOptionPartStack({ color: "green", part: "Editor", step: 2 }, [3, -24, -5]);
        this.scene.add(this.stackToGoEditor);

        this.stackForBack = getPartStack({ side: 1, height: 1 }, { color: "white", part: "Back" }, [-2, 7, 4])
        this.scene.add(this.stackForBack);

        this.optionStacks = [
            this.stackToGoFamousMusics,
            this.stackToGoFavoriteMusics,
            this.stackToGoAllMusics,
            this.stackToGoEditor
        ];
    }

    setPages() {
        this.editor = new Editor(this.scene, this.camera);
        this.musicList = new MusicList(this.scene, this.camera);
    }

    setMainEvents() {
        window.addEventListener("mousedown", this.onMouseDown.bind(this));
    }
    onMouseDown(e: MouseEvent) {
        if(this?.tl?.isActive() || this?.editorTl?.isActive()) return;
        const intersectObject: PartObject | undefined = getIntersectObject(e, this.scene, this.camera);

        if(!intersectObject || !intersectObject?.part) return;
        if (intersectObject.part === "Back" && this.step > 0) {
            this.step--;
        } else if (intersectObject?.step) {
            this.step = intersectObject.step;
        }

        let stackPositionsToMove: [number, number, number, number] | VectorArray;
        switch (this.step) { // Move a Camera and Stacks
            case 0:
                this.tl = gsap.timeline();
                this.tl.to(this.stackForStart.position, { x:0, z: 0, y: -24, duration: 1, ease: "power4.out", delay: 0.5 });
                this.tl.to(this.stackForStart.scale, { x:1, z:1, duration: 1, ease: "power4.out", delay: 0.5 }, "<-0.5");
                
                this.optionStacks.forEach((stack, index) => {
                    gsap.to(stack.position, { y: -24, duration: index*0.05 + 1, ease: "power4.out", delay: index*0.05 });
                    gsap.to(stack.scale, { x: 1, z: 1, duration: index*0.05 + 1, ease: "power4.out", delay: index*0.05 });
                });
                break;

            case 1:
                this.musicList.removePage(this.tl);
                if (this.prev?.part === "Editor") gsap.to(this.camera.position, { x: 32, y: 32, z: 32, duration: 1, ease: "sine.inOut", onUpdate: () => { this.camera.lookAt(0, 0, 0) } });
                else gsap.to(this.camera.position, { x: 32, z: 32, duration: 1, ease: "power4.out" });
                gsap.to(this.stackForStart.position, {x: -5, z: -5, y: -20, duration: 1, ease: "power4.out"}); gsap.to(this.stackForStart.scale, {x:0.5, z:0.5, duration: 1, ease: "power4.out"});

                stackPositionsToMove = [-5, 1, 4, 3];
                this.optionStacks.forEach((stack, index) => {
                    gsap.to(stack.position, { x: stackPositionsToMove[index], y: -10, z: stackPositionsToMove.at(-index -1), duration: index*0.05 + 1, ease: "power4.out", delay: index*0.05});
                    gsap.to(stack.scale, { x: 0.6, y: 1, z: 0.6, duration: index*0.05 + 1, ease: "power4.out", delay: index*0.05});
                });
                break;

            case 2:
                if (intersectObject.part === "Editor") {
                    this.musicList.removePage(this.tl);
                    this.tl = gsap.timeline();

                    if (this.prev.step === 2 && this.prev.part !== "Editor") this.tl.to(this.camera.position, { x: 32, y: 32, z: 32, duration: 0.8, ease: "poewr4.out" });
                    this.tl.to(this.camera.position, { x: 0, y: 0, z: 32, duration: 1, ease: "power3.inOut", onUpdate: () => { this.camera.lookAt(0, 0, 0) } });

                    this.optionStacks.forEach((stack, index) => {
                        gsap.to(stack.position, {x: index*2 - 14, y: 8, z: 0, duration: 1.2, delay: index*0.05, ease: "power2.inOut"});
                        gsap.to(stack.scale, { x: 0.4, y: 0.3, z: 0.4, duration: 1.2, delay: index*0.05, ease: "power3.inOut"});
                    })
                } else {
                    const musicObjectsGroup = this.scene.getObjectByName("musicObjectsGroup")
                    musicObjectsGroup && this.scene.remove(musicObjectsGroup);

                    this.tl = gsap.timeline();
                    if (this.prev.part === "Editor") this.tl.to(this.camera.position, { x: 32, y: 32, z: 32, duration: 0.8, ease: "power4.out", onUpdate: () => { this.camera.lookAt(0, 0, 0) } });
                    this.tl.to(this.camera.position, { x: 38, y: 32, z: 26, duration: 1.2, ease: "power3.inOut" });
                    
                    gsap.to(intersectObject.position, { x: 0, y: -6, z: 0, duration: 1, ease: "power4.out" });
                    gsap.to(intersectObject.scale, {x: 0.8, y: 1, z: 0.8, duration: 1, ease: "power4.out"});
                    
                    const filteredStacks = this.optionStacks.filter(stack => stack !== intersectObject);
                    
                    stackPositionsToMove = [0.5, 4, 5];
                    filteredStacks.forEach((stack, index) => {
                        gsap.to(stack.position, { x: stackPositionsToMove[index], y: -12, z: stackPositionsToMove.at(-index -1), duration: index*0.05 + 1.2, ease: "power3.out", delay: index*0.05 });
                        gsap.to(stack.scale, { x: 0.5, y: 1, z: 0.5, duration: index*0.05 + 1.2, ease: "power3.out", delay: index*0.05});
                    });
                }
                gsap.to(this.stackForStart.position, {y: -40, duration: 1.6, ease: "power4.out"});
        }
        if(this.step) this.current = { step: intersectObject.step, part: intersectObject.part }

        this.showPage.bind(this)(intersectObject.part);

        this.prev = { ...this.current }
    }
    showPage(optionStackName: string) {
        if(this.current.part !== "Editor" && this.prev?.part === "Editor") this.editor.removePage(this.editorTl);
        switch(optionStackName) {
            case "FamousMusics":
            case "FavoriteMusics":
            case "AllMusics":
                this.musicList.setPage(this.tl, musicListJSON);
                break;
            case "Editor":
                this.editor.setPage(this.tl);
                break;
        }
    }
}

window.onload = () => {
    new Main();
}