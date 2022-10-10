import { Physics } from '@react-three/cannon';
import { Canvas } from '@react-three/fiber';

import Stacks from './Stacks';
import './Game.scss';
import { OrbitControls } from '@react-three/drei';
function Game() {
    
    return (
        <div id="game">
            <div id="score">
                {}
            </div>
            <Canvas
                style={{ height: '100vh' }}
                orthographic
                camera={{
                    zoom: 50,
                    position: [4, 4, 4]
                }}
            >
                <OrbitControls />
                <Physics>
                    <color attach="background" args={['#050505']} />
                    <ambientLight intensity={0.3} />
                    <spotLight position={[7, 10, 1]} angle={Math.PI / 2}/>
                    <Stacks />
                </Physics>
            </Canvas>
        </div>
    )
}

export default Game;