import { Physics } from '@react-three/cannon';
import { Canvas } from '@react-three/fiber';
import { useRef, useState } from 'react';

import Stacks from './Stacks';
import './Game.scss';
function Game() {
    const [stackCount, setStackCount] = useState(0);
    const [isEnd, setIsEnd] = useState(false);
    const handleClick = () => {
        setStackCount(current => current + 1);
    }
    
    return (
        <div id="game">
            <div id="score">
                {Math.max(stackCount - 1 - isEnd, 0)}
            </div>
            <Canvas
                style={{ height: '100vh' }}
                onMouseDown={isEnd ? null : handleClick}
                orthographic
                camera={{
                    zoom: 50,
                    position: [4, 4, 4]
                }}
            >
                <Physics>
                    <color attach="background" args={['#050505']} />
                    <ambientLight intensity={0.3} />
                    <spotLight position={[7, 10, 1]} angle={Math.PI / 2}/>
                    <Stacks stackCount={stackCount} setIsEnd={setIsEnd} setStackCount={setStackCount} />
                </Physics>
            </Canvas>
        </div>
    )
}

export default Game;