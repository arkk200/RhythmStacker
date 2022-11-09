import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from 'three';

import Stack from "./Stack/Stack";
import StackPhysics from "./StackPhysics/StackPhysics";
import songInfo from '../../songInfo.json';
import { addStack, summonStack, isLand, isEven } from './functions';

function Stacks({ stackCount, setStackCount, isEnd, setIsEnd }) {
    // 스택 관련 코드
    const topStack = useRef( // 클릭했을 때 새로나오는 스택의 앞에 있는 스택
        summonStack(0, 0, 3, 3)
    );
    const previousStack = useRef( // topStack보다 한 칸 앞에 있는 스택
        summonStack(0, 0, 3, 3)
    );
    const newStack = useRef( // 클릭했을 때 새로 나오는 스택
        summonStack(0, 0, 3, 3)
    );

    const stackOverLaps = useRef([]);
    const stackOverHangs = useRef([]);
    const stackRef = useRef();

    useEffect(() => {
        const handleStackCount = e => {
            if(e.code === 'Space' || e.type === "mousedown") {
                if(isEven(stackCount) ?
                    isLand(previousStack.current.position.z - stackRef.current.position.z - topStack.current.depth)
                    : isLand(previousStack.current.position.x - stackRef.current.position.x - topStack.current.width)
                ) setStackCount(c => c+1)
                else setIsEnd(true)
            }
        }

        if(!isEnd) window.addEventListener('keydown', handleStackCount)

        return () => window.removeEventListener('keydown', handleStackCount)
    }, [setIsEnd, isEnd, setStackCount, stackCount]);

    if (stackCount !== 0) // 처음 stackCount 값은 1임
        addStack(isEnd, stackCount, stackOverLaps, stackOverHangs, newStack, stackRef, topStack, previousStack)

    const { camera, scene } = useThree();

    const speed = useRef(10);

    useFrame((_, delta) => {
        if (stackCount < 1 || isEnd) return;
        stackRef.current.position.x += isEven(stackCount) ? 0 : speed.current * delta; // 스택 애니메이션 구문
        stackRef.current.position.z += isEven(stackCount) ? speed.current * delta : 0;

        if (
            isLand(topStack.current.width - (stackRef.current.position.x - topStack.current.position.x)) ||
            isLand(topStack.current.depth - (stackRef.current.position.z - topStack.current.position.z))
        ) {
            setIsEnd(true);
        }

        camera.position.y = stackCount + 4;    
        scene.traverse((spotLight) => {
            if (spotLight instanceof THREE.SpotLight) {
                spotLight.position.y = stackCount + 4;
                spotLight.target = stackRef.current;
            }
        })
    });

    return (
        <>
            { // 움직이는 Stack
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