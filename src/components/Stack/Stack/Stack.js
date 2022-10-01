const Stack = ({}) => {
    return (
        <mesh position={[0, 1, 0]}>
            <boxGeometry args={[3, 1, 3]} />
            <meshPhongMaterial color="orange" />
        </mesh>
    )
};

export default Stack;