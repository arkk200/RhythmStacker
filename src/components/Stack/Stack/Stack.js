import { forwardRef } from "react";

const Stack = forwardRef(({ position, args }, ref) => {
    return (
        <mesh position={position} ref={ref} >
            <boxGeometry args={args} />
            <meshPhongMaterial color="orange" />
        </mesh>
    )
})

export default Stack;