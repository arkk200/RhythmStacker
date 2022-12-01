import * as THREE from '/build/three.module.js';

export class StackMesh {
    constructor(width, height, depth, matArgs) {
        return new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshPhongMaterial(matArgs)
        );
    }
}