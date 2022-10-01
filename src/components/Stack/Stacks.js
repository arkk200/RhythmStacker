import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

function Stacks({ stackCount }) {
    const stacks = useRef([{
        position: { x: 0, z: 0 },
        width: 3,
        depth: 3,
        direnction: null,
    }]);
    const builtStacks = useRef([]);
    const stackRef = useRef();
    if (stackCount !== 1) { // 먼저 연산한 후 렌더링 되게 함
        builtStacks.current.push({ // 연산한 값을 토대로 너비, 높이 정의
            position: { // 다음 스택의 위치
                x: stacks.current.at(-1).direnction === 'x' ? stacks.current.at(-1).position.x : -10,
                z: stacks.current.at(-1).direnction === 'x' ? -10 : stacks.current.at(-1).position.z
            },
            width: 3,
            depth: 3,
            direnction: stacks.current.at(-1).direnction === 'x' ? 'z' : 'x',
        });

        stacks.current.push(builtStacks.current.at(-1));
    }

    const speed = useRef(0.15);

    useFrame(() => {
        if (stacks.current.at(-1).direnction === null) return; // 베이스가 되는 스택은 움직일 필요가 없음
        stacks.current.at(-1).position.x += stacks.current.length % 2 === 1 ? 0 : speed.current;
        stacks.current.at(-1).position.z += stacks.current.length % 2 === 1 ? speed.current : 0;
        stackRef.current.position.x += stacks.current.length % 2 === 1 ? 0 : speed.current;
        stackRef.current.position.z += stacks.current.length % 2 === 1 ? speed.current : 0;
    });

    return (
        <>
            {
                stacks.current.map((stack, index) => (
                    <mesh position={[stack.position.x, index + 1, stack.position.z]} key={index} ref={stackRef} >
                        <boxGeometry args={[stack.width, 1, stack.depth]} />
                        <meshPhongMaterial color="orange" />
                    </mesh>
                ))
            }
        </>
    )
}

export default Stacks;