import * as THREE from '/build/three.module.js';
import { StackMesh } from '../utils/meshUtils.js';
import { GoScreen } from '../utils/indexUtils.js';

class App {
    constructor() {
        this.status = '0';
        this.history = [{ step: 1, page: "Main" }];

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

        this.stackForStart = new StackMesh(3.5, 40, 3.5, { color: "white" }, [0, -24, 0], { step: 2, page: "Option" });
        this.scene.add(this.stackForStart);

        // Stack that Options
        this.stackToGoFamousSongs = new StackMesh(2, 20, 2, { color: "red" }, [-3, -20, 6], { step: 3, page: "FamousSongs" });
        this.scene.add(this.stackToGoFamousSongs);

        this.stackToGoFavoriteSongs = new StackMesh(2, 20, 2, { color: "orange" }, [0, -20, 3], { step: 3, page: "FavoriteSongs" });
        this.scene.add(this.stackToGoFavoriteSongs);

        this.stackToGoAllSongs = new StackMesh(2, 20, 2, { color: "yellow" }, [3, -20, 0], { step: 3, page: "AllSongs" });
        this.scene.add(this.stackToGoAllSongs);

        this.stackToGoEditor = new StackMesh(2, 20, 2, { color: "green" }, [6, -20, -3], { step: 3, page: "Editor" });
        this.scene.add(this.stackToGoEditor);

        this.goScreen = new GoScreen(
            this.stackForStart,
            [
                this.stackToGoFamousSongs, 
                this.stackToGoFavoriteSongs, 
                this.stackToGoAllSongs, 
                this.stackToGoEditor
            ]
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
        if (isStepSame && isPageSame) {
            this.history.pop();
        } else if (isStepSame && !isPageSame) {
            this.history.at(-1).page = this.intersectObj.object.name.page;
        } else {
            this.history.push({
                step: this.intersectObj.object.name.step,
                page: this.intersectObj.object.name.page
            });
        }
    }

    animate() {
        this.reqAnimate = window.requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
        switch (this.history.at(-1).step) {
            case 1:
                this.goScreen.moveStacks({
                    startStackY: -24,
                    optionStackY: -20
                });
                break;
            case 2:
                this.goScreen.moveStacks({
                    startStackY: -14,
                    optionStackY: -12
                });
                break;
            case 3:
                this.goScreen.moveStacks({
                    startStackY: -8,
                    optionStackY: -2
                });
                break;
        }
    }
}

window.onload = () => {
    new App();
}