import * as THREE from '/build/three.module.js';
import { StackMesh } from '../StackMesh/StackMesh.js';
import { GoScreen } from '../utils/indexUtils.js';
import { objIndexOf } from '../utils/utils.js';

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

        this.light = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 4);
        this.light.position.set(40, 30, 30);
        this.light.target = this.obj;
        this.scene.add(this.light);

        this.stackOptGap = 2.8;
        this.stackOptY = -20;
        this.stacksSize = {
            startStack: [3.5, 40, 3.5],
            optionStack: [2, 20, 2]
        }
        this.stacksPos = {
            startStack: [0, -24, 0],
            famousSongsStack: [-this.stackOptGap, this.stackOptY, 2 * this.stackOptGap],
            favoriteSongsStack: [0, this.stackOptY, this.stackOptGap],
            allSongsStack: [this.stackOptGap, this.stackOptY, 0],
            editorStack: [2 * this.stackOptGap, this.stackOptY, -this.stackOptGap]
        }

        this.stackForStart = new StackMesh(3.5, 40, 3.5, { color: "white" });
        this.stackForStart.position.set(...this.stacksPos.startStack);
        this.stackForStart.name = {
            step: 2,
            page: "Option"
        };
        this.scene.add(this.stackForStart);

        // Stack that Options
        this.stackToGoFamousSongs = new StackMesh(2, 20, 2, { color: "red" });
        this.stackToGoFamousSongs.position.set(...this.stacksPos.famousSongsStack);
        this.stackToGoFamousSongs.name = {
            step: 3,
            page: "FamousSongs"
        };
        this.scene.add(this.stackToGoFamousSongs);

        this.stackToGoFavoriteSongs = new StackMesh(2, 20, 2, { color: "orange" });
        this.stackToGoFavoriteSongs.position.set(...this.stacksPos.favoriteSongsStack);
        this.stackToGoFavoriteSongs.name = {
            step: 3,
            page: "FavoriteSongs"
        };;
        this.scene.add(this.stackToGoFavoriteSongs);

        this.stackToGoAllSongs = new StackMesh(2, 20, 2, { color: "yellow" });
        this.stackToGoAllSongs.position.set(...this.stacksPos.allSongsStack);
        this.stackToGoAllSongs.name = {
            step: 3,
            page: "AllSongs"
        };
        this.scene.add(this.stackToGoAllSongs);

        this.stackToGoEditor = new StackMesh(2, 20, 2, { color: "green" });
        this.stackToGoEditor.position.set(...this.stacksPos.editorStack);
        this.stackToGoEditor.name = {
            step: 3,
            page: "Editor"
        };;
        this.scene.add(this.stackToGoEditor);

        this.goScreen = new GoScreen(
            this.stackForStart,
            this.stackToGoFamousSongs,
            this.stackToGoFavoriteSongs,
            this.stackToGoAllSongs,
            this.stackToGoEditor,
            this.stackOptGap
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
        if (objIndexOf(this.history, this.intersectObj.object, ["name", "step"]) !== -1 && objIndexOf(this.history, this.intersectObj.object, ["name", "step"]) !== this.history.length - 1) return;

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
        switch (this.history.at(-1).page) {
            case "Main":
                this.goScreen.goMain({
                    startStackY: -24,
                    optionStackY: -20
                });
                break;
            case "Option":
                this.goScreen.goOpts({
                    startStackY: -14,
                    optionStackY: -12
                });
                break;
            case "FamousSongs":
                this.goScreen.goFamous({
                    startStackY: -8,
                    optionStackY: -2
                });
                break;
            case "FavoriteSongs":
                this.goScreen.goFavorite({
                    startStackY: -8,
                    optionStackY: -2
                });
                break;
            case "AllSongs":
                this.goScreen.goAll({
                    startStackY: -8,
                    optionStackY: -2
                });
                break;
            case "Editor":
                this.goScreen.goEdit({
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