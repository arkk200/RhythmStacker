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
    if (stackCount !== 1) { // 먼저 연산한 후 렌더링 되게 함
        stacks.current.push({ // 연산한 값을 토대로 너비, 높이 정의
            position: {
                x: stacks.current.length % 2 === 0 && stackCount > 2 ? stackRef.current.position.x : -10,
                z: stacks.current.length % 2 === 0 && stackCount > 2 ? -10 : stackRef.current.position.z
            },
            width: 3,
            depth: 3,
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
    });

    return (
        <>
            {
                stacks.current.map((stack, index) => (
                    <Stack
                        position={[stack.position.x, index + 1, stack.position.z]} key={index} ref={stackRef}
                        args={[stack.width, 1, stack.depth]}
                    />
                ))
            }
        </>
    )
}

export default Stacks;