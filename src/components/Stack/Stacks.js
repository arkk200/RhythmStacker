import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import Stack from "./Stack/Stack";

const stkArr = [
    {
        pos: {
            x: 0,
            z: 0
        },
        wid: 3,
        dep: 3,
        dir: null
    }
];

const stkdArr = [];

let time = 0;
const bpm = 120;

let prevDir = null;
const speed = 10;

function Stacks() {
    const stksRef = useRef([]);
    const [rendState, setRendState] = useState(false);

    useEffect(() => {
        window.addEventListener('click', () => {
            console.log(stkArr);
            stkArr.map((stk, i) => {
                console.log (stksRef.current, i);
                return {
                    pos: stksRef.current[i].position,
                    wid: stk.wid,
                    dep: stk.dep,
                    dir: stk.dir
                }
            });
            stkArr.shift();
        })
    })

    useFrame((_, dt) => {
        stksRef.current.forEach((stkRef, i) => {
            // console.log(prevDir)
            stkRef.position.x += stkArr[i].dir === 'x' ? speed * dt : 0;
            stkRef.position.z += stkArr[i].dir === 'z' ? speed * dt : 0;
        })
        time += dt;
        if(time >= 60/bpm) {
            time -= 60/bpm;
            prevDir = stkArr.at(-1).dir;
            stkArr.push({
                ...stkArr.at(-1),
                pos : {
                    x: prevDir === 'z' ? -10 : 0,
                    z: prevDir === 'z' ? 0 : -10
                }, 
                dir: prevDir === 'z' ? 'x' : 'z'
            });
            console.log(stkArr.length, prevDir);
            setRendState(c => !c);
        }
    });
    return (
        <>
        {stkArr.map((stk, i) => (
            <Stack 
                key={i} 
                position={[stk.pos.x, i, stk.pos.z]} 
                args={[stk.wid, 1, stk.dep]}
                ref={el => (stksRef.current[i] = el)} 
            />
        ))}
        {stkdArr.map((stkd, i) => (
            <Stack key={i} />
        ))}
        </>
    );
}

export default Stacks;