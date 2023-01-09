export type TypeVector3 = {
    x: number
    y: number
    z: number
};

export type VectorArray = [number, number, number];

export type loopArray = ((delta: number) => void)[];

export type musicList = { title: string; artist: string };

export interface StepObject extends THREE.Object3D {
    step?: number
};

export interface StepMesh extends THREE.Mesh {
    step?: number
};

export interface PartObject extends StepObject {
    part?: string
};

export interface PartMesh extends StepMesh {
    part?: string
};

export interface MusicObject extends StepObject {
    info?: {
        title: string,
        artist: string
    };
};

export interface MusicMesh extends StepMesh {
    info?: {
        title: string,
        artist: string
    };
};