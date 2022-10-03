import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import Stack from "./Stack/Stack";
import * as THREE from 'three';

const returnStackOverLapData = (stacksLength, stackPos, topStack, previousStack, spawnDistX, spawnDistZ) => {
    return {
        position: {
            x: stacksLength % 2 === 0 ? stackPos.x - (stackPos.x - previousStack.position.x) / 2 : spawnDistX,
            z: stacksLength % 2 === 0 ? spawnDistZ : stackPos.z - (stackPos.z - previousStack.position.z) / 2,
        },
        width: stacksLength % 2 === 0 ? topStack.width - Math.abs(previousStack.position.x - stackPos.x) : topStack.width,
        depth: stacksLength % 2 === 0 ? topStack.depth : topStack.depth - Math.abs(previousStack.position.z - stackPos.z),
    }
}

const returnStackOverHangData = (stacksLength, stackOverLap, topStack) => {
    return {
        position: {
            x: stacksLength % 2 === 0 ? 
                (stackOverLap.position.x - (topStack.width) / 2 * Math.sign(topStack.position.x - stackOverLap.position.x))
                : stackOverLap.position.x,
            z: stacksLength % 2 === 0 ? 
                stackOverLap.position.z 
                : (stackOverLap.position.z - (topStack.depth) / 2 * Math.sign(topStack.position.z - stackOverLap.position.z))
        },
        width: stacksLength % 2 === 0 ? topStack.width - stackOverLap.width : topStack.width,
        depth: stacksLength % 2 === 0 ? topStack.depth : topStack.depth - stackOverLap.depth,
    }
}

function Stacks({ stackCount }) {

    // 스택 관련 코드
    const topStack = useRef({ // 클릭했을 때 새로나오는 스택의 앞에 있는 스택
        position: { x: 0, z: 0 },
        width: 3,
        depth: 3,
    });
    const previousStack = useRef({ // topStack보다 한 칸 앞에 있는 스택
        position: { x: 0, z: 0 },
        width: 3,
        depth: 3,
    });
    const newStack = useRef({ // topStack과 previousStack을 토대로 클릭했을 때 새로 나오는 스택의 위치, 크기를 가지는 스택
        position: { x: 0, z: 0 },
        width: 3,
        depth: 3,
    });

    const stackOverLaps = useRef([]); // 쌓인 스택의 걸린 부분들을 배열로 저장하는 ref
    const stackOverHangs = useRef([]); // 쌓인 스택의 걸치지 않은 부분들을 배열로 저장하는 ref
    const stackRef = useRef(); // 스택을 움직이게 만들어주는 ref

    if (stackCount !== 1) { // 처음 stackCount 값은 1임
        // console.log(stackCount, topStack.current.length);
        newStack.current = returnStackOverLapData(
            stackCount - 1,
            stackRef.current.position,
            topStack.current,
            previousStack.current,
            -10,
            -10
        );
        stackOverLaps.current.push(
            returnStackOverLapData(
                stackCount - 1,
                stackRef.current.position,
                topStack.current,
                previousStack.current,
                topStack.current.position.x,
                topStack.current.position.z
            )
        )
        stackOverHangs.current.push(
            returnStackOverHangData(
                stackCount - 1,
                stackOverLaps.current.at(-1),
                topStack.current
            )
        )
        previousStack.current = topStack.current;
        topStack.current = stackOverLaps.current.at(-1);
    }

    // 카메라 관련 코드
    const { camera, scene } = useThree();

    const speed = useRef(0.15);

    useFrame(() => {
        if (stackCount < 2) return; // 베이스가 되는 스택은 움직일 필요가 없음
        stackRef.current.position.x += stackCount % 2 === 1 ? 0 : speed.current;
        stackRef.current.position.z += stackCount % 2 === 1 ? speed.current : 0;
        camera.position.y = stackCount + 3;
        scene.traverse((obj) => {
            if (obj instanceof THREE.SpotLight) {
                obj.position.y = stackCount + 3;
                obj.target = stackRef.current;
            }
        });
        // console.log(`(${topStack.current[topStack.current.length - 1].position.x}, ${topStack.current[topStack.current.length - 1].position.z})`);
    });

    return (
        <>
            {   // 움직이는 Stack
                <Stack
                    position={[newStack.current.position.x, stackCount, newStack.current.position.z]} ref={stackRef}
                    args={[newStack.current.width, 1, newStack.current.depth]}
                    color="orange"
                />
            }
            {   // 걸친 Stack
                stackOverLaps.current.map((stack, index) => (
                    <Stack
                        position={[stack.position.x, index + 1, stack.position.z]} key={index}
                        args={[stack.width, 1, stack.depth]}
                        color="blue"
                    />
                ))
            }
            {   // 걸치지 못한 Stack
                stackOverHangs.current.map((stack, index) => (
                    <Stack
                        position={[stack.position.x, index + 1, stack.position.z]} key={index}
                        args={[stack.width, 1, stack.depth]}
                        color="green"
                    />
                ))
            }
        </>
    )
}

export default Stacks;