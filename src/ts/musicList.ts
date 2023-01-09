import gsap from 'gsap';
import * as THREE from 'three';
import { getIntersectObject } from './utils';
import { loopArray, musicList, MusicMesh, MusicObject, StepMesh } from '../type';
import { Game } from './Game';

export class MusicList {
    step: number;
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    musicListGroup: THREE.Group;
    selectedMusicScreen: StepMesh;
    game: Game;
    loopArray: loopArray;
    musicListPageGroup: THREE.Group;
    prevName: string

    constructor(scene: THREE.Scene, camera: THREE.OrthographicCamera, loopArray: loopArray) {
        this.step = 0;
        this.scene = scene;
        this.camera = camera;
        this.loopArray = loopArray;
        
        this.setEvents();
    }
    
    showPage(tl: GSAPTimeline, json: { musicList: musicList[]; }) {
        this.musicListPageGroup = new THREE.Group();

        const musicList = json.musicList;
        this.musicListGroup = new THREE.Group();
        this.musicListGroup.name = "musicListGroup";

        musicList.forEach((music, index) => {
            const mesh: MusicMesh = new THREE.Mesh(
                new THREE.BoxGeometry(10, 4, 1),
                new THREE.MeshPhongMaterial({ color: new THREE.Color(`hsl(${index * 10}, 100%, 50%)`) })
            );
            mesh.position.set(27, -index * 5, -12);
            mesh.name = `music-${index}`;
            mesh.info = music;
            mesh.step = 1;
            this.musicListGroup.add(mesh);
        });
        this.musicListGroup.position.set(0, 0, 0);
        this.musicListPageGroup.add(this.musicListGroup);

        tl.to({}, { onUpdate: () => {
            this.musicListGroup.children.forEach((mesh, index) => {
                gsap.to(mesh.position, { x: 14, duration: 1.4, delay: index*0.1 + 0.5, ease: "power4.out" });
            });
        }}, ">-1.2");

        this.selectedMusicScreen = new THREE.Mesh(
            new THREE.BoxGeometry(10, 10, 1),
            new THREE.MeshPhongMaterial({ color: "white" })
        );
        this.selectedMusicScreen.rotateY(45 * Math.PI / 180);
        this.selectedMusicScreen.position.set(1, 0, -11);
        this.selectedMusicScreen.step = 2;
        
        this.musicListPageGroup.add(this.selectedMusicScreen);
        this.scene.add(this.musicListPageGroup);
    }

    startGame(musicInfo: musicList) {
        this.game = new Game(this.scene, this.camera, this.loopArray, musicInfo);
    }

    setEvents() {
        window.addEventListener("wheel", this.onScroll.bind(this));
        window.addEventListener("mousedown", this.onMouseDown.bind(this));
    }
    onScroll(e: WheelEvent) {
        if(!this?.musicListPageGroup) return;
        const y = e.deltaY;
        this.musicListGroup.position.y += y * 0.025;
    }
    onMouseDown(e: MouseEvent) { // MusicObjectGroup에 클릭만 감지
        const intersectObject: MusicObject | undefined = getIntersectObject(e, this.scene, this.camera);
        if(!intersectObject) return;
        if(!this.musicListPageGroup?.getObjectByName(intersectObject.name)) return;

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

                (<typeof intersectObject.material>this.selectedMusicScreen.material).color = intersectObject.material.color;
                console.log('Music Selected');
                break;
            case 2:
                if(!this.musicListGroup.getObjectByName(intersectObject.name)) return;
                intersectObject?.info && this.startGame(intersectObject.info);
        }
        intersectObject?.name && (this.prevName = intersectObject.name)
    }

    hidePage() {
        this.musicListPageGroup && this.scene.remove(this.musicListPageGroup);
    }
}