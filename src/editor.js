import * as THREE from 'three';
import { getStack } from './utils/utils';

export class Editor {
    constructor() {
        
    }
    static setObjects() {
        this.editorObjectsGroup = new THREE.Group();
        const baseStack = getStack({ side: 3, height: 1 }, { color: "red" }, [0, -6, 0]);
        this.editorObjectsGroup.add(baseStack);
        this.scene.add(this.editorObjectsGroup);
    }

    static removeObjects() {

    }
}