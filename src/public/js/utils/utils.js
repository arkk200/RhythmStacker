import * as THREE from '/build/three.module.js';
import { getTextTexture } from '../index/canvas/canvas.js';

/**
 * 
 * @param obj THREE.js 객체가 들어갈 곳
 * @param pos 객체가 이동할 위치
 * @param alp 그 위치로 몇% 만큼 이동할 수치 (0 ~ 1)
 */
export function moveObj(obj, pos, alp) {
    obj.position.set(...lerp(obj.position, pos, alp));
}

/**
 * 
 * @param obj THREE.js 객체가 들어갈 곳
 * @param rot 객체를 회전시킬 값
 * @param alp 그 값으로 몇%만큼 이동할 수치 (0 ~ 1)
 */
export function rotateObj(obj, rot, alp) {
    obj.rotation.set(...lerp(obj.rotation, rot, alp));
}

/**
 * 
 * @param a 첫번째 객체의 벡터
 * @param b 변하고자 하는 벡터
 * @param t 몇% 만큼 변화할 수치 (0 ~ 1)
 * @returns 그래서 나온 벡터
 */
export function lerp(a, b, t) {
    return [
        (b.x - a.x) * t + a.x,
        (b.y - a.y) * t + a.y,
        (b.z - a.z)* t + a.z
    ];
}

/**
 * Stack 메시를 생성하는 클래스
 */
export class StackMesh {
    /**
     * 
     * @param {Number} width 너비값
     * @param {Number} height 높이값
     * @param {Number} depth 깊이값
     * @param {} material 재질 ex) THREE.MeshBasicMaterial()
     * @param {} pos 위치 ex) [0, 0, 0]
     * @param {String} name 메시 이름
     * @returns {THREE.Mesh} 앞에 인자를 토대로 만들어진 BoxGeometry의 THREE.Mesh()
     */
    constructor(width, height, depth, material, pos = [0, 0, 0], name = null) {
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            material
        );
        this.mesh.position.set(...pos);
        name && (this.mesh.name = name);
        return this.mesh;
    }
}

/**
 * 움직이는 Stack 메시를 장면에 추가하고 객체를 반환하는 클래스
 */
export class Stack {
    /**
     * 
     * @param {THREE.Scene} scene THREE.Scene 클래스의 객체
     * @param {Number} width 너비값
     * @param {Number} depth 깊이값
     * @param {Number} index 쌓인 스택의 인덱스 (높이값으로 활용)
     * @param {Number} posX x좌표 위치
     * @param {Number} posZ z좌표 위치
     * @param {String} direction 움직일 방향 (x 또는 z)
     * @returns {Stack} Stack 클래스의 객체
     */
    constructor(scene, width, depth, index, posX, posZ, direction) {
        this.scene = scene;
        this.stack = new StackMesh(width, 1, depth, new THREE.MeshPhongMaterial({ color: 'white' }));
        this.stack.position.set(posX, index, posZ);
        this.direction = direction;
        this.scene.add(this.stack);
        return this;
    }
    /**
     * 스택을 움직이는 메서드
     * @param {Number} speed 스택을 정한 방향으로 이동할 값 (애니메이션에선 속도로 활용)
     */
    move(speed) {
        if(this.direction === 'z') {
            this.stack.position.z += speed;
        } else if (this.direction === 'x') {
            this.stack.position.x += speed;
        }
    }
    /**
     * 스택을 보이게 하는 메서드
     */
    show() {
        this.stack.visible = true;
    }
}

/**
 * 시작 페이지에 이동한 페이지마다 스택들을 움직일 클래스
 */
export class GoScreen {
    /**
     * 
     * @param {THREE.Mesh} stackForStart 시작 페이지에 시작 버튼 스택
     * @param {THREE.Mesh} stackForOption 시작 페이지에 시작 버튼을 눌렀을 때 나오는 옵션 스택
     * @param {THREE.Scene} scene THREE.Scene 객체
     */
    constructor(
        stackForStart,
        stackForOption,
        scene
    ) {
        this.stackForStart = stackForStart;
        this.stackForOption = stackForOption;
        this.scene = scene;
    }
    
    /**
     * 스택들을 움직이는 메서드
     * @param {Number} startStackY 시작 버튼 스택의 높이
     * @param {Number} optionStackY 옵션 스택들의 높이
     * @param {String} currentPage 페이지명
     */
    moveStacks({ startStackY, optionStackY, currentPage }) {
        moveObj(this.stackForStart, new THREE.Vector3(this.stackForStart.position.x, startStackY, this.stackForStart.position.z), 0.1);
        this.stackForOption.forEach(optStack => {
            moveObj(optStack, new THREE.Vector3(optStack.position.x, optionStackY, optStack.position.z), 0.1);
        });
        this.scene.traverse(obj => {
            if (!(obj instanceof THREE.Mesh && !!obj?.name?.page)) return;
            if (obj?.name?.page === currentPage) {
                rotateObj(obj, new THREE.Vector3(0, Math.PI / 6, 0), 0.1);
            } else {
                rotateObj(obj, new THREE.Vector3(0, 0, 0), 0.1);
            }
        })
    }
}

/**
 * 스택 메시의 꼭대기에 캔버스의 텍스트 텍스쳐를 입힌 Material을 반환하는 함수
 * @param {String} word 삽입할 단어
 * @param {String} font 글자 굵기, 폰트 사이즈, 스타일들을 문자열로 넣는 인자
 * @param {Number} width 캔버스의 너비
 * @param {Number} height 캔버스의 높이
 * @param {*} color 색상
 * @returns THREE.js에 Material이 6개 정의된 배열 각각 x+, x-, y+, y-, z+, z-에 위치함
 */
export function getTextTextureOnTop(word, font, width, height, color) {
    const texture = getTextTexture(word, font, width, height);
    return [
        new THREE.MeshPhongMaterial({ color }),
        new THREE.MeshPhongMaterial({ color }),
        new THREE.MeshPhongMaterial({ color, map: texture }),
        new THREE.MeshPhongMaterial({ color }),
        new THREE.MeshPhongMaterial({ color }),
        new THREE.MeshPhongMaterial({ color })
    ]
}