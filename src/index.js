import * as THREE from '../node_modules/three/build/three.module.js';
// import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls';

import musicJson from './musics/Kevin-MacLeod_Silly-Fun_End-C.json' assert {type: 'json'} ;

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
let notes = musicJson.notes;

let curPos = { x: 0, z: 0 };
let curSiz = { wid: 10, dep: 10};

const setFirstStkParams = (firstStk) => {
    firstStk.name = "stacked";
    curSiz.wid -= Math.abs(firstStk.position.x - curPos.x);
    console.log(firstStk.position.x, curPos.x, curSiz.wid);
    firstStk.scale.set(curSiz.wid / 10, 1, 1);
    curPos.x = firstStk.position.x - (firstStk.position.x - curPos.x) / 2;
    firstStk.position.x = curPos.x;
}
const setStksParams = (stk) => {
    stk.scale.set(curSiz.wid / 10, 1, 1);
    stk.translateX(curPos.x);
}

const onClick = (e) => {
    if (e.code !== 'KeyK') return;
    if (!isStart) { 
        isStart = true;
        const audio = new Audio('./musics/Kevin-MacLeod_Silly-Fun_End-C.mp3');
        setTimeout(() => {
            audio.play();
        }, 650);
        return;
    }
    let foundFirstStk = false;
    scene.traverse(stk => {
        if (stk.name !== 'stack') return;
        if (!foundFirstStk) {
            setFirstStkParams(stk);
            foundFirstStk = true;
            return;
        }
        setStksParams(stk);
    });
}

window.addEventListener('keydown', onClick);






const stk = new THREE.Mesh(
    new THREE.BoxGeometry(10, 3, 10),
    new THREE.MeshPhongMaterial({ color: 'white' })
);
scene.add(stk);

const addStk = (height) => {
    const stk = new THREE.Mesh(
        new THREE.BoxGeometry(curSiz.wid, 3, curSiz.dep),
        new THREE.MeshPhongMaterial({ color: 'white' })
    );
    stk.name = "stack";
    stk.position.set(-10 + curPos.x, height, 0);
    scene.add(stk);
}








let time = 0;
let noteIndex = 0;
let curBPM = notes[0];
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if(!isStart) return;
    scene.traverse(obj => {
        if(obj.name !== 'stack') return;
        obj.translateX(0.25);
    })
    time += clock.getDelta();
    if(time >= 60 / curBPM) {
        time -= 60 / curBPM;
        curBPM = notes[++noteIndex];
        addStk(noteIndex * 3);
    }
}
animate();