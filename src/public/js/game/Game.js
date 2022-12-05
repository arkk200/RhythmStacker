import * as THREE from '/build/three.module.js';
import noteJson from '/musics/Kevin-MacLeod_Silly-Fun_End-C.json' assert{type: "json"};
import { Stack } from '../utils/gameUtils.js';
import { StackMesh } from '../utils/meshUtils.js';

export class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.color = new THREE.Color(0, 0, 0);
        this.camera = new THREE.OrthographicCamera(
            window.innerWidth / -64,
            window.innerWidth / 64,
            window.innerHeight / 64,
            window.innerHeight / -64,
            0.1,
            1000
        );
        this.camera.position.set(32, 32, 32);
        this.cameraHeight = 32;
        this.camera.lookAt(0, 0, 0);

        this.stackSize = 3;
        this.obj = new THREE.Object3D();
        this.obj.position.set(0, 0, 0);
        this.scene.add(this.obj);

        this.light = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 4);
        this.light.position.set(40, 30, 30);
        this.light.target = this.obj;
        this.scene.add(this.light);

        this.baseStack = new StackMesh(this.stackSize, 40, this.stackSize, { color: 'red', opacity: 0.5, transparent: true });
        this.scene.add(this.baseStack);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.stackVelocity = this.stackSize * 3;
        this.clock = new THREE.Clock();
        this.delta = 0;
        this.stacks = [];
        this.focus = true;

        this.placeNotes();
        window.addEventListener('blur', this.onBlur.bind(this));
        window.addEventListener('resize', this.onResize.bind(this));
        window.addEventListener('keydown', this.onClick.bind(this));
        this.animate.bind(this)();
    }

    onBlur() {
        if(!focus) return;
        this.focus = false;
        const pausedScreen = document.querySelector('.paused-screen');
        pausedScreen.classList.remove('hide');
        const pausedResume = pausedScreen.querySelector('.paused__resume');
        pausedResume.addEventListener('click', () => {
            this.focus = true;
            pausedScreen.classList.add('hide');
        });
    }

    placeNotes() {
        const { offset, notes } = noteJson;
        let basebpm;
        let prevNoteSecond = -(offset / 1000) * this.stackVelocity;
        notes.forEach((info, i) => {
            !!info.basebpm && (basebpm = info.basebpm);
            !!i && (prevNoteSecond += -(60 / basebpm) * (basebpm / info.bpm) * this.stackVelocity);
            if (i % 2 === 0) {
                this.stacks.push(new Stack(this.scene, this.stackSize, this.stackSize, i, prevNoteSecond, 0, 'x'));
            } else {
                this.stacks.push(new Stack(this.scene, this.stackSize, this.stackSize, i, 0, prevNoteSecond, 'z'));
            }
        });
    }

    onResize() {
        this.camera.left = window.innerWidth / -64;
        this.camera.right = window.innerWidth / 64;
        this.camera.top = window.innerHeight / 64;
        this.camera.bottom = window.innerHeight / -64;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        this.reqAnimate = window.requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
        this.delta = this.clock.getDelta();
        if(!this.focus) return;
        if (this.cameraHeight - this.camera.position.y > 0.01) // camera animation
            this.camera.position.lerp(new THREE.Vector3(32, this.cameraHeight, 32), 0.1);
        this.stacks.forEach(stack => { // stack animation
            const { direction, stack: { position: { x, z } } } = stack;
            stack.move(this.stackVelocity * this.delta);
            if ((direction === 'x' && x >= this.stackSize) || (direction === 'z' && z >= this.stackSize)) {
                console.log('Miss');
                this.stacks.shift();
            }
        });
    }

    isLessThan(value) {
        const { direction, stack: { position: { x, z } } } = this.stacks[0]

        return (direction === 'x' && Math.abs(x) > value) ||
            (direction === 'z' && Math.abs(z) > value);
    }

    onClick(e) {
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
            this.light.position.y++;
            this.baseStack.position.y++;
        }
    }
}

window.onload = () => {
    new Game();
}