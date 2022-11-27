import * as THREE from '../node_modules/three/build/three.module.js';
import noteJson from './musics/Kevin-MacLeod_Silly-Fun_End-C.json' assert{type: "json"};
import { Stack } from './stack.js';
import { StackMesh } from './stackMesh.js';

class App {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.color = new THREE.Color(0, 0, 0);
        this.camera = new THREE.OrthographicCamera(
            window.innerWidth / -32,
            window.innerWidth / 32,
            window.innerHeight / 32,
            window.innerHeight / -32,
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
        this.baseStack = new StackMesh(this.stackSize, 40, this.stackSize, { color: 'red', opacity: 0.5, transparent: true })
        this.scene.add(this.baseStack);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.speed = this.stackSize * 3;
        this.clock = new THREE.Clock();
        this.delta = 0;
        this.stacks = [];
        this.focus = true;

        this.placeNotes();
        window.onblur = this.onBlur.bind(this);
        window.addEventListener('resize', this.onResize.bind(this));
        window.addEventListener('keydown', this.onClick.bind(this));
        this.animate.bind(this)();
    }

    onBlur() {
        const { onBlur } = this;

        if(!focus) return;
        console.log('blur');
        this.focus = false;
        const pausedScreen = document.querySelector('.paused-screen');
        pausedScreen.classList.remove('hide');
        const pausedResume = pausedScreen.querySelector('.paused__resume');
        pausedResume.addEventListener('click', () => {
            this.focus = true;
            pausedScreen.classList.add('hide');
            window.onblur = onBlur.bind(this);
        });
    }

    placeNotes() {
        const { basebpm, delays } = noteJson;
        const { stacks, scene, stackSize, speed } = this;

        for (let i = 0; i < delays.length; i++) {
            if (i % 2 === 0) {
                stacks.push(new Stack(scene, stackSize, stackSize, i, -10 - (60 / basebpm) * delays[i] * speed, 0, 'x'));
            } else {
                stacks.push(new Stack(scene, stackSize, stackSize, i, 0, -10 - (60 / basebpm) * delays[i] * speed, 'z'));
            }
        }
    }

    onResize() {
        const { camera, renderer } = this;

        console.log('resizing...');
        camera.left = window.innerWidth / -32;
        camera.right = window.innerWidth / 32;
        camera.top = window.innerHeight / 32;
        camera.bottom = window.innerHeight / -32;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        let { reqAnimate, focus, delta, cameraHeight } = this;
        const { renderer, scene, camera, clock, stacks, speed, stackSize, animate } = this;

        reqAnimate = window.requestAnimationFrame(animate.bind(this));
        renderer.render(scene, camera);
        delta = clock.getDelta();
        if(!focus) return;
        if (cameraHeight - camera.position.y > 0.01) // camera animation
            camera.position.lerp(new THREE.Vector3(32, cameraHeight, 32), 0.1);
        stacks.forEach(stack => { // stack animation
            const { direction, stack: { position: { x, z } } } = stack;
            stack.move(speed * delta);
            if ((direction === 'x' && x >= stackSize) || (direction === 'z' && z >= stackSize)) {
                console.log('Miss');
                stacks.shift();
            }
        });
    }

    isLessThan(value) {
        const { direction, stack: { position: { x, z } } } = this.stacks[0]

        return (direction === 'x' && Math.abs(x) > value) ||
            (direction === 'z' && Math.abs(z) > value);
    }

    onClick(e) {
        let { cameraHeight } = this;
        const { stacks, isLessThan, speed, stackSize, light, baseStack } = this;

        if (e.key === 'k') {
            if (stacks.length === 0) return;
            if (isLessThan(speed / 2)) return;
            if (isLessThan(stackSize)) {
                console.log('Miss');
            } else if (isLessThan(stackSize / 5 * 4)) {
                console.log('Bad');
            } else if (isLessThan(stackSize / 5 * 3)) {
                console.log('Okay');
            } else if (isLessThan(stackSize / 5 * 2)) {
                console.log('Good');
            } else if (isLessThan(stackSize / 5 * 1)) {
                console.log('Great');
            } else if (isLessThan(0)) {
                console.log('Perfect');
            }
            stacks.shift();
            cameraHeight++;
            light.position.y++;
            baseStack.position.y++;
        }
    }
}

window.onload = () => {
    new App();
}