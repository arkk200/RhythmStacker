import * as THREE from '../node_modules/three/build/three.module.js';
// import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls';
import musicJson from './musics/Kevin-MacLeod_Silly-Fun_End-C.json' assert { type: 'json' };

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
    window.innerWidth / -32,
    window.innerWidth / 32,
    window.innerHeight / 32,
    window.innerHeight / -32,
    -45,
    1000,
);
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);
// const helper = new THREE.CameraHelper( camera );
// scene.add(helper);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// const controls = new OrbitControls(camera, renderer.domElement);

const spotLight = new THREE.SpotLight(0xffffff, 0.6, 0, 170);
spotLight.position.set(120, 50, 100);
spotLight.lookAt(0, 0, 0);
scene.add(spotLight);

function onResize() {
    camera.left = window.innerWidth / -32;
    camera.right = window.innerWidth / 32;
    camera.top = window.innerHeight / 32;
    camera.bottom = window.innerHeight / -32;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize);






let isStart = false;
let isEnd = false;
let notes = musicJson.notes;

let curPos = { x: 0, z: 0 };
let curSiz = { wid: 10, dep: 10};

const setFirstStkParams = (firstStk) => {
    curSiz.wid -= Math.abs(firstStk.position.x - curPos.x);
    if(curSiz.wid <= 0) {
        isEnd = true;
        return;
    }
    curPos.x = firstStk.position.x - (firstStk.position.x - curPos.x) / 2;
    const stacked = new THREE.Mesh(
        new THREE.BoxGeometry(curSiz.wid, 3, 10),
        new THREE.MeshPhongMaterial({ color: 'white' })
    );
    stacked.position.set(curPos.x, firstStk.position.y, 0);
    scene.add(stacked);
    scene.remove(firstStk);
}
const setStksParams = (stk) => {
    const newStk = new THREE.Mesh(
        new THREE.BoxGeometry(curSiz.wid, 3, 10),
        new THREE.MeshPhongMaterial({ color: 'yellow' })
    );
    newStk.position.set(curPos.x + stk.position.x, stk.position.y, stk.position.z);
    newStk.name = stk.name;
    scene.remove(stk);
    // console.log('newStk name:', newStk.name);
    scene.add(newStk);
}

let stkdCnt = 0;

const onClick = (e) => {
    if (e.code !== 'KeyK' || isEnd) return;
    if (!isStart) { 
        isStart = true;
        const audio = new Audio('./musics/Kevin-MacLeod_Silly-Fun_End-C.mp3');
        setTimeout(() => {
            audio.play();
        }, 650);
        return;
    }
    scene.traverse(stk => {
        if (!stk.name.includes('stack')) return;
        console.log('stk name:', stk.name);
        if (stk.name === `stack-${stkdCnt}`) {
            setFirstStkParams(stk);
            return;
        }
        setStksParams(stk);
        console.log(stk.name);
    });
    stkdCnt++;
}

window.addEventListener('keydown', onClick);





const pivotPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 50),
    new THREE.MeshPhongMaterial({ color: 'red' })
);
pivotPlane.rotateY(Math.PI / 180 * 90);
pivotPlane.position.set(-20, 0, 3);
scene.add(pivotPlane);



const stk = new THREE.Mesh(
    new THREE.BoxGeometry(10, 3, 10),
    new THREE.MeshPhongMaterial({ color: 'white' })
);
scene.add(stk);











let time = 0;
let noteIndex = 0;
const speed = 20;
let curBPM = notes[0];
const clock = new THREE.Clock();

const addStk = (height) => {
    const stk = new THREE.Mesh(
        new THREE.BoxGeometry(curSiz.wid, 3, curSiz.dep),
        new THREE.MeshPhongMaterial({ color: 'white' })
    );
    stk.name = `stack-${noteIndex}`;
    stk.position.set(-20 + curPos.x, height, 0);
    scene.add(stk);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if(!isStart || isEnd) return;
    const delta = clock.getDelta();
    scene.traverse(obj => {
        if(!obj.name.includes('stack')) return;
        obj.translateX(delta * speed);
        if (obj.position.x - curPos.x >= curSiz.wid) isEnd = true;
    });
    time += delta;
    if(time >= 60 / curBPM) {
        time -= 60 / curBPM;
        curBPM = notes[noteIndex];
        addStk((noteIndex + 1) * 3);
        noteIndex++;
    }
}
animate();