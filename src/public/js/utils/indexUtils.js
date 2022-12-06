import { moveObj, rotateObj } from './utils.js';
import * as THREE from '/build/three.module.js';

export class GoScreen {
    constructor(
        stackForStart,
        stackForOption,
        scene
    ) {
        this.stackForStart = stackForStart;
        this.stackForOption = stackForOption;
        this.scene = scene;
    }
    moveStacks({ startStackY, optionStackY, currentPage }) {
        moveObj(this.stackForStart, new THREE.Vector3(this.stackForStart.position.x, startStackY, this.stackForStart.position.z), 0.1);
        this.stackForOption.forEach(optStack => {
            moveObj(optStack, new THREE.Vector3(optStack.position.x, optionStackY, optStack.position.z), 0.1);
        });
        this.scene.traverse(obj => {
            if(!(obj instanceof THREE.Mesh && !!obj?.name?.page)) return;
            if(obj?.name?.page === currentPage) {
                rotateObj(obj, new THREE.Vector3(0, Math.PI / 4, 0), 0.1);
            } else {
                rotateObj(obj, new THREE.Vector3(0, 0, 0), 0.1);
            }
        })
    }
}