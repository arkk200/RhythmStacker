import { Physics } from '@react-three/cannon';
import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import { OrbitControls } from '@react-three/drei';

import Stacks from './Stacks';
import './Game.scss';

function Game() {
    const [stackCount, setStackCount] = useState(0);
    const [isEnd, setIsEnd] = useState(false);

    return (
        <div id="game">
            <div id="score">
                {Math.max(stackCount - 1, 0)}
            </div>
            <Canvas
                style={{ height: '100vh' }}
                orthographic
                camera={{
                    zoom: 10,
                    position: [4, 4, 4]
                }}
            >
                {/* <OrbitControls /> */}
                <Physics>
                    <color attach="background" args={['#050505']} />
                    <ambientLight intensity={0.3} />
                    <spotLight position={[7, 10, 1]} angle={Math.PI / 2}/>
                    <Stacks stackCount={stackCount} setStackCount={setStackCount} isEnd={isEnd} setIsEnd={setIsEnd} />
                </Physics>
            </Canvas>
        </div>
    )
}

export default Game;