import * as THREE from 'three';
import noteJson from '../../dummyData/music.json' assert{type: "json"};
import { loopArray, musicList, VectorArray } from '../type';
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
    center: { x: number, z: number}

    constructor(scene: THREE.Scene, camera: THREE.OrthographicCamera, loopArray: loopArray, musicInfo: musicList) {
        console.log('start the game');
        this.scene = scene;
        this.camera = camera;
        this.cameraHeight = this.camera.position.y;
        this.loopArray = loopArray;
        this.musicInfo = musicInfo;
        this.stackSize = 3;
        this.center = { x: 8, z: -4 }

        this.stackVelocity = this.stackSize * 3;
        this.clock = new THREE.Clock();
        this.stacks = [];
        this.focus = true;

        this.setObjects();
        this.setEvents();
        this.pushAnimationInLoopArray();
    }
    
    setObjects() {
        this.baseStack = getStack({ side: 3, height: 45 }, "red", [this.center.x, 0, this.center.z]);
        this.scene.add(this.baseStack);
        const { offset, notes } = noteJson;
        let basebpm: number;
        let prevNoteSecond = -(offset / 1000) * this.stackVelocity;
        notes.forEach((noteInfo, i) => {
            !!noteInfo.basebpm && (basebpm = noteInfo.basebpm);
            if (i % 2 === 0) {
                this.stacks.push(new Stack(this.scene, { width: this.stackSize, depth: this.stackSize}, [this.center.x + prevNoteSecond, i, this.center.z], 'x'));
            } else {
                this.stacks.push(new Stack(this.scene, { width: this.stackSize, depth: this.stackSize}, [this.center.x + 0, i, prevNoteSecond + this.center.z], 'z'));
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
            if (this.isMoreThan(this.stackVelocity / 2)) return;
            if (this.isMoreThan(this.stackSize)) {
                console.log('Miss');
            } else if (this.isMoreThan(this.stackSize / 5 * 4)) {
                console.log('Bad');
            } else if (this.isMoreThan(this.stackSize / 5 * 3)) {
                console.log('Okay');
            } else if (this.isMoreThan(this.stackSize / 5 * 2)) {
                console.log('Good');
            } else if (this.isMoreThan(this.stackSize / 5 * 1)) {
                console.log('Great');
            } else if (this.isMoreThan(0)) {
                console.log('Perfect');
            }
            this.stacks.shift();
            this.cameraHeight++;
            this.baseStack.position.y++;
        }
    }

    isMoreThan(judgeSize: number) {
        const { direction, stack: { position: { x, z } } } = this.stacks[0]
        return (direction === 'x' && Math.abs(x - this.center.x) > judgeSize) ||
            (direction === 'z' && Math.abs(z - this.center.z) > judgeSize);
    }

    pushAnimationInLoopArray() {
        this.loopArray.push((delta) => {
            if(!this.focus) return;
            if (this.cameraHeight - this.camera.position.y > 0.01) // camera animation
                this.camera.position.lerp(new THREE.Vector3(38, this.cameraHeight, 26), 0.1);
            this.stacks.forEach(stack => { // stack animation
                const { direction, stack: { position: { x, z } } } = stack;
                stack.move(this.stackVelocity * delta);
                if ((direction === 'x' && x >= this.stackSize + this.center.x) || (direction === 'z' && z >= this.stackSize + this.center.z)) {
                    console.log('Miss');
                    this.stacks.shift();
                }
            });
        })
    }
}