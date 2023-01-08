export type TypeVector3 = {
    x: number,
    y: number,
    z: number
};

export type VectorArray = [number, number, number]

export interface PartObject extends THREE.Object3D {
    part?: string,
    step?: number
}

export interface PartMesh extends THREE.Mesh {
    part?: string,
    step?: number
};