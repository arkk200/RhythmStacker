import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import Stack from "./Stack/Stack";
import * as THREE from 'three';
import StackPhysics from "./StackPhysics/StackPhysics";

const isLand = num => (num <= 0)

const summonStack = (stackCount, stackRefPos, topStack, previousStack, spawnDistX, spawnDistZ) => {
    if (
        (stackCount % 2 === 0 ?
            isLand(topStack.width - (previousStack.position.x - stackRefPos.x))
            : isLand(topStack.depth - (previousStack.position.z - stackRefPos.z))) || isEnd
    ) {
        isEnd = true;
        return {
            position: {
                x: 0,
                z: 0,
            },
            width: 0,
            depth: 0,
        }
    }
    return {
        position: {
            x: stackCount % 2 === 0 ? stackRefPos.x - (stackRefPos.x - previousStack.position.x) / 2 : spawnDistX,
            z: stackCount % 2 === 0 ? spawnDistZ : stackRefPos.z - (stackRefPos.z - previousStack.position.z) / 2,
        },
        width: stackCount % 2 === 0 ? topStack.width - Math.abs(previousStack.position.x - stackRefPos.x) : topStack.width,
        depth: stackCount % 2 === 0 ? topStack.depth : topStack.depth - Math.abs(previousStack.position.z - stackRefPos.z),
    }
}
const returnStackOverHangData = (stackCount, stackOverLap, topStack, stackRefPos) => {
    if (isEnd) {
        return {
            position: {
                x: stackRefPos.x,
                z: stackRefPos.z,
            },
            width: topStack.width,
            depth: topStack.depth,
        }
    }
    return {
        position: {
            x: stackCount % 2 === 0 ?
                (stackOverLap.position.x - (topStack.width) / 2 * Math.sign(topStack.position.x - stackOverLap.position.x))
                : stackOverLap.position.x,
            z: stackCount % 2 === 0 ?
                stackOverLap.position.z
                : (stackOverLap.position.z - (topStack.depth) / 2 * Math.sign(topStack.position.z - stackOverLap.position.z))
        },
        width: stackCount % 2 === 0 || stackCount === 1 ? topStack.width - stackOverLap.width : topStack.width,
        depth: stackCount % 2 === 0 ? topStack.depth : topStack.depth - stackOverLap.depth,
    }
}



const baseStack = {
    position: { x: 0, z: 0 },
    width: 3,
    depth: 3,
}

let isEnd = false;

function Stacks() {
    const [stackCount, setStackCount] = useState(0);

    useEffect(() => {
        window.addEventListener('keydown', e => {
            if(e.code === 'Space')
                setStackCount(current => current + 1)
        })
        return window.removeEventListener('keydown', e => {
            if(e.code === 'Space')
                setStackCount(current => current + 1)
        })
    }, []);

    // 스택 관련 코드
    const topStack = useRef( // 클릭했을 때 새로나오는 스택의 앞에 있는 스택
        baseStack
    );
    const previousStack = useRef( // topStack보다 한 칸 앞에 있는 스택
        baseStack
    );
    const newStack = useRef( // 클릭했을 때 새로 나오는 스택
        baseStack
    );

    const stackOverLaps = useRef([]);
    const stackOverHangs = useRef([]);
    const stackRef = useRef();

    const AddStacks = () => {
        stackOverLaps.current.push(
            summonStack(
                stackCount,
                stackRef.current.position,
                topStack.current,
                previousStack.current,
                topStack.current.position.x,
                topStack.current.position.z
            )
        )
        stackOverHangs.current.push(
            returnStackOverHangData(
                stackCount,
                stackOverLaps.current.at(-1),
                topStack.current,
                stackRef.current.position
            )
        )
        newStack.current = summonStack(
            stackCount,
            stackRef.current.position,
            topStack.current,
            previousStack.current,
            -10 + topStack.current.position.x,
            -10 + topStack.current.position.z
        );
        console.log(newStack);
        previousStack.current = topStack.current;
        topStack.current = stackOverLaps.current.at(-1);
    }

    if (stackCount !== 0 && !isEnd) { // 처음 stackCount 값은 1임
        AddStacks();
    }

    // 카메라 관련 코드
    const { camera, scene } = useThree();

    const speed = useRef(10);

    useFrame((_, delta) => {
        if (stackCount < 1 || isEnd) return;
        stackRef.current.position.x += stackCount % 2 === 0 ? 0 : speed.current * delta;
        stackRef.current.position.z += stackCount % 2 === 0 ? speed.current * delta : 0;

        if ( // 종료구문
            isLand(topStack.current.width - (stackRef.current.position.x - topStack.current.position.x)) ||
            isLand(topStack.current.depth - (stackRef.current.position.z - topStack.current.position.z))
        ) {
            isEnd = true;
            AddStacks();
            setStackCount(c => c + 1);
        }

        camera.position.y = stackCount + 4; // 카메라 위치
        scene.traverse((obj) => { // 스포트라이트 위치
            if (obj instanceof THREE.SpotLight) {
                obj.position.y = stackCount + 4;
                obj.target = stackRef.current;
            }
        })
    });

    return (
        <>
            {   // 움직이는 Stack
                <Stack
                    position={[newStack.current.position.x, stackCount + 1, newStack.current.position.z]} ref={stackRef}
                    args={[newStack.current.width, 1, newStack.current.depth]}
                    color="orange"
                />
            }
            {   // 걸친 Stack
                stackOverLaps.current.map((stack, index) => (
                    <StackPhysics
                        position={[stack.position.x, index + 1, stack.position.z]} key={index} mass={0}
                        args={[stack.width, 1, stack.depth]}
                        color="orange"
                    />
                ))
            }
            {   // 걸치지 못한 Stack
                stackOverHangs.current.map((stack, index) => (
                    <StackPhysics
                        position={[stack.position.x, index + 1, stack.position.z]} key={index} mass={1}
                        args={[stack.width, 1, stack.depth]}
                        color="orange"
                    />
                ))
            }
        </>
    )
}

export default Stacks;