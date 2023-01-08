export type TypeVector3 = {
    x: number,
    y: number,
    z: number
};

export type VectorArray = [number, number, number]

export interface SteppedObject extends THREE.Object3D {
    step?: number
}

export interface SteppedMesh extends THREE.Mesh {
    step?: number
};

export interface StackAttribute {
    color?: string,
    name?: string,
    step?: number
}