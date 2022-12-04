import * as THREE from '/build/three.module.js';

class App {
    constructor() {
        this.status = '0';

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

        this.centerStack = new THREE.Mesh(
            new THREE.BoxGeometry(4, 10, 4),
            new THREE.MeshPhongMaterial({ color: 'white' })
        );
        this.centerStack.position.y = -7;
        this.centerStack.name = 'start';
        this.scene.add(this.centerStack);

        this.option1Stack = new THREE.Mesh(
            new THREE.BoxGeometry(3, 10, 3),
            new THREE.MeshPhongMaterial({ color: 'white' })
        );

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        window.addEventListener('resize', this.onResize.bind(this));
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
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
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        console.log(intersects);
    }

    moveObj(obj, pos, alp) {
        obj.position.lerp(new THREE.Vector3(...pos), alp);
    }

    animate() {
        this.reqAnimate = window.requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}

window.onload = () => {
    new App();
}