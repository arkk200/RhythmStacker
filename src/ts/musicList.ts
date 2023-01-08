import gsap from 'gsap';
import * as THREE from 'three';
import { getIntersectObject } from './utils';

export class MusicList {
    musicObjectsGroup: THREE.Group;
    scene: THREE.Scene;
    camera: THREE.Camera;

    constructor(scene: THREE.Scene, camera: THREE.Camera) {
        this.scene = scene;
        this.camera = camera;
    }

    setPage(tl: GSAPTimeline, json: { musicList: { title: string; artist: string; }[]; }) {
        const musicList = json.musicList;
        this.musicObjectsGroup = new THREE.Group();
        this.musicObjectsGroup.name = "musicObjectsGroup";

        musicList.forEach((music, index) => {
            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(10, 4, 1),
                new THREE.MeshPhongMaterial({ color: new THREE.Color(`hsl(${index * 10}, 100%, 50%)`) })
            );
            mesh.position.set(27, -index * 5, -12);
            mesh.name = `music-${index}`;
            this.musicObjectsGroup.add(mesh);
        });
        this.musicObjectsGroup.position.set(0, 0, 0);
        this.scene.add(this.musicObjectsGroup);

        tl.to({}, { onUpdate: () => {
            this.musicObjectsGroup.children.forEach((mesh, index) => {
                gsap.to(mesh.position, { x: 14, duration: 1.4, delay: index*0.1 + 0.5, ease: "power4.out" });
            });
        }}, ">-1.2");

        this.setEvents();
    }

    setEvents() {
        console.log("Set wheel event");
        window.addEventListener("wheel", this.onScroll.bind(this));
        window.addEventListener("mousedown", this.onMouseDown.bind(this));
    }
    onScroll(e: WheelEvent) {
        console.log(this);
        const y = e.deltaY;
        this.musicObjectsGroup.position.y += y * 0.025;
    }
    onMouseDown(e: MouseEvent) {
        const intersectObject = getIntersectObject(e, this.scene, this.camera);
        if(intersectObject && this.musicObjectsGroup.getObjectByName(intersectObject.name)) {
            console.log('music');
        }
    }

    removePage(tl: GSAPTimeline) {
        const musicObjectsGroup = this.scene.getObjectByName("musicObjectsGroup");
        if(musicObjectsGroup) {
            tl = gsap.timeline();
            tl.to(this.musicObjectsGroup.position, { x: 1, duration: 1, ease: "power4.out" });
            tl.to({}, { onUpdate: () => { this.scene.remove(musicObjectsGroup) } });
        }
    }
}