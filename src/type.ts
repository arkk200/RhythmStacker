export type TypeVector3 = {
    x: number
    y: number
    z: number
};

export type VectorArray = [number, number, number]

export interface StepObject extends THREE.Object3D {
    step?: number
}

export interface PartObject extends StepObject {
    part?: string
}

export interface StepMesh extends THREE.Mesh {
    step?: number
}

export interface PartMesh extends StepMesh {
    part?: string
};