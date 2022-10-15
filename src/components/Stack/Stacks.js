import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';

import Stack from './Stack/Stack';

let time = 0;
let bpm = 120;

let isEnd = false;
let preDir = 'z';
const speed = 10;

function Stacks() {
    const [stkdArr, setStkdArr] = useState([
        {
            pos: { x: 0, z: 0 },
            wid: 3,
            dep: 3,
            dir: 'x'
        }
    ]);
    const [stksArr, setStksArr] = useState([]);

    const stksRef = useRef([]);


    useEffect(() => {
        const rmStkFrmStksArr = () => {
            console.log('배열 크기',stksArr.slice(1), stksRef.current);
            // stksRef.current = stksRef.current.slice(1);
            stksRef.current.shift()
            setStksArr(stksArr.slice(1));
        }
        if(!isEnd)
            window.addEventListener('click', rmStkFrmStksArr);
        return () => window.removeEventListener('click', rmStkFrmStksArr);
    }, [stksArr]);















    // 애니메이션 파트

    useFrame((_, dt) => {
        stksArr.forEach((stk, i) => {
            try {
                const curStkRef = stksRef.current[i];
                const curStkDir = stk.dir;
                curStkRef.position.x += curStkDir === 'x' ? dt * speed : 0;
                curStkRef.position.z += curStkDir === 'z' ? dt * speed : 0;
            } catch {
                console.log('null 감지', i, JSON.parse(JSON.stringify(stksArr)), JSON.parse(JSON.stringify(stksRef.current)));
            }
        })
















        time += dt;
        if(time >= 60/bpm) {
            time -= 60/bpm;
            preDir = preDir === 'x' ? 'z' : 'x';
            setStksArr([
                ...stksArr,
                {
                    pos: { 
                        x: preDir === 'x' ? 0 : -10, 
                        z: preDir === 'z' ? 0 : -10
                    },
                    wid: 3,
                    dep: 3,
                    dir: preDir === 'x' ? 'z' : 'x'
                }
            ])
            // preDir = stksArr.at(-1)?.dir;
            // console.log(stksArr);
        }







    })





















    return (
        <>
            {stksArr.map(((stk, i) => (
                <Stack 
                    key={i}
                    position={[stk.pos.x, i, stk.pos.z]}
                    geo={{
                        args: [stk.wid, 1, stk.dep]
                    }}
                    mat={{
                        color: "red",
                        transparent: true,
                        opacity: 0.5
                    }}
                    ref={el => (stksRef.current[i] = el)}
                />
            )))
                
            }
            {stkdArr.map((stkd, i) => (
                    <Stack
                        key={i}
                        position={[stkd.pos.x, i, stkd.pos.z]}
                        geo={{
                            args: [stkd.wid, 1, stkd.dep]
                        }}
                        mat={{
                            color: "white",
                            transparent: true,
                            opacity: 0.5
                        }}
                    />
            ))}
        </>
    )
}

export default Stacks;