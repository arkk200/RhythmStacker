import gsap from 'gsap';
import * as THREE from 'three';
import { getIntersectObject } from './utils';
import { StepMesh, StepObject } from '../type';

export class MusicList {
    step: number;
    scene: THREE.Scene;
    camera: THREE.Camera;
    musicListGroup: THREE.Group;
    selectedMusicScreen: THREE.Mesh;

    constructor(scene: THREE.Scene, camera: THREE.Camera) {
        this.step = 0;
        this.scene = scene;
        this.camera = camera;
        this.setEvents();
    }

    setPage(tl: GSAPTimeline, json: { musicList: { title: string; artist: string; }[]; }) {
        const musicList = json.musicList;
        this.musicListGroup = new THREE.Group();
        this.musicListGroup.name = "musicListGroup";

        musicList.forEach((music, index) => {
            const mesh: StepMesh = new THREE.Mesh(
                new THREE.BoxGeometry(10, 4, 1),
                new THREE.MeshPhongMaterial({ color: new THREE.Color(`hsl(${index * 10}, 100%, 50%)`) })
            );
            mesh.position.set(27, -index * 5, -12);
            mesh.name = `music-${index}`;
            mesh.step = 1;
            this.musicListGroup.add(mesh);
        });
        this.musicListGroup.position.set(0, 0, 0);
        this.scene.add(this.musicListGroup);

        tl.to({}, { onUpdate: () => {
            this.musicListGroup.children.forEach((mesh, index) => {
                gsap.to(mesh.position, { x: 14, duration: 1.4, delay: index*0.1 + 0.5, ease: "power4.out" });
            });
        }}, ">-1.2");

        const selectedMusicMaterial = new THREE.MeshPhongMaterial({ color: "red" });
        this.selectedMusicScreen = new THREE.Mesh(
            new THREE.BoxGeometry(10, 10, 1),
            selectedMusicMaterial
        );
        this.selectedMusicScreen.rotateY(45 * Math.PI / 180);
        this.selectedMusicScreen.position.set(1, 0, -11);
        
        this.scene.add(this.selectedMusicScreen);
    }

    setEvents() {
        window.addEventListener("wheel", this.onScroll.bind(this));
        window.addEventListener("mousedown", this.onMouseDown.bind(this));
    }
    onScroll(e: WheelEvent) {
        if(!this?.musicListGroup) return;
        const y = e.deltaY;
        this.musicListGroup.position.y += y * 0.025;
    }
    onMouseDown(e: MouseEvent) { // MusicObjectGroup에 클릭만 감지
        const intersectObject: StepObject | undefined = getIntersectObject(e, this.scene, this.camera);
        if(!intersectObject) return;
        if(!this.musicListGroup?.getObjectByName(intersectObject.name)) return;

        if(intersectObject.step) {
            this.step = intersectObject.step;
        }

        switch (this.step) { // Go on MusicList Pages
            case 0:
                console.log('MusicList Home');
                break;
            case 1:
                gsap.to(intersectObject.position, { z: -11, duration: 1, ease: "power4.out" });
                const filteredStacks = this.musicListGroup.children.filter(stack => stack !== intersectObject);
                filteredStacks.forEach(stack => {
                    gsap.to(stack.position, { z: -12, duration: 1, ease: "power4.out" });
                });
                if(!(intersectObject instanceof THREE.Mesh)) return;
                // THREE.Material에 color 속성이 없는 버그로 <any> 사용
                (<any>this.selectedMusicScreen.material).color = intersectObject.material.color;
                console.log('Music Selected');
                break;
        }
    }

    removePage() {
        this.musicListGroup && this.scene.remove(this.musicListGroup);
        this.selectedMusicScreen && this.scene.remove(this.selectedMusicScreen);
    }
}