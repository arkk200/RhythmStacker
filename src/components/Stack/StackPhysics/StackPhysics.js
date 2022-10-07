import { useBox } from "@react-three/cannon";

const StackPhysics = ({ position, args, color, mass }) => {
    const [ref] = useBox(() => ({ mass, position, args }));
    return (
        <mesh ref={ref} >
            <boxGeometry args={args} />
            <meshPhongMaterial color={color} />
        </mesh>
    )
}

export default StackPhysics;