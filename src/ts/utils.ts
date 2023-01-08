import * as THREE from 'three';
import { PartMesh, TypeVector3, VectorArray } from '../type';

export function lerp(a: TypeVector3, b: TypeVector3, t: number) {
    return [
        (b.x - a.x) * t + a.x,
        (b.y - a.y) * t + a.y,
        (b.z - a.z)* t + a.z
    ];
}

export function getStack({ side=1, height=1 }, color: string ="white", position: VectorArray = [0, 0, 0]): THREE.Mesh {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(side, height, side),
        new THREE.MeshPhongMaterial({ color })
    );
    mesh.position.set(...position);
    return mesh;
}



export function getPartStack(size: { side: number, height: number }, { color="white", part="", step } : { color: string, part: string, step?: number }, position: VectorArray = [0, 0, 0]
): PartMesh {
    const mesh: PartMesh = getStack(size, color);
    mesh.part = part;
    step && (mesh.step = step)
    mesh.position.set(...position);
    return mesh;
}

export function createOptionPartStack(attribute: { color: string, part: string, step: number }, position: VectorArray): PartMesh {
    return getPartStack({ side: 4, height: 20 }, { ...attribute }, position);
}



export function getIntersectObject(e: MouseEvent, scene: THREE.Scene, camera: THREE.Camera): THREE.Object3D | undefined {
    const mouse = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
    };
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    return raycaster.intersectObjects(scene.children)[0]?.object;
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