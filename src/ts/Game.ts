import * as THREE from 'three';
import noteJson from '../../dummyData/music.json' assert{type: "json"};
import { loopArray, musicList } from '../type';
import { Stack, getStack } from './utils';

export class Game {
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    cameraHeight: number;
    loopArray: loopArray;
    musicInfo: musicList;
    stackSize: number;
    stackVelocity: number;
    clock: THREE.Clock;
    stacks: Stack[];
    focus: boolean;
    baseStack: THREE.Mesh;
    reqAnimate: AnimationFrameProvider

    constructor(scene: THREE.Scene, camera: THREE.OrthographicCamera, loopArray: loopArray, musicInfo: musicList) {
        this.scene = scene;
        this.camera = camera;
        this.cameraHeight = this.camera.position.y;
        this.loopArray = loopArray;
        this.musicInfo = musicInfo;
        this.stackSize = 3;

        this.stackVelocity = this.stackSize * 3;
        this.clock = new THREE.Clock();
        this.stacks = [];
        this.focus = true;

        this.placeNotes();
        this.setEvents();
        this.pushAnimationInLoopArray();
    }

    startGame() {
        this.baseStack = getStack({ side: 3, height: 45 }, "red");
        this.scene.add()
    }

    placeNotes() {
        const { offset, notes } = noteJson;
        let basebpm: number;
        let prevNoteSecond = -(offset / 1000) * this.stackVelocity;
        notes.forEach((noteInfo, i) => {
            !!noteInfo.basebpm && (basebpm = noteInfo.basebpm);
            if (i % 2 === 0) {
                this.stacks.push(new Stack(this.scene, { width: this.stackSize, depth: this.stackSize}, [prevNoteSecond, i, 0], 'x'));
            } else {
                this.stacks.push(new Stack(this.scene, { width: this.stackSize, depth: this.stackSize}, [0, i, prevNoteSecond], 'z'));
            }
            prevNoteSecond += -(60 / basebpm) * (basebpm / noteInfo.bpm) * this.stackVelocity
        });
    }
    
    setEvents() {
        window.addEventListener('blur', this.onBlur.bind(this));
        window.addEventListener('keydown', this.onClick.bind(this));
    }

    onBlur() {
        if(!focus) return;
        this.focus = false;
        const pausedScreen = document.querySelector('.paused-screen');
        pausedScreen?.classList?.remove('hide');
        const pausedResume = pausedScreen?.querySelector('.paused__resume');
        pausedResume?.addEventListener('click', () => {
            this.focus = true;
            pausedScreen?.classList.add('hide');
        });
    }

    onClick(e: KeyboardEvent) {
        if (e.key === 'k') {
            if (this.stacks.length === 0) return;
            if (this.isLessThan(this.stackVelocity / 2)) return;
            if (this.isLessThan(this.stackSize)) {
                console.log('Miss');
            } else if (this.isLessThan(this.stackSize / 5 * 4)) {
                console.log('Bad');
            } else if (this.isLessThan(this.stackSize / 5 * 3)) {
                console.log('Okay');
            } else if (this.isLessThan(this.stackSize / 5 * 2)) {
                console.log('Good');
            } else if (this.isLessThan(this.stackSize / 5 * 1)) {
                console.log('Great');
            } else if (this.isLessThan(0)) {
                console.log('Perfect');
            }
            this.stacks.shift();
            this.cameraHeight++;
            this.baseStack.position.y++;
        }
    }

    isLessThan(judgeSize: number) {
        const { direction, stack: { position: { x, z } } } = this.stacks[0]

        return (direction === 'x' && Math.abs(x) > judgeSize) ||
            (direction === 'z' && Math.abs(z) > judgeSize);
    }

    pushAnimationInLoopArray() {
        this.loopArray.push((delta) => {
            if(!this.focus) return;
            if (this.cameraHeight - this.camera.position.y > 0.01) // camera animation
                this.camera.position.lerp(new THREE.Vector3(32, this.cameraHeight, 32), 0.1);
            this.stacks.forEach(stack => { // stack animation
                const { direction, stack: { position: { x, z } } } = stack;
                stack.move(this.stackVelocity * delta);
                if ((direction === 'x' && x >= this.stackSize) || (direction === 'z' && z >= this.stackSize)) {
                    console.log('Miss');
                    this.stacks.shift();
                }
            });
        })
    }
}