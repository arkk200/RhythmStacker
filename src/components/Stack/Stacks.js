import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from 'three';

import Stack from "./Stack/Stack";
import StackPhysics from "./StackPhysics/StackPhysics";
import songInfo from '../../songInfo.json';

const isLand = num => (num <= 0)

// 걸친 스택, 새로운 스택 생성 함수
const summonStack = (stackCount, stackRefPos, topStack, previousStack, spawnDistX, spawnDistZ, isEnd) => {
    if(isEnd) {
        console.log('summonStack IsEnd Test', );
        return {
            position: { x: 0, z: 0 },
            width: 0,
            depth: 0,
        }
    }
    return {
        // stackCount가 홀수 == x축으로 이동하는 스택 생성, 짝수면 z축
        position: {
            x: stackCount % 2 === 0 ? stackRefPos.x - (stackRefPos.x - previousStack.position.x) / 2 : spawnDistX,
            z: stackCount % 2 === 0 ? spawnDistZ : stackRefPos.z - (stackRefPos.z - previousStack.position.z) / 2,
        },
        width: stackCount % 2 === 0 ? topStack.width - Math.abs(previousStack.position.x - stackRefPos.x) : topStack.width,
        depth: stackCount % 2 === 0 ? topStack.depth : topStack.depth - Math.abs(previousStack.position.z - stackRefPos.z),
    }
}
// 걸치지 못한 스택 생성
const summonStackOverHang = (stackCount, stackOverLap, topStack, stackRefPos, isEnd) => {
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

function Stacks({ stackCount, setStackCount, isEnd, setIsEnd }) {

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

    useEffect(() => {
        const handleStackCount = e => {
            if(e.code === 'Space' || e.type === "mousedown") {
                console.log('stackCount: ', stackCount);
                console.log('diff: ', stackCount % 2 === 1 ?
                `prevStackX: ${previousStack.current.position.x}, stackRefX: ${stackRef.current.position.x}, topStackWid: ${topStack.current.width}, Op: ${previousStack.current.position.x - stackRef.current.position.x - topStack.current.width}`
                : `prevStackZ: ${previousStack.current.position.z}, stackRefZ: ${stackRef.current.position.z}, topStackDep: ${topStack.current.depth}, Op: ${previousStack.current.position.z - stackRef.current.position.z - topStack.current.depth}`)
                if(
                    (stackCount % 2 === 1 ?
                    isLand(previousStack.current.position.x - stackRef.current.position.x - topStack.current.width)
                    : isLand(previousStack.current.position.z - stackRef.current.position.z - topStack.current.depth))
                ) {
                    setStackCount(c => c+1)
                }
                else {
                    console.log('setIsEnd Test');
                    setIsEnd(true)
                }
            }
        }

        if(!isEnd) {
            window.addEventListener('keydown', handleStackCount)
            window.addEventListener('mousedown', handleStackCount)
        }

        return () => {
            window.removeEventListener('keydown', handleStackCount)
            window.removeEventListener('mousedown', handleStackCount)
        }
    }, [setIsEnd, isEnd, setStackCount, stackCount]);

    const AddStack = () => {
        stackOverLaps.current.push(
            summonStack(
                stackCount,
                stackRef.current.position,
                topStack.current,
                previousStack.current,
                topStack.current.position.x,
                topStack.current.position.z,
                isEnd
            )
        )
        // 걸치지 못한 스택 생성
        stackOverHangs.current.push(
            summonStackOverHang(
                stackCount,
                stackOverLaps.current.at(-1),
                topStack.current,
                stackRef.current.position,
                isEnd
            )
        )
        newStack.current = summonStack(
            stackCount,
            stackRef.current.position,
            topStack.current,
            previousStack.current,
            -40 + topStack.current.position.x,
            -40 + topStack.current.position.z,
            isEnd
        );
        previousStack.current = topStack.current;
        topStack.current = stackOverLaps.current.at(-1);
        console.log('diff After Summon: ', stackCount % 2 === 0 ?
                `prevStackX: ${previousStack.current.position.x}, stackRefX: ${stackRef.current.position.x}, topStackWid: ${topStack.current.width}`
                : `prevStackZ: ${previousStack.current.position.z}, stackRefZ: ${stackRef.current.position.z}, topStackDep: ${topStack.current.depth}`)
    }

    if (stackCount !== 0) { // 처음 stackCount 값은 1임
        AddStack();
    }

    // 카메라 관련 코드
    const { camera, scene } = useThree();

    const speed = useRef(40);

    useFrame((_, delta) => {
        if (stackCount < 1 || isEnd) return;
        stackRef.current.position.x += stackCount % 2 === 0 ? 0 : speed.current * delta; // 스택 애니메이션 구문
        stackRef.current.position.z += stackCount % 2 === 0 ? speed.current * delta : 0;

        if ( // 종료구문
            isLand(topStack.current.width - (stackRef.current.position.x - topStack.current.position.x)) ||
            isLand(topStack.current.depth - (stackRef.current.position.z - topStack.current.position.z))
        ) {
            console.log('uF End Test');
            setIsEnd(true);
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
            { // 움직이는 Stack
                songInfo.noteInfos.map(noteInfo => (
                    <Stack
                        position={[newStack.current.position.x, stackCount + 1, newStack.current.position.z]} ref={stackRef}
                        args={[newStack.current.width, 1, newStack.current.depth]}
                        color="orange"
                    />
                ))
            }
            {   // 걸친 Stack
                stackOverLaps.current.map((stack, index) => (
                    <StackPhysics
                        position={[stack.position.x, index + 1, stack.position.z]} key={index} mass={0}
                        args={[stack.width, 1, stack.depth]}
                        color="blue"
                    />
                ))
            }
            {   // 걸치지 못한 Stack
                stackOverHangs.current.map((stack, index) => (
                    <StackPhysics
                        position={[stack.position.x, index + 1, stack.position.z]} key={index} mass={1}
                        args={[stack.width, 1, stack.depth]}
                        color="green"
                    />
                ))
            }
        </>
    )
}

export default Stacks;