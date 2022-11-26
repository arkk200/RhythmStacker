import * as THREE from '../node_modules/three/build/three.module.js';
import noteJson from './musics/Kevin-MacLeod_Silly-Fun_End-C.json' assert{type: "json"};
import { Stack } from './stack.js';
import { StackMesh } from './stackMesh.js';

class App {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.color = new THREE.Color(0, 0, 0);
        this.camera = new THREE.OrthographicCamera(
            window.innerWidth / -128,
            window.innerWidth / 128,
            window.innerHeight / 128,
            window.innerHeight / -128,
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
        this.baseStack = new StackMesh(this.stackSize, 40, this.stackSize, {color: 'red', opacity : 0.5, transparent: true})
        this.scene.add(this.baseStack);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.speed = this.stackSize * 3;
        this.clock = new THREE.Clock();
        this.delta = 0;
        this.stacks = [];
        
        this.placeNotes();
        window.addEventListener('resize', this.resize.bind(this));
        window.requestAnimationFrame(this.animate.bind(this));
        window.addEventListener('keydown', this.onClick.bind(this));
    }
    placeNotes() {
        this.basebpm = noteJson.basebpm;
        this.delays = noteJson.delays;
        for(let i = 0; i < this.delays.length; i++) {
            if(i % 2 === 0) {
                this.stacks.push(new Stack(this.scene, this.stackSize, this.stackSize, i, -10 - (60 / this.basebpm) * this.delays[i] * this.speed, 0, 'x'));
            } else {
                this.stacks.push(new Stack(this.scene, this.stackSize, this.stackSize, i, 0, -10 - (60 / this.basebpm) * this.delays[i] * this.speed, 'z'));
            }
        }
        console.log(JSON.parse(JSON.stringify(this.stacks.map(stack => stack.stack.position))));
    }

    resize() {
        this.camera.left = window.innerWidth / -128,
        this.camera.right = window.innerWidth / 128,
        this.camera.top = window.innerHeight / 128,
        this.camera.bottom = window.innerHeight / -128,
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
        this.delta = this.clock.getDelta();
        this.cameraHeight - this.camera.position.y > 0.01 
        && this.camera.position.lerp(new THREE.Vector3(32, this.cameraHeight, 32), 0.1);
        this.stacks.forEach(stack => {
            stack.move(this.speed * this.delta);
            const {direction, stack: {position: {x, z}}} = stack;
            if((direction === 'x' && x >= this.stackSize) || (direction === 'z' && z >= this.stackSize)) {
                console.log('Miss');
                this.stacks.shift();
            }
        })
    }

    isLessThan(value) {
        const {direction, stack: {position: {x, z}}} = this.stacks[0]
        return (direction === 'x' && Math.abs(x) > value) ||
            (direction === 'z' && Math.abs(z) > value);
    }
    
    onClick(e) {
        if(e.key === 'k') {
            if(this.isLessThan(this.speed / 2)) return;
            if(this.isLessThan(this.stackSize)) {
                console.log('Miss');
            } else if(this.isLessThan(this.stackSize / 5 * 4)) {
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
    new App();
}