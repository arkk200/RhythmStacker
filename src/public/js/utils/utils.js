import * as THREE from '/build/three.module.js';

/**
 * 
 * @param obj THREE.js 객체가 들어갈 곳
 * @param pos 객체가 이동할 위치
 * @param alp 그 위치로 몇% 만큼 이동할 수치 (0 ~ 1);
 */
export function moveObj(obj, pos, alp) {
    obj.position.set(...lerp(obj.position.values, pos, alp));
}

export function lerp(pos1, pos2, t) {
    return [
        (pos2 - pos1.x) * t + pos1.x,
        (pos2.y - pos1.y) * t + pos2.y,
        (pos2.z - pos2.z) * t + pos1.z
    ];
}