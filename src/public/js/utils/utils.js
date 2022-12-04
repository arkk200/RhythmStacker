import * as THREE from '/build/three.module.js';

/**
 * 
 * @param obj THREE.js 객체가 들어갈 곳
 * @param pos 객체가 이동할 위치
 * @param alp 그 위치로 몇% 만큼 이동할 수치 (0 ~ 1);
 */
export function moveObj(obj, pos, alp) {
    obj.position.lerp(new THREE.Vector3(...pos), alp);
}