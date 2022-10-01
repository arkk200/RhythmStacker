import { Canvas, useFrame } from '@react-three/fiber';
import { useState } from 'react';
import Stacks from './Stacks';
function Game() {
    const [stackCount, setStackCount] = useState(1);
    const handleClick = () => {
        setStackCount(current => current + 1);
    }
    return (
        <Canvas
            style={{ height: '100vh' }}
            onClick={handleClick}
            orthographic
            camera={{
                zoom: 50,
                position: [4, 4, 4]
            }}
        >
            <color attach="background" args={['#050505']} />
            <ambientLight intensity={0.3} />
            <spotLight position={[7, 10, 1]} />
            <Stacks stackCount={stackCount} />
        </Canvas>
    )
}

export default Game;