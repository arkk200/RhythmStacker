import * as THREE from '/build/three.module.js';
import { StackMesh, getTextTextureOnTop, GoScreen } from '../utils/utils.js';

class App {
    constructor() {
        this.status = '0';
        this.history = [{ step: 1, page: "Main" }];
        this.selectedObject = null;

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

        this.raycaster = new THREE.Raycaster();

        this.obj = new THREE.Object3D();
        this.obj.position.set(0, 0, 0);
        this.scene.add(this.obj);

        this.light = new THREE.SpotLight(0xffffff, 1.1, 0, Math.PI / 4);
        this.light.position.set(60, 50, 40);
        this.light.target = this.obj;
        this.scene.add(this.light);

        let materials = getTextTextureOnTop('Start', 'Bold 30px Arial', 100, 100, 'white');
        this.stackForStart = new StackMesh(3, 40, 3, materials, [0, -24, 0], { step: 2, page: "Option" });
        console.log(this.stackForStart);
        this.scene.add(this.stackForStart);

        // Stack that Options
        materials = getTextTextureOnTop('Famous', 'Bold 20px Arial', 100, 100, 'red');
        this.stackToGoFamousSongs = new StackMesh(2, 20, 2, materials, [-4, -22, 3], { step: 3, page: "FamousSongs" });
        this.scene.add(this.stackToGoFamousSongs);

        materials = getTextTextureOnTop('Favorites', 'Bold 20px Arial', 100, 100, 'orange');
        this.stackToGoFavoriteSongs = new StackMesh(2, 20, 2, materials, [1, -22, 4], { step: 3, page: "FavoriteSongs" });
        this.scene.add(this.stackToGoFavoriteSongs);

        materials = getTextTextureOnTop('All', 'Bold 20px Arial', 100, 100, 'yellow');
        this.stackToGoAllSongs = new StackMesh(2, 20, 2, materials, [4, -22, 1], { step: 3, page: "AllSongs" });
        this.scene.add(this.stackToGoAllSongs);

        materials = getTextTextureOnTop('Editor', 'Bold 20px Arial', 100, 100, 'green');
        this.stackToGoEditor = new StackMesh(2, 20, 2, materials, [3, -22, -4], { step: 3, page: "Editor" });
        this.scene.add(this.stackToGoEditor);

        this.goScreen = new GoScreen(
            this.stackForStart,
            [
                this.stackToGoFamousSongs,
                this.stackToGoFavoriteSongs,
                this.stackToGoAllSongs,
                this.stackToGoEditor
            ],
            this.scene
        )

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        window.addEventListener("resize", this.onResize.bind(this));
        window.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.animate.bind(this)();
    }

    onResize() {
        this.camera.left = window.innerWidth / -128;
        this.camera.right = window.innerWidth / 128;
        this.camera.top = window.innerHeight / 128;
        this.camera.bottom = window.innerHeight / -128;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseDown(e) {
        const mousePos = {
            x: (e.clientX / window.innerWidth) * 2 - 1,
            y: -(e.clientY / window.innerHeight) * 2 + 1
        };
        this.raycaster.setFromCamera(mousePos, this.camera);
        this.intersectObj = this.raycaster.intersectObjects(this.scene.children)[0];

        if (!this.intersectObj) return;
        if (this.history.some(obj => obj.step === this.intersectObj.object.name.step) &&
            this.history.at(-1).step !== this.intersectObj.object.name.step) return;
        const isStepSame = this.history.at(-1).step === this.intersectObj.object.name.step;
        const isPageSame = this.history.at(-1).page === this.intersectObj.object.name.page;
        if (isStepSame) {
            if (isPageSame) {
                this.history.pop();
            } else {
                this.history.at(-1).page = this.intersectObj.object.name.page;
            }
        } else {
            this.history.push({
                step: this.intersectObj.object.name.step,
                page: this.intersectObj.object.name.page
            });
        }
        this.currentPage = this.history.at(-1).page;
    }

    animate() {
        this.reqAnimate = window.requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
        switch (this.history.at(-1).step) {
            case 1:
                this.goScreen.moveStacks({
                    startStackY: -24,
                    optionStackY: -22,
                    currentPage: this.currentPage
                });
                break;
            case 2:
                this.goScreen.moveStacks({
                    startStackY: -14,
                    optionStackY: -14,
                    currentPage: this.currentPage
                });
                break;
            case 3:
                this.goScreen.moveStacks({
                    startStackY: -8,
                    optionStackY: -4,
                    currentPage: this.currentPage
                });
                break;
        }
    }
}

window.onload = () => {
    new App();
}