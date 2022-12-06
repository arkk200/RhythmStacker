import * as THREE from '/build/three.module.js';

export class StackMesh {
    constructor(width, height, depth, material, pos = [0, 0, 0], name = null) {
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            material
        );
        this.mesh.position.set(...pos);
        name && (this.mesh.name = name);
        return this.mesh;
    }
}