import { StackMesh } from './meshUtils.js';

export class Stack {
    constructor(scene, width, depth, index, posX, posZ, direction) {
        this.scene = scene;
        this.stack = new StackMesh(width, 1, depth, new THREE.MeshPhongMaterial({ color: 'white' }));
        this.stack.position.set(posX, index, posZ);
        this.direction = direction;
        this.scene.add(this.stack);
        return this;
    }
    move(speed) {
        if(this.direction === 'z') {
            this.stack.position.z += speed;
        } else if (this.direction === 'x') {
            this.stack.position.x += speed;
        }
    }
    show() {
        this.stack.visible = true;
    }
}