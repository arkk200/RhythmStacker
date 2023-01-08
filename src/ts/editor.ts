import gsap from 'gsap';
import * as THREE from 'three';
import { getStack } from './utils';

export class Editor {
    editorObjectsGroup: THREE.Group;
    baseStack: THREE.Mesh;

    setPage(scene: THREE.Scene, tl: GSAPTimeline) {
        const mapInfo = <HTMLDivElement>document.querySelector('.map-info');
        const stackEditor = <HTMLDivElement>document.querySelector('.stack-editor');
        gsap.to(mapInfo, { x: window.innerWidth / 3, duration: 1, ease: "power4.out" });
        gsap.to(stackEditor, { x: window.innerWidth / -3, duration: 1, ease: "power4.out" });

        this.editorObjectsGroup = new THREE.Group();
        this.editorObjectsGroup.name = "editorObjectGroup"
        // debugger;
        this.editorObjectsGroup.position.set(0, -8, 0);
        // debugger;
        this.baseStack = getStack({ side: 3, height: 1 }, { color: "red" }, [0, -6, 0]);
        // debugger;
        this.editorObjectsGroup.add(this.baseStack);
        // debugger;
        scene.add(this.editorObjectsGroup);
        // debugger;
        tl.to(this.editorObjectsGroup.position, { y: 0, duration: 1, ease: "power4.out" });
    }
    removePage(scene: THREE.Scene, editorTl: GSAPTimeline) {
        const mapInfo = <HTMLDivElement>document.querySelector('.map-info');
        const stackEditor = <HTMLDivElement>document.querySelector('.stack-editor');
        editorTl = gsap.timeline();
        editorTl.to(mapInfo, { x: window.innerWidth / -3, duration: 1.5, ease: "power2.out" });
        editorTl.to(stackEditor, { x: window.innerWidth / 3, duration: 1.5, ease: "power2.out" }, ">-1.5");

        if(!scene.getObjectByName("editorObjectGroup")) return; // editorObjectGroup이 존재하지 않으면 return
        this.editorObjectsGroup.remove(this.baseStack);
        scene.remove(this.editorObjectsGroup);
    }
}