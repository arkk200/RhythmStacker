import { moveObj } from './utils.js';
import * as THREE from '/build/three.module.js';

export class GoScreen {
    constructor(
        stackForStart,
        stackForOption
    ) {
        this.stackForStart = stackForStart;
        this.stackForOption = stackForOption;
    }
    moveStacks({ startStackY, optionStackY }) {
        moveObj(this.stackForStart, new THREE.Vector3(this.stackForStart.position.x, startStackY, this.stackForStart.position.z), 0.1);
        this.stackForOption.forEach(optStack => {
            moveObj(optStack, new THREE.Vector3(optStack.position.x, optionStackY, optStack.position.z), 0.1);
        });
    }
}