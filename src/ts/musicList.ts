import gsap from 'gsap';
import * as THREE from 'three';

export class MusicList {
    musicObjectsGroup: THREE.Group;
    scene: THREE.Scene;
    tl: GSAPTimeline;
    setObjects(json: { musicList: { title: string; artist: string; }[]; }) {
        const musicList = json.musicList;
        this.musicObjectsGroup = new THREE.Group();
        this.musicObjectsGroup.name = "musicObjectsGroup";

        musicList.forEach((music, index) => {
            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(10, 4, 1),
                new THREE.MeshPhongMaterial({ color: new THREE.Color(`hsl(${index * 10}, 100%, 50%)`) })
            );
            mesh.position.set(27, -index * 5, -12);
            this.musicObjectsGroup.add(mesh);
        });
        this.musicObjectsGroup.position.set(0, 0, 0);
        this.scene.add(this.musicObjectsGroup);
        this.tl.to({}, { onUpdate: () => {
            this.musicObjectsGroup.children.forEach((mesh, index) => {
                gsap.to(mesh.position, { x: 14, duration: 1.4, delay: index*0.1 + 0.5, ease: "power4.out" });
            });
        }}, ">-1.2");
        this.setEvents.bind(this)();
    }

    setEvents() {
        window.addEventListener("wheel", this.onScroll.bind(this));
    }
    
    onScroll(e: WheelEvent) {
        const y = e.deltaY;
        this.musicObjectsGroup.position.y += y * 0.025;
    }

    removeObjects() {

    }
}