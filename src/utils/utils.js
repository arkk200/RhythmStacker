import * as THREE from 'three';

export function lerp(a, b, t) {
    return [
        (b.x - a.x) * t + a.x,
        (b.y - a.y) * t + a.y,
        (b.z - a.z)* t + a.z
    ];
}

export function getStack({ side=1, height=1 }, { color="white", name="", step=null }, position=[0, 0, 0]) {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(side, height, side),
        new THREE.MeshPhongMaterial({ color })
    );
    mesh.name = name;
    mesh.step = step;
    mesh.position.set(...position);
    return mesh;
}

export function createOptionStack(attribute, position) {
    return getStack({ side: 4, height: 20 }, { ...attribute }, position);
}

export class Stack {
    constructor(scene, width, depth, posX, posY, posZ, direction) {
        this.scene = scene;
        this.stack = new THREE.Mesh(
            new THREE.BoxGeometry(width, 1, depth),
            new THREE.MeshPhongMaterial({ color: 'white' })
        );
        this.stack.position.set(posX, posY, posZ);
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