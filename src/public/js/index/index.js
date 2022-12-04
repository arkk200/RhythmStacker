import * as THREE from '/build/three.module.js';
import { StackMesh } from '../StackMesh/StackMesh.js';
import { moveObj } from '../utils/utils.js';
import { GoScreen } from '../utils/indexUtils.js';

class App {
    constructor() {
        this.status = '0';
        this.history = ["GoMainScreen"];

        this.scene = new THREE.Scene();
        this.scene.color = new THREE.Color(0, 0, 0);
        this.camera = new THREE.OrthographicCamera(
            window.innerWidth / -256,
            window.innerWidth / 256,
            window.innerHeight / 256,
            window.innerHeight / -256,
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

        this.stackForStart = new StackMesh(4, 10, 4, { color: "white" });
        this.stackForStart.position.y = -7;
        this.stackForStart.name = "GoOptionScreen";
        this.scene.add(this.stackForStart);

        // Stack to Show Song List
        this.stackToGoFamousSongs = new StackMesh(3, 10, 3, { color: "red" });
        this.stackToGoFamousSongs.position.set(-3, -12, 3);
        this.stackToGoFamousSongs.name = "GoFamousScreen";
        this.scene.add(this.stackToGoFamousSongs);

        this.stackToGoFavoriteSongs = new StackMesh(3, 10, 3, { color: "orange" });
        this.stackToGoFavoriteSongs.position.set(-3, -12, 3);
        this.stackToGoFavoriteSongs.name = "GoFavoriteScreen";
        this.scene.add(this.stackToGoFavoriteSongs);

        this.stackToGoAllSongs = new StackMesh(3, 10, 3, { color: "yellow" });
        this.stackToGoAllSongs.position.set(-3, -12, 3);
        this.stackToGoAllSongs.name = "GoAllScreen";
        this.scene.add(this.stackToGoAllSongs);

        this.stackToGoEditor = new StackMesh(3, 10, 3, { color: "green" });
        this.stackToGoEditor.position.set(-3, -12, 3);
        this.stackToGoEditor.name = "GoEditorScreen";
        this.scene.add(this.stackToGoEditor);

        this.goScreen = new GoScreen(
            this.stackForStart,
            this.stackToGoFamousSongs,
            this.stackToGoFavoriteSongs,
            this.stackToGoAllSongs,
            this.stackToGoEditor
        )

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        window.addEventListener("resize", this.onResize.bind(this));
        window.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.animate.bind(this)();
    }

    onResize() {
        this.camera.left = window.innerWidth / -256;
        this.camera.right = window.innerWidth / 256;
        this.camera.top = window.innerHeight / 256;
        this.camera.bottom = window.innerHeight / -256;
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
        if(!this.intersectObj) return;
        if (this.history.at(-1) === this.intersectObj.object.name) {
            this.history.pop();
        } else {
            this.history.push(this.intersectObj.object.name);
        }
    }

    animate() {
        this.reqAnimate = window.requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
        switch(this.history.at(-1)) {
            case "GoMainScreen":
                this.goScreen.goMain();
                break;
            case "GoOptionScreen":
                this.goScreen.goOpts();
                break;
            case "GoFamousScreen":
                this.goScreen.goFamous();
                break;
            case "GoFavoriteScreen":
                this.goScreen.goFavorite();
                break;
            case "GoAllScreen":
                this.goScreen.goAll();
                break;
            case "GoEditorScreen":
                this.goScreen.goEdit();
                break;
        }
    }
}

window.onload = () => {
    new App();
}