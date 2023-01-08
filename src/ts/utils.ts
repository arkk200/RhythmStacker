import * as THREE from 'three';
import { StackAttribute, SteppedMesh, TypeVector3, VectorArray } from '../type';

export function lerp(a: TypeVector3, b: TypeVector3, t: number) {
    return [
        (b.x - a.x) * t + a.x,
        (b.y - a.y) * t + a.y,
        (b.z - a.z)* t + a.z
    ];
}

export function getStack({ side=1, height=1 }, { color="white", name="", step=null }: {color?: string, name?: string, step?: number | null}, position: VectorArray = [0, 0, 0]) {
    const mesh: SteppedMesh = new THREE.Mesh(
        new THREE.BoxGeometry(side, height, side),
        new THREE.MeshPhongMaterial({ color })
        // new THREE.MeshBasicMaterial({ color })
    );
    mesh.name = name;
    step && (mesh.step = step)
    mesh.position.set(...position);
    return mesh;
}

export function createOptionStack(attribute: StackAttribute, position: VectorArray) {
    return getStack({ side: 4, height: 20 }, { ...attribute }, position);
}

export class Stack {
    scene: THREE.Scene;
    stack: THREE.Mesh;
    direction: string
    constructor(scene: THREE.Scene, size: { width: number, depth: number }, pos: VectorArray, direction: string) {
        this.scene = scene;
        this.stack = new THREE.Mesh(
            new THREE.BoxGeometry(size.width, 1, size.depth),
            new THREE.MeshPhongMaterial({ color: 'white' })
        );
        this.stack.position.set(...pos);
        this.direction = direction;
        this.scene.add(this.stack);
        return this;
    }
    move(speed: number) {
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