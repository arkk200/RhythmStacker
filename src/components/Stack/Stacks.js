import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import Stack from "./Stack/Stack";
import * as THREE from 'three';

function Stacks({ stackCount }) {

    // 스택 관련 코드
    const stacks = useRef([{
        position: { x: 0, z: 0 },
        width: 3,
        depth: 3,
    }]);
    const stackRef = useRef();
    if (stackCount !== 1) { // 처음 stackCount 값은 1임
        console.log(stacks.current[stacks.current.length - 1].position, stacks.current.length);
        stacks.current.push({ // 다음에 올 스택을 추가함
            position: {
                x: stacks.current.length === 1 ? -10 
                    : stacks.current.length % 2 === 0 ? stackRef.current.position.x - (stackRef.current.position.x - stacks.current[stacks.current.length - 2].position.x) / 2: -10,
                z: stacks.current.length === 1 ? 0 
                    : stacks.current.length % 2 === 0 ? -10 : stackRef.current.position.z - (stackRef.current.position.z - stacks.current[stacks.current.length - 2].position.z) / 2
            },
            width: stacks.current.length % 2 === 0 && stacks.current.length !== 1 ? 
                stacks.current[stacks.current.length - 1].width - Math.abs(stacks.current[stacks.current.length - 2].position.x - stackRef.current.position.x)
                : stacks.current[stacks.current.length - 1].width,
            depth: stacks.current.length % 2 === 1 && stacks.current.length !== 1 ? 
                stacks.current[stacks.current.length - 1].depth - Math.abs(stacks.current[stacks.current.length - 2].position.z - stackRef.current.position.z)
                : stacks.current[stacks.current.length - 1].depth,
        });
    }

    // 카메라 관련 코드
    const { camera, scene } = useThree();
    scene.traverse((obj) => { if (obj instanceof THREE.SpotLight) { console.log(obj) } });

    const speed = useRef(0.15);

    useFrame(() => {
        if (stacks.current.length < 2) return; // 베이스가 되는 스택은 움직일 필요가 없음
        stackRef.current.position.x += stacks.current.length % 2 === 1 ? 0 : speed.current;
        stackRef.current.position.z += stacks.current.length % 2 === 1 ? speed.current : 0;
        camera.position.y = stacks.current.length + 3;
        scene.traverse((obj) => {
            if (obj instanceof THREE.SpotLight) {
                obj.position.y = stacks.current.length + 3;
                obj.target = stackRef.current;
            }
        });
        // console.log(`(${stacks.current[stacks.current.length - 1].position.x}, ${stacks.current[stacks.current.length - 1].position.z})`);
    });

    return (
        <>
            {   // 움직이는 Stack
                stacks.current.map((stack, index) => (
                    <Stack
                        position={[stack.position.x, index + 1, stack.position.z]} key={index} ref={stackRef}
                        args={[stack.width, 1, stack.depth]}
                    />
                ))
            }
            {   // 걸친 Stack

            }
            {   // 걸치지 못한 Stack

            }
        </>
    )
}

export default Stacks;