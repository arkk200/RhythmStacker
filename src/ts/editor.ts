import * as THREE from 'three';
import { getStack } from './utils';

export class Editor {
    editorObjectsGroup: THREE.Group;
    baseStack: THREE.Mesh;
    scene: THREE.Scene;
    tl: GSAPTimeline;
    setObjects() {
        console.log('Set Editor Obj');
        this.editorObjectsGroup = new THREE.Group();
        this.editorObjectsGroup.name = "editorObjectGroup"
        // debugger;
        this.editorObjectsGroup.position.set(0, -8, 0);
        // debugger;
        this.baseStack = getStack({ side: 3, height: 1 }, { color: "red" }, [0, -6, 0]);
        // debugger;
        this.editorObjectsGroup.add(this.baseStack);
        // debugger;
        this.scene.add(this.editorObjectsGroup);
        // debugger;
        this.tl.to(this.editorObjectsGroup.position, { y: 0, duration: 1, ease: "power4.out" });
    }

    removeObjects() {
        if(!this.scene.getObjectByName("editorObjectGroup")) return; // editorObjectGroup이 존재하지 않으면 return
        this.editorObjectsGroup.remove(this.baseStack);
        this.scene.remove(this.editorObjectsGroup);
    }
}