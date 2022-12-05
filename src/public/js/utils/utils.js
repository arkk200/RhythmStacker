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

export function lerp(pos1, pos2, t) {
    return [
        (pos2.x - pos1.x) * t + pos1.x,
        (pos2.y - pos1.y) * t + pos1.y,
        (pos2.z - pos1.z)* t + pos1.z
    ];
}

function recursiveReference(obj1, obj2, attribute) {
    for(let i = 0; i < attribute.length; i++) {
        if(!!obj1[attribute[i]])
            obj1 = obj1[attribute[i]];
        if(!!obj2[attribute[i]])
            obj2 = obj2[attribute[i]];
    }
    return ({
        obj1,
        obj2
    });
}

export function objIndexOf(objArr, obj, attribute) {
    let index = -1;
    objArr.forEach((searchObj, i) => {
        const { obj1, obj2 } = recursiveReference(searchObj, obj, attribute);
        if(index !== -1) return;
        if(obj1 === obj2) { index = i; }
    });
    return index;
}