import * as THREE from '/build/three.module.js';

/**
 * 
 * @param obj THREE.js 객체가 들어갈 곳
 * @param pos 객체가 이동할 위치
 * @param alp 그 위치로 몇% 만큼 이동할 수치 (0 ~ 1);
 */
export function moveObj(obj, pos, alp) {
    obj.position.set(...lerp(obj.position, pos, alp));
}

export function rotateObj(obj, rot, alp) {
    obj.rotation.set(...lerp(obj.rotation, rot, alp));
}

export function lerp(a, b, t) {
    return [
        (b.x - a.x) * t + a.x,
        (b.y - a.y) * t + a.y,
        (b.z - a.z)* t + a.z
    ];
}