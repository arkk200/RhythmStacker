import * as THREE from '../node_modules/three/build/three.module.js';
import { StackMesh } from './stackMesh.js';

export class Stack {
    constructor(scene, width, depth, index, posX, posZ, direction) {
        this.scene = scene;
        this.stack = new StackMesh(width, 1, depth, { color: 'white' });
        this.stack.position.set(posX, index, posZ);
        // this.stack.visible = false;
        this.direction = direction;
        this.scene.add(this.stack);
        return this;
    }
    move(speed) {
        if(this.direction === 'x') {
            this.stack.position.x += speed;
        } else if (this.direction === 'z') {
            this.stack.position.z += speed;
        }
    }
    show() {
        this.stack.visible = true;
    }
}