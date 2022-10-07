import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import Stack from "./Stack/Stack";
import * as THREE from 'three';
// import { Physics, useBox } from "@react-three/cannon";
import StackPhysics from "./StackPhysics/StackPhysics";

let isEnd = false;

const returnStackOverLapData = (stacksLength, stackPos, topStack, previousStack, spawnDistX, spawnDistZ) => {
    if (
        (stacksLength % 2 === 0 ?
            topStack.width - Math.abs(previousStack.position.x - stackPos.x)
            : topStack.depth - Math.abs(previousStack.position.z - stackPos.z)) <= 0 || isEnd
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
            x: stacksLength % 2 === 0 ? stackPos.x - (stackPos.x - previousStack.position.x) / 2 : spawnDistX,
            z: stacksLength % 2 === 0 ? spawnDistZ : stackPos.z - (stackPos.z - previousStack.position.z) / 2,
        },
        width: stacksLength % 2 === 0 ? topStack.width - Math.abs(previousStack.position.x - stackPos.x) : topStack.width,
        depth: stacksLength % 2 === 0 ? topStack.depth : topStack.depth - Math.abs(previousStack.position.z - stackPos.z),
    }
}

const returnStackOverHangData = (stacksLength, stackOverLap, topStack, stackPos) => {
    if (isEnd) {
        return {
            position: {
                x: stackPos.x,
                z: stackPos.z,
            },
            width: topStack.width,
            depth: topStack.depth,
        }
    }
    return {
        position: {
            x: stacksLength % 2 === 0 ?
                (stackOverLap.position.x - (topStack.width) / 2 * Math.sign(topStack.position.x - stackOverLap.position.x))
                : stackOverLap.position.x,
            z: stacksLength % 2 === 0 ?
                stackOverLap.position.z
                : (stackOverLap.position.z - (topStack.depth) / 2 * Math.sign(topStack.position.z - stackOverLap.position.z))
        },
        width: stacksLength % 2 === 0 || stacksLength === 1 ? topStack.width - stackOverLap.width : topStack.width,
        depth: stacksLength % 2 === 0 ? topStack.depth : topStack.depth - stackOverLap.depth,
    }
}

const baseStack = {
    position: { x: 0, z: 0 },
    width: 3,
    depth: 3,
}



function Stacks({ stackCount, setIsEnd, setStackCount }) {

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

    const stackOverLaps = useRef([]); // 걸친 스택의 배열
    const stackOverHangs = useRef([]); // 걸치지 않은 스택의 배열
    const stackRef = useRef(); // 움직이는 스택

    const AddStacks = () => {
        stackOverLaps.current.push(
            returnStackOverLapData(
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
        newStack.current = returnStackOverLapData(
            stackCount,
            stackRef.current.position,
            topStack.current,
            previousStack.current,
            -10 + topStack.current.position.x,
            -10 + topStack.current.position.z
        );
        previousStack.current = topStack.current;
        topStack.current = stackOverLaps.current.at(-1);
        setIsEnd(isEnd);
    }
    if (stackCount !== 0) { // 처음 stackCount 값은 1임
        console.log('t');
        AddStacks();
    }

    // 카메라 관련 코드
    const { camera, scene } = useThree();

    const speed = useRef(10);

    useFrame((state, delta, f) => {
        // console.log(state, delta);
        if (stackCount < 1 || isEnd) return; // Base stack cannot be move
        stackRef.current.position.x += stackCount % 2 === 0 ? 0 : speed.current * delta;
        stackRef.current.position.z += stackCount % 2 === 0 ? speed.current * delta : 0;
        if (
            stackRef.current.position.x - topStack.current.position.x >= topStack.current.width ||
            stackRef.current.position.z - topStack.current.position.z >= topStack.current.depth
        ) {
            isEnd = true;
            setStackCount(current => current + 1);
            AddStacks();
        }
        camera.position.y = stackCount + 4;
        scene.traverse((obj) => {
            if (obj instanceof THREE.SpotLight) {
                obj.position.y = stackCount + 4;
                obj.target = stackRef.current;
            }
        });
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